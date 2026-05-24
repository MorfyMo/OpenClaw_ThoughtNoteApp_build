const state = {
  user: null,
  articles: [],
  mine: [],
  currentArticle: null,
  editingArticle: null,
  notifications: [],
  notificationOpen: false,
  sidebarOpen: false,
  profileOpen: false,
  lang: localStorage.getItem("tw_lang") || "en",
  currentPath: window.location.pathname,
  writerSnapshot: ""
};

const text = {
  en: {
    siteTitle: "Thinkwell - Insightful Article",
    timeStream: "The Square",
    startNewArticle: "Start new article",
    noPublished: "No published articles yet.",
    startWriting: "Start writing",
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    loginTitle: "Log in",
    name: "Name",
    profilePicture: "Profile picture",
    chooseFile: "Upload avatar",
    noFileChosen: "No avatar selected",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    alreadyAccount: "Already have an account?",
    newHere: "New here?",
    login: "Log in",
    createOne: "Create one",
    libraryEyebrow: "Study Room",
    writingLibrary: "My Study Room",
    draftsProgress: "Drafts in progress",
    publishedHistory: "Published history",
    noDrafts: "No drafts yet.",
    analyticsPrompt: "Select a published article analytics button to see who liked it and the likes by date.",
    continueDraft: "Continue draft",
    draftSpace: "Draft space",
    keepShaping: "Keep shaping this article",
    writeArticle: "Write an insightful article",
    saveDraft: "Save draft",
    publish: "Publish",
    title: "Title",
    previewImageUrl: "Preview image URL",
    article: "Article",
    wechatHint: "WeChat previews use the article page title plus this public image URL after the app is deployed on HTTPS.",
    like: "Like",
    liked: "Liked",
    unliked: "Like removed",
    copyLink: "Copy link",
    copied: "Copied",
    translating: "Translating",
    translated: "Translation ready",
    translationFailed: "Translation failed",
    accountArea: "Account",
    openAccountArea: "Open account",
    profile: "Profile",
    editProfile: "Profile",
    saveProfile: "Save profile",
    updateProfile: "Update profile",
    notifications: "Notifications",
    mailbox: "Mailbox",
    mailboxHint: "This section is mainly for improvement suggestions.",
    mailboxMessage: "Message",
    mailboxPlaceholder: "Write your improvement suggestion here.",
    sendMailbox: "Send",
    mailboxSent: "Sent to Morfy",
    mailboxInbox: "Received suggestions",
    noMailboxMessages: "No suggestions have arrived yet.",
    noNotifications: "No notifications yet.",
    markRead: "Mark read",
    notificationsRead: "Notifications marked read",
    articleLikedNotice: "liked your article",
    articleUpdatedNotice: "updated an article you liked",
    mailboxSuggestionNotice: "sent a mailbox suggestion",
    accountFollowedNotice: "followed you",
    unread: "unread",
    editArticle: "Edit article",
    updateArticle: "Update article",
    timeStreamNav: "The Square",
    toSquare: "To the Square",
    fullLibrary: "My Study Room",
    logout: "Log out",
    loggedIn: "Logged in",
    accountCreated: "Account created",
    loggedOut: "Logged out",
    following: "Follow",
    followers: "People who follow",
    publishedArticles: "Published articles",
    noFollowing: "No followed accounts yet.",
    noFollowers: "No followers yet.",
    drafts: "Drafts",
    workingDraftsEmpty: "No working drafts yet.",
    historicalArticles: "Historical articles",
    afterLogin: "After login",
    afterLoginText: "This area shows profile, follow counts, drafts, historical articles, the square, and logout.",
    continue: "Continue",
    deleteDraft: "Delete draft",
    open: "Open",
    deleting: "Deleting...",
    draftDeleted: "Draft deleted.",
    articleDeleted: "Article deleted.",
    likeData: "Like data",
    likes: "likes",
    publishedArticle: "published an article",
    draft: "draft",
    published: "published",
    loadingLikeData: "Loading like data...",
    totalLikes: "total likes",
    likesByDate: "Likes by date",
    accountsLiked: "Accounts that liked it",
    noLikesDate: "No likes by date yet.",
    noLikedAccounts: "No accounts have liked it yet.",
    pageNotFound: "Page not found",
    pageMissing: "This page does not exist.",
    backHome: "Back home",
    back: "Back",
    unsavedDraft: "The draft hasn't been saved, so you can't turn back yet. Save it as a draft or publish first.",
    deleteDraftConfirm: "Delete this draft?",
    deleteArticle: "Delete",
    deleteArticleConfirm: "Delete this article?",
    savingDraft: "Saving draft...",
    publishingArticle: "Publishing...",
    draftSaved: "Draft saved",
    articlePublished: "Article published",
    articleUpdated: "Article updated",
    profileSaved: "Profile updated successfully",
    follow: "Follow",
    followingAction: "Following",
    requestFailed: "Request failed",
    langToggle: "中"
  },
  zh: {
    siteTitle: "泉思 - 你的思想源泉",
    timeStream: "广场",
    latestThoughts: "最新公开洞见",
    startNewArticle: "开始新洞见",
    noPublished: "还没有公开洞见。",
    startWriting: "开始写作",
    welcomeBack: "欢迎回来",
    createAccount: "创建账户",
    loginTitle: "登录",
    name: "用户名",
    profilePicture: "头像",
    chooseFile: "上传头像",
    noFileChosen: "没有选头像哦",
    email: "邮箱",
    password: "密码",
    forgotPassword: "忘记密码？",
    alreadyAccount: "已经有账户？",
    newHere: "第一次来？",
    login: "登录",
    createOne: "创建",
    libraryEyebrow: "书房",
    writingLibrary: "我的书房",
    draftsProgress: "进行中的草稿",
    publishedHistory: "发布历史",
    noDrafts: "还没有草稿。",
    analyticsPrompt: "选择已发布洞见的点赞数据按钮，查看点赞账户和日期。",
    continueDraft: "继续草稿",
    draftSpace: "草稿空间",
    keepShaping: "继续打磨这篇洞见",
    writeArticle: "写一篇有洞见",
    saveDraft: "保存草稿",
    publish: "发布",
    title: "标题",
    previewImageUrl: "预览图链接",
    article: "正文",
    wechatHint: "部署到 HTTPS 后，微信预览会使用洞见页面标题和这个公开图片链接。",
    like: "点赞",
    liked: "已点赞",
    unliked: "已取消点赞",
    copyLink: "复制链接",
    copied: "已复制",
    translating: "正在翻译",
    translated: "翻译完成",
    translationFailed: "翻译失败。",
    accountArea: "账户",
    openAccountArea: "打开账户",
    profile: "个人资料",
    editProfile: "个人资料",
    saveProfile: "保存资料",
    updateProfile: "更新资料",
    notifications: "通知",
    mailbox: "信箱",
    mailboxHint: "这个区域主要用于改进建议。",
    mailboxMessage: "内容",
    mailboxPlaceholder: "在这里写下你的改进建议。",
    sendMailbox: "发送",
    mailboxSent: "已发送给 Morfy",
    mailboxInbox: "收到的建议",
    noMailboxMessages: "还没有收到建议。",
    noNotifications: "还没有通知。",
    markRead: "标为已读",
    notificationsRead: "通知已标为已读",
    articleLikedNotice: "点赞了你的洞见",
    articleUpdatedNotice: "更新了你点赞过的洞见",
    mailboxSuggestionNotice: "发送了邮箱建议",
    accountFollowedNotice: "关注了你",
    unread: "未读",
    editArticle: "编辑洞见",
    updateArticle: "更新洞见",
    timeStreamNav: "广场",
    toSquare: "回到广场",
    fullLibrary: "我的书房",
    logout: "退出登录",
    loggedIn: "登录成功",
    accountCreated: "账户创建成功",
    loggedOut: "已退出登录",
    following: "关注",
    followers: "关注者",
    publishedArticles: "已发布洞见",
    noFollowing: "还没有关注账号。",
    noFollowers: "还没有关注者。",
    drafts: "草稿",
    workingDraftsEmpty: "还没有进行中的草稿。",
    historicalArticles: "历史洞见",
    afterLogin: "登录后",
    afterLoginText: "这里会显示个人资料、关注和关注者数量、草稿、历史洞见、广场和退出登录。",
    continue: "继续",
    deleteDraft: "删除草稿",
    open: "打开",
    deleting: "正在删除...",
    draftDeleted: "草稿已删除。",
    articleDeleted: "洞见已删除。",
    likeData: "点赞数据",
    likes: "次点赞",
    publishedArticle: "发布了洞见",
    draft: "草稿",
    published: "已发布",
    loadingLikeData: "正在加载点赞数据...",
    totalLikes: "总点赞",
    likesByDate: "按日期统计",
    accountsLiked: "点赞账户",
    noLikesDate: "还没有按日期统计的点赞。",
    noLikedAccounts: "还没有账户点赞。",
    pageNotFound: "页面未找到",
    pageMissing: "这个页面不存在。",
    backHome: "返回首页",
    back: "返回",
    unsavedDraft: "草稿还没有保存，所以现在不能返回。请先保存为草稿或发布。",
    deleteDraftConfirm: "删除这个草稿？",
    deleteArticle: "删除",
    deleteArticleConfirm: "删除这篇洞见？",
    savingDraft: "正在保存草稿...",
    publishingArticle: "正在发布...",
    draftSaved: "草稿已保存",
    articlePublished: "发布成功",
    articleUpdated: "更新成功",
    profileSaved: "资料更新成功",
    follow: "关注",
    followingAction: "已关注",
    requestFailed: "请求失败",
    langToggle: "Eng"
  }
};

