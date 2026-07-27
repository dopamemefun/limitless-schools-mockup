/* Limitless Schools mockup — accessible nav.
   Desktop (hover-capable, ≥861px): menus open on HOVER and on keyboard FOCUS
   (handled in CSS via :hover / :focus-within). This script only keeps
   aria-expanded honest. Mobile (≤860px): the trigger TAPS open an accordion.
   Core content works without JS. */
(function () {
  "use strict";

  var DESKTOP = window.matchMedia("(min-width: 1321px)"); /* matches the CSS nav-collapse breakpoint */

  // --- Mobile menu (hamburger) toggle ---
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("primary-nav");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".has-menu"));

  function setExpanded(li, val) {
    var btn = li.querySelector(".navlink");
    if (btn) btn.setAttribute("aria-expanded", val ? "true" : "false");
  }
  function setOpen(li, val) {            // mobile accordion state
    li.setAttribute("data-open", val ? "true" : "false");
    setExpanded(li, val);
  }
  function closeAccordion(except) {
    dropdowns.forEach(function (li) { if (li !== except) setOpen(li, false); });
  }

  dropdowns.forEach(function (li) {
    var btn = li.querySelector(".navlink");
    if (!btn) return;

    // Desktop: CSS opens on hover/focus — just mirror that into aria-expanded.
    li.addEventListener("mouseenter", function () { if (DESKTOP.matches) setExpanded(li, true); });
    li.addEventListener("mouseleave", function () { if (DESKTOP.matches) setExpanded(li, false); });
    li.addEventListener("focusin",   function () { if (DESKTOP.matches) setExpanded(li, true); });
    li.addEventListener("focusout",  function (e) {
      if (DESKTOP.matches && !li.contains(e.relatedTarget)) setExpanded(li, false);
    });

    // Mobile: tap the trigger to expand/collapse (one open at a time).
    btn.addEventListener("click", function (e) {
      if (DESKTOP.matches) return;       // desktop is hover-driven; don't toggle
      e.preventDefault();
      var isOpen = li.getAttribute("data-open") === "true";
      closeAccordion(li);
      setOpen(li, !isOpen);
    });
  });

  // Escape closes any open menu and returns focus to its trigger.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var active = document.activeElement;
    var li = active && active.closest ? active.closest(".has-menu") : null;
    closeAccordion(null);
    if (li) {
      var btn = li.querySelector(".navlink");
      if (active.blur) active.blur();    // drop focus so :focus-within closes it on desktop
      if (btn) btn.focus();
    }
  });

  // Tap outside closes the mobile accordion.
  document.addEventListener("click", function (e) {
    if (!DESKTOP.matches && !e.target.closest(".has-menu")) closeAccordion(null);
  });

  // Crossing into desktop: clear any leftover accordion state.
  DESKTOP.addEventListener("change", function () { if (DESKTOP.matches) closeAccordion(null); });
})();
