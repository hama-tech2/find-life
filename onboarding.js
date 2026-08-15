(() => {
  const page = document.querySelector("[data-onboarding-page]");
  if (!page) return;

  const form = document.querySelector("[data-onboarding-form]");
  const error = document.querySelector("[data-onboarding-error]");
  const selfButtons = [...document.querySelectorAll("[data-self]")];
  const seekingButtons = [...document.querySelectorAll("[data-seeking]")];
  let self = "";
  let seeking = "";

  const choose = (buttons, value, assign) => {
    assign(value);
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.self === value || button.dataset.seeking === value)));
  };
  selfButtons.forEach((button) => button.addEventListener("click", () => choose(selfButtons, button.dataset.self, (value) => { self = value; })));
  seekingButtons.forEach((button) => button.addEventListener("click", () => choose(seekingButtons, button.dataset.seeking, (value) => { seeking = value; })));
  const showError = (message) => { error.textContent = message; error.hidden = false; };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const city = form.elements.city.value;
    const minimum = Number(form.elements["min-age"].value);
    const maximum = Number(form.elements["max-age"].value);
    if (!self || !seeking) { showError("تکایە «من» و «بەدوای» هەڵبژێرە."); return; }
    if (minimum < 18) { showError("تەمەنی کەمترین نابێت لە 18 کەمتر بێت."); return; }
    if (maximum < minimum) { showError("تەمەنی زۆرترین دەبێت یەکسان یان گەورەتر بێت لە کەمترین."); return; }
    const query = new URLSearchParams({ onboarded: "1", city, minAge: String(minimum), maxAge: String(maximum), seeking });
    window.location.href = `discover.html?${query.toString()}`;
  });
})();
