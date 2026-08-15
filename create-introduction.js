(() => {
  const page = document.querySelector("[data-create-introduction-page]");
  if (!page) return;

  const shared = window.FindYourLifeIntroduction;
  const params = new URLSearchParams(window.location.search);
  const isEditing = params.get("mode") === "edit" && Boolean(shared.get());
  const form = document.querySelector("[data-create-form]");
  const error = document.querySelector("[data-create-error]");
  const progress = document.querySelector("[data-create-progress]");
  const steps = [...document.querySelectorAll("[data-create-step]")];
  const selectedValues = new Set();
  let activeStep = Math.min(3, Math.max(1, Number(params.get("step")) || 1));
  let draft = { city: "", occupation: "", education: "", about: "", minAge: "", maxAge: "", values: [], expectation: "", status: "active" };

  if (isEditing) draft = { ...draft, ...shared.get(), values: [...shared.get().values] };
  draft.values.forEach((value) => selectedValues.add(value));

  function showError(message) { error.textContent = message; error.hidden = false; }
  function clearError() { error.hidden = true; error.textContent = ""; }
  function setText(selector, value) { const element = document.querySelector(selector); if (element) element.textContent = value || ""; }
  function fillForm() {
    form.elements.city.value = draft.city;
    form.elements.occupation.value = draft.occupation;
    form.elements.education.value = draft.education;
    form.elements.about.value = draft.about;
    form.elements["min-age"].value = draft.minAge;
    form.elements["max-age"].value = draft.maxAge;
    form.elements.expectation.value = draft.expectation;
    document.querySelectorAll("[data-value]").forEach((button) => button.setAttribute("aria-pressed", String(selectedValues.has(button.dataset.value))));
  }
  function updateCounts() { document.querySelectorAll("[data-count]").forEach((counter) => { const field = form.elements[counter.dataset.count]; counter.textContent = `${field.value.length} / ${field.maxLength}`; }); }
  function saveStepOne() {
    if (!form.elements.city.checkValidity() || !form.elements.occupation.checkValidity() || !form.elements.about.checkValidity()) { form.reportValidity(); return false; }
    draft.city = form.elements.city.value; draft.occupation = form.elements.occupation.value.trim(); draft.education = form.elements.education.value.trim(); draft.about = form.elements.about.value.trim();
    return true;
  }
  function saveStepTwo() {
    const minimum = Number(form.elements["min-age"].value); const maximum = Number(form.elements["max-age"].value);
    if (!form.elements["min-age"].checkValidity() || !form.elements["max-age"].checkValidity() || !form.elements.expectation.checkValidity()) { form.reportValidity(); return false; }
    if (minimum < 18) { showError("تەمەنی کەمترین نابێت لە ١٨ کەمتر بێت."); return false; }
    if (maximum < minimum) { showError("تەمەنی زۆرترین دەبێت یەکسان یان گەورەتر بێت لە کەمترین."); return false; }
    if (!selectedValues.size) { showError("تکایە لانیکەم یەک بەها هەڵبژێرە."); return false; }
    draft.minAge = minimum; draft.maxAge = maximum; draft.values = [...selectedValues]; draft.expectation = form.elements.expectation.value.trim();
    return true;
  }
  function renderPreview() {
    setText("[data-preview-name]", shared.account.displayName); setText("[data-preview-age]", `${shared.account.age} ساڵ`); setText("[data-preview-city]", draft.city); setText("[data-preview-occupation]", draft.occupation); setText("[data-preview-about]", draft.about); setText("[data-preview-age-range]", `${draft.minAge}–${draft.maxAge} ساڵ`); setText("[data-preview-expectation]", draft.expectation);
    const education = document.querySelector("[data-preview-education]"); education.textContent = draft.education; education.hidden = !draft.education;
    const values = document.querySelector("[data-preview-values]"); values.replaceChildren(); draft.values.forEach((value) => { const item = document.createElement("span"); item.textContent = value; values.append(item); });
  }
  function setStep(step) {
    activeStep = step; clearError();
    steps.forEach((section) => { section.hidden = Number(section.dataset.createStep) !== step; });
    progress.textContent = `${["١", "٢", "٣"][step - 1]} لە ٣`;
    if (step === 3) renderPreview();
    const query = new URLSearchParams({ mode: isEditing ? "edit" : "create", step: String(step) });
    window.history.replaceState({}, "", `create-introduction.html?${query.toString()}`);
    document.querySelector(`[data-create-step="${step}"] h2`)?.focus?.();
  }

  fillForm(); updateCounts();
  document.querySelectorAll("textarea").forEach((field) => field.addEventListener("input", updateCounts));
  document.querySelectorAll("[data-value]").forEach((button) => button.addEventListener("click", () => {
    clearError();
    const value = button.dataset.value;
    if (selectedValues.has(value)) selectedValues.delete(value);
    else if (selectedValues.size < 3) selectedValues.add(value);
    else { showError("زۆرترین ٣ بەها دەتوانیت هەڵبژێریت."); return; }
    button.setAttribute("aria-pressed", String(selectedValues.has(value)));
  }));
  document.querySelector('[data-next-step="1"]').addEventListener("click", () => { clearError(); if (saveStepOne()) setStep(2); });
  document.querySelector('[data-next-step="2"]').addEventListener("click", () => { clearError(); if (saveStepTwo()) setStep(3); });
  document.querySelector('[data-previous-step="1"]').addEventListener("click", () => setStep(1));
  document.querySelector('[data-previous-step="2"]').addEventListener("click", () => setStep(2));
  document.querySelector("[data-publish-introduction]").addEventListener("click", () => {
    if (!shared.save({ ...draft, status: isEditing ? (shared.get()?.status || "active") : "active" })) { showError("پاشەکەوتکردنی prototype بەردەست نییە. تکایە دووبارە هەوڵ بدە."); return; }
    window.location.href = "my-introduction.html";
  });
  if (isEditing) document.querySelector("[data-publish-introduction]").textContent = "پاشەکەوتکردنی گۆڕانکارییەکان";
  setStep(activeStep);
})();
