(() => {
  const page = document.querySelector("[data-contact-exchange-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const person = params.get("person") || "کەسی بەرامبەر";
  const requestId = params.get("request") || "r1";
  if (params.get("postFace") !== "1") {
    window.location.replace(`conversation.html?person=${encodeURIComponent(person)}&request=${encodeURIComponent(requestId)}`);
    return;
  }
  const conditional = params.get("conditional") === "1";
  const selfConditional = params.get("selfConditional") === "1";
  if (params.get("revealed") === "1") {
    const flags = `${conditional ? "&conditional=1" : ""}${selfConditional ? "&selfConditional=1" : ""}`;
    window.location.replace(`conversation.html?person=${encodeURIComponent(person)}&request=${encodeURIComponent(requestId)}&postFace=1${flags}&contact=exchanged`);
    return;
  }
  const safety = window.FindYourLifeSafety;
  const subject = `request:${requestId}`;
  const states = [...document.querySelectorAll("[data-contact-state]")];
  const form = document.querySelector("[data-contact-form]");
  const error = document.querySelector("[data-contact-error]");
  const endConfirmation = document.querySelector("[data-contact-end-confirmation]");
  const closure = document.querySelector("[data-contact-closure]");
  const safetyMenu = document.querySelector("[data-contact-safety]");
  const backLink = document.querySelector("[data-contact-back]");
  let preparedContact = null;
  let revealedInThisVisit = false;
  let endTrigger = null;

  const flagQuery = () => `${conditional ? "&conditional=1" : ""}${selfConditional ? "&selfConditional=1" : ""}`;
  const conversationUrl = (contactState = "") => `conversation.html?person=${encodeURIComponent(person)}&request=${encodeURIComponent(requestId)}&postFace=1${flagQuery()}${contactState ? `&contact=${contactState}` : ""}`;
  const contactUrl = () => `contact-exchange.html?person=${encodeURIComponent(person)}&request=${encodeURIComponent(requestId)}&postFace=1${flagQuery()}`;

  document.querySelector("[data-contact-person]").textContent = person;
  backLink.href = conversationUrl();

  const clearRenderedContacts = () => {
    document.querySelectorAll("[data-own-contact-name],[data-own-contact-relationship],[data-own-contact-phone],[data-other-contact-name],[data-other-contact-relationship],[data-other-contact-phone]").forEach((element) => { element.textContent = ""; });
    document.querySelector("[data-own-name-row]").hidden = true;
    document.querySelector("[data-own-relationship-row]").hidden = true;
  };
  const clearContactData = () => {
    preparedContact = null;
    form.reset();
    form.querySelector('input[name="contact-type"][value="self"]').checked = true;
    form.querySelectorAll('input:not([type="radio"])').forEach((input) => { input.value = ""; });
    clearRenderedContacts();
  };
  const showState = (name) => {
    states.forEach((state) => { state.hidden = state.dataset.contactState !== name; });
    endConfirmation.hidden = true;
    error.hidden = true;
    const active = states.find((state) => state.dataset.contactState === name);
    active?.focus();
  };
  const showClosure = (mode) => {
    const wasRevealed = revealedInThisVisit;
    if (mode === "ended") safety.markClosed(subject);
    clearContactData();
    states.forEach((state) => { state.hidden = true; });
    endConfirmation.hidden = true;
    safetyMenu.hidden = true;
    backLink.hidden = true;
    closure.hidden = false;
    document.querySelector("[data-contact-closure-copy]").textContent = wasRevealed
      ? "ناسینەکە داخرا. زانیارییە پێشتر بینراوەکان ناتوانرێن بگەڕێندرێنەوە. هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت."
      : "هیچ زانیارییەکی پەیوەندی پیشان نادرێت و هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.";
    window.history.replaceState(null, "", `${contactUrl()}&${mode}=1`);
    closure.focus();
  };
  const leaveForConversation = (contactState = "") => {
    clearContactData();
    window.location.replace(conversationUrl(contactState));
  };
  const validPhone = (value) => {
    const normalized = value.trim();
    const digits = normalized.match(/[0-9٠-٩۰-۹]/g) || [];
    return digits.length >= 7 && digits.length <= 15 && /^\+?[0-9٠-٩۰-۹][0-9٠-٩۰-۹\s().-]*$/.test(normalized);
  };
  const updateContactType = () => {
    const type = form.elements["contact-type"].value;
    document.querySelector('[data-contact-fields="self"]').hidden = type !== "self";
    document.querySelector('[data-contact-fields="trusted"]').hidden = type !== "trusted";
    error.hidden = true;
  };
  const renderMutualReveal = () => {
    if (!preparedContact) return;
    if (preparedContact.type === "trusted") {
      document.querySelector("[data-own-name-row]").hidden = false;
      document.querySelector("[data-own-relationship-row]").hidden = false;
      document.querySelector("[data-own-contact-name]").textContent = preparedContact.name;
      document.querySelector("[data-own-contact-relationship]").textContent = preparedContact.relationship;
    }
    document.querySelector("[data-own-contact-phone]").textContent = preparedContact.phone;
    const otherContact = { name: "هێمن", relationship: "برا", phone: "0750 000 1234" };
    document.querySelector("[data-other-contact-name]").textContent = otherContact.name;
    document.querySelector("[data-other-contact-relationship]").textContent = otherContact.relationship;
    document.querySelector("[data-other-contact-phone]").textContent = otherContact.phone;
    revealedInThisVisit = true;
    window.history.replaceState(null, "", `${contactUrl()}&revealed=1`);
    showState("reveal");
  };

  backLink.addEventListener("click", (event) => { event.preventDefault(); leaveForConversation(revealedInThisVisit ? "exchanged" : ""); });
  document.querySelector("[data-contact-not-now]").addEventListener("click", () => leaveForConversation());
  document.querySelector("[data-contact-consent]").addEventListener("click", () => showState("consent-waiting"));
  document.querySelectorAll("[data-simulate-consent]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.simulateConsent === "not-ready") leaveForConversation("not-ready");
    else showState("prepare");
  }));
  form.querySelectorAll('input[name="contact-type"]').forEach((input) => input.addEventListener("change", updateContactType));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = form.elements["contact-type"].value;
    if (type === "self") {
      const phone = form.elements["own-phone"].value.trim();
      if (!validPhone(phone)) {
        error.textContent = "تکایە ژمارەیەکی دروستی مۆبایل بنووسە.";
        error.hidden = false;
        form.elements["own-phone"].focus();
        return;
      }
      preparedContact = { type, phone };
    } else {
      const name = form.elements["trusted-name"].value.trim();
      const relationship = form.elements["trusted-relationship"].value.trim();
      const phone = form.elements["trusted-phone"].value.trim();
      if (!name || !relationship || !validPhone(phone)) {
        error.textContent = "تکایە ناو، پەیوەندی و ژمارەیەکی دروستی مۆبایل بنووسە. هیچ ڕۆڵێکی دیاریکراو بە زۆر پێویست نییە.";
        error.hidden = false;
        (!name ? form.elements["trusted-name"] : (!relationship ? form.elements["trusted-relationship"] : form.elements["trusted-phone"])).focus();
        return;
      }
      preparedContact = { type, name, relationship, phone };
    }
    showState("ready-waiting");
  });
  document.querySelector("[data-simulate-ready]").addEventListener("click", renderMutualReveal);
  document.querySelector("[data-return-after-reveal]").addEventListener("click", () => leaveForConversation("exchanged"));

  document.querySelectorAll("[data-contact-safety-choice]").forEach((button) => button.addEventListener("click", () => {
    const choice = button.dataset.contactSafetyChoice;
    safetyMenu.open = false;
    if (choice === "report") {
      const returnUrl = revealedInThisVisit ? conversationUrl("exchanged") : contactUrl();
      clearContactData();
      window.location.href = safety.reportUrl({ person, context: "contact-exchange", subject, returnUrl, active: true });
      return;
    }
    if (choice === "block") {
      safety.confirmBlock({ subject, trigger: button, onConfirm: () => showClosure("blocked") });
      return;
    }
    endTrigger = button;
    document.querySelector("[data-contact-end-copy]").textContent = revealedInThisVisit
      ? "دڵنیایت دەتەوێت ناسینەکە کۆتایی پێ بهێنیت؟ زانیارییە پێشتر بینراوەکان ناتوانرێن بگەڕێندرێنەوە."
      : "دڵنیایت دەتەوێت ئەم ناساندنە کۆتایی پێ بهێنیت؟ هیچ زانیارییەکی پەیوەندی پیشان نادرێت.";
    endConfirmation.hidden = false;
    document.querySelector("[data-confirm-contact-end]").focus();
  }));
  document.querySelector("[data-cancel-contact-end]").addEventListener("click", () => { endConfirmation.hidden = true; endTrigger?.closest("details")?.querySelector("summary")?.focus(); });
  document.querySelector("[data-confirm-contact-end]").addEventListener("click", () => showClosure("ended"));

  window.addEventListener("pagehide", clearContactData);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && revealedInThisVisit) window.location.replace(conversationUrl("exchanged"));
  });

  if (safety.isBlocked(subject) || params.get("blocked") === "1") showClosure("blocked");
  else if (safety.isClosed(subject)) showClosure("ended");
  else if (params.get("ended") === "1") showClosure("ended");
  else updateContactType();
})();
