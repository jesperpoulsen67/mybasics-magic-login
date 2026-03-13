document.addEventListener("DOMContentLoaded", () => {
  try {
    // Move points indicator content to dedicated container (for checkout gate)
    const pointsContainer = document.querySelector('.checkout-gate-wrapper .points-indicator-container');
    if (pointsContainer) {
      // Look for points content that plugins inject (common selectors)
      const pointsContent = document.querySelector('.checkout-gate-wrapper .login-column .card .pr-checkout-gate-points-indicator') ||
                           document.querySelector('.checkout-gate-wrapper .login-column .card .pr-points-text') ||
                           document.querySelector('.checkout-gate-wrapper .login-column .card .wc-points-rewards-product-message') ||
                           document.querySelector('.checkout-gate-wrapper .login-column .card [class*="points"]');
      
      if (pointsContent) {
        // Move points content to the dedicated container
        pointsContainer.appendChild(pointsContent);
      }
    }

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // Get the toggle links
    const registerLinkBottom = document.querySelector('a[href="#register"]');
    const loginLinkBottom = document.querySelector('a[href="#login"]');

    // Get dynamic text elements
    const authTitle = document.getElementById("auth-title");
    const authSubtitle = document.querySelector(".card .subtitle");
    const perkContainer = document.querySelector(".card .perk");
    const membershipPitch = document.querySelector(".membership-pitch");
    const loginMembershipLinkContainer = document.querySelector(".membership-toggle.login-view");
    const registerMembershipLinkContainer = document.querySelector(".membership-toggle.register-view");

    // Use configuration from PHP or fallbacks
    const texts = (typeof mybasicsLoginData !== 'undefined' && mybasicsLoginData.texts) ? mybasicsLoginData.texts : {
        loginTitle: 'Log ind',
        registerTitle: 'Bliv medlem',
        loginSubtitle: 'Få adgang til dine størrelser, dine produkter og din købshistorik – og bestil endnu hurtigere!',
        registerSubtitle: 'Opret din konto og få adgang til din størrelse, dine produkter og din købshistorik. Du kan også bruge dine point til at prøve spændende nye produkter!',
        registerPerk: 'Du får 5 point for din tilmelding.'
    };

    // Original content for easy switching (add new spans in PHP)
    const registerPerkHTML = '<span class="dot" aria-hidden="true"></span> ' + texts.registerPerk;

    // Utility for password toggle
    const setupPasswordToggle = (passwordInputId, toggleButtonId, forceShowFunction) => {
      const passwordInput = document.getElementById(passwordInputId);
      const toggleButton = document.getElementById(toggleButtonId);

      if (!passwordInput || !toggleButton) return;

      const EYE = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;

      const EYE_SLASH = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.8 21.8 0 0 1 5.06-5.94"></path>
          <path d="M10.58 10.58a3 3 0 1 0 4.24 4.24"></path>
          <path d="M9.88 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.8 21.8 0 0 1-3.16 4.19"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      `;

      const setIcon = (visible) => {
        toggleButton.innerHTML = visible ? EYE : EYE_SLASH;
        toggleButton.setAttribute("aria-pressed", String(visible));
        toggleButton.setAttribute(
          "aria-label",
          visible ? "Skjul adgangskode" : "Vis adgangskode"
        );
      };

      setIcon(false); // Initial render: password is hidden -> eye-slash

      // Prevent button from stealing focus on click (prevents border flash)
      toggleButton.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });

      toggleButton.addEventListener("click", () => {
        const visible = passwordInput.type === "text";
        passwordInput.type = visible ? "password" : "text";
        setIcon(!visible);
        passwordInput.focus();
        if (typeof forceShowFunction === "function") {
          forceShowFunction();
        }
      });
    };

    // Inject Input Icons (User & Lock)
    const injectInputIcons = () => {
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      
      const addIcon = (input, iconSvg) => {
        if (!input) return;
        const wrapper = input.closest('.input-wrapper');
        if (wrapper && !wrapper.querySelector('.input-icon-container')) {
          const iconContainer = document.createElement('span');
          iconContainer.className = 'input-icon-container';
          iconContainer.innerHTML = iconSvg;
          wrapper.insertBefore(iconContainer, wrapper.firstChild);
          wrapper.classList.add('has-icon');
        }
      };

      const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
      const emailIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;

      // Login Form
      addIcon(usernameInput, userIcon);
      addIcon(passwordInput, lockIcon);

      // Registration Form (Check fields dynamically)
      addIcon(document.getElementById('reg_email'), emailIcon);
      addIcon(document.getElementById('reg_password'), lockIcon);
      addIcon(document.getElementById('reg_password_confirm'), lockIcon); // Add lock to confirm field too

      // Shorten Placeholder Text AND LABEL Content (for floating label)
      if (usernameInput) {
         usernameInput.setAttribute('placeholder', 'E-mail eller brugernavn');
         // Also update the label text because the floating label uses it
         const label = document.querySelector('label[for="username"]');
         if (label) label.firstChild.textContent = 'E-mail eller brugernavn';
      }

      const regEmailInput = document.getElementById('reg_email');
      if (regEmailInput) {
        regEmailInput.setAttribute('placeholder', 'E-mail');
         // Also update the label text
         const label = document.querySelector('label[for="reg_email"]');
         if (label) label.firstChild.textContent = 'E-mail';
      }
      
      // Ensure all inputs have a placeholder attribute for CSS :placeholder-shown to work
      const allAuthInputs = document.querySelectorAll('#login-form input:not([type="hidden"]), #register-form input:not([type="hidden"])');
      allAuthInputs.forEach(input => {
        if (!input.hasAttribute('placeholder') || input.getAttribute('placeholder') === '') {
          input.setAttribute('placeholder', ' '); 
        }
      });
    };
    injectInputIcons();

    // Helper to clear validation errors
    function clearValidationState() {
      // Clear all error text
      const errorElements = document.querySelectorAll('.error');
      errorElements.forEach(el => el.textContent = '');

      // Remove invalid class and aria attributes
      const invalidInputs = document.querySelectorAll('.invalid');
      invalidInputs.forEach(el => {
        el.classList.remove('invalid');
        el.setAttribute('aria-invalid', 'false');
      });
    }

    // Function to show/hide forms and update content
    function toggleForms(showRegister) {
      if (!loginForm || !registerForm) return;

      // Clear previous verification errors when switching
      clearValidationState();

      // Toggle form visibility
      loginForm.classList.toggle("is-visible", !showRegister);
      loginForm.classList.toggle("is-hidden", showRegister);
      registerForm.classList.toggle("is-visible", showRegister);
      registerForm.classList.toggle("is-hidden", !showRegister);

      // Update header content (title, subtitle, perk)
      if (authTitle) {
        authTitle.innerHTML = showRegister ? texts.registerTitle : texts.loginTitle;
      }
      if (authSubtitle) {
        authSubtitle.innerHTML = showRegister ? texts.registerSubtitle : texts.loginSubtitle;
      }
      if (perkContainer) {
          if (showRegister) {
              perkContainer.innerHTML = registerPerkHTML;
              perkContainer.classList.remove('is-hidden'); // Ensure perk is visible for register
          } else {
              // Hide perk on login, or show a login-specific perk if you have one
              perkContainer.classList.add('is-hidden');
              perkContainer.innerHTML = ''; // Clear content
          }
      }

      // Toggle membership offer section visibility
      if (membershipPitch) {
        membershipPitch.classList.toggle("is-hidden", showRegister);
      }
      if (loginMembershipLinkContainer) {
        loginMembershipLinkContainer.classList.toggle("is-hidden", showRegister);
      }
      if (registerMembershipLinkContainer) {
        registerMembershipLinkContainer.classList.toggle("is-hidden", !showRegister);
      }

      // Hide password hint on login, show on register (unless input hides it)
      // We look for specific IDs, classes, and any element containing the text "Min. 6 Zeichen"
      const textHints = Array.from(document.querySelectorAll('.card *'))
        .filter(el => el.children.length === 0 && el.textContent && (el.textContent.includes('Min. 6 Zeichen') || el.textContent.includes('Min. 6 tegn')));

      const hints = [
        document.getElementById('reg-pw-hint'),
        ...document.querySelectorAll('.woocommerce-password-hint'),
        ...textHints
      ];
      
      hints.forEach(el => {
        if (!el) return;
        if (!showRegister) {
          el.classList.add('is-hidden-mode');
        } else {
          el.classList.remove('is-hidden-mode');
        }
      });

      // Toggle bottom navigation links visibility
      if (registerLinkBottom) {
        registerLinkBottom.style.display = showRegister ? 'none' : 'inline-block';
      }
      if (loginLinkBottom) {
        loginLinkBottom.style.display = showRegister ? 'inline-block' : 'none';
      }

      // Set focus to the first input of the active form
      setTimeout(() => {
        // Removed initial auto-focus logic to prevent undesired field activation on load
      }, 50);
    }

    // Initial check based on URL hash
    const initialHash = window.location.hash;
    // Check if we have a flag from PHP to show registration form (e.g., after validation errors)
    const shouldShowRegistration = window.showRegistrationForm || initialHash === "#register";
    
    if (shouldShowRegistration) {
      toggleForms(true);
      window.location.hash = "register";
    } else {
      toggleForms(false);
      window.location.hash = "login"; // Default to #login if no hash
    }

    // Add event listeners for the toggle links
    if (registerLinkBottom) {
      registerLinkBottom.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForms(true);
        window.location.hash = "register"; // Update URL hash
      });
    }

    if (loginLinkBottom) {
      loginLinkBottom.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForms(false);
        window.location.hash = "login"; // Update URL hash
      });
    }

    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
      if (window.location.hash === "#register") {
        toggleForms(true);
      } else {
        toggleForms(false);
      }
    });


    // =============================== //
    // Kill External Validation (Optimized)
    // =============================== //
    (function killExternalValidation() {
      const purge = () => {
        const errors = document.querySelectorAll(
          "#login-form label.error, #register-form label.error"
        );
        if (errors.length === 0) return false;
        errors.forEach((el) => el.remove());
        return true;
      };

      // Run immediately, only repeat if labels were found
      if (purge()) {
        setTimeout(purge, 100);
        setTimeout(purge, 500);
      }

      // Detach jQuery Validate if present
      if (window.jQuery?.fn?.validate) {
        ["#login-form", "#register-form"].forEach((sel) => {
          const $f = jQuery(sel);
          if ($f.length && $f.data("validator")) {
            try {
              $f.removeData("validator").off(".validate");
            } catch (_) {}
          }
        });
      }
    })();

    // =============================== //
    // Persistent Hint Killer (MutationObserver)
    // =============================== //
    const card = document.querySelector('.card');
    if (card) {
        let hideHintTimeout;
        const hintObserver = new MutationObserver((mutations) => {
            // Optimization: Only run if nodes were added or text changed
            const shouldRun = mutations.some(m => m.type === 'childList' && m.addedNodes.length > 0) || 
                              mutations.some(m => m.type === 'characterData');
            
            if (!shouldRun) return;

            // Debounce the heavy DOM scan (wait for updates to settle)
            clearTimeout(hideHintTimeout);
            hideHintTimeout = setTimeout(() => {
                const isLoginVisible = !registerForm.classList.contains('is-visible');
                
                if (isLoginVisible) {
                    const textHints = Array.from(card.querySelectorAll('*'))
                        .filter(el => el.children.length === 0 && el.textContent && (el.textContent.includes('Min. 6 Zeichen') || el.textContent.includes('Min. 6 tegn')));
                    
                     const hints = [
                        document.getElementById('reg-pw-hint'),
                        ...card.querySelectorAll('.woocommerce-password-hint'),
                        ...textHints
                     ];

                     hints.forEach(el => {
                         if (el && !el.classList.contains('is-hidden-mode')) {
                             el.classList.add('is-hidden-mode');
                         }
                     });
                }
            }, 50); // 50ms delay is imperceptible but saves CPU
        });
        
        hintObserver.observe(card, { childList: true, subtree: true, characterData: true });
    }

    // =============================== //
    // Force Login Button Label (Optimized)
    // =============================== //
    const loginBtn = document.getElementById("submit-login");
    if (loginBtn) {
      const correctLabel = "Log ind";
      const forceLabel = () => {
        if (loginBtn.textContent !== correctLabel) {
          loginBtn.textContent = correctLabel;
        }
      };

      forceLabel();

      // Observer with auto-disconnect
      const obs = new MutationObserver(forceLabel);
      obs.observe(loginBtn, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      // Disconnect after 2 seconds (WC/plugins settle by then)
      setTimeout(() => obs.disconnect(), 2000);
    }

    // =============================== //
    // Initialize Forms
    // =============================== //
    // Call handlers immediately after DOM load
    if (registerForm) handleRegistrationForm();
    if (loginForm) handleLoginForm();

    // =============================== //
    // Utility: Debounce Function
    // =============================== //
    function debounce(fn, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    // =============================== //
    // Duplicate Email Modal
    // =============================== //
    function showDuplicateEmailModal(emailAddress) {
      // Check if modal already exists
      let modal = document.getElementById('duplicate-email-modal');
      
      if (!modal) {
        // Create modal HTML
        modal = document.createElement('div');
        modal.id = 'duplicate-email-modal';
        modal.className = 'duplicate-email-modal';
        modal.innerHTML = `
          <div class="duplicate-email-modal-backdrop"></div>
          <div class="duplicate-email-modal-content">
            <button class="duplicate-email-modal-close" aria-label="Schließen" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="duplicate-email-modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="duplicate-email-modal-title">E-mailadresse allerede i brug</h3>
            <p class="duplicate-email-modal-message">
              Der findes allerede en konto med e-mailadressen 
              <span class="duplicate-email-modal-email">"${emailAddress}"</span>. 
              Vil du logge ind med denne e-mail eller oprette en ny konto med en anden e-mailadresse?
            </p>
            <div class="duplicate-email-modal-actions">
              <a href="#login" class="duplicate-email-modal-btn duplicate-email-modal-btn-primary">
                Log ind med denne e-mail
              </a>
              <button type="button" class="duplicate-email-modal-btn duplicate-email-modal-btn-secondary duplicate-email-modal-dismiss">
                Opret ny konto med anden e-mail
              </button>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.duplicate-email-modal-close');
        const dismissBtn = modal.querySelector('.duplicate-email-modal-dismiss');
        const backdrop = modal.querySelector('.duplicate-email-modal-backdrop');
        const loginLink = modal.querySelector('a[href="#login"]');
        
        // Function to clear server-side errors
        const clearServerErrors = () => {
          // Hide the original WooCommerce error list
          const errorList = document.querySelector('.woocommerce-error');
          if (errorList) {
            errorList.style.display = 'none';
            errorList.remove(); // Completely remove it from DOM
          }
          
          // Clear inline errors on registration form
          const emailField = document.getElementById('reg_email');
          const emailError = document.getElementById('register-email-error');
          if (emailError) {
            emailError.textContent = '';
          }
          if (emailField) {
            emailField.classList.remove('invalid');
            emailField.setAttribute('aria-invalid', 'false');
          }
        };
        
        const closeModal = () => {
          modal.classList.remove('is-visible');
          clearServerErrors(); // Clear errors when closing modal
          
          // Remove escape key listener
          if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
          }
          
          // Clear the email field and focus it for retry
          const emailField = document.getElementById('reg_email');
          if (emailField) {
            setTimeout(() => {
              emailField.value = '';
              emailField.focus();
            }, 300);
          }
        };
        
        closeBtn.addEventListener('click', closeModal);
        dismissBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Verify nonce before allowing form switch
          if (typeof mybasicsLoginData === 'undefined' || !mybasicsLoginData.nonce) {
            console.warn('Security verification failed');
            return;
          }
          
          modal.classList.remove('is-visible');
          clearServerErrors(); // Clear errors when switching to login
          
          // Remove escape key listener
          if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
          }
          
          // Switch to login form and pre-fill email
          toggleForms(false);
          window.location.hash = 'login';
          
          setTimeout(() => {
            const loginEmailField = document.getElementById('username');
            if (loginEmailField) {
              loginEmailField.value = emailAddress;
              loginEmailField.focus();
              // Move cursor to end
              loginEmailField.setSelectionRange(emailAddress.length, emailAddress.length);
            }
          }, 100);
        });
        
        // Close on Escape key - Store reference for cleanup
        const escapeHandler = (e) => {
          if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
            closeModal();
          }
        };
        modal._escapeHandler = escapeHandler;
        document.addEventListener('keydown', escapeHandler);
      } else {
        // Update email in existing modal
        const emailSpan = modal.querySelector('.duplicate-email-modal-email');
        if (emailSpan) {
          emailSpan.textContent = `"${emailAddress}"`;
        }
        
        // Function to clear server-side errors
        const clearServerErrors = () => {
          const errorList = document.querySelector('.woocommerce-error');
          if (errorList) {
            errorList.style.display = 'none';
            errorList.remove(); // Completely remove it from DOM
          }
          
          const emailField = document.getElementById('reg_email');
          const emailError = document.getElementById('register-email-error');
          if (emailError) {
            emailError.textContent = '';
          }
          if (emailField) {
            emailField.classList.remove('invalid');
            emailField.setAttribute('aria-invalid', 'false');
          }
        };
        
        // Update login link to pre-fill the email
        const loginLink = modal.querySelector('a[href="#login"]');
        if (loginLink) {
          loginLink.onclick = (e) => {
            e.preventDefault();
            
            // Verify nonce before allowing form switch
            if (typeof mybasicsLoginData === 'undefined' || !mybasicsLoginData.nonce) {
              console.warn('Security verification failed');
              return;
            }
            
            modal.classList.remove('is-visible');
            clearServerErrors(); // Clear errors when switching to login
            
            toggleForms(false);
            window.location.hash = 'login';
            
            setTimeout(() => {
              const loginEmailField = document.getElementById('username');
              if (loginEmailField) {
                loginEmailField.value = emailAddress;
                loginEmailField.focus();
                loginEmailField.setSelectionRange(emailAddress.length, emailAddress.length);
              }
            }, 100);
          };
        }
        
        // Update dismiss button to clear errors
        const dismissBtn = modal.querySelector('.duplicate-email-modal-dismiss');
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            modal.classList.remove('is-visible');
            clearServerErrors(); // Clear errors when dismissing
            
            const emailField = document.getElementById('reg_email');
            if (emailField) {
              setTimeout(() => {
                emailField.value = '';
                emailField.focus();
              }, 300);
            }
          };
        }
      }
      
      // Show modal with slight delay for animation
      setTimeout(() => {
        modal.classList.add('is-visible');
      }, 50);
    }

    // =============================== //
    // Registration Form Handler
    // =============================== //
    function handleRegistrationForm() {
      // Cache all DOM element references at initialization
      const email = document.getElementById("reg_email");
      const password = document.getElementById("reg_password");
      const passwordConfirm = document.getElementById("reg_password_confirm");
      const emailError = document.getElementById("register-email-error");
      const pwError = document.getElementById("reg-pw-error");
      const pwConfirmError = document.getElementById("reg-pw-confirm-error");
      const caps = document.getElementById("reg-caps");
      const submit = document.getElementById("submit-register");
      const passwordHint = document.getElementById('reg-pw-hint'); // Cache hint element
      const existingHint = document.getElementById('reg-pw-hint'); // For strength UI positioning

      if (!email || !password || !passwordConfirm || !submit || !emailError || !pwError || !pwConfirmError) {
        console.warn("Registration form: missing elements");
        return;
      }

      // Reposition WooCommerce server-side registration errors under fields
      (function repositionRegistrationErrors() {
        const errorList = document.querySelector(".woocommerce-error");
        if (!errorList) return;

        const li = errorList.querySelector("li");
        if (!li) return;

        // Check for error code data attribute (more reliable than text matching)
        const errorCode = li.getAttribute('data-code') || '';
        
        // Get clean text only
        const cleanMessage = li.textContent.trim();
        const lowered = cleanMessage.toLowerCase();

        // Prioritize error code detection over text matching
    if (errorCode === 'duplicate_email' || 
      lowered.includes("allerede registreret") || 
      lowered.includes("already registered") ||
      lowered.includes("bereits registriert") ||
      (lowered.includes("konto") && lowered.includes("allerede")) ||
      (lowered.includes("account") && lowered.includes("already")) ||
      (lowered.includes("konto") && lowered.includes("bereits")) ||
      lowered.includes("allerede er i brug") ||
      lowered.includes("bereits vergeben")) {
          // Duplicate email error
          if (emailError) {
            emailError.textContent = cleanMessage;
            email.classList.add("invalid");
            email.setAttribute("aria-invalid", "true");
            email.focus();
          }
          showDuplicateEmailModal(email.value.trim());
        } else if (errorCode.includes('password') || 
                   lowered.includes("adgangskode") || 
                   lowered.includes("password") ||
                   lowered.includes("stemmer ikke overens") ||
                   lowered.includes("does not match")) {
          // Password-related errors
          if (pwError) {
            pwError.textContent = cleanMessage;
            password.classList.add("invalid");
            password.setAttribute("aria-invalid", "true");
            password.focus();
          }
        } else if (lowered.includes("e-mail") || lowered.includes("email")) {
          // General email errors
          if (emailError) {
            emailError.textContent = cleanMessage;
            email.classList.add("invalid");
            email.setAttribute("aria-invalid", "true");
            email.focus();
          }
        } else {
          // Fallback: show as email error (most registration failures are email-related)
          if (emailError) {
            emailError.textContent = cleanMessage;
            email.classList.add("invalid");
            email.setAttribute("aria-invalid", "true");
            email.focus();
          }
        }

        // Hide the original WooCommerce error list
        errorList.style.display = "none";
      })();

      // Prevent copying/pasting passwords to ensure manual entry (using proper event listeners)
      const preventCopyPaste = (e) => {
        e.preventDefault();
        return false;
      };
      password.addEventListener('copy', preventCopyPaste);
      password.addEventListener('paste', preventCopyPaste);
      passwordConfirm.addEventListener('copy', preventCopyPaste);
      passwordConfirm.addEventListener('paste', preventCopyPaste);

      let hasAttemptedSubmit = false;

      // Auto-focus email field - This is now handled by toggleForms
      // setTimeout(() => {
      //   try {
      //     email.focus();
      //   } catch (_) {}
      // }, 100);

      function isEmailValid(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }

      // New: Check if all required fields have content (for button state)
      function allFieldsHaveContent() {
        const vEmail = (email.value || "").trim();
        const vPassword = (password.value || "").trim();
        const vPasswordConfirm = (passwordConfirm.value || "").trim();
        return vEmail.length > 0 && vPassword.length > 0 && vPasswordConfirm.length > 0;
      }

      // New: Validate registration form fields
      function validateRegistration() {
        let ok = true;

        const vEmail = (email.value || "").trim();
        if (!vEmail) {
          emailError.textContent = "Indtast venligst din e-mailadresse.";
          email.classList.add("invalid");
          email.setAttribute("aria-invalid", "true");
          ok = false;
        } else if (!isEmailValid(vEmail)) {
          emailError.textContent = "Det ser ikke ud til at være en gyldig e-mailadresse.";
          email.classList.add("invalid");
          email.setAttribute("aria-invalid", "true");
          ok = false;
        } else {
          emailError.textContent = "";
          email.classList.remove("invalid");
          email.setAttribute("aria-invalid", "false");
        }

        const vPassword = (password.value || "").trim();
        if (!vPassword) {
          pwError.textContent = "Indtast venligst din adgangskode.";
          password.classList.add("invalid");
          password.setAttribute("aria-invalid", "true");
          ok = false;
        } else if (vPassword.length < 6) {
          pwError.textContent = "Adgangskoden skal være på mindst 6 tegn.";
          password.classList.add("invalid");
          password.setAttribute("aria-invalid", "true");
          ok = false;
        } else {
          pwError.textContent = "";
          password.classList.remove("invalid");
          password.setAttribute("aria-invalid", "false");
        }

        const vPasswordConfirm = (passwordConfirm.value || "").trim();
        if (!vPasswordConfirm) {
          pwConfirmError.textContent = "Gentag venligst din adgangskode.";
          passwordConfirm.classList.add("invalid");
          passwordConfirm.setAttribute("aria-invalid", "true");
          ok = false;
        } else if (vPassword !== vPasswordConfirm) {
          pwConfirmError.textContent = "Adgangskoderne stemmer ikke overens.";
          passwordConfirm.classList.add("invalid");
          passwordConfirm.setAttribute("aria-invalid", "true");
          ok = false;
        } else {
          pwConfirmError.textContent = "";
          passwordConfirm.classList.remove("invalid");
          passwordConfirm.setAttribute("aria-invalid", "false");
        }

        return ok;
      }

      // Initialize button as disabled
      submit.disabled = false;

      // Debounced input validation (300ms delay)
      const debouncedValidate = debounce(() => {
        // Update button state based on whether all fields have content
        submit.disabled = !allFieldsHaveContent();
        
        // If user has attempted submit, also run full validation
        if (hasAttemptedSubmit) {
          const isValid = validateRegistration(); // Use new validation function
          submit.disabled = false;
        }
      }, 300);

      email.addEventListener("input", debouncedValidate);
      password.addEventListener("input", debouncedValidate); // Listen to new password fields
      passwordConfirm.addEventListener("input", debouncedValidate); // Listen to new password fields

      // New: Caps Lock detection for registration password fields
      let regCapsLockOn = false;
      const regCapsHandler = (e) => {
        if (!caps) return;
        const isOn = e.getModifierState("CapsLock");
        if (isOn !== regCapsLockOn) {
          regCapsLockOn = isOn;
          caps.textContent = isOn ? "Die Feststelltaste ist aktiviert." : "";
        }
      };
      password.addEventListener("keyup", regCapsHandler);

      // ----- Simple Password Strength UI -----
      const pwFieldWrapper = password.closest(".field") || password.parentElement;
      if (pwFieldWrapper && !document.getElementById('reg-strength-ui')) {
        // Create the UI container (initially hidden)
        const strengthUI = document.createElement('div');
        strengthUI.id = 'reg-strength-ui';
        strengthUI.className = 'strength-ui is-hidden';
        strengthUI.setAttribute('data-strength', '0');
        strengthUI.innerHTML = `
          <div class="strength-bar">
            <div class="strength-bar-fill"></div>
          </div>
          <div class="strength-label"></div>
        `;

        // Insert after the password error div, but before the hint if it exists
        const insertAfter = pwError || password.closest('.input-wrapper') || password.parentElement;
        
        if (insertAfter && insertAfter.parentNode) {
          // If hint exists (using cached reference), insert strength UI before it
          if (existingHint) {
            insertAfter.parentNode.insertBefore(strengthUI, existingHint);
          } else {
            // Otherwise insert after the error div as usual
            insertAfter.parentNode.insertBefore(strengthUI, insertAfter.nextSibling);
          }
        }

        // Simple password strength evaluation (similar to WooCommerce's logic)
        const evaluatePasswordStrength = (password) => {
          if (!password || password.length === 0) return { level: 0, label: '' };

          let score = 0;

          // Length check
          if (password.length >= 8) score++;
          if (password.length >= 12) score++;

          // Character variety checks
          if (/[a-z]/.test(password)) score++; // lowercase
          if (/[A-Z]/.test(password)) score++; // uppercase
          if (/\d/.test(password)) score++; // numbers
          if (/[^A-Za-z0-9]/.test(password)) score++; // special characters

          // Dictionary/common password check (basic)
          const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
          if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
            score = Math.max(0, score - 2);
          }

          // Map score to WooCommerce-like levels
          let level = 0;
          let label = 'Svag';

          if (score <= 2) {
            level = 0; // short/bad
            label = 'Svag';
          } else if (score <= 4) {
            level = 1; // good
            label = 'Okay';
          } else if (score <= 6) {
            level = 2; // strong
            label = 'Stærk';
          } else {
            level = 3; // very strong
            label = 'Meget stærk';
          }

          return { level, label };
        };

        // Update strength on input (optimized with requestAnimationFrame)
        let lastValue = '';
        let lastLevel = -1;
        let rafId = null;
        
        const updateStrength = () => {
          const val = password.value || '';

          // Skip if no change
          if (val === lastValue) return;
          lastValue = val;

          if (val.length === 0) {
            if (lastLevel !== -1) {
              strengthUI.classList.add('is-hidden');
              lastLevel = -1;
            }
            return;
          }

          strengthUI.classList.remove('is-hidden');

          const result = evaluatePasswordStrength(val);

          // Only update DOM if strength level changed
          if (result.level !== lastLevel) {
            strengthUI.setAttribute('data-strength', String(result.level));
            strengthUI.querySelector('.strength-label').textContent = result.label;
            lastLevel = result.level;
          }
        };

        // Use requestAnimationFrame for smooth updates
        const throttledUpdate = () => {
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          rafId = requestAnimationFrame(() => {
            updateStrength();
            rafId = null;
          });
        };

        // Use input event only (covers all input changes including paste, etc.)
        password.addEventListener('input', throttledUpdate);

        // Initial check
        updateStrength();
      }

      // Hide/show password hint based on input (using cached reference)
      password.addEventListener('input', () => {
        if (passwordHint) {
          passwordHint.style.display = password.value.length > 0 ? 'none' : '';
        }
      });


      registerForm.addEventListener("submit", (e) => {
        hasAttemptedSubmit = true;
        validateRegistration();
        const isValid = validateRegistration(); // Use new validation function

        if (!isValid) {
          e.preventDefault();
          submit.classList.add("shake");
          setTimeout(() => {
            submit.classList.remove("shake");
            submit.disabled = false; // Re-enable for retry
          }, 300);

          // Focus the first invalid field
          if (email.classList.contains("invalid")) {
            email.focus();
          } else if (password.classList.contains("invalid")) {
            password.focus();
          } else if (passwordConfirm.classList.contains("invalid")) {
            passwordConfirm.focus();
          }
          return;
        }

        // Valid submission
        submit.disabled = true;
        submit.classList.add("is-loading");
  submit.textContent = "Konto wird erstellt…";
      });

      // Prevent Enter key when button is disabled
      registerForm.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && submit.disabled) {
          e.preventDefault();
        }
      });

      // New: Setup password visibility toggles for registration fields
      setupPasswordToggle("reg_password", "toggleRegPw", null); // No forceShowPassword for registration
      setupPasswordToggle("reg_password_confirm", "toggleRegPwConfirm", null);
    }

