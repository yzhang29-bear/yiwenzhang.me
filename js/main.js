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
  /* 4. Case-study images: click to enlarge (a.zoom links to the full image) */
  var zoomLinks = document.querySelectorAll("a.zoom");
  if (zoomLinks.length && typeof HTMLDialogElement === "function") {
    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.innerHTML = '<img alt=""><button type="button" aria-label="Close">&times;</button>';
    document.body.appendChild(dlg);
    var bigImg = dlg.querySelector("img");
    zoomLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var thumb = a.querySelector("img");
        bigImg.src = a.getAttribute("href");
        bigImg.alt = thumb ? thumb.alt : "";
        dlg.showModal();
      });
    });
    dlg.addEventListener("click", function () { dlg.close(); });
  }

  /* 5. Case-study deck: buttons, counter and edge states for the sideways slides */
  document.querySelectorAll(".deck").forEach(function (deck) {
    var track = deck.querySelector(".deck-track");
    var slides = track.querySelectorAll(".deck-slide");
    var prev = deck.querySelector('[data-dir="-1"]');
    var next = deck.querySelector('[data-dir="1"]');
    var count = deck.querySelector(".deck-count");
    function current() {
      var best = 0, bestDist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    /* keep the track exactly as tall as the page on show, so the arrows sit right under it */
    function fit() {
      var i = current();
      var pad = parseFloat(window.getComputedStyle(track).paddingBottom) || 0;
      track.style.height = (slides[i].offsetHeight + pad) + "px";
    }
    function update() {
      fit();
      var i = current();
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      if (atEnd) i = slides.length - 1;
      count.textContent = (i + 1) + " / " + slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = atEnd;
    }
    var pending = null, pendingTimer = null;
    var pending = null, pendingTimer = null;
    function go(dir) {
      var base = pending !== null ? pending : current();
      var i = Math.max(0, Math.min(slides.length - 1, base + dir));
      pending = i;
      window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(function () { pending = null; }, 700);
      var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: calm ? "auto" : "smooth" });
    }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    if (window.ResizeObserver) { var ro = new ResizeObserver(fit); slides.forEach(function (s) { ro.observe(s); }); }
    update();
  });
})();
