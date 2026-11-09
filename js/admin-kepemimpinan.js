// Admin Kepengurusan - CRUD dengan Edit
var editingLeaderId = null;
var selectedLeaderPhotos = {};

async function renderAdminKepemimpinan() {
  var items = [];
  try { 
    items = await DB.reload('kepemimpinan', '?select=*&is_active=eq.true&order=position.asc,sort_order.asc,created_at.asc'); 
  } catch (error) { 
    showToast(error.message, 'error'); 
  }
  
  var html = '';
  items.forEach(function(item) {
    var photoThumb = item.photo_url ? '<img src="' + item.photo_url + '" alt="Foto ' + escapeHtml(item.name) + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;margin-right:0.5rem;">' : '';
    html += '<div class="admin-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 0.75rem;">' +
      '<div style="display: flex; align-items: center; flex: 1;">' + photoThumb + 
      '<div><strong>' + escapeHtml(item.name) + '</strong> <span style="color:var(--muted); font-size:.85rem;">(' + escapeHtml(item.position) + ' • urutan ' + item.sort_order + ')</span></div>' +
      '</div>' +
      '<div style="display: flex; gap: 0.5rem;">' +
      '<button class="btn-sm btn-soft" onclick="editLeader(\'' + item.id + '\')">Edit</button>' +
      '<button class="btn-sm btn-danger" onclick="deleteItem(\'kepemimpinan\',\'' + item.id + '\')">Hapus</button>' +
      '</div></div>';
  });
  document.getElementById('adminKepemimpinanList').innerHTML = html || '<p style="color:var(--muted);">Belum ada data kepemimpinan.</p>';
}

function buildLeaderFields() {
  var position = document.getElementById('leaderPosition').value.trim() || 'Jabatan';
  var count = Math.min(30, Math.max(1, parseInt(document.getElementById('leaderCount').value, 10) || 1));
  var container = document.getElementById('leaderFields');
  var oldValues = Array.prototype.map.call(container.querySelectorAll('.leader-name-input'), function(input) { return input.value; });
  var html = '';
  
  for (var i = 0; i < count; i++) {
    html += '<div class="leader-person-field" style="padding: 1rem; background: var(--bg-alt); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 0.75rem;">' +
      '<label for="leaderName' + i + '" style="display: block; margin-bottom: 0.5rem;"><strong>Nama Lengkap ' + escapeHtml(position) + ' ' + (i + 1) + '</strong></label>' +
      '<input class="leader-name-input" id="leaderName' + i + '" type="text" required maxlength="120" placeholder="Nama lengkap ' + escapeHtml(position) + ' ' + (i + 1) + '" style="width: 100%; margin-bottom: 0.75rem;">' +
      '<label class="file-input-label leader-photo-label" for="leaderPhoto' + i + '" style="display: block; margin-bottom: 0.5rem;">Pilih foto</label>' +
      '<input id="leaderPhoto' + i + '" type="file" accept="image/jpeg,image/png,image/webp" class="file-input leader-photo-input" data-index="' + i + '" hidden>' +
      '<div id="leaderPhotoPreview' + i + '" class="photo-preview-grid leader-photo-preview"></div>' +
      '</div>';
  }
  container.innerHTML = html;
  container.querySelectorAll('.leader-name-input').forEach(function(input, i) { if (oldValues[i]) input.value = oldValues[i]; });
  container.querySelectorAll('.leader-photo-input').forEach(function(input) { input.addEventListener('change', previewLeaderPhoto); });
}