// =============================== //
// Login Form Handler (Remains largely the same, but now uses the utility)
// =============================== //
function handleLoginForm() {
  // 1) Nuke conflicting listeners on the submit button (fix double-click)
  let submit = document.getElementById("submit-login");
  if (submit) {
    const cleanSubmit = submit.cloneNode(true); // remove external listeners
    submit.parentNode.replaceChild(cleanSubmit, submit);
    submit = cleanSubmit; // use the clean button from here on
  }

  // 2) Grab elements
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const emailError = document.getElementById("login-email-error");
  const pwError = document.getElementById("pw-error");
  const caps = document.getElementById("caps");
  // const togglePw = document.getElementById("togglePw"); // No longer needed as it's passed to utility

  if (!username || !password || !submit || !emailError || !pwError) {
    console.warn("Login-Initialisierung: fehlende Elemente.");
    return;
  }

  // Force "Remember Me" to be checked (always on, hidden by CSS)
  const forceRememberMe = () => {
    const rememberMe = document.querySelector('input[name="rememberme"]');
    if (rememberMe) {
        rememberMe.checked = true;
    }
  };
  forceRememberMe();
  setTimeout(forceRememberMe, 500);

  // Prevent copying/pasting password to ensure manual entry (using proper event listeners)
  const preventCopyPaste = (e) => {
    e.preventDefault();
    return false;
  };
  password.addEventListener('copy', preventCopyPaste);
  password.addEventListener('paste', preventCopyPaste);

  // 3) Reposition WooCommerce server-side errors under fields
(function repositionWooCommerceErrors() {
  const errorList = document.querySelector(".woocommerce-error");
  if (!errorList) return;

  const li = errorList.querySelector("li");
  if (!li) return;

  // Get clean text only
  const cleanMessage = li.textContent.trim();
  const lowered = cleanMessage.toLowerCase();

  // Define keyword sets (Danish + a couple English fallbacks)
  const pwKeywords = [
    "adgangskode",
    "password",
    "kodeord",
    "forkert adgangskode",
    "fejl: den adgangskode",
    "adgangskoden, som du indtastede",
    "er forkert",
    // Keep German just in case legacy errors appear
    "passwort",
    "falsches passwort",
    "passwörter stimmen nicht überein",
  ];
  const userKeywords = [
    "brugernavn",
    "findes ikke",
    "ukendt bruger",
    "unknown user",
    // Keep German just in case legacy errors appear
    "benutzername",
    "existiert nicht",
  ];

  // Helper to detect any keyword
  const hasAny = (text, arr) => arr.some((k) => text.includes(k));

  // Prefer classifying as password error first
  if (hasAny(lowered, pwKeywords)) {
    // Password error
    if (pwError) {
      pwError.textContent = cleanMessage;
      password.classList.add("invalid");
      password.setAttribute("aria-invalid", "true");
      // Focus password unless username is empty/invalid
      if (!username.value.trim()) {
        username.classList.add("invalid");
        username.setAttribute("aria-invalid", "true");
        emailError.textContent = "Indtast venligst dit brugernavn eller din e-mailadresse.";
        username.focus();
      } else {
        password.focus();
      }
    }
  } else if (hasAny(lowered, userKeywords)) {
    // Username/email error
    if (emailError) {
      emailError.textContent = cleanMessage;
      username.classList.add("invalid");
      username.setAttribute("aria-invalid", "true");
      username.focus();
    }
  } else {
    // Fallback: show as general form error under password (most login failures)
    if (pwError) {
      pwError.textContent = cleanMessage;
      password.classList.add("invalid");
      password.setAttribute("aria-invalid", "true");
    }
  }

  // Hide the original WooCommerce error list
  errorList.style.display = "none";
})();

  // 4) Ensure password field is visible (in case a plugin hides it)
  const passwordWrapper = password.closest(".input-wrapper");
  let showAttempts = 0;
  const maxShowAttempts = 3;

  const forceShowPassword = () => {
    if (showAttempts++ >= maxShowAttempts) return;
    try {
      if (passwordWrapper) {
        passwordWrapper.style.cssText = "display: flex !important;";
      }
      password.style.cssText = "display: block !important;";
    } catch (e) {}
  };

  forceShowPassword();
  setTimeout(forceShowPassword, 100);
  setTimeout(forceShowPassword, 300);

  // 5) Validation
  let hasAttemptedSubmit = false;

  function isEmailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function validate() {
    let ok = true;

    const v = (username.value || "").trim();
    if (!v) {
  emailError.textContent = "Indtast venligst dit brugernavn eller din e-mailadresse.";
      username.classList.add("invalid");
      username.setAttribute("aria-invalid", "true");
      ok = false;
    } else if (v.includes("@") && !isEmailValid(v)) {
      emailError.textContent = "Det ligner ikke en gyldig e-mail.";
      username.classList.add("invalid");
      username.setAttribute("aria-invalid", "true");
      ok = false;
    } else {
      emailError.textContent = "";
      username.classList.remove("invalid");
      username.setAttribute("aria-invalid", "false");
    }

    if (!password.value) {
  pwError.textContent = "Indtast venligst din adgangskode.";
      password.classList.add("invalid");
      password.setAttribute("aria-invalid", "true");
      ok = false;
    } else if (password.value.length < 6) {
  pwError.textContent = "Adgangskoden skal være på mindst 6 tegn.";
      password.classList.add("invalid");
      password.setAttribute("aria-invalid", "true");
      ok = false;
    } else {
      pwError.textContent = "";
      password.classList.remove("invalid");
      password.setAttribute("aria-invalid", "false");
    }

    return ok;
  }

  // 6) Submit handler
  loginForm.addEventListener("submit", (e) => {
    // Ensure remember me is checked before submit
    forceRememberMe();

    hasAttemptedSubmit = true;
    const isValid = validate();

    if (!isValid) {
      e.preventDefault();
      submit.classList.add("shake");
      setTimeout(() => {
        submit.classList.remove("shake");
        submit.disabled = false; // allow immediate retry
      }, 300);

      if (username.classList.contains("invalid")) {
        username.focus();
      } else if (password.classList.contains("invalid")) {
        password.focus();
      }
      return;
    }

    submit.disabled = true;
    submit.classList.add("is-loading");
  submit.textContent = "Logger ind…";
  });

  // 7) Debounced real-time validation after first attempt
  const revalidateOnInput = debounce(() => {
    if (hasAttemptedSubmit) {
      const isValid = validate();
      submit.disabled = !isValid;
    }
  }, 300);

  username.addEventListener("input", revalidateOnInput);
  password.addEventListener("input", revalidateOnInput);

  // 8) Caps Lock detection (keyup only; avoids duplicate work)
  let capsLockOn = false;
  const capsHandler = (e) => {
    if (!caps) return;
    const isOn = e.getModifierState("CapsLock");
    if (isOn !== capsLockOn) {
      capsLockOn = isOn;
  caps.textContent = isOn ? "Caps Lock er slået til." : "";
    }
  };
  password.addEventListener("keyup", capsHandler);

  // 9) Password visibility toggle (now using the utility function)
  setupPasswordToggle("password", "togglePw", forceShowPassword);


  // 10) Prevent Enter when submit is disabled
  loginForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && submit.disabled) {
      e.preventDefault();
    }
  });

  // 11) Move "Forgot Password" link under the "Log ind" button
  const forgotLink = document.getElementById('forgot-link');
  if (forgotLink && submit) {
    // Insert after the submit button
    submit.insertAdjacentElement('afterend', forgotLink);
  }
}
  } catch (err) {
    console.error("Form JS error:", err);
  }

  /* 
   * FIX: Ensure clicking outside inputs blurs them.
   * Logic: If the user clicks (mousedown) on something that isn't an input/button/label/wrapper,
   * we force the active input to blur. This overrides any "focus trap" or sticky focus behavior.
   */
  document.addEventListener('mousedown', (e) => {
    const active = document.activeElement;
    // Only care if an input is currently focused
    if (!active || active.tagName !== 'INPUT') return;

    // Check if the click target is "interactive" or part of the form field
    const isInteractive = e.target.closest('input, button, a, label, .reveal-btn, .input-wrapper, .input-icon-container');

    // If we clicked "background" or "blank space", blur the input
    if (!isInteractive) {
      active.blur();
    }
  });

}); // closes DOMContentLoaded

