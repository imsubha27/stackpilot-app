// ================= TOAST NOTIFICATION =================
function showToast(message, position = "bottom") {
  const toast = document.createElement("div");
  toast.className = `toast ${position}`;
  toast.textContent = message;

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

      const result = await response.json();

      if (result.status === "success") {
        showToast(result.message, "top");
        contactForm.reset();
      } else {
        showToast(result.message, "top");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("❌ Something went wrong. Try again!", "top");
    }
  });
}