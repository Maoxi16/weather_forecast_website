// jest-puppeteer.config.js
module.exports = {
  server: {
    command: "node test/server.js",
    port: 3000,
    launchTimeout: 50000,
  },
};
