(function () {
  var openBtn = document.getElementById("lang-modal-open");
  var modal = document.getElementById("lang-modal");
  if (!openBtn || !modal) return;

  var backdrop = modal.querySelector(".lang-modal-backdrop");
  var closeBtns = modal.querySelectorAll("[data-lang-close]");
  var panel = modal.querySelector(".lang-modal-panel");

  function getFocusables() {
    if (!panel) return [];
    return Array.prototype.slice
      .call(
        panel.querySelectorAll(
          'a[href]:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
  }

  function open() {
    modal.removeAttribute("hidden");
    openBtn.setAttribute("aria-expanded", "true");
    openBtn.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var focusables = getFocusables();
    var first = focusables[0];
    if (first) first.focus();
  }

  function close() {
    modal.setAttribute("hidden", "");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.classList.remove("is-open");
    document.body.style.overflow = "";
    openBtn.focus();
  }

  openBtn.addEventListener("click", function () {
    if (modal.hasAttribute("hidden")) open();
    else close();
  });

  if (backdrop) backdrop.addEventListener("click", close);

  closeBtns.forEach(function (el) {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hasAttribute("hidden")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab" || !panel) return;
    var focusables = getFocusables();
    if (focusables.length === 0) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
