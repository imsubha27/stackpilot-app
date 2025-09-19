// ================= TOAST NOTIFICATION =================
function showToast(message, position = "bottom") {
  // Prevent stacking too many toasts
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${position}`;
  toast.textContent = message;
  toast.setAttribute("role", "alert");

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// ================= GREETING BUTTON =================
function showMessage() {
  const hours = new Date().getHours();
  let greeting;

  if (hours >= 5 && hours < 12) {
    greeting = "🌅 Good morning";
  } else if (hours >= 12 && hours < 18) {
    greeting = "☀️ Good afternoon";
  } else {
    greeting = "🌙 Good evening";
  }

  showToast(`${greeting}! Today is a great day to grow 🚀`, "top");
}

// ================= DARK MODE TOGGLE =================
const toggleBtn = document.getElementById("theme-toggle");

if (toggleBtn) {
  // Load preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }

  // Toggle click
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggleBtn.textContent = "☀️";
      localStorage.setItem("theme", "dark");
      showToast("🌙 Dark mode enabled", "bottom");
    } else {
      toggleBtn.textContent = "🌙";
      localStorage.setItem("theme", "light");
      showToast("☀️ Light mode enabled", "bottom");
    }
  });
}

// ================= CONTACT FORM =================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("/contact", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();

      showToast(result.message, "top");

      if (result.status === "success") {
        contactForm.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("❌ Something went wrong. Try again!", "top");
    }
  });
}
