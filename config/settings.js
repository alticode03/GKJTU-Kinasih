// config/settings.js
(function () {
  'use strict';

  // Endpoint opsional untuk migrasi API; koneksi Supabase utama dikelola oleh js/db.js.
  window.APP_CONFIG = {
    apiEndpoint: 'https://frowpckwjlrzterlmdud.supabase.co/functions/v1/site-api'
  };
})();
