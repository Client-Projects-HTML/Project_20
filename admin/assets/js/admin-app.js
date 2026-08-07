/* ColorCraft — Admin page logic */
window.AdmApp = (function () {
  let Adm;
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function initials(name) { return String(name).split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
  /* Stable placeholder photo for cards that don't have an uploaded image yet */
  function placeholderImg(seed, w, h) { return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w || 400}/${h || 300}`; }

  /* ================= LOGIN ================= */
  function initLogin() {
    const form = qs("#loginForm");
    const err = qs("#loginError");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = qs("#loginEmail").value.trim();
      const pass = qs("#loginPassword").value;
      if (email.length < 3 || pass.length < 3) {
        err.textContent = "Please enter a valid email and password.";
        err.classList.add("show");
        return;
      }
      Adm.login(qs("#loginRemember").checked);
      window.location.href = "dashboard.html";
    });
    qs("#loginDemoBtn").addEventListener("click", () => {
      qs("#loginEmail").value = "admin@colorcraft.example.com";
      qs("#loginPassword").value = "demo1234";
    });
  }

  /* ================= DASHBOARD ================= */
  function initDashboard() {
    const appts = Adm.getStore("appointments", []);
    const projects = Adm.getStore("projects", []);
    const enquiries = Adm.getStore("enquiries", []);
    const customers = uniqueCustomers(appts, projects);

    const stats = [
      { label: "Total Enquiries", value: enquiries.length, icon: "✉️" },
      { label: "Total Appointments", value: appts.length, icon: "🗓️" },
      { label: "Ongoing Projects", value: projects.filter(p => p.status === "ongoing").length, icon: "🏗️" },
      { label: "Completed Projects", value: projects.filter(p => p.status === "completed").length, icon: "✅" },
      { label: "Pending Quotes", value: enquiries.filter(e => e.status === "new").length, icon: "📄" },
      { label: "Customers", value: customers.length, icon: "👥" },
      { label: "Revenue", value: Adm.money(estimateRevenue(projects)), icon: "💰" },
      { label: "Appointments Today", value: appts.filter(a => a.preferredDate === new Date().toISOString().slice(0, 10)).length, icon: "📍" }
    ];
    Adm.contentEl().innerHTML = `
      <div class="adm-stat-grid">${stats.map(s => `
        <div class="adm-stat-card"><div class="adm-stat-icon">${s.icon}</div><div class="adm-stat-value">${s.value}</div><div class="adm-stat-label">${s.label}</div></div>`).join("")}</div>
      <div class="adm-grid-2">
        <div class="adm-panel"><div class="adm-panel-head"><h2>Monthly Enquiries</h2></div><canvas id="enqChart"></canvas></div>
        <div class="adm-panel"><div class="adm-panel-head"><h2>Recent Appointments</h2><a href="appointments.html" class="adm-btn adm-btn-outline adm-btn-sm">View all</a></div><div id="recentAppts"></div></div>
      </div>
      <div class="adm-panel"><div class="adm-panel-head"><h2>Recent Enquiries</h2><a href="enquiries.html" class="adm-btn adm-btn-outline adm-btn-sm">View all</a></div><div id="recentEnq"></div></div>
    `;
    const months = [], counts = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(m.toLocaleDateString("en-IN", { month: "short" }));
      counts.push(enquiries.filter(e => { const d = new Date(e.date); return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth(); }).length);
    }
    Adm.drawChart(qs("#enqChart"), { type: "line", labels: months, data: counts });

    const recentA = [...appts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    qs("#recentAppts").innerHTML = recentA.map(a => `
      <div class="adm-list-row"><div class="adm-list-avatar">${initials(a.customer)}</div>
        <div class="adm-list-main"><div class="adm-list-title">${Adm.esc(a.customer)} — ${Adm.esc(a.service)}</div><div class="adm-list-sub">${Adm.fmtDate(a.preferredDate)}</div></div>
        ${Adm.statusBadge(a.status)}</div>`).join("");

    const recentE = [...enquiries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    qs("#recentEnq").innerHTML = recentE.map(e => `
      <div class="adm-list-row"><div class="adm-list-avatar">${initials(e.name)}</div>
        <div class="adm-list-main"><div class="adm-list-title">${Adm.esc(e.name)} — ${Adm.esc(e.subject)}</div><div class="adm-list-sub">${Adm.fmtDate(e.date)}</div></div>
        ${Adm.statusBadge(e.status === "new" ? "pending" : "completed")}</div>`).join("");
  }
  function uniqueCustomers(appts, projects) {
    const map = {};
    appts.forEach(a => map[a.customer + a.phone] = true);
    projects.forEach(p => map[p.customer] = true);
    return Object.keys(map);
  }
  function estimateRevenue(projects) {
    return projects.filter(p => p.status === "completed").length * 42000;
  }

  /* ================= SERVICES ================= */
  function initServices() {
    render();
    function render() {
      const items = Adm.getStore("services", []);
      Adm.contentEl().innerHTML = `<div class="adm-toolbar"><div class="adm-spacer"></div><button class="adm-btn adm-btn-primary" id="addSvc">+ Add Service</button></div><div class="adm-card-grid" id="svcGrid"></div>`;
      qs("#svcGrid").innerHTML = items.map(s => `
        <div class="adm-item-card">
          <div class="thumb"><img src="${s.img ? Adm.esc(s.img) : placeholderImg('svc-' + s.id)}" alt="${Adm.esc(s.name)}" loading="lazy"></div>
          <div class="body"><div class="title">${Adm.esc(s.name)}</div>
            <div class="meta">${s.price ? Adm.money(s.price) + " " + Adm.esc(s.unit) : "Quote on request"}</div>
            <div class="meta">${Adm.esc(s.desc)}</div></div>
          <div class="foot">
            <button class="adm-btn adm-btn-sm adm-btn-outline" data-edit="${s.id}">Edit</button>
            <button class="adm-icon-action" data-del="${s.id}" title="Delete" aria-label="Delete service">🗑</button>
          </div>
        </div>`).join("");
      qs("#addSvc").onclick = () => openModal(null);
      qsa("[data-edit]").forEach(b => b.onclick = () => openModal(items.find(s => s.id === b.dataset.edit)));
      qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Delete this service?", () => {
        Adm.setStore("services", items.filter(s => s.id !== b.dataset.del));
        Adm.toast("Service deleted.", "success"); render();
      }));
    }
    function openModal(existing) {
      const body = `
        <div class="adm-field"><label>Service Name</label><input id="svName" value="${existing ? Adm.esc(existing.name) : ''}"></div>
        <div class="adm-field-row">
          <div class="adm-field"><label>Price (₹, 0 = quote on request)</label><input id="svPrice" type="number" value="${existing ? existing.price : 0}"></div>
          <div class="adm-field"><label>Unit</label><input id="svUnit" value="${existing ? Adm.esc(existing.unit) : 'per sq.ft'}"></div>
        </div>
        <div class="adm-field"><label>Description</label><textarea id="svDesc" rows="3">${existing ? Adm.esc(existing.desc) : ''}</textarea></div>
        <div class="adm-field"><label>Service Image</label><input type="file" accept="image/*"></div>
        <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Cancel</button><button class="adm-btn adm-btn-primary" id="svSave">${existing ? 'Save' : 'Add Service'}</button></div>
      `;
      const el = Adm.openModal(existing ? "Edit Service" : "Add Service", body);
      el.querySelector("[data-cancel]").onclick = Adm.closeModal;
      el.querySelector("#svSave").onclick = () => {
        const name = qs("#svName").value.trim();
        if (!name) { Adm.toast("Service name is required.", "error"); return; }
        const items = Adm.getStore("services", []);
        const data = { name, price: Number(qs("#svPrice").value) || 0, unit: qs("#svUnit").value.trim(), desc: qs("#svDesc").value.trim(), img: existing ? existing.img : "" };
        if (existing) Object.assign(items.find(s => s.id === existing.id), data);
        else items.push(Object.assign({ id: Adm.uid("S") }, data));
        Adm.setStore("services", items);
        Adm.closeModal(); Adm.toast(existing ? "Service updated." : "Service added.", "success"); render();
      };
    }
  }

  /* ================= PROJECTS ================= */
  function initProjects() {
    render();
    function render() {
      const items = Adm.getStore("projects", []);
      Adm.contentEl().innerHTML = `
        <div class="adm-toolbar"><input type="search" class="adm-search" id="prjSearch" placeholder="Search projects...">
          <select id="prjStatus"><option value="all">All Status</option><option>ongoing</option><option>completed</option><option>pending</option></select>
          <div class="adm-spacer"></div><button class="adm-btn adm-btn-primary" id="addPrj">+ Add Project</button></div>
        <div class="adm-panel"><div id="prjTable"></div></div>`;
      qs("#addPrj").onclick = () => openModal(null);
      qs("#prjSearch").addEventListener("input", () => draw());
      qs("#prjStatus").addEventListener("change", () => draw());
      draw();
      function draw() {
        const q = qs("#prjSearch").value.toLowerCase();
        const st = qs("#prjStatus").value;
        let rows = items.filter(p => (p.name + p.customer + p.location).toLowerCase().includes(q));
        if (st !== "all") rows = rows.filter(p => p.status === st);
        Adm.buildTable(qs("#prjTable"), [
          { label: "Project", key: "name" }, { label: "Customer", key: "customer" }, { label: "Location", key: "location" },
          { label: "Service", key: "service" }, { label: "Start", render: p => Adm.fmtDate(p.startDate) },
          { label: "End", render: p => p.endDate ? Adm.fmtDate(p.endDate) : "—" },
          { label: "Before/After", render: p => `${p.images || 0} images` },
          { label: "Status", render: p => Adm.statusBadge(p.status) },
          { label: "Actions", render: p => `<div class="adm-row-actions"><button class="adm-btn adm-btn-sm adm-btn-outline" data-edit="${p.id}">Edit</button><button class="adm-btn adm-btn-sm adm-btn-danger" data-del="${p.id}">Delete</button></div>` }
        ], rows, { emptyText: "No projects match your filters." });
        qsa("[data-edit]").forEach(b => b.onclick = () => openModal(items.find(p => p.id === b.dataset.edit)));
        qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Delete this project?", () => {
          Adm.setStore("projects", items.filter(p => p.id !== b.dataset.del));
          Adm.toast("Project deleted.", "success"); render();
        }));
      }
    }
    function openModal(existing) {
      const services = Adm.getStore("services", []);
      const body = `
        <div class="adm-field"><label>Project Name</label><input id="pjName" value="${existing ? Adm.esc(existing.name) : ''}"></div>
        <div class="adm-field-row">
          <div class="adm-field"><label>Customer</label><input id="pjCust" value="${existing ? Adm.esc(existing.customer) : ''}"></div>
          <div class="adm-field"><label>Location</label><input id="pjLoc" value="${existing ? Adm.esc(existing.location) : ''}"></div>
        </div>
        <div class="adm-field"><label>Service Type</label><select id="pjSvc">${services.map(s => `<option ${existing && existing.service === s.name ? 'selected' : ''}>${s.name}</option>`).join("")}</select></div>
        <div class="adm-field-row">
          <div class="adm-field"><label>Start Date</label><input type="date" id="pjStart" value="${existing ? existing.startDate : ''}"></div>
          <div class="adm-field"><label>End Date</label><input type="date" id="pjEnd" value="${existing ? existing.endDate : ''}"></div>
        </div>
        <div class="adm-field"><label>Status</label><select id="pjStatus">${["ongoing", "completed", "pending"].map(s => `<option ${existing && existing.status === s ? 'selected' : ''}>${s}</option>`).join("")}</select></div>
        <div class="adm-field"><label>Before & After Images</label><input type="file" accept="image/*" multiple></div>
        <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Cancel</button><button class="adm-btn adm-btn-primary" id="pjSave">${existing ? 'Save' : 'Add Project'}</button></div>
      `;
      const el = Adm.openModal(existing ? "Edit Project" : "Add Project", body, { wide: true });
      el.querySelector("[data-cancel]").onclick = Adm.closeModal;
      el.querySelector("#pjSave").onclick = () => {
        const name = qs("#pjName").value.trim();
        if (!name) { Adm.toast("Project name is required.", "error"); return; }
        const items = Adm.getStore("projects", []);
        const data = {
          name, customer: qs("#pjCust").value.trim(), location: qs("#pjLoc").value.trim(), service: qs("#pjSvc").value,
          startDate: qs("#pjStart").value, endDate: qs("#pjEnd").value, status: qs("#pjStatus").value, images: existing ? existing.images : 2
        };
        if (existing) Object.assign(items.find(p => p.id === existing.id), data);
        else items.push(Object.assign({ id: Adm.uid("PRJ") }, data));
        Adm.setStore("projects", items);
        Adm.closeModal(); Adm.toast(existing ? "Project updated." : "Project added.", "success"); render();
      };
    }
  }

  /* ================= APPOINTMENTS ================= */
  function initAppointments() {
    render();
    function render() {
      const items = Adm.getStore("appointments", []);
      Adm.contentEl().innerHTML = `
        <div class="adm-toolbar"><input type="search" class="adm-search" id="apSearch" placeholder="Search appointments...">
          <select id="apStatus"><option value="all">All Status</option><option>pending</option><option>approved</option><option>completed</option><option>rejected</option></select>
          <div class="adm-spacer"></div><button class="adm-btn adm-btn-outline" id="apExport">⬇ Export CSV</button></div>
        <div class="adm-panel"><div id="apTable"></div></div>`;
      qs("#apSearch").addEventListener("input", draw);
      qs("#apStatus").addEventListener("change", draw);
      qs("#apExport").addEventListener("click", () => {
        Adm.exportCSV("appointments.csv",
          [{ label: "Appointment ID", key: "id" }, { label: "Customer", key: "customer" }, { label: "Phone", key: "phone" }, { label: "Service", key: "service" }, { label: "Preferred Date", key: "preferredDate" }, { label: "Status", key: "status" }],
          items);
        Adm.toast("Appointments exported.", "success");
      });
      draw();
      function draw() {
        const q = qs("#apSearch").value.toLowerCase();
        const st = qs("#apStatus").value;
        let rows = items.filter(a => (a.customer + a.phone + a.id).toLowerCase().includes(q));
        if (st !== "all") rows = rows.filter(a => a.status === st);
        rows = rows.sort((a, b) => new Date(b.preferredDate) - new Date(a.preferredDate));
        Adm.buildTable(qs("#apTable"), [
          { label: "Appointment ID", key: "id" }, { label: "Customer Name", key: "customer" }, { label: "Phone", key: "phone" },
          { label: "Service", key: "service" }, { label: "Preferred Date", render: a => Adm.fmtDate(a.preferredDate) },
          { label: "Status", render: a => Adm.statusBadge(a.status) },
          {
            label: "Actions", render: a => `<div class="adm-row-actions">
            ${a.status === 'pending' ? `<button class="adm-btn adm-btn-sm adm-btn-primary" data-appr="${a.id}">Approve</button><button class="adm-btn adm-btn-sm adm-btn-danger" data-rej="${a.id}">Reject</button>` : ""}
            ${a.status === 'approved' ? `<button class="adm-btn adm-btn-sm adm-btn-outline" data-comp="${a.id}">Complete</button>` : ""}
          </div>`
          }
        ], rows, { emptyText: "No appointments found." });
        qsa("[data-appr]").forEach(b => b.onclick = () => setStatus(b.dataset.appr, "approved"));
        qsa("[data-rej]").forEach(b => b.onclick = () => Adm.confirmAction("Reject this appointment?", () => setStatus(b.dataset.rej, "rejected")));
        qsa("[data-comp]").forEach(b => b.onclick = () => setStatus(b.dataset.comp, "completed"));
      }
      function setStatus(id, status) {
        const a = items.find(x => x.id === id); a.status = status;
        Adm.setStore("appointments", items);
        Adm.toast("Appointment marked " + status + ".", "success"); render();
      }
    }
  }

  /* ================= ENQUIRIES ================= */
  function initEnquiries() {
    render();
    function render() {
      const items = Adm.getStore("enquiries", []);
      Adm.contentEl().innerHTML = `<div class="adm-panel"><div id="enqTable"></div></div>`;
      Adm.buildTable(qs("#enqTable"), [
        { label: "Name", key: "name" }, { label: "Email", key: "email" }, { label: "Phone", key: "phone" },
        { label: "Subject", key: "subject" }, { label: "Date", render: e => Adm.fmtDate(e.date) },
        { label: "Status", render: e => Adm.statusBadge(e.status === 'new' ? 'pending' : 'completed') },
        { label: "Actions", render: e => `<div class="adm-row-actions"><button class="adm-btn adm-btn-sm adm-btn-outline" data-view="${e.id}">View / Reply</button><button class="adm-btn adm-btn-sm adm-btn-danger" data-del="${e.id}">Delete</button></div>` }
      ], items);
      qsa("[data-view]").forEach(b => b.onclick = () => openView(items.find(e => e.id === b.dataset.view)));
      qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Delete this enquiry?", () => {
        Adm.setStore("enquiries", items.filter(e => e.id !== b.dataset.del));
        Adm.toast("Enquiry deleted.", "success"); render();
      }));
      function openView(item) {
        const body = `
          <p><strong>${Adm.esc(item.name)}</strong> · ${Adm.esc(item.email)} · ${Adm.esc(item.phone)}</p>
          <p style="color:var(--adm-text-muted);font-size:13px;">${Adm.fmtDate(item.date)} — ${Adm.esc(item.subject)}</p>
          <p>${Adm.esc(item.message)}</p>
          <div class="adm-field"><label>Reply</label><textarea id="replyBox" rows="4">${Adm.esc(item.reply)}</textarea></div>
          <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Close</button><button class="adm-btn adm-btn-primary" id="sendReply">Send Reply</button></div>`;
        const el = Adm.openModal("Enquiry — " + item.subject, body, { wide: true });
        el.querySelector("[data-cancel]").onclick = Adm.closeModal;
        el.querySelector("#sendReply").onclick = () => {
          item.reply = qs("#replyBox").value.trim(); item.status = "replied";
          Adm.setStore("enquiries", items);
          Adm.closeModal(); Adm.toast("Reply sent.", "success"); render();
        };
      }
    }
  }

  /* ================= CUSTOMERS ================= */
  function initCustomers() {
    const appts = Adm.getStore("appointments", []);
    const projects = Adm.getStore("projects", []);
    const map = {};
    appts.forEach(a => {
      const key = a.customer + a.phone;
      if (!map[key]) map[key] = { name: a.customer, email: a.email, phone: a.phone, bookings: [] };
      map[key].bookings.push(a);
    });
    projects.forEach(p => {
      const key = p.customer;
      const found = Object.values(map).find(c => c.name === p.customer);
      if (!found) map["p_" + key] = { name: p.customer, email: "—", phone: "—", bookings: [{ preferredDate: p.startDate }] };
    });
    const customers = Object.values(map).map(c => ({
      ...c, total: c.bookings.length,
      last: c.bookings.map(b => b.preferredDate).sort().reverse()[0],
      status: "Active"
    }));
    Adm.contentEl().innerHTML = `<div class="adm-toolbar"><input type="search" class="adm-search" id="custSearch" placeholder="Search customers..."></div><div class="adm-panel"><div id="custTable"></div></div>`;
    function draw(list) {
      Adm.buildTable(qs("#custTable"), [
        { label: "Customer Name", key: "name" }, { label: "Email", key: "email" }, { label: "Phone", key: "phone" },
        { label: "Total Bookings", key: "total" }, { label: "Last Booking", render: c => Adm.fmtDate(c.last) },
        { label: "Status", render: c => Adm.statusBadge(c.status) }
      ], list);
    }
    draw(customers);
    qs("#custSearch").addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      draw(customers.filter(c => (c.name + c.email + c.phone).toLowerCase().includes(q)));
    });
  }

  /* ================= TESTIMONIALS ================= */
  function initTestimonials() {
    render();
    function render() {
      const items = Adm.getStore("testimonials", []);
      Adm.contentEl().innerHTML = `<div class="adm-panel"><div id="testTable"></div></div>`;
      Adm.buildTable(qs("#testTable"), [
        { label: "Customer", key: "name" },
        { label: "Rating", render: t => `<span class="adm-rating">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</span>` },
        { label: "Comment", render: t => `<div style="max-width:320px;">${Adm.esc(t.comment)}</div>` },
        { label: "Status", render: t => Adm.statusBadge(t.status) },
        { label: "Actions", render: t => `<div class="adm-row-actions">
            ${t.status !== 'approved' ? `<button class="adm-btn adm-btn-sm adm-btn-primary" data-appr="${t.id}">Approve</button>` : ""}
            ${t.status !== 'rejected' ? `<button class="adm-btn adm-btn-sm adm-btn-outline" data-rej="${t.id}">Reject</button>` : ""}
            <button class="adm-btn adm-btn-sm adm-btn-danger" data-del="${t.id}">Delete</button></div>` }
      ], items);
      qsa("[data-appr]").forEach(b => b.onclick = () => setStatus(b.dataset.appr, "approved"));
      qsa("[data-rej]").forEach(b => b.onclick = () => setStatus(b.dataset.rej, "rejected"));
      qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Delete this review permanently?", () => {
        Adm.setStore("testimonials", items.filter(t => t.id !== b.dataset.del));
        Adm.toast("Review deleted.", "success"); render();
      }));
      function setStatus(id, status) {
        const t = items.find(x => x.id === id); t.status = status;
        Adm.setStore("testimonials", items);
        Adm.toast("Review " + status + ".", "success"); render();
      }
    }
  }

  /* ================= GALLERY ================= */
  function initGallery() {
    render();
    function render() {
      const items = Adm.getStore("gallery", []);
      Adm.contentEl().innerHTML = `<div class="adm-toolbar"><div class="adm-spacer"></div><button class="adm-btn adm-btn-primary" id="addImg">+ Upload Image</button></div><div class="adm-card-grid" id="galGrid"></div>`;
      qs("#galGrid").innerHTML = items.map(g => `
        <div class="adm-item-card">
          <div class="thumb"><img src="${g.img ? Adm.esc(g.img) : placeholderImg('gal-' + g.id)}" alt="${Adm.esc(g.caption)}" loading="lazy"></div>
          <div class="body"><div class="title">${Adm.esc(g.caption)} ${g.featured ? '⭐' : ''}</div><div class="meta">${Adm.esc(g.category)}</div></div>
          <div class="foot">
            <button class="adm-btn adm-btn-sm adm-btn-outline" data-cap="${g.id}">Caption</button>
            <button class="adm-btn adm-btn-sm adm-btn-outline" data-feat="${g.id}">${g.featured ? 'Unfeature' : 'Feature'}</button>
            <button class="adm-icon-action" data-del="${g.id}" title="Delete" aria-label="Delete image">🗑</button>
          </div>
        </div>`).join("");
      qs("#addImg").onclick = () => addItem();
      qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Delete this image?", () => {
        Adm.setStore("gallery", items.filter(g => g.id !== b.dataset.del));
        Adm.toast("Deleted.", "success"); render();
      }));
      qsa("[data-feat]").forEach(b => b.onclick = () => {
        const item = items.find(g => g.id === b.dataset.feat);
        item.featured = !item.featured;
        Adm.setStore("gallery", items);
        Adm.toast(item.featured ? "Marked as featured." : "Removed from featured.", "success"); render();
      });
      qsa("[data-cap]").forEach(b => b.onclick = () => {
        const item = items.find(g => g.id === b.dataset.cap);
        const body = `<div class="adm-field"><label>Caption</label><input id="capInput" value="${Adm.esc(item.caption)}"></div>
          <div class="adm-field"><label>Category</label><select id="catInput">${["Interior", "Exterior", "Texture", "Wallpaper", "Before & After"].map(c => `<option ${item.category === c ? 'selected' : ''}>${c}</option>`).join("")}</select></div>
          <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Cancel</button><button class="adm-btn adm-btn-primary" id="capSave">Save</button></div>`;
        const el = Adm.openModal("Edit Image", body);
        el.querySelector("[data-cancel]").onclick = Adm.closeModal;
        el.querySelector("#capSave").onclick = () => {
          item.caption = qs("#capInput").value.trim(); item.category = qs("#catInput").value;
          Adm.setStore("gallery", items);
          Adm.closeModal(); Adm.toast("Updated.", "success"); render();
        };
      });
    }
    function addItem() {
      const body = `
        <div class="adm-field"><label>Image File</label><input type="file" accept="image/*"></div>
        <div class="adm-field"><label>Caption</label><input id="newCap" placeholder="e.g. Living room texture finish"></div>
        <div class="adm-field"><label>Category</label><select id="newCat">${["Interior", "Exterior", "Texture", "Wallpaper", "Before & After"].map(c => `<option>${c}</option>`).join("")}</select></div>
        <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Cancel</button><button class="adm-btn adm-btn-primary" id="upSave">Upload</button></div>`;
      const el = Adm.openModal("Upload Image", body);
      el.querySelector("[data-cancel]").onclick = Adm.closeModal;
      el.querySelector("#upSave").onclick = () => {
        const items = Adm.getStore("gallery", []);
        items.unshift({ id: Adm.uid("IMG"), caption: qs("#newCap").value.trim() || "Untitled", category: qs("#newCat").value, featured: false, img: "" });
        Adm.setStore("gallery", items);
        Adm.closeModal(); Adm.toast("Image uploaded.", "success"); render();
      };
    }
  }

  /* ================= BLOG ================= */
  function initBlog() {
    render();
    function render() {
      const items = Adm.getStore("blog", []);
      Adm.contentEl().innerHTML = `<div class="adm-toolbar"><div class="adm-spacer"></div><button class="adm-btn adm-btn-primary" id="addPost">+ New Post</button></div><div class="adm-panel"><div id="blogTable"></div></div>`;
      Adm.buildTable(qs("#blogTable"), [
        { label: "Title", key: "title" }, { label: "Date", render: p => Adm.fmtDate(p.date) },
        { label: "Status", render: p => Adm.statusBadge(p.status === 'published' ? 'ok' : 'muted') },
        { label: "Actions", render: p => `<div class="adm-row-actions"><button class="adm-btn adm-btn-sm adm-btn-outline" data-edit="${p.id}">Edit</button><button class="adm-btn adm-btn-sm adm-btn-danger" data-del="${p.id}">Delete</button></div>` }
      ], items);
      qs("#addPost").onclick = () => openModal(null);
      qsa("[data-edit]").forEach(b => b.onclick = () => openModal(items.find(p => p.id === b.dataset.edit)));
      qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Delete this blog post?", () => {
        Adm.setStore("blog", items.filter(p => p.id !== b.dataset.del));
        Adm.toast("Post deleted.", "success"); render();
      }));
    }
    function openModal(existing) {
      const body = `
        <div class="adm-field"><label>Title</label><input id="bgTitle" value="${existing ? Adm.esc(existing.title) : ''}"></div>
        <div class="adm-field"><label>Excerpt</label><textarea id="bgExcerpt" rows="3">${existing ? Adm.esc(existing.excerpt) : ''}</textarea></div>
        <div class="adm-field-row">
          <div class="adm-field"><label>Date</label><input type="date" id="bgDate" value="${existing ? existing.date : new Date().toISOString().slice(0, 10)}"></div>
          <div class="adm-field"><label>Status</label><select id="bgStatus"><option ${existing && existing.status === 'draft' ? 'selected' : ''}>draft</option><option ${existing && existing.status === 'published' ? 'selected' : ''}>published</option></select></div>
        </div>
        <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Cancel</button><button class="adm-btn adm-btn-primary" id="bgSave">${existing ? 'Save' : 'Create Post'}</button></div>`;
      const el = Adm.openModal(existing ? "Edit Post" : "New Blog Post", body);
      el.querySelector("[data-cancel]").onclick = Adm.closeModal;
      el.querySelector("#bgSave").onclick = () => {
        const title = qs("#bgTitle").value.trim();
        if (!title) { Adm.toast("Title is required.", "error"); return; }
        const items = Adm.getStore("blog", []);
        const data = { title, excerpt: qs("#bgExcerpt").value.trim(), date: qs("#bgDate").value, status: qs("#bgStatus").value };
        if (existing) Object.assign(items.find(p => p.id === existing.id), data);
        else items.push(Object.assign({ id: Adm.uid("B") }, data));
        Adm.setStore("blog", items);
        Adm.closeModal(); Adm.toast(existing ? "Post updated." : "Post created.", "success"); render();
      };
    }
  }

  /* ================= TEAM ================= */
  function initTeam() {
    render();
    function render() {
      const items = Adm.getStore("team", []);
      Adm.contentEl().innerHTML = `<div class="adm-toolbar"><div class="adm-spacer"></div><button class="adm-btn adm-btn-primary" id="addMember">+ Add Team Member</button></div><div class="adm-card-grid" id="teamGrid"></div>`;
      qs("#teamGrid").innerHTML = items.map(t => `
        <div class="adm-item-card">
          <div class="thumb"><img src="${t.photo ? Adm.esc(t.photo) : placeholderImg('team-' + t.id, 400, 400)}" alt="${Adm.esc(t.name)}" loading="lazy"></div>
          <div class="body"><div class="title">${Adm.esc(t.name)}</div><div class="meta">${Adm.esc(t.role)} · ${Adm.esc(t.experience)}</div><div class="meta">${Adm.esc(t.contact)}</div></div>
          <div class="foot"><button class="adm-btn adm-btn-sm adm-btn-outline" data-edit="${t.id}">Edit</button><button class="adm-icon-action" data-del="${t.id}" title="Remove" aria-label="Remove team member">🗑</button></div>
        </div>`).join("");
      qs("#addMember").onclick = () => openModal(null);
      qsa("[data-edit]").forEach(b => b.onclick = () => openModal(items.find(t => t.id === b.dataset.edit)));
      qsa("[data-del]").forEach(b => b.onclick = () => Adm.confirmAction("Remove this team member?", () => {
        Adm.setStore("team", items.filter(t => t.id !== b.dataset.del));
        Adm.toast("Team member removed.", "success"); render();
      }));
    }
    function openModal(existing) {
      const body = `
        <div class="adm-field"><label>Name</label><input id="tmName" value="${existing ? Adm.esc(existing.name) : ''}"></div>
        <div class="adm-field-row">
          <div class="adm-field"><label>Designation</label><input id="tmRole" value="${existing ? Adm.esc(existing.role) : ''}"></div>
          <div class="adm-field"><label>Experience</label><input id="tmExp" value="${existing ? Adm.esc(existing.experience) : ''}" placeholder="e.g. 5 years"></div>
        </div>
        <div class="adm-field"><label>Contact</label><input id="tmContact" value="${existing ? Adm.esc(existing.contact) : ''}"></div>
        <div class="adm-field"><label>Photo</label><input type="file" accept="image/*"></div>
        <div class="adm-modal-actions"><button class="adm-btn adm-btn-ghost" data-cancel>Cancel</button><button class="adm-btn adm-btn-primary" id="tmSave">${existing ? 'Save' : 'Add Member'}</button></div>`;
      const el = Adm.openModal(existing ? "Edit Team Member" : "Add Team Member", body);
      el.querySelector("[data-cancel]").onclick = Adm.closeModal;
      el.querySelector("#tmSave").onclick = () => {
        const name = qs("#tmName").value.trim();
        if (!name) { Adm.toast("Name is required.", "error"); return; }
        const items = Adm.getStore("team", []);
        const data = { name, role: qs("#tmRole").value.trim(), experience: qs("#tmExp").value.trim(), contact: qs("#tmContact").value.trim(), photo: existing ? existing.photo : "" };
        if (existing) Object.assign(items.find(t => t.id === existing.id), data);
        else items.push(Object.assign({ id: Adm.uid("TM") }, data));
        Adm.setStore("team", items);
        Adm.closeModal(); Adm.toast(existing ? "Member updated." : "Member added.", "success"); render();
      };
    }
  }

  /* ================= REPORTS ================= */
  function initReports() {
    const enquiries = Adm.getStore("enquiries", []);
    const projects = Adm.getStore("projects", []);
    const appts = Adm.getStore("appointments", []);
    const now = new Date();
    const months = [], enqData = [], projData = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(m.toLocaleDateString("en-IN", { month: "short" }));
      enqData.push(enquiries.filter(e => { const d = new Date(e.date); return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth(); }).length);
      projData.push(projects.filter(p => { const d = new Date(p.startDate); return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth(); }).length);
    }
    const svcCounts = {}; appts.forEach(a => svcCounts[a.service] = (svcCounts[a.service] || 0) + 1);
    const topSvc = Object.entries(svcCounts).sort((a, b) => b[1] - a[1])[0];
    Adm.contentEl().innerHTML = `
      <div class="adm-toolbar"><div class="adm-spacer"></div>
        <button class="adm-btn adm-btn-outline" id="repExcel">⬇ Export Excel</button>
        <button class="adm-btn adm-btn-primary" id="repPrint">🖨 Print</button></div>
      <div class="adm-grid-2">
        <div class="adm-panel"><div class="adm-panel-head"><h2>Monthly Enquiries</h2></div><canvas id="repEnq"></canvas></div>
        <div class="adm-panel"><div class="adm-panel-head"><h2>Projects Completed</h2></div><canvas id="repProj"></canvas></div>
      </div>
      <div class="adm-grid-2">
        <div class="adm-panel"><div class="adm-stat-label">Revenue (estimated)</div><div class="adm-stat-value" style="margin-top:6px;">${Adm.money(estimateRevenue(projects))}</div></div>
        <div class="adm-panel"><div class="adm-stat-label">Most Popular Service</div><div class="adm-stat-value" style="margin-top:6px;">${topSvc ? Adm.esc(topSvc[0]) : '—'}</div><div class="adm-stat-label">${topSvc ? topSvc[1] + ' bookings' : ''}</div></div>
      </div>`;
    Adm.drawChart(qs("#repEnq"), { type: "line", labels: months, data: enqData });
    Adm.drawChart(qs("#repProj"), { type: "bar", labels: months, data: projData });
    qs("#repPrint").onclick = () => window.print();
    qs("#repExcel").onclick = () => {
      Adm.exportCSV("projects-report.csv", [{ label: "Project", key: "name" }, { label: "Customer", key: "customer" }, { label: "Service", key: "service" }, { label: "Start", key: "startDate" }, { label: "Status", key: "status" }], projects);
    };
  }

  /* ================= SETTINGS ================= */
  function initSettings() {
    const s = Adm.getStore("settings", {});
    Adm.contentEl().innerHTML = `
      <div class="adm-panel" style="max-width:680px;">
        <div class="adm-form-section"><h3>Company Details</h3>
          <div class="adm-field"><label>Company Name</label><input id="stName" value="${Adm.esc(s.companyName)}"></div>
          <div class="adm-field"><label>Address</label><textarea id="stAddr" rows="2">${Adm.esc(s.address)}</textarea></div>
          <div class="adm-field-row"><div class="adm-field"><label>Phone</label><input id="stPhone" value="${Adm.esc(s.phone)}"></div><div class="adm-field"><label>Email</label><input id="stEmail" value="${Adm.esc(s.email)}"></div></div>
        </div>
        <div class="adm-form-section"><h3>Social & Map</h3>
          <div class="adm-field-row"><div class="adm-field"><label>Facebook URL</label><input id="stFb" value="${Adm.esc(s.facebook)}"></div><div class="adm-field"><label>Instagram URL</label><input id="stIg" value="${Adm.esc(s.instagram)}"></div></div>
          <div class="adm-field"><label>Google Map Location</label><input id="stMap" value="${Adm.esc(s.map)}"></div>
        </div>
        <div class="adm-form-section"><h3>Business Info</h3>
          <div class="adm-field"><label>Business Hours</label><input id="stHours" value="${Adm.esc(s.hours)}"></div>
          <div class="adm-field"><label>Footer Content</label><textarea id="stFooter" rows="2">${Adm.esc(s.footer)}</textarea></div>
          <div class="adm-field-row"><div class="adm-field"><label>Logo</label><input type="file" accept="image/*"></div><div class="adm-field"><label>Favicon</label><input type="file" accept="image/*"></div></div>
        </div>
        <button class="adm-btn adm-btn-primary" id="stSave">Save Settings</button>
      </div>`;
    qs("#stSave").onclick = () => {
      Adm.setStore("settings", {
        companyName: qs("#stName").value, address: qs("#stAddr").value, phone: qs("#stPhone").value, email: qs("#stEmail").value,
        facebook: qs("#stFb").value, instagram: qs("#stIg").value, map: qs("#stMap").value,
        hours: qs("#stHours").value, footer: qs("#stFooter").value, logo: s.logo, favicon: s.favicon
      });
      Adm.toast("Website settings saved.", "success");
    };
  }

  /* ================= PROFILE ================= */
  function initProfile() {
    const p = Adm.getStore("profile", {});
    Adm.contentEl().innerHTML = `
      <div class="adm-panel" style="max-width:520px;">
        <div class="adm-avatar-upload">
          <div class="adm-avatar-lg">${p.photo ? `<img src="${Adm.esc(p.photo)}">` : initials(p.name || "Admin")}</div>
          <div><input type="file" accept="image/*"><div style="font-size:12px;color:var(--adm-text-muted);margin-top:4px;">JPG or PNG, max 2MB</div></div>
        </div>
        <div class="adm-field"><label>Name</label><input id="pfName" value="${Adm.esc(p.name)}"></div>
        <div class="adm-field"><label>Email</label><input id="pfEmail" value="${Adm.esc(p.email)}"></div>
        <div class="adm-field"><label>Last Login</label><input value="${new Date(p.lastLogin || Date.now()).toLocaleString('en-IN')}" disabled></div>
        <button class="adm-btn adm-btn-primary" id="pfSave">Save Profile</button>
        <hr style="margin:22px 0;border:none;border-top:1px solid var(--adm-border);">
        <div class="adm-form-section"><h3>Change Password</h3>
          <div class="adm-field"><label>Current Password</label><input type="password"></div>
          <div class="adm-field"><label>New Password</label><input type="password" id="pfNewPass"></div>
          <div class="adm-field"><label>Confirm New Password</label><input type="password" id="pfConfPass"></div>
          <button class="adm-btn adm-btn-outline" id="pfPassBtn">Update Password</button>
        </div>
        <button class="adm-btn adm-btn-danger adm-btn-block" id="pfLogout">Logout</button>
      </div>`;
    qs("#pfSave").onclick = () => {
      Adm.setStore("profile", Object.assign({}, p, { name: qs("#pfName").value, email: qs("#pfEmail").value }));
      Adm.toast("Profile updated.", "success");
    };
    qs("#pfPassBtn").onclick = () => {
      const np = qs("#pfNewPass").value, cp = qs("#pfConfPass").value;
      if (!np || np !== cp) { Adm.toast("Passwords do not match.", "error"); return; }
      Adm.toast("Password updated successfully.", "success");
      qs("#pfNewPass").value = ""; qs("#pfConfPass").value = "";
    };
    qs("#pfLogout").onclick = () => Adm.confirmAction("Log out of the admin panel?", Adm.logout);
  }

  /* ================= ROUTER ================= */
  function init(page) {
    Adm = window.Adm;
    if (page !== "login") window.Adm_seedAll();
    const map = {
      login: initLogin, dashboard: initDashboard, services: initServices, projects: initProjects,
      appointments: initAppointments, enquiries: initEnquiries, customers: initCustomers,
      testimonials: initTestimonials, gallery: initGallery, blog: initBlog, team: initTeam,
      reports: initReports, settings: initSettings, profile: initProfile
    };
    if (map[page]) map[page]();
  }
  return { init };
})();