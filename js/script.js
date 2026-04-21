document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  const backToTopButton = document.querySelector(".back-to-top");

  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const sections = document.querySelectorAll("main section[id]");

  initMobileMenu();
  initActiveNavOnScroll();
  initProjectFilter();
  initBackToTop();
  initContactFormValidation();
  initScrollReveal();

  function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initActiveNavOnScroll() {
    if (!sections.length || !navLinks.length) return;

    const handleActiveLink = () => {
      const scrollPosition = window.scrollY + 140;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          navLinks.forEach((link) => link.classList.remove("active-link"));

          const activeLink = document.querySelector(
            `.nav-menu a[href="#${sectionId}"]`
          );

          if (activeLink) {
            activeLink.classList.add("active-link");
          }
        }
      });
    };

    window.addEventListener("scroll", handleActiveLink);
    handleActiveLink();
  }

  function initProjectFilter() {
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
          const categories = card.dataset.category || "";
          const shouldShow =
            selectedFilter === "all" || categories.includes(selectedFilter);

          if (shouldShow) {
            card.style.display = "block";
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            });
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(14px)";

            setTimeout(() => {
              card.style.display = "none";
            }, 220);
          }
        });
      });
    });
  }

  function initContactFormValidation() {
    if (!contactForm || !nameInput || !emailInput || !messageInput) return;

    createFormMessageBox();

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      clearFieldState(nameInput);
      clearFieldState(emailInput);
      clearFieldState(messageInput);
      clearFormMessage();

      const nameValue = nameInput.value.trim();
      const emailValue = emailInput.value.trim();
      const messageValue = messageInput.value.trim();

      let isValid = true;

      if (nameValue.length < 2) {
        showFieldError(nameInput, "Please enter your full name.");
        isValid = false;
      } else {
        showFieldSuccess(nameInput);
      }

      if (!isValidEmail(emailValue)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        isValid = false;
      } else {
        showFieldSuccess(emailInput);
      }

      if (messageValue.length < 10) {
        showFieldError(
          messageInput,
          "Your message should be at least 10 characters long."
        );
        isValid = false;
      } else {
        showFieldSuccess(messageInput);
      }

      if (!isValid) {
        showFormMessage("Please fix the highlighted fields and try again.", "error");
        return;
      }

      showFormMessage("Message validated successfully. Ready for backend integration.", "success");
      contactForm.reset();

      clearFieldState(nameInput);
      clearFieldState(emailInput);
      clearFieldState(messageInput);
    });
  }

  function createFormMessageBox() {
    const existingMessageBox = document.querySelector(".form-status-message");
    if (existingMessageBox) return;

    const messageBox = document.createElement("div");
    messageBox.className = "form-status-message";
    contactForm.appendChild(messageBox);
  }

  function showFieldError(field, message) {
    field.classList.add("input-error");
    field.classList.remove("input-success");

    removeFieldMessage(field);

    const errorMessage = document.createElement("small");
    errorMessage.className = "field-message error-message";
    errorMessage.textContent = message;

    field.insertAdjacentElement("afterend", errorMessage);
  }

  function showFieldSuccess(field) {
    field.classList.add("input-success");
    field.classList.remove("input-error");
    removeFieldMessage(field);
  }

  function clearFieldState(field) {
    field.classList.remove("input-error", "input-success");
    removeFieldMessage(field);
  }

  function removeFieldMessage(field) {
    const nextElement = field.nextElementSibling;
    if (
      nextElement &&
      nextElement.classList.contains("field-message")
    ) {
      nextElement.remove();
    }
  }

  function showFormMessage(message, type) {
    const messageBox = document.querySelector(".form-status-message");
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.classList.remove("success", "error");
    messageBox.classList.add(type);
  }

  function clearFormMessage() {
    const messageBox = document.querySelector(".form-status-message");
    if (!messageBox) return;

    messageBox.textContent = "";
    messageBox.classList.remove("success", "error");
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      ".section-heading, .about-text, .info-card, .skill-card, .project-card, .contact-info, .contact-form, .hero-text, .hero-visual"
    );

    if (!revealElements.length) return;

    revealElements.forEach((element) => {
      element.classList.add("reveal-element");
    });

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }
});

