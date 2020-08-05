/**
 * Hello! 👋
 *
 * This is the entry file for this project. It starts up the Next.js
 * app and express.js server.
 *
 * Run `npm run dev` to get started.
 *
 * Learn more: https://github.com/nylas/inbox-zero
 */
require("dotenv").config();

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

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  server.use(bodyParser.json());

  /** Show a warning when the env vars aren't configured */
  if (!process.env.NYLAS_ID || !process.env.NYLAS_SECRET) {
    server.use("*", (req, res) => {
      res.send(`
        <p>
          Add your Nylas App ID and Secret in the .env file to get started. <br>
          Don't have a Nylas account? <a href="https://dashboard.nylas.com/register">Try it free »</a>
        </p>
        <style>
        body { display: flex; background: #000000; color: white; border-top: 10px solid #00E5C0; margin: 0; }
        p    { font: 24px bold -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;
               margin: auto 0;
               line-height: 1.8;
               padding: 0 8rem 4rem; }
        a    { color: #00e5bf; }
        </style>
      `);
    });
  }

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
