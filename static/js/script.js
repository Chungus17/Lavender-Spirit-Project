// Global variables
let allProjects = [];
let allUnfilteredProjects = [];
let allCategories = [];
let currentLanguage = "en";
let selectedCategoryId = "all";
let total_projects = 0;

// PDF file paths configuration
const pdfFiles = {
  "company-brochure": "/static/company-brochure.pdf",
};

// Translation object
const translations = {
  en: {
    brandName: "Lavender Spirit",
    navHome: "Home",
    navAbout: "About",
    navProjects: "Projects",
    navContact: "Contact",
    heroBadge: "Premium Construction Services",
    heroTitle1: "Your next finishing...",
    heroTitle2: "with the spirit of Lavender",
    heroSubtitle:
      "We offer professional services in finishing, interior and exterior decoration, and the execution of construction and concrete projects in Riyadh and across the Kingdom.",
    getQuote: "Get Quote",
    viewProjects: "View Projects",
    downloadBrochure: "Download Brochure",
    projectsCompleted: "Projects Completed",
    happyClients: "Happy Clients",
    yearsExperience: "Years Experience",
    expertTeam: "Expert Team",
    aboutTitle:
      "Toward a more beautiful reality… we design and build with confidence",
    aboutSubtitle:
      "With over 15 years of experience in the world of construction and finishing, Lavender Spirit has become a trusted name in executing residential and commercial projects — with innovation and high quality in every detail.",
    feature1Title: "Noticeable Quality",
    feature1Desc:
      "We execute our projects with skilled hands and a high level of professionalism to ensure finishing that matches your ambitions — from residential to commercial.",
    feature2Title: "Timely Delivery",
    feature2Desc:
      "We pride ourselves on completing projects on schedule without compromising on quality or safety standards.",
    feature3Title: "Innovation Focus",
    feature3Desc:
      "Utilizing cutting-edge technology and modern construction techniques to exceed client expectations.",
    startProject: "Start Your Project",
    projectsTitle: "Projects We're Proud Of — Quality You Can See",
    projectsSubtitle:
      "At Lavender Spirit, we leave our mark on every project we execute — from construction and finishing to full-scale contracting, all carried out with care and professionalism. Here, we present a selection of our distinguished projects across the Kingdom of Saudi Arabia, reflecting our commitment to quality, precision, and elegance.",
    filterByCategory: "Filter by Category",
    allProjects: "All Projects",
    loadingProjects: "Loading projects...",
    noProjectsTitle: "No Projects Found",
    noProjectsMessage: "No projects match the selected category.",
    contactTitle: "Start your first step with us",
    contactSubtitle:
      "Do you have an idea, a design, or a project ready for construction? The Lavender Spirit team is ready to support you every step of the way — from consultation to pricing and execution.",
    locationLabel: "Location",
    locationText:
      "Riyadh – Al-Qirawan District – King Salman bin Abdulaziz Road",
    phoneLabel: "Phone",
    phoneNumber: "+966 50 940 1050",
    emailLabel: "Email",
    hoursLabel: "Business Hours",
    hoursText:
      "Sunday - Thursday: 8:00 AM - 6:00 PM\nFriday - Saturday: Closed",
    formTitle: "Message us now — and we will get back to you within 24 hours",
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
    contactInfo: "Social Media",
    footerAddress1: "King Fahd Road, Al Olaya",
    footerAddress2: "Riyadh, Saudi Arabia",
    footerDesc:
      "We provide quality construction, finishing, and decoration services across Riyadh.",
    copyright:
      "© 2025 Lavender Spirit Construction & Contracting. All rights reserved.",
    // Downloads section translations
    downloadsTitle: "Company Resources & Guides",
    downloadsSubtitle:
      "Access our comprehensive company materials and service guides to learn more about Lavender Spirit's expertise and offerings.",
    companyBrochureTitle: "Company Brochure",
    companyBrochureDesc:
      "Discover our company story, values, and comprehensive overview of our construction and contracting services across Saudi Arabia.",
    servicesGuideTitle: "Services Guide",
    servicesGuideDesc:
      "Detailed information about our construction services, project types, and specialized offerings for residential and commercial clients.",
    portfolioGuideTitle: "Project Portfolio",
    portfolioGuideDesc:
      "Explore our completed projects with detailed case studies, before and after photos, and client testimonials.",
    downloadNow: "Download Now",
    needMoreInfoTitle: "Need More Information?",
    needMoreInfoDesc:
      "Contact our team directly for custom quotes, project consultations, or any specific questions about our services.",
    contactUsNow: "Contact Us Now",
  },

  ar: {
    brandName: "روح الخزامى",
    navHome: "الرئيسية",
    navAbout: "من نحن",
    navProjects: "المشاريع",
    navContact: "اتصل بنا",
    heroBadge: "خدمات الإنشاءات المتميزة",
    heroTitle1: "تشطيبك الجاي...",
    heroTitle2: "بروح الخزامى",
    heroSubtitle:
      "نُقدّم خدمات احترافية في التشطيبات والديكورات الداخلية والخارجية، وتنفيذ مشاريع البناء والخرسانة في الرياض وكافة أنحاء المملكة. نضمن لك جودة عالية، تصاميم عصرية، تنفيذ دقيق، وأسعار تنافسية",
    getQuote: "احصل على عرض سعر",
    viewProjects: "عرض المشاريع",
    downloadBrochure: "تحميل بروشو",
    projectsCompleted: "مشروع مكتمل",
    happyClients: "عميل سعيد",
    yearsExperience: "سنة خبرة",
    expertTeam: "فريق خبير",
    aboutTitle: "نحو واقع أجمل… نصمّم ونبني بثقة",
    aboutSubtitle:
      "بخبرة تتجاوز 15 عامًا في عالم البناء والتشطيبات، أصبحت روح الخزامى اسمًا موثوقًا في تنفيذ المشاريع السكنية والتجارية، بابتكار وجودة عالية في كل تفصيل.",
    feature1Title: "جودة تُلاحظ",
    feature1Desc:
      "ننفّذ مشاريعنا بأيادٍ خبيرة واحترافية عالية لضمان تشطيب يليق بطموحك، من السكني إلى التجاري.",
    feature2Title: "التزام بالموعد",
    feature2Desc: "نسلّم في الوقت المحدد، دون المساس بالجودة أو السلامة.",
    feature3Title: "ابتكار في كل خطوة",
    feature3Desc: "نستخدم أحدث التقنيات ونعتمد حلول تصميم ذكية تتجاوز توقعاتك.",
    startProject: "ابدأ مشروعك",
    projectsTitle: "مشاريع نفتخر بها… جودة تُرى بالعين",
    projectsSubtitle:
      "في روح الخزامى، نضع بصمتنا في كل مشروع ننفذه — من البناء والتشطيب إلى المقاولات المتكاملة، نُنفّذ بعناية واحتراف. نعرض لكم هنا مجموعة من مشاريعنا المميزة في أنحاء المملكة العربية السعودية، والتي تعكس التزامنا بالجودة، الدقة، والأناقة.",
    filterByCategory: "تصفية حسب الفئة",
    allProjects: "جميع المشاريع",
    loadingProjects: "جاري تحميل المشاريع...",
    noProjectsTitle: "لم يتم العثور على مشاريع",
    noProjectsMessage: "لا توجد مشاريع تطابق الفئة المحددة.",
    contactTitle: "ابدأ خطوتك الأولى معنا",
    contactSubtitle:
      "هل لديك فكرة، تصميم، أو مشروع جاهز للبناء؟ فريق روح الخزامى مستعد لمساعدتك في كل خطوة — من الاستشارة إلى التسعير والتنفيذ.",

    locationLabel: "الموقع",
    locationText: "الرياض - حي القيروان - طريق الملك سلمان بن عبد العزيز",
    phoneLabel: "الهاتف",
    phoneNumber2: "+966 50 940 1050",
    phoneNumber: "1050 940 50 966+",
    emailLabel: "البريد الإلكتروني",
    hoursLabel: "ساعات العمل",
    hoursText: "الأحد - الخميس: 8:00 صباحًا - 6:00 مساءً\nالجمعة - السبت: مغلق",
    formTitle: "راسلنا الآن — وسنعود إليك خلال 24 ساعة",
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
      "نتميز في تقديم حلول البناء والتشطيب والديكور في جميع أنحاء الرياض، مع التزام بالجودة، الابتكار، ورضا العميل في كل مشروع.",
    copyright: "© 2025 روح الخزامى للبناء والمقاولات. جميع الحقوق محفوظة.",
    // Downloads section translations
    downloadsTitle: "موارد الشركة والأدلة",
    downloadsSubtitle:
      "احصل على مواد شركتنا الشاملة وأدلة الخدمات لتتعرف أكثر على خبرة روح الخزامى وعروضها.",
    companyBrochureTitle: "بروشور الشركة",
    companyBrochureDesc:
      "اكتشف قصة شركتنا وقيمنا ونظرة شاملة على خدمات البناء والمقاولات في جميع أنحاء المملكة العربية السعودية.",
    servicesGuideTitle: "دليل الخدمات",
    servicesGuideDesc:
      "معلومات مفصلة حول خدمات البناء لدينا وأنواع المشاريع والعروض المتخصصة للعملاء السكنيين والتجاريين.",
    portfolioGuideTitle: "محفظة المشاريع",
    portfolioGuideDesc:
      "استكشف مشاريعنا المكتملة مع دراسات حالة مفصلة وصور قبل وبعد وشهادات العملاء.",
    downloadNow: "تحميل الآن",
    needMoreInfoTitle: "تحتاج المزيد من المعلومات؟",
    needMoreInfoDesc:
      "تواصل مع فريقنا مباشرة للحصول على عروض أسعار مخصصة أو استشارات المشاريع أو أي أسئلة محددة حول خدماتنا.",
    contactUsNow: "اتصل بنا الآن",
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

// PDF Download Function
function downloadPDF(pdfType) {
  const pdfPath = pdfFiles[pdfType];

  if (!pdfPath) {
    const errorMessage =
      currentLanguage === "ar"
        ? "عذراً، الملف غير متوفر حالياً."
        : "Sorry, the file is not available at the moment.";
    alert(errorMessage);
    return;
  }

  // Create a temporary link and trigger download
  const link = document.createElement("a");
  link.href = pdfPath;
  link.download = pdfPath.split("/").pop(); // Get filename from path
  link.target = "_blank";

  // Add to DOM temporarily
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Remove from DOM
  document.body.removeChild(link);

  // Show success message
  const successMessage =
    currentLanguage === "ar" ? "تم بدء تحميل الملف" : "Download started";

  // Create a temporary success notification
  showDownloadNotification(successMessage);
}

// Show download notification
function showDownloadNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    font-weight: 500;
    animation: slideInRight 0.3s ease-out;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 1500);
}

