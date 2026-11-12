var GOOGLE_DRIVE_GALERI_API = 'https://script.google.com/macros/s/AKfycbyKdzDpfpsef-lY-bi_5gz4rMfnuXQntQcg7EpzDKHOK-k6QMBR1UMErYbGQXGxaYrl/exec';
var selectedGaleriThumbnail = null;
var selectedGaleriPhotos = [];

function escapeGaleriHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(char) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
  });
}

async function renderAdminGaleri() {
  try {
    var items = await DB.reload('galeri', '?select=*&order=id.desc');
    var container = document.getElementById('adminGaleriList');
    container.innerHTML = '';
    if (!Array.isArray(items) || !items.length) {
      container.innerHTML = '<p style="color:var(--muted);">Belum ada galeri.</p>';
      return;
    }
    items.forEach(function(item) {
      var row = document.createElement('div');
      row.style.cssText = 'background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:1rem;display:flex;gap:1rem;align-items:flex-start;';
      var thumbnail = item.photo_url ? '<img src="' + escapeGaleriHtml(item.photo_url) + '" alt="' + escapeGaleriHtml(item.title || 'Galeri') + '" style="width:80px;height:80px;object-fit:cover;border-radius:6px;flex-shrink:0;">' : '';
      var driveLink = item.drive_folder_url ? '<a href="' + escapeGaleriHtml(item.drive_folder_url) + '" target="_blank" rel="noopener">Buka folder Drive</a>' : '';
      row.innerHTML = thumbnail + '<div style="flex:1"><div style="font-weight:600;margin-bottom:.25rem">' + escapeGaleriHtml(item.title || 'Tanpa judul') + '</div><div style="font-size:.9rem;color:var(--muted);margin-bottom:.5rem">' + escapeGaleriHtml(item.description || '') + '</div><div style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap"><button type="button" class="btn-soft" onclick="editGaleri(' + item.id + ')">Edit</button><button type="button" class="btn-soft" style="color:#d32f2f" onclick="deleteGaleri(' + item.id + ')">Hapus</button>' + driveLink + '</div></div>';
      container.appendChild(row);
    });
  } catch (err) { showToast('Gagal memuat galeri: ' + err.message, 'error'); }
}

function resetGaleriForm() {
  document.getElementById('galeriId').value = '';
  document.getElementById('galeriTitle').value = '';
  document.getElementById('galeriDesc').value = '';
  document.getElementById('galeriThumbnail').value = '';
  document.getElementById('galeriPhotos').value = '';
  selectedGaleriThumbnail = null;
  selectedGaleriPhotos = [];
  renderGaleriThumbnailPreview();
  renderGaleriPhotoPreviews();
}