function previewLeaderPhoto(e) {
  var input = e.target;
  var index = input.getAttribute('data-index');
  var preview = document.getElementById('leaderPhotoPreview' + index);
  preview.innerHTML = '';
  if (!input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(evt) { 
    preview.innerHTML = '<div class="photo-preview-item"><img src="' + evt.target.result + '" alt="Preview foto pengurus" style="max-height: 150px;"></div>'; 
  };
  reader.readAsDataURL(input.files[0]);
}

async function saveKepengurusan(e) {
  e.preventDefault();
  var button = document.getElementById('saveLeaderButton');
  var position = document.getElementById('leaderPosition').value.trim();
  var names = Array.prototype.map.call(document.querySelectorAll('.leader-name-input'), function(input) { return input.value.trim(); });
  button.disabled = true;
  
  try {
    if (editingLeaderId) {
      // Edit mode - update existing leader
      var name = names[0] || '';
      var photo = document.getElementById('leaderPhoto0').files[0];
      var photoUrl = selectedLeaderPhotos[editingLeaderId] || '';
      var photoName = '';
      
      if (photo) {
        var compressed = await ImageCompressor.compress(photo);
        var blob = await (await fetch(compressed.dataUrl)).blob();
        photoName = DB.filename(photo.name, '.webp');
        photoUrl = await DB.upload('kepemimpinan', photoName, blob, 'image/webp');
      }
      
      await DB.update('kepemimpinan', editingLeaderId, { 
        name: name, 
        position: position, 
        photo_url: photoUrl, 
        photo_name: photoName 
      });
      
      showToast('Kepengurusan berhasil diperbarui', 'success');
      cancelEditLeader();
    } else {
      // Add mode - create new leaders
      for (var i = 0; i < names.length; i++) {
        var photo = document.getElementById('leaderPhoto' + i).files[0];
        var photoUrl = '', photoName = '';
        if (photo) {
          var compressed = await ImageCompressor.compress(photo);
          var blob = await (await fetch(compressed.dataUrl)).blob();
          photoName = DB.filename(photo.name, '.webp');
          photoUrl = await DB.upload('kepemimpinan', photoName, blob, 'image/webp');
        }
        await DB.add('kepemimpinan', { 
          name: names[i], 
          position: position, 
          photo_url: photoUrl, 
          photo_name: photoName, 
          sort_order: i, 
          is_active: true 
        });
      }
      showToast('Kepengurusan berhasil disimpan', 'success');
    }
    
    e.target.reset();
    document.getElementById('leaderCount').value = 1;
    selectedLeaderPhotos = {};
    buildLeaderFields();
    await renderAdminKepemimpinan();
  } catch (error) { 
    showToast('Gagal menyimpan kepengurusan: ' + error.message, 'error'); 
  } finally { 
    button.disabled = false; 
  }
}

async function editLeader(id) {
  try {
    var leaders = await DB.reload('kepemimpinan', '?select=*&id=eq.' + encodeURIComponent(id));
    if (!leaders || !leaders[0]) {
      showToast('Data kepengurusan tidak ditemukan', 'error');
      return;
    }
    
    var leader = leaders[0];
    editingLeaderId = id;
    selectedLeaderPhotos[id] = leader.photo_url || '';
    
    document.getElementById('leaderPosition').value = leader.position;
    document.getElementById('leaderCount').value = 1;
    buildLeaderFields();
    
    document.getElementById('leaderName0').value = leader.name;
    
    if (leader.photo_url) {
      var preview = document.getElementById('leaderPhotoPreview0');
      preview.innerHTML = '<div class="photo-preview-item"><img src="' + leader.photo_url + '" alt="Foto ' + escapeHtml(leader.name) + '" style="max-height: 150px;"><small style="display: block; margin-top: 0.5rem; color: var(--muted);">Foto saat ini (upload foto baru untuk mengganti)</small></div>';
    }
    
    var button = document.getElementById('saveLeaderButton');
    var formTitle = document.querySelector('h3:has(+ form[onsubmit*="saveKepengurusan"])');
    if (formTitle) formTitle.textContent = 'Edit Pengurus Gereja';
    button.textContent = 'Perbarui Kepengurusan';
    
    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-soft';
    cancelBtn.textContent = 'Batal Edit';
    cancelBtn.style.marginLeft = '0.5rem';
    cancelBtn.onclick = cancelEditLeader;
    
    var existingCancel = button.parentElement.querySelector('.btn-cancel-edit');
    if (existingCancel) existingCancel.remove();
    
    cancelBtn.className = 'btn-soft btn-cancel-edit';
    button.parentElement.insertBefore(cancelBtn, button.nextSibling);
    
    document.getElementById('panel-kepemimpinan').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showToast('Gagal memuat data kepengurusan: ' + error.message, 'error');
  }
}

function cancelEditLeader() {
  editingLeaderId = null;
  selectedLeaderPhotos = {};
  
  var form = document.querySelector('form[onsubmit*="saveKepengurusan"]');
  form.reset();
  document.getElementById('leaderCount').value = 1;
  buildLeaderFields();
  
  var button = document.getElementById('saveLeaderButton');
  var formTitle = document.querySelector('h3:has(+ form[onsubmit*="saveKepengurusan"])');
  if (formTitle) formTitle.textContent = 'Tambah Pengurus Gereja';
  button.textContent = 'Simpan Kepengurusan';
  
  var cancelBtn = button.parentElement.querySelector('.btn-cancel-edit');
  if (cancelBtn) cancelBtn.remove();
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/[&<>"']/g, function(c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
}
