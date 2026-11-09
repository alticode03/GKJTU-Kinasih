async function renderAdminGaleri() {
  try {
    var items = [];
    try { items = await DB.reload('galeri', '?select=*&order=id.desc'); } catch (err) { }
    var container = document.getElementById('adminGaleriList');
    container.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">Belum ada galeri.</p>';
      return;
    }
    items.forEach(function(item) {
      var row = document.createElement('div');
      row.style.cssText = 'background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem; display: flex; gap: 1rem; align-items: flex-start;';
      var thumbnailHtml = '';
      if (item.photo_url) {
        thumbnailHtml = '<img src="' + item.photo_url + '" alt="' + (item.title || 'Galeri') + '" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">';
      }
      row.innerHTML = thumbnailHtml +
        '<div style="flex: 1;">' +
        '<div style="font-weight: 600; margin-bottom: 0.25rem;">' + (item.title || 'Tanpa judul') + '</div>' +
        '<div style="font-size: 0.9rem; color: var(--muted); margin-bottom: 0.5rem;">' + (item.description || '') + '</div>' +
        '<div style="display: flex; gap: 0.5rem;">' +
        '<button type="button" class="btn-soft" onclick="editGaleri(' + item.id + ')">Edit</button>' +
        '<button type="button" class="btn-soft" style="color: #d32f2f;" onclick="deleteGaleri(' + item.id + ')">Hapus</button>' +
        '</div>' +
        '</div>';
      container.appendChild(row);
    });
  } catch (err) {
    showToast('Gagal memuat galeri: ' + err.message, 'error');
  }
}

function saveGaleri(e) {
  e.preventDefault();
  var button = document.getElementById('saveGaleriButton');
  var title = document.getElementById('galeriTitle').value.trim();
  var description = document.getElementById('galeriDesc').value.trim();
  var id = document.getElementById('galeriId').value.trim();

  if (!title || !description) {
    showToast('Judul dan deskripsi tidak boleh kosong', 'error');
    return;
  }

  if (selectedGaleriPhotos.length === 0 && !id) {
    showToast('Pilih minimal 1 foto untuk galeri baru', 'error');
    return;
  }

  button.disabled = true;
  var formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);

  if (selectedGaleriPhotos.length > 0) {
    selectedGaleriPhotos.forEach(function(photo, index) {
      formData.append('photos', photo.file);
    });
  }

  if (id) {
    formData.append('id', id);
  }

  fetch('/api/upload-galeri', {
    method: 'POST',
    body: formData
  }).then(function(response) {
    return response.json();
  }).then(async function(result) {
    if (result.success) {
      showToast('Galeri berhasil ' + (id ? 'diperbarui' : 'ditambahkan'), 'success');
      document.getElementById('galeriId').value = '';
      document.getElementById('galeriTitle').value = '';
      document.getElementById('galeriDesc').value = '';
      selectedGaleriPhotos = [];
      renderGaleriPhotoPreviews();
      await renderAdminGaleri();
      document.getElementById('panel-galeri').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showToast(result.error || 'Gagal menyimpan galeri', 'error');
    }
  }).catch(function(error) {
    showToast('Error: ' + error.message, 'error');
  }).finally(function() {
    button.disabled = false;
  });
}

async function editGaleri(id) {
  try {
    var data = await DB.reload('galeri', '?id=eq.' + id);
    if (!Array.isArray(data) || data.length === 0) {
      showToast('Galeri tidak ditemukan', 'error');
      return;
    }
    var item = data[0];
    document.getElementById('galeriId').value = id;
    document.getElementById('galeriTitle').value = item.title || '';
    document.getElementById('galeriDesc').value = item.description || '';
    selectedGaleriPhotos = [];
    renderGaleriPhotoPreviews();
    document.getElementById('panel-galeri').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    showToast('Gagal memuat galeri: ' + err.message, 'error');
  }
}

function cancelEditGaleri() {
  document.getElementById('galeriId').value = '';
  document.getElementById('galeriTitle').value = '';
  document.getElementById('galeriDesc').value = '';
  selectedGaleriPhotos = [];
  renderGaleriPhotoPreviews();
}

async function deleteGaleri(id) {
  if (!confirm('Yakin ingin menghapus galeri ini?')) return;
  try {
    await DB.remove('galeri', id);
    showToast('Galeri berhasil dihapus', 'success');
    await renderAdminGaleri();
  } catch (err) {
    showToast('Gagal menghapus galeri: ' + err.message, 'error');
  }
}

var selectedGaleriPhotos = [];

document.addEventListener('DOMContentLoaded', function() {
  var galeriPhotosInput = document.getElementById('galeriPhotos');
  if (galeriPhotosInput) {
    galeriPhotosInput.addEventListener('change', function(e) {
      var files = Array.from(e.target.files || []);
      Promise.all(files.map(function(file) {
        return ImageCompressor.compress(file).then(function(result) {
          selectedGaleriPhotos.push({
            file: result,
            name: file.name,
            originalSize: file.size,
            size: result.size
          });
        }).catch(function(error) {
          showToast('Gagal kompres foto: ' + error.message, 'error');
        });
      })).then(function() {
        renderGaleriPhotoPreviews();
        if (galeriPhotosInput) galeriPhotosInput.value = '';
      });
    });
  }
});

function renderGaleriPhotoPreviews() {
  var container = document.getElementById('galeriPhotoPreview');
  if (!container) return;
  container.innerHTML = '';
  selectedGaleriPhotos.forEach(function(photo, index) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      var div = document.createElement('div');
      div.style.cssText = 'position: relative; width: 90px; height: 90px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 2px 6px rgba(0,0,0,0.08);';
      div.innerHTML = '<img src="' + evt.target.result + '" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">' +
        '<button type="button" style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.65); color: #fff; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;" onclick="removeSelectedGaleriPhoto(' + index + ')" title="Hapus">×</button>';
      container.appendChild(div);
    };
    reader.readAsDataURL(photo.file);
  });
}

function removeSelectedGaleriPhoto(index) {
  selectedGaleriPhotos.splice(index, 1);
  renderGaleriPhotoPreviews();
}
