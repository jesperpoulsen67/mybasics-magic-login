<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register settings and setting fields.
 */
function mybasics_register_settings() {
    register_setting( 'mybasics_options', 'mybasics_settings', 'mybasics_sanitize_settings' );

    // --- Section 1: Checkout Gate ---
    add_settings_section(
        'mybasics_general_section',
        __( 'Checkout Gate Settings', 'mybasics-custom-login' ),
        null,
        'mybasics'
    );

    add_settings_field(
        'enable_checkout_gate',
        __( 'Enable Checkout Gate', 'mybasics-custom-login' ),
        'mybasics_field_enable_checkout_gate',
        'mybasics',
        'mybasics_general_section'
    );

    add_settings_field(
        'guest_checkout_title',
        __( 'Guest Checkout Title', 'mybasics-custom-login' ),
        'mybasics_field_guest_checkout_title',
        'mybasics',
        'mybasics_general_section'
    );

    add_settings_field(
        'guest_checkout_subtitle',
        __( 'Guest Checkout Subtitle', 'mybasics-custom-login' ),
        'mybasics_field_guest_checkout_subtitle',
        'mybasics',
        'mybasics_general_section'
    );

    add_settings_field(
        'guest_button_text',
        __( 'Guest Button Text', 'mybasics-custom-login' ),
        'mybasics_field_guest_button_text',
        'mybasics',
        'mybasics_general_section'
    );

    add_settings_field(
        'guest_benefit_1',
        __( 'Guest Benefit 1', 'mybasics-custom-login' ),
        'mybasics_field_guest_benefit_1',
        'mybasics',
        'mybasics_general_section'
    );

    add_settings_field(
        'guest_benefit_2',
        __( 'Guest Benefit 2', 'mybasics-custom-login' ),
        'mybasics_field_guest_benefit_2',
        'mybasics',
        'mybasics_general_section'
    );

    add_settings_field(
        'guest_benefit_3',
        __( 'Guest Benefit 3', 'mybasics-custom-login' ),
        'mybasics_field_guest_benefit_3',
        'mybasics',
        'mybasics_general_section'
    );

    // --- Section 1.6: Conversion Tracking ---
    add_settings_section(
        'mybasics_tracking_section',
        __( 'Conversion Tracking', 'mybasics-custom-login' ),
        'mybasics_conversion_tracking_section_callback',
        'mybasics'
    );

    add_settings_field(
        'enable_conversion_tracking',
        __( 'Enable Conversion Tracking', 'mybasics-custom-login' ),
        'mybasics_field_enable_conversion_tracking',
        'mybasics',
        'mybasics_tracking_section'
    );

    // --- Section 2: Authentication Form Texts ---
    add_settings_section(
        'mybasics_auth_section',
        __( 'Authentication Form Texts', 'mybasics-custom-login' ),
        function() { echo '<p>' . __( 'Customize the titles and descriptions for the login and registration forms.', 'mybasics-custom-login' ) . '</p>'; },
        'mybasics'
    );

    add_settings_field('auth_login_title', __( 'Login Title', 'mybasics-custom-login' ), 'mybasics_field_text', 'mybasics', 'mybasics_auth_section', ['id' => 'auth_login_title', 'default' => 'Log ind']);
    add_settings_field('auth_register_title', __( 'Register Title', 'mybasics-custom-login' ), 'mybasics_field_text', 'mybasics', 'mybasics_auth_section', ['id' => 'auth_register_title', 'default' => 'Bliv medlem']);
    
    add_settings_field('auth_login_subtitle', __( 'Login Subtitle', 'mybasics-custom-login' ), 'mybasics_field_textarea', 'mybasics', 'mybasics_auth_section', ['id' => 'auth_login_subtitle', 'default' => 'Få adgang til dine størrelser, dine produkter og din købshistorik – og bestil endnu hurtigere!']);
    add_settings_field('auth_register_subtitle', __( 'Register Subtitle', 'mybasics-custom-login' ), 'mybasics_field_textarea', 'mybasics', 'mybasics_auth_section', ['id' => 'auth_register_subtitle', 'default' => 'Opret din konto og få adgang til din størrelse, dine produkter og din købshistorik. Du kan også bruge dine point til at prøve spændende nye produkter!']);
    
    add_settings_field('auth_register_perk', __( 'Registration Perk Text', 'mybasics-custom-login' ), 'mybasics_field_text', 'mybasics', 'mybasics_auth_section', ['id' => 'auth_register_perk', 'default' => 'Du får 5 point for din tilmelding.']);

    // --- Section 3: System Texts ---
    add_settings_section(
        'mybasics_system_section',
        __( 'System Texts', 'mybasics-custom-login' ),
        function() { echo '<p>' . __( 'Short UI texts that are not part of the main forms.', 'mybasics-custom-login' ) . '</p>'; },
        'mybasics'
    );
    add_settings_field('or_separator', __( 'OR Separator Text', 'mybasics-custom-login' ), 'mybasics_field_text', 'mybasics', 'mybasics_system_section', ['id' => 'or_separator', 'default' => 'ELLER']);

    // --- Section 4: Error Messages ---
    add_settings_section(
        'mybasics_errors_section',
        __( 'Error Messages', 'mybasics-custom-login' ),
        function() { echo '<p>' . __( 'Validation and error messages shown to users during login and registration.', 'mybasics-custom-login' ) . '</p>'; },
        'mybasics'
    );
    add_settings_field('error_duplicate_email',   __( 'Duplicate Email Error', 'mybasics-custom-login' ),             'mybasics_field_text', 'mybasics', 'mybasics_errors_section', ['id' => 'error_duplicate_email',   'default' => 'Denne e-mailadresse er allerede registreret.']);
    add_settings_field('error_password_empty',    __( 'Password Empty Error', 'mybasics-custom-login' ),              'mybasics_field_text', 'mybasics', 'mybasics_errors_section', ['id' => 'error_password_empty',    'default' => 'Indtast venligst en adgangskode.']);
    add_settings_field('error_password_length',   __( 'Password Too Short Error', 'mybasics-custom-login' ),          'mybasics_field_text', 'mybasics', 'mybasics_errors_section', ['id' => 'error_password_length',   'default' => 'Adgangskoden skal være på mindst 6 tegn.']);
    add_settings_field('error_password_mismatch', __( 'Password Mismatch Error', 'mybasics-custom-login' ),           'mybasics_field_text', 'mybasics', 'mybasics_errors_section', ['id' => 'error_password_mismatch', 'default' => 'Adgangskoderne stemmer ikke overens.']);
    add_settings_field('error_nonce',             __( 'Security Check Error (Registration)', 'mybasics-custom-login' ), 'mybasics_field_text', 'mybasics', 'mybasics_errors_section', ['id' => 'error_nonce',             'default' => 'Sikkerhedstjek mislykkedes. Prøv venligst igen.']);
    add_settings_field('error_security',          __( 'Security Check Error (Login)', 'mybasics-custom-login' ),      'mybasics_field_text', 'mybasics', 'mybasics_errors_section', ['id' => 'error_security',          'default' => 'Sikkerhedstjek mislykkedes.']);

    // --- Section 5: Klaviyo Integration ---
    add_settings_section(
        'mybasics_klaviyo_section',
        __( 'Klaviyo Integration', 'mybasics-custom-login' ),
        function() { echo '<p>' . __( 'Configure the Klaviyo API connection for syncing new members.', 'mybasics-custom-login' ) . '</p>'; },
        'mybasics'
    );
    add_settings_field('klaviyo_api_key', __( 'Klaviyo Public API Key', 'mybasics-custom-login' ), 'mybasics_field_text', 'mybasics', 'mybasics_klaviyo_section', ['id' => 'klaviyo_api_key', 'default' => '']);
}
add_action( 'admin_init', 'mybasics_register_settings' );

