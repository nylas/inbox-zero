/**
 * Hello! 👋
 *
 * This is the entry file for this project. It starts up the Next.js
 * app and express.js server.
 *
 * To run `npm run dev` to get started.
 *
 * Learn more: https://github.com/nylas/inbox-zero
 */

const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authenticate = require("./api/utils/middleware/authenticate");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./app" });
const appHandler = app.getRequestHandler();
const api = express();

if (dev) {
  require("./logNylasRequests");
}

/** authorization */
api.get("/login", require("./api/login"));
api.get("/authorize", require("./api/authorize"));
api.get("/logout", require("./api/logout"));

/** account-level management */
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

  /** Serve the API endpoints with the prefix "/api" */
  server.use("/api", api);

  /** Serve the next.js app for all other requests */
  server.all("*", (req, res) => {
    return appHandler(req, res);
  });

  /** Start the server */
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
