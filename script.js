const toggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});