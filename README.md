# MyBasics Custom Login

A comprehensive WordPress/WooCommerce plugin that completely transforms the login and registration experience with advanced form validation, password strength indicators, duplicate email detection, and a streamlined checkout flow. Version 2.2.

## Overview

This plugin provides a modern, user-friendly authentication system for WooCommerce with enhanced security features, real-time validation, and Danish localization. It includes a custom "Checkout Gate" interface that gives users a clear choice between guest checkout and account creation.

## Features

### 1. Custom Login/Registration Forms

#### Interactive Form Switching

- **Seamless Transitions**: Smooth animations when switching between login and registration forms without page reload
- **Hash-based Navigation**: URL hash tracking (`#login` / `#register`) with browser history support
- **Dynamic Content**: Form-specific headings, subtitles, and calls-to-action that update contextually
- **Smart Focus Management**: Automatically focuses the first input field when switching forms

#### Real-time Form Validation

- **Instant Feedback**: Debounced validation (300ms) as users type
- **Email Validation**: Advanced regex pattern matching for valid email addresses
- **Password Requirements**: Minimum 6 characters with clear error messaging
- **Visual Indicators**: Invalid fields are highlighted with red borders and error icons
- **Accessibility**: ARIA attributes (`aria-invalid`, `aria-label`) for screen readers

#### Advanced Password Features

- **Password Strength Meter**: Real-time strength indicator (Weak, Okay, Strong, Very Strong) with color-coded progress bar
- **Password Visibility Toggle**: Eye icon buttons to show/hide password fields
- **Caps Lock Detection**: Warns users when Caps Lock is active
- **Copy/Paste Protection**: Prevents password copying and pasting for security
- **Confirmation Matching**: Validates that password and confirmation fields match

#### Enhanced User Experience

- **Loading States**: Animated spinner on submit buttons during form submission
- **Smart Button States**: Submit button disabled until all required fields are filled
- **Shake Animation**: Visual feedback when validation fails on submit
- **Remember Me Toggle**: Custom-styled checkbox for persistent login
- **Forgot Password Link**: Direct access to password recovery
- **Responsive Layout**: Optimized for all screen sizes (desktop, tablet, mobile)

### 2. Duplicate Email Detection System

#### Smart Email Conflict Handling

- **Server-side Detection**: Catches duplicate email registrations from WooCommerce
- **Custom Modal Dialog**: Beautiful, accessible modal with clear messaging
- **Prefill Login Form**: One-click switch to login with the duplicate email already filled
- **Alternative Actions**: Option to try again with a different email
- **Keyboard Support**: Close modal with ESC key
- **Auto-cleanup**: Removes server-side error messages when modal is shown

### 3. Email-Only Registration System

#### Simplified Account Creation

- **Auto-generated Usernames**: Creates usernames from email addresses (e.g., `user@example.com` → `user`, `user1`, etc.)
- **User-Set Passwords**: Allows users to choose their own passwords (no auto-generated passwords)
- **Username Collision Handling**: Automatically increments usernames to avoid conflicts
- **Email Verification**: Built-in email validation before account creation
- **New Account Emails**: Sends WooCommerce "New Account" emails to customers

### 4. Checkout Gate Experience

#### Pre-Checkout Decision Point

- **Two-Column Layout**: Clean separation of Guest Checkout (left) and Login/Registration (right) on desktop
- **Guest Benefits Display**: Clear list of guest checkout advantages with checkmark icons
- **Birkenstock-Inspired Design**: Minimalist, professional aesthetic with subtle shadows
- **Responsive Breakpoint**: Stacks vertically on screens < 850px
- **Mobile Optimization**: Hides non-essential text on mobile to reduce clutter
- **"ODER" Separator**: Visual divider between options on mobile

#### Smart Redirect Logic

