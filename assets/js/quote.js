/* ============================================================
   ColorCraft — quote.js
   Quote/Contact form validation, image upload, cost calculator
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initFormValidation();
    initUpload();
    initPaintCalculator();
  });

  /* ---------- Generic form validation ---------- */
  function initFormValidation() {
    var forms = document.querySelectorAll("[data-validate]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll("[required]").forEach(function (field) {
          var isValid = field.value.trim() !== "";
          if (field.type === "email" && isValid) {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
          }
          if (field.type === "tel" && isValid) {
            isValid = /^[0-9+\-\s()]{7,}$/.test(field.value.trim());
          }
          field.classList.toggle("invalid", !isValid);
          if (!isValid) valid = false;
        });

        if (valid) {
          showToast("Request received!", "Thanks — our team will get back to you within 24 hours.");
          form.reset();
          var preview = form.querySelector(".upload-preview");
          if (preview) preview.innerHTML = "";
        } else {
          var firstInvalid = form.querySelector(".invalid");
          if (firstInvalid) firstInvalid.focus();
        }
      });

      form.querySelectorAll(".form-control").forEach(function (field) {
        field.addEventListener("input", function () {
          field.classList.remove("invalid");
        });
      });
    });
  }

  function showToast(title, message) {
    var toast = document.querySelector(".toast");
    if (!toast) return;
    toast.querySelector("strong").textContent = title;
    toast.querySelector("span").textContent = message;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 4500);
  }

  /* ---------- Image upload with preview ---------- */
  function initUpload() {
    document.querySelectorAll(".upload-drop").forEach(function (drop) {
      var input = drop.querySelector("input[type=file]");
      var preview = drop.parentElement.querySelector(".upload-preview");
      if (!input) return;

      drop.addEventListener("click", function () { input.click(); });
      drop.addEventListener("dragover", function (e) { e.preventDefault(); drop.classList.add("dragover"); });
      drop.addEventListener("dragleave", function () { drop.classList.remove("dragover"); });
      drop.addEventListener("drop", function (e) {
        e.preventDefault();
        drop.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
      });
      input.addEventListener("change", function () { handleFiles(input.files); });

      function handleFiles(files) {
        if (!preview) return;
        Array.prototype.forEach.call(files, function (file) {
          if (!file.type.startsWith("image/")) return;
          var reader = new FileReader();
          reader.onload = function (e) {
            var thumb = document.createElement("div");
            thumb.className = "thumb";
            thumb.style.backgroundImage = "url(" + e.target.result + ")";
            var remove = document.createElement("button");
            remove.type = "button";
            remove.innerHTML = "&times;";
            remove.setAttribute("aria-label", "Remove image");
            remove.addEventListener("click", function (ev) {
              ev.stopPropagation();
              thumb.remove();
            });
            thumb.appendChild(remove);
            preview.appendChild(thumb);
          };
          reader.readAsDataURL(file);
        });
      }
    });
  }

  /* ---------- Paint cost calculator (Color Consultation page) ---------- */
  function initPaintCalculator() {
    var form = document.querySelector("#paint-calculator");
    if (!form) return;
    var result = document.querySelector("#calc-result");
    var amountEl = result ? result.querySelector(".amount") : null;
    var breakdownEl = result ? result.querySelector(".breakdown") : null;

    var RATE_PER_SQFT = {
      basic: 18,
      standard: 26,
      premium: 38
    };
    var COATS_MULTIPLIER = { one: 1, two: 1.6 };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var area = parseFloat(form.querySelector("#calc-area").value) || 0;
      var tier = form.querySelector("#calc-tier").value;
      var coats = form.querySelector("#calc-coats").value;

      var rate = RATE_PER_SQFT[tier] || RATE_PER_SQFT.standard;
      var mult = COATS_MULTIPLIER[coats] || 1;
      var total = Math.round(area * rate * mult);

      if (amountEl) amountEl.textContent = "₹" + total.toLocaleString("en-IN");
      if (breakdownEl) {
        breakdownEl.textContent = area + " sq.ft × ₹" + rate + "/sq.ft (" + tier + ", " + (coats === "two" ? "2 coats" : "1 coat") + ")";
      }
      if (result) result.style.display = "block";
    });
  }
})();
