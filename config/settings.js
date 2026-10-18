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

      // settings.js dimuat sebelum db.js, jadi jangan menebak atau membuat key.
    // db.js sementara masih menyediakan konfigurasi Supabase lama.
    return { url: '', key: '' };
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
