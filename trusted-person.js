(() => {
  const page = document.querySelector("[data-handoff-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const person = params.get("person") || "ئەحمەد";
  const requestId = params.get("request") || "r1";
  const states = [...document.querySelectorAll("[data-handoff-state]")];
  const form = document.querySelector("[data-handoff-form]");
  const error = document.querySelector("[data-handoff-error]");
  const feedback = document.querySelector("[data-handoff-feedback]");
  const confirmation = document.querySelector("[data-handoff-confirmation]");
  const confirmationCopy = document.querySelector("[data-handoff-confirm-copy]");
  const roleButtons = [...document.querySelectorAll("[data-role]")];
  let selectedRole = "کەسی متمانەپێکراو";
  let ownContact = null;
  let pendingAction = "";
  const otherContact = { role: "برا", name: "کاروان", phone: "0750 555 8142" };

  document.querySelector("[data-handoff-back]").href = `conversation.html?person=${encodeURIComponent(person)}&request=${requestId}`;

  const showState = (name) => {
    states.forEach((state) => { state.hidden = state.dataset.handoffState !== name; });
    error.hidden = true;
    feedback.hidden = true;
    confirmation.hidden = true;
    const activeState = document.querySelector(`[data-handoff-state="${name}"]`);
    if (name !== "setup") activeState?.focus();
  };
  const showFeedback = (message) => { feedback.textContent = message; feedback.hidden = false; };
  const digitsOnly = (value) => value
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/\D/g, "");
  const validPhone = (value) => /^(?:964|0)?7\d{9}$/.test(digitsOnly(value));
  const setRole = (role) => {
    selectedRole = role;
    roleButtons.forEach((button) => { button.setAttribute("aria-pressed", String(button.dataset.role === role)); });
  };
  const showConfirmation = (action) => {
    pendingAction = action;
    confirmationCopy.textContent = action === "end"
      ? "دڵنیایت دەتەوێت ئەم ناسینە کۆتایی پێ بهێنیت؟ هیچ زانیارییەکی پەیوەندی پیشان نادرێت."
      : "دڵنیایت دەتەوێت لەم prototype ـەدا بلۆککردن تاقی بکەیتەوە؟";
    confirmation.hidden = false;
    document.querySelector("[data-handoff-confirm]").focus();
  };
  const closeIntroduction = (mode) => {
    ownContact = null;
    showState("closed");
    document.querySelector("[data-handoff-safety]").hidden = true;
    window.history.replaceState(null, "", `trusted-person.html?person=${encodeURIComponent(person)}&request=${requestId}&${mode}=1`);
  };
  const revealContacts = () => {
    document.querySelector("[data-own-role]").textContent = ownContact.role;
    document.querySelector("[data-own-name]").textContent = ownContact.name;
    document.querySelector("[data-own-phone]").textContent = ownContact.phone;
    document.querySelector("[data-other-contact-role]").textContent = otherContact.role;
    document.querySelector("[data-other-contact-name]").textContent = otherContact.name;
    document.querySelector("[data-other-contact-phone]").textContent = otherContact.phone;
    showState("reveal");
  };
  const completeHandoff = () => {
    ownContact = null;
    showState("complete");
    document.querySelector("[data-handoff-safety]").hidden = true;
    window.history.replaceState(null, "", `trusted-person.html?person=${encodeURIComponent(person)}&request=${requestId}&completed=1`);
  };

  roleButtons.forEach((button) => button.addEventListener("click", () => setRole(button.dataset.role)));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements["contact-name"].value.trim();
    const relationship = form.elements.relationship.value.trim();
    const phone = form.elements.phone.value.trim();
    if (name.length < 2 || relationship.length < 2 || !validPhone(phone)) {
      error.textContent = "تکایە ناو، پەیوەندی و ژمارەیەکی دروستی مۆبایل بنووسە.";
      error.hidden = false;
      return;
    }
    ownContact = { role: selectedRole, name, relationship, phone };
    showState("waiting");
  });
  document.querySelector("[data-simulate-mutual]").addEventListener("click", revealContacts);
  document.querySelector("[data-complete-handoff]").addEventListener("click", completeHandoff);
  document.querySelector("[data-show-end]").addEventListener("click", () => showConfirmation("end"));
  document.querySelector("[data-handoff-cancel]").addEventListener("click", () => { confirmation.hidden = true; });
  document.querySelector("[data-handoff-confirm]").addEventListener("click", () => closeIntroduction(pendingAction === "block" ? "blocked" : "ended"));
  document.querySelectorAll("[data-handoff-safety-choice]").forEach((button) => button.addEventListener("click", () => {
    const choice = button.dataset.handoffSafetyChoice;
    const menu = document.querySelector("[data-handoff-safety]");
    menu.open = false;
    if (choice === "report") {
      showFeedback("ڕاپۆرت لەم prototype ـەدا تەنها دۆخێکی پیشاندانییە؛ هیچ ڕاپۆرتێکی ڕاستەقینە نەنێردراوە.");
      return;
    }
    showConfirmation(choice);
  }));

  if (params.has("completed")) completeHandoff();
  else if (params.has("ended") || params.has("blocked")) closeIntroduction(params.has("blocked") ? "blocked" : "ended");
  else showState("setup");
})();