- **Checkout Parameter Tracking**: Uses `?checkout=1` URL parameter to identify checkout flow
- **Post-Login Redirect**: Automatically sends users to checkout after successful login
- **Post-Registration Redirect**: Redirects new accounts to checkout immediately after signup
- **Guest Bypass**: Direct path to checkout with `?guest=1` parameter
- **Session Management**: Cleans up temporary flags after use

### 5. Security & Validation

#### Nonce Verification

- **Login Nonce**: Server-side validation of login form submissions
- **Registration Nonce**: Validates registration form security tokens
- **AJAX Security**: Localized nonce data for JavaScript interactions
- **Error Messaging**: Clear Danish error messages for failed nonce checks

#### Server-side Validation

- **Password Length**: Enforces minimum 6-character passwords
- **Password Matching**: Validates password confirmation on the server
- **Email Uniqueness**: Checks for duplicate email addresses
- **Sanitization**: Cleans user input before processing

#### Client-side Protection

- **XSS Prevention**: Escapes user input in modal dialogs
- **Input Validation**: Prevents empty/invalid submissions
- **Rate Limiting**: Debounced validation to reduce server load

### 6. Visual Design System

#### Design Tokens (CSS Variables)

- **Brand Colors**: `--brand-600`, `--brand-500`, `--brand-400`
- **Ink Palette**: `--ink-900` through `--ink-200` for text/UI
- **Background**: `--bg-100`, `--white`
- **Border Radius**: `--radius-lg`, `--radius-md`, `--radius-sm`
- **Shadows**: `--shadow-lg`, `--shadow-md`, `--focus`

#### Custom Styling

- **Card Component**: Modal-style card with backdrop blur and subtle shadows
- **Rise Animation**: Smooth entry animation for the login card (380ms)
- **Custom Buttons**: Primary button with hover states and loading indicators
- **Form Fields**: Clean inputs with focus states and error styling
- **Toggle Switch**: Custom "Remember Me" checkbox design
- **Error Messages**: Colored alert boxes with icons

#### Background Management

- **Hero Background**: WebP image background with specific positioning
- **Checkout Gate Override**: Automatically hides background on checkout gate page
- **White Background**: Forces `#ffffff` background when checkout gate is active
- **CSS :has() Selector**: Modern CSS with JavaScript fallback for browser compatibility

### 7. Google Fonts Integration

- **Inter Font Family**: Weights 400, 500, 600, 700
- **Performance Optimization**: Preconnect headers for faster font loading
- **Display Swap**: Uses `display=swap` to prevent FOIT (Flash of Invisible Text)

### 8. Danish Localization

#### Complete Translation Coverage

- **Form Labels**: "E-mailadresse", "Adgangskode", "Gentag adgangskode"
- **Button Text**: "Log ind", "Opret konto", "FORTSÆT SOM GÆST"
- **Error Messages**: All validation errors in Danish
- **Password Strength**: "Svag", "Okay", "Stærk", "Meget stærk"
- **Caps Lock Warning**: "Caps Lock er slået til."
- **Duplicate Email Modal**: Complete Danish messaging
- **Loading States**: "Logger ind...", "Opretter konto..."

### 9. Mobile Responsiveness

#### Breakpoint Strategy

- **Desktop**: 850px+ (two-column checkout gate)
- **Mobile**: < 850px (stacked layout)
- **Small Mobile**: < 520px (compact spacing, hidden hero)

#### Mobile Optimizations

- **Input Font Size**: 16px to prevent iOS zoom
- **Touch Targets**: Minimum 50px height on buttons
- **Tighter Padding**: Reduced spacing on small screens
- **Hidden Elements**: Guest benefits and subtitle hidden on mobile
- **Separator Display**: "ODER" divider shown only on mobile

### 10. Accessibility Features

- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Logical tab order and focus indicators
- **Error Announcements**: Screen reader-friendly error messages
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **High Contrast**: Sufficient color contrast ratios
- **Focus Rings**: Visible focus states for keyboard users

## Installation

