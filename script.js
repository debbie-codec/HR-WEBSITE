const toggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const menuIcon = document.getElementById("menu-icon");

function openMenu() {
  navMenu.classList.add("active");
  menuIcon.innerHTML = "&times;";
}

function closeMenu() {
  navMenu.classList.remove("active");
  menuIcon.innerHTML = "&#9776;";
}

toggle.addEventListener("click", (e) => {
  e.stopPropagation();

  if (navMenu.classList.contains("active")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close when a nav link is clicked
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Close when clicking anywhere outside the menu or toggle button
document.addEventListener("click", (e) => {
  const clickedInsideMenu = navMenu.contains(e.target);
  const clickedToggle = toggle.contains(e.target);

  if (
    !clickedInsideMenu &&
    !clickedToggle &&
    navMenu.classList.contains("active")
  ) {
    closeMenu();
  }
});

// Close the menu when the user scrolls or swipes
function closeMenuOnInteraction() {
  if (navMenu.classList.contains("active")) {
    closeMenu();
  }
}

window.addEventListener("scroll", closeMenuOnInteraction);
window.addEventListener("wheel", closeMenuOnInteraction);
window.addEventListener("touchmove", closeMenuOnInteraction);

// ---------- TABS ----------
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    document
      .getElementById("panel-" + tab.dataset.tab)
      .classList.add("active");
  });
});
// ---------- FEATURE CARDS ----------
const cards = document.querySelectorAll('[data-card]');

cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    cards.forEach(c => c.classList.remove('featured'));
    card.classList.add('featured');
  });

  card.addEventListener('mouseleave', () => {
    cards.forEach(c => c.classList.remove('featured'));
    cards[0].classList.add('featured'); // Makes the first card active again
  });
});

// Close menu when the browser tab loses focus (user switches tabs/apps)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    closeMenu();
  }
});

window.addEventListener("blur", () => {
  closeMenu();
});
// Seamless marquee setup
function setupMarquee(trackSelector) {
  const track = document.querySelector(trackSelector);
  if (!track) return;

  // Clone all current children once to guarantee an exact duplicate
  const items = Array.from(track.children).filter(
    (el) => !el.hasAttribute("data-clone")
  );

  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("data-clone", "true");
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}

setupMarquee(".logo-track");
setupMarquee(".recognition-track");
