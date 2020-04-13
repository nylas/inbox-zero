const withImages = require("next-images");
module.exports = withImages({
  env: {
    NYLAS_ID: process.env.NYLAS_ID,
    API_URL: process.env.API_URL
  }
});
