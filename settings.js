(() => {
  const page = document.querySelector("[data-settings-page]");
  if (!page) return;

  const content = document.querySelector("[data-settings-content]");
  const confirmation = document.querySelector("[data-account-confirmation]");
  const title = document.querySelector("[data-confirmation-title]");
  const copy = document.querySelector("[data-confirmation-copy]");
  const continueButton = document.querySelector("[data-confirmation-continue]");
  const actions = document.querySelector("[data-confirmation-actions]");
  const result = document.querySelector("[data-prototype-result]");
  let activeAction = "";
  let returnFocus = null;

  const configurations = {
    signout: {
      title: "دڵنیایت لە چوونەدەرەوە؟",
      copy: "لە frontend ـی prototype ـدا هیچ session ـی ڕاستەقینە نییە. تەنها دەگەڕێیتەوە بۆ پەڕەی چوونەژوورەوە و ناساندنی prototype ـەکەت ناسڕدرێتەوە.",
      button: "چوونەدەرەوە",
      danger: false
    },
    delete: {
      title: "دەربارەی سڕینەوەی هەژمار",
      copy: "سڕینەوە و یاساکانی هێشتنەوەی داتا لەگەڵ backend دروست دەکرێن. لەم prototype ـەدا هیچ هەژمارێک ناسڕدرێتەوە.",
      button: "تێگەیشتم، دۆخی prototype پیشان بدە",
      danger: true
    }
  };

  function openConfirmation(action, trigger) {
    const configuration = configurations[action];
    if (!configuration) return;
    activeAction = action;
    returnFocus = trigger;
    title.textContent = configuration.title;
    copy.textContent = configuration.copy;
    continueButton.textContent = configuration.button;
    continueButton.className = `button ${configuration.danger ? "button-danger" : "button-primary"}`;
    result.hidden = true;
    actions.hidden = false;
    content.hidden = true;
    confirmation.hidden = false;
    title.focus();
  }

  function closeConfirmation() {
    confirmation.hidden = true;
    content.hidden = false;
    activeAction = "";
    returnFocus?.focus();
  }

  document.querySelectorAll("[data-account-action]").forEach((button) => button.addEventListener("click", () => openConfirmation(button.dataset.accountAction, button)));
  document.querySelector("[data-confirmation-cancel]").addEventListener("click", closeConfirmation);
  continueButton.addEventListener("click", () => {
    if (activeAction === "signout") {
      window.location.href = "auth.html?mode=login&prototype=signed-out";
      return;
    }
    actions.hidden = true;
    result.hidden = false;
    result.querySelector("button").focus();
  });
  document.querySelector("[data-result-close]").addEventListener("click", closeConfirmation);
})();
