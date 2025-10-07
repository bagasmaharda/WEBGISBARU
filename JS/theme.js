// Set theme based on category
function setTheme(category) {
  console.log(`[v0] Setting theme to: ${category}`)

  // Remove existing theme classes
  document.body.classList.remove("theme-alam", "theme-budaya", "theme-rekreasi", "theme-kuliner")

  // Add new theme class
  if (category !== "default") {
    document.body.classList.add(`theme-${category}`)
  }

  currentTheme = category

  // Update active category card with enhanced visual feedback
  document.querySelectorAll(".category-card").forEach((card) => {
    card.classList.remove("active")
    // Reset blur animations
    const blurBg = card.querySelector(".category-blur-bg")
    if (blurBg) {
      blurBg.style.animation = "none"
    }
  })

  if (category !== "default") {
    const activeCard = document.querySelector(`[data-category="${category}"]`)
    if (activeCard) {
      activeCard.classList.add("active")
      // Trigger special animation for active theme
      const blurBg = activeCard.querySelector(".category-blur-bg")
      if (blurBg) {
        blurBg.style.animation = "pulseBlur 2s ease-in-out infinite"
      }
    }
  }

  // Enhanced theme transition with visual feedback
  document.body.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"

  // Add temporary glow effect during transition
  if (category !== "default") {
    document.body.style.boxShadow = `inset 0 0 100px rgba(var(--primary-rgb, 99, 102, 241), 0.1)`
  } else {
    document.body.style.boxShadow = "none"
  }

  setTimeout(() => {
    document.body.style.transition = ""
    document.body.style.boxShadow = ""
  }, 800)

  // Update floating elements colors based on theme
  updateFloatingElements(category)
}

function updateFloatingElements(category) {
  const floatingElements = document.querySelectorAll(".floating-element")

  floatingElements.forEach((element, index) => {
    let color = "var(--primary)"

    switch (category) {
      case "alam":
        color = index % 2 === 0 ? "#10b981" : "#34d399"
        break
      case "budaya":
        color = index % 2 === 0 ? "#f59e0b" : "#fbbf24"
        break
      case "rekreasi":
        color = index % 2 === 0 ? "#3b82f6" : "#8b5cf6"
        break
      case "kuliner":
        color = index % 2 === 0 ? "#ef4444" : "#f97316"
        break
      default:
        color = "#6366f1"
    }

    element.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`
  })
}

function getThemeColor(category) {
  const colors = {
    alam: "#10b981",
    budaya: "#f59e0b",
    rekreasi: "#3b82f6",
    kuliner: "#ef4444",
  }
  return colors[category] || "#6366f1"
}