1. **Upload Plugin Files**

   ```
   /wp-content/plugins/mybasics-custom-login/
   ├── mybasics-custom-login.php
   ├── mybasics-custom-login.css
   ├── mybasics-custom-login.js
   └── assets/
       └── TredjeIterationBaggrundsbillede.webp
   ```

2. **Activate Plugin**

   - Go to WordPress Admin → Plugins
   - Find "MyBasics Custom Page Login/Registration"
   - Click "Activate"

3. **WooCommerce Settings** (Handled Automatically)
   - ✅ My account registration: Enabled
   - ✅ Username generation: Enabled (from email)
   - ✅ Password generation: Disabled (user sets password)
   - ✅ Customer new account email: Enabled

## File Structure

### `mybasics-custom-login.php` (302 lines)

**Main Plugin File**

- **Header**: Plugin metadata (Name, Version 2.2, Author, Description)
- **Script Enqueuing**: CSS, JS, and Google Fonts with cache-busting via `filemtime()`
- **Preconnect Headers**: Performance optimization for Google Fonts
- **Registration Filters**: Email-only registration, auto-username, user-set passwords
- **Redirect Logic**: Checkout gate redirects for login and registration
- **Username Generation**: Email-to-username conversion with collision handling
- **Server Validation**: Password length, matching, duplicate email detection
- **Nonce Verification**: Security checks for login and registration
- **Session Management**: Registration error flags with timestamp-based cleanup
- **Checkout Gate Injection**: HTML injection via `woocommerce_before_customer_login_form`
- **Logout Fix**: Custom logout handling to avoid wp-login.php screen

### `mybasics-custom-login.css` (1,317 lines)

**Comprehensive Styling**

- **Design Tokens**: CSS custom properties for colors, spacing, shadows
- **Base Styles**: Reset, typography, links
- **Hero Layout**: Full-height background with positioned card
- **Checkout Gate**: Two-column layout with responsive breakpoints
- **Card Component**: Modal-style container with backdrop blur
- **Form Styles**: Inputs, labels, error messages, hints
- **Password Features**: Toggle buttons, strength meter, caps lock warning
- **Button Styles**: Primary button with loading states
- **Error Handling**: Inline errors with icons and animations
- **Duplicate Email Modal**: Full modal dialog styling
- **Responsive Design**: Media queries for desktop, tablet, mobile
- **Animations**: Rise, slideDown, fadeIn, modalSlideIn, spin, shake

### `mybasics-custom-login.js` (1,075 lines)

**Advanced Client-side Logic**

- **Form Switching**: Toggle between login and registration with dynamic content
- **Password Toggle**: Show/hide password utility function
- **External Validation Killer**: Removes conflicting jQuery Validate plugin
- **Login Form Handler**: Validation, caps lock detection, submit handling
- **Registration Form Handler**: Email validation, password strength, confirmation matching
- **Duplicate Email Modal**: Modal creation, event handlers, email prefill
- **Password Strength**: Real-time evaluation with color-coded progress bar
- **Error Repositioning**: Moves WooCommerce server errors to custom inline positions
- **Debounce Utility**: Optimized real-time validation with 300ms delay
- **Caps Lock Detection**: Warns users on both login and registration
- **Loading States**: Button animations during form submission
- **Copy/Paste Protection**: Prevents password field copy/paste
- **Session Restoration**: Shows registration form if server-side errors exist
- **Hash Navigation**: Browser back/forward button support
- **Focus Management**: Auto-focus on form switch

### `assets/TredjeIterationBaggrundsbillede.webp`

**Background Image**

- WebP format for optimal compression
- Used as hero section background
- Hidden on checkout gate page
- Positioned at `center -17px`

## Customization Guide

### Changing Colors

Edit CSS variables in [`mybasics-custom-login.css`](mybasics-custom-login.css):

```css
:root {
  --brand-600: #2c4cff; /* Primary brand color */
  --ink-900: #0b1220; /* Dark text */
  --white: #ffffff; /* Backgrounds */
}
```

### Modifying Validation Rules

Edit [`mybasics-custom-login.php`](mybasics-custom-login.php):