const app = document.querySelector("#app");

const routes = {
  "/": renderHome,
  "/login": renderAuth,
  "/signup": renderAuth,
  "/write": renderWrite,
  "/me": renderLibrary,
  "/profile": renderProfile,
  "/notifications": renderNotifications,
  "/mailbox": renderMailbox
};

window.addEventListener("popstate", () => {
  if (!canLeaveCurrentView()) {
    history.pushState(null, "", "/write");
    return;
  }
  loadRoute();
});

document.addEventListener("click", async (event) => {
  const lang = event.target.closest("[data-lang-toggle]");
  if (lang) {
    event.preventDefault();
    if (!canLeaveCurrentView()) return;
    state.lang = state.lang === "en" ? "zh" : "en";
    localStorage.setItem("tw_lang", state.lang);
    loadRoute();
    return;
  }

  const back = event.target.closest("[data-back]");
  if (back) {
    event.preventDefault();
    if (!canLeaveCurrentView()) return;
    if (history.length > 1) history.back();
    else navigate("/");
    return;
  }

  const link = event.target.closest("a[data-link]");
  if (link) {
    event.preventDefault();
    closeRail();
    navigate(link.getAttribute("href"));
    return;
  }

  const railToggle = event.target.closest("[data-toggle-rail]");
  if (railToggle) {
    state.sidebarOpen = !state.sidebarOpen;
    document.body.classList.toggle("rail-open", state.sidebarOpen);
    return;
  }

  const markNotificationsRead = event.target.closest("[data-mark-notifications-read]");
  if (markNotificationsRead) {
    await api("/api/notifications/read", { method: "POST" });
    await loadNotifications();
    showToast(t("notificationsRead"));
    loadRoute();
    return;
  }

  const logout = event.target.closest("[data-logout]");
  if (logout) {
    if (!canLeaveCurrentView()) return;
    await api("/api/logout", { method: "POST" });
    state.user = null;
    state.notifications = [];
    showToast(t("loggedOut"));
    navigate("/", { force: true });
    return;
  }

  const like = event.target.closest("[data-like]");
  if (like) {
    if (!state.user) return navigate("/login");
    const result = await api("/api/articles/" + like.dataset.like + "/like", { method: "POST" });
    like.classList.toggle("liked", result.liked);
    like.querySelector("span").textContent = String(result.likeCount);
    showToast(result.liked ? t("liked") : t("unliked"));
    return;
  }

  const translateArticle = event.target.closest("[data-translate-article]");
  if (translateArticle) {
    await translateCurrentArticle(translateArticle);
    return;
  }

  const edit = event.target.closest("[data-edit]");
  if (edit) {
    if (!canLeaveCurrentView()) return;
    const article = state.mine.find((item) => item.id === edit.dataset.edit);
    state.editingArticle = article || null;
    navigate("/write", { force: true });
    return;
  }

  const deleteDraft = event.target.closest("[data-delete-draft]");
  if (deleteDraft) {
    event.preventDefault();
    if (!confirm(t("deleteDraftConfirm"))) return;
    await deleteArticleById(deleteDraft.dataset.deleteDraft, t("draftDeleted"));
    return;
  }

  const deleteArticle = event.target.closest("[data-delete-article]");
  if (deleteArticle) {
    event.preventDefault();
    if (!confirm(t("deleteArticleConfirm"))) return;
    await deleteArticleById(deleteArticle.dataset.deleteArticle, t("articleDeleted"));
    return;
  }

  const follow = event.target.closest("[data-follow-author]");
  if (follow) {
    if (!state.user) return navigate("/login");
    const result = await api("/api/users/" + follow.dataset.followAuthor + "/follow", { method: "POST" });
    state.user = result.user;
    showToast(t("followingAction"));
    loadRoute();
    return;
  }

  const analytics = event.target.closest("[data-analytics]");
  if (analytics) {
    openAnalytics(analytics.dataset.analytics);
  }
});

