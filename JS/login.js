// ========================================
// JAVASCRIPT UNTUK BAGIAN AKUN: Auth, Login, Register, 
// Profile Dropdown, Settings, dan Riwayat Akun Tersimpan
// ========================================
//
// Struktur:
// 1. Variabel Global Terkait Akun
// 2. Inisialisasi Auth System
// 3. Fungsi Modal Auth (Open/Close/Switch)
// 4. Fungsi Handler Login/Register/Forgot Password
// 5. Fungsi Pengelolaan Akun (Logout, Profile, Dropdown)
// 6. Fungsi Settings Modal (Update Profile, Password, Preferences)
// 7. Fungsi Riwayat Akun (Payment History)
// 8. Utilitas Auth (Password Strength, Messages, Toggle Password)
// 9. Social Login Stubs (OAuth Mock)
//
// ========================================

// 1. VARIABEL GLOBAL TERKAIT AKUN
let currentUser  = null;  // Data user yang sedang login (nama, email, phone, preferences, dll.)
let isLoggedIn = false;  // Status login (true jika user terautentikasi)
let authModalType = "login";  // Tipe modal auth saat ini (login/register/forgot)

// Data riwayat pemesanan (tersimpan di akun user; bisa di-load dari localStorage/backend)
const paymentHistory = [
  {
    id: "BWG001234",
    destination: "Kawah Putih",
    date: "2024-12-15",
    quantity: 2,
    total: 50000,
    status: "completed",
    bookerName: "Ahmad Rizki",
  },
  {
    id: "BWG001235",
    destination: "Trans Studio Bandung",
    date: "2024-12-20",
    quantity: 1,
    total: 50000,
    status: "pending",
    bookerName: "Sari Dewi",
  },
  {
    id: "BWG001233",
    destination: "Museum Geologi",
    date: "2024-12-10",
    quantity: 3,
    total: 45000,
    status: "completed",
    bookerName: "Budi Santoso",
  },
];

// 2. INISIALISASI AUTH SYSTEM (dipanggil saat DOM loaded)
function initializeAuth() {
  console.log("[v0] Initializing authentication system...");

  // Cek sesi user tersimpan di localStorage
  const savedUser  = localStorage.getItem("bandung_gis_user");
  if (savedUser ) {
    try {
      currentUser  = JSON.parse(savedUser );
      isLoggedIn = true;
      updateAuthUI();
      console.log("[v0] User session restored:", currentUser .name);
    } catch (error) {
      console.error("[v0] Error parsing saved user data:", error);
      localStorage.removeItem("bandung_gis_user");
    }
  }

  // Inisialisasi password strength checker untuk register
  const registerPassword = document.getElementById("register-password");
  if (registerPassword) {
    registerPassword.addEventListener("input", checkPasswordStrength);
  }

  console.log("[v0] Authentication system initialized successfully!");
}

// Update UI berdasarkan status login (tampilkan/sembunyikan dropdown, update info user)
function updateAuthUI() {
  const authNavLink = document.getElementById("auth-nav-link");
  const userDropdown = document.getElementById("user-profile-dropdown");

  if (isLoggedIn && currentUser ) {
    // Sembunyikan link login, tampilkan dropdown profile
    authNavLink.style.display = "none";
    userDropdown.style.display = "block";

    // Update info user di dropdown
    document.getElementById("user-name-display").textContent = currentUser .name;
    document.getElementById("user-email-display").textContent = currentUser .email;
    document.getElementById("user-avatar-text").textContent = currentUser .name.charAt(0).toUpperCase();

    // Update form settings dengan data user
    updateSettingsForm();

    console.log("[v0] Auth UI updated for logged in user");
  } else {
    // Tampilkan link login, sembunyikan dropdown
    authNavLink.style.display = "block";
    userDropdown.style.display = "none";

    console.log("[v0] Auth UI updated for guest user");
  }
}

// 3. FUNGSI MODAL AUTH (Open/Close/Switch Tab)
function openAuthModal(type = "login") {
  const modal = document.getElementById("auth-modal");
  modal.classList.add("active");
  switchAuthTab(type);
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.remove("active");
  clearAuthForms();
}

