import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const port = Number(process.env.PORT || 5173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!(pathname === '/' || pathname === '/index.html' || pathname.startsWith('/src/') || pathname.startsWith('/assets/'))) { res.writeHead(404).end('Not found'); return; }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || pathname.split('/').some(p => p.startsWith('.'))) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404).end('Not found'); }
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') console.error(`${port}번 포트가 사용 중입니다. 기존 서버에서 Ctrl+C를 누르거나 PowerShell에서 $env:PORT=5175 설정 후 npm run dev를 실행하세요.`);
  else console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`DITTO: http://localhost:${port}`));

