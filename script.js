const toggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("navigation");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  navigation.dataset.open = String(open);
  toggle.textContent = open ? "Fermer" : "Menu";
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});

const links = new Map(
  [...navigation.querySelectorAll("ul a")].map((link) => [link.getAttribute("href").slice(1), link])
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.removeAttribute("aria-current"));
      const active = links.get(entry.target.id);
      if (active) active.setAttribute("aria-current", "true");
    });
  },
  { rootMargin: "-35% 0px -60% 0px" }
);

links.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) observer.observe(section);
});
