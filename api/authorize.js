const Nylas = require("./utils/nylas");

/**
 * After the user successfully signs in via Nylas hosted auth, this
 * endpoint is sent a code which will be exchanged for an access token
 * to the user's mailbox. We store the token in redis, and set a cookie
 * that we will use to verify future API requests.
 */
module.exports = async (req, res) => {
  try {
    const code = req.query.code;

    // exchange our code for Nylas access token
    const accessToken = await Nylas.exchangeCodeForToken(code);

    // if we didn't get an acess token back, send the user back to try again
    if (!accessToken) {
      return res.redirect(
        `/login?message=${encodeURIComponent(
          "We couldn't access your account. Please try again."
        )}`
      );
    }

    // with our new access token, get the email address of the user
    const nylas = Nylas.with(accessToken);
    const { emailAddress } = await nylas.account.get();

    // create a cookie with a so we can authenticate API requests
    res.cookie("accessToken", accessToken, { path: "/", httpOnly: false });

    // redirect the user to their inbox
    return res.redirect("/");
  } catch (e) {
    console.log(e);

    return res.redirect(
      `/login?message=${encodeURIComponent(
        "Something went wrong. Please try again."
      )}`
    );
  }
};
