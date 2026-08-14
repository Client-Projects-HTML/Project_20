/* ============================================================
   ColorCraft — gallery.js
   Gallery filtering, filter-aware lightbox, before/after compare
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
    if (!tabWraps.length) return;

    tabWraps.forEach(function (wrap) {
      var buttons = wrap.querySelectorAll("button");
      var targetSelector = wrap.getAttribute("data-filter-group");
      var container = document.querySelector(targetSelector);
      if (!container) return;

      var items = container.querySelectorAll("[data-category]");
      if (!items.length) return;

      wrap.setAttribute("role", "tablist");

      // Calculate category counts and set ARIA
      buttons.forEach(function (btn, index) {
        var filterVal = btn.getAttribute("data-filter") || "all";
        btn.setAttribute("role", "tab");
        btn.setAttribute("id", "tab-filter-" + filterVal);
        btn.setAttribute("aria-controls", targetSelector.replace("#", ""));

        // Count matching items
        var count = 0;
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(" ");
          if (filterVal === "all" || cats.indexOf(filterVal) !== -1) {
            count++;
          }
        });

        // Add count badge if count element not already present
        if (!btn.querySelector(".badge-count")) {
          var badge = document.createElement("span");
          badge.className = "badge-count";
          badge.textContent = count;
          btn.appendChild(badge);
        }

        // Set initial active state
        var isActive = btn.classList.contains("active");
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        btn.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      // Filter trigger function
      function applyFilter(filterVal, activeBtn) {
        buttons.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
          b.setAttribute("tabindex", "-1");
        });

        if (activeBtn) {
          activeBtn.classList.add("active");
          activeBtn.setAttribute("aria-selected", "true");
          activeBtn.setAttribute("tabindex", "0");
          activeBtn.focus();
        }

        var visibleCount = 0;

        items.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(" ");
          var show = filterVal === "all" || cats.indexOf(filterVal) !== -1;

          if (show) {
            visibleCount++;
            item.style.display = "";
            item.classList.remove("filtering-out");
            item.classList.add("filtering-in");
            setTimeout(function () {
              item.classList.remove("filtering-in");
            }, 250);
          } else {
            item.classList.add("filtering-out");
            setTimeout(function () {
              if (item.classList.contains("filtering-out")) {
                item.style.display = "none";
              }
            }, 200);
          }
        });

        // Remove old empty state message if exists
        var existingEmpty = container.querySelector(".filter-empty-state");
        if (existingEmpty) existingEmpty.remove();

        // Show empty state if zero matches
        if (visibleCount === 0) {
          var emptyDiv = document.createElement("div");
          emptyDiv.className = "filter-empty-state";
          emptyDiv.innerHTML = '<i class="bi bi-images"></i><p>No projects found in this category.</p>';
          container.appendChild(emptyDiv);
        }

        // Update URL hash without scrolling
        if (filterVal && filterVal !== "all") {
          if (history.replaceState) {
            history.replaceState(null, null, "#" + filterVal);
          } else {
            window.location.hash = filterVal;
          }
        } else if (window.location.hash) {
          if (history.replaceState) {
            history.replaceState(null, null, window.location.pathname + window.location.search);
          }
        }
      }

      // Attach click handlers
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var filterVal = btn.getAttribute("data-filter") || "all";
          applyFilter(filterVal, btn);
        });
      });

      // Keyboard navigation support for tabs (Left/Right arrow keys)
      wrap.addEventListener("keydown", function (e) {
        var btnArray = Array.prototype.slice.call(buttons);
        var currentIdx = btnArray.indexOf(document.activeElement);
        if (currentIdx === -1) return;

        var nextIdx = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          nextIdx = (currentIdx + 1) % btnArray.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          nextIdx = (currentIdx - 1 + btnArray.length) % btnArray.length;
        } else if (e.key === "Home") {
          nextIdx = 0;
        } else if (e.key === "End") {
          nextIdx = btnArray.length - 1;
        }

        if (nextIdx !== -1) {
          e.preventDefault();
          var targetBtn = btnArray[nextIdx];
          var filterVal = targetBtn.getAttribute("data-filter") || "all";
          applyFilter(filterVal, targetBtn);
        }
      });

      // Auto-select filter tab based on URL hash (e.g. #kitchen, #living-room, #exterior)
      var currentHash = window.location.hash.replace("#", "");
      if (currentHash) {
        var matchBtn = Array.prototype.find.call(buttons, function (b) {
          return b.getAttribute("data-filter") === currentHash;
        });
        if (matchBtn) {
          applyFilter(currentHash, matchBtn);
        }
      }
    });
  }

  /* ---------- Lightbox for gallery images (Filter Aware) ---------- */
  function initLightbox() {
    var lightbox = document.querySelector(".lightbox");
    if (!lightbox) return;

    var imgHolder = lightbox.querySelector(".lightbox-media");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");

    // Add counter element if not exists
    var counterEl = lightbox.querySelector(".lightbox-counter");
    if (!counterEl) {
      counterEl = document.createElement("div");
      counterEl.className = "lightbox-counter";
      lightbox.appendChild(counterEl);
    }

    var visibleItems = [];
    var currentIndex = 0;

    function getVisibleItems() {
      var allGalleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item[data-full]"));
      return allGalleryItems.filter(function (item) {
        return item.offsetParent !== null && window.getComputedStyle(item).display !== "none";
      });
    }

    function openAt(index) {
      visibleItems = getVisibleItems();
      if (!visibleItems.length) return;

      currentIndex = Math.max(0, Math.min(index, visibleItems.length - 1));
      var targetItem = visibleItems[currentIndex];
      var fullUrl = targetItem.getAttribute("data-full");

      imgHolder.style.backgroundImage = "url('" + fullUrl + "')";
      counterEl.textContent = (currentIndex + 1) + " of " + visibleItems.length;

      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    function next() {
      if (!visibleItems.length) return;
      openAt((currentIndex + 1) % visibleItems.length);
    }

    function prev() {
      if (!visibleItems.length) return;
      openAt((currentIndex - 1 + visibleItems.length) % visibleItems.length);
    }

    // Attach click events to gallery items dynamically
    document.addEventListener("click", function (e) {
      var galleryItem = e.target.closest(".gallery-item[data-full]");
      if (galleryItem) {
        visibleItems = getVisibleItems();
        var itemIdx = visibleItems.indexOf(galleryItem);
        if (itemIdx !== -1) {
          openAt(itemIdx);
        }
      }
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

    // Touch Swipe support for mobile devices
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", function (e) {
      var touchEndX = e.changedTouches[0].screenX;
      var diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) next();
        else prev();
      }
    }, { passive: true });
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
