import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(__dirname, "public");
const dataDir = join(__dirname, "data");
const dbPath = join(dataDir, "db.json");
const avatarUploadDir = join(publicDir, "uploads", "avatars");
const PORT = Number(process.env.PORT || 4173);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const MAX_AVATAR_BYTES = 1024 * 1024 * 2;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

const avatarMimeExtensions = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

let db = {
  users: [],
  sessions: [],
  articles: [],
  likes: [],
  notifications: [],
  mailboxMessages: []
};

await ensureDatabase();

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", getBaseUrl(req));

    if (req.method === "GET" && url.pathname.startsWith("/public/")) {
      return serveStatic(req, res, url.pathname.replace("/public/", ""));
    }

    if (req.method === "GET" && url.pathname === "/") {
      return sendHtml(res, renderShell({
        title: "Thinkwell - Insightful Article",
        description: "A secure place to draft, publish, and read thoughtful articles.",
        image: `${getBaseUrl(req)}/public/share-default.svg`,
        path: "/"
      }));
    }

    if (req.method === "GET" && url.pathname.startsWith("/article/")) {
      const slug = decodeURIComponent(url.pathname.replace("/article/", ""));
      const article = db.articles.find((item) => item.slug === slug && item.status === "published");
      if (!article) return sendHtml(res, renderNotFound(), 404);
      return sendHtml(res, renderShell({
        title: article.title,
        description: excerpt(article.body, 150),
        image: article.coverImage || `${getBaseUrl(req)}/public/share-default.svg`,
        path: url.pathname
      }));
    }

    if (req.method === "GET" && (["/write", "/login", "/signup", "/me", "/profile", "/notifications", "/mailbox"].includes(url.pathname) || url.pathname.startsWith("/account/"))) {
      return sendHtml(res, renderShell({
        title: "Thinkwell - Insightful Article",
        description: "Write and publish insightful articles.",
        image: `${getBaseUrl(req)}/public/share-default.svg`,
        path: url.pathname
      }));
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(req, res, url);
    }

    return sendHtml(res, renderNotFound(), 404);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: "Something went wrong." });
  }
});

server.listen(PORT, () => {
  console.log(`Thinkwell running at http://localhost:${PORT}`);
});

async function ensureDatabase() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(avatarUploadDir, { recursive: true });
  if (existsSync(dbPath)) {
    const stored = JSON.parse(await readFile(dbPath, "utf8"));
    db = {
      users: Array.isArray(stored.users) ? stored.users : [],
      sessions: Array.isArray(stored.sessions) ? stored.sessions : [],
      articles: Array.isArray(stored.articles) ? stored.articles : [],
      likes: Array.isArray(stored.likes) ? stored.likes : [],
      notifications: Array.isArray(stored.notifications) ? stored.notifications : [],
      mailboxMessages: Array.isArray(stored.mailboxMessages) ? stored.mailboxMessages : []
    };
    db.users = db.users.map((item) => ({ avatarUrl: "", subscriptions: [], ...item }));
    ensureSeedAccount();
    db.articles = db.articles.map((item) => ({ authorAvatar: "", ...item }));
    db.sessions = db.sessions.filter((session) => session.expiresAt > Date.now());
    await saveDb();
    return;
  }

  ensureSeedAccount();
  db.articles.push({
    id: randomId(),
    authorId: "seed",
    authorName: "mora",
    authorAvatar: "",
    title: "What Makes a Thought Worth Publishing",
    slug: "what-makes-a-thought-worth-publishing",
    coverImage: "",
    body: "A useful article does not need to be loud. It needs a clear observation, a reason someone should care, and enough honesty to make the reader pause. This platform is built around that small discipline: capture the thought, shape it into an article, and publish it when it is ready.",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  });
  await saveDb();
}

async function saveDb() {
  await writeFile(dbPath, JSON.stringify(db, null, 2) + "\n", "utf8");
}

