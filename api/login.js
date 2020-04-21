const Nylas = require("./utils/nylas");

/**
 * Description: Redirect the user to the Nylas hosted auth page to
 *              complete their authentication
 * Endpoint:    GET /api/login
 * Redirects:   Nylas Hosted Auth
 */
module.exports = async (req, res) => {
  const options = {
    loginHint: req.query.loginHint || "",
    redirectURI: `${req.protocol}://${req.get("host")}/api/authorize`,
    scopes: ["email.read_only", "email.modify", "email.send", "calendar"]
  };

  const authUrl = Nylas.urlForAuthentication(options);

  res.redirect(authUrl);
};
