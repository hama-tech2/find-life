(() => {
  const makeState = (kind, message, onRetry) => {
    const section = document.createElement("section");
    section.className = `async-state async-state-${kind}`;
    section.setAttribute("role", kind === "error" ? "alert" : "status");
    section.setAttribute("aria-live", "polite");
    const copy = document.createElement("p");
    copy.textContent = message || (kind === "error" ? "هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدە." : "چاوەڕێ بکە…");
    section.append(copy);
    if (kind === "loading") {
      const indicator = document.createElement("span");
      indicator.className = "async-indicator";
      indicator.setAttribute("aria-hidden", "true");
      section.prepend(indicator);
    }
    if (kind === "error" && typeof onRetry === "function") {
      const retry = document.createElement("button");
      retry.className = "button button-secondary async-retry";
      retry.type = "button";
      retry.textContent = "هەوڵدانەوە";
      retry.addEventListener("click", onRetry);
      section.append(retry);
    }
    return section;
  };
  window.FindYourLifeUiStates = {
    loading: (message) => makeState("loading", message),
    error: (message, onRetry) => makeState("error", message, onRetry)
  };
})();
