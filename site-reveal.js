(function () {
  if (!window.IntersectionObserver) {
    document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  var prefersReduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduce) {
    document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  var nodes = document.querySelectorAll(".reveal-on-scroll");
  if (!nodes.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );

  nodes.forEach(function (el) {
    observer.observe(el);
  });
})();
