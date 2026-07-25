// ===============================================
// LOGIN PAGE LOGIC — demo only, no real backend.
// Everything runs against the mockUsers object below,
// so it behaves like a real login/reset flow while
// you don't have a server yet.
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return; // not on the login page, skip

  // ---------- MOCK "DATABASE" ----------
  // Swap this out later for a real API call.
  const mockUsers = {
    "deborah04@gmail.com": {
      password: "somto1234",
      name: "Deborah",
    },
    "dominicughanze348@gmail.com": {
      password: "password123",
      name: "Dominic",
    },
  };

  // tracks which email is currently going through the reset flow
  let resetEmailInProgress = null;

  // ---------- ELEMENT REFS ----------
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const loginAlert = document.getElementById("loginAlert");
  const loginAlertText = document.getElementById("loginAlertText");
  const loginAlertClose = document.getElementById("loginAlertClose");
  const toggleLoginPassword = document.getElementById("toggleLoginPassword");

  const modalOverlay = document.getElementById("modalOverlay");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const resetSentModal = document.getElementById("resetSentModal");
  const newPasswordModal = document.getElementById("newPasswordModal");
  const successModal = document.getElementById("successModal");

  const openForgotPassword = document.getElementById("openForgotPassword");
  const forgotEmailInput = document.getElementById("forgotEmailInput");
  const sendResetLinkBtn = document.getElementById("sendResetLinkBtn");
  const resetSentEmail = document.getElementById("resetSentEmail");
  const checkMailBtn = document.getElementById("checkMailBtn");
  const resendLinkBtn = document.getElementById("resendLinkBtn");

  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const resetPasswordBtn = document.getElementById("resetPasswordBtn");
  const toggleNewPassword = document.getElementById("toggleNewPassword");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

  const proceedToLoginBtn = document.getElementById("proceedToLoginBtn");
  const backToLoginBtn1 = document.getElementById("backToLoginBtn1");
  const backToLoginBtn2 = document.getElementById("backToLoginBtn2");
  const backToLoginBtn3 = document.getElementById("backToLoginBtn3");

  // ---------- HELPERS ----------
  function setFieldError(groupId, errorId, inputEl, message) {
    const group = document.getElementById(groupId);
    const errorEl = document.getElementById(errorId);
    if (inputEl) inputEl.classList.add("error");
    if (group) group.classList.add("has-error");
    if (errorEl && message) errorEl.textContent = message;
  }

  function clearFieldError(groupId, inputEl) {
    const group = document.getElementById(groupId);
    if (inputEl) inputEl.classList.remove("error");
    if (group) group.classList.remove("has-error");
  }

  function showAlert(message) {
    if (!loginAlert) return;
    loginAlertText.textContent = message;
    loginAlert.classList.add("show");
  }

  function hideAlert() {
    if (!loginAlert) return;
    loginAlert.classList.remove("show");
  }

  function setLoading(button, isLoading) {
    if (!button) return;
    button.classList.toggle("is-loading", isLoading);
    button.disabled = isLoading;
  }

  function openModal(modalToShow) {
    [forgotPasswordModal, resetSentModal, newPasswordModal, successModal].forEach((m) => {
      if (m) m.classList.remove("show");
    });
    if (modalToShow) modalToShow.classList.add("show");
    if (modalOverlay) modalOverlay.classList.add("show");
  }

  function closeAllModals() {
    if (modalOverlay) modalOverlay.classList.remove("show");
    [forgotPasswordModal, resetSentModal, newPasswordModal, successModal].forEach((m) => {
      if (m) m.classList.remove("show");
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setupPasswordToggle(inputEl, iconEl) {
    if (!inputEl || !iconEl) return;
    iconEl.addEventListener("click", () => {
      const isHidden = inputEl.type === "password";
      inputEl.type = isHidden ? "text" : "password";
      iconEl.textContent = isHidden ? "🙈" : "👁";
    });
  }

  setupPasswordToggle(loginPassword, toggleLoginPassword);
  setupPasswordToggle(newPassword, toggleNewPassword);
  setupPasswordToggle(confirmPassword, toggleConfirmPassword);

  // ---------- LOGIN SUBMIT ----------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert();

    let hasError = false;
    const emailValue = loginEmail.value.trim();
    const passwordValue = loginPassword.value;

    if (!emailValue) {
      setFieldError("login-email-group", "login-email-error", loginEmail, "This is a required field");
      hasError = true;
    } else {
      clearFieldError("login-email-group", loginEmail);
    }

    if (!passwordValue) {
      setFieldError("login-password-group", "login-password-error", loginPassword, "This is a required field");
      hasError = true;
    } else {
      clearFieldError("login-password-group", loginPassword);
    }

    if (hasError) return;

    // simulate network request against the mock user object
    setLoading(loginSubmitBtn, true);

    setTimeout(() => {
      setLoading(loginSubmitBtn, false);

      const user = mockUsers[emailValue.toLowerCase()];
      const isValid = user && user.password === passwordValue;

      if (!isValid) {
        showAlert("Incorrect Email or Password.");
        return;
      }

      // store who's logged in so dashboard.js can read it — swap
      // this for a real session/token once you have a backend
      sessionStorage.setItem(
        "hrme_currentUser",
        JSON.stringify({ email: emailValue.toLowerCase(), name: user.name })
      );

      window.location.href = "dashboard.html";
    }, 1200);
  });

  loginEmail.addEventListener("input", () => clearFieldError("login-email-group", loginEmail));
  loginPassword.addEventListener("input", () => clearFieldError("login-password-group", loginPassword));

  if (loginAlertClose) {
    loginAlertClose.addEventListener("click", hideAlert);
  }

  // ---------- FORGOT PASSWORD: STEP 1 ----------
  if (openForgotPassword) {
    openForgotPassword.addEventListener("click", (e) => {
      e.preventDefault();
      forgotEmailInput.value = "";
      clearFieldError("forgot-email-group", forgotEmailInput);
      openModal(forgotPasswordModal);
    });
  }

  if (sendResetLinkBtn) {
    sendResetLinkBtn.addEventListener("click", () => {
      const emailValue = forgotEmailInput.value.trim();

      if (!emailValue || !isValidEmail(emailValue)) {
        setFieldError("forgot-email-group", "forgot-email-error", forgotEmailInput, "Enter a valid email address");
        return;
      }
      clearFieldError("forgot-email-group", forgotEmailInput);

      setLoading(sendResetLinkBtn, true);

      setTimeout(() => {
        setLoading(sendResetLinkBtn, false);
        resetEmailInProgress = emailValue.toLowerCase();
        resetSentEmail.textContent = emailValue;
        openModal(resetSentModal);
      }, 1000);
    });
  }

  forgotEmailInput.addEventListener("input", () => clearFieldError("forgot-email-group", forgotEmailInput));

  // ---------- FORGOT PASSWORD: STEP 2 -> STEP 3 ----------
  if (checkMailBtn) {
    checkMailBtn.addEventListener("click", () => {
      newPassword.value = "";
      confirmPassword.value = "";
      clearFieldError("newPassword-group", newPassword);
      clearFieldError("confirmPassword-group", confirmPassword);
      openModal(newPasswordModal);
    });
  }

  if (resendLinkBtn) {
    resendLinkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resendLinkBtn.textContent = "Link sent again!";
      setTimeout(() => (resendLinkBtn.textContent = "Resend Link"), 2000);
    });
  }

  // ---------- STEP 3: SET NEW PASSWORD ----------
  if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener("click", () => {
      let hasError = false;
      const pw = newPassword.value;
      const confirmPw = confirmPassword.value;

      if (!pw || pw.length < 8) {
        setFieldError("newPassword-group", "newPassword-error", newPassword, "Password must be at least 8 characters");
        hasError = true;
      } else {
        clearFieldError("newPassword-group", newPassword);
      }

      if (!confirmPw || confirmPw !== pw) {
        setFieldError("confirmPassword-group", "confirmPassword-error", confirmPassword, "Passwords do not match");
        hasError = true;
      } else {
        clearFieldError("confirmPassword-group", confirmPassword);
      }

      if (hasError) return;

      setLoading(resetPasswordBtn, true);

      setTimeout(() => {
        setLoading(resetPasswordBtn, false);

        // update the mock "database" with the new password
        if (resetEmailInProgress && mockUsers[resetEmailInProgress]) {
          mockUsers[resetEmailInProgress].password = pw;
        }

        openModal(successModal);
      }, 1200);
    });
  }

  // ---------- STEP 4: SUCCESS -> BACK TO LOGIN ----------
  if (proceedToLoginBtn) {
    proceedToLoginBtn.addEventListener("click", () => {
      closeAllModals();
      loginForm.reset();
      hideAlert();
      resetEmailInProgress = null;
    });
  }

  // ---------- "LOG IN" BUTTONS ON EACH MODAL ----------
  [backToLoginBtn1, backToLoginBtn2, backToLoginBtn3].forEach((btn) => {
    if (btn) btn.addEventListener("click", closeAllModals);
  });

  // close modal by clicking the dark overlay itself
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeAllModals();
    });
  }
});