/**
 * Sanitize all settings data.
 * Handles checkbox saving for 'enable_checkout_gate' (sets to '0' if unchecked).
 */
function mybasics_sanitize_settings( $input ) {
    // 1. Checkboxes: explicitly set to '0' if missing
    $input['enable_checkout_gate'] = isset( $input['enable_checkout_gate'] ) ? '1' : '0';
    $input['enable_conversion_tracking'] = isset( $input['enable_conversion_tracking'] ) ? '1' : '0';

    // 2. Sanitize Text Fields
    $input['guest_checkout_title']    = sanitize_text_field( $input['guest_checkout_title'] );
    $input['guest_checkout_subtitle'] = sanitize_textarea_field( $input['guest_checkout_subtitle'] );
    $input['guest_benefit_1']         = sanitize_text_field( $input['guest_benefit_1'] );
    $input['guest_benefit_2']         = sanitize_text_field( $input['guest_benefit_2'] );
    $input['guest_benefit_3']         = sanitize_text_field( $input['guest_benefit_3'] );
    $input['guest_button_text']       = sanitize_text_field( $input['guest_button_text'] );

    $input['auth_login_title']        = sanitize_text_field( $input['auth_login_title'] );
    $input['auth_register_title']     = sanitize_text_field( $input['auth_register_title'] );
    $input['auth_login_subtitle']     = sanitize_textarea_field( $input['auth_login_subtitle'] );
    $input['auth_register_subtitle']  = sanitize_textarea_field( $input['auth_register_subtitle'] );
    $input['auth_register_perk']      = sanitize_text_field( $input['auth_register_perk'] );

    // 3. System Texts
    $input['or_separator']            = sanitize_text_field( isset( $input['or_separator'] ) ? $input['or_separator'] : '' );

    // 4. Error Messages
    $input['error_duplicate_email']   = sanitize_text_field( isset( $input['error_duplicate_email'] )   ? $input['error_duplicate_email']   : '' );
    $input['error_password_empty']    = sanitize_text_field( isset( $input['error_password_empty'] )    ? $input['error_password_empty']    : '' );
    $input['error_password_length']   = sanitize_text_field( isset( $input['error_password_length'] )   ? $input['error_password_length']   : '' );
    $input['error_password_mismatch'] = sanitize_text_field( isset( $input['error_password_mismatch'] ) ? $input['error_password_mismatch'] : '' );
    $input['error_nonce']             = sanitize_text_field( isset( $input['error_nonce'] )             ? $input['error_nonce']             : '' );
    $input['error_security']          = sanitize_text_field( isset( $input['error_security'] )          ? $input['error_security']          : '' );

    // 5. Klaviyo
    $input['klaviyo_api_key']         = sanitize_text_field( isset( $input['klaviyo_api_key'] ) ? $input['klaviyo_api_key'] : '' );

    return $input;
}

