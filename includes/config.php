<?php
/**
 * Voice Forte Website Configuration
 * 
 * IMPORTANT: This file should be kept secure and not accessible via web.
 * Place it outside web root in production.
 */

// Database Configuration (if needed)
define('DB_HOST', 'localhost');
define('DB_NAME', 'voiceforte_db');
define('DB_USER', 'voiceforte_user');
define('DB_PASS', 'secure_password_here');

// Website Configuration
define('SITE_NAME', 'Voice Forte™');
define('SITE_URL', 'https://voiceforte.com');
define('SITE_EMAIL', 'voiceforteofficials@gmail.com');
define('ADMIN_EMAIL', 'admin@voiceforte.com');

// Contact Information
define('PHONE_PRIMARY', '+92 333 2924941');
define('PHONE_WHATSAPP', '+92 313 2992571');
define('ADDRESS', 'Pakistan Office (Global Reach)');

// Social Media Links
define('FACEBOOK_URL', 'https://www.facebook.com/share/17ayaHpfs5/');
define('INSTAGRAM_URL', 'https://www.instagram.com/voiceforteofficials');
define('YOUTUBE_URL', 'https://youtube.com/@voiceforteofficials');
define('TIKTOK_URL', 'https://www.tiktok.com/@voiceforteofficials');
define('LINKEDIN_URL', 'https://www.linkedin.com/company/voice-forte/');

// Office Hours
define('OFFICE_HOURS_WEEKDAYS', 'Monday - Friday: 9:00 AM - 6:00 PM (PKT)');
define('OFFICE_HOURS_SATURDAY', 'Saturday: 10:00 AM - 4:00 PM (PKT)');
define('OFFICE_HOURS_SUNDAY', 'Sunday: Closed');

// Security Configuration
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', password_hash('VoiceForte@2024', PASSWORD_DEFAULT));
define('SESSION_TIMEOUT', 3600); // 1 hour

// File Upload Configuration
define('MAX_FILE_SIZE', 10485760); // 10MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']);
define('UPLOAD_PATH', '../uploads/');

// Backup Configuration
define('BACKUP_PATH', '../backups/');
define('MAX_BACKUPS', 10);
define('BACKUP_INTERVAL', 'weekly'); // daily, weekly, monthly

// SEO Defaults
define('DEFAULT_META_TITLE', 'Voice Forte™ | Strategic Communications & Digital Growth');
define('DEFAULT_META_DESCRIPTION', 'Where Media Authority Meets Digital Performance. Integrated PR, Growth Marketing & Automation for Modern Brands.');
define('DEFAULT_META_KEYWORDS', 'PR agency, digital marketing, growth marketing, brand strategy, media relations, Pakistan');

// Error Reporting
if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Asia/Karachi');

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Security Headers
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// CORS Headers (if needed for API)
header("Access-Control-Allow-Origin: " . SITE_URL);
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// CSRF Protection Token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email address
 */
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Generate random string
 */
function generate_random_string($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Log activity
 */
function log_activity($activity, $user = 'system') {
    $log_file = '../logs/activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] [$user] $activity\n";
    
    if (!file_exists('../logs')) {
        mkdir('../logs', 0755, true);
    }
    
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

/**
 * Send email notification
 */
function send_notification($to, $subject, $message, $headers = '') {
    if (empty($headers)) {
        $headers = "From: " . SITE_EMAIL . "\r\n" .
                   "Reply-To: " . SITE_EMAIL . "\r\n" .
                   "X-Mailer: PHP/" . phpversion() .
                   "MIME-Version: 1.0\r\n" .
                   "Content-Type: text/html; charset=UTF-8\r\n";
    }
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Create backup
 */
function create_backup() {
    $backup_dir = BACKUP_PATH . date('Y-m-d_H-i-s');
    if (!file_exists($backup_dir)) {
        mkdir($backup_dir, 0755, true);
    }
    
    // Backup files
    exec("cp -r ../css $backup_dir/");
    exec("cp -r ../js $backup_dir/");
    exec("cp -r ../pages $backup_dir/");
    exec("cp ../index.html $backup_dir/");
    
    // Create database backup if needed
    // ...
    
    log_activity("Backup created: $backup_dir", 'system');
    
    // Clean old backups
    clean_old_backups();
    
    return $backup_dir;
}

/**
 * Clean old backups
 */
function clean_old_backups() {
    $backups = glob(BACKUP_PATH . '*');
    usort($backups, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });
    
    if (count($backups) > MAX_BACKUPS) {
        for ($i = MAX_BACKUPS; $i < count($backups); $i++) {
            delete_directory($backups[$i]);
        }
    }
}

/**
 * Delete directory recursively
 */
function delete_directory($dir) {
    if (!file_exists($dir)) return true;
    
    if (!is_dir($dir)) return unlink($dir);
    
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        
        if (!delete_directory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }
    }
    
    return rmdir($dir);
}

// Auto-backup if enabled
if (BACKUP_INTERVAL === 'daily' && date('H') === '00') {
    create_backup();
} elseif (BACKUP_INTERVAL === 'weekly' && date('w') === '0' && date('H') === '00') {
    create_backup();
} elseif (BACKUP_INTERVAL === 'monthly' && date('d') === '01' && date('H') === '00') {
    create_backup();
}
?>
