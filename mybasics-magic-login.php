<?php
/**
 * Plugin Name: MyBasics Magic Link Login
 * Description: Passwordless magic-link login for WooCommerce. Based on mybasics-custom-login. Work in progress – staging only.
 * Version: 0.1.0
 * Author: Ahmed & Jesper
 * Text Domain: mybasics-magic-login
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

// Include Settings Page
require_once plugin_dir_path( __FILE__ ) . 'includes/admin-settings.php';

/**
 * Enqueue CSS + JS
 */
add_action( 'wp_enqueue_scripts', function () {
  if ( function_exists( 'is_account_page' ) && ( is_account_page() || is_wc_endpoint_url() ) ) {
    wp_enqueue_style(
      'mybasics-google-fonts',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      [],
      null
    );

    wp_enqueue_style(
      'mybasics-magic-login-style',
      plugin_dir_url( __FILE__ ) . 'mybasics-magic-login.css',
      [],
      file_exists( plugin_dir_path( __FILE__ ) . 'mybasics-magic-login.css' )
        ? filemtime( plugin_dir_path( __FILE__ ) . 'mybasics-magic-login.css' )
        : '0.1.0'
    );

    wp_enqueue_script(
      'mybasics-magic-login-script',
      plugin_dir_url( __FILE__ ) . 'mybasics-magic-login.js',
      [],
      file_exists( plugin_dir_path( __FILE__ ) . 'mybasics-magic-login.js' )
        ? filemtime( plugin_dir_path( __FILE__ ) . 'mybasics-magic-login.js' )
        : '0.1.0',
      true
    );
    
    // Retrieve options for JS
    $options = get_option( 'mybasics_settings' );
    $texts = array(
        'loginTitle' => isset($options['auth_login_title']) && !empty($options['auth_login_title']) ? $options['auth_login_title'] : 'Log ind',
        'registerTitle' => isset($options['auth_register_title']) && !empty($options['auth_register_title']) ? $options['auth_register_title'] : 'Bliv medlem',
        'loginSubtitle' => isset($options['auth_login_subtitle']) && !empty($options['auth_login_subtitle']) ? $options['auth_login_subtitle'] : 'Få adgang til dine størrelser, dine produkter og din købshistorik – og bestil endnu hurtigere!',
        'registerSubtitle' => isset($options['auth_register_subtitle']) && !empty($options['auth_register_subtitle']) ? $options['auth_register_subtitle'] : 'Opret din konto og få adgang til din størrelse, dine produkter og din købshistorik. Du kan også bruge dine point til at prøve spændende nye produkter!',
        'registerPerk' => isset($options['auth_register_perk']) && !empty($options['auth_register_perk']) ? $options['auth_register_perk'] : 'Du får 5 point for din tilmelding.',
    );

    // Pass security nonce to JavaScript
    wp_localize_script( 'mybasics-magic-login-script', 'mybasicsLoginData', array(
      'nonce'            => wp_create_nonce( 'mybasics_form_switch' ),
      'magicLinkNonce'   => wp_create_nonce( 'mybasics_magic_link' ),
      'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
      'magicLinkEnabled' => ( isset( $options['enable_magic_link'] ) ? $options['enable_magic_link'] : '1' ) === '1',
      'texts'            => $texts
    ));
  }
});

/**
 * Add preconnect for Google Fonts (Performance optimization)
 */
add_action( 'wp_head', function() {
  if ( function_exists( 'is_account_page' ) && ( is_account_page() || is_wc_endpoint_url() ) ) {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
  }
}, 1 );

/**
 * 🔹 Registration Logic: Email-only, auto-generated username + password (modified for user-set password)
 */

// Always enable registration on My Account page
add_filter( 'pre_option_woocommerce_enable_myaccount_registration', function() {
  return 'yes';
}, 9999 );

// Force Woo to generate username from email
add_filter( 'pre_option_woocommerce_registration_generate_username', function() {
  return 'yes';
}, 9999 );

