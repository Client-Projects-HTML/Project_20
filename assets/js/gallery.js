/* ============================================================
   ColorCraft — gallery.js
   Gallery filtering, lightbox, before/after compare, project tabs
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initFilterTabs();
    initLightbox();
    initBeforeAfter();
  });

  /* ---------- Filter tabs (Gallery & Projects pages) ---------- */
  function initFilterTabs() {
    var tabWraps = document.querySelectorAll("[data-filter-group]");
    tabWraps.forEach(function (wrap) {
      var buttons = wrap.querySelectorAll("button");
      var targetSelector = wrap.getAttribute("data-filter-group");
      var items = document.querySelectorAll(targetSelector + " [data-category]");

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var filter = btn.getAttribute("data-filter");
          items.forEach(function (item) {
            var cats = (item.getAttribute("data-category") || "").split(" ");
            var show = filter === "all" || cats.indexOf(filter) !== -1;
            item.style.display = show ? "" : "none";
          });
        });
      });
    });
  }

  /* ---------- Lightbox for gallery images ---------- */
  function initLightbox() {
    var items = document.querySelectorAll(".gallery-item[data-full]");
    var lightbox = document.querySelector(".lightbox");
    if (items.length === 0 || !lightbox) return;

    var imgHolder = lightbox.querySelector(".lightbox-media");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var current = 0;

    function openAt(i) {
      current = i;
      var full = items[i].getAttribute("data-full");
      imgHolder.style.backgroundImage = "url(" + full + ")";
      lightbox.classList.add("open");
    }
    function close() { lightbox.classList.remove("open"); }
    function next() { openAt((current + 1) % items.length); }
    function prev() { openAt((current - 1 + items.length) % items.length); }

    items.forEach(function (item, i) {
      item.addEventListener("click", function () { openAt(i); });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  /* ---------- Before/After drag compare (Projects page) ---------- */
  function initBeforeAfter() {
    document.querySelectorAll(".ba-compare").forEach(function (wrap) {
      var beforeImg = wrap.querySelector(".before-img");
      var handle = wrap.querySelector(".ba-handle");
      if (!beforeImg) return;
      var dragging = false;

      function setPos(clientX) {
        var rect = wrap.getBoundingClientRect();
        var pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        beforeImg.style.width = pct + "%";
        if (handle) handle.style.left = pct + "%";
      }

      wrap.addEventListener("mousedown", function (e) { dragging = true; setPos(e.clientX); });
      window.addEventListener("mousemove", function (e) { if (dragging) setPos(e.clientX); });
      window.addEventListener("mouseup", function () { dragging = false; });

      wrap.addEventListener("touchstart", function (e) { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
      wrap.addEventListener("touchmove", function (e) { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
      wrap.addEventListener("touchend", function () { dragging = false; });
    });
  }
})();
