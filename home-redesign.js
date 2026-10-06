const cards = Array.from(document.querySelectorAll(".case-card"));
const mobileMenu = document.querySelector(".site-menu");

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.removeAttribute("open"));
});

if (!("IntersectionObserver" in window)) {
  cards.forEach((card) => card.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  cards.forEach((card, index) => {
    card.style.setProperty("--reveal-delay", `${(index % 2) * 55}ms`);
    observer.observe(card);
  });
}
