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
    const safety = window.FindYourLifeSafety;
    const subject = `intro:${slug}`;
    const safetyMenu = document.querySelector("[data-detail-safety]");
    const closure = document.querySelector("[data-detail-safety-closure]");
    const showDetailClosure = () => {
      [...detailPage.children].forEach((element) => { element.hidden = element !== closure; });
      closure.hidden = false;
      window.history.replaceState(null, "", `detail.html?person=${slug}&blocked=1`);
      closure.focus();
    };
    setText("[data-person-name]", person.displayName); setText("[data-person-age]", person.age); setText("[data-person-city]", person.city); setText("[data-person-occupation]", person.occupation); setText("[data-person-education]", person.education); setText("[data-person-about]", person.about); setText("[data-person-preferred-age]", person.preferredAge); setText("[data-person-preferred-values]", person.preferredValues); setText("[data-person-expectation]", person.expectation);
    const values = document.querySelector("[data-person-values]");
    person.values.forEach((value) => { const tag = document.createElement("span"); tag.textContent = value; values.append(tag); });
    document.querySelector("[data-request-link]")?.addEventListener("click", () => { window.location.href = `request.html?person=${slug}`; });
    document.querySelectorAll("[data-detail-safety-action]").forEach((button) => button.addEventListener("click", () => {
      safetyMenu.open = false;
      if (button.dataset.detailSafetyAction === "report") {
        window.location.href = safety.reportUrl({ person: person.displayName, context: "introduction", subject, returnUrl: `detail.html?person=${slug}`, active: false });
        return;
      }
      safety.confirmBlock({ subject, trigger: button, onConfirm: showDetailClosure });
    }));
    if (safety.isBlocked(subject) || new URLSearchParams(window.location.search).get("blocked") === "1") showDetailClosure();
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
  const filterOpen = document.querySelector("[data-filter-open]");
  const filterOverlay = document.querySelector("[data-filter-overlay]");
  const filterForm = document.querySelector("[data-filter-form]");
  const filterError = document.querySelector("[data-filter-error]");
  const valueButtons = [...document.querySelectorAll("[data-filter-value]")];
  const advancedCity = document.querySelector("#advancedCity");
  const advancedMinAge = document.querySelector("#advancedMinAge");
  const advancedMaxAge = document.querySelector("#advancedMaxAge");
  const advancedCategory = document.querySelector("#advancedCategory");
  const filterState = { city: "", minAge: null, maxAge: null, category: "", values: new Set() };
  let filterReturnFocus = null;

  const setFilterError = (message = "") => {
    filterError.textContent = message;
    filterError.hidden = !message;
  };
  const syncAdvancedControls = () => {
    advancedCity.value = filterState.city;
    advancedMinAge.value = filterState.minAge ?? "";
    advancedMaxAge.value = filterState.maxAge ?? "";
    advancedCategory.value = filterState.category;
    valueButtons.forEach((button) => button.setAttribute("aria-pressed", String(filterState.values.has(button.dataset.filterValue))));
  };
  const setAgeStateFromQuickFilter = () => {
    const [minimum, maximum] = ageFilter.value.split("-").map(Number);
    filterState.minAge = Number.isFinite(minimum) ? minimum : null;
    filterState.maxAge = Number.isFinite(maximum) ? maximum : null;
  };
  const syncQuickAgeFilter = () => {
    const range = filterState.minAge !== null && filterState.maxAge !== null
      ? `${filterState.minAge}-${filterState.maxAge}`
      : "";
    ageFilter.value = [...ageFilter.options].some((option) => option.value === range) ? range : "";
  };
  const openFilter = () => {
    filterReturnFocus = document.activeElement;
    syncAdvancedControls();
    setFilterError();
    filterOverlay.hidden = false;
    document.body.classList.add("filter-is-open");
    filterOverlay.querySelector("[data-filter-close]").focus();
  };
  const closeFilter = () => {
    filterOverlay.hidden = true;
    document.body.classList.remove("filter-is-open");
    filterReturnFocus?.focus();
  };
  if (discoverParams.get("onboarded") === "1") {
    const city = discoverParams.get("city") || "";
    const minAge = discoverParams.get("minAge") || "18";
    const maxAge = discoverParams.get("maxAge") || "";
    if (city && [...cityFilter.options].some((option) => option.value === city)) {
      cityFilter.value = city;
      filterState.city = city;
    }
    filterState.minAge = Number(minAge) || 18;
    filterState.maxAge = Number(maxAge) || null;
    syncQuickAgeFilter();
    if (preferenceSummary) {
      preferenceSummary.textContent = `ڕێکخستنەکانی prototype چالاکن: ${city || "هەموو شارەکان"} • ${minAge}–${maxAge} ساڵ`;
      preferenceSummary.hidden = false;
    }
  }
  function filterIntroductions() {
    const query = normalize(searchInput.value);
    let count = 0;
    cards.forEach((card) => {
      const searchable = normalize([card.dataset.name, card.dataset.city, card.dataset.age, card.dataset.values, card.dataset.category, card.textContent].join(" "));
      const cardMinAge = Number(card.dataset.ageMin);
      const cardMaxAge = Number(card.dataset.ageMax);
      const ageMatches = (filterState.minAge === null || cardMaxAge >= filterState.minAge)
        && (filterState.maxAge === null || cardMinAge <= filterState.maxAge);
      const cardValues = (card.dataset.values || "").split(" ");
      const valuesMatch = [...filterState.values].every((value) => cardValues.includes(value));
      const matches = (!query || searchable.includes(query))
        && (!filterState.city || card.dataset.city === filterState.city)
        && ageMatches
        && (!filterState.category || card.dataset.category === filterState.category)
        && valuesMatch;
      card.hidden = !matches;
      if (matches) count += 1;
    });
    list.hidden = count === 0; emptyState.hidden = count !== 0;
  }
  const resetFilters = () => {
    searchInput.value = "";
    cityFilter.value = "";
    ageFilter.value = "";
    filterState.city = "";
    filterState.minAge = null;
    filterState.maxAge = null;
    filterState.category = "";
    filterState.values.clear();
    if (preferenceSummary) preferenceSummary.hidden = true;
    syncAdvancedControls();
    setFilterError();
    filterIntroductions();
  };

  searchInput.addEventListener("input", filterIntroductions);
  cityFilter.addEventListener("change", () => {
    filterState.city = cityFilter.value;
    advancedCity.value = cityFilter.value;
    filterIntroductions();
  });
  ageFilter.addEventListener("change", () => {
    setAgeStateFromQuickFilter();
    syncAdvancedControls();
    filterIntroductions();
  });
  filterOpen.addEventListener("click", openFilter);
  filterOverlay.querySelector("[data-filter-close]").addEventListener("click", closeFilter);
  filterOverlay.addEventListener("click", (event) => { if (event.target === filterOverlay) closeFilter(); });
  document.addEventListener("keydown", (event) => {
    if (filterOverlay.hidden) return;
    if (event.key === "Escape") {
      closeFilter();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...filterOverlay.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled])")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  valueButtons.forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.filterValue;
    if (filterState.values.has(value)) {
      filterState.values.delete(value);
      button.setAttribute("aria-pressed", "false");
      setFilterError();
      return;
    }
    if (filterState.values.size >= 3) {
      setFilterError("دەتوانیت زۆرترین سێ بەها هەڵبژێریت.");
      return;
    }
    filterState.values.add(value);
    button.setAttribute("aria-pressed", "true");
    setFilterError();
  }));
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const minimum = advancedMinAge.value === "" ? null : Number(advancedMinAge.value);
    const maximum = advancedMaxAge.value === "" ? null : Number(advancedMaxAge.value);
    if ((minimum !== null && minimum < 18) || (maximum !== null && maximum < 18)) {
      setFilterError("تەمەنی هەڵبژێردراو نابێت لە ١٨ کەمتر بێت.");
      advancedMinAge.focus();
      return;
    }
    if (minimum !== null && maximum !== null && maximum < minimum) {
      setFilterError("زۆرترین تەمەن دەبێت یەکسان یان گەورەتر لە کەمترین تەمەن بێت.");
      advancedMaxAge.focus();
      return;
    }
    filterState.city = advancedCity.value;
    filterState.minAge = minimum;
    filterState.maxAge = maximum;
    filterState.category = advancedCategory.value;
    cityFilter.value = filterState.city;
    syncQuickAgeFilter();
    setFilterError();
    filterIntroductions();
    closeFilter();
  });
  document.querySelector("[data-filter-clear]").addEventListener("click", resetFilters);
  clearFilters.addEventListener("click", resetFilters);
  filterIntroductions();
})();