function switchAuthTab(tab) {
  authModalType = tab;

  // Update tombol tab
  document.querySelectorAll(".auth-tab").forEach((tabBtn) => {
    tabBtn.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");

  // Update form
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.remove("active");
  });

  // Update judul dan tampilkan form yang sesuai
  const title = document.getElementById("auth-title");
  switch (tab) {
    case "login":
      title.textContent = "Masuk ke Akun Anda";
      document.getElementById("login-form").classList.add("active");
      break;
    case "register":
      title.textContent = "Buat Akun Baru";
      document.getElementById("register-form").classList.add("active");
      break;
    case "forgot":
      title.textContent = "Reset Password";
      document.getElementById("forgot-password-form").classList.add("active");
      break;
  }
}

function clearAuthForms() {
  // Reset input form auth
  document.querySelectorAll(".auth-form input").forEach((input) => {
    input.value = "";
  });
  document.querySelectorAll('.auth-form input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  clearAuthMessages();
}

// 4. FUNGSI HANDLER LOGIN/REGISTER/FORGOT PASSWORD
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  if (!email || !password) {
    showAuthMessage("Harap lengkapi email dan password!");
    return;
  }

  // Tampilkan loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  // Simulasi API login (ganti dengan fetch ke backend)
  setTimeout(() => {
    // Mock user data (dalam real app, ambil dari server)
    const mockUser  = {
      id: 1,
      name: "Ahmad Rizki",
      email: email,
      phone: "+62 812-3456-7890",
      joinDate: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        bookingNotifications: true,
        promoNotifications: false,
        favoriteTheme: "default",
        language: "id",
      },
    };

    currentUser  = mockUser ;
    isLoggedIn = true;

    // Simpan ke localStorage jika "remember me" dicentang
    if (rememberMe) {
      localStorage.setItem("bandung_gis_user", JSON.stringify(currentUser ));
    }

    // Update UI
    updateAuthUI();
    closeAuthModal();

    showAuthMessage("Login berhasil! Selamat datang kembali.", "success");

    // Hapus loading state
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

    console.log("[v0] User logged in successfully:", currentUser .name);
  }, 2000);
}

function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const phone = document.getElementById("register-phone").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;
  const agreeTerms = document.getElementById("agree-terms").checked;

  // Validasi form
  if (!name || !email || !phone || !password || !confirmPassword) {
    showAuthMessage("Harap lengkapi semua field!");
    return;
  }

  if (password !== confirmPassword) {
    showAuthMessage("Password dan konfirmasi password tidak cocok!");
    return;
  }

  if (password.length < 8) {
    showAuthMessage("Password minimal 8 karakter!");
    return;
  }

  if (!agreeTerms) {
    showAuthMessage("Harap setujui syarat dan ketentuan!");
    return;
  }

  // Tampilkan loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  // Simulasi API register (ganti dengan fetch ke backend)
  setTimeout(() => {
    const newUser  = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      joinDate: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        bookingNotifications: true,
        promoNotifications: false,
        favoriteTheme: "default",
        language: "id",
      },
    };

    currentUser  = newUser ;
    isLoggedIn = true;

    // Simpan ke localStorage
    localStorage.setItem("bandung_gis_user", JSON.stringify(currentUser ));

    // Update UI
    updateAuthUI();
    closeAuthModal();

    showAuthMessage("Registrasi berhasil! Selamat datang di Bandung GIS.", "success");

    // Hapus loading state
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

    console.log("[v0] User registered successfully:", currentUser .name);
  }, 2000);
}

function handleForgotPassword(event) {
  event.preventDefault();

  const email = document.getElementById("forgot-email").value;

  if (!email) {
    showAuthMessage("Harap masukkan email Anda!");
    return;
  }

  // Tampilkan loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  // Simulasi API forgot password (ganti dengan fetch ke backend untuk kirim email)
  setTimeout(() => {
    showAuthMessage("Link reset password telah dikirim ke email Anda!", "success");

    // Hapus loading state
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

    // Kembali ke login setelah 3 detik
    setTimeout(() => {
      switchAuthTab("login");
    }, 3000);

    console.log("[v0] Password reset email sent to:", email);
  }, 2000);
}

function showForgotPassword() {
  switchAuthTab("forgot");
}