document.addEventListener("change", (event) => {
  if (!event.target.matches(".file-input")) return;
  const field = event.target.closest(".file-field");
  const fileName = field?.querySelector("[data-file-name]");
  const file = event.target.files?.[0];
  if (fileName) fileName.textContent = file ? file.name : t("noFileChosen");
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "mailboxForm") {
    event.preventDefault();
    const form = event.target;
    const error = document.querySelector("#mailboxError");
    const status = document.querySelector("#mailboxStatus");
    const button = form.querySelector("button");
    if (error) error.textContent = "";
    if (status) status.textContent = "";
    if (button) button.disabled = true;
    try {
      await api("/api/mailbox", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
      });
      form.reset();
      if (status) status.textContent = t("mailboxSent");
      showToast(t("mailboxSent"));
    } catch (err) {
      if (error) error.textContent = err.message;
    } finally {
      if (button) button.disabled = false;
    }
    return;
  }

  if (event.target.id !== "profileForm") return;
  event.preventDefault();
  const error = document.querySelector("#profileError");
  try {
    const result = await api("/api/me", {
      method: "PUT",
      body: new FormData(event.target)
    });
    state.user = result.user;
    await loadRoute();
    showToast(t("profileSaved"));
  } catch (err) {
    if (error) error.textContent = err.message;
  }
});

loadRoute();

async function loadRoute() {
  await loadMe();
  document.body.classList.toggle("rail-open", state.sidebarOpen);
  const path = window.location.pathname;
  if (path.startsWith("/article/")) {
    await renderArticle(decodeURIComponent(path.replace("/article/", "")));
  } else if (path.startsWith("/account/")) {
    await renderAccount(decodeURIComponent(path.replace("/account/", "")));
  } else {
    await (routes[path] || renderNotFound)();
  }
  updateDocumentTitle();
  state.currentPath = path;
}

function navigate(path, options = {}) {
  if (!options.force && !canLeaveCurrentView()) return;
  history[options.replace ? "replaceState" : "pushState"](null, "", path);
  loadRoute();
}

async function loadMe() {
  const result = await api("/api/me");
  state.user = result.user;
  if (state.user) {
    try {
      const mine = await api("/api/articles/mine");
      state.mine = mine.articles;
    } catch {
      state.mine = [];
    }
    await loadNotifications();
  } else {
    state.mine = [];
    state.notifications = [];
    state.notificationOpen = false;
  }
}

async function loadNotifications() {
  try {
    const result = await api("/api/notifications");
    state.notifications = result.notifications;
  } catch {
    state.notifications = [];
  }
}

async function renderHome() {
  const result = await api("/api/articles");
  state.articles = result.articles;
  state.writerSnapshot = "";
  app.innerHTML = layout(
    '<main class="stream-page">' +
      topBar() +
      '<section class="stream-head">' +
        '<div><h1 class="square-title">' + t("timeStream") + '</h1></div>' +
        (state.user ? '<a class="button primary stream-new-article" href="/write" data-link>' + t("startNewArticle") + '</a>' : '') +
      '</section>' +
      '<section class="feed">' +
        (state.articles.map(streamCard).join("") || empty(t("noPublished"))) +
      '</section>' +
    '</main>'
  );
}

