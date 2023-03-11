const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require('cypress-audit');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://dealerportal-qa.santanderconsumerusa.com/dealer',
    experimentalStudio: true,
    chromeWebSecurity: false,
    viewportWidth: 1300,
    viewportHeight: 960,
    defaultCommandTimeout: 50000,
    setupNodeEvents (on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on('task', {
        lighthouse: lighthouse(),
      });
    }
  },

});