// 5. FUNGSI PENGELOLAAN AKUN (Logout, Profile, Dropdown)
function logout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    currentUser  = null;
    isLoggedIn = false;
    localStorage.removeItem("bandung_gis_user");
    updateAuthUI();

    // Tutup dropdown
    document.getElementById("profile-dropdown-menu").classList.remove("active");

    console.log("[v0] User logged out successfully");
    alert("Anda telah berhasil keluar. Terima kasih!");
  }
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById("profile-dropdown-menu");
  dropdown.classList.toggle("active");
}

function showUserProfile() {
  // Tutup dropdown
  document.getElementById("profile-dropdown-menu").classList.remove("active");

  // Scroll ke section profile
  document.getElementById("profile").scrollIntoView({ behavior: "smooth" });
}

function showSettings() {
  // Tutup dropdown
  document.getElementById("profile-dropdown-menu").classList.remove("active");

  // Buka modal settings (cek login dulu)
  if (!isLoggedIn) {
    openAuthModal("login");
    return;
  }

  const modal = document.getElementById("settings-modal");
  modal.classList.add("active");
  switchSettingsTab("profile");
}

// 6. FUNGSI SETTINGS MODAL (Update Profile, Password, Preferences)
function closeSettingsModal() {
  document.getElementById("settings-modal").classList.remove("active");
}

