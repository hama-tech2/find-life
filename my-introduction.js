(() => {
  const page = document.querySelector("[data-my-introduction-page]");
  if (!page) return;

  const state = window.FindYourLifeIntroduction;
  const empty = document.querySelector("[data-intro-empty]");
  const published = document.querySelector("[data-intro-published]");
  const toggle = document.querySelector("[data-intro-toggle]");
  const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };

  function render() {
    const introduction = state.get();
    empty.hidden = Boolean(introduction);
    published.hidden = !introduction;
    if (!introduction) return;

    const isHidden = introduction.status === "hidden";
    setText("[data-intro-name]", state.account.displayName);
    setText("[data-intro-age]", `${state.account.age} ساڵ`);
    setText("[data-intro-city]", introduction.city);
    setText("[data-intro-occupation]", introduction.occupation);
    setText("[data-intro-about]", introduction.about);
    setText("[data-intro-status]", isHidden ? "ئێستا شاراوەیە" : "چالاکە لە prototype ـدا");
    document.querySelector("[data-intro-hidden-note]").hidden = !isHidden;
    toggle.textContent = isHidden ? "پیشاندانی ناساندن" : "شاردنەوەی ناساندن";

    const values = document.querySelector("[data-intro-values]");
    values.replaceChildren();
    introduction.values.forEach((value) => { const tag = document.createElement("span"); tag.textContent = value; values.append(tag); });
  }

  toggle.addEventListener("click", () => {
    const introduction = state.get();
    if (!introduction) return;
    state.save({ ...introduction, status: introduction.status === "hidden" ? "active" : "hidden" });
    render();
  });
  render();
})();
