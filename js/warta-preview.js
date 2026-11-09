function rowWartaWithPreview(item) {
  var pdfUrl = item.pdf_url || item.pdfUrl || item.pdfData;
  var itemJson = JSON.stringify(item).replace(/"/g, '&quot;');
  var photoHtml = '';
  
  if (item.photo_url || item.photoUrl) {
    var photoUrl = item.photo_url || item.photoUrl;
    photoHtml = '<img src="' + photoUrl + '" alt="' + (item.title || 'Warta') + '" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; cursor: pointer;" onclick="openWartaPhotoModal(event, \'' + photoUrl.replace(/'/g, "\\'") + '\', ' + itemJson + ')" title="Klik untuk perbesar">';
  }
  
  var link = (pdfUrl && pdfUrl !== '#')
    ? '<a href="#" class="expand-row-pdf" onclick="openWartaModal(event, ' + itemJson + ')">Lihat Detail</a>'
    : '<span class="expand-row-pdf muted">Lihat detail di gereja</span>';
  
  return '<div class="expand-row" style="cursor:pointer; display: flex; align-items: center; gap: 1rem;" onclick="openWartaModal(event, ' + itemJson + ')">' +
    (photoHtml ? '<div style="flex-shrink: 0;">' + photoHtml + '</div>' : '') +
    '<div class="expand-row-left" style="flex: 1;">'
    + '<span class="expand-row-label">' + (item.date || '') + '</span>'
    + '<span class="expand-row-name">' + (item.title || '') + '</span>'
    + '</div>'
    + link
    + '</div>';
}

function openWartaPhotoModal(event, photoUrl, item) {
  event.stopPropagation();
  
  var modal = document.createElement('div');
  modal.id = 'wartaPhotoModal';
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
  
  var content = document.createElement('div');
  content.style.cssText = 'position: relative; max-width: 90vw; max-height: 90vh; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
  
  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = 'position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; border: none; background: rgba(0,0,0,0.5); color: #fff; font-size: 28px; cursor: pointer; border-radius: 50%; z-index: 10001; transition: background 0.2s;';
  closeBtn.onclick = function() { modal.remove(); };
  closeBtn.onmouseover = function() { closeBtn.style.background = 'rgba(0,0,0,0.7)'; };
  closeBtn.onmouseout = function() { closeBtn.style.background = 'rgba(0,0,0,0.5)'; };
  
  var img = document.createElement('img');
  img.src = photoUrl;
  img.alt = item.title || 'Warta';
  img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
  
  content.appendChild(closeBtn);
  content.appendChild(img);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  modal.onclick = function(e) {
    if (e.target === modal) modal.remove();
  };
}