// *** IMPORTANT CHANGE: DO NOT FORCE WOO TO GENERATE PASSWORD ***
// We will allow the user to set their own password directly on the form.
// We remove the filter that forces woocommerce_registration_generate_password to 'yes'.
// The default behavior for 'woocommerce_registration_generate_password' if left unchecked in settings is 'no',
// which means WooCommerce will look for a 'password' field in the $_POST data.
// If your WooCommerce settings are explicitly set to "Automatically generate a password",
// you might need to actively unset that option or use `return 'no';` here.
// For robust control, we will explicitly set it to 'no'.
add_filter( 'pre_option_woocommerce_registration_generate_password', function() {
  return 'no';
}, 9999 );


// Ensure "Customer New Account" email is always enabled (still useful, but password link won't be in it)
add_filter( 'woocommerce_email_enabled_customer_new_account', '__return_true', 9999 );

// Redirect after register - go to checkout if coming from checkout gate
add_filter( 'woocommerce_registration_redirect', function( $redirect ) {
  $options = get_option( 'mybasics_settings' );
  $enable_gate = isset($options['enable_checkout_gate']) ? $options['enable_checkout_gate'] : '1';
  
  if ( ! $enable_gate ) {
      return $redirect;
  }

  // Check if user came from checkout gate (via referrer or session)
  $referer = wp_get_referer();
  if ( $referer && strpos( $referer, 'checkout=1' ) !== false ) {
    return wc_get_checkout_url();
  }
  
  // Also check if the current request has checkout parameter
  if ( isset( $_POST['_wp_http_referer'] ) && strpos( sanitize_text_field( wp_unslash( $_POST['_wp_http_referer'] ) ), 'checkout=1' ) !== false ) {
    return wc_get_checkout_url();
  }
  
  // Default: redirect to my account
  return wc_get_page_permalink( 'myaccount' );
});

// Redirect after login - go to checkout if coming from checkout gate
add_filter( 'woocommerce_login_redirect', function( $redirect, $user ) {
  $options = get_option( 'mybasics_settings' );
  $enable_gate = isset($options['enable_checkout_gate']) ? $options['enable_checkout_gate'] : '1';
  
  if ( ! $enable_gate ) {
      return $redirect;
  }

  // Check if user came from checkout gate (via referrer)
  $referer = wp_get_referer();
  if ( $referer && strpos( $referer, 'checkout=1' ) !== false ) {
    return wc_get_checkout_url();
  }
  
  // Also check if the current request has checkout parameter in the referrer
  if ( isset( $_POST['_wp_http_referer'] ) && strpos( sanitize_text_field( wp_unslash( $_POST['_wp_http_referer'] ) ), 'checkout=1' ) !== false ) {
    return wc_get_checkout_url();
  }
  
  // Default behavior
  return $redirect;
}, 10, 2 );

// Ensure username is set from email before customer creation
add_filter( 'woocommerce_new_customer_data', function( $customer_data ) {
  // If username is empty, generate from email
  if ( empty( $customer_data['user_login'] ) && ! empty( $customer_data['user_email'] ) ) {
    $parts = explode( '@', $customer_data['user_email'] );
    $base  = sanitize_user( $parts[0], true );

    if ( empty( $base ) ) {
      $base = 'user';
    }

    // Find available username
    $candidate = $base;
    $counter   = 1;
    while ( username_exists( $candidate ) ) {
      $candidate = $base . $counter;
      $counter++;
    }

    $customer_data['user_login'] = $candidate;
  }

  // If a password is provided in the POST data, WooCommerce will use it.
  // We don't need to explicitly add it here if the form field name is 'password'.
  return $customer_data;
}, 10, 1 );

