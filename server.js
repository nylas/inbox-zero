const http = require("http");
const https = require("https");

function green(str) {
  return "\x1b[32m" + str + "\x1b[0m";
}
function blue(str) {
  return "\x1b[36m" + str + "\x1b[0m";
}
function wrapRequestMethod(module) {
  const original = module.request;

  module.request = function wrappedRequest(req) {
    if (req.host === "api.nylas.com") {
      const method = req.method;
      const path = req.path;
      const host = req.host;
      const contentType = req.headers["content-type"];
      const authorization = req.headers["authorization"]
        ? `${req.headers["authorization"].substring(0, 11)}****`
        : "";
      const body =
        req.body && req.body !== "{}"
          ? `${JSON.stringify(JSON.parse(req.body), null, 2)}`
          : "";

      console.log(
        `${[
          `${green(method)} ${path}`,
          `${blue("Host")}: ${host}`,
          contentType ? `${blue("Content-Type")}: ${contentType}` : "",
          authorization ? `${blue("Authorization")}: ${authorization}` : "",
          `${body}`
        ]
          .join("\n")
          .trim()}\n`
      );
    }

    return original.apply(this, arguments);
  };
}

wrapRequestMethod(http);
wrapRequestMethod(https);

const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/a", (req, res) => {
    return res.json({
      test: "123"
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
