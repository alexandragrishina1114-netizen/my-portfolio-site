const directions = document.querySelectorAll(".direction");
const directionsBlock = document.querySelector(".directions");
const directionArrow = document.querySelector(".direction-arrow");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

directions.forEach((direction) => {
  direction.addEventListener("click", () => {
    const target = document.getElementById(direction.dataset.target);
    if (!target) return;

    const isWeb = direction.textContent.trim().startsWith("Web");

    directions.forEach((item) => item.classList.remove("is-active"));
    direction.classList.add("is-active");
    directionsBlock?.classList.toggle("has-active", isWeb);

    if (directionArrow) {
      directionArrow.classList.remove("is-drawing");
      void directionArrow.getBoundingClientRect();
      if (isWeb) directionArrow.classList.add("is-drawing");
    }

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    }, prefersReducedMotion.matches || !isWeb ? 0 : 900);
  });
});
