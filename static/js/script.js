// Global variables
let allProjects = [];
let allUnfilteredProjects = [];
let allCategories = [];
let currentLanguage = "en";
let selectedCategoryId = "all";
let total_projects = 0;

// Translation object
const translations = {
  en: {
    brandName: "Lavender Spirit",
    navHome: "Home",
    navAbout: "About",
    navProjects: "Projects",
    navContact: "Contact",
    heroTitle1: "Building Excellence in",
    heroTitle2: "Riyadh",
    heroSubtitle:
      "Premier construction and contracting services delivering quality projects across Saudi Arabia with precision, innovation, and trust.",
    getQuote: "Get Quote",
    viewProjects: "View Projects",
    projectsCompleted: "Projects Completed",
    happyClients: "Happy Clients",
    yearsExperience: "Years Experience",
    expertTeam: "Expert Team",
    aboutTitle: "Building Dreams Into Reality",
    aboutSubtitle:
      "With over 15 years of excellence in construction and contracting, Lavender Spirit has established itself as Riyadh's trusted partner for premium construction solutions.",
    feature1Title: "Expert Craftsmanship",
    feature1Desc:
      "Our skilled professionals deliver exceptional quality in every project, from residential to commercial developments.",
    feature2Title: "Timely Delivery",
    feature2Desc:
      "We pride ourselves on completing projects on schedule without compromising on quality or safety standards.",
    feature3Title: "Innovation Focus",
    feature3Desc:
      "Utilizing cutting-edge technology and modern construction techniques to exceed client expectations.",
    startProject: "Start Your Project",
    projectsTitle: "Our Featured Projects",
    projectsSubtitle:
      "Showcasing our commitment to excellence through diverse construction and contracting projects across Riyadh",
    filterByCategory: "Filter by Category",
    allProjects: "All Projects",
    loadingProjects: "Loading projects...",
    noProjectsTitle: "No Projects Found",
    noProjectsMessage: "No projects match the selected category.",
    contactTitle: "Get In Touch",
    contactSubtitle:
      "Ready to start your construction project? Contact us today for a consultation and personalized quote.",
    locationLabel: "Location",
    locationText: "King Fahd Road, Al Olaya District\nRiyadh, Saudi Arabia",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Business Hours",
    hoursText:
      "Sunday - Thursday: 8:00 AM - 6:00 PM\nFriday - Saturday: Closed",
    formTitle: "Send Us a Message",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    phonePlaceholder: "Your Phone",
    selectService: "Select Service",
    residentialService: "Residential Construction",
    commercialService: "Commercial Construction",
    infrastructureService: "Infrastructure Development",
    renovationService: "Renovation & Remodeling",
    consultationService: "Consultation",
    messagePlaceholder: "Tell us about your project",
    sendMessage: "Send Message",
    servicesHeader: "Services",
    residentialConstruction: "Residential Construction",
    commercialBuildings: "Commercial Buildings",
    infrastructureDev: "Infrastructure Development",
    renovationServices: "Renovation Services",
    companyHeader: "Company",
    aboutUs: "About Us",
    ourProjects: "Our Projects",
    contact: "Contact",
    contactInfo: "Contact Info",
    footerAddress1: "King Fahd Road, Al Olaya",
    footerAddress2: "Riyadh, Saudi Arabia",
    footerDesc:
      "Building excellence in construction and contracting across Riyadh with a commitment to quality, innovation, and client satisfaction.",
    copyright:
      "© 2025 Lavender Spirit Construction & Contracting. All rights reserved.",
  },
  ar: {
    brandName: "روح الخزامى",
    navHome: "الرئيسية",
    navAbout: "من نحن",
    navProjects: "المشاريع",
    navContact: "اتصل بنا",
    heroTitle1: "بناء التميز في",
    heroTitle2: "الرياض",
    heroSubtitle:
      "خدمات البناء والمقاولات الرائدة التي تقدم مشاريع عالية الجودة في جميع أنحاء المملكة العربية السعودية بدقة وابتكار وثقة.",
    getQuote: "احصل على عرض سعر",
    viewProjects: "عرض المشاريع",
    projectsCompleted: "مشروع مكتمل",
    happyClients: "عميل سعيد",
    yearsExperience: "سنة خبرة",
    expertTeam: "فريق خبير",
    aboutTitle: "تحويل الأحلام إلى واقع",
    aboutSubtitle:
      "مع أكثر من 15 عامًا من التميز في البناء والمقاولات، رسخت روح الخزامى نفسها كشريك موثوق في الرياض لحلول البناء المتميزة.",
    feature1Title: "حرفية خبيرة",
    feature1Desc:
      "يقدم محترفونا المهرة جودة استثنائية في كل مشروع، من التطوير السكني إلى التجاري.",
    feature2Title: "التسليم في الوقت المحدد",
    feature2Desc:
      "نفخر بإنجاز المشاريع في الموعد المحدد دون التنازل عن معايير الجودة أو السلامة.",
    feature3Title: "التركيز على الابتكار",
    feature3Desc:
      "استخدام التكنولوجيا المتطورة وتقنيات البناء الحديثة لتجاوز توقعات العملاء.",
    startProject: "ابدأ مشروعك",
    projectsTitle: "مشاريعنا المميزة",
    projectsSubtitle:
      "عرض التزامنا بالتميز من خلال مشاريع البناء والمقاولات المتنوعة في جميع أنحاء الرياض",
    filterByCategory: "تصفية حسب الفئة",
    allProjects: "جميع المشاريع",
    loadingProjects: "جاري تحميل المشاريع...",
    noProjectsTitle: "لم يتم العثور على مشاريع",
    noProjectsMessage: "لا توجد مشاريع تطابق الفئة المحددة.",
    contactTitle: "تواصل معنا",
    contactSubtitle:
      "هل أنت مستعد لبدء مشروع البناء الخاص بك؟ اتصل بنا اليوم للحصول على استشارة وعرض أسعار مخصص.",
    locationLabel: "الموقع",
    locationText: "طريق الملك فهد، حي العليا\nالرياض، المملكة العربية السعودية",
    phoneLabel: "الهاتف",
    emailLabel: "البريد الإلكتروني",
    hoursLabel: "ساعات العمل",
    hoursText: "الأحد - الخميس: 8:00 صباحًا - 6:00 مساءً\nالجمعة - السبت: مغلق",
    formTitle: "أرسل لنا رسالة",
    namePlaceholder: "اسمك",
    emailPlaceholder: "بريدك الإلكتروني",
    phonePlaceholder: "هاتفك",
    selectService: "اختر الخدمة",
    residentialService: "البناء السكني",
    commercialService: "البناء التجاري",
    infrastructureService: "تطوير البنية التحتية",
    renovationService: "التجديد والإصلاح",
    consultationService: "الاستشارة",
    messagePlaceholder: "أخبرنا عن مشروعك",
    sendMessage: "إرسال الرسالة",
    servicesHeader: "الخدمات",
    residentialConstruction: "البناء السكني",
    commercialBuildings: "المباني التجارية",
    infrastructureDev: "تطوير البنية التحتية",
    renovationServices: "خدمات التجديد",
    companyHeader: "الشركة",
    aboutUs: "من نحن",
    ourProjects: "مشاريعنا",
    contact: "اتصل بنا",
    contactInfo: "معلومات الاتصال",
    footerAddress1: "طريق الملك فهد، العليا",
    footerAddress2: "الرياض، المملكة العربية السعودية",
    footerDesc:
      "بناء التميز في البناء والمقاولات في جميع أنحاء الرياض مع الالتزام بالجودة والابتكار ورضا العملاء.",
    copyright: "© 2024 روح الخزامى للبناء والمقاولات. جميع الحقوق محفوظة.",
  },
};

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  loadCategories();
  animateStats();
  initializeHeroAnimations();
});

