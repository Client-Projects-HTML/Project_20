/* ============================================================
   ColorCraft — main.js
   Shared behavior across all pages
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initStickyHeader();
    initMobileNav();
    initActiveNav();
    initBackToTop();
    initScrollReveal();
    initCounters();
    initAccordion();
    initTestimonialSlider();
    initRTLToggle();
  });

  /* ---------- Dark / Light mode ---------- */
  function initTheme() {
    var root = document.documentElement;
    var toggleBtns = document.querySelectorAll("[data-theme-toggle]");
    var saved = localStorage.getItem("cc-theme");

    if (saved) {
      root.setAttribute("data-theme", saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.setAttribute("data-theme", "dark");
    }
    updateThemeIcons();

    toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("cc-theme", next);
        updateThemeIcons();
      });
    });

    function updateThemeIcons() {
      var isDark = root.getAttribute("data-theme") === "dark";
      document.querySelectorAll("[data-theme-toggle] i").forEach(function (icon) {
        icon.className = isDark ? "bi bi-sun" : "bi bi-moon-stars";
      });
    }
  }

  /* ---------- RTL toggle (optional, for demo/testing) ---------- */
  function initRTLToggle() {
    var btn = document.querySelector("[data-rtl-toggle]");
    if (!btn) return;
    var html = document.documentElement;
    if (localStorage.getItem("cc-dir") === "rtl") {
      html.setAttribute("dir", "rtl");
    }
    btn.addEventListener("click", function () {
      var isRTL = html.getAttribute("dir") === "rtl";
      html.setAttribute("dir", isRTL ? "ltr" : "rtl");
      localStorage.setItem("cc-dir", isRTL ? "ltr" : "rtl");
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  function initStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger nav ---------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("mobile-open");
      toggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
      toggle.setAttribute("aria-expanded", isOpen);
    });
  }

  /* ---------- Highlight active nav link by current page ---------- */
  function initActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  /* ---------- Back to top button ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) btn.classList.add("show");
      else btn.classList.remove("show");
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Animated counters (stats section) ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length === 0) return;
    var done = false;
    function animate() {
      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var current = 0;
        var step = Math.max(1, Math.round(target / 60));
        var timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 20);
      });
    }
    var band = document.querySelector(".stats-band");
    if (!band) { animate(); return; }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !done) {
          done = true;
          animate();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(band);
  }

  /* ---------- FAQ Accordion ---------- */
  function initAccordion() {
    var items = document.querySelectorAll(".accordion-item");
    items.forEach(function (item) {
      var header = item.querySelector(".accordion-header");
      var body = item.querySelector(".accordion-body");
      if (!header || !body) return;
      header.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".accordion-body").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonialSlider() {
    var slides = document.querySelectorAll("[data-testimonial]");
    var dotsWrap = document.querySelector(".t-dots");
    if (slides.length === 0) return;
    var idx = 0;

    function show(i) {
      slides.forEach(function (s, si) { s.style.display = si === i ? "block" : "none"; });
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (d, di) {
          d.classList.toggle("active", di === i);
        });
      }
    }

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");
        dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
        dot.addEventListener("click", function () { idx = i; show(idx); resetTimer(); });
        dotsWrap.appendChild(dot);
      });
    }

    var timer;
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        idx = (idx + 1) % slides.length;
        show(idx);
      }, 6000);
    }
    show(0);
    resetTimer();
  }
})();