// =============================================================================
// MAGIC LINK — view toggle + AJAX submission
// Runs after DOMContentLoaded in its own listener so it has access to the
// already-rendered WooCommerce forms without touching the existing code above.
//
// Supports two layouts:
//   NEW  — two-column .mb-login-wrapper (standard my-account page)
//   OLD  — single .card with toggled views (checkout gate)
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const data = window.mybasicsLoginData;
  if (!data || !data.magicLinkEnabled) return;

  const magicLinkForm = document.getElementById('magic-link-form');
  if (!magicLinkForm) return;

  const loginForm    = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const mlRequest    = document.getElementById('magic-link-request');
  const mlSuccess    = document.getElementById('magic-link-success');
  const mlEmailInput = document.getElementById('magic-link-email');
  const mlSubmitBtn  = document.getElementById('magic-link-submit');
  const mlErrorEl    = document.getElementById('magic-link-error');

  const newLayout = document.querySelector('.mb-login-wrapper');

  if (newLayout) {
    setupNewLayout();
  } else {
    setupOldLayout();
  }

  setupMagicLinkAjax();

  // Helper: show or hide an element using is-visible / is-hidden classes
  function setVisible(el, show) {
    if (!el) return;
    el.classList.toggle('is-visible', show);
    el.classList.toggle('is-hidden', !show);
    el.setAttribute('aria-hidden', String(!show));
  }

  // Helper: reset magic link form to initial request state
  function resetMagicLinkForm() {
    if (mlRequest) mlRequest.classList.remove('is-hidden');
    if (mlSuccess) mlSuccess.classList.add('is-hidden');
    if (mlErrorEl) mlErrorEl.textContent = '';
  }

  // ---------------------------------------------------------------------------
  // NEW TWO-COLUMN LAYOUT
  // ---------------------------------------------------------------------------
  function setupNewLayout() {
    const colLeft         = newLayout.querySelector('.mb-col-left');
    const colRight        = newLayout.querySelector('.mb-col-right');
    const showRegisterBtn = document.getElementById('mb-show-register');
    const customerLogin   = document.getElementById('customer_login');

    // 0. Hide theme card header and membership elements
    //    (CSS :has() handles modern browsers; this is the JS fallback for older ones)
    const outerCard = newLayout.closest('.card');
    if (outerCard) {
      const toHide = [
        outerCard.querySelector(':scope > header'),
        outerCard.querySelector('.perk'),
        outerCard.querySelector('.membership-pitch'),
        outerCard.querySelector('.membership-toggle'),
        outerCard.querySelector('.membership-offer'),
      ];
      toHide.forEach(el => { if (el) el.style.display = 'none'; });
      // Neutralise card chrome (box-shadow, padding, max-width, background)
      outerCard.style.cssText += ';background:transparent!important;border:none!important;' +
        'box-shadow:none!important;padding:0!important;max-width:100%!important;' +
        'width:100%!important;animation:none!important;border-radius:0!important;';
    }

    // 1. Move WooCommerce forms out of their wrapper into the correct columns
    if (colLeft && loginForm && customerLogin) {
      colLeft.insertBefore(loginForm, customerLogin);
    }
    if (colRight && registerForm && showRegisterBtn) {
      colRight.insertBefore(registerForm, showRegisterBtn);
    }

    // 2. Move magic-link-form into left column (before login form)
    if (colLeft && loginForm) {
      colLeft.insertBefore(magicLinkForm, loginForm);
    } else if (colLeft) {
      colLeft.appendChild(magicLinkForm);
    }

    // 3. Remove now-empty WooCommerce wrapper
    if (customerLogin) customerLogin.remove();

    // 4. Set initial visibility: magic link shown, login + register hidden
    setVisible(magicLinkForm, true);
    setVisible(loginForm, false);
    setVisible(registerForm, false);

    // 5. Reset magic-link form to request state
    resetMagicLinkForm();

    // 6. If #register hash or server-side registration errors, reveal register form
    const showRegisterInit = window.showRegistrationForm || window.location.hash === '#register';
    if (showRegisterInit && showRegisterBtn && registerForm) {
      showRegisterBtn.style.display = 'none';
      setVisible(registerForm, true);
    }

    // 7. "Tilmeld mig & Shop nu" — reveal register form
    if (showRegisterBtn && registerForm) {
      showRegisterBtn.addEventListener('click', () => {
        showRegisterBtn.style.display = 'none';
        setVisible(registerForm, true);
        const firstInput = registerForm.querySelector('input:not([type=hidden])');
        if (firstInput) setTimeout(() => firstInput.focus(), 50);
      });
    }

    // 8. "Jeg vil hellere logge ind med kodeord" — switch to password login
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('.mb-use-password-link');
      if (!anchor) return;
      e.preventDefault();
      setVisible(magicLinkForm, false);
      setVisible(loginForm, true);
      const firstInput = loginForm && loginForm.querySelector('input:not([type=hidden])');
      if (firstInput) setTimeout(() => firstInput.focus(), 50);
    });

    // 9. Back link inside magic-link form — return to magic link view
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('#magic-link-form .magic-link-back');
      if (!anchor) return;
      e.preventDefault();
      setVisible(loginForm, false);
      setVisible(magicLinkForm, true);
      resetMagicLinkForm();
    });
  }

  // ---------------------------------------------------------------------------
  // OLD SINGLE-CARD LAYOUT  (checkout gate etc.)
  // ---------------------------------------------------------------------------
  function setupOldLayout() {
    const authTitle       = document.getElementById('auth-title');
    const authSubtitle    = document.querySelector('.card .subtitle');
    const perkContainer   = document.querySelector('.card .perk');
    const membershipPitch = document.querySelector('.membership-pitch');

    // Move magic-link-form inside the card
    const card = document.querySelector('.card');
    if (card) card.appendChild(magicLinkForm);

    // Inject "Log ind uden adgangskode" link below the login button
    if (loginForm) {
      const loginBtn = loginForm.querySelector('.btn-primary');
      if (loginBtn) {
        const toggleWrap = document.createElement('p');
        toggleWrap.className = 'magic-link-toggle-wrap';
        toggleWrap.innerHTML = '<a href="#magic-link" class="magic-link-link">Log ind uden adgangskode &rarr;</a>';
        loginBtn.after(toggleWrap);
      }
    }

    function showMagicLinkView() {
      setVisible(loginForm, false);
      setVisible(registerForm, false);
      setVisible(magicLinkForm, true);

      if (authTitle)       authTitle.textContent    = 'Log ind uden adgangskode';
      if (authSubtitle)    authSubtitle.textContent = 'Indtast din e-mailadresse, s\u00e5 sender vi dig et loginlink.';
      if (perkContainer)   { perkContainer.classList.add('is-hidden'); perkContainer.innerHTML = ''; }
      if (membershipPitch) membershipPitch.classList.add('is-hidden');

      resetMagicLinkForm();
      if (mlEmailInput) { mlEmailInput.value = ''; setTimeout(() => mlEmailInput.focus(), 50); }
    }

    function hideMagicLinkView() {
      setVisible(magicLinkForm, false);
      setVisible(loginForm, true);
      setVisible(registerForm, false);
      if (authTitle && data.texts)    authTitle.textContent    = data.texts.loginTitle    || 'Log ind';
      if (authSubtitle && data.texts) authSubtitle.textContent = data.texts.loginSubtitle || '';
      if (membershipPitch) membershipPitch.classList.remove('is-hidden');
    }

    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href="#magic-link"]');
      if (!anchor) return;
      e.preventDefault();
      showMagicLinkView();
    });

    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('#magic-link-form a[href="#login"]');
      if (!anchor) return;
      e.preventDefault();
      hideMagicLinkView();
    });
  }

  // ---------------------------------------------------------------------------
  // Shared AJAX submission
  // ---------------------------------------------------------------------------
  function setupMagicLinkAjax() {
    if (!mlSubmitBtn) return;

    mlSubmitBtn.addEventListener('click', () => {
      const email = mlEmailInput ? mlEmailInput.value.trim() : '';
      if (!email) {
        if (mlErrorEl) mlErrorEl.textContent = 'Indtast venligst din e-mailadresse.';
        return;
      }

      mlSubmitBtn.classList.add('is-loading');
      mlSubmitBtn.disabled = true;
      if (mlErrorEl) mlErrorEl.textContent = '';

      const formData = new FormData();
      formData.append('action', 'mybasics_send_magic_link');
      formData.append('nonce',  data.magicLinkNonce);
      formData.append('email',  email);

      fetch(data.ajaxUrl, { method: 'POST', body: formData })
        .then(r => r.json())
        .then(resp => {
          if (resp.success) {
            if (mlRequest) mlRequest.classList.add('is-hidden');
            if (mlSuccess) mlSuccess.classList.remove('is-hidden');
          } else {
            if (mlErrorEl) mlErrorEl.textContent = (resp.data && resp.data.message) || 'Noget gik galt. Pr\u00f8v igen.';
          }
        })
        .catch(() => {
          if (mlErrorEl) mlErrorEl.textContent = 'Noget gik galt. Pr\u00f8v igen.';
        })
        .finally(() => {
          mlSubmitBtn.classList.remove('is-loading');
          mlSubmitBtn.disabled = false;
        });
    });

    if (mlEmailInput) {
      mlEmailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); mlSubmitBtn.click(); }
      });
    }
  }
});