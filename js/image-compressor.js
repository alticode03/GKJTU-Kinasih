// ==================== IMAGE COMPRESSION (Vanilla JS) ====================
function formatBytes(bytes) {
  if (!bytes) return '0 B';
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2) + ' ' + sizes[i];
}

var ImageCompressor = {
  maxDimension: 1200,
  quality: 0.8,
  mimeType: 'image/webp',
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024,
  validate: function(file) {
    if (!file) return 'File tidak ditemukan.';
    if (file.size === 0) return 'File kosong (0 byte).';
    if (file.size > this.maxFileSize) return 'Ukuran file melebihi 10 MB.';
    if (this.allowedTypes.indexOf(file.type) === -1) return 'Format tidak didukung. Hanya JPG, PNG, dan WebP.';
    return null;
  },
  targetDims: function(w, h) {
    if (w <= this.maxDimension && h <= this.maxDimension) return { w: w, h: h };
    var ratio = w / h;
    return w >= h ? { w: this.maxDimension, h: Math.max(1, Math.round(this.maxDimension / ratio)) } : { w: Math.max(1, Math.round(this.maxDimension * ratio)), h: this.maxDimension };
  },
  compress: function(file) {
    var self = this, err = this.validate(file);
    if (err) return Promise.reject(new Error(err));
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function() { reject(new Error('Gagal membaca file.')); };
      reader.onload = function(evt) {
        var img = new Image();
        img.onerror = function() { reject(new Error('Gagal membaca gambar atau file rusak.')); };
        img.onload = function() {
          try {
            var d = self.targetDims(img.naturalWidth, img.naturalHeight);
            var canvas = document.createElement('canvas');
            canvas.width = d.w; canvas.height = d.h;
            var ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas 2D tidak tersedia.');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, d.w, d.h);
            var dataUrl = canvas.toDataURL(self.mimeType, self.quality);
            var mimeType = dataUrl.substring(5, dataUrl.indexOf(';'));
            if (mimeType !== self.mimeType) throw new Error('Browser belum mendukung WebP.');
            resolve({ dataUrl: dataUrl, mimeType: mimeType, width: d.w, height: d.h, size: Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 3 / 4), originalSize: file.size, compressed: true });
          } catch (e) { reject(e); }
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
};