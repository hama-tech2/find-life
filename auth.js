(() => {
  const page = document.querySelector("[data-auth-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const modeButtons = [...document.querySelectorAll("[data-auth-mode]")];
  const modes = document.querySelector("[data-auth-modes]");
  const signupForm = document.querySelector("[data-signup-form]");
  const loginForm = document.querySelector("[data-login-form]");
  const pending = document.querySelector('[data-auth-state="pending"]');
  const loginSuccess = document.querySelector('[data-auth-state="login-success"]');
  const signupError = document.querySelector("[data-signup-error]");
  const loginError = document.querySelector("[data-login-error]");

  const setMode = (mode) => {
    const signup = mode !== "login";
    modeButtons.forEach((button) => button.setAttribute("aria-selected", String((button.dataset.authMode === "signup") === signup)));
    signupForm.hidden = !signup;
    loginForm.hidden = signup;
    signupError.hidden = true;
    loginError.hidden = true;
    window.history.replaceState(null, "", `auth.html?mode=${signup ? "signup" : "login"}`);
  };
  const ageFromDate = (value) => {
    const birthday = new Date(`${value}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const beforeBirthday = today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate());
    if (beforeBirthday) age -= 1;
    return age;
  };
  const showSignupError = (message) => { signupError.textContent = message; signupError.hidden = false; };
  const showLoginError = (message) => { loginError.textContent = message; loginError.hidden = false; };
  const showPending = () => {
    modes.hidden = true;
    pending.hidden = false;
    window.history.replaceState(null, "", "auth.html?state=pending");
    pending.focus();
  };
  const showLoginSuccess = () => {
    modes.hidden = true;
    loginSuccess.hidden = false;
    loginSuccess.focus();
  };

  modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.authMode)));
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signupError.hidden = true;
    if (!signupForm.checkValidity()) { signupForm.reportValidity(); return; }
    const dob = signupForm.elements.dob.value;
    const invite = signupForm.elements.invite.value.trim();
    if (!dob || ageFromDate(dob) < 18) {
      showSignupError("تەنها کەسانی 18+ دەتوانن لەم prototype ـەدا بەردەوام بن.");
      return;
    }
    if (invite.length < 4) {
      showSignupError("کۆدی بانگهێشتەکە بۆ prototype دروست نییە.");
      return;
    }
    showPending();
  });
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginError.hidden = true;
    if (!loginForm.checkValidity()) { loginForm.reportValidity(); return; }
    showLoginSuccess();
  });
  document.querySelector("[data-prototype-approve]").addEventListener("click", () => {
    window.location.href = "onboarding.html";
  });

  if (params.get("state") === "pending") showPending();
  else setMode(params.get("mode") === "login" ? "login" : "signup");
})();
