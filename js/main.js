/* ==========================================================
   Yiwen Zhang — Personal Site
   Global nav interactions
   ========================================================== */

(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  /* 1. Add subtle border/shadow once the user scrolls */
  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. Mobile hamburger toggle */
  toggle.addEventListener("click", function () {
    var isOpen = mobileMenu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  /* Close the mobile menu when a link is tapped */
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });

  /* 3. Highlight the nav link for the section in view.
     Only applies when nav links are in-page anchors; on multi-page
     nav the active link is hardcoded per page. */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  var hasAnchorLinks = Array.prototype.some.call(navLinks, function (l) {
    return (l.getAttribute("href") || "").charAt(0) === "#";
  });

  if ("IntersectionObserver" in window && sections.length && hasAnchorLinks) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var href = link.getAttribute("href");
              link.classList.toggle("active", href === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* Hero logo: Safari doesn't composite VP9 alpha in WebM reliably;
     serve the animated transparent WebP instead (same colors). */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    var heroImg = document.createElement("img");
    heroImg.src = "assets/zhang-safari.webp";
    heroImg.alt = "Zhang animated logo";
    heroImg.width = 720;
    heroImg.height = 720;
    heroVideo.replaceWith(heroImg);
  }
})();
