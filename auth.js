(() => {
  const page = document.querySelector("[data-auth-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const modeButtons = [...document.querySelectorAll("[data-auth-mode]")];
  const signupForm = document.querySelector("[data-signup-form]");
  const loginForm = document.querySelector("[data-login-form]");
  const signupError = document.querySelector("[data-signup-error]");
  const loginError = document.querySelector("[data-login-error]");

  const setMode = (mode, moveFocus = false) => {
    const selectedMode = mode === "login" ? "login" : "signup";
    const signup = selectedMode === "signup";
    modeButtons.forEach((button) => {
      const selected = button.dataset.authMode === selectedMode;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) button.focus();
    });
    signupForm.hidden = !signup;
    loginForm.hidden = signup;
    signupError.hidden = true;
    loginError.hidden = true;
    window.history.replaceState(null, "", `auth.html?mode=${selectedMode}`);
  };

  modeButtons.forEach((button, index) => {
    button.addEventListener("click", () => setMode(button.dataset.authMode));
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const nextIndex = event.key === "ArrowLeft" ? (index + 1) % modeButtons.length : (index - 1 + modeButtons.length) % modeButtons.length;
      setMode(modeButtons[nextIndex].dataset.authMode, true);
    });
  });

  document.querySelector("[data-google-auth]").addEventListener("click", () => {
    window.location.href = "onboarding.html?source=google";
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signupError.hidden = true;
    if (!signupForm.checkValidity()) {
      signupForm.reportValidity();
      return;
    }
    window.location.href = "onboarding.html?source=email";
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginError.hidden = true;
    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }
    window.location.href = "discover.html?login=1";
  });

  setMode(params.get("mode") === "login" ? "login" : "signup");
})();
