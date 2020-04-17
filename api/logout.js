const Nylas = require("./utils/nylas");

/**
 * Revokes the access token for the current user and deletes the cookie
 * token, logging the user out of Inbox Zero.
 */
module.exports = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const nylas = Nylas.with(accessToken);
    const account = await req.nylas.account.get();

    if (account) {
      // get top level nylas account
      const account = await Nylas.accounts.find(req.account.id);
      // remove our access
      account.revokeAll();
    }
  } catch (e) {
    console.log(e);
  }

  // delete the token cookie
  res.clearCookie("accessToken", { path: "/" });
  return res.redirect("/login");
};
