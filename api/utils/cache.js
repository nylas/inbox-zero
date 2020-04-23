const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../../.data/");
const file = path.join(dir, "cache.json");

// Create the .data directory and cache.json file, if they don't exist
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

if (fs.existsSync(file)) {
  fs.writeFileSync(file, "{}");
}

const adapter = new FileSync(file);
const cache = low(adapter);

module.exports = {
  set(emailAddress, accessToken) {
    return cache.set([emailAddress], accessToken).write();
  },
  get(emailAddress) {
    return cache.get([emailAddress]).value();
  }
};
