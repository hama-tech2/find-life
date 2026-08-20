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
  const contactState = isPostFace ? params.get("contact") : "";
  const isClosed = isConversation && params.has("closed");
  const isInactive = isConversation && (params.get("inactive") === "1" || params.get("expired") === "1");
  const page = guidedPage || conversationPage;
  if (!page) return;
  const safety = window.FindYourLifeSafety;
  const safetySubject = `request:${requestId}`;

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
  const contactExchangePanel = document.querySelector("[data-contact-exchange-panel]");
  const contactExchangeStatus = document.querySelector("[data-contact-exchange-status]");
  const contactExchangeButton = document.querySelector("[data-contact-exchange]");
  let safetyChoice = "";
  let confirmationReturnFocus = null;

  const hideActiveFlow = () => {
    document.querySelector("#guidedForm")?.setAttribute("hidden", "");
    document.querySelector(".guided-intro")?.setAttribute("hidden", "");
    document.querySelector(".conversation-status")?.setAttribute("hidden", "");
    document.querySelector(".message-list")?.setAttribute("hidden", "");
    document.querySelector(".conversation-composer")?.setAttribute("hidden", "");
    faceRequest?.setAttribute("hidden", "");
    postFaceNotice?.setAttribute("hidden", "");
    postFaceEnd?.setAttribute("hidden", "");
    contactExchangePanel?.setAttribute("hidden", "");
    document.querySelector("[data-stage-safety]")?.setAttribute("hidden", "");
    document.querySelector("[data-stage-back]")?.setAttribute("hidden", "");
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
  const requestConfirmation = (choice, trigger) => {
    safetyChoice = choice;
    confirmationReturnFocus = trigger?.closest("details")?.querySelector("summary") || trigger || document.activeElement;
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
      const context = guidedPage ? "guided" : (isPostFace ? "post-face" : "conversation");
      const returnUrl = `${window.location.pathname.split("/").pop()}${window.location.search}`;
      window.location.href = safety.reportUrl({ person, context, subject: safetySubject, returnUrl, active: true });
      return;
    }
    if (choice === "block") {
      safety.confirmBlock({
        subject: safetySubject,
        trigger: button,
        onConfirm: () => {
          showQuietState("ئەم ناساندنە کۆتایی هات.", "پەیوەندیی زیاتر لەم prototype ـەدا بەردەست نییە و هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.", isPostFace);
          const pageName = guidedPage ? "guided.html" : "conversation.html";
          window.history.replaceState(null, "", `${pageName}?person=${encodeURIComponent(person)}&request=${requestId}&blocked=1`);
        }
      });
      return;
    }
    requestConfirmation(choice, button);
  }));
  document.querySelector("[data-stage-cancel]")?.addEventListener("click", () => {
    confirmation.hidden = true;
    confirmationReturnFocus?.focus();
  });
  document.querySelector("[data-stage-confirm]")?.addEventListener("click", () => {
    if (safetyChoice === "end") {
      safety.markClosed(safetySubject);
      showQuietState("ئەم ناساندنە کۆتایی هات.", "هیچ هۆکارێکی تایبەت بۆ لای دووەم نیشان نادرێت.", isPostFace);
      if (!isPostFace) {
        const pageName = guidedPage ? "guided.html" : "conversation.html";
        window.history.replaceState(null, "", `${pageName}?person=${encodeURIComponent(person)}&request=${requestId}&closed=1`);
      }
    } else {
      showQuietState("بلۆککردن لەم prototype ـەدا تەنها پیشاندانییە.", "هیچ کارێکی ڕاستەقینە لەسەر هەژمارەکان جێبەجێ نەکرا.", isPostFace);
    }
  });

  if (guidedPage) {
    const guidedBlocked = safety.isBlocked(safetySubject) || params.get("blocked") === "1";
    const guidedClosed = safety.isClosed(safetySubject) || params.get("closed") === "1";
    if (guidedBlocked || guidedClosed) {
      showQuietState("ئەم ناساندنە کۆتایی هات.", "پەیوەندیی زیاتر لەم prototype ـەدا بەردەست نییە و هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.");
      window.history.replaceState(null, "", `guided.html?person=${encodeURIComponent(person)}&request=${requestId}&${guidedBlocked ? "blocked" : "closed"}=1`);
      return;
    }
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
  const conversationBlocked = safety.isBlocked(safetySubject) || params.get("blocked") === "1";
  const conversationClosed = safety.isClosed(safetySubject) || params.get("closed") === "1";
  if (conversationBlocked || conversationClosed) {
    showQuietState("ئەم ناساندنە کۆتایی هات.", "پەیوەندیی زیاتر لەم prototype ـەدا بەردەست نییە و هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.", isPostFace);
    window.history.replaceState(null, "", `conversation.html?person=${encodeURIComponent(person)}&request=${requestId}${isPostFace ? "&postFace=1" : ""}&${conversationBlocked ? "blocked" : "closed"}=1`);
    return;
  }
  if (isPostFace) {
    faceRequest.hidden = true;
    postFaceEnd.hidden = false;
    postFaceNotice.hidden = false;
    contactExchangePanel.hidden = false;
    postFaceNoticeCopy.textContent = isConditional
      ? "لە پێش بەردەوامبووندا خاڵێکی گرنگ هەیە بۆ گفتوگۆ."
      : "ڕووکان تەنها یەکجار پیشان دران؛ گفتوگۆ بە شێوەی نهێنی بەردەوامە.";
    if (selfConditional) {
      conditionPrompt.hidden = false;
      input.placeholder = "مەرج یان نیگەرانییەکەت بە ڕێزەوە بنووسە…";
      input.focus();
    }
    if (contactState === "exchanged") {
      contactExchangeStatus.textContent = "پەیوەندی گۆڕدراوەتەوە.";
      contactExchangeStatus.hidden = false;
      contactExchangeButton.hidden = true;
    } else if (contactState === "not-ready") {
      contactExchangeStatus.textContent = "لای دووەم ئێستا ئامادە نییە؛ گفتوگۆکە بەردەوامە و دواتر دەتوانیت دووبارە داوا بکەیت.";
      contactExchangeStatus.hidden = false;
    }
    contactExchangeButton.addEventListener("click", () => {
      const flags = `${isConditional ? "&conditional=1" : ""}${selfConditional ? "&selfConditional=1" : ""}`;
      window.location.href = `contact-exchange.html?person=${encodeURIComponent(person)}&request=${encodeURIComponent(requestId)}&postFace=1${flags}`;
    });
    postFaceEnd.addEventListener("click", () => requestConfirmation("end", postFaceEnd));
  }

  if (isClosed) {
    showQuietState("ئەم ناساندنە کۆتایی هات.", "دەستگەیشتن بە پیشاندانی تایبەتی ڕوو و گفتوگۆ لابرا.", true);
    return;
  }

  if (isInactive) {
    const quietBack = document.querySelector("[data-stage-quiet-back]");
    quietBack.href = "requests.html?tab=received";
    quietBack.textContent = "گەڕانەوە بۆ داواکارییەکان";
    showQuietState("ئەم ناساندنە چیتر چالاک نییە.", "ئەمە دۆخێکی گۆڕاوەی prototype ـە و هیچ کەسێک تاوانبار ناکرێت.");
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
