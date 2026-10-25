// ==================== SUPABASE CONFIG ====================
window.SUPABASE_CONFIG = {
  url: 'https://rqswwfkkqaqphdnygsjw.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc3d3ZmtrcWFxcGhkbnlnc2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNzQ1NjQsImV4cCI6MjEwNzY1MDU2NH0.fiiYsKL57rgbAazben2n3uwRkDGwMCKr7XFcP8PgjnI'
};

// ==================== DATA LAYER (Supabase-only) ====================
// Satu-satunya sumber data: Supabase (PostgreSQL + Storage).
// Tidak ada lagi localStorage; semua halaman memakai await DB.reload/add/remove.
var DB = (function () {
  var base = window.SUPABASE_CONFIG.url;
  var key = window.SUPABASE_CONFIG.anonKey;
  var buckets = { warta: 'warta-pdfs', renungan: 'renungan-images', kepemimpinan: 'kepemimpinan-images' };

  function headers(extra) {
    var result = { 'Content-Type': 'application/json', Prefer: 'return=representation' };
    result['api' + 'key'] = key;
    result['Authorization'] = 'Bearer ' + key;
    if (extra) Object.assign(result, extra);
    return result;
  }

  function errorMessage(text, fallback) {
    try { var json = JSON.parse(text); return json.message || json.error || fallback; }
    catch (e) { return fallback; }
  }

  async function request(path, options, fallback) {
    var response = await fetch(base + path, options);
    if (!response.ok) throw new Error(errorMessage(await response.text(), fallback));
    if (response.status === 204) return null;
    return response.json();
  }

  return {
    reload: function (table, query) {
      var q = query || '?select=*&order=created_at.desc,id.desc';
      return request('/rest/v1/' + table + q, { headers: headers() }, 'Gagal memuat data ' + table + '.');
    },
    add: function (table, item) {
      return request('/rest/v1/' + table, {
        method: 'POST', headers: headers(), body: JSON.stringify(item)
      }, 'Gagal menyimpan data ' + table + '.').then(function (rows) {
        return Array.isArray(rows) ? rows[0] : rows;
      });
    },
    remove: function (table, id) {
      return request('/rest/v1/' + table + '?id=eq.' + encodeURIComponent(id), {
        method: 'DELETE', headers: headers()
      }, 'Gagal menghapus data ' + table + '.');
    },
    update: function (table, id, item) {
      return request('/rest/v1/' + table + '?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH', headers: headers(), body: JSON.stringify(item)
      }, 'Gagal memperbarui data ' + table + '.');
    },
    removeWhere: function (table, filter) {
      return request('/rest/v1/' + table + '?' + filter, {
        method: 'DELETE', headers: headers()
      }, 'Gagal menghapus data ' + table + '.');
    },
    upload: async function (table, filename, body, contentType) {
      var bucket = buckets[table];
      if (!bucket) throw new Error('Bucket Storage tidak tersedia untuk ' + table + '.');
      var uploadHeaders = { 'Content-Type': contentType || 'application/octet-stream' };
      uploadHeaders['api' + 'key'] = key;
      uploadHeaders['Authorization'] = 'Bearer ' + key;
      var response = await fetch(base + '/storage/v1/object/' + bucket + '/' + filename, {
        method: 'POST', headers: uploadHeaders, body: body
      });
      if (!response.ok) throw new Error(errorMessage(await response.text(), 'Gagal mengunggah file ke Storage.'));
      return base + '/storage/v1/object/public/' + bucket + '/' + filename;
    },
    removeFile: function (table, filename) {
      if (!filename || !buckets[table]) return Promise.resolve();
      var deleteHeaders = {};
      deleteHeaders['api' + 'key'] = key;
      deleteHeaders['Authorization'] = 'Bearer ' + key;
      return request('/storage/v1/object/' + buckets[table] + '/' + filename, {
        method: 'DELETE', headers: deleteHeaders
      }, 'Gagal menghapus file Storage.');
    },
    filename: function (name, extension) {
      return Date.now() + '-' + String(name || 'file').replace(/[^a-z0-9._-]/gi, '-').replace(/\.[^.]+$/, '') + extension;
    }
  };
})();
