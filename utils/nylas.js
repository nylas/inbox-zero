const Nylas = require("nylas");

Nylas.config({
  clientId: process.env.NYLAS_ID,
  clientSecret: process.env.NYLAS_SECRET
});

module.exports = Nylas;