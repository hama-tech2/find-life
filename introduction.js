(() => {
  const key = "find-your-life:prototype-introduction";
  const account = Object.freeze({ displayName: "ئاڤین", age: 27 });

  function get() {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) return null;
      const value = JSON.parse(raw);
      return value && typeof value === "object" ? value : null;
    } catch {
      return null;
    }
  }

  function save(introduction) {
    const publicIntroduction = {
      city: String(introduction.city || ""),
      occupation: String(introduction.occupation || ""),
      education: String(introduction.education || ""),
      about: String(introduction.about || ""),
      minAge: Number(introduction.minAge || 18),
      maxAge: Number(introduction.maxAge || 18),
      values: Array.isArray(introduction.values) ? introduction.values.slice(0, 3).map(String) : [],
      expectation: String(introduction.expectation || ""),
      status: introduction.status === "hidden" ? "hidden" : "active"
    };
    try {
      window.sessionStorage.setItem(key, JSON.stringify(publicIntroduction));
      return true;
    } catch {
      return false;
    }
  }

  window.FindYourLifeIntroduction = { account, get, save };
})();
