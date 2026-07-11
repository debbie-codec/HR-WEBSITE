const toggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const menuIcon = document.getElementById("menu-icon");

if (toggle && navMenu && menuIcon) {
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

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (e) => {
    const clickedInsideMenu = navMenu.contains(e.target);
    const clickedToggle = toggle.contains(e.target);
    if (!clickedInsideMenu && !clickedToggle && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  function closeMenuOnInteraction() {
    if (navMenu.classList.contains("active")) closeMenu();
  }

  window.addEventListener("scroll", closeMenuOnInteraction);
  window.addEventListener("wheel", closeMenuOnInteraction);
  window.addEventListener("touchmove", closeMenuOnInteraction);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) closeMenu();
  });

  window.addEventListener("blur", () => closeMenu());
}

// ---------- TABS ----------
const tabs = document.querySelectorAll(".tab");
if (tabs.length) {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
  });
}

// ---------- FEATURE CARDS ----------
const cards = document.querySelectorAll('[data-card]');
if (cards.length) {
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('featured'));
      card.classList.add('featured');
    });
    card.addEventListener('mouseleave', () => {
      cards.forEach(c => c.classList.remove('featured'));
      cards[0].classList.add('featured');
    });
  });
}

// Seamless marquee setup
function setupMarquee(trackSelector) {
  const track = document.querySelector(trackSelector);
  if (!track) return;

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

// ---------- SIGN UP PAGE ----------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  if (!form) return; // not on the signup page, skip

  const fields = ["Fullname", "email", "Website", "Password"];
  const passwordInput = document.getElementById("Password");
  const toggleIcon = document.getElementById("togglePassword");

  if (passwordInput && toggleIcon) {
    toggleIcon.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggleIcon.textContent = isHidden ? "🙈" : "👁";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    fields.forEach((id) => {
      const input = document.getElementById(id);
      const group = document.getElementById(
        id === "Fullname" ? "fullname-group" :
        id === "email" ? "email-group" :
        id === "Website" ? "website-group" : "password-group"
      );

      if (!input.value.trim()) {
        input.classList.add("error");
        group.classList.add("has-error");
        hasError = true;
      } else {
        input.classList.remove("error");
        group.classList.remove("has-error");
      }
    });

    if (!hasError) {
      form.submit();
    }
  });

  fields.forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (input.value.trim()) {
        input.classList.remove("error");
        input.closest(".form-group").classList.remove("has-error");
      }
    });
  });
});
