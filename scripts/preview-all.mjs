import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const port = Number(process.env.PORT || 5182);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); res.end(); return; }
    const exists = await stat(file).catch(() => null);
    if (exists?.isDirectory()) file = path.join(file, 'index.html');
    else if (!exists) {
      if (path.extname(pathname)) { res.writeHead(404); res.end('Not found'); return; }
      file = path.join(root, pathname === '/admin' || pathname.startsWith('/admin/') ? 'admin/index.html' : pathname === '/webapp' || pathname.startsWith('/webapp/') ? 'webapp/index.html' : 'index.html');
    }
    const data = await readFile(file); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data);
  } catch { res.writeHead(404); res.end('Build all applications before starting the preview.'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Combined preview: http://127.0.0.1:${port}/admin/`));
