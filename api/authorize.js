const jwt = require("jsonwebtoken");
const Nylas = require("./utils/nylas");
const cache = require("./utils/cache");

/**
 * Description: After the user successfully authenticates via Nylas
 *              hosted auth, this endpoint is sent a code which we
 *              exchange for an access token to the user's mailbox.
 *              We store the token in a cache and create a signed cooke
 *              that we'll use to lookup up the Nylas access token
 *              verify future API requests.
 * Endpoint:    GET /api/authorize
 * Redirects:   /
 */
module.exports = async (req, res) => {
  try {
    const code = req.query.code;
    const accessToken = await Nylas.exchangeCodeForToken(code);

    // if we didn't get an access token back, send the user back to try again
    if (!accessToken) {
      return res.redirect(
        `/login?message=${encodeURIComponent(
          "We couldn't access your account. Please try again."
        )}`
      );
    }

    // With our new access token, get the account's email address
    const nylas = Nylas.with(accessToken);
    const { emailAddress } = await nylas.account.get();

    // store the access token in our cache
    await cache.set(emailAddress, accessToken);

    // create a cookie with a JSON Web Token (JWT) so we can authenticate API requests
    res.cookie("token", jwt.sign({ emailAddress }, process.env.JWT_SECRET), {
      path: "/",
      httpOnly: false
    });

    // Redirect the user to their inbox
    return res.redirect("/");
  } catch (error) {
    console.log(error);

    return res.redirect(
      `/login?message=${encodeURIComponent(
        "Something went wrong. Please try again."
      )}`
    );
  }
};
