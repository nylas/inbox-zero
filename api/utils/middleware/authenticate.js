const Nylas = require("../nylas");

/**
 * Express.js middleware to authenticate the account and pass through
 * nylas information. If authentication fails, it returns an
 * Unauthorized response.
 *
 * Learn more: http://expressjs.com/en/guide/writing-middleware.html
 */
module.exports = async function authenticate(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    req.nylas = Nylas.with(accessToken);
    req.account = await req.nylas.account.get();
    req.account.accessToken = accessToken;

    return next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
