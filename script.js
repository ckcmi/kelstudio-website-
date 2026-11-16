/* =========================
   KELS CREATIVE STUDIO
   JAVASCRIPT (clean version)
   Replace your whole script.js with this file.
========================= */

// MOBILE NAVIGATION

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  // close the menu when a link is tapped
  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// SCROLL REVEAL ANIMATIONS

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));

} else {
  revealElements.forEach(element => element.classList.add("visible"));
}


// AUTOMATIC COPYRIGHT YEAR

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();


// CUSTOM SERVICE DROPDOWN

(function () {
  const wrapper = document.getElementById("serviceSelect");
  if (!wrapper) return;

  const trigger = wrapper.querySelector(".select-trigger");
  const valueText = wrapper.querySelector(".select-value");
  const list = wrapper.querySelector(".select-options");
  const options = Array.from(list.querySelectorAll("li"));
  const realSelect = wrapper.querySelector("select");
  const form = wrapper.closest("form");

  function openList() {
    list.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeList() {
    list.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function chooseOption(li) {
    options.forEach(o => o.classList.remove("selected"));
    li.classList.add("selected");
    valueText.textContent = li.dataset.value;
    trigger.classList.add("has-value");
    realSelect.value = li.dataset.value;
    realSelect.dispatchEvent(new Event("change", { bubbles: true }));
    closeList();
    trigger.focus();
  }

  function resetSelect() {
    options.forEach(o => o.classList.remove("selected"));
    valueText.textContent = "Select a service";
    trigger.classList.remove("has-value");
    realSelect.value = "";
  }

  trigger.addEventListener("click", () => {
    list.classList.contains("open") ? closeList() : openList();
  });

  options.forEach(li => {
    li.addEventListener("click", () => chooseOption(li));
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chooseOption(li); }
      if (e.key === "ArrowDown") { e.preventDefault(); (li.nextElementSibling || options[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (li.previousElementSibling || options[options.length - 1]).focus(); }
    });
  });

  trigger.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); openList(); options[0].focus(); }
  });

  document.addEventListener("click", e => {
    if (!wrapper.contains(e.target)) closeList();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeList(); trigger.focus(); }
  });

  if (form) form.addEventListener("reset", resetSelect);
})();


// CONTACT FORM -> FORMSPREE
// (the old email-app "mailto" handler has been removed on purpose)

(function () {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const button = form.querySelector(".submit-button");
    const originalText = button.innerHTML;
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch("https://formspree.io/f/mljbjooy", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        note.textContent = "Thank you! Your enquiry has been sent. We will reply shortly.";
        form.reset();
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      note.textContent = "Something went wrong. Please message us on WhatsApp instead.";
    } finally {
      button.disabled = false;
      button.innerHTML = originalText;
    }
  });
})();