// Initialize the application
function initializeApp() {
  // Set initial language
  updateLanguage();

  // Setup navbar scroll effect
  setupNavbarScroll();
}

// Initialize hero animations
function initializeHeroAnimations() {
  // Trigger hero stats animation when in view
  const heroStatsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"));
            animateCounter(stat, target);
          });
          heroStatsObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "0px 0px -100px 0px",
    }
  );
}

// Setup event listeners
function setupEventListeners() {
  // Language toggle
  const languageSwitch = document.getElementById("language-switch");
  if (languageSwitch) {
    languageSwitch.addEventListener("change", toggleLanguage);
  }

  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Contact form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm);
  }

  // Category filter dropdown
  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", function () {
      filterByCategory(this.value);
    });
  }
}

// Load categories from API
async function loadCategories() {
  try {
    const response = await fetch("/api/categories");
    const categories = await response.json();
    allCategories = categories;
    await loadProjects();
    renderCategoryFilters();
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Load projects from API
async function loadProjects(categoryId = "all") {
  const loadingIndicator = document.getElementById("loading-indicator");
  const projectsGrid = document.getElementById("projects-grid");
  const noProjectsDiv = document.getElementById("no-projects");

  // Show loading
  if (loadingIndicator) loadingIndicator.style.display = "block";
  if (projectsGrid) projectsGrid.style.display = "none";
  if (noProjectsDiv) noProjectsDiv.style.display = "none";

  try {
    const url =
      categoryId === "all"
        ? "/api/projects"
        : `/api/projects?category_id=${categoryId}`;

    const fetchProjects = fetch(url).then((res) => res.json());

    const [projects] = await Promise.all([fetchProjects]); // Wait for both

    allProjects = projects;
    total_projects = allProjects.length;
    renderProjects(projects);

    if (projects.length === 0) {
      if (noProjectsDiv) noProjectsDiv.style.display = "block";
    } else {
      if (projectsGrid) projectsGrid.style.display = "grid";
    }
  } catch (error) {
    console.error("Error loading projects:", error);
    if (noProjectsDiv) noProjectsDiv.style.display = "block";
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = "none";
  }
}

// Render category filter dropdown
function renderCategoryFilters() {
  const categoryFilter = document.getElementById("category-dropdown");
  if (!categoryFilter) return;

  let optionsHTML = `
  <option value="all" ${selectedCategoryId === "all" ? "selected" : ""}>
    ${translations[currentLanguage].allProjects} (${allProjects.length})
  </option>
`;

  allCategories.forEach((category) => {
    const categoryName =
      currentLanguage === "ar" ? category.name_ar : category.name;
    optionsHTML += `
      <option value="${category.id}" ${
      selectedCategoryId === category.id.toString() ? "selected" : ""
    }>
        ${categoryName} (${category.project_count})
      </option>
    `;
  });

  categoryFilter.innerHTML = optionsHTML;
}

let debounceTimeout;
function filterByCategory(categoryId) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    selectedCategoryId = categoryId;
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
      categoryFilter.value = categoryId;
    }
    loadProjects(categoryId);
  }, 300);
}

