(function () {
  var STORAGE_KEY = "frisk-theme";
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(mode) {
    var root = document.documentElement;
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
    } else {
      root.removeAttribute("data-theme");
    }
    syncToggle(mode);
  }

  function syncToggle(mode) {
    var toggles = document.querySelectorAll(".theme-toggle");
    var resolved = mode;
    if (!resolved) {
      resolved = mq.matches ? "dark" : "light";
    }
    toggles.forEach(function (btn) {
      var isDark = resolved === "dark";
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      var on = btn.querySelector(".theme-toggle__icon--on");
      var off = btn.querySelector(".theme-toggle__icon--off");
      if (on) on.hidden = !isDark;
      if (off) off.hidden = isDark;
    });
  }

  function init() {
    var stored = getStored();
    applyTheme(stored);

    mq.addEventListener("change", function () {
      if (!getStored()) {
        applyTheme(null);
      }
    });

    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current =
          document.documentElement.getAttribute("data-theme") ||
          (mq.matches ? "dark" : "light");
        var next = current === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
        applyTheme(next);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
