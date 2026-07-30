/* ColorCraft — Admin config & seed data */
window.ADMIN_CONFIG = {
  storageKeyPrefix: "ccAdmin",
  brandName: "ColorCraft",
  brandInitial: "CC",
  adminName: "Admin User",
  adminInitials: "AU",
  menu: [
    { key: "dashboard", href: "dashboard.html", label: "Dashboard", icon: "📊" },
    { key: "services", href: "services.html", label: "Services", icon: "🎨" },
    { key: "projects", href: "projects.html", label: "Projects", icon: "🏗️" },
    { key: "appointments", href: "appointments.html", label: "Appointments", icon: "🗓️" },
    { key: "enquiries", href: "enquiries.html", label: "Enquiries", icon: "✉️" },
    { key: "customers", href: "customers.html", label: "Customers", icon: "👥" },
    { key: "testimonials", href: "testimonials.html", label: "Testimonials", icon: "⭐" },
    { key: "gallery", href: "gallery.html", label: "Gallery", icon: "🖼️" },
    { key: "blog", href: "blog.html", label: "Blog", icon: "📝" },
    { key: "team", href: "team.html", label: "Team", icon: "👷" },
    { key: "reports", href: "reports.html", label: "Reports", icon: "📈" },
    { key: "settings", href: "settings.html", label: "Settings", icon: "⚙️" },
    { key: "profile", href: "profile.html", label: "Profile", icon: "👤" }
  ],
  pageTitles: {
    dashboard: "Dashboard", services: "Service Management", projects: "Project Management",
    appointments: "Appointment Management", enquiries: "Enquiry Management", customers: "Customer Management",
    testimonials: "Testimonials", gallery: "Gallery Management", blog: "Blog Management",
    team: "Team Management", reports: "Reports", settings: "Website Settings", profile: "Admin Profile"
  }
};