// Add server-side validation for the new password field during registration
add_filter( 'woocommerce_registration_errors', function( $errors, $username, $email ) {
    if ( isset( $_POST['register'] ) ) { // Only apply for registration submissions
        // Check for duplicate email with specific error code
    if ( email_exists( $email ) ) {
      $errors->add( 'duplicate_email', mybasics_get_option( 'error_duplicate_email', 'Denne e-mailadresse er allerede registreret.' ) );
        }
        
        // Sanitize password input, keeping in mind that passwords can contain special characters
        // wp_unslash removes slashes added by PHP magic quotes or similar mechanisms
        $password = isset( $_POST['password'] ) ? trim( wp_unslash( $_POST['password'] ) ) : '';
        $password_confirm = isset( $_POST['password_confirm'] ) ? trim( wp_unslash( $_POST['password_confirm'] ) ) : '';

        if ( empty( $password ) ) {
      $errors->add( 'password_empty', mybasics_get_option( 'error_password_empty', 'Indtast venligst en adgangskode.' ) );
        } elseif ( strlen( $password ) < 6 ) {
      $errors->add( 'password_length', mybasics_get_option( 'error_password_length', 'Adgangskoden skal være på mindst 6 tegn.' ) );
        }

        if ( $password !== $password_confirm ) {
      $errors->add( 'password_mismatch', mybasics_get_option( 'error_password_mismatch', 'Adgangskoderne stemmer ikke overens.' ) );
        }
    }
    return $errors;
}, 10, 3 );


/**
 * Validate registration nonce server-side
 */
add_action( 'woocommerce_process_registration_errors', function( $errors, $username, $email ) {
  if ( ! isset( $_POST['woocommerce-register-nonce'] ) ||
       ! wp_verify_nonce( $_POST['woocommerce-register-nonce'], 'woocommerce-register' ) ) {
  $errors->add( 'nonce_error', mybasics_get_option( 'error_nonce', 'Sikkerhedstjek mislykkedes. Prøv venligst igen.' ) );
  }
  return $errors;
}, 10, 3 );

/**
 * Detect registration errors and set a flag to show registration form
 */
add_action( 'woocommerce_before_customer_login_form', function() {
  // Check if we have registration errors
  if ( ! empty( $_POST['register'] ) ) {
    // Store flag in session to indicate we're on registration form with timestamp
    WC()->session->set( 'show_registration_form', true );
    WC()->session->set( 'show_registration_form_timestamp', time() );
  }
  
  // Check if we should show the registration form (with errors)
  $show_registration = WC()->session->get( 'show_registration_form', false );
  $timestamp = WC()->session->get( 'show_registration_form_timestamp', 0 );
  
  // Clean up old session flags (older than 5 minutes)
  if ( $timestamp && ( time() - $timestamp ) > 300 ) {
    WC()->session->set( 'show_registration_form', false );
    WC()->session->set( 'show_registration_form_timestamp', null );
    $show_registration = false;
  }
  
  if ( $show_registration ) {
    // Pass this to JavaScript
    echo '<script>var showRegistrationForm = true;</script>';
    // Clear the flag
    WC()->session->set( 'show_registration_form', false );
    WC()->session->set( 'show_registration_form_timestamp', null );
  }
});

/**
 * 1. Redirect Guest Users away from Checkout if not logged in
 */
add_action('template_redirect', function() {
    $options = get_option( 'mybasics_settings' );
    $enable_gate = isset($options['enable_checkout_gate']) ? $options['enable_checkout_gate'] : '1';
    
    // If gate is disabled, do nothing
    if ( ! $enable_gate ) {
        return;
    }

    // Only run on checkout page, if user is logged out, and hasn't clicked "Guest"
    // Update: Also check that we are not processing a form submission (POST) and not on the order-recieved/pay endpoints
    if ( is_checkout() && ! is_user_logged_in() && ! isset( $_GET['guest'] ) && ! defined( 'DOING_AJAX' ) 
         && ! is_wc_endpoint_url( 'order-received' ) 
         && ! is_wc_endpoint_url( 'order-pay' ) 
         && empty( $_POST ) ) {
        wp_safe_redirect( add_query_arg( 'checkout', '1', wc_get_page_permalink( 'myaccount' ) ) );
        exit;
    }
});