// Add CSS animations for notifications
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Load categories from API
async function loadCategories() {
  try {
    const response = await fetch("/api/categories");
    const categories = await response.json();
    allCategories = categories;
    console.log(categories);
    await loadProjects(categories);
    renderCategoryFilters();
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Load projects from API
async function loadProjects(categories, categoryId = "all") {
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
    allCategories = categories;
    renderProjects(projects, categories);

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
    loadProjects(allCategories, categoryId);
  }, 300);
}

// Render projects grid
function renderProjects(projects, categories) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) return;

  let projectsHTML = "";

  projects.forEach((project, index) => {
    const title = currentLanguage === "ar" ? project.title_ar : project.title;
    const description =
      currentLanguage === "ar" ? project.description_ar : project.description;
    // Find the matching category
    const category = categories.find((cat) => cat.id === project.category_id);
    const projectCategory = category
      ? currentLanguage === "ar"
        ? category.name_ar
        : category.name
      : currentLanguage === "ar"
      ? "غير مصنف"
      : "Uncategorized";
    const status =
      currentLanguage === "ar" ? project.status_ar : project.status;

    // Get image URL
    let imageUrl = `https://storage.googleapis.com/lavender-spirit.firebasestorage.app/${project.image_filename}`;
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
            <span class="project-type">${projectCategory}</span>
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
  renderProjects(allProjects, allCategories);
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
