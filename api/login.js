const Nylas = require("./utils/nylas");

/**
 * Redirect the user to the Nylas hosted auth page to complete their authentication
 */
module.exports = async (req, res) => {
  const options = {
    loginHint: req.query.login_hint || "",
    redirectURI: "http://localhost:3000/api/authorize",
    scopes: ["email.read_only", "email.modify", "email.send", "calendar"]
  };

  const authUrl = Nylas.urlForAuthentication(options);

  res.redirect(authUrl);
};