function switchSettingsTab(tab) {
  // Update tombol tab
  document.querySelectorAll(".settings-tab").forEach((tabBtn) => {
    tabBtn.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");

  // Update form
  document.querySelectorAll(".settings-form").forEach((form) => {
    form.classList.remove("active");
  });
  document.getElementById(`${tab}-settings`).classList.add("active");
}

function updateSettingsForm() {
  if (!currentUser ) return;

  document.getElementById("settings-name").value = currentUser .name || "";
  document.getElementById("settings-email").value = currentUser .email || "";
  document.getElementById("settings-phone").value = currentUser .phone || "";
  document.getElementById("settings-birthdate").value = currentUser .birthdate || "";
  document.getElementById("settings-address").value = currentUser .address || "";
  document.getElementById("settings-avatar-text").textContent = currentUser .name.charAt(0).toUpperCase();

  // Update preferences
  if (currentUser .preferences) {
    document.getElementById("email-notifications").checked = currentUser .preferences.emailNotifications !== false;
    document.getElementById("booking-notifications").checked = currentUser .preferences.bookingNotifications !== false;
    document.getElementById("promo-notifications").checked = currentUser .preferences.promoNotifications || false;
    document.getElementById("favorite-theme").value = currentUser .preferences.favoriteTheme || "default";
    document.getElementById("language").value = currentUser .preferences.language || "id";
  }
}

function updateProfile(event) {
  event.preventDefault();

  if (!currentUser ) return;

  const name = document.getElementById("settings-name").value;
  const email = document.getElementById("settings-email").value;
  const phone = document.getElementById("settings-phone").value;
  const birthdate = document.getElementById("settings-birthdate").value;
  const address = document.getElementById("settings-address").value;

  // Update data user
  currentUser .name = name;
  currentUser .email = email;
  currentUser .phone = phone;
  currentUser .birthdate = birthdate;
  currentUser .address = address;

  // Simpan ke localStorage
  localStorage.setItem("bandung_gis_user", JSON.stringify(currentUser ));

  // Update UI
  updateAuthUI();

  alert("Profil berhasil diperbarui!");
  console.log("[v0] Profile updated successfully");
}

function changePassword(event) {
  event.preventDefault();

  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmNewPassword = document.getElementById("confirm-new-password").value;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    alert("Harap lengkapi semua field password!");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert("Password baru dan konfirmasi tidak cocok!");
    return;
  }

  if (newPassword.length < 8) {
    alert("Password baru minimal 8 karakter!");
    return;
  }

  // Simulasi API change password (ganti dengan fetch ke backend)
  setTimeout(() => {
    alert("Password berhasil diubah!");
    event.target.reset();
    console.log("[v0] Password changed successfully");
  }, 1000);
}
// ========================================
// JAVASCRIPT UNTUK BAGIAN AKUN: Auth, Login, Register, 
// Profile Dropdown, Settings, dan Riwayat Akun Tersimpan
// (Kelanjutan dari Respons Sebelumnya)
// ========================================
//
// Struktur Kelanjutan:
// 6. Settings Modal (lanjutan: updatePreferences, changeAvatar, dll.)
// 7. Fungsi Riwayat Akun (Payment History)
// 8. Utilitas Auth (Password Strength, Messages, Toggle Password, Terms)
// 9. Social Login Stubs (OAuth Mock)
// 10. Inisialisasi DOM Khusus Auth (Event Listeners untuk Modal)
// 
// ========================================

// 6. SETTINGS MODAL (lanjutan dari updatePreferences)
function updatePreferences(event) {
  event.preventDefault();

  if (!currentUser  ) return;

  const preferences = {
    emailNotifications: document.getElementById("email-notifications").checked,
    bookingNotifications: document.getElementById("booking-notifications").checked,
    promoNotifications: document.getElementById("promo-notifications").checked,
    favoriteTheme: document.getElementById("favorite-theme").value,
    language: document.getElementById("language").value,
  };

  currentUser  .preferences = preferences;

  // Simpan ke localStorage
  localStorage.setItem("bandung_gis_user", JSON.stringify(currentUser  ));

  // Terapkan tema favorit jika diubah (integrasi dengan fungsi setTheme dari JS utama)
  if (preferences.favoriteTheme !== "default") {
    // Asumsi setTheme() tersedia dari JS utama; jika tidak, implementasikan di sini
    setTheme(preferences.favoriteTheme);
  }

  alert("Preferensi berhasil disimpan!");
  console.log("[v0] Preferences updated successfully");
}

function changeAvatar() {
  // Stub untuk upload foto profil (integrasi dengan File API atau backend)
  alert("Fitur ubah foto profil akan segera hadir! (Gunakan input file untuk upload.)");
}

function removeAvatar() {
  if (confirm("Hapus foto profil?")) {
    // Update currentUser .avatar = null; lalu simpan ke localStorage
    if (currentUser  ) {
      currentUser  .avatar = null;
      localStorage.setItem("bandung_gis_user", JSON.stringify(currentUser  ));
      document.getElementById("settings-avatar-text").textContent = currentUser  .name.charAt(0).toUpperCase();
      alert("Foto profil berhasil dihapus!");
    }
  }
}

function setup2FA() {
  // Stub untuk autentikasi dua faktor (integrasi dengan Authy/Google Authenticator)
  alert("Fitur autentikasi dua faktor (2FA) akan segera hadir! (Scan QR code untuk setup.)");
}

function manageSessions() {
  // Stub untuk kelola sesi login (lihat riwayat device/sesi)
  alert("Fitur kelola sesi akan segera hadir! (Lihat dan logout dari device lain.)");
}

// 7. FUNGSI RIWAYAT AKUN (Payment History - terkait akun tersimpan)
function showPaymentHistory() {
  // Cek login dulu
  if (!isLoggedIn) {
    openAuthModal("login");
    return;
  }

  // Tutup modal lain jika terbuka
  closePaymentModal();
  const modal = document.getElementById("payment-history-modal");
  modal.classList.add("active");
  updateHistoryDisplay();  // Tampilkan riwayat default (semua)
}

function closePaymentHistory() {
  document.getElementById("payment-history-modal").classList.remove("active");
}

function updateHistoryDisplay(filter = "all") {
  const historyList = document.querySelector(".history-list");
  let filteredHistory = paymentHistory;

  // Filter berdasarkan status (completed/pending/cancelled)
  if (filter !== "all") {
    filteredHistory = paymentHistory.filter((item) => item.status === filter);
  }

  historyList.innerHTML = "";  // Clear list

  filteredHistory.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = `history-item ${item.status}`;

    historyItem.innerHTML = `
      <div class="history-info">
        <h4>${item.destination}</h4>
        <p>Kode: ${item.id}</p>
        <p>Tanggal: ${new Date(item.date).toLocaleDateString("id-ID")}</p>
        <p>${item.quantity} orang</p>
      </div>
      <div class="history-status">
        <span class="status ${item.status}">
          ${item.status === "completed" ? "Selesai" : 
            item.status === "pending" ? "Menunggu Pembayaran" : "Dibatalkan"}
        </span>
        <div class="history-total">Rp ${item.total.toLocaleString("id-ID")}</div>
      </div>
      <div class="history-actions">
        ${
          item.status === "completed"
            ? `<button class="btn-small" onclick="downloadTicket('${item.id}')">Download</button>
               <button class="btn-small" onclick="viewTicketDetails('${item.id}')">Detail</button>`
            : item.status === "pending"
              ? `<button class="btn-small primary" onclick="continuePayment('${item.id}')">Bayar</button>
                 <button class="btn-small" onclick="cancelBooking('${item.id}')">Batal</button>`
              : `<button class="btn-small" onclick="viewTicketDetails('${item.id}')">Detail</button>`
        }
      </div>
    `;

    historyList.appendChild(historyItem);
  });

  console.log(`[v0] History updated with filter: ${filter}, items: ${filteredHistory.length}`);
}

