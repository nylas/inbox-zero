const Nylas = require("./utils/nylas");

/**
 * Description: Revokes the access token for the current user and
 *              clears the accessToken cookie, logging the user out
 *              of Inbox Zero.
 * Endpoint:    GET /api/logout
 * Redirects:   /
 */
module.exports = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const nylas = Nylas.with(accessToken);
    const account = await nylas.account.get();

    if (account) {
      // get top-level nylas account and revoke our access
      const account = await Nylas.accounts.find(account.id);
      await account.revokeAll();
    }
  } catch (error) {
    console.log(error);
  }

  // delete the token cookie
  res.clearCookie("accessToken", { path: "/" });
  return res.redirect("/login");
};
