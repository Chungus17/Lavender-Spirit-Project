// Global variables for projects data
let projectsData = [];

// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbar = document.getElementById("navbar");

  // Fetch projects data on page load
  fetchProjects();

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Stats counter animation
  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + "+";
    }, 20);
  }

  // Intersection Observer for stats animation
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((statNumber) => {
            if (!statNumber.classList.contains("animated")) {
              statNumber.classList.add("animated");
              animateCounter(statNumber);
            }
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Contact form handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Simple form validation
      if (!data.name || !data.email || !data.message || !data.service) {
        alert("Please fill in all required fields.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(() => {
        alert("Thank you for your message! We will get back to you soon.");
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Parallax effect for hero section
  window.addEventListener("scroll", function () {
    const heroBackground = document.querySelector(".hero-bg-image");
    if (heroBackground) {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      heroBackground.style.transform = `translateY(${parallax}px)`;
    }
  });

  // Add animation on scroll for project cards
  const projectCards = document.querySelectorAll(".project-card");
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    { threshold: 0.1 }
  );

  projectCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    projectObserver.observe(card);
  });

  // Add animation for feature items
  const featureItems = document.querySelectorAll(".feature-item");
  const featureObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateX(0)";
          }, index * 200);
        }
      });
    },
    { threshold: 0.1 }
  );

  featureItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-30px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    featureObserver.observe(item);
  });
});

// Function to fetch projects from API
async function fetchProjects() {
  try {
    const response = await fetch("/api/projects");
    if (response.ok) {
      projectsData = await response.json();
      renderProjects();
    } else {
      console.error("Failed to fetch projects");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

// Function to render projects based on current language
function renderProjects() {
  const projectsGrid = document.querySelector(".projects-grid");
  if (!projectsGrid || !projectsData.length) return;

  // Clear existing dynamic projects (keep static ones if any)
  const dynamicProjects = projectsGrid.querySelectorAll(
    '.project-card[data-dynamic="true"]'
  );
  dynamicProjects.forEach((card) => card.remove());

  // Render projects from database
  projectsData.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });

  // Re-apply animations to new cards
  const newProjectCards = projectsGrid.querySelectorAll(
    '.project-card[data-dynamic="true"]'
  );
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    { threshold: 0.1 }
  );

  newProjectCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    projectObserver.observe(card);
  });
}

// Function to create project card HTML
function createProjectCard(project) {
  const projectCard = document.createElement("div");
  projectCard.className = "project-card";
  projectCard.setAttribute("data-dynamic", "true");
  projectCard.setAttribute("data-project-id", project.id);

  // Determine image source
  let imageSrc;
  if (project.image_filename.startsWith("http")) {
    imageSrc = project.image_filename;
  } else {
    imageSrc = `/static/uploads/${project.image_filename}`;
  }

  projectCard.innerHTML = `
    <div class="project-image">
      <img src="${imageSrc}" alt="${project.title}" />
    </div>
    <div class="project-content">
      <h3 class="project-title" data-en="${project.title}" data-ar="${project.title_ar}">${project.title}</h3>
      <p class="project-description" data-en="${project.description}" data-ar="${project.description_ar}">${project.description}</p>
      <div class="project-meta">
        <span class="project-type" data-en="${project.project_type}" data-ar="${project.project_type_ar}">${project.project_type}</span>
        <span class="project-status" data-en="${project.status}" data-ar="${project.status_ar}">${project.status}</span>
      </div>
    </div>
  `;

  return projectCard;
}

// Function to update project content based on language
function updateProjectsLanguage(language) {
  const projectCards = document.querySelectorAll(
    '.project-card[data-dynamic="true"]'
  );

  projectCards.forEach((card) => {
    const title = card.querySelector(".project-title");
    const description = card.querySelector(".project-description");
    const type = card.querySelector(".project-type");
    const status = card.querySelector(".project-status");

    if (title) {
      title.textContent = title.getAttribute(`data-${language}`);
    }
    if (description) {
      description.textContent = description.getAttribute(`data-${language}`);
    }
    if (type) {
      type.textContent = type.getAttribute(`data-${language}`);
    }
    if (status) {
      status.textContent = status.getAttribute(`data-${language}`);
    }
  });
}

// Function to scroll to specific section (used by CTA buttons)
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// Add loading animation
window.addEventListener("load", function () {
  document.body.classList.add("loaded");

  // Animate hero content on load
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(30px)";

    setTimeout(() => {
      heroContent.style.transition = "opacity 1s ease, transform 1s ease";
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 500);
  }
});

