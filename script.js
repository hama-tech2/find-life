(() => {
  const toast = document.querySelector("#toast");
  let toastTimer;

  const profiles = {
    sara: { displayName: "سارا", age: "27 ساڵ", city: "هەولێر", occupation: "مامۆستای قوتابخانە", education: "بەکالۆریۆس لە پەروەردە", values: ["خێزاندوست", "ئارام"], about: "کەسێکی ئارام و خێزاندوستم. خۆشم دەوێت ژیانێکی بەڕێز و هاوبەش بنیات بنێین.", preferredAge: "24–31 ساڵ", preferredValues: "ڕاستگۆیی، ڕێز، ئارامی", expectation: "پەیوەندییەکی جدی بۆ دروستکردنی خێزانێکی بەهێز." },
    ahmad: { displayName: "ئەحمەد", age: "31 ساڵ", city: "سلێمانی", occupation: "گەندەڵازی مەدەنی", education: "بەکالۆریۆس لە ئەندازیاری", values: ["جدی", "بەڕێز"], about: "ژیانێکی سادە و ڕێکخراوم خۆشدەوێت. بە دوای هاوسەرێکی هاوبەش و ڕاستگۆ دەگەڕێم.", preferredAge: "25–32 ساڵ", preferredValues: "ڕێز، گفتوگۆ، خێزان", expectation: "ئامادەی دروستکردنی ماڵێکی ئارام و پشتیوانیی یەکترم." },
    rojin: { displayName: "ڕۆژین", age: "26 ساڵ", city: "دهۆک", occupation: "خوێندکاریی ماستەر", education: "ماستەر لە کاروباری کۆمەڵایەتی", values: ["ڕێکخراو", "متمانەپێکراو"], about: "باوەڕم بە ڕێز و گفتوگۆی ڕاستە. دەمەوێت هاوسەرگیری بە هێواشی و بە مەبەست دەست پێ بکات.", preferredAge: "26–33 ساڵ", preferredValues: "متمانە، بەرپرسیارێتی، ڕێز", expectation: "بنیاتنانی خێزانێک کە هەردوو لایەن تێیدا پشتیوانی یەکتر بن." },
  };
  const personToSlug = { "سارا": "sara", "ئەحمەد": "ahmad", "ڕۆژین": "rojin" };

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }
  function setText(selector, text) { const element = document.querySelector(selector); if (element) element.textContent = text; }
  function getActiveProfile() {
    const requestedSlug = new URLSearchParams(window.location.search).get("person");
    const slug = profiles[requestedSlug] ? requestedSlug : "sara";
    return { person: profiles[slug], slug };
  }
  document.querySelectorAll("[data-placeholder]").forEach((element) => element.addEventListener("click", () => showToast(element.dataset.placeholder)));

  const detailPage = document.querySelector("[data-detail-page]");
  if (detailPage) {
    const { person, slug } = getActiveProfile();
    setText("[data-person-name]", person.displayName); setText("[data-person-age]", person.age); setText("[data-person-city]", person.city); setText("[data-person-occupation]", person.occupation); setText("[data-person-education]", person.education); setText("[data-person-about]", person.about); setText("[data-person-preferred-age]", person.preferredAge); setText("[data-person-preferred-values]", person.preferredValues); setText("[data-person-expectation]", person.expectation);
    const values = document.querySelector("[data-person-values]");
    person.values.forEach((value) => { const tag = document.createElement("span"); tag.textContent = value; values.append(tag); });
    document.querySelector("[data-request-link]")?.addEventListener("click", () => { window.location.href = `request.html?person=${slug}`; });
  }

  const requestPage = document.querySelector("[data-request-page]");
  if (requestPage) {
    window.scrollTo(0, 0);
    const { person, slug } = getActiveProfile();
    setText("[data-request-name]", person.displayName); setText("[data-request-age]", person.age); setText("[data-request-city]", person.city); setText("[data-request-occupation]", person.occupation);
    document.querySelectorAll("[data-request-back]").forEach((link) => { link.href = `detail.html?person=${slug}`; });
    const form = document.querySelector("#requestForm");
    const warning = document.querySelector("#requestWarning");
    const success = document.querySelector("#requestSuccess");
    const fields = [...form.querySelectorAll("textarea")];
    fields.forEach((field) => {
      const counter = document.querySelector(`#${field.id}-count`);
      const updateCounter = () => { counter.textContent = `${field.value.length} / ${field.maxLength}`; };
      field.addEventListener("input", updateCounter);
      updateCounter();
    });
    const containsContactInfo = (text) => {
      const phone = /(?:\+?\d[\d\s().-]{5,}\d)/;
      const url = /(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|me|co)\b)/i;
      const username = /@[a-z0-9._-]{2,}/i;
      const social = /(instagram|insta(?:gram)?|snapchat|telegram|tiktok|ئینستاگرام|سنەپچات|تلگرام|تیکتۆک)/i;
      return phone.test(text) || url.test(text) || username.test(text) || social.test(text);
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      warning.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (fields.some((field) => containsContactInfo(field.value))) {
        warning.textContent = "بۆ پاراستنی نهێنیت، زانیاریی پەیوەندی (••••) لەم قۆناغەدا ناتوانرێت بڵاوبکرێتەوە.";
        warning.hidden = false;
        return;
      }
      form.hidden = true;
      success.hidden = false;
      success.querySelector("a").focus();
    });
  }

  document.querySelectorAll(".view-button").forEach((button) => button.addEventListener("click", () => { window.location.href = `detail.html?person=${personToSlug[button.dataset.person] || "sara"}`; }));

  const searchInput = document.querySelector("#searchInput");
  const cityFilter = document.querySelector("#cityFilter");
  const ageFilter = document.querySelector("#ageFilter");
  const list = document.querySelector("#introductionList");
  const emptyState = document.querySelector("#emptyState");
  const clearFilters = document.querySelector("#clearFilters");
  if (!searchInput || !cityFilter || !ageFilter || !list || !emptyState || !clearFilters) return;

  const cards = [...document.querySelectorAll(".introduction-card")];
  const normalize = (value) => value.trim().toLocaleLowerCase("ku");
  const discoverParams = new URLSearchParams(window.location.search);
  const preferenceSummary = document.querySelector("[data-discover-preferences]");
  if (discoverParams.get("onboarded") === "1") {
    const city = discoverParams.get("city") || "";
    const minAge = discoverParams.get("minAge") || "18";
    const maxAge = discoverParams.get("maxAge") || "";
    if (city && [...cityFilter.options].some((option) => option.value === city)) cityFilter.value = city;
    if (preferenceSummary) {
      preferenceSummary.textContent = `ڕێکخستنەکانی prototype چالاکن: ${city || "هەموو شارەکان"} • ${minAge}–${maxAge} ساڵ`;
      preferenceSummary.hidden = false;
    }
  }
  function filterIntroductions() {
    const query = normalize(searchInput.value); const city = cityFilter.value; const age = ageFilter.value; let count = 0;
    cards.forEach((card) => { const searchable = normalize([card.dataset.name, card.dataset.city, card.dataset.age, card.dataset.values, card.textContent].join(" ")); const matches = (!query || searchable.includes(query)) && (!city || card.dataset.city === city) && (!age || card.dataset.age === age); card.hidden = !matches; if (matches) count += 1; });
    list.hidden = count === 0; emptyState.hidden = count !== 0;
  }
  searchInput.addEventListener("input", filterIntroductions); cityFilter.addEventListener("change", filterIntroductions); ageFilter.addEventListener("change", filterIntroductions);
  clearFilters.addEventListener("click", () => { searchInput.value = ""; cityFilter.value = ""; ageFilter.value = ""; filterIntroductions(); });
  filterIntroductions();
})();
