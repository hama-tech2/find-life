(() => {
  const requestData = {
    r1: { tab: "received", direction: "received", lifecycle: "new", name: "ئەحمەد", age: "31 ساڵ", city: "سلێمانی", occupation: "گەندەڵازی مەدەنی", status: "هاتووە • نوێ", intention: "بۆ ژیانێکی هاوبەش و هاوسەرگیرییەکی جدی دەگەڕێم. دەمەوێت هەموو هەنگاوێک بە ڕێز و گفتوگۆ بێت.", value: "ڕاستگۆیی، ڕێز و پشتیوانیی یەکتر بۆم گرنگترینن.", question: "دەمەوێت زیاتر لە شێوازی گفتوگۆ و بیرۆکەت بۆ ژیانی خێزانی بزانم." },
    r2: { tab: "received", direction: "received", lifecycle: "waiting", name: "ڕۆژین", age: "26 ساڵ", city: "دهۆک", occupation: "خوێندکاریی ماستەر", status: "هاتووە • چاوەڕێی بڕیارتە", intention: "ئامادەم بۆ ناساندنێکی ڕێک و بە مەبەستی دروستکردنی خێزانم.", value: "متمانە، ئارامی و ڕێزکردن لە خێزان بۆم گرنگن.", question: "دەمەوێت بزانم چۆن سەیری هاوبەشبوون و بەرپرسیارێتی لە ماڵدا دەکەیت." },
    r3: { tab: "received", direction: "received", lifecycle: "accepted", name: "دیلان", age: "30 ساڵ", city: "هەولێر", occupation: "کارمەندی فەرمی", status: "پەسەندکراوە • ناسینەکە چالاکە", intention: "بۆ هاوسەرگیرییەکی ئارام و بەرپرسیارانە دەگەڕێم.", value: "ڕاستگۆیی، ڕێکخستن و متمانە بۆم گرنگن.", question: "دەمەوێت لە پلانت بۆ کار و ژیانی خێزانی تێبگەم." },
    s1: { tab: "sent", direction: "sent", lifecycle: "waiting", name: "سارا", age: "27 ساڵ", city: "هەولێر", occupation: "مامۆستای قوتابخانە", status: "چاوەڕێی وەڵام", intention: "بۆ ژیانێکی هاوبەش و بەڕێز دەگەڕێم، لەسەر بنەمای ڕێز و گفتوگۆ.", value: "ڕاستگۆیی و ئارامی بۆم گرنگن.", question: "دەمەوێت زیاتر لە شێوازی ژیانت و بیرۆکەت بۆ خێزان بزانم." },
    s2: { tab: "sent", direction: "sent", lifecycle: "expired", name: "ڕۆژین", age: "26 ساڵ", city: "دهۆک", occupation: "خوێندکاریی ماستەر", status: "ئەم ناساندنە چیتر چالاک نییە.", intention: "بۆ ناساندنێکی جدی و بەرپرسیارانە دەگەڕێم.", value: "متمانە و ڕێز بۆم گرنگن.", question: "دەمەوێت زیاتر لە بەهاکانی خێزانی بزانم." },
    s3: { tab: "sent", direction: "sent", lifecycle: "unavailable", name: "ئاوات", age: "32 ساڵ", city: "سلێمانی", occupation: "پەرستار", status: "ئەم ناساندنە چیتر بەردەست نییە.", intention: "دەمەوێت ناساندنێکی جدی و بە ئارامی هەبێت.", value: "ڕێز و بەرپرسیارێتی بۆم گرنگن.", question: "دەمەوێت لە چاوەڕوانییەکانت بۆ ژیانی هاوبەش بزانم." },
  };
  const setText = (selector, text) => { const element = document.querySelector(selector); if (element) element.textContent = text; };

  const inbox = document.querySelector("[data-inbox-page]");
  if (inbox) {
    const tabs = [...document.querySelectorAll("[data-inbox-tab]")];
    const panels = [...document.querySelectorAll("[data-inbox-panel]")];
    const inboxParams = new URLSearchParams(window.location.search);
    const requestedTab = inboxParams.get("tab");
    const forcedEmpty = inboxParams.get("empty");
    if (forcedEmpty === "received" || forcedEmpty === "sent") {
      document.querySelectorAll(`[data-inbox-panel="${forcedEmpty}"] [data-request-item]`).forEach((item) => { item.hidden = true; });
    }
    const syncEmptyState = (tab) => {
      const panel = document.querySelector(`[data-inbox-panel="${tab}"]`);
      const emptyState = document.querySelector(`[data-inbox-empty="${tab}"]`);
      const hasItems = [...panel.querySelectorAll("[data-request-item]")].some((item) => !item.hidden);
      emptyState.hidden = hasItems;
    };
    const setTab = (tab, updateUrl = false) => {
      const activeTab = tab === "sent" ? "sent" : "received";
      tabs.forEach((button) => button.setAttribute("aria-selected", String(button.dataset.inboxTab === activeTab)));
      panels.forEach((panel) => { panel.hidden = panel.dataset.inboxPanel !== activeTab; });
      syncEmptyState(activeTab);
      if (updateUrl) window.history.replaceState(null, "", `requests.html?tab=${activeTab}${forcedEmpty ? `&empty=${forcedEmpty}` : ""}`);
    };
    setTab(requestedTab);
    tabs.forEach((button) => button.addEventListener("click", () => setTab(button.dataset.inboxTab, true)));
    document.querySelectorAll("[data-open-request]").forEach((button) => button.addEventListener("click", () => { window.location.href = `request-detail.html?id=${button.dataset.openRequest}`; }));
  }

  const detail = document.querySelector("[data-request-detail]");
  if (!detail) return;
  const requestId = new URLSearchParams(window.location.search).get("id");
  const request = requestData[requestId] || requestData.r1;
  const safety = window.FindYourLifeSafety;
  const subject = `request:${requestId || "r1"}`;
  setText("[data-detail-name]", request.name); setText("[data-detail-age]", request.age); setText("[data-detail-city]", request.city); setText("[data-detail-occupation]", request.occupation); setText("[data-detail-status]", request.status); setText("[data-answer-intention]", request.intention); setText("[data-answer-value]", request.value); setText("[data-answer-question]", request.question);
  document.querySelectorAll("[data-inbox-back]").forEach((link) => { link.href = `requests.html?tab=${request.tab}`; });
  const receivedActions = document.querySelector("[data-received-actions]");
  const safetyMenu = document.querySelector("[data-safety-menu]");
  if (request.direction === "sent") { receivedActions.hidden = true; safetyMenu.hidden = true; }

  const actionState = document.querySelector("[data-action-state]");
  const showState = (title, copy, showGuided = false) => {
    receivedActions.hidden = true;
    document.querySelector("[data-close-confirmation]").hidden = true;
    safetyMenu.hidden = true;
    setText("[data-action-title]", title); setText("[data-action-copy]", copy);
    const guidedContinue = document.querySelector("[data-guided-continue]");
    guidedContinue.hidden = !showGuided;
    if (showGuided) guidedContinue.href = `guided.html?person=${encodeURIComponent(request.name)}&request=${requestId || "r1"}`;
    actionState.hidden = false;
    actionState.focus();
  };
  if (request.lifecycle === "accepted") {
    showState("داواکارییەکە پەسەند کراوە.", "ناسینەکە چالاکە و دەتوانیت بەردەوام بیت.", true);
  } else if (request.lifecycle === "expired" || request.lifecycle === "unavailable") {
    showState("ئەم ناساندنە چیتر چالاک نییە.", "بێ فشار دەتوانیت بگەڕێیتەوە بۆ داواکارییەکان.");
  }
  if (safety.isBlocked(subject) || new URLSearchParams(window.location.search).get("blocked") === "1") {
    showState("ئەم ناساندنە کۆتایی هات.", "پەیوەندیی زیاتر لەم prototype ـەدا بەردەست نییە و هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.");
    window.history.replaceState(null, "", `request-detail.html?id=${requestId || "r1"}&blocked=1`);
  }
  document.querySelector("[data-accept-request]")?.addEventListener("click", () => showState("داواکارییەکە لەم prototype ـەدا پەسەند کرا.", "دەتوانیت لەم prototype ـەدا بچیتە قۆناغی ناسینی ڕێنمایی‌کراو.", true));
  const closeConfirmation = document.querySelector("[data-close-confirmation]");
  document.querySelector("[data-show-close]")?.addEventListener("click", () => { closeConfirmation.hidden = false; closeConfirmation.querySelector("[data-confirm-close]").focus(); });
  document.querySelector("[data-cancel-close]")?.addEventListener("click", () => { closeConfirmation.hidden = true; });
  document.querySelector("[data-confirm-close]")?.addEventListener("click", () => showState("ئەم ناساندنە کۆتایی هات.", "هیچ هۆکارێکی تایبەت بۆ لای دووەم نیشان نادرێت."));

  document.querySelectorAll("[data-safety-choice]").forEach((button) => button.addEventListener("click", () => {
    safetyMenu.open = false;
    if (button.dataset.safetyChoice === "report") {
      window.location.href = safety.reportUrl({ person: request.name, context: "request", subject, returnUrl: `request-detail.html?id=${requestId || "r1"}`, active: request.direction === "received" });
      return;
    }
    safety.confirmBlock({
      subject,
      trigger: button,
      onConfirm: () => {
        showState("ئەم ناساندنە کۆتایی هات.", "پەیوەندیی زیاتر لەم prototype ـەدا بەردەست نییە و هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.");
        window.history.replaceState(null, "", `request-detail.html?id=${requestId || "r1"}&blocked=1`);
      }
    });
  }));
})();
