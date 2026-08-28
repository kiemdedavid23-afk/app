/**
 * Bannière de téléchargement de l'application Android (.apk hébergé sur GitHub).
 * S'affiche uniquement sur Android (un .apk ne fonctionne pas sur iOS/desktop).
 */
(function () {

  var APK_DOWNLOAD_URL = 'https://github.com/VOTRE-COMPTE/VOTRE-DEPOT/releases/download/v1.0.0/chez-tantie-pauline.apk';
  var STORAGE_DISMISSED_KEY = 'ctp_apk_banner_dismissed_at';
  var DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function wasRecentlyDismissed() {
    var ts = localStorage.getItem(STORAGE_DISMISSED_KEY);
    if (!ts) return false;
    return (Date.now() - Number(ts)) < DISMISS_COOLDOWN_MS;
  }

  function buildBanner(mount) {
    mount.innerHTML = '<div class="apk-banner"><div class="apk-banner-inner"><div class="apk-banner-text"><p class="apk-banner-title">Installez l\'application Chez Tantie Pauline</p></div><div class="apk-banner-actions"><a href="' + APK_DOWNLOAD_URL + '" class="apk-banner-btn">Installer</a></div></div></div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('app-download-banner');
    if (!mount) return;
    if (!isAndroid() || wasRecentlyDismissed()) return;
    buildBanner(mount);
  });

})();
