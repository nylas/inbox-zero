const jwt = require("jsonwebtoken");
const Nylas = require("./utils/nylas");
const cache = require("./utils/cache");

/**
 * Description: Revokes the access token for the current user and
 *              clears the accessToken cookie, logging the user out
 *              of Inbox Zero.
 * Endpoint:    GET /api/logout
 * Redirects:   /
 */
module.exports = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { emailAddress } = jwt.verify(token, process.env.JWT_SECRET);
    const accessToken = await cache.get(emailAddress);
    if (accessToken) {
      const nylas = Nylas.with(accessToken);
      const account = await nylas.account.get();

      if (account) {
        // get top-level nylas account and revoke our access
        const fullAccount = await Nylas.accounts.find(account.id);
        await fullAccount.revokeAll();
      }
    }
  } catch (error) {
    console.log(error);
  }

  // delete the token cookie
  res.clearCookie("token", { path: "/" });
  return res.redirect("/login");
};
