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

const revealObserver = new IntersectionObserver(
  (entries, observerRef) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observerRef.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector(".copy-status");

if (copyButton && navigator.clipboard) {
  copyButton.hidden = false;
  let resetTimer;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
      copyStatus.textContent = "Adresse copiée dans le presse-papiers.";
    } catch {
      copyStatus.textContent = "Copie impossible, utilisez le bouton d'écriture.";
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copyStatus.textContent = "";
    }, 3000);
  });
}

if (window.parent !== window) {
  const forward = (type, build) => {
    document.addEventListener(type, (event) => {
      window.parent.postMessage({ type, ...build(event) }, window.location.origin);
    });
  };

  forward("mousemove", (event) => ({ clientX: event.clientX, clientY: event.clientY }));
  forward("mousedown", () => ({}));
  forward("mouseup", () => ({}));
  forward("keydown", (event) => ({ key: event.key }));
  forward("keyup", (event) => ({ key: event.key }));
}

const threeDLink = document.querySelector("[data-3d]");
if (threeDLink && window.self === window.top) {
  const probe = document.createElement("canvas");
  const hasWebGL = Boolean(
    window.WebGLRenderingContext && (probe.getContext("webgl") || probe.getContext("experimental-webgl"))
  );
  if (hasWebGL && window.innerWidth >= 768) threeDLink.hidden = false;
}
