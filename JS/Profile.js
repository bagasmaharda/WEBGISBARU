
// Initialize event listeners
function initializeEventListeners() {
  console.log("[v0] Initializing enhanced event listeners...")

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = this.getAttribute("href")

      if (target === "#login") {
        if (isLoggedIn) {
          toggleProfileDropdown()
        } else {
          openAuthModal("login")
        }
        return
      }

      if (target.startsWith("#")) {
        const targetElement = document.querySelector(target)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      }

      // Update active nav link
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")
      filterLocations(filter)
    })
  })

  // Fullscreen sidebar filters
  document.querySelectorAll(".sidebar-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")
      filterLocations(filter)

      // Update active sidebar filter
      document.querySelectorAll(".sidebar-filter").forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Search functionality
  const searchInputs = document.querySelectorAll(".search-input, .sidebar-search-input")
  searchInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const query = this.value.toLowerCase()
      const filteredLocations = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.description.toLowerCase().includes(query) ||
          loc.category.toLowerCase().includes(query),
      )

      // Update markers based on search
      markers.forEach((marker) => map.removeLayer(marker))
      markers = []

      filteredLocations.forEach((location) => {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div class="marker-icon ${location.category}">${getCategoryIcon(location.category)}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        const marker = L.marker([location.lat, location.lng], { icon })
          .addTo(map)
          .on("click", () => showLocationDetails(location))

        markers.push(marker)
      })
    })
  })

  // Destination selection in payment modal
  document.addEventListener("change", (e) => {
    if (e.target.name === "destination") {
      selectDestinationOption(e.target.value)
    }

    if (e.target.name === "payment-method") {
      document.querySelectorAll(".payment-method").forEach((method) => {
        method.classList.remove("selected")
      })
      e.target.closest(".payment-method").classList.add("selected")
    }
  })

  // Quantity change listeners
  document.addEventListener("input", (e) => {
    if (e.target.id === "visitor-count") {
      updateBookingSummary()
    }
    if (e.target.id === "visit-date") {
      updateBookingSummary()
    }
  })

  // History filter buttons
  document.addEventListener("click", (e) => {
    if (e.target.matches(".history-filters .filter-btn")) {
      document.querySelectorAll(".history-filters .filter-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      e.target.classList.add("active")

      const filter = e.target.getAttribute("data-filter")
      updateHistoryDisplay(filter)
    }
  })

  // Close modal on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFullscreenMap()
      closeLocationPanel()
      closeRoutingPanel()
      closePaymentModal()
      closePaymentHistory()
      closeAuthModal()
      closeSettingsModal()
    }
  })

  // Close modal on outside click
  const fullscreenModal = document.getElementById("fullscreen-modal")
  if (fullscreenModal) {
    fullscreenModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeFullscreenMap()
      }
    })
  }

  const paymentModal = document.getElementById("payment-modal")
  if (paymentModal) {
    paymentModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closePaymentModal()
      }
    })
  }

  const historyModal = document.getElementById("payment-history-modal")
  if (historyModal) {
    historyModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closePaymentHistory()
      }
    })
  }

  // Close routing panel when location panel is opened
  document.addEventListener("click", (e) => {
    if (e.target.closest(".location-panel") && !e.target.closest(".routing-panel")) {
      closeRoutingPanel()
    }
  })

  // Thumbnail gallery functionality
  document.addEventListener("click", (e) => {
    if (e.target.closest(".thumbnail")) {
      const thumbnail = e.target.closest(".thumbnail")
      const mainImage = document.getElementById("fullscreen-main-image")
      const img = thumbnail.querySelector("img")

      // Remove active class from all thumbnails
      document.querySelectorAll(".thumbnail").forEach((t) => t.classList.remove("active"))

      // Add active class to clicked thumbnail
      thumbnail.classList.add("active")

      // Update main image
      mainImage.src = img.src
    }
  })

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-profile-dropdown")) {
      document.getElementById("profile-dropdown-menu").classList.remove("active")
    }
  })

  const authModal = document.getElementById("auth-modal")
  if (authModal) {
    authModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeAuthModal()
      }
    })
  }

  const settingsModal = document.getElementById("settings-modal")
  if (settingsModal) {
    settingsModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeSettingsModal()
      }
    })
  }

  console.log("[v0] Enhanced event listeners with authentication system initialized successfully!")
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".category-card, .news-card, .team-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero-bg")
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })

  // Header background on scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    if (window.scrollY > 100) {
      header.style.background = "rgba(15, 15, 35, 0.95)"
    } else {
      header.style.background = "rgba(15, 15, 35, 0.8)"
    }
  })
}
