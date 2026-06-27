import http from "node:http";

const PORT = Number(process.env.PORT) || 3000;

const requestListener: http.RequestListener = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Proxy is running", url: req.url }));
};

const server = http.createServer(requestListener);
server.listen(PORT, () => {
  console.log(`🚀 Proxy server listening on http://localhost:${PORT}`);
});
