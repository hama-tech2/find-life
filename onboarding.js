(() => {
  const page = document.querySelector("[data-onboarding-page]");
  if (!page) return;

  const form = document.querySelector("[data-onboarding-form]");
  const error = document.querySelector("[data-onboarding-error]");
  const dobInput = form.elements.dob;
  const selfButtons = [...document.querySelectorAll("[data-self]")];
  const seekingButtons = [...document.querySelectorAll("[data-seeking]")];
  const valueButtons = [...document.querySelectorAll("[data-onboarding-value]")];
  const values = new Set();
  let self = "";
  let seeking = "";

  const eligibleDate = new Date();
  eligibleDate.setFullYear(eligibleDate.getFullYear() - 18);
  dobInput.max = eligibleDate.toISOString().slice(0, 10);

  const ageFromDate = (value) => {
    const birthday = new Date(`${value}T00:00:00`);
    if (Number.isNaN(birthday.getTime())) return -1;
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const beforeBirthday = today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate());
    if (beforeBirthday) age -= 1;
    return age;
  };

  const choose = (buttons, value, key, assign) => {
    assign(value);
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset[key] === value)));
    error.hidden = true;
  };

  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
  };

  selfButtons.forEach((button) => button.addEventListener("click", () => choose(selfButtons, button.dataset.self, "self", (value) => { self = value; })));
  seekingButtons.forEach((button) => button.addEventListener("click", () => choose(seekingButtons, button.dataset.seeking, "seeking", (value) => { seeking = value; })));

  valueButtons.forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.onboardingValue;
    if (values.has(value)) {
      values.delete(value);
      button.setAttribute("aria-pressed", "false");
      error.hidden = true;
      return;
    }
    if (values.size >= 3) {
      showError("تەنها تا ٣ بەها هەڵبژێرە.");
      return;
    }
    values.add(value);
    button.setAttribute("aria-pressed", "true");
    error.hidden = true;
  }));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.hidden = true;

    const dob = dobInput.value;
    if (!dob) {
      form.reportValidity();
      return;
    }
    if (ageFromDate(dob) < 18) {
      showError("تەنها کەسانی 18+ دەتوانن بەردەوام بن. بەرواری لەدایکبوونت تایبەتی دەمێنێتەوە.");
      dobInput.focus();
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const city = form.elements.city.value;
    const minimum = Number(form.elements["min-age"].value);
    const maximum = Number(form.elements["max-age"].value);
    if (!self || !seeking) {
      showError("تکایە «من» و «بەدوای» هەڵبژێرە.");
      return;
    }
    if (minimum < 18) {
      showError("تەمەنی کەمترین نابێت لە 18 کەمتر بێت.");
      return;
    }
    if (maximum < minimum) {
      showError("تەمەنی زۆرترین دەبێت یەکسان یان گەورەتر بێت لە کەمترین.");
      return;
    }
    if (values.size === 0) {
      showError("تکایە لانیکەم یەک بەهای گرنگ هەڵبژێرە.");
      return;
    }

    const query = new URLSearchParams({
      onboarded: "1",
      city,
      minAge: String(minimum),
      maxAge: String(maximum),
      seeking,
      self,
      values: [...values].join(",")
    });
    window.location.href = `discover.html?${query.toString()}`;
  });
})();