/**
 * Add options page to the Settings menu.
 */
function mybasics_options_page() {
    add_options_page(
        'MyBasics Login Settings',
        'MyBasics Login',
        'manage_options',
        'mybasics',
        'mybasics_options_page_html'
    );
}
add_action( 'admin_menu', 'mybasics_options_page' );

/**
 * Render the options page.
 */
function mybasics_options_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields( 'mybasics_options' );
            do_settings_sections( 'mybasics' );
            submit_button( __( 'Save Settings', 'mybasics-custom-login' ) );
            ?>
        </form>
    </div>
    <?php
}

/**
 * Validates and retrieves options safely
 */
function mybasics_get_option($key, $default = '') {
    $options = get_option('mybasics_settings');
    return isset($options[$key]) ? $options[$key] : $default;
}

/**
 * Field callbacks.
 */
function mybasics_field_enable_checkout_gate() {
    $checked = mybasics_get_option('enable_checkout_gate', '1');
    ?>
    <input type="checkbox" name="mybasics_settings[enable_checkout_gate]" value="1" <?php checked( 1, $checked, true ); ?> />
    <p class="description"><?php _e( 'Redirect guest users to a special login/guest choice page before checkout.', 'mybasics-custom-login' ); ?></p>
    <?php
}

function mybasics_field_guest_checkout_title() {
    $value = mybasics_get_option('guest_checkout_title', 'Gæste-checkout');
    ?>
    <input type="text" name="mybasics_settings[guest_checkout_title]" value="<?php echo esc_attr( $value ); ?>" class="regular-text" />
    <?php
}

function mybasics_field_guest_checkout_subtitle() {
    $value = mybasics_get_option('guest_checkout_subtitle', 'Du kan oprette en konto, når du tjekker ud.');
    ?>
    <textarea name="mybasics_settings[guest_checkout_subtitle]" rows="3" cols="50" class="large-text"><?php echo esc_textarea( $value ); ?></textarea>
    <?php
}

