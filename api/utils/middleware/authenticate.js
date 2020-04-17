const Nylas = require("../nylas");

module.exports = async function authenticate(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    req.nylas = Nylas.with(accessToken);
    req.account = await req.nylas.account.get();
    req.account.accessToken = accessToken;

    return next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
