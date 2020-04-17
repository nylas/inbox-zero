const Nylas = require("./utils/nylas");

/**
 * Description: After the user successfully authenticates via Nylas
 *              hosted auth, this endpoint is sent a code which we
 *              exchange for an access token to the user's mailbox.
 *              We store the token in a cookie that we'll use to
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

    // Create a cookie with the accessToken so we can authenticate future API requests
    res.cookie("accessToken", accessToken, { path: "/", httpOnly: false });

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
