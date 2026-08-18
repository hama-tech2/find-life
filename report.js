(() => {
  const page = document.querySelector("[data-report-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const safety = window.FindYourLifeSafety;
  const person = params.get("person") || "کەسی بەرامبەر";
  const context = params.get("context") || "introduction";
  const subject = params.get("subject") || "prototype";
  const active = params.get("active") === "1";
  const returnUrl = safety.safeReturnUrl(params.get("return"), "discover.html");
  const contextLabels = {
    introduction: "ناساندن",
    request: "داواکاری",
    guided: "دەستپێکی گفتوگۆ",
    conversation: "گفتوگۆ",
    face: "پیشاندانی تایبەتی ڕوو",
    "decision-waiting": "چاوەڕوانیی بڕیاری دوای ڕوو",
    "post-face": "گفتوگۆی دوای پیشاندانی ڕوو"
  };
  const form = document.querySelector("[data-report-form]");
  const details = document.querySelector("#reportDetails");
  const counter = document.querySelector("#report-details-count");
  const highRiskNote = document.querySelector("[data-report-high-risk]");
  const error = document.querySelector("[data-report-error]");
  const success = document.querySelector("[data-report-success]");
  const content = document.querySelector("[data-report-content]");
  const blockButton = document.querySelector("[data-report-block]");
  const recommendation = document.querySelector("[data-report-recommendation]");
  const closure = document.querySelector("[data-report-closure]");
  let selectedHighRisk = false;

  document.querySelector("[data-report-person]").textContent = person;
  document.querySelector("[data-report-context]").textContent = contextLabels[context] || contextLabels.introduction;
  document.querySelector("[data-report-back]").href = returnUrl;
  document.querySelector("[data-report-return]").href = returnUrl;
  blockButton.hidden = !active;

  const updateReason = () => {
    const reason = form.elements.reason.value;
    selectedHighRisk = reason === "threat" || reason === "under18";
    highRiskNote.hidden = !selectedHighRisk;
    error.hidden = true;
  };
  form.querySelectorAll('input[name="reason"]').forEach((input) => input.addEventListener("change", updateReason));
  details.addEventListener("input", () => { counter.textContent = `${details.value.length} / ${details.maxLength}`; });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.elements.reason.value) {
      error.textContent = "تکایە یەک هۆکاری سەرەکی هەڵبژێرە.";
      error.hidden = false;
      form.querySelector('input[name="reason"]').focus();
      return;
    }
    content.hidden = true;
    recommendation.hidden = !selectedHighRisk || !active;
    success.hidden = false;
    window.history.replaceState(null, "", `report.html?state=prototype-complete&person=${encodeURIComponent(person)}&context=${encodeURIComponent(context)}&subject=${encodeURIComponent(subject)}&return=${encodeURIComponent(returnUrl)}&active=${active ? "1" : "0"}`);
    success.focus();
  });
  blockButton.addEventListener("click", () => safety.confirmBlock({
    subject,
    trigger: blockButton,
    onConfirm: () => {
      success.hidden = true;
      closure.hidden = false;
      window.history.replaceState(null, "", `report.html?blocked=1&subject=${encodeURIComponent(subject)}`);
      closure.focus();
    }
  }));

  if (params.get("blocked") === "1" || safety.isBlocked(subject)) {
    content.hidden = true;
    success.hidden = true;
    closure.hidden = false;
    closure.focus();
  }
})();