function mybasics_field_guest_button_text() {
    $value = mybasics_get_option('guest_button_text', 'FORTSÆT SOM GÆST');
 

function mybasics_field_guest_benefit_1() {
    $value = mybasics_get_option('guest_benefit_1', 'Hurtigere og nemmere checkout');
    ?>
    <input type="text" name="mybasics_settings[guest_benefit_1]" value="<?php echo esc_attr( $value ); ?>" class="large-text" />
    <p class="description"><?php _e( 'First benefit shown to guest users.', 'mybasics-custom-login' ); ?></p>
    <?php
}

function mybasics_field_guest_benefit_2() {
    $value = mybasics_get_option('guest_benefit_2', 'Ingen oprettelse nødvendig');
    ?>
    <input type="text" name="mybasics_settings[guest_benefit_2]" value="<?php echo esc_attr( $value ); ?>" class="large-text" />
    <p class="description"><?php _e( 'Second benefit shown to guest users.', 'mybasics-custom-login' ); ?></p>
    <?php
}

function mybasics_field_guest_benefit_3() {
    $value = mybasics_get_option('guest_benefit_3', 'Gem dine oplysninger til sidst');
    ?>
    <input type="text" name="mybasics_settings[guest_benefit_3]" value="<?php echo esc_attr( $value ); ?>" class="large-text" />
    <p class="description"><?php _e( 'Third benefit shown to guest users.', 'mybasics-custom-login' ); ?></p>
    <?php
}

function mybasics_field_enable_conversion_tracking() {
    $checked = mybasics_get_option('enable_conversion_tracking', '1');
    ?>
    <input type="checkbox" name="mybasics_settings[enable_conversion_tracking]" value="1" <?php checked( 1, $checked, true ); ?> />
    <p class="description"><?php _e( 'Track guest vs member checkout conversions and display statistics.', 'mybasics-custom-login' ); ?></p>
    <?php
}

function mybasics_conversion_tracking_section_callback() {
    echo '<p>' . __( 'View analytics about guest vs member conversions.', 'mybasics-custom-login' ) . '</p>';
    
    // Display conversion stats
    $stats = get_option( 'mybasics_conversion_stats', array(
        'guest_orders' => 0,
        'member_orders' => 0,
        'last_reset' => current_time( 'mysql' )
    ));
    
    $total = $stats['guest_orders'] + $stats['member_orders'];
    $guest_percent = $total > 0 ? round( ( $stats['guest_orders'] / $total ) * 100, 1 ) : 0;
    $member_percent = $total > 0 ? round( ( $stats['member_orders'] / $total ) * 100, 1 ) : 0;
    
    ?>
    <div style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin: 15px 0;">
        <h3 style="margin-top: 0;"><?php _e( 'Conversion Statistics', 'mybasics-custom-login' ); ?></h3>
        <table style="width: 100%; max-width: 500px;">
            <tr>
                <td><strong><?php _e( 'Guest Orders:', 'mybasics-custom-login' ); ?></strong></td>
                <td><?php echo esc_html( $stats['guest_orders'] ); ?> (<?php echo esc_html( $guest_percent ); ?>%)</td>
            </tr>
            <tr>
                <td><strong><?php _e( 'Member Orders:', 'mybasics-custom-login' ); ?></strong></td>
                <td><?php echo esc_html( $stats['member_orders'] ); ?> (<?php echo esc_html( $member_percent ); ?>%)</td>
            </tr>
            <tr>
                <td><strong><?php _e( 'Total Orders:', 'mybasics-custom-login' ); ?></strong></td>
                <td><?php echo esc_html( $total ); ?></td>
            </tr>
            <tr>
                <td><strong><?php _e( 'Tracking Since:', 'mybasics-custom-login' ); ?></strong></td>
                <td><?php echo esc_html( date_i18n( get_option( 'date_format' ), strtotime( $stats['last_reset'] ) ) ); ?></td>
            </tr>
        </table>
        <p>
            <a href="<?php echo esc_url( add_query_arg( 'mybasics_reset_stats', '1', admin_url( 'options-general.php?page=mybasics' ) ) ); ?>" 
               class="button" 
               onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to reset the statistics?', 'mybasics-custom-login' ); ?>');">
                <?php _e( 'Reset Statistics', 'mybasics-custom-login' ); ?>
            </a>
        </p>
    </div>
    <?php
}   ?>
    <input type="text" name="mybasics_settings[guest_button_text]" value="<?php echo esc_attr( $value ); ?>" class="regular-text" />
    <?php
}

// Generic Text Field Callback
function mybasics_field_text($args) {
    $id = $args['id'];
    $default = isset($args['default']) ? $args['default'] : '';
    $value = mybasics_get_option($id, $default);
    echo '<input type="text" name="mybasics_settings[' . esc_attr($id) . ']" value="' . esc_attr($value) . '" class="large-text" />';
}

// Generic Textarea Callback
function mybasics_field_textarea($args) {
    $id = $args['id'];
    $default = isset($args['default']) ? $args['default'] : '';
    $value = mybasics_get_option($id, $default);
    echo '<textarea name="mybasics_settings[' . esc_attr($id) . ']" rows="3" cols="50" class="large-text">' . esc_textarea($value) . '</textarea>';
}
