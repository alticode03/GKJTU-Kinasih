// config/settings.js
(function() {
  'use strict';

  function loadConfig() {
    // Cek localStorage dulu (agar konsisten across halaman)
    var cachedUrl = localStorage.getItem('gkjtukinasih_sb_url');
    var cachedKey = localStorage.getItem('gkjtukinasih_sb_anon_key');
    var cachedEndpoint = localStorage.getItem('gkjtukinasih_api_endpoint');

    if (cachedUrl && cachedKey) {
      return { url: cachedUrl, key: cachedKey };
    }

    // Fallback ke hardcoded (untuk production deployment)
    // Nilai di sini hanya digunakan sebagai cadangan saat pertama kali akses
    return {
      url: window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url || '',
      key: window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey || ''
    };
  }

  var config = loadConfig();

  // Simpan ke global agar bisa dibaca oleh halaman lain
  window.APP_CONFIG = {
    supabase: {
      url: config.url,
      anonKey: config.key
    },
    apiEndpoint: localStorage.getItem('gkjtukinasih_api_endpoint') || 
                  'https://rqswwfkkqaqphdnygsjw.supabase.co/functions/v1/site-api'
  };

  // Simpan ke localStorage untuk page-to-page consistency
  if (config.url) localStorage.setItem('gkjtukinasih_sb_url', config.url);
  if (config.key) localStorage.setItem('gkjtukinasih_sb_anon_key', config.key);
})();
