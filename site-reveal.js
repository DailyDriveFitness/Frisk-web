(function () {
  var nodes = document.querySelectorAll(".reveal-on-scroll");
  if (!nodes.length) return;

  if (!window.IntersectionObserver) {
    nodes.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  var prefersReduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduce) {
    nodes.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: 0,
    }
  );

  nodes.forEach(function (el) {
    observer.observe(el);
  });
})();
