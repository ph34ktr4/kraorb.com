const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const server = http.createServer((req, res) => {
  let reqUrl = req.url === '/' ? '/app/index.html' : req.url;
  reqUrl = decodeURIComponent(reqUrl);

  const filePath = path.join(ROOT, reqUrl);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/html" });
    return res.end("<h1>403 Forbidden</h1>");
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon"
  }[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      return fs.readFile(path.join(ROOT, "app", "error404.html"), (e2, data404) => {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(data404 || "<h1>404 Page Not Found</h1>");
      });
    }

    res.writeHead(200, { "Content-Type": mime });
    res.end(content);
  });
});

server.listen(3000, () => {
  console.log("Website running at http://localhost:3000");
});
