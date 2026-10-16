const fs = require('fs');
const s = fs.readFileSync('js/db.js', 'utf8');
const url = s.match(/url:\s*'([^']+)'/)[1];
const key = s.match(/anonKey:\s*'([^']+)'/)[1];
const H = {};
H['api' + 'key'] = key;
H['Authorization'] = 'Bearer ' + key;
H['Content-Type'] = 'application/json';
H['Prefer'] = 'return=representation';

(async () => {
  const res = await fetch(url + '/rest/v1/kepemimpinan', {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      name: 'Uji Coba Schema',
      position: 'Tester',
      photo_url: 'https://test.invalid/x.webp',
      photo_name: 'x.webp',
      sort_order: 99,
      is_active: true
    })
  });
  console.log('INSERT status', res.status);
  const text = await res.text();
  console.log('INSERT response', text);
  if (res.ok) {
    const id = JSON.parse(text)[0].id;
    const del = await fetch(url + '/rest/v1/kepemimpinan?id=eq.' + id, { method: 'DELETE', headers: H });
    console.log('CLEANUP', del.status, (await del.text()).slice(0, 200));
  }
})();
