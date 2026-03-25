(function () {
  var openBtns = document.querySelectorAll(".lang-modal-open");
  var modal = document.getElementById("lang-modal");
  if (!openBtns.length || !modal) return;

  var backdrop = modal.querySelector(".lang-modal-backdrop");
  var closeBtns = modal.querySelectorAll("[data-lang-close]");
  var panel = modal.querySelector(".lang-modal-panel");
  var activeOpenBtn = null;

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

  function setOpenState(isOpen) {
    openBtns.forEach(function (btn) {
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.classList.toggle("is-open", isOpen);
    });
  }

  function open(fromBtn) {
    activeOpenBtn = fromBtn && fromBtn.classList ? fromBtn : openBtns[0];
    modal.removeAttribute("hidden");
    setOpenState(true);
    document.body.style.overflow = "hidden";
    var focusables = getFocusables();
    var first = focusables[0];
    if (first) first.focus();
  }

  function close() {
    modal.setAttribute("hidden", "");
    setOpenState(false);
    document.body.style.overflow = "";
    if (activeOpenBtn && typeof activeOpenBtn.focus === "function") {
      activeOpenBtn.focus();
    } else if (openBtns[0]) {
      openBtns[0].focus();
    }
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (modal.hasAttribute("hidden")) open(btn);
      else close();
    });
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