/**
 * 2. Inject the "Guest Checkout" column 
 */
add_action('woocommerce_before_customer_login_form', function() {
    $options = get_option( 'mybasics_settings' );
    $enable_gate = isset($options['enable_checkout_gate']) ? $options['enable_checkout_gate'] : '1';
    
    // We check for 'checkout' OR if the user is currently seeing registration errors 
    // while trying to check out.
    // AND if the gate is enabled
    if ($enable_gate && isset($_GET['checkout'])) : 
        $title = isset($options['guest_checkout_title']) ? $options['guest_checkout_title'] : 'Gæste-checkout';
        $subtitle = isset($options['guest_checkout_subtitle']) ? $options['guest_checkout_subtitle'] : 'Du kan oprette en konto, når du tjekker ud.';
        $button_text = isset($options['guest_button_text']) ? $options['guest_button_text'] : 'FORTSÆT SOM GÆST';
        
        $benefit1 = isset($options['guest_benefit_1']) && !empty($options['guest_benefit_1']) ? $options['guest_benefit_1'] : 'Hurtigere og nemmere checkout';
        $benefit2 = isset($options['guest_benefit_2']) && !empty($options['guest_benefit_2']) ? $options['guest_benefit_2'] : 'Ingen oprettelse nødvendig';
        $benefit3 = isset($options['guest_benefit_3']) && !empty($options['guest_benefit_3']) ? $options['guest_benefit_3'] : 'Gem dine oplysninger til sidst';
    ?>
        <script>document.documentElement.classList.add('checkout-gate-page');document.body.classList.add('checkout-gate-page');</script>
        <div class="checkout-gate-wrapper">
            <div class="guest-column">
                <h2 class="title"><?php echo esc_html( $title ); ?></h2>
                <p class="subtitle"><?php echo nl2br( esc_html( $subtitle ) ); ?></p>
                
                <div class="guest-benefits">
                    <div class="guest-benefit"><?php echo esc_html( $benefit1 ); ?></div>
                    <div class="guest-benefit"><?php echo esc_html( $benefit2 ); ?></div>
                    <div class="guest-benefit"><?php echo esc_html( $benefit3 ); ?></div>
                </div>
                
                <a href="<?php echo add_query_arg('guest', '1', wc_get_checkout_url()); ?>" class="guest-btn">
                    <?php echo esc_html( $button_text ); ?>
                </a>
            </div>
            
            <div class="form-separator"><span><?php echo esc_html( mybasics_get_option( 'or_separator', 'ELLER' ) ); ?></span></div>
            
            <div class="login-column">
                <!-- Points indicator container for external plugins -->
                <div class="points-indicator-container"></div>
                
                <!-- The existing Login Card will be inside this column -->
    <?php endif;
}, 5);

add_action('woocommerce_after_customer_login_form', function() {
    $options = get_option( 'mybasics_settings' );
    $enable_gate = isset($options['enable_checkout_gate']) ? $options['enable_checkout_gate'] : '1';
    
    if ($enable_gate && isset($_GET['checkout'])) {
        echo '</div></div>'; // Close .login-column and .checkout-gate-wrapper
    }
}, 20);

/**
 * Validate login nonce server-side
 */
add_action( 'authenticate', function( $user, $username, $password ) {
  if ( isset( $_POST['woocommerce-login-nonce'] ) ) {
    if ( ! wp_verify_nonce( $_POST['woocommerce-login-nonce'], 'woocommerce-login' ) ) {
  return new WP_Error( 'nonce_error', mybasics_get_option( 'error_security', 'Sikkerhedstjek mislykkedes.' ) );
    }
  }
  return $user;
}, 30, 3 );