function renderAuth() {
  const isSignup = window.location.pathname === "/signup";
  state.writerSnapshot = "";
  app.innerHTML = layout(
    '<main class="auth-wrap">' +
      '<form class="auth-card" id="authForm">' +
        '<div class="auth-top"><div><p class="eyebrow">' + (isSignup ? t("startWriting") : t("welcomeBack")) + '</p>' +
        '<h1>' + (isSignup ? t("createAccount") : t("loginTitle")) + '</h1></div>' + backButton() + '</div>' +
        '<div class="form-stack">' +
          (isSignup ? '<label>' + t("name") + '<input name="name" autocomplete="name" required maxlength="40"></label>' : '') +
          (isSignup ? fileField("avatar") : '') +
          '<label>' + t("email") + '<input name="email" type="email" autocomplete="email" required></label>' +
          '<label>' + t("password") + '<input name="password" type="password" autocomplete="' + (isSignup ? "new-password" : "current-password") + '" required minlength="8"></label>' +
        '</div>' +
        '<a class="forgot-link" href="#" aria-disabled="true">' + t("forgotPassword") + '</a>' +
        '<p class="error" id="formError" role="alert"></p>' +
        '<button class="button primary full" type="submit">' + (isSignup ? t("createAccount") : t("login")) + '</button>' +
        '<p class="switch">' + (isSignup ? t("alreadyAccount") : t("newHere")) + ' <a href="' + (isSignup ? "/login" : "/signup") + '" data-link>' + (isSignup ? t("login") : t("createOne")) + '</a></p>' +
      '</form>' +
    '</main>'
  );

  document.querySelector("#authForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = isSignup ? formData : Object.fromEntries(formData.entries());
    try {
      const result = await api(isSignup ? "/api/signup" : "/api/login", {
        method: "POST",
        body: isSignup ? payload : JSON.stringify(payload)
      });
      state.user = result.user;
      showToast(isSignup ? t("accountCreated") : t("loggedIn"));
      navigate("/", { force: true });
    } catch (error) {
      document.querySelector("#formError").textContent = error.message;
    }
  });
}

async function renderLibrary() {
  if (!state.user) return navigate("/login", { force: true });
  const result = await api("/api/articles/mine");
  state.mine = result.articles;
  state.writerSnapshot = "";
  const published = state.mine.filter((item) => item.status === "published");
  const drafts = state.mine.filter((item) => item.status === "draft");

  app.innerHTML = layout(
    '<main class="library-page">' +
      '<section class="stream-head">' +
        '<div><p class="eyebrow">' + t("libraryEyebrow") + '</p><h1>' + t("writingLibrary") + '</h1></div>' +
        '<a class="button primary" href="/write" data-link>' + t("startNewArticle") + '</a>' +
        backButton() +
      '</section>' +
      '<section class="library-columns">' +
        '<div><h2>' + t("draftsProgress") + '</h2><div class="stack">' + (drafts.map(draftRow).join("") || empty(t("noDrafts"))) + '</div></div>' +
        '<div><h2>' + t("publishedHistory") + '</h2><div class="stack">' + (published.map(historyRow).join("") || empty(t("noPublished"))) + '</div></div>' +
      '</section>' +
      '<section class="analytics-area" id="analyticsArea"><p>' + t("analyticsPrompt") + '</p></section>' +
    '</main>'
  );
}

function renderProfile() {
  if (!state.user) return navigate("/login", { force: true });
  state.writerSnapshot = "";
  app.innerHTML = layout(
    '<main class="settings-page">' +
      '<section class="stream-head">' +
        '<div><p class="eyebrow">' + t("accountArea") + '</p><h1>' + t("editProfile") + '</h1></div>' +
        backButton() +
      '</section>' +
      profileForm() +
    '</main>'
  );
}

function renderNotifications() {
  if (!state.user) return navigate("/login", { force: true });
  state.writerSnapshot = "";
  app.innerHTML = layout(
    '<main class="settings-page">' +
      '<section class="stream-head">' +
        '<div><p class="eyebrow">' + t("accountArea") + '</p><h1>' + t("notifications") + '</h1></div>' +
        backButton() +
      '</section>' +
      notificationList() +
    '</main>'
  );
}

async function renderMailbox() {
  if (!state.user) return navigate("/login", { force: true });
  let messages = [];
  try {
    const result = await api("/api/mailbox");
    messages = result.messages || [];
  } catch {
    messages = [];
  }
  state.writerSnapshot = "";
  app.innerHTML = layout(
    '<main class="settings-page">' +
      '<section class="stream-head">' +
        '<div><p class="eyebrow">' + t("accountArea") + '</p><h1>' + t("mailbox") + '</h1></div>' +
        backButton() +
      '</section>' +
      '<section class="mailbox-area">' +
        '<p class="mailbox-hint">' + t("mailboxHint") + '</p>' +
        '<form class="mailbox-form" id="mailboxForm">' +
          '<label>' + t("mailboxMessage") + '<textarea name="message" rows="8" maxlength="4000" required placeholder="' + escapeAttr(t("mailboxPlaceholder")) + '"></textarea></label>' +
          '<p class="form-status" id="mailboxStatus" role="status" aria-live="polite"></p>' +
          '<p class="error" id="mailboxError" role="alert"></p>' +
          '<button class="button primary" type="submit">' + t("sendMailbox") + '</button>' +
        '</form>' +
        '<div class="mailbox-inbox"><h2>' + t("mailboxInbox") + '</h2>' +
          (messages.map(mailboxMessageItem).join("") || empty(t("noMailboxMessages"))) +
        '</div>' +
      '</section>' +
    '</main>'
  );
}

