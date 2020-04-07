const jwt = require("jsonwebtoken");
const redis = require("../redis");
const Nylas = require("../nylas");

export default function protect(handler, { reject = true } = {}) {
  return async (req, res, ...restArgs) => {
    try {
      const token = req.cookies.token;
      const { emailAddress } = jwt.verify(token, process.env.JWT_SECRET);
      req.nylas = Nylas.with(await redis.get(emailAddress));
      req.account = await req.nylas.account.get();

      return handler(req, res, ...restArgs);
    } catch (err) {
      if (reject) {
        res.status(401).json({ error: "Unauthorized" });
      }

      return handler(req, res, ...restArgs);
    }
  };
}
