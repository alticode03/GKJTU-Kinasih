// ==================== SUPABASE CONFIG (Placeholder) ====================
window.SUPABASE_CONFIG = {
  url: 'https://rqswwfkkqaqphdnygsjw.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc3d3ZmtrcWFxcGhkbnlnc2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNzQ1NjQsImV4cCI6MjEwNzY1MDU2NH0.fiiYsKL57rgbAazben2n3uwRkDGwMCKr7XFcP8PgjnI'
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