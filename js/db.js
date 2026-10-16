// ==================== SUPABASE CONFIG (Placeholder) ====================
window.SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL_HERE',
  anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
};

// ==================== DATA LAYER ====================
// localStorage sementara; implementasi Supabase dapat menggantikan file ini.
var DB = {
  get: function(key) { return JSON.parse(localStorage.getItem('church_' + key) || '[]'); },
  set: function(key, data) { localStorage.setItem('church_' + key, JSON.stringify(data)); },
  add: function(key, item) { var d = this.get(key); item.id = Date.now() + ''; d.push(item); this.set(key, d); return item; },
  update: function(key, id, updates) { var d = this.get(key); var i = d.findIndex(function(x){return x.id===id}); if(i>-1){Object.assign(d[i],updates);this.set(key,d);return d[i]} return null; },
  remove: function(key, id) { var d = this.get(key); var i = d.findIndex(function(x){return x.id===id}); if(i>-1){d.splice(i,1);this.set(key,d);return true} return false; }
};