function downloadTicket(bookingCode) {
  if (bookingCode) {
    // Simulasi download PDF (ganti dengan window.print() atau library jsPDF)
    alert(`Mengunduh e-ticket untuk booking ${bookingCode}... (Fitur download PDF akan segera hadir.)`);
  } else {
    alert("Mengunduh e-ticket...");
  }
}

function viewTicketDetails(bookingCode) {
  const booking = paymentHistory.find((item) => item.id === bookingCode);
  if (booking) {
    alert(
      `Detail booking ${bookingCode}:\n\nDestinasi: ${booking.destination}\nTanggal: ${new Date(booking.date).toLocaleDateString("id-ID")}\nJumlah: ${booking.quantity} orang\nTotal: Rp ${booking.total.toLocaleString("id-ID")}\nStatus: ${booking.status}`,
    );
  } else {
    alert("Booking tidak ditemukan!");
  }
}

function continuePayment(bookingCode) {
  alert(`Melanjutkan pembayaran untuk booking ${bookingCode}...`);
  closePaymentHistory();
  openPaymentModal();  // Buka modal payment untuk lanjut bayar
}

function cancelBooking(bookingCode) {
  if (confirm(`Apakah Anda yakin ingin membatalkan booking ${bookingCode}?`)) {
    const bookingIndex = paymentHistory.findIndex((item) => item.id === bookingCode);
    if (bookingIndex !== -1) {
      paymentHistory[bookingIndex].status = "cancelled";
      updateHistoryDisplay();  // Refresh tampilan
      alert("Booking berhasil dibatalkan.");
      console.log(`[v0] Booking ${bookingCode} cancelled`);
    } else {
      alert("Booking tidak ditemukan!");
    }
  }
}

function rateExperience(bookingCode) {
  // Stub untuk beri rating (bisa buka modal ulasan)
  alert(`Memberikan rating untuk pengalaman di booking ${bookingCode}... (Fitur rating akan segera hadir.)`);
}

// 8. UTILITAS AUTH (Password Strength, Messages, Toggle Password, Terms)
function checkPasswordStrength() {
  const password = document.getElementById("register-password").value;
  const strengthBar = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");

  let strength = 0;
  let strengthLabel = "Lemah";

  // Cek kriteria password
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;  // Huruf kecil
  if (/[A-Z]/.test(password)) strength++;  // Huruf besar
  if (/[0-9]/.test(password)) strength++;  // Angka
  if (/[^A-Za-z0-9]/.test(password)) strength++;  // Simbol

  // Update indikator strength
  strengthBar.className = "strength-fill";

  if (strength <= 1) {
    strengthBar.classList.add("weak");
    strengthLabel = "Lemah";
  } else if (strength <= 2) {
    strengthBar.classList.add("fair");
    strengthLabel = "Cukup";
  } else if (strength <= 3) {
    strengthBar.classList.add("good");
    strengthLabel = "Baik";
  } else {
    strengthBar.classList.add("strong");
    strengthLabel = "Kuat";
  }

  strengthText.textContent = strengthLabel;
}