// Render projects grid
function renderProjects(projects) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) return;

  let projectsHTML = "";

  projects.forEach((project, index) => {
    const title = currentLanguage === "ar" ? project.title_ar : project.title;
    const description =
      currentLanguage === "ar" ? project.description_ar : project.description;
    const projectType =
      currentLanguage === "ar" ? project.project_type_ar : project.project_type;
    const status =
      currentLanguage === "ar" ? project.status_ar : project.status;

    // Get image URL
    let imageUrl = `/static/uploads/${project.image_filename}`;
    if (
      !imageUrl ||
      (!imageUrl.startsWith("http") && !imageUrl.startsWith("/"))
    ) {
      imageUrl =
        "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
    }

    projectsHTML += `
      <div class="project-card fade-in" style="animation-delay: ${
        index * 0.1
      }s">
        <div class="project-image">
          <img src="${imageUrl}" alt="${title}" loading="lazy">
        </div>
        <div class="project-content">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="project-meta">
            <span class="project-type">${projectType}</span>
            <span class="project-status">${status}</span>
          </div>
        </div>
      </div>
    `;
  });

  projectsGrid.innerHTML = projectsHTML;
}

// Toggle language
function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "ar" : "en";
  updateLanguage();
  renderCategoryFilters();
  renderProjects(allProjects);
}

// Update language throughout the page
function updateLanguage() {
  const isArabic = currentLanguage === "ar";

  // Update body class and direction
  document.body.classList.toggle("arabic", isArabic);
  document.documentElement.setAttribute("dir", isArabic ? "rtl" : "ltr");

  // Update all translatable elements
  const translatableElements = document.querySelectorAll("[data-translate]");
  translatableElements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });

  // Update placeholder texts
  const placeholderElements = document.querySelectorAll(
    "[data-translate-placeholder]"
  );
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder");
    if (translations[currentLanguage][key]) {
      element.placeholder = translations[currentLanguage][key];
    }
  });

  // Update page title
  const pageTitle = document.getElementById("page-title");
  if (pageTitle) {
    pageTitle.textContent = isArabic
      ? "روح الخزامى - شركة البناء والمقاولات الرائدة في الرياض"
      : "Lavender Spirit - Premier Construction & Contracting in Riyadh";
  }
}

// Setup navbar scroll effect
function setupNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-target"));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach((stat) => observer.observe(stat));
}

// Animate counter function
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(function () {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = `${Math.floor(current)} +`;
  }, 30);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// Handle contact form submission
function handleContactForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Show loading state
  submitButton.textContent =
    currentLanguage === "ar" ? "جاري الإرسال..." : "Sending...";
  submitButton.disabled = true;

  fetch("/contact", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(
          currentLanguage === "ar"
            ? "شكرًا لك على رسالتك! سنتواصل معك قريبًا."
            : "Thank you for your message! We will get back to you soon."
        );
        event.target.reset();
      } else {
        alert(
          currentLanguage === "ar"
            ? "حدث خطأ. يرجى المحاولة مرة أخرى."
            : "An error occurred. Please try again."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        currentLanguage === "ar"
          ? "حدث خطأ. يرجى المحاولة مرة أخرى."
          : "An error occurred. Please try again."
      );
    })
    .finally(() => {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Utility function to get image URL
function getImageUrl(filename) {
  if (!filename) {
    return "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
  }

  if (filename.startsWith("http")) {
    return filename;
  }

  return `/static/uploads/${filename}`;
}
