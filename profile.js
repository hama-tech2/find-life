(() => {
  const page = document.querySelector("[data-profile-page]");
  if (!page) return;
  const shared = window.FindYourLifeIntroduction;
  const introduction = shared?.get?.();
  const name = document.querySelector("[data-profile-name]");
  const city = document.querySelector("[data-profile-city]");
  if (name && shared?.account?.displayName) name.textContent = shared.account.displayName;
  if (city && introduction?.city) city.textContent = introduction.city;
})();