function showAuthMessage(message, type = "error") {
  // Hapus pesan lama
  clearAuthMessages();

  const messageDiv = document.createElement("div");
  messageDiv.className = `auth-message ${type}`;
  messageDiv.innerHTML = `
    <span>${type === "success" ? "✅" : "❌"}</span>
    ${message}
  `;

  const activeForm = document.querySelector(".auth-form.active");
  if (activeForm) {
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
  }

  // Auto hapus setelah 5 detik
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

function clearAuthMessages() {
  document.querySelectorAll(".auth-message").forEach((msg) => msg.remove());
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

function showTerms() {
  // Tampilkan syarat & ketentuan (bisa buka modal terpisah atau alert)
  alert(
    "Syarat & Ketentuan:\n\n1. Pengguna bertanggung jawab atas keamanan akun\n2. Dilarang menyalahgunakan platform\n3. Data pribadi akan dijaga kerahasiaannya\n4. Pembayaran mengikuti ketentuan yang berlaku",
  );
}

// 9. SOCIAL LOGIN STUBS (OAuth Mock - ganti dengan SDK Google/FB)
function loginWithGoogle() {
  // Stub untuk Google OAuth (ganti dengan gapi.auth2 atau firebase.auth)
  alert("Login dengan Google akan segera hadir! (Integrasi Firebase Auth.)");
  // Contoh real: firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function loginWithFacebook() {
  // Stub untuk Facebook OAuth (ganti dengan FB SDK)
  alert("Login dengan Facebook akan segera hadir! (Integrasi Facebook SDK.)");
  // Contoh real: FB.login(function(response) { ... });
}

function registerWithGoogle() {
  // Mirip login, tapi untuk registrasi baru
  alert("Daftar dengan Google akan segera hadir!");
}

function registerWithFacebook() {
  alert("Daftar dengan Facebook akan segera hadir!");
}

// 10. INISIALISASI DOM KHUSUS AUTH (Event Listeners untuk Modal Close, dll.)
// Panggil ini di DOMContentLoaded atau setelah HTML loaded
function initializeAuthEventListeners() {
  console.log("[v0] Initializing auth event listeners...");

  // Close modal auth pada klik luar
  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeAuthModal();
      }
    });
  }

  // Close modal settings pada klik luar
  const settingsModal = document.getElementById("settings-modal");
  if (settingsModal) {
    settingsModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeSettingsModal();
      }
    });
  }

  // Close modal history pada klik luar
  const historyModal = document.getElementById("payment-history-modal");
  if (historyModal) {
    historyModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closePaymentHistory();
      }
    });
  }

  // Close semua modal pada tekan Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuthModal();
      closeSettingsModal();
      closePaymentHistory();
    }
  });

  // Tutup dropdown profile jika klik luar
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-profile-dropdown")) {
      document.getElementById("profile-dropdown-menu").classList.remove("active");
    }
  });

  // Event untuk switch tab auth (jika onclick di HTML)
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const tabType = e.target.getAttribute("data-tab");
      switchAuthTab(tabType);
    });
  });

  // Event untuk switch tab settings
  document.querySelectorAll(".settings-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const tabType = e.target.getAttribute("data-tab");
      switchSettingsTab(tabType);
    });
  });

  // Event untuk form submit (sudah di-handle di HTML onsubmit, tapi backup)
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const registerForm = document.getElementById("register-form");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

  const forgotForm = document.getElementById("forgot-password-form");
  if (forgotForm) forgotForm.addEventListener("submit", handleForgotPassword);

  const profileForm = document.getElementById("profile-settings");
  if (profileForm) profileForm.addEventListener("submit", updateProfile);

  const passwordForm = document.getElementById("security-settings");
  if (passwordForm) passwordForm.addEventListener("submit", changePassword);

  const preferencesForm = document.getElementById("preferences-settings");
  if (preferencesForm) preferencesForm.addEventListener("submit", updatePreferences);

  console.log("[v0] Auth event listeners initialized successfully!");
}

// ========================================
// AKHIR JS BAGIAN AKUN
// ========================================
//
// Catatan:
// - Ini mencakup semua fungsi relevan untuk auth/login/register/akun dari file asli.
// - Integrasi: Panggil initializeAuth() dan initializeAuthEventListeners() di <script> utama atau DOMContentLoaded.
// - Test: Buka HTML akun di browser, coba login/register → Dropdown muncul, settings bisa diubah, riwayat tampil. Cek localStorage di F12 > Application.
// - Pengembangan: Ganti mock (setTimeout) dengan fetch API (e.g., POST /login ke backend). Tambah error handling (e.g., try-catch untuk localStorage).
// - Jika perlu tambah (e.g., validasi email real, integrasi backend), atau modifikasi (e.g., enkripsi password), beri tahu!
//
// ========================================