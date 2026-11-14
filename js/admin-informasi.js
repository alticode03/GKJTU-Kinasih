function formatText(command) {
  document.execCommand(command, false, null);
  document.getElementById('informasiContent').focus();
}

function insertTab() {
  var editor = document.getElementById('informasiContent');
  editor.focus();
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var tabNode = document.createTextNode('\t');
      range.insertNode(tabNode);
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

function getTodayDate() {
  var today = new Date();
  return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}

async function saveInformasi(e) {
  e.preventDefault();
  var button = document.getElementById('saveInformasiButton');
  var date = document.getElementById('informasiDate').value.trim();
  var title = document.getElementById('informasiTitle').value.trim();
  var content = document.getElementById('informasiContent').innerHTML.trim();
  var id = document.getElementById('informasiId').value.trim();
  var today = getTodayDate();

  if (!date || !title || !content) {
    showToast('Tanggal, judul, dan isi tidak boleh kosong', 'error');
    return;
  }

  var finalStatus = date <= today ? 'published' : 'pending';

  button.disabled = true;
  try {
    var item = { date: date, title: title, content: content };
    if (!id) {
      item.status = finalStatus;
      await DB.add('informasi', item);
      showToast('Informasi berhasil ditambahkan', 'success');
    } else {
      await DB.update('informasi', id, item);
      showToast('Informasi berhasil diperbarui', 'success');
    }
    document.getElementById('informasiDate').value = today;
    document.getElementById('informasiTitle').value = '';
    document.getElementById('informasiContent').innerHTML = '';
    document.getElementById('informasiId').value = '';
    document.getElementById('informasiFormTitle').textContent = 'Tambah Informasi';
    document.getElementById('cancelEditInformasi').style.display = 'none';
    await loadInformasi();
  } catch (err) {
    showToast(err.message || 'Gagal menyimpan informasi', 'error');
  } finally {
    button.disabled = false;
  }
}

async function loadInformasi() {
  try {
    var data = await DB.reload('informasi', '?select=*&order=date.desc,id.desc');
    var container = document.getElementById('adminInformasiList');
    container.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">Belum ada informasi.</p>';
      return;
    }
    data.forEach(function(item) {
      var row = document.createElement('div');
      row.style.cssText = 'background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;';
      var content = document.createElement('div');
      var title = document.createElement('div');
      title.style.cssText = 'font-weight: 600; margin-bottom: 0.25rem;';
      title.appendChild(document.createTextNode(item.title || 'Tanpa judul'));
      var badge = document.createElement('span');
      badge.textContent = item.status === 'published' ? 'Published' : 'Pending';
      badge.style.cssText = 'display:inline-block;padding:.25rem .75rem;border-radius:4px;font-size:.8rem;font-weight:600;margin-left:.5rem;background:' + (item.status === 'published' ? 'var(--primary-light)' : '#fff3cd') + ';color:' + (item.status === 'published' ? 'var(--primary-dark)' : '#856404') + ';';
      title.appendChild(badge);
      var date = document.createElement('div');
      date.textContent = item.date || '';
      date.style.cssText = 'font-size:.9rem;color:var(--muted);';
      content.append(title, date);
      var actions = document.createElement('div');
      actions.style.cssText = 'display:flex;gap:.5rem;';
      var edit = document.createElement('button'); edit.type = 'button'; edit.className = 'btn-soft'; edit.textContent = 'Edit'; edit.addEventListener('click', function() { editInformasi(item.id); });
      var remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-soft'; remove.textContent = 'Hapus'; remove.style.color = '#8f432b'; remove.addEventListener('click', function() { deleteInformasi(item.id); });
      actions.append(edit, remove); row.append(content, actions);
      container.appendChild(row);
    });
  } catch (err) {
    showToast('Gagal memuat informasi: ' + err.message, 'error');
  }
}

async function editInformasi(id) {
  try {
    var data = await DB.reload('informasi', '?id=eq.' + id);
    if (!Array.isArray(data) || data.length === 0) {
      showToast('Informasi tidak ditemukan', 'error');
      return;
    }
    var item = data[0];
    document.getElementById('informasiId').value = id;
    document.getElementById('informasiDate').value = item.date || '';
    document.getElementById('informasiTitle').value = item.title || '';
    document.getElementById('informasiContent').innerHTML = item.content || '';
    document.getElementById('informasiFormTitle').textContent = 'Edit Informasi';
    document.getElementById('cancelEditInformasi').style.display = 'inline-block';
    document.getElementById('panel-informasi').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    showToast('Gagal memuat informasi: ' + err.message, 'error');
  }
}

function cancelEditInformasi() {
  var today = getTodayDate();
  document.getElementById('informasiId').value = '';
  document.getElementById('informasiDate').value = today;
  document.getElementById('informasiTitle').value = '';
  document.getElementById('informasiContent').innerHTML = '';
  document.getElementById('informasiFormTitle').textContent = 'Tambah Informasi';
  document.getElementById('cancelEditInformasi').style.display = 'none';
}

async function deleteInformasi(id) {
  if (!confirm('Yakin ingin menghapus informasi ini?')) return;
  try {
    await DB.remove('informasi', id);
    showToast('Informasi berhasil dihapus', 'success');
    await loadInformasi();
  } catch (err) {
    showToast('Gagal menghapus informasi: ' + err.message, 'error');
  }
}

async function initInformasiForm() {
  var today = getTodayDate();
  document.getElementById('informasiDate').value = today;
}
