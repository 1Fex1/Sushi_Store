
function initMobileNav() {
  const btn = document.getElementById("mobile-nav-btn");
  const menu = document.getElementById("mobile-nav-menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("hidden"));
}

function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const useMotion = typeof window.Motion !== "undefined" && window.Motion.animate;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        if (useMotion) {
          window.Motion.animate(
            el,
            { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] },
            { duration: 0.7, easing: [0.22, 1, 0.36, 1] }
          );
        } else {
          el.classList.add("reveal-fallback");
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => {
    el.style.opacity = useMotion ? "0" : "";
    io.observe(el);
  });
}

function initReservationForm() {
  const form = document.getElementById("reservation-form");
  const successMsg = document.getElementById("reservation-success");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successMsg.classList.remove("hidden");
    form.reset();
    setTimeout(() => successMsg.classList.add("hidden"), 5000);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  initReservationForm();
});
