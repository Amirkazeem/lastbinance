const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '');
  if (!p || p === '/') p = 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); res.end('403'); return; }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404); res.end('404'); return; }
    const ct = types[path.extname(f)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  });
}).listen(8778, () => console.log('listening on http://localhost:8778'));
