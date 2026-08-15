(() => {
  const params = new URLSearchParams(window.location.search);
  const person = params.get("person") || "ئەحمەد";
  const requestId = params.get("request") || "r1";
  const guidedPage = document.querySelector("[data-guided-page]");
  const conversationPage = document.querySelector("[data-conversation-page]");
  const isConversation = Boolean(conversationPage);
  const isPostFace = isConversation && params.get("postFace") === "1";
  const isConditional = isPostFace && params.get("conditional") === "1";
  const selfConditional = isConditional && params.get("selfConditional") === "1";
  const isClosed = isConversation && params.has("closed");
  const page = guidedPage || conversationPage;
  if (!page) return;

  document.querySelectorAll("[data-stage-name]").forEach((element) => { element.textContent = person; });
  document.querySelectorAll("[data-stage-back]").forEach((link) => {
    link.href = isConversation
      ? `guided.html?person=${encodeURIComponent(person)}&request=${requestId}`
      : `request-detail.html?id=${requestId}`;
  });

  const warning = document.querySelector("[data-stage-warning]");
  const showWarning = (message) => { warning.textContent = message; warning.hidden = false; };
  const clearWarning = () => { warning.hidden = true; };
  const contactPattern = (text) => {
    const phone = /(?:\+?\d[\d\s().-]{5,}\d)/;
    const url = /(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|me|co)\b)/i;
    const username = /@[a-z0-9._-]{2,}/i;
    const social = /(instagram|insta(?:gram)?|snapchat|telegram|tiktok|whatsapp|facebook|wechat|ئینستاګرام|سنەپچات|تەلگرام|تیکتۆک|واتساپ|فەیسبووک)/i;
    return phone.test(text) || url.test(text) || username.test(text) || social.test(text);
  };
  const contactWarning = "بۆ پاراستنی نهێنیەت، زانیاریی پەیوەندی (••••) لەم قۆناغەدا ناتوانرێت بڵاوبکرێتەوە.";

  const confirmation = document.querySelector("[data-stage-confirmation]");
  const confirmationCopy = document.querySelector("[data-stage-confirm-copy]");
  const quietState = document.querySelector("[data-stage-quiet-state]");
  const faceRequest = document.querySelector(".face-request");
  const postFaceNotice = document.querySelector("[data-post-face-notice]");
  const postFaceNoticeCopy = document.querySelector("[data-post-face-notice-copy]");
  const conditionPrompt = document.querySelector("[data-condition-compose-prompt]");
  const postFaceEnd = document.querySelector("[data-post-face-end]");
  let safetyChoice = "";

  const hideActiveFlow = () => {
    document.querySelector("#guidedForm")?.setAttribute("hidden", "");
    document.querySelector(".guided-intro")?.setAttribute("hidden", "");
    document.querySelector(".conversation-status")?.setAttribute("hidden", "");
    document.querySelector(".message-list")?.setAttribute("hidden", "");
    document.querySelector(".conversation-composer")?.setAttribute("hidden", "");
    faceRequest?.setAttribute("hidden", "");
    postFaceNotice?.setAttribute("hidden", "");
    postFaceEnd?.setAttribute("hidden", "");
    document.querySelector("[data-stage-safety]")?.setAttribute("hidden", "");
  };
  const showQuietState = (title, copy, closePostFace = false) => {
    hideActiveFlow();
    clearWarning();
    confirmation.hidden = true;
    document.querySelector("[data-stage-quiet-title]").textContent = title;
    document.querySelector("[data-stage-quiet-copy]").textContent = copy;
    quietState.hidden = false;
    if (closePostFace) {
      window.history.replaceState(null, "", `conversation.html?person=${encodeURIComponent(person)}&request=${requestId}&postFace=1&closed=1`);
    }
    quietState.focus();
  };
  const requestConfirmation = (choice) => {
    safetyChoice = choice;
    confirmationCopy.textContent = choice === "end"
      ? "دڵنیایت دەتەوێت ئەم ناساندنە بە هێواشی کۆتایی پێ بهێنیت؟"
      : "دڵنیایت دەتەوێت بلۆککردن لەم prototype ـەدا تاقی بکەیتەوە؟";
    confirmation.hidden = false;
    confirmation.querySelector("[data-stage-confirm]").focus();
  };

  document.querySelectorAll("[data-stage-safety-choice]").forEach((button) => button.addEventListener("click", () => {
    const choice = button.dataset.stageSafetyChoice;
    const menu = document.querySelector("[data-stage-safety]");
    menu.open = false;
    if (choice === "report") {
      showWarning("ڕاپۆرت لەم prototype ـەدا تەنها دۆخێکی پیشاندانییە؛ هیچ ڕاپۆرتێکی ڕاستەقینە نەنێردراوە.");
      return;
    }
    requestConfirmation(choice);
  }));
  document.querySelector("[data-stage-cancel]")?.addEventListener("click", () => { confirmation.hidden = true; });
  document.querySelector("[data-stage-confirm]")?.addEventListener("click", () => {
    if (safetyChoice === "end") {
      showQuietState("ئەم ناساندنە بە هێواشی کۆتایی پێ هات.", "هیچ هۆکارێکی تایبەت بۆ لای دووەم نیشان نادرێت.", isPostFace);
    } else {
      showQuietState("بلۆککردن لەم prototype ـەدا تەنها پیشاندانییە.", "هیچ کارێکی ڕاستەقینە لەسەر هەژمارەکان جێبەجێ نەکرا.", isPostFace);
    }
  });

  if (guidedPage) {
    const form = document.querySelector("#guidedForm");
    const fields = [...form.querySelectorAll("textarea")];
    fields.forEach((field) => {
      const counter = document.querySelector(`#${field.id}-count`);
      const update = () => { counter.textContent = `${field.value.length} / ${field.maxLength}`; };
      field.addEventListener("input", update);
      update();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearWarning();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (fields.some((field) => contactPattern(field.value))) { showWarning(contactWarning); return; }
      window.location.href = `conversation.html?person=${encodeURIComponent(person)}&request=${requestId}`;
    });
    return;
  }

  const input = document.querySelector("#conversationMessage");
  if (isPostFace) {
    faceRequest.hidden = true;
    postFaceEnd.hidden = false;
    postFaceNotice.hidden = false;
    postFaceNoticeCopy.textContent = isConditional
      ? "لە پێش بەردەوامبووندا خاڵێکی گرنگ هەیە بۆ گفتوگۆ."
      : "ڕووکان تەنها یەکجار پیشان دران؛ گفتوگۆ بە شێوەی نهێنی بەردەوامە.";
    if (selfConditional) {
      conditionPrompt.hidden = false;
      input.placeholder = "مەرج یان نیگەرانییەکەت بە ڕێزەوە بنووسە…";
      input.focus();
    }
    postFaceEnd.addEventListener("click", () => requestConfirmation("end"));
  }

  if (isClosed) {
    showQuietState("ئەم ناساندنە بە هێواشی کۆتایی پێ هات.", "دەستگەیشتن بە پیشاندانی تایبەتی ڕوو و گفتوگۆ لابرا.", true);
    return;
  }

  let remainingMessages = 8;
  const messageCount = document.querySelector("[data-message-remaining]");
  const messageList = document.querySelector("[data-message-list]");
  const composer = document.querySelector("#conversationForm");
  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    clearWarning();
    if (!composer.checkValidity()) { composer.reportValidity(); return; }
    if (contactPattern(input.value)) { showWarning(contactWarning); return; }
    const message = document.createElement("p");
    message.className = "message message-self";
    message.textContent = input.value.trim();
    messageList.append(message);
    input.value = "";
    remainingMessages = Math.max(0, remainingMessages - 1);
    messageCount.textContent = remainingMessages;
    message.scrollIntoView({ block: "nearest" });
    input.focus();
  });
  document.querySelector("[data-face-request]")?.addEventListener("click", () => {
    // Replacing this pre-face page keeps an old face request out of the
    // browser history once the one-time reveal has been decided.
    window.location.replace(`face-reveal.html?person=${encodeURIComponent(person)}&request=${requestId}`);
  });
})();