async function saveGaleri(e) {
  e.preventDefault();
  var button = document.getElementById('saveGaleriButton');
  var title = document.getElementById('galeriTitle').value.trim();
  var description = document.getElementById('galeriDesc').value.trim();
  var id = document.getElementById('galeriId').value.trim();
  if (!title || !description) return showToast('Judul dan deskripsi tidak boleh kosong', 'error');
  if (!id && (!selectedGaleriThumbnail || !selectedGaleriPhotos.length)) return showToast('Pilih thumbnail dan minimal satu foto galeri', 'error');
  if (id) return showToast('Edit galeri belum mengunggah ulang foto. Hapus lalu buat galeri baru bila dokumentasi perlu diganti.', 'error');

  button.disabled = true;
  var originalText = button.textContent;
  button.textContent = 'Membuat folder dan mengunggah foto...';
  var payload = {
    title: title,
    description: description,
    thumbnail: { name: selectedGaleriThumbnail.name, data: selectedGaleriThumbnail.dataUrl },
    photos: selectedGaleriPhotos.map(function(photo) { return { name: photo.name, data: photo.dataUrl }; })
  };
  try {
    var response = await fetch(GOOGLE_DRIVE_GALERI_API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error('Google Apps Script merespons HTTP ' + response.status);
    var result = await response.json();
    if ((result.status && result.status !== 'success') || result.success === false || !result.folderUrl) throw new Error(result.message || result.error || 'Folder Drive tidak berhasil dibuat.');
    var thumbnailUrl = result.thumbnailUrl || result.photoUrl || (result.thumbnail && (result.thumbnail.url || result.thumbnail.link)) || '';
    if (!thumbnailUrl) throw new Error('Apps Script tidak mengembalikan URL thumbnail.');
    await DB.add('galeri', { title: title, description: description, photo_url: thumbnailUrl, drive_folder_url: result.folderUrl, drive_folder_id: result.folderId || '' });
    resetGaleriForm();
    await renderAdminGaleri();
    showToast('Galeri tersimpan dan folder Drive berhasil dibuat', 'success');
  } catch (error) { showToast('Gagal menyimpan galeri: ' + error.message, 'error'); }
  finally { button.disabled = false; button.textContent = originalText; }
}

async function editGaleri(id) {
  try {
    var data = await DB.reload('galeri', '?id=eq.' + id);
    if (!data.length) throw new Error('Galeri tidak ditemukan');
    document.getElementById('galeriId').value = id;
    document.getElementById('galeriTitle').value = data[0].title || '';
    document.getElementById('galeriDesc').value = data[0].description || '';
    document.getElementById('panel-galeri').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) { showToast(err.message, 'error'); }
}
function cancelEditGaleri() { resetGaleriForm(); }
async function deleteGaleri(id) {
  if (!confirm('Yakin ingin menghapus galeri ini? Folder Drive tidak ikut terhapus.')) return;
  try { await DB.remove('galeri', id); await renderAdminGaleri(); showToast('Galeri berhasil dihapus', 'success'); }
  catch (err) { showToast('Gagal menghapus galeri: ' + err.message, 'error'); }
}

document.addEventListener('DOMContentLoaded', function() {
  var thumbnailInput = document.getElementById('galeriThumbnail');
  var photosInput = document.getElementById('galeriPhotos');
  thumbnailInput.addEventListener('change', function() {
    var file = thumbnailInput.files[0];
    if (!file) return;
    ImageCompressor.compress(file).then(function(result) {
      selectedGaleriThumbnail = { name: file.name.replace(/\.[^.]+$/, '') + '.webp', dataUrl: result.dataUrl };
      renderGaleriThumbnailPreview();
    }).catch(function(error) { showToast('Gagal kompres thumbnail: ' + error.message, 'error'); });
  });
  photosInput.addEventListener('change', function() {
    var files = Array.from(photosInput.files || []).slice(0, 10 - selectedGaleriPhotos.length);
    Promise.all(files.map(function(file) {
      return ImageCompressor.compress(file).then(function(result) {
        selectedGaleriPhotos.push({ name: file.name.replace(/\.[^.]+$/, '') + '.webp', dataUrl: result.dataUrl });
      });
    })).then(renderGaleriPhotoPreviews).catch(function(error) { showToast('Gagal kompres foto: ' + error.message, 'error'); });
  });
});

function renderGaleriThumbnailPreview() {
  var container = document.getElementById('galeriThumbnailPreview');
  container.innerHTML = selectedGaleriThumbnail ? '<img src="' + selectedGaleriThumbnail.dataUrl + '" alt="Preview thumbnail" style="width:90px;height:90px;object-fit:cover;border-radius:8px">' : '';
}
function renderGaleriPhotoPreviews() {
  var container = document.getElementById('galeriPhotoPreview');
  container.innerHTML = selectedGaleriPhotos.map(function(photo, index) {
    return '<div style="position:relative;width:90px;height:90px"><img src="' + photo.dataUrl + '" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:8px"><button type="button" onclick="removeSelectedGaleriPhoto(' + index + ')" style="position:absolute;top:3px;right:3px;border:0;border-radius:50%;width:22px;height:22px;background:#333;color:#fff;cursor:pointer">×</button></div>';
  }).join('');
}
function removeSelectedGaleriPhoto(index) { selectedGaleriPhotos.splice(index, 1); renderGaleriPhotoPreviews(); }
