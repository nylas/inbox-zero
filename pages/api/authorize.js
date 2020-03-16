import Nylas from "../../utils/nylas";
import redis from "../../utils/redis";
import jwt from "jsonwebtoken";
import cookie from "cookie";

/**
 * After the user successfully signs in via Nylas hosted auth, this
 * endpoint is sent a code which will be exchanged for an access token
 * to the user's mailbox. We store the token in redis, and set a cookie
 * that we will use to verify future API requests.
 */
export default async (req, res) => {
  const code = req.query.code;

  // exchange our code for Nylas access token
  const accessToken = await Nylas.exchangeCodeForToken(code);

  // if we didn't get an acess token back, send the user back to try again
  if (!accessToken) {
    res.writeHead(302, { Location: "/login" });

    return res.end();
  }

  // with our new access token, get the email address of the user
  const nylas = Nylas.with(accessToken);
  const { emailAddress } = await nylas.account.get();

  // store the access token in our redis cache
  await redis.set(emailAddress, accessToken);

  // create a cookie with a JSON Web Token (JWT) so we can authenticate API requests
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", jwt.sign({ emailAddress }, process.env.SECRET), {
      httpOnly: false,
      path: "/"
    })
  );

  // redirect the user to their inbox
  res.writeHead(302, { Location: "/" });

  return res.end();
};
