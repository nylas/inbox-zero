const jwt = require("jsonwebtoken");
const Nylas = require("../utils/nylas");

export default function protect(handler, { reject = true } = {}) {
  return async (req, res, ...restArgs) => {
    try {
      const token = req.cookies.token;
      const { emailAddress, accessToken } = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      req.nylas = Nylas.with(accessToken);
      req.account = await req.nylas.account.get();
      req.account.accessToken = accessToken;

      return handler(req, res, ...restArgs);
    } catch (err) {
      if (reject) {
        res.status(401).json({ error: "Unauthorized" });
      }

      return handler(req, res, ...restArgs);
    }
  };
}
