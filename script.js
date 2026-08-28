window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("boot-screen").classList.add("hidden");
  }, 1200);
});

function updateClocks() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  document.getElementById("menu-clock").textContent = timeStr;
  const lockClock = document.getElementById("lock-clock");
  const lockDate = document.getElementById("lock-date");
  if (lockClock) lockClock.textContent = timeStr;
  if (lockDate) lockDate.textContent = dateStr;
}
setInterval(updateClocks, 1000);
updateClocks();

const APP_WINDOWS = ["skills", "experience", "education", "projects", "resume", "about"];

function openApp(app) {
  if (app === "email") {
    window.location.href = "mailto:gracydanielrr@gmail.com";
    return;
  }
  const win = document.getElementById("window-" + app);
  if (!win) return;

  win.classList.add("visible");
  bringToFront(win);
  requestAnimationFrame(() => win.classList.add("show"));

  document
    .querySelectorAll('.dock-icon[data-app="' + app + '"]')
    .forEach((d) => d.classList.add("open"));
}

function closeApp(app) {
  const win = document.getElementById("window-" + app);
  if (!win) return;
  win.classList.remove("show");
  setTimeout(() => win.classList.remove("visible"), 180);
  document
    .querySelectorAll('.dock-icon[data-app="' + app + '"]')
    .forEach((d) => d.classList.remove("open"));
}

let topZ = 50;
function bringToFront(win) {
  document.querySelectorAll(".window").forEach((w) => w.classList.remove("focused"));
  topZ += 1;
  win.style.zIndex = topZ;
  win.classList.add("focused");
}

document.querySelectorAll(".desktop-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    document.querySelectorAll(".desktop-icon").forEach((i) => i.classList.remove("selected"));
    icon.classList.add("selected");
    openApp(icon.dataset.app);
    e.stopPropagation();
  });
});

document.querySelectorAll(".dock-icon[data-app]").forEach((icon) => {
  icon.addEventListener("click", () => openApp(icon.dataset.app));
});

document.querySelectorAll(".tl-close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeApp(btn.dataset.close);
  });
});

document.querySelectorAll(".window").forEach((win) => {
  win.addEventListener("mousedown", () => bringToFront(win));
});

document.querySelectorAll(".window-titlebar").forEach((bar) => {
  const win = bar.closest(".window");
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const startDrag = (clientX, clientY) => {
    dragging = true;
    const rect = win.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    bringToFront(win);
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragging) return;
    win.style.left = Math.max(0, clientX - offsetX) + "px";
    win.style.top = Math.max(28, clientY - offsetY) + "px";
  };

  const stopDrag = () => (dragging = false);

  bar.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
  window.addEventListener("mouseup", stopDrag);

  bar.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  });
  window.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  });
  window.addEventListener("touchend", stopDrag);
});

const contextMenu = document.getElementById("context-menu");
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest(".window") || e.target.closest(".dock")) return;
  e.preventDefault();
  contextMenu.style.left = e.clientX + "px";
  contextMenu.style.top = e.clientY + "px";
  contextMenu.classList.add("visible");
});
document.addEventListener("click", () => contextMenu.classList.remove("visible"));

document.querySelectorAll(".context-item").forEach((item) => {
  item.addEventListener("click", () => {
    const action = item.dataset.action;
    if (action === "refresh") {
      document.querySelectorAll(".desktop-icon").forEach((i) => i.classList.remove("selected"));
    } else if (action === "about") {
      openApp("about");
    }
    contextMenu.classList.remove("visible");
  });
});

document.querySelectorAll(".project-image").forEach((img) => {
  img.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "project-image placeholder";
    fallback.textContent = "Capture à venir";
    img.replaceWith(fallback);
  });
});

const lockScreen = document.getElementById("lock-screen");
document.getElementById("dock-power").addEventListener("click", () => {
  lockScreen.classList.add("visible");
});
document.getElementById("unlock-btn").addEventListener("click", () => {
  lockScreen.classList.remove("visible");
});