function mailboxMessageItem(item) {
  return (
    '<article class="mailbox-message">' +
      '<div><strong>' + escapeHtml(item.senderName) + '</strong><small>' + escapeHtml(item.senderEmail) + ' · ' + formatDateTime(item.createdAt) + '</small></div>' +
      '<p>' + escapeHtml(item.message) + '</p>' +
    '</article>'
  );
}

function renderWrite() {
  if (!state.user) return navigate("/login", { force: true });
  const editing = state.editingArticle;
  app.innerHTML = layout(
    '<main class="writer">' +
      '<form id="articleForm" class="writer-form">' +
        '<div class="writer-top">' +
          '<div><p class="eyebrow">' + (editing ? t("continueDraft") : t("draftSpace")) + '</p>' + (editing ? '<h1>' + t("keepShaping") + '</h1>' : '') + '</div>' +
          '<div class="writer-actions">' +
            backButton() +
            '<button class="button ghost" name="intent" value="draft" data-article-intent="draft" type="submit">' + t("saveDraft") + '</button>' +
            '<button class="button primary" name="intent" value="published" data-article-intent="published" type="submit">' + (editing?.status === "published" ? t("updateArticle") : t("publish")) + '</button>' +
          '</div>' +
        '</div>' +
        '<label>' + t("title") + '<input name="title" maxlength="110" required value="' + escapeAttr(editing?.title || "") + '"></label>' +
        '<label>' + t("previewImageUrl") + '<input name="coverImage" type="url" value="' + escapeAttr(editing?.coverImage || "") + '" placeholder="https://example.com/cover.jpg"></label>' +
        '<label>' + t("article") + '<textarea name="body" rows="18" required>' + escapeHtml(editing?.body || "") + '</textarea></label>' +
        '<p class="hint">' + t("wechatHint") + '</p>' +
        '<p class="form-status" id="formStatus" role="status" aria-live="polite"></p>' +
        '<p class="error" id="formError" role="alert"></p>' +
      '</form>' +
    '</main>'
  );

  const form = document.querySelector("#articleForm");
  state.writerSnapshot = serializeWriter(form);
  form.addEventListener("click", (event) => {
    const intent = event.target.closest("[data-article-intent]");
    if (intent) form.dataset.intent = intent.dataset.articleIntent;
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const buttons = [...event.currentTarget.querySelectorAll("button")];
    const error = document.querySelector("#formError");
    const status = document.querySelector("#formStatus");
    const previousSnapshot = state.writerSnapshot;
    const submittedSnapshot = serializeWriter(event.currentTarget);
    buttons.forEach((button) => button.disabled = true);
    if (error) error.textContent = "";
    if (status) status.textContent = "";
    state.writerSnapshot = submittedSnapshot;
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.status = submitter?.value || event.currentTarget.dataset.intent || "draft";
    const pendingMessage = payload.status === "published" ? t("publishingArticle") : t("savingDraft");
    if (status) status.textContent = pendingMessage;
    showToast(pendingMessage);
    try {
      const result = await api(editing ? "/api/articles/" + editing.id : "/api/articles", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      state.writerSnapshot = "";
      state.editingArticle = null;
      if (status) status.textContent = result.article.status === "published" ? (editing ? t("articleUpdated") : t("articlePublished")) : t("draftSaved");
      showToast(status?.textContent || t("draftSaved"));
      navigate(result.article.status === "published" ? "/article/" + result.article.slug : "/me", { force: true });
    } catch (error) {
      state.writerSnapshot = previousSnapshot;
      document.querySelector("#formError").textContent = error.message;
      buttons.forEach((button) => button.disabled = false);
    }
  });
}

async function renderArticle(slug) {
  try {
    const result = await api("/api/articles/" + slug);
    const article = result.article;
    const translationTarget = articleTranslationTarget(article);
    state.currentArticle = article;
    state.writerSnapshot = "";
    app.innerHTML = layout(
      '<main class="article-page">' +
        '<div class="article-top">' + authorRow(article, '<time>' + formatDateTime(article.publishedAt || article.updatedAt) + '</time>') + backButton() + '</div>' +
        (article.coverImage ? '<img class="cover" src="' + escapeAttr(article.coverImage) + '" alt="">' : '') +
        '<h1 data-article-title>' + escapeHtml(article.title) + '</h1>' +
        '<div class="article-tools">' +
          '<button class="like-button ' + (article.likedByMe ? "liked" : "") + '" data-like="' + article.id + '" type="button" aria-label="' + t("like") + '">' + heartIcon() + '<span>' + article.likeCount + '</span></button>' +
          (state.user?.id === article.authorId ? '<button class="button ghost compact" data-edit="' + article.id + '" type="button">' + t("editArticle") + '</button>' : '') +
          (state.user?.id === article.authorId ? '<button class="button danger compact" data-delete-article="' + article.id + '" type="button">' + t("deleteArticle") + '</button>' : '') +
          '<button class="button ghost compact" data-translate-article="' + translationTarget.target + '" type="button">' + translationTarget.label + '</button>' +
          '<button class="button ghost compact" id="copyLink" type="button">' + t("copyLink") + '</button>' +
        '</div>' +
        '<article class="prose" data-article-body>' + paragraphs(article.body) + '</article>' +
      '</main>'
    );
    document.querySelector("#copyLink").addEventListener("click", async () => {
      await navigator.clipboard.writeText(window.location.href);
      document.querySelector("#copyLink").textContent = t("copied");
    });
  } catch {
    renderNotFound();
  }
}

async function renderAccount(id) {
  try {
    const result = await api("/api/users/" + encodeURIComponent(id));
    const account = result.account;
    const view = new URLSearchParams(window.location.search).get("view") || "articles";
    const listTitle = view === "followers" ? t("followers") : view === "following" ? t("following") : t("publishedArticles");
    const listHtml = view === "followers"
      ? accountList(result.followers, t("noFollowers"))
      : view === "following"
        ? accountList(result.following, t("noFollowing"))
        : (result.articles.map(streamCard).join("") || empty(t("noPublished")));
    state.writerSnapshot = "";
    app.innerHTML = layout(
      '<main class="account-page">' +
        '<section class="account-hero">' +
          avatar(account.name, account.avatarUrl) +
          '<div class="account-identity"><p class="eyebrow">' + t("accountArea") + '</p><h1>' + escapeHtml(account.name) + '</h1><small>' + escapeHtml(account.email) + '</small></div>' +
          (account.canFollow ? '<button class="button primary account-follow" data-follow-author="' + escapeAttr(account.id) + '" type="button" ' + (account.isFollowing ? "disabled" : "") + '>' + (account.isFollowing ? t("followingAction") : t("follow")) + '</button>' : '') +
          backButton() +
        '</section>' +
        accountStats(account, view) +
        '<section class="account-section"><h2>' + listTitle + '</h2><div class="' + (view === "articles" ? "feed" : "account-list") + '">' + listHtml + '</div></section>' +
      '</main>'
    );
  } catch {
    renderNotFound();
  }
}

function accountStats(account, activeView) {
  return (
    '<nav class="account-stats" aria-label="' + t("accountArea") + '">' +
      '<a class="' + (activeView === "articles" ? "active" : "") + '" href="/account/' + encodeURIComponent(account.id) + '?view=articles" data-link><span>' + t("publishedArticles") + '</span><strong>' + (account.articleCount || "") + '</strong></a>' +
      '<a class="' + (activeView === "following" ? "active" : "") + '" href="/account/' + encodeURIComponent(account.id) + '?view=following" data-link><span>' + t("following") + '</span><strong>' + account.followingCount + '</strong></a>' +
      '<a class="' + (activeView === "followers" ? "active" : "") + '" href="/account/' + encodeURIComponent(account.id) + '?view=followers" data-link><span>' + t("followers") + '</span><strong>' + account.followerCount + '</strong></a>' +
    '</nav>'
  );
}

function accountList(accounts, emptyText) {
  return accounts.map(accountListItem).join("") || empty(emptyText);
}

function accountListItem(account) {
  return (
    '<a class="account-list-item" href="/account/' + encodeURIComponent(account.id) + '" data-link>' +
      avatar(account.name, account.avatarUrl) +
      '<strong>' + escapeHtml(account.name) + '</strong>' +
    '</a>'
  );
}

function articleTranslationTarget(article) {
  const textValue = [article.title, article.body || article.excerpt || ""].join("\n");
  const chineseCount = (textValue.match(/[\u3400-\u9fff]/g) || []).length;
  const letterCount = (textValue.match(/[A-Za-z]/g) || []).length;
  const isChinese = chineseCount > 0 && chineseCount >= letterCount * 0.35;
  return isChinese ? { target: "en", label: "Eng" } : { target: "zh", label: "中" };
}

async function translateCurrentArticle(button) {
  if (!state.currentArticle) return;
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = t("translating");
  try {
    const result = await api("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        title: state.currentArticle.title,
        body: state.currentArticle.body,
        target: button.dataset.translateArticle
      })
    });
    document.querySelector("[data-article-title]").textContent = result.title;
    document.querySelector("[data-article-body]").innerHTML = paragraphs(result.body);
    state.currentArticle = { ...state.currentArticle, title: result.title, body: result.body };
    const next = articleTranslationTarget(state.currentArticle);
    button.dataset.translateArticle = next.target;
    button.textContent = next.label;
    showToast(t("translated"));
  } catch (error) {
    showToast(error.message || t("translationFailed"));
    button.textContent = originalLabel;
  } finally {
    button.disabled = false;
  }
}

