const thresholds = {
  performance: 50,
  accessibility: 80,
  'first-contentful-paint': 2000,
  'largest-contentful-paint': 3000,
  interactive: 2000,
  seo: 60,
  pwa: 50,
};
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
  cy.lighthouse(thresholds);
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
let connectsid
describe('login spec', () => {
  before(()=>{
    cy.pageload();
    cy.get(':nth-child(1) > [data-testid="floatingInputBorder"] > [data-testid="floatingInputWrapper"] > .flex > .bg-transparent').type('aalrawi', {log: false});
    cy.get(':nth-child(2) > [data-testid="floatingInputBorder"] > [data-testid="floatingInputWrapper"] > .flex > .bg-transparent').type('Autofi12$', {log: false});
    cy.get('.rounded-3').click();
    cy.get('.justify-between > :nth-child(1) > [href="/dealer/deals"]').should('be.visible');
    cy.get('[target="_blank"]').should('be.visible');
    cy.getCookie("connect.sid").then((cookie) => {
      connectsid= cookie.value;
      cy.setCookie('connect.sid', connectsid);
    })
  })
  it('Verify user is able to change vehicle successfully', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.justify-between > :nth-child(1) > [href="/dealer/deals"]').click();
    cy.get('[data-testid="floatingInputWrapper"] > .flex > .bg-transparent').clear('1');
    cy.get('[data-testid="floatingInputWrapper"] > .flex > .bg-transparent').type('134550');
    cy.get('.menu > .justify-between > .justify-end > .items-center').click();
    /* ==== End Cypress Studio ==== */
  })
})
