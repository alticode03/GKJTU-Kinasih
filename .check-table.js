const fs = require('fs');
const s = fs.readFileSync('js/db.js', 'utf8');
const url = s.match(/url:\s*'([^']+)'/)[1];
const key = s.match(/anonKey:\s*'([^']+)'/)[1];
const H = {};
H['api' + 'key'] = key;
H['Authorization'] = 'Bearer ' + key;

(async () => {
  for (const table of ['kepemimpinan']) {
    const res = await fetch(url + '/rest/v1/' + table + '?select=*&limit=1', { headers: H });
    console.log('GET', table, res.status, (await res.text()).slice(0, 400));
  }
})();
