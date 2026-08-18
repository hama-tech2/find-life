(() => {
  const page = document.querySelector("[data-account-status-page]");
  if (!page) return;
  const params = new URLSearchParams(window.location.search);
  const buttons = [...document.querySelectorAll("[data-status-mode]")];
  const states = [...document.querySelectorAll("[data-status-state]")];
  const showState = (requested) => {
    const state = requested === "restricted" ? "restricted" : "review";
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.statusMode === state)));
    states.forEach((panel) => { panel.hidden = panel.dataset.statusState !== state; });
    window.history.replaceState(null, "", `account-status.html?state=${state}`);
    document.querySelector(`[data-status-state="${state}"]`).focus();
  };
  buttons.forEach((button) => button.addEventListener("click", () => showState(button.dataset.statusMode)));
  showState(params.get("state"));
})();
