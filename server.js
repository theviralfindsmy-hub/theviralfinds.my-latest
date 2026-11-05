const http = require("http");
const next = require("next");
const path = require("path");

const dev = true;
const hostname = "127.0.0.1";
const port = 3000;
const dir = path.resolve("G:/THEVIRALFINDS.MY");

process.chdir(dir);
const app = next({ dev, dir, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
