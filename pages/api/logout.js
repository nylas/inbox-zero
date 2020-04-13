import Nylas from "../../utils/nylas";
import protect from "../../middleware/protect";
import cookie from "cookie";

/**
 * Revokes the access token for the current user and deletes the cookie
 * token, logging the user out of Inbox Zero.
 */
export default protect(
  async function logout(req, res) {
    try {
      if (req.account) {
        // get top level nylas account
        const account = await Nylas.accounts.find(req.account.id);
        // remove our access
        account.revokeAll();
      }
    } catch (e) {
      console.log(e);
    }

    // delete the token cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        expires: new Date(1),
        path: "/"
      })
    );
    // redirect the user to the login page
    res.writeHead(302, { Location: "/login" });
    return res.end();
  },
  { reject: false }
);
