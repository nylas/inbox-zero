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
const app = next({
  dev,
  dir: "./app"
});
const nextHandler = app.getRequestHandler();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const api = express();

/** authorization */
api.get("/login", require("./api/login"));
api.get("/authorize", require("./api/authorize"));
api.get("/logout", require("./api/logout"));

const authenticate = require("./api/utils/middleware/authenticate");

/** account management */
api.get("/account", authenticate, require("./api/account/get"));
api.post("/labels", authenticate, require("./api/labels/create"));

/** threads */
api.get("/threads", authenticate, require("./api/threads/get"));
api.get("/threads/:id", authenticate, require("./api/threads/[id]/get"));
api.put("/threads/:id", authenticate, require("./api/threads/[id]/update"));
api.post("/threads/:id", authenticate, require("./api/threads/[id]/reply"));

/** files */
api.get("/files/:name", authenticate, require("./api/files/download"));
api.delete("/files/:name", authenticate, require("./api/files/delete"));
api.post("/files", authenticate, require("./api/files/upload"));

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  server.use(bodyParser.json());
  server.use("/api", api);

  server.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