/**
 * Fix logout functionality by redirecting the default WooCommerce logout endpoint
 * to a URL with a proper nonce.
 */
add_action( 'template_redirect', function() {
  if ( function_exists( 'is_wc_endpoint_url' ) && is_wc_endpoint_url( 'customer-logout' ) ) {
    // Directly log the user out to avoid showing wp-login.php
    if ( is_user_logged_in() ) {
      wp_logout();
    }

    // Clean WooCommerce session just in case
    if ( function_exists( 'WC' ) && WC()->session ) {
      try { WC()->session->destroy_session(); } catch ( \Throwable $e ) {}
    }

    // Redirect back to the My Account page (your custom login card)
    $redirect = wc_get_page_permalink( 'myaccount' );
    wp_safe_redirect( $redirect );
    exit;
  }
}, 1 );

/**
 * 3. Conversion Tracking Logic
 */
add_action( 'woocommerce_thankyou', function( $order_id ) {
    if ( ! $order_id ) return;

    // Check if tracking is enabled
    $options = get_option( 'mybasics_settings' );
    $tracking_enabled = isset($options['enable_conversion_tracking']) && $options['enable_conversion_tracking'] === '1';

    if ( ! $tracking_enabled ) return;

    // Check if this order was already tracked to avoid duplicates on refresh
    if ( get_post_meta( $order_id, '_mybasics_conversion_tracked', true ) ) {
        return;
    }

    $order = wc_get_order( $order_id );
    if ( ! $order ) return;

    $stats = get_option( 'mybasics_conversion_stats', array(
        'guest_orders' => 0,
        'member_orders' => 0,
        'last_reset' => current_time( 'mysql' )
    ));

    // Determine if guest or member
    // "Member" means user was logged in OR they registered during checkout
    // Ideally we check if user_id is set on the order
    
    $user_id = $order->get_user_id();
    
    if ( $user_id > 0 ) {
        $stats['member_orders']++;
    } else {
        $stats['guest_orders']++;
    }

    update_option( 'mybasics_conversion_stats', $stats );
    update_post_meta( $order_id, '_mybasics_conversion_tracked', 'yes' );
} );

/**
 * 🚀 KLAVIYO INTEGRATION: Send MyBasics members to Klaviyo ved oprettelse
 */
add_action( 'woocommerce_created_customer', 'mybasics_sync_to_klaviyo_on_registration', 10, 3 );

function mybasics_sync_to_klaviyo_on_registration( $customer_id, $new_customer_data, $password_generated ) {
    $api_key = mybasics_get_option( 'klaviyo_api_key', '' );
    if ( empty( $api_key ) ) return;

    $email = $new_customer_data['user_email'];

    $data = array(
        'token' => $api_key,
        'properties' => array(
            '$email' => $email,
            'Source' => 'MyBasics Registration',
            'MyBasicsMember' => true
        )
    );

    wp_remote_post( 'https://a.klaviyo.com/api/identify', array(
        'method'    => 'POST',
        'body'      => array( 'data' => json_encode($data) ),
        'timeout'   => 5,
        'blocking'  => false,
    ));
}

// =============================================================================
// TWO-COLUMN LOGIN PAGE LAYOUT  (standard my-account page, non-checkout-gate)
// =============================================================================

/**
 * Returns true when the checkout gate is active on the current request.
 */
function mybasics_is_checkout_gate() {
    $options     = get_option( 'mybasics_settings' );
    $enable_gate = isset( $options['enable_checkout_gate'] ) ? $options['enable_checkout_gate'] : '1';
    return $enable_gate === '1' && isset( $_GET['checkout'] );
}

/**
 * Returns an inline SVG icon for a membership benefit.
 */
