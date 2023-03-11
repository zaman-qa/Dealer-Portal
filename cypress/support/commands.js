// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-audit/commands';
Cypress.Commands.add("setcookies", (res) => {
  let cookies, ak_bmsc, bm_mi, bm_sv;
  cookies = res.response.headers["set-cookie"][0];
  ak_bmsc = cookies.split(";")[0].replace("ak_bmsc=", "");
  cy.setCookie("ak_bmsc", ak_bmsc, {log: false});
  cookies = res.response.headers["set-cookie"][1];
  bm_mi = cookies.split(";")[0];
  cy.setCookie("bm_mi", bm_mi, {log: false});
  cy.getCookie("bm_sv").then((cookie) => {
    bm_sv = cookie.value;
    cy.setCookie("bm_sv", bm_sv, {log: false});
  });
});
Cypress.Commands.add("pageload", () => {
  cy.intercept({ method: "GET", url: `**/login` }).as("getcookie");
  cy.visit("/login", {
    headers: {
      accept: "application/json, text/plain, */*",
      "user-agent": "axios/0.27.2",
    },
    timeout: 60000,
  });
  cy.get("@getcookie").then((res) => {
    cy.setcookies(res);
  });
  cy.request({
    method: "GET",
    url: "https://dealerportal-qa.santanderconsumerusa.com/csrfToken",
  }).then((resp) => {
    expect(resp.status).to.eq(200);
  });
});
