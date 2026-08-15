(() => {
  const page = document.querySelector("[data-face-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const person = params.get("person") || "ئەحمەد";
  const requestId = params.get("request") || "r1";
  const states = [...document.querySelectorAll("[data-face-state]")];
  const video = document.querySelector("[data-camera-video]");
  const canvas = document.querySelector("[data-capture-canvas]");
  const preview = document.querySelector("[data-captured-preview]");
  const cameraError = document.querySelector("[data-camera-error]");
  const captureButton = document.querySelector("[data-camera-capture]");
  const confirmation = document.querySelector("[data-face-confirmation]");
  const confirmationCopy = document.querySelector("[data-face-confirm-copy]");
  const feedback = document.querySelector("[data-face-feedback]");
  const closure = document.querySelector("[data-face-closure]");
  const safety = document.querySelector("[data-face-safety]");
  const headerBack = document.querySelector("[data-face-header-back]");
  let cameraStream = null;
  let capturedImage = null;
  let viewedFaceActive = false;
  let currentDecision = "";
  let confirmationAction = "";

  document.querySelectorAll("[data-face-name]").forEach((element) => { element.textContent = person; });
  headerBack.href = `conversation.html?person=${encodeURIComponent(person)}&request=${requestId}`;

  const faceUrl = (suffix = "") => `face-reveal.html?person=${encodeURIComponent(person)}&request=${requestId}${suffix}`;
  const hideFeedback = () => { feedback.hidden = true; };
  const showFeedback = (message) => { feedback.textContent = message; feedback.hidden = false; };
  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    video.srcObject = null;
  };
  const showState = (name) => {
    states.forEach((state) => { state.hidden = state.dataset.faceState !== name; });
    if (name !== "camera") stopCamera();
    hideFeedback();
  };
  const removeFaceAccess = () => {
    stopCamera();
    capturedImage = null;
    viewedFaceActive = false;
    preview.removeAttribute("src");
    preview.hidden = true;
    canvas.width = 0;
    canvas.height = 0;
    states.forEach((state) => { state.hidden = true; });
    confirmation.hidden = true;
    safety.hidden = true;
    headerBack.hidden = true;
  };
  const showClosure = (title, copy, mode) => {
    removeFaceAccess();
    document.querySelector("[data-face-closure-title]").textContent = title;
    document.querySelector("[data-face-closure-copy]").textContent = copy;
    closure.hidden = false;
    window.history.replaceState(null, "", faceUrl(`&${mode}=1`));
    closure.focus();
  };
  const showDecisionOptions = () => {
    removeFaceAccess();
    showState("decision-options");
    window.history.replaceState(null, "", faceUrl("&choice=pending"));
    document.querySelector('[data-face-state="decision-options"]').focus();
  };
  const showDecisionWaiting = (decision) => {
    currentDecision = decision;
    removeFaceAccess();
    const isConditional = decision === "conditional";
    document.querySelector("[data-decision-waiting-title]").textContent = isConditional
      ? "بەردەوامبوونت بە مەرج تۆمار کرا."
      : "بەردەوامبوونت تۆمار کرا.";
    document.querySelector("[data-decision-waiting-copy]").textContent = "چاوەڕێی بڕیاری تایبەتی لای دووەمە. بڕیاری ئەوان پێشان نادرێت.";
    showState("decision-waiting");
    // The face is gone, but the person can still safely end, block, or report
    // while waiting for the other participant's private decision.
    safety.hidden = false;
    window.history.replaceState(null, "", faceUrl(`&choice=${decision}`));
    document.querySelector('[data-face-state="decision-waiting"]').focus();
  };
  const showConfirmation = (action) => {
    confirmationAction = action;
    confirmationCopy.textContent = action === "end"
      ? "دڵنیایت دەتەوێت ئەم ناسینە کۆتایی پێ بهێنیت؟ دەستگەیشتن بە ڕوو بە یەکجار لابراوە."
      : "دڵنیایت دەتەوێت لەم prototype ـەدا بلۆککردن تاقی بکەیتەوە؟";
    confirmation.hidden = false;
    document.querySelector("[data-face-confirm]").focus();
  };
  const showCameraError = () => {
    cameraError.hidden = false;
    captureButton.disabled = true;
    document.querySelector("[data-camera-prompt]").hidden = true;
  };
  const startCamera = async () => {
    showState("camera");
    cameraError.hidden = true;
    captureButton.disabled = true;
    document.querySelector("[data-camera-prompt]").hidden = false;
    if (!navigator.mediaDevices?.getUserMedia) { showCameraError(); return; }
    let mediaRequest;
    try {
      mediaRequest = navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      const timeout = new Promise((_, reject) => { window.setTimeout(() => reject(new Error("camera-timeout")), 8000); });
      cameraStream = await Promise.race([mediaRequest, timeout]);
      video.srcObject = cameraStream;
      await video.play();
      document.querySelector("[data-camera-prompt]").hidden = true;
      captureButton.disabled = false;
    } catch {
      const currentStream = cameraStream;
      stopCamera();
      mediaRequest?.then((lateStream) => {
        if (lateStream !== currentStream) lateStream.getTracks().forEach((track) => track.stop());
      }).catch(() => {});
      showCameraError();
    }
  };
  const capturePhoto = () => {
    if (!cameraStream || !video.videoWidth || !video.videoHeight) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage = canvas.toDataURL("image/jpeg", 0.85);
    preview.src = capturedImage;
    preview.hidden = false;
    stopCamera();
    showState("ready");
  };
  const chooseDecision = (decision) => {
    if (decision === "end") {
      removeFaceAccess();
      window.history.replaceState(null, "", faceUrl("&choice=end"));
      showConfirmation("end");
      return;
    }
    showDecisionWaiting(decision);
  };
  const simulateOtherDecision = (otherDecision) => {
    if (otherDecision === "end") {
      showClosure("ئەم ناسینە کۆتایی هات.", "هیچ بڕیارێکی تایبەتی لای دووەم پێشان نادرێت.", "ended");
      return;
    }
    const hasConditional = currentDecision === "conditional" || otherDecision === "conditional";
    const selfConditional = currentDecision === "conditional";
    const url = `conversation.html?person=${encodeURIComponent(person)}&request=${requestId}&postFace=1&conditional=${hasConditional ? "1" : "0"}&selfConditional=${selfConditional ? "1" : "0"}`;
    window.location.replace(url);
  };

  document.querySelector("[data-consent-yes]").addEventListener("click", startCamera);
  document.querySelector("[data-consent-no]").addEventListener("click", () => showClosure("پیشاندانی ڕوو وەستاندرا.", "هیچ وێنەیەک پیشان نەدرا و هیچ شتێک هەڵنەگیرا.", "declined"));
  document.querySelector("[data-camera-retry]").addEventListener("click", startCamera);
  captureButton.addEventListener("click", capturePhoto);
  document.querySelector("[data-retake]").addEventListener("click", startCamera);
  document.querySelector("[data-enter-waiting]")?.addEventListener("click", () => showState("waiting"));
  document.querySelectorAll("[data-simulate-ready]").forEach((button) => button.addEventListener("click", () => {
    viewedFaceActive = true;
    showState("view");
  }));
  document.querySelectorAll("[data-face-decision]").forEach((button) => button.addEventListener("click", () => chooseDecision(button.dataset.faceDecision)));
  document.querySelectorAll("[data-simulate-decision]").forEach((button) => button.addEventListener("click", () => simulateOtherDecision(button.dataset.simulateDecision)));
  document.querySelector("[data-face-cancel]").addEventListener("click", showDecisionOptions);
  document.querySelector("[data-face-confirm]").addEventListener("click", () => {
    if (confirmationAction === "end") showClosure("ئەم ناسینە کۆتایی هات.", "دەستگەیشتن بە پیشاندانی تایبەتی ڕوو لابرا.", "ended");
    else showClosure("بلۆککردن لەم prototype ـەدا تەنها پیشاندانییە.", "هیچ کارێکی ڕاستەقینە لەسەر هەژمارەکان جێبەجێ نەکرا.", "blocked");
  });
  document.querySelectorAll("[data-face-safety-choice]").forEach((button) => button.addEventListener("click", () => {
    const choice = button.dataset.faceSafetyChoice;
    safety.open = false;
    if (choice === "report") {
      showFeedback("ڕاپۆرت لەم prototype ـەدا تەنها دۆخێکی پیشاندانییە؛ هیچ ڕاپۆرتێکی ڕاستەقینە نەنێردراوە.");
      return;
    }
    removeFaceAccess();
    showConfirmation(choice);
  }));

  if (params.has("ended") || params.has("blocked")) {
    showClosure("ئەم ناسینە کۆتایی هات.", "دەستگەیشتن بە پیشاندانی تایبەتی ڕوو لابرا.", params.has("blocked") ? "blocked" : "ended");
  } else if (params.has("declined")) {
    showClosure("پیشاندانی ڕوو وەستاندرا.", "هیچ وێنەیەک پیشان نەدرا و هیچ شتێک هەڵنەگیرا.", "declined");
  } else if (params.get("choice") === "continue" || params.get("choice") === "conditional") {
    showDecisionWaiting(params.get("choice"));
  } else if (params.get("choice") === "end" || params.get("choice") === "pending") {
    showDecisionOptions();
  } else {
    showState("consent");
  }
})();