function mybasics_benefit_icon( $type ) {
    $icons = [
        'reorder'   => '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>',
        'ruler'     => '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 8.7 8.7 21.3c-.4.4-.8.6-1.3.6s-.9-.2-1.3-.6L2.7 17.9c-.4-.4-.6-.8-.6-1.3s.2-.9.6-1.3L15.3 2.7c.4-.4.8-.6 1.3-.6s.9.2 1.3.6l3.4 3.4c.4.4.6.8.6 1.3s-.2.9-.6 1.3z"/><path d="M7.5 10.5 10 13"/><path d="M10.5 7.5 13 10"/><path d="M13.5 4.5 16 7"/></svg>',
        'piggybank' => '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h0"/></svg>',
        'bag'       => '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    ];
    return isset( $icons[ $type ] ) ? $icons[ $type ] : '';
}

/**
 * Open the two-column wrapper + left column with header content.
 * Fires before WooCommerce renders the login/register forms.
 */
add_action( 'woocommerce_before_customer_login_form', function () {
    if ( mybasics_is_checkout_gate() ) return;

    $logo_id   = get_theme_mod( 'custom_logo' );
    $logo_url  = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : '';
    $site_name = esc_attr( get_bloginfo( 'name' ) );
    ?>
    <div class="mb-login-wrapper">

      <div class="mb-col mb-col-left">

        <h2 class="mb-col-title">Allerede MyBasics Medlem?</h2>

        <?php if ( $logo_url ) : ?>
        <div class="mb-logo-area">
          <img src="<?php echo esc_url( $logo_url ); ?>"
               alt="<?php echo $site_name; ?>"
               class="mb-logo" />
        </div>
        <?php endif; ?>

        <p class="mb-tagline">Slip for at huske dit kodeord&nbsp;&ndash; vi g&oslash;r det nemt.</p>

        <div class="mb-envelope-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 84" width="100" height="84">
            <!-- Envelope body -->
            <rect x="2" y="6" width="82" height="60" rx="6" ry="6"
                  fill="#ddeeff" stroke="#a8c8f0" stroke-width="2"/>
            <!-- Envelope flap -->
            <polyline points="2,6 43,44 84,6"
                      fill="none" stroke="#a8c8f0" stroke-width="2"/>
            <!-- Chain-link badge (bottom-right) -->
            <circle cx="78" cy="60" r="20" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.5"/>
            <path d="M71 60 a7 7 0 0 1 7-7h5a7 7 0 0 1 0 14h-5a7 7 0 0 1-7-7z" fill="none" stroke="#4b7cf3" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M75 60 a7 7 0 0 1 7-7h5a7 7 0 0 1 0 14h-5a7 7 0 0 1-7-7z" fill="none" stroke="#4b7cf3" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- #login-form and #magic-link-form will be moved here by JS -->

      </div><!-- .mb-col-left — left column is NOT closed here; JS inserts forms before closing -->

    <?php
    // NOTE: .mb-col-left is closed in the after hook below.
}, 3 );

/**
 * Close left column, render the right (registration) column, close wrapper.
 * Fires after WooCommerce renders the login/register forms.
 */
add_action( 'woocommerce_after_customer_login_form', function () {
    if ( mybasics_is_checkout_gate() ) return;

    $logo_id   = get_theme_mod( 'custom_logo' );
    $logo_url  = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : '';
    $site_name = esc_attr( get_bloginfo( 'name' ) );

    $benefits = [
        [ 'icon' => 'reorder',   'text' => 'Nemt genbestil dine favoritter.' ],
        [ 'icon' => 'ruler',     'text' => 'Vi husker din præcise størrelse.' ],
        [ 'icon' => 'piggybank', 'text' => 'Optjen point for hvert køb til gratis varer.' ],
        [ 'icon' => 'bag',       'text' => 'Se din fulde købshistorik.' ],
    ];
    ?>
      </div><!-- /.mb-col-left (opened by before hook at priority 3) -->

      <div class="mb-col-divider" aria-hidden="true"></div>

      <div class="mb-col mb-col-right">

        <h2 class="mb-col-title">Ikke MyBasics Medlem endnu?</h2>

        <?php if ( $logo_url ) : ?>
        <div class="mb-logo-area mb-logo-area-right">
          <img src="<?php echo esc_url( $logo_url ); ?>"
               alt="<?php echo $site_name; ?>"
               class="mb-logo" />
          <span class="mb-plus" aria-hidden="true">+</span>
          <svg class="mb-coin-icon" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
            <circle cx="20" cy="20" r="19" fill="#f5c518" stroke="#c9a100" stroke-width="1.5"/>
            <text x="20" y="27" text-anchor="middle"
                  font-family="Georgia,serif" font-size="19"
                  font-weight="bold" fill="#8a6500">&#9733;</text>
          </svg>
        </div>
        <?php endif; ?>

        <p class="mb-tagline">G&oslash;r dine indk&oslash;b hurtigere og optjen point til gratis produkter.</p>

        <ul class="mb-benefits" aria-label="Fordele ved at blive medlem">
          <?php foreach ( $benefits as $b ) : ?>
          <li class="mb-benefit">
            <span class="mb-benefit-icon"><?php echo mybasics_benefit_icon( $b['icon'] ); ?></span>
            <span><?php echo esc_html( $b['text'] ); ?></span>
          </li>
          <?php endforeach; ?>
        </ul>

        <!-- CTA — JS moves #register-form here and shows it when this button is clicked -->
        <button type="button" class="btn btn-primary mb-register-cta" id="mb-show-register">
          Tilmeld mig &amp; Shop nu
        </button>

        <!-- #register-form will be moved here by JS -->

      </div><!-- /.mb-col-right -->

    </div><!-- /.mb-login-wrapper -->
    <?php
}, 3 );

// =============================================================================
// MAGIC LINK FEATURE
// =============================================================================

/**
 * Inject the hidden magic-link form div after the WooCommerce forms.
 * JS will move it inside the card on page load.
 */
add_action( 'woocommerce_after_customer_login_form', function () {
    $options = get_option( 'mybasics_settings' );
    if ( ( isset( $options['enable_magic_link'] ) ? $options['enable_magic_link'] : '1' ) !== '1' ) {
        return;
    }
    ?>
    <div id="magic-link-form" class="is-hidden" aria-hidden="true">
        <div id="magic-link-request">
            <div class="field">
                <label for="magic-link-email" class="field-label mb-sr-only">E-mailadresse</label>
                <div class="input-wrapper">
                    <input type="email" id="magic-link-email" class="input"
                           placeholder="Din e-mail adresse"
                           aria-label="E-mailadresse"
                           autocomplete="email" />
                </div>
            </div>
            <div id="magic-link-error" class="error" role="alert" aria-live="polite"></div>
            <button type="button" id="magic-link-submit" class="btn btn-primary">Send mig login-link</button>
            <div class="mb-use-password-wrap">
                <a href="#" class="mb-use-password-link">
                    Jeg vil hellere logge ind med kodeord (hvis du har et)
                </a>
            </div>
        </div>
        <div id="magic-link-success" class="is-hidden">
            <p class="magic-link-success-msg">Tjek din e-mail og klik p&aring; loginlinket. Det er gyldigt i 15 minutter.</p>
        </div>
        <div class="magic-link-back-wrap" style="margin-top:16px;text-align:center;">
            <a href="#login" class="membership-link magic-link-back">&larr; Tilbage til login</a>
        </div>
    </div>
    <?php
}, 15 );

/**
 * Handle the AJAX request to send a magic link email.
 * Works for both logged-out (nopriv) and logged-in users.
 */
add_action( 'wp_ajax_nopriv_mybasics_send_magic_link', 'mybasics_handle_send_magic_link' );
add_action( 'wp_ajax_mybasics_send_magic_link',        'mybasics_handle_send_magic_link' );

function mybasics_handle_send_magic_link() {
    if ( ! check_ajax_referer( 'mybasics_magic_link', 'nonce', false ) ) {
        wp_send_json_error( array( 'message' => 'Sikkerhedstjek mislykkedes.' ) );
    }

    $email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';

    if ( empty( $email ) || ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => 'Indtast venligst en gyldig e-mailadresse.' ) );
    }

    // Always return success to prevent email enumeration
    $success_msg = array( 'message' => 'Loginlink sendt! Tjek din e-mail.' );

    $user = get_user_by( 'email', $email );
    if ( ! $user ) {
        wp_send_json_success( $success_msg );
    }

    // Generate a 32-char secure token, store its hash as a transient (15 min)
    $token      = wp_generate_password( 32, false );
    $token_hash = wp_hash( $token );
    set_transient( 'mybasics_ml_' . $user->ID, $token_hash, 15 * MINUTE_IN_SECONDS );

    // Build the magic link URL
    $magic_url = add_query_arg(
        array(
            'mybasics_ml' => '1',
            'uid'         => $user->ID,
            'token'       => $token,
        ),
        wc_get_page_permalink( 'myaccount' )
    );

    // Build the email
    $options  = get_option( 'mybasics_settings' );
    $subject  = ! empty( $options['magic_link_email_subject'] )
        ? $options['magic_link_email_subject']
        : 'Dit loginlink til ' . get_bloginfo( 'name' );

    $body_template = ! empty( $options['magic_link_email_body'] )
        ? $options['magic_link_email_body']
        : "Hej,\n\nKlik p\xc3\xa5 linket herunder for at logge ind:\n\n{link}\n\nLinket er gyldigt i 15 minutter og kan kun bruges \xc3\xa9n gang.\n\nMed venlig hilsen\n" . get_bloginfo( 'name' );

    $body = str_replace( '{link}', esc_url( $magic_url ), $body_template );

    wp_mail( $email, $subject, $body );

    wp_send_json_success( $success_msg );
}