function layout(content) {
  return (
    '<div class="app-shell">' +
      '<aside class="rail">' +
        '<button class="rail-tab" data-toggle-rail type="button" aria-label="' + t("openAccountArea") + '">' + profileIcon() + '</button>' +
        '<div class="rail-content">' +
          (state.user ? signedInRail() : signedOutRail()) +
        '</div>' +
      '</aside>' +
      '<div class="main-area">' + content + '</div>' +
    '</div>'
  );
}

function signedInRail() {
  return (
    '<div class="profile-block">' + avatar(state.user.name, state.user.avatarUrl) +
      '<div><strong>' + escapeHtml(state.user.name) + '</strong><small>' + escapeHtml(state.user.email) + '</small></div>' +
    '</div>' +
    '<div class="rail-follow-stats">' +
      '<a href="/account/' + state.user.id + '?view=following" data-link><span>' + t("following") + '</span><strong>' + (state.user.followingCount || 0) + '</strong></a>' +
      '<a href="/account/' + state.user.id + '?view=followers" data-link><span>' + t("followers") + '</span><strong>' + (state.user.followerCount || 0) + '</strong></a>' +
    '</div>' +
    '<nav class="rail-nav">' +
      '<a href="/" data-link>' + t("toSquare") + '</a>' +
      '<a href="/profile" data-link>' + t("editProfile") + '</a>' +
      '<a href="/notifications" data-link>' + t("notifications") + notificationBadge() + '</a>' +
      '<a href="/mailbox" data-link>' + t("mailbox") + '</a>' +
      '<a href="/me" data-link>' + t("fullLibrary") + '</a>' +
      '<button data-logout type="button">' + t("logout") + '</button>' +
    '</nav>'
  );
}