// Handle window resize for mobile menu
window.addEventListener("resize", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (window.innerWidth > 968) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// Language translations
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
    footerDesc:
      "Building excellence in construction and contracting across Riyadh with a commitment to quality, innovation, and client satisfaction.",
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
    copyright:
      "© 2024 Lavender Spirit Construction & Contracting. All rights reserved.",
  },
  ar: {
    brandName: "لافيندر سبيريت",
    navHome: "الرئيسية",
    navAbout: "من نحن",
    navProjects: "المشاريع",
    navContact: "تواصل معنا",
    heroTitle1: "بناء التميز في",
    heroTitle2: "الرياض",
    heroSubtitle:
      "خدمات البناء والمقاولات الممتازة التي تحقق مشاريع عالية الجودة في جميع أنحاء المملكة العربية السعودية بدقة وابتكار وثقة.",
    getQuote: "احصل على عرض سعر",
    viewProjects: "عرض المشاريع",
    projectsCompleted: "مشروع مكتمل",
    happyClients: "عميل راضٍ",
    yearsExperience: "سنة خبرة",
    expertTeam: "خبير في الفريق",
    aboutTitle: "تحويل الأحلام إلى واقع",
    aboutSubtitle:
      "مع أكثر من 15 عامًا من التميز في البناء والمقاولات، أثبتت روح اللافندر نفسها كشريك موثوق في الرياض للحلول الإنشائية المتميزة.",
    feature1Title: "حرفية خبيرة",
    feature1Desc:
      "يقدم محترفونا المهرة جودة استثنائية في كل مشروع، من التطوير السكني إلى التجاري.",
    feature2Title: "التسليم في الموعد",
    feature2Desc:
      "نفخر بإنجاز المشاريع في الموعد المحدد دون التنازل عن معايير الجودة أو السلامة.",
    feature3Title: "التركيز على الابتكار",
    feature3Desc:
      "استخدام أحدث التقنيات وتقنيات البناء الحديثة لتجاوز توقعات العملاء.",
    startProject: "ابدأ مشروعك",
    projectsTitle: "مشاريعنا المميزة",
    projectsSubtitle:
      "عرض التزامنا بالتميز من خلال مشاريع البناء والمقاولات المتنوعة في جميع أنحاء الرياض",
    contactTitle: "تواصل معنا",
    contactSubtitle:
      "هل أنت مستعد لبدء مشروع البناء الخاص بك؟ اتصل بنا اليوم للحصول على استشارة وعرض أسعار شخصي.",
    locationLabel: "الموقع",
    locationText: "طريق الملك فهد، حي العليا\nالرياض، المملكة العربية السعودية",
    phoneLabel: "الهاتف",
    emailLabel: "البريد الإلكتروني",
    hoursLabel: "ساعات العمل",
    hoursText: "الأحد - الخميس: 8:00 صباحًا - 6:00 مساءً\nالجمعة - السبت: مغلق",
    formTitle: "أرسل لنا رسالة",
    namePlaceholder: "اسمك",
    emailPlaceholder: "بريدك الإلكتروني",
    phonePlaceholder: "رقم هاتفك",
    selectService: "اختر الخدمة",
    residentialService: "البناء السكني",
    commercialService: "البناء التجاري",
    infrastructureService: "تطوير البنية التحتية",
    renovationService: "التجديد وإعادة التشكيل",
    consultationService: "استشارة",
    messagePlaceholder: "أخبرنا عن مشروعك",
    sendMessage: "إرسال الرسالة",
    footerDesc:
      "بناء التميز في البناء والمقاولات في جميع أنحاء الرياض مع الالتزام بالجودة والابتكار ورضا العملاء.",
    servicesHeader: "الخدمات",
    residentialConstruction: "البناء السكني",
    commercialBuildings: "المباني التجارية",
    infrastructureDev: "تطوير البنية التحتية",
    renovationServices: "خدمات التجديد",
    companyHeader: "الشركة",
    aboutUs: "من نحن",
    ourProjects: "مشاريعنا",
    contact: "تواصل معنا",
    contactInfo: "معلومات الاتصال",
    footerAddress1: "طريق الملك فهد، العليا",
    footerAddress2: "الرياض، المملكة العربية السعودية",
    copyright: "© 2024 روح اللافندر للبناء والمقاولات. جميع الحقوق محفوظة.",
  },
};

// Language management
let currentLanguage = localStorage.getItem("language") || "en";
const htmlRoot = document.getElementById("html-root");
const languageSwitch = document.getElementById("language-switch");

// Initialize language on page load
document.addEventListener("DOMContentLoaded", function () {
  setLanguage(currentLanguage);
  if (languageSwitch) {
    languageSwitch.checked = currentLanguage === "ar";

    // Add event listener for language toggle
    languageSwitch.addEventListener("change", function () {
      const newLanguage = this.checked ? "ar" : "en";
      setLanguage(newLanguage);
    });
  }
});

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("language", language);

  // Update HTML attributes
  if (htmlRoot) {
    htmlRoot.setAttribute("lang", language);
    htmlRoot.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }

  // Add/remove Arabic class for styling
  if (language === "ar") {
    document.body.classList.add("arabic");
  } else {
    document.body.classList.remove("arabic");
  }

  // Update all translatable elements
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[language] && translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  // Update placeholders
  const placeholderElements = document.querySelectorAll(
    "[data-translate-placeholder]"
  );
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder");
    if (translations[language] && translations[language][key]) {
      element.setAttribute("placeholder", translations[language][key]);
    }
  });

  // Update page title
  const pageTitle = document.getElementById("page-title");
  if (pageTitle) {
    const titleKey =
      language === "ar"
        ? "روح اللافندر - شركة البناء والمقاولات الرائدة في الرياض"
        : "Lavender Spirit - Premier Construction & Contracting in Riyadh";
    pageTitle.textContent = titleKey;
  }

  // Update projects language
  updateProjectsLanguage(language);
}

// Smooth scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}
