(() => {
  const blockedPrefix = "find-your-life:prototype-blocked:";

  const safeSubject = (subject) => String(subject || "prototype").replace(/[^a-z0-9:_-]/gi, "-").slice(0, 80);
  const blockedKey = (subject) => `${blockedPrefix}${safeSubject(subject)}`;
  const isBlocked = (subject) => {
    try { return window.sessionStorage.getItem(blockedKey(subject)) === "1"; } catch { return false; }
  };
  const markBlocked = (subject) => {
    try { window.sessionStorage.setItem(blockedKey(subject), "1"); } catch { /* URL state still closes the prototype. */ }
  };
  const safeReturnUrl = (value, fallback = "discover.html") => {
    if (!value || /^(?:[a-z]+:|\/\/|\\)/i.test(value)) return fallback;
    return /^[a-z0-9-]+\.html(?:[?#][^\r\n]*)?$/i.test(value) ? value : fallback;
  };
  const reportUrl = ({ person, context, subject, returnUrl, active = true }) => {
    const query = new URLSearchParams({
      person: person || "کەسی بەرامبەر",
      context: context || "introduction",
      subject: safeSubject(subject),
      return: safeReturnUrl(returnUrl),
      active: active ? "1" : "0"
    });
    return `report.html?${query.toString()}`;
  };

  let dialog;
  let confirmButton;
  let cancelButton;
  let returnFocus;
  let pendingAction;
  let pendingCancel;
  let pendingSubject;

  const closeDialog = (cancelled = true) => {
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove("safety-dialog-open");
    const cancelAction = pendingCancel;
    pendingAction = null;
    pendingCancel = null;
    if (cancelled && cancelAction) cancelAction();
    else returnFocus?.focus();
  };
  const ensureDialog = () => {
    if (dialog) return;
    dialog = document.createElement("section");
    dialog.className = "safety-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "safety-block-title");
    dialog.innerHTML = `
      <div class="safety-dialog-card">
        <span class="safety-dialog-icon" aria-hidden="true">!</span>
        <h2 id="safety-block-title">بلۆککردن</h2>
        <p>ئەم ناساندنە کۆتایی دێت و پەیوەندیی زیاتر لەم prototype ـەدا بەردەست نابێت. هیچ هۆکارێک بۆ لای دووەم نیشان نادرێت.</p>
        <div>
          <button class="button button-danger" type="button" data-safety-confirm-block>بلۆککردن و کۆتایی پێهێنان</button>
          <button class="button button-secondary" type="button" data-safety-cancel-block>گەڕانەوە</button>
        </div>
      </div>`;
    document.body.append(dialog);
    confirmButton = dialog.querySelector("[data-safety-confirm-block]");
    cancelButton = dialog.querySelector("[data-safety-cancel-block]");
    confirmButton.addEventListener("click", () => {
      markBlocked(pendingSubject);
      dialog.hidden = true;
      document.body.classList.remove("safety-dialog-open");
      const action = pendingAction;
      pendingAction = null;
      pendingCancel = null;
      action?.();
    });
    cancelButton.addEventListener("click", () => closeDialog(true));
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(true); });
    document.addEventListener("keydown", (event) => {
      if (dialog.hidden) return;
      if (event.key === "Escape") { closeDialog(true); return; }
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === confirmButton) {
        event.preventDefault();
        cancelButton.focus();
      } else if (!event.shiftKey && document.activeElement === cancelButton) {
        event.preventDefault();
        confirmButton.focus();
      }
    });
  };
  const confirmBlock = ({ subject, trigger, onConfirm, onCancel }) => {
    ensureDialog();
    pendingSubject = safeSubject(subject);
    pendingAction = onConfirm;
    pendingCancel = onCancel;
    returnFocus = trigger?.closest("details")?.querySelector("summary") || trigger || document.activeElement;
    dialog.hidden = false;
    document.body.classList.add("safety-dialog-open");
    confirmButton.focus();
  };

  window.FindYourLifeSafety = { confirmBlock, isBlocked, markBlocked, reportUrl, safeReturnUrl };
})();