function closeRail() {
  state.sidebarOpen = false;
  document.body.classList.remove("rail-open");
}

function notificationBadge() {
  const count = state.notifications.filter((item) => !item.readAt).length;
  return count ? '<span class="notification-badge">' + count + '</span>' : '';
}

function notificationList() {
  const unread = state.notifications.filter((item) => !item.readAt).length;
  return (
    '<section class="notification-list">' +
      '<div class="notification-top"><strong>' + t("notifications") + '</strong>' +
        (unread ? '<button data-mark-notifications-read type="button">' + t("markRead") + '</button>' : '') +
      '</div>' +
      (state.notifications.map(notificationItem).join("") || '<p>' + t("noNotifications") + '</p>') +
    '</section>'
  );
}

function notificationItem(item) {
  const label = notificationLabel(item);
  const actor = item.actorName ? '<strong>' + escapeHtml(item.actorName) + '</strong> ' : '';
  const href = item.targetUrl || (item.articleSlug ? "/article/" + item.articleSlug : "/notifications");
  const title = item.title || item.articleTitle || t("notifications");
  return (
    '<a class="notification-item ' + (item.readAt ? "" : "unread") + '" href="' + escapeAttr(href) + '" data-link>' +
      '<span>' + actor + label + '</span>' +
      '<small>' + escapeHtml(title) + ' · ' + formatDateTime(item.createdAt) + '</small>' +
    '</a>'
  );
}

function notificationLabel(item) {
  if (item.type === "liked_article_updated") return t("articleUpdatedNotice");
  if (item.type === "mailbox_suggestion") return t("mailboxSuggestionNotice");
  if (item.type === "account_followed") return t("accountFollowedNotice");
  return t("articleLikedNotice");
}

function profileForm() {
  return (
    '<form id="profileForm" class="profile-form">' +
      '<label>' + t("name") + '<input name="name" autocomplete="name" required maxlength="40" value="' + escapeAttr(state.user.name) + '"></label>' +
      fileField("avatar") +
      '<p class="error" id="profileError" role="alert"></p>' +
      '<button class="button primary full" type="submit">' + t("saveProfile") + '</button>' +
    '</form>'
  );
}

function fileField(name) {
  return '<label class="file-field"><span class="field-label">' + t("profilePicture") + '</span><span class="file-control"><span class="file-button">' + t("chooseFile") + '</span><span class="file-name" data-file-name>' + t("noFileChosen") + '</span><input class="file-input" name="' + name + '" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></span></label>';
}

function signedOutRail() {
  return (
    '<div class="profile-block">' + avatar(t("accountArea"), "") + '<div><strong>' + t("accountArea") + '</strong><small>' + t("login") + '</small></div></div>' +
    '<section class="rail-section"><h3>' + t("afterLogin") + '</h3><p>' + t("afterLoginText") + '</p></section>'
  );
}

function topBar() {
  return '<header class="page-topbar"><a class="wordmark" href="/" data-link>' + springIcon() + '<span>' + (state.lang === "zh" ? "泉思" : "Thinkwell") + '</span></a><div class="top-actions">' +
    '<button class="button ghost compact lang-toggle" data-lang-toggle type="button">' + t("langToggle") + '</button>' +
    (state.user
      ? '<span class="top-user">' + avatar(state.user.name, state.user.avatarUrl) + escapeHtml(state.user.name) + '</span>'
      : '<a class="button ghost compact" href="/login" data-link>' + t("login") + '</a><a class="button primary compact" href="/signup" data-link>' + t("createOne") + '</a>') +
    '</div></header>';
}

function backButton() {
  return '<button class="button ghost compact back-button" data-back type="button">' + t("back") + '</button>';
}

function profileIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm7.4 8c-.8-3.6-3.5-5.8-7.4-5.8s-6.6 2.2-7.4 5.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

function springIcon() {
  return '<svg class="spring-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4c3.4 3.8 5.1 6.6 5.1 9.1a5.1 5.1 0 0 1-10.2 0c0-2.5 1.7-5.3 5.1-9.1Z" fill="currentColor"/><path d="M8.2 15.5c1.7 1.4 5.9 1.4 7.6 0" fill="none" stroke="#fffaf3" stroke-width="1.8" stroke-linecap="round"/></svg>';
}

function heartIcon() {
  return '<svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9A5.1 5.1 0 0 1 11.8 7l.2.3.2-.3a5.1 5.1 0 0 1 9.1 4.5c-1.8 4.4-9.3 9-9.3 9Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
}

function streamCard(article) {
  return (
    '<article class="stream-card">' +
      '<div class="stream-meta"><time>' + formatDateTime(article.publishedAt) + '</time></div>' +
      authorRow(article, '<small>' + t("publishedArticle") + '</small>') +
      '<a class="stream-link" href="/article/' + encodeURIComponent(article.slug) + '" data-link>' +
        (article.coverImage ? '<img src="' + escapeAttr(article.coverImage) + '" alt="">' : '') +
        '<h2>' + escapeHtml(article.title) + '</h2>' +
        '<p>' + escapeHtml(article.excerpt) + '</p>' +
      '</a>' +
      '<div class="stream-actions">' +
        '<button class="like-button ' + (article.likedByMe ? "liked" : "") + '" data-like="' + article.id + '" type="button" aria-label="' + t("like") + '">' + heartIcon() + '<span>' + article.likeCount + '</span></button>' +
      '</div>' +
    '</article>'
  );
}