```php
// Change minimum password length (line ~165)
} elseif ( strlen( $password ) < 6 ) {
  $errors->add( 'password_length', __( 'Password must be at least 6 characters.', 'woocommerce' ) );
}
```

### Adjusting Mobile Breakpoint

Edit [`mybasics-custom-login.css`](mybasics-custom-login.css):

```css
/* Change from 850px to your preferred breakpoint */
@media (max-width: 849px) {
  .checkout-gate-wrapper {
    /* Mobile styles */
  }
}
```

### Redirect URLs

Edit [`mybasics-custom-login.php`](mybasics-custom-login.php):

```php
// Change checkout redirect (line ~229)
add_action('template_redirect', function() {
  if (is_checkout() && !is_user_logged_in() && !isset($_GET['guest'])) {
    wp_safe_redirect(add_query_arg('checkout', '1', wc_get_page_permalink('myaccount')));
    exit;
  }
});
```

### Translating to Another Language

Replace German strings in [`mybasics-custom-login.php`](mybasics-custom-login.php) and [`mybasics-custom-login.js`](mybasics-custom-login.js):

**PHP Example:**

```php
$errors->add( 'password_empty', __( 'Please enter a password.', 'woocommerce' ) );
```

**JS Example:**

```javascript
authTitle.innerHTML = showRegister ? "Create Account" : "Login";
```

## Browser Compatibility

- **Chrome/Edge**: ✅ Full support (all features)
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (with `:has()` polyfill)
- **Mobile Safari**: ✅ Optimized (16px inputs to prevent zoom)
- **IE11**: ❌ Not supported (modern CSS/JS required)

## Performance Optimizations

1. **Debounced Validation**: 300ms delay to reduce CPU usage
2. **RequestAnimationFrame**: Smooth password strength updates
3. **CSS `will-change`**: Hardware acceleration for animations
4. **Font Preconnect**: Faster Google Fonts loading
5. **Cache Busting**: `filemtime()` for CSS/JS versioning
6. **Lazy Validation**: Only validates after first submit attempt
7. **Event Delegation**: Minimal event listeners
8. **Single Modal Instance**: Reuses duplicate email modal

## Security Considerations

- ✅ Nonce verification on all form submissions
- ✅ Server-side password validation (minimum length, matching)
- ✅ Email uniqueness checks
- ✅ CSRF protection via WordPress nonces
- ✅ Input sanitization (`sanitize_user`, `trim`)
- ✅ No passwords in client-side storage
- ✅ Copy/paste protection on password fields
- ⚠️ Consider adding rate limiting for login attempts
- ⚠️ Consider implementing 2FA for enhanced security

## Known Limitations

1. **Password Strength Dictionary**: Basic common password check (limited word list)
2. **Email Provider Validation**: Does not verify if email domain exists
3. **Username Generation**: Limited to 999 collision attempts
4. **Session Cleanup**: 5-minute timeout for registration error flags
5. **Browser Support**: Requires modern browser (no IE11)

## Troubleshooting

### Forms Not Appearing

- Check that WooCommerce is installed and activated
- Verify you're on the My Account page (`/my-account/`)
- Clear browser cache and hard reload

### Checkout Gate Not Showing

- Ensure you're accessing checkout while logged out
- Check for `?checkout=1` parameter in URL
- Verify `is_checkout()` returns true

### Validation Not Working

- Check browser console for JavaScript errors
- Verify jQuery is loaded
- Ensure no plugin conflicts (try disabling other form plugins)

### Styles Look Wrong

- Check CSS file is enqueued (view page source)
- Clear WordPress caches
- Check for theme CSS conflicts

## Credits

- **Author**: Ahmed
- **Version**: 2.2
- **Design Inspiration**: Birkenstock checkout flow
- **Font**: Inter (Google Fonts)
- **Framework**: WordPress 5.x+, WooCommerce 5.x+

## License

This plugin is proprietary software developed for MyBasics.
