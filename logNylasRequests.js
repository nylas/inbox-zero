/**
 * This file wraps the http.request and https.request methods
 * to log all outgoing requests to api.nylas.com
 *
 * Sample output:
 * ```
 * GET /account
 * Host: api.nylas.com
 * Content-Type: application/json
 * Authorization: Basic AOPui****
 * ````
 */
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

    // Call original request function and pass through the results
    return original.apply(this, arguments);
  };
}

wrapRequestMethod(http);
wrapRequestMethod(https);