function draftRow(article) {
  return (
    '<article class="list-row"><div><span class="status">' + t("draft") + '</span><h3>' + escapeHtml(article.title) + '</h3><p>' + escapeHtml(article.excerpt) + '</p></div>' +
    '<div class="row-actions"><button class="button ghost compact" data-edit="' + article.id + '" type="button">' + t("continue") + '</button><button class="button danger compact" data-delete-draft="' + article.id + '" type="button">' + t("deleteDraft") + '</button></div></article>'
  );
}

function historyRow(article) {
  return (
    '<article class="list-row"><div><span class="status published">' + t("published") + '</span><h3>' + escapeHtml(article.title) + '</h3><p>' + article.likeCount + ' ' + t("likes") + ' · ' + formatDateTime(article.publishedAt) + '</p></div>' +
    '<div class="row-actions"><button class="button ghost compact" data-edit="' + article.id + '" type="button">' + t("editArticle") + '</button><a class="button ghost compact" href="/article/' + encodeURIComponent(article.slug) + '" data-link>' + t("open") + '</a><button class="button ghost compact" data-analytics="' + article.id + '" type="button">' + t("likeData") + '</button><button class="button danger compact" data-delete-article="' + article.id + '" type="button">' + t("deleteArticle") + '</button></div></article>'
  );
}

function authorRow(article, metaHtml) {
  return (
    '<div class="author-row">' +
      '<a class="author-profile-link" href="/account/' + encodeURIComponent(article.authorId) + '" data-link>' + avatar(article.authorName, article.authorAvatar) +
        '<span class="author-main"><strong>' + escapeHtml(article.authorName) + '</strong>' + metaHtml + '</span></a>' +
      (article.canFollow ? '<button class="button ghost compact author-follow" data-follow-author="' + escapeAttr(article.authorId) + '" type="button" ' + (article.isFollowing ? "disabled" : "") + '>' + (article.isFollowing ? t("followingAction") : t("follow")) + '</button>' : '') +
    '</div>'
  );
}

async function openAnalytics(articleId) {
  const analyticsArea = document.querySelector("#analyticsArea");
  analyticsArea.innerHTML = '<p>' + t("loadingLikeData") + '</p>';
  try {
    const data = await api("/api/articles/" + articleId + "/analytics");
    analyticsArea.innerHTML =
      '<div class="data-heading"><div><p class="eyebrow">' + t("likeData") + '</p><h2>' + escapeHtml(data.article.title) + '</h2></div><strong>' + data.likeCount + ' ' + t("totalLikes") + '</strong></div>' +
      '<div class="data-grid"><section><h3>' + t("likesByDate") + '</h3>' +
        (data.likesByDate.map((item) => '<div class="data-row"><span>' + escapeHtml(item.date) + '</span><strong>' + item.count + '</strong></div>').join("") || empty(t("noLikesDate"))) +
      '</section><section><h3>' + t("accountsLiked") + '</h3>' +
        (data.likedBy.map((item) => '<div class="liked-account">' + avatar(item.name, item.avatarUrl) + '<div><strong>' + escapeHtml(item.name) + '</strong><small>' + formatDateTime(item.createdAt) + '</small></div></div>').join("") || empty(t("noLikedAccounts"))) +
      '</section></div>';
  } catch (error) {
    analyticsArea.innerHTML = '<p class="error">' + escapeHtml(error.message) + '</p>';
  }
}

async function deleteArticleById(articleId, successMessage) {
  showToast(t("deleting"));
  await api("/api/articles/" + articleId, { method: "DELETE" });
  state.mine = state.mine.filter((item) => item.id !== articleId);
  showToast(successMessage);
  if (window.location.pathname === "/me") {
    await loadRoute();
  } else {
    navigate("/me", { force: true, replace: true });
  }
}

function renderNotFound() {
  state.writerSnapshot = "";
  app.innerHTML = layout('<main class="empty-state"><div class="empty-top"><h1>' + t("pageNotFound") + '</h1>' + backButton() + '</div><p>' + t("pageMissing") + '</p><a class="button primary" href="/" data-link>' + t("backHome") + '</a></main>');
}

async function api(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  const response = await fetch(path, {
    headers,
    credentials: "same-origin",
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || t("requestFailed"));
  return data;
}

function canLeaveCurrentView() {
  if (state.currentPath !== "/write" || !isWriterDirty()) return true;
  alert(t("unsavedDraft"));
  return false;
}

function isWriterDirty() {
  const form = document.querySelector("#articleForm");
  return Boolean(form && state.writerSnapshot && serializeWriter(form) !== state.writerSnapshot);
}

function serializeWriter(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  return JSON.stringify({
    title: values.title || "",
    coverImage: values.coverImage || "",
    body: values.body || ""
  });
}

function showToast(message) {
  if (!message) return;
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function t(key) {
  return (text[state.lang] && text[state.lang][key]) || text.en[key] || key;
}

function updateDocumentTitle() {
  document.title = t("siteTitle");
}

function avatar(name, url) {
  if (url) return '<img class="avatar" src="' + escapeAttr(url) + '" alt="">';
  const initial = String(name || "?").trim().slice(0, 1).toUpperCase();
  return '<span class="avatar fallback">' + escapeHtml(initial) + '</span>';
}

function empty(message) {
  return '<div class="empty-inline">' + escapeHtml(message) + '</div>';
}

function paragraphs(value) {
  return escapeHtml(value).split(/\n{2,}/).map((part) => '<p>' + part.replace(/\n/g, "<br>") + '</p>').join("");
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(state.lang === "zh" ? "zh-CN" : undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/\n/g, "");
}