(function () {
  const SERVICES = [
    { id: "S1", name: "Interior Painting", price: 25, unit: "per sq.ft", desc: "Premium emulsion interior painting with two coats and putty finish.", img: "" },
    { id: "S2", name: "Exterior Painting", price: 32, unit: "per sq.ft", desc: "Weatherproof exterior painting built to withstand monsoon and sun.", img: "" },
    { id: "S3", name: "Wall Texture", price: 55, unit: "per sq.ft", desc: "Designer texture finishes for accent walls and feature panels.", img: "" },
    { id: "S4", name: "Wallpaper Installation", price: 40, unit: "per sq.ft", desc: "Imported and domestic wallpaper supply and installation.", img: "" },
    { id: "S5", name: "Home Decoration", price: 0, unit: "on quote", desc: "Full home styling — false ceiling, lighting and decor consultation.", img: "" },
    { id: "S6", name: "Waterproofing", price: 45, unit: "per sq.ft", desc: "Terrace and wall waterproofing with 5-year warranty coating.", img: "" }
  ];

  const CUSTOMER_NAMES = ["Ramesh Kulkarni", "Sunita Desai", "Amit Patel", "Farida Sheikh", "Vinay Kumar", "Lakshmi Menon", "Suresh Babu", "Meera Iyer", "Naveen Reddy", "Anjali Bhatt", "Deepak Chawla", "Ritu Saxena", "Ganesh Pillai", "Shalini Rao", "Irfan Khan"];
  const SERVICE_TYPES = SERVICES.map(s => s.name);
  const APPT_STATUSES = ["pending", "approved", "completed", "rejected"];
  const PROJECT_STATUSES = ["ongoing", "completed", "pending"];

  function seedAppointments() {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 26; i++) {
      const name = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
      const dayOffset = (i - 12) * 3;
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset);
      arr.push({
        id: "APT" + String(500 + i),
        customer: name,
        phone: "96" + (30000000 + i * 173).toString().slice(0, 8),
        email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com",
        service: SERVICE_TYPES[i % SERVICE_TYPES.length],
        preferredDate: dt.toISOString().slice(0, 10),
        status: APPT_STATUSES[i % APPT_STATUSES.length],
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (26 - i)).toISOString()
      });
    }
    return arr;
  }

  function seedProjects() {
    const arr = [];
    const locations = ["Bandra, Mumbai", "Koramangala, Bengaluru", "Salt Lake, Kolkata", "Anna Nagar, Chennai", "Banjara Hills, Hyderabad", "Baner, Pune"];
    for (let i = 0; i < 16; i++) {
      const name = CUSTOMER_NAMES[(i + 5) % CUSTOMER_NAMES.length];
      const start = new Date(Date.now() - (30 + i * 9) * 86400000);
      const status = PROJECT_STATUSES[i % PROJECT_STATUSES.length];
      arr.push({
        id: "PRJ" + (300 + i),
        name: name.split(" ")[0] + "'s " + SERVICE_TYPES[i % SERVICE_TYPES.length] + " Project",
        customer: name,
        location: locations[i % locations.length],
        service: SERVICE_TYPES[i % SERVICE_TYPES.length],
        startDate: start.toISOString().slice(0, 10),
        endDate: status === "completed" ? new Date(start.getTime() + 12 * 86400000).toISOString().slice(0, 10) : "",
        status,
        images: 0
      });
    }
    return arr;
  }

  function seedGallery() {
    const cats = ["Interior", "Exterior", "Texture", "Wallpaper", "Before & After"];
    const arr = [];
    for (let i = 1; i <= 12; i++) {
      arr.push({ id: "IMG" + i, caption: cats[i % cats.length] + " work sample " + i, category: cats[i % cats.length], featured: i % 4 === 0, img: "" });
    }
    return arr;
  }

  function seedTestimonials() {
    return [
      { id: "T1", name: "Ramesh Kulkarni", rating: 5, comment: "Excellent finish on our living room walls, very professional crew.", status: "approved" },
      { id: "T2", name: "Sunita Desai", rating: 4, comment: "Good work overall, a couple of days delay in completion.", status: "approved" },
      { id: "T3", name: "Amit Patel", rating: 5, comment: "Waterproofing service fixed our terrace leakage completely.", status: "pending" },
      { id: "T4", name: "Farida Sheikh", rating: 3, comment: "Texture design was nice but cleanup after work was lacking.", status: "pending" },
      { id: "T5", name: "Vinay Kumar", rating: 5, comment: "Best painting contractor in the city, highly recommended.", status: "approved" },
      { id: "T6", name: "Lakshmi Menon", rating: 2, comment: "Color shade did not match the sample shown initially.", status: "rejected" }
    ];
  }

  function seedEnquiries() {
    const arr = [];
    const subs = ["Painting cost estimate", "Wallpaper catalog request", "Waterproofing consultation", "Site visit request", "Franchise enquiry", "Bulk project quote"];
    for (let i = 0; i < 14; i++) {
      const name = CUSTOMER_NAMES[(i + 2) % CUSTOMER_NAMES.length];
      arr.push({
        id: "ENQ" + (400 + i),
        name, email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com",
        phone: "95" + (40000000 + i * 191).toString().slice(0, 8),
        subject: subs[i % subs.length],
        message: "Hi, could you share more details about " + subs[i % subs.length].toLowerCase() + "?",
        date: new Date(Date.now() - i * 86400000).toISOString(),
        status: i % 3 === 0 ? "replied" : "new",
        reply: i % 3 === 0 ? "Thanks for reaching out — our team has emailed you the full estimate." : ""
      });
    }
    return arr;
  }

  function seedTeam() {
    return [
      { id: "TM1", name: "Suresh Yadav", role: "Lead Painter", experience: "12 years", contact: "9812345601", photo: "" },
      { id: "TM2", name: "Manoj Tiwari", role: "Texture Specialist", experience: "8 years", contact: "9812345602", photo: "" },
      { id: "TM3", name: "Rakesh Sharma", role: "Site Supervisor", experience: "10 years", contact: "9812345603", photo: "" },
      { id: "TM4", name: "Vijay Nair", role: "Waterproofing Expert", experience: "6 years", contact: "9812345604", photo: "" },
      { id: "TM5", name: "Anil Kumar", role: "Painter", experience: "4 years", contact: "9812345605", photo: "" }
    ];
  }

  function seedBlog() {
    return [
      { id: "B1", title: "5 Trending Wall Colors for 2026", status: "published", date: "2026-01-12", excerpt: "Explore the shades homeowners are choosing this year." },
      { id: "B2", title: "How to Choose Between Texture and Wallpaper", status: "published", date: "2026-02-03", excerpt: "A practical comparison to help you decide." },
      { id: "B3", title: "Monsoon-Proofing Your Home Exterior", status: "draft", date: "2026-03-18", excerpt: "Tips to prepare your walls before the rains." },
      { id: "B4", title: "Interior Painting Cost Guide", status: "published", date: "2026-04-02", excerpt: "What actually goes into a painting quote." }
    ];
  }

  window.Adm_seedAll = function () {
    const Adm = window.Adm;
    Adm.seedIfEmpty("services", SERVICES);
    Adm.seedIfEmpty("projects", seedProjects());
    Adm.seedIfEmpty("appointments", seedAppointments());
    Adm.seedIfEmpty("gallery", seedGallery());
    Adm.seedIfEmpty("testimonials", seedTestimonials());
    Adm.seedIfEmpty("enquiries", seedEnquiries());
    Adm.seedIfEmpty("team", seedTeam());
    Adm.seedIfEmpty("blog", seedBlog());
    Adm.seedIfEmpty("settings", {
      companyName: "ColorCraft", address: "204, MG Road, Pune, Maharashtra 411001",
      phone: "+91 90000 54321", email: "hello@colorcraft.example.com",
      facebook: "https://facebook.com/colorcraft", instagram: "https://instagram.com/colorcraft",
      map: "MG Road, Pune", hours: "Mon–Sat: 9:00 AM – 7:00 PM",
      footer: "ColorCraft brings expert painting and wall-finishing services to your doorstep.",
      logo: "", favicon: ""
    });
    Adm.seedIfEmpty("profile", { name: "Admin User", email: "admin@colorcraft.example.com", photo: "", lastLogin: new Date().toISOString() });
  };
})();