async function handleApi(req, res, url) {
  const user = getCurrentUser(req);

  if (req.method === "GET" && url.pathname === "/api/me") {
    return sendJson(res, 200, { user: publicUser(user) });
  }

  if (req.method === "PUT" && url.pathname === "/api/me") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const body = isMultipart(req) ? await readMultipartForm(req) : await readJson(req);
    const name = cleanText(body.name, 40);
    if (!name) return sendJson(res, 400, { error: "Use a name." });
    let avatarUrl = user.avatarUrl || "";
    try {
      avatarUrl = await saveAvatarUpload(body.avatarFile) || avatarUrl;
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
    user.name = name;
    user.avatarUrl = avatarUrl;
    for (const article of db.articles.filter((item) => item.authorId === user.id)) {
      article.authorName = user.name;
      article.authorAvatar = user.avatarUrl || "";
    }
    for (const like of db.likes.filter((item) => item.userId === user.id)) {
      like.userName = user.name;
      like.userAvatar = user.avatarUrl || "";
    }
    await saveDb();
    return sendJson(res, 200, { user: publicUser(user) });
  }

  if (req.method === "POST" && url.pathname === "/api/signup") {
    const body = isMultipart(req) ? await readMultipartForm(req) : await readJson(req);
    const name = cleanText(body.name, 40);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    let avatarUrl = "";
    try {
      avatarUrl = await saveAvatarUpload(body.avatarFile);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
    if (!name || !isEmail(email) || password.length < 8) {
      return sendJson(res, 400, { error: "Use a name, valid email, and password with at least 8 characters." });
    }
    if (db.users.some((item) => item.email === email)) {
      return sendJson(res, 409, { error: "That email already has an account." });
    }
    const newUser = {
      id: randomId(),
      name,
      email,
      avatarUrl,
      subscriptions: [],
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    const session = createSession(newUser.id);
    await saveDb();
    setSessionCookie(res, session.token);
    return sendJson(res, 201, { user: publicUser(newUser) });
  }

  if (req.method === "POST" && url.pathname === "/api/login") {
    const body = await readJson(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const found = db.users.find((item) => item.email === email);
    if (!found || !verifyPassword(password, found.passwordHash)) {
      return sendJson(res, 401, { error: "Email or password is incorrect." });
    }
    const session = createSession(found.id);
    await saveDb();
    setSessionCookie(res, session.token);
    return sendJson(res, 200, { user: publicUser(found) });
  }

  if (req.method === "POST" && url.pathname === "/api/logout") {
    const token = getCookie(req, "tw_session");
    db.sessions = db.sessions.filter((session) => session.token !== token);
    await saveDb();
    res.setHeader("Set-Cookie", "tw_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/articles") {
    const articles = db.articles
      .filter((article) => article.status === "published")
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .map((article) => publicArticle(article, { user }));
    return sendJson(res, 200, { articles });
  }

  if (req.method === "GET" && url.pathname === "/api/articles/mine") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const articles = db.articles
      .filter((article) => article.authorId === user.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map((article) => publicArticle(article, { includeBody: true, user }));
    return sendJson(res, 200, { articles });
  }

  if (req.method === "GET" && url.pathname === "/api/notifications") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const notifications = db.notifications
      .filter((notification) => notification.userId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 40)
      .map(publicNotification);
    return sendJson(res, 200, {
      notifications,
      unreadCount: notifications.filter((notification) => !notification.readAt).length
    });
  }

  if (req.method === "POST" && url.pathname === "/api/notifications/read") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const now = new Date().toISOString();
    for (const notification of db.notifications.filter((item) => item.userId === user.id && !item.readAt)) {
      notification.readAt = now;
    }
    await saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/mailbox") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const messages = db.mailboxMessages
      .filter((message) => message.recipientId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50)
      .map(publicMailboxMessage);
    return sendJson(res, 200, { messages });
  }

  if (req.method === "POST" && url.pathname === "/api/mailbox") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const body = await readJson(req);
    const message = cleanLongText(body.message, 4000);
    if (!message) return sendJson(res, 400, { error: "Write a message first." });
    const recipient = findMorfyAccount();
    if (!recipient) return sendJson(res, 404, { error: "Morfy account was not found." });
    db.mailboxMessages.push({
      id: randomId(),
      recipientId: recipient.id,
      recipientName: recipient.name,
      senderId: user.id,
      senderName: user.name,
      senderEmail: user.email,
      message,
      createdAt: new Date().toISOString(),
      readAt: null
    });
    addNotification({
      userId: recipient.id,
      type: "mailbox_suggestion",
      title: "Mailbox suggestion",
      targetUrl: "/mailbox",
      actor: user
    });
    await saveDb();
    return sendJson(res, 201, { ok: true });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/users/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/users/", ""));
    const account = db.users.find((item) => item.id === id);
    if (!account) return sendJson(res, 404, { error: "Account not found." });
    return sendJson(res, 200, publicAccount(account, user));
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/users/") && url.pathname.endsWith("/follow")) {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const targetId = decodeURIComponent(url.pathname.replace("/api/users/", "").replace("/follow", ""));
    const target = db.users.find((item) => item.id === targetId);
    if (!target) return sendJson(res, 404, { error: "Account not found." });
    if (target.id === user.id) return sendJson(res, 400, { error: "You cannot follow yourself." });
    const subscriptions = normalizeSubscriptions(user);
    const alreadyFollowing = subscriptions.includes(target.id);
    if (!alreadyFollowing) {
      subscriptions.push(target.id);
      user.subscriptions = subscriptions;
      addNotification({
        userId: target.id,
        type: "account_followed",
        title: "New follower",
        targetUrl: "/account/" + user.id,
        actor: user
      });
    }
    await saveDb();
    return sendJson(res, 200, { user: publicUser(user), following: true });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/articles/") && url.pathname.endsWith("/analytics")) {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const id = decodeURIComponent(url.pathname.replace("/api/articles/", "").replace("/analytics", ""));
    const article = db.articles.find((item) => item.id === id && item.authorId === user.id);
    if (!article) return sendJson(res, 404, { error: "Article not found." });
    const likes = db.likes
      .filter((like) => like.articleId === article.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const byDate = likes.reduce((acc, like) => {
      const day = like.createdAt.slice(0, 10);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    return sendJson(res, 200, {
      article: publicArticle(article, { user }),
      likeCount: likes.length,
      likesByDate: Object.entries(byDate).map(([date, count]) => ({ date, count })),
      likedBy: likes.map((like) => ({
        userId: like.userId,
        name: like.userName,
        avatarUrl: like.userAvatar,
        createdAt: like.createdAt
      }))
    });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/articles/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/articles/", ""));
    const article = db.articles.find((item) => item.slug === slug);
    if (!article || (article.status !== "published" && article.authorId !== user?.id)) {
      return sendJson(res, 404, { error: "Article not found." });
    }
    return sendJson(res, 200, { article: publicArticle(article, { includeBody: true, user }) });
  }

  if (req.method === "POST" && url.pathname === "/api/translate") {
    const body = await readJson(req);
    const title = cleanLongText(body.title, 500);
    const articleBody = cleanLongText(body.body, 24000);
    const target = body.target === "zh" ? "zh" : body.target === "en" ? "en" : "";
    if (!title && !articleBody) return sendJson(res, 400, { error: "Nothing to translate." });
    if (!target) return sendJson(res, 400, { error: "Choose a translation language." });
    try {
      const translated = await translateArticleText({ title, body: articleBody, target });
      return sendJson(res, 200, translated);
    } catch (error) {
      return sendJson(res, 502, { error: error.message || "Translation failed." });
    }
  }

  if (req.method === "POST" && url.pathname === "/api/articles") {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const body = await readJson(req);
    const title = cleanText(body.title, 110);
    const articleBody = cleanLongText(body.body, 24000);
    const coverImage = cleanUrl(body.coverImage);
    const status = body.status === "published" ? "published" : "draft";
    if (!title || !articleBody) {
      return sendJson(res, 400, { error: "Title and article body are required." });
    }
    const now = new Date().toISOString();
    const article = {
      id: randomId(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatarUrl || "",
      title,
      slug: uniqueSlug(title),
      coverImage,
      body: articleBody,
      status,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === "published" ? now : null
    };
    db.articles.push(article);
    await saveDb();
    return sendJson(res, 201, { article: publicArticle(article, { includeBody: true, user }) });
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/articles/")) {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const id = decodeURIComponent(url.pathname.replace("/api/articles/", ""));
    const article = db.articles.find((item) => item.id === id && item.authorId === user.id);
    if (!article) return sendJson(res, 404, { error: "Article not found." });
    const wasPublished = article.status === "published";
    const body = await readJson(req);
    const title = cleanText(body.title, 110);
    const articleBody = cleanLongText(body.body, 24000);
    if (!title || !articleBody) {
      return sendJson(res, 400, { error: "Title and article body are required." });
    }
    article.title = title;
    article.coverImage = cleanUrl(body.coverImage);
    article.body = articleBody;
    article.status = body.status === "published" ? "published" : "draft";
    article.updatedAt = new Date().toISOString();
    if (article.status === "published" && !article.publishedAt) {
      article.publishedAt = article.updatedAt;
    }
    if (wasPublished && article.status === "published") {
      notifyArticleLikers(article, user);
    }
    await saveDb();
    return sendJson(res, 200, { article: publicArticle(article, { includeBody: true, user }) });
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/articles/")) {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const id = decodeURIComponent(url.pathname.replace("/api/articles/", ""));
    const article = db.articles.find((item) => item.id === id && item.authorId === user.id);
    if (!article) return sendJson(res, 404, { error: "Article not found." });
    db.articles = db.articles.filter((item) => item.id !== article.id);
    db.likes = db.likes.filter((like) => like.articleId !== article.id);
    db.notifications = db.notifications.filter((notification) => notification.articleId !== article.id);
    await saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/articles/") && url.pathname.endsWith("/like")) {
    if (!user) return sendJson(res, 401, { error: "Please log in first." });
    const id = decodeURIComponent(url.pathname.replace("/api/articles/", "").replace("/like", ""));
    const article = db.articles.find((item) => item.id === id && item.status === "published");
    if (!article) return sendJson(res, 404, { error: "Article not found." });
    const existing = db.likes.find((like) => like.articleId === id && like.userId === user.id);
    if (existing) {
      db.likes = db.likes.filter((like) => !(like.articleId === id && like.userId === user.id));
    } else {
      db.likes.push({
        id: randomId(),
        articleId: id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatarUrl || "",
        createdAt: new Date().toISOString()
      });
      if (article.authorId !== user.id) {
        addNotification({
          userId: article.authorId,
          type: "article_liked",
          article,
          actor: user
        });
      }
    }
    await saveDb();
    return sendJson(res, 200, { liked: !existing, likeCount: countLikes(id) });
  }

  return sendJson(res, 404, { error: "API route not found." });
}

async function serveStatic(req, res, relativePath) {
  const safePath = normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath || "index.html");
  if (!filePath.startsWith(publicDir)) return sendText(res, 403, "Forbidden");
  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(file);
  } catch {
    sendText(res, 404, "Not found");
  }
}

function renderShell({ title, description, image, path }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="format-detection" content="telephone=no,email=no,address=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="x5-page-mode" content="app">
  <meta name="x5-orientation" content="portrait">
  <meta name="screen-orientation" content="portrait">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:url" content="${escapeHtml(path)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f7f4ee">
  <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/public/app.js"></script>
</body>
</html>`;
}

function renderNotFound() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not found</title><link rel="stylesheet" href="/public/styles.css"></head><body><main class="empty-state"><h1>Article not found</h1><p>The page may be private, deleted, or unpublished.</p><a class="button primary" href="/">Back home</a></main></body></html>`;
}

function publicArticle(article, options = {}) {
  const includeBody = Boolean(options.includeBody);
  const user = options.user || null;
  const authorExists = db.users.some((item) => item.id === article.authorId);
  const userSubscriptions = user ? normalizeSubscriptions(user) : [];
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    authorId: article.authorId,
    authorName: article.authorName,
    authorAvatar: article.authorAvatar || "",
    coverImage: article.coverImage,
    excerpt: excerpt(article.body, 180),
    body: includeBody ? article.body : undefined,
    status: article.status,
    likeCount: countLikes(article.id),
    likedByMe: Boolean(user && db.likes.some((like) => like.articleId === article.id && like.userId === user.id)),
    canFollow: Boolean(user && authorExists && article.authorId !== user.id),
    isFollowing: Boolean(user && userSubscriptions.includes(article.authorId)),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    publishedAt: article.publishedAt,
    url: `/article/${article.slug}`
  };
}

function publicNotification(notification) {
  return {
    id: notification.id,
    type: notification.type,
    articleId: notification.articleId,
    articleTitle: notification.articleTitle,
    articleSlug: notification.articleSlug,
    title: notification.title || notification.articleTitle || "",
    targetUrl: notification.targetUrl || (notification.articleSlug ? "/article/" + notification.articleSlug : "/notifications"),
    actorName: notification.actorName || "",
    createdAt: notification.createdAt,
    readAt: notification.readAt || null
  };
}

function publicMailboxMessage(message) {
  return {
    id: message.id,
    senderName: message.senderName,
    senderEmail: message.senderEmail,
    message: message.message,
    createdAt: message.createdAt,
    readAt: message.readAt || null
  };
}

function publicUser(user) {
  if (!user) return null;
  const following = publicAccountList(normalizeSubscriptions(user));
  const followers = db.users.filter((item) => normalizeSubscriptions(item).includes(user.id));
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || "",
    following,
    followers: followers.map(publicAccountSummary),
    followingCount: following.length,
    followerCount: followers.length,
    subscriptions: following
  };
}

function publicAccount(account, currentUser) {
  const following = publicAccountList(normalizeSubscriptions(account));
  const followers = db.users.filter((item) => normalizeSubscriptions(item).includes(account.id)).map(publicAccountSummary);
  const articles = db.articles
    .filter((article) => article.authorId === account.id && article.status === "published")
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return {
    account: {
      ...publicAccountSummary(account),
      email: account.email,
      followingCount: following.length,
      followerCount: followers.length,
      articleCount: articles.length,
      canFollow: Boolean(currentUser && currentUser.id !== account.id),
      isFollowing: Boolean(currentUser && normalizeSubscriptions(currentUser).includes(account.id))
    },
    following,
    followers,
    articles: articles.map((article) => publicArticle(article, { user: currentUser }))
  };
}

function publicAccountSummary(account) {
  return {
    id: account.id,
    name: account.name,
    avatarUrl: account.avatarUrl || ""
  };
}

function publicAccountList(ids) {
  return ids.map((id) => {
    const account = db.users.find((item) => item.id === id);
    return account ? publicAccountSummary(account) : { id, name: id, avatarUrl: "" };
  });
}

function normalizeSubscriptions(user) {
  const seen = new Set();
  const ids = [];
  for (const item of Array.isArray(user?.subscriptions) ? user.subscriptions : []) {
    const id = typeof item === "string" ? item : item?.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

function ensureSeedAccount() {
  if (db.users.some((item) => item.id === "seed")) return;
  db.users.unshift({
    id: "seed",
    name: "mora",
    email: "mora@thinkwell.local",
    avatarUrl: "",
    subscriptions: [],
    passwordHash: hashPassword(randomId()),
    createdAt: new Date().toISOString()
  });
}

function findMorfyAccount() {
  return db.users.find((item) => item.name?.toLowerCase() === "morfy")
    || db.users.find((item) => item.email?.toLowerCase() === "morfymo@gmail.com")
    || db.users[0]
    || null;
}

function getCurrentUser(req) {
  const token = getCookie(req, "tw_session");
  if (!token) return null;
  const session = db.sessions.find((item) => item.token === token && item.expiresAt > Date.now());
  if (!session) return null;
  return db.users.find((item) => item.id === session.userId) || null;
}

function createSession(userId) {
  const session = {
    token: randomBytes(32).toString("base64url"),
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS
  };
  db.sessions.push(session);
  return session;
}

function setSessionCookie(res, token) {
  res.setHeader("Set-Cookie", `tw_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  if (raw.length > 1024 * 80) throw new Error("Request too large");
  return JSON.parse(raw);
}

async function readMultipartForm(req) {
  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  const boundary = boundaryMatch?.[1] || boundaryMatch?.[2];
  if (!boundary) return {};

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);
  if (raw.length > MAX_AVATAR_BYTES + 1024 * 20) throw new Error("Request too large");

  const parts = splitBuffer(raw, Buffer.from("--" + boundary));
  const result = {};
  for (const part of parts) {
    const trimmed = trimCrlf(part);
    if (trimmed.length < 4 || trimmed.equals(Buffer.from("--"))) continue;
    const headerEnd = trimmed.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd === -1) continue;
    const headerText = trimmed.slice(0, headerEnd).toString("utf8");
    const content = trimCrlf(trimmed.slice(headerEnd + 4));
    const name = headerText.match(/name="([^"]+)"/)?.[1];
    if (!name) continue;
    const filename = headerText.match(/filename="([^"]*)"/)?.[1] || "";
    const contentTypeMatch = headerText.match(/content-type:\s*([^\r\n]+)/i);
    if (filename) {
      result[name + "File"] = {
        filename,
        contentType: contentTypeMatch?.[1]?.trim().toLowerCase() || "",
        content
      };
    } else {
      result[name] = content.toString("utf8");
    }
  }
  return result;
}

function isMultipart(req) {
  return String(req.headers["content-type"] || "").includes("multipart/form-data");
}

async function saveAvatarUpload(file) {
  if (!file || !file.filename || !file.content?.length) return "";
  const extension = avatarMimeExtensions[file.contentType];
  if (!extension) throw new Error("Avatar must be a PNG, JPG, WebP, or GIF image.");
  if (file.content.length > MAX_AVATAR_BYTES) throw new Error("Avatar image must be 2 MB or smaller.");
  const filename = randomId() + extension;
  await mkdir(avatarUploadDir, { recursive: true });
  await writeFile(join(avatarUploadDir, filename), file.content);
  return "/public/uploads/avatars/" + filename;
}

function splitBuffer(buffer, separator) {
  const parts = [];
  let start = 0;
  let index = buffer.indexOf(separator);
  while (index !== -1) {
    parts.push(buffer.slice(start, index));
    start = index + separator.length;
    index = buffer.indexOf(separator, start);
  }
  parts.push(buffer.slice(start));
  return parts;
}

function trimCrlf(buffer) {
  let start = 0;
  let end = buffer.length;
  while (buffer[start] === 13 || buffer[start] === 10) start++;
  while (end > start && (buffer[end - 1] === 13 || buffer[end - 1] === 10)) end--;
  return buffer.slice(start, end);
}

function sendHtml(res, html, status = 200) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendText(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function getCookie(req, name) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${req.headers.host || `localhost:${PORT}`}`;
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanLongText(value, maxLength) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function cleanUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

async function translateArticleText({ title, body, target }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackTranslateArticle({ title, body, target });
  const targetName = target === "zh" ? "Simplified Chinese" : "English";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "Translate the article title and body into " + targetName + ". Preserve paragraph breaks and meaning. Return only strict JSON with string fields title and body."
        },
        {
          role: "user",
          content: JSON.stringify({ title, body })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "article_translation",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["title", "body"],
            properties: {
              title: { type: "string" },
              body: { type: "string" }
            }
          },
          strict: true
        }
      }
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Translation failed.");
  const output = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text || "";
  const parsed = JSON.parse(output);
  return {
    title: cleanLongText(parsed.title, 500),
    body: cleanLongText(parsed.body, 24000),
    target
  };
}

async function fallbackTranslateArticle({ title, body, target }) {
  const url = new URL("https://api.mymemory.translated.net/get");
  const source = target === "zh" ? "en" : "zh-CN";
  const targetCode = target === "zh" ? "zh-CN" : "en";
  const translateText = async (value) => {
    if (!value) return "";
    url.search = new URLSearchParams({
      q: value.slice(0, 4500),
      langpair: source + "|" + targetCode
    }).toString();
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.responseDetails || "Translation failed.");
    return cleanLongText(data.responseData?.translatedText || "", 24000);
  };
  return {
    title: await translateText(title),
    body: await translateText(body),
    target
  };
}

function isEmail(value) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

function uniqueSlug(title) {
  const base = slugify(title) || "article";
  let slug = base;
  let suffix = 2;
  while (db.articles.some((item) => item.slug === slug)) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function randomId() {
  return randomBytes(12).toString("hex");
}

function excerpt(text, length) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, length);
}

function countLikes(articleId) {
  return db.likes.filter((like) => like.articleId === articleId).length;
}

function notifyArticleLikers(article, actor) {
  const userIds = [...new Set(
    db.likes
      .filter((like) => like.articleId === article.id && like.userId !== actor.id)
      .map((like) => like.userId)
  )];
  for (const userId of userIds) {
    addNotification({
      userId,
      type: "liked_article_updated",
      article,
      actor
    });
  }
}

function addNotification({ userId, type, article, actor, title, targetUrl }) {
  if (!userId) return;
  db.notifications.push({
    id: randomId(),
    userId,
    type,
    articleId: article?.id || "",
    articleTitle: article?.title || "",
    articleSlug: article?.slug || "",
    title: title || article?.title || "",
    targetUrl: targetUrl || (article?.slug ? "/article/" + article.slug : ""),
    actorId: actor?.id || "",
    actorName: actor?.name || "",
    createdAt: new Date().toISOString(),
    readAt: null
  });
  db.notifications = db.notifications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 500);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}