/**
 * Handle magic link token in the URL: validate, log in, redirect.
 * Runs at priority 2 — before the checkout gate (default 10) and after logout (1).
 */
add_action( 'template_redirect', function () {
    if ( empty( $_GET['mybasics_ml'] ) || empty( $_GET['uid'] ) || empty( $_GET['token'] ) ) {
        return;
    }

    $uid   = absint( $_GET['uid'] );
    $token = sanitize_text_field( wp_unslash( $_GET['token'] ) );

    if ( ! $uid || empty( $token ) ) {
        return;
    }

    // Already logged in — just redirect to account
    if ( is_user_logged_in() ) {
        wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
        exit;
    }

    $stored_hash = get_transient( 'mybasics_ml_' . $uid );

    if ( ! $stored_hash || ! hash_equals( $stored_hash, wp_hash( $token ) ) ) {
        // Invalid or expired — redirect to login with a notice
        wp_safe_redirect( add_query_arg( 'magic_link_error', '1', wc_get_page_permalink( 'myaccount' ) ) );
        exit;
    }

    $user = get_user_by( 'ID', $uid );
    if ( ! $user ) {
        wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
        exit;
    }

    // Consume the token (single use)
    delete_transient( 'mybasics_ml_' . $uid );

    // Log the user in
    wp_set_auth_cookie( $uid, true );
    do_action( 'wp_login', $user->user_login, $user );

    wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
    exit;
}, 2 );

/**
 * Show an error notice when a magic link is invalid or expired.
 */
add_action( 'woocommerce_before_customer_login_form', function () {
    if ( ! empty( $_GET['magic_link_error'] ) ) {
        echo '<div class="woocommerce-error" style="display:block!important;margin-bottom:16px;">'
           . esc_html__( 'Loginlinket er ugyldigt eller udl\xc3\xb8bet. Bed venligst om et nyt.', 'mybasics-magic-login' )
           . '</div>';
    }
}, 20 );