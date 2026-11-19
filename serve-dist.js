const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, 'dist/sistema-de-gestao-administrativa');
const prefix = '/construtora';
const port = Number(process.env.PORT || 8080);

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (requestPath === '/' || requestPath === prefix) {
    res.writeHead(302, { Location: `${prefix}/` });
    res.end();
    return;
  }

  if (!requestPath.startsWith(`${prefix}/`)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const relativePath = requestPath.slice(prefix.length + 1);
  let filePath = path.join(root, relativePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    res.end(content);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`http://127.0.0.1:${port}${prefix}/`);
});
