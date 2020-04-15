import Nylas from "../../utils/nylas";

/**
 * Redirect the user to the Nylas hosted auth page to complete their authentication
 */
export default async (req, res) => {
  const options = {
    loginHint: req.query.login_hint || "",
    redirectURI: "http://localhost:3000/api/authorize",
    scopes: ["email.read_only", "email.modify", "email.send", "calendar"]
  };

  const authUrl = Nylas.urlForAuthentication(options);

  // redirect the user to the hosted auth page
  res.writeHead(302, { Location: authUrl });

  return res.end();
};
