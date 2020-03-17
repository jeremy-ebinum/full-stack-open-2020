import { login } from "../support/utils";

describe("App ", function() {
  let user;

  before(function() {
    user = {
      name: "Test User",
      username: "test_username",
      password: "test_password",
    };
  });

  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("first time visit displays a login page", function() {
    cy.get("[data-testid='Login_form']").should("be.visible");
  });

  describe("Logging in", function() {
    it("succeeds with correct credentials", function() {
      login(user.username, user.password);

      const names = `(${user.username}|${user.name})`;
      const notificationRegex = new RegExp(`logged|signed (.*)?${names}`, "i");

      cy.contains(notificationRegex);
      cy.get("[data-testid='App_blogs']").should("be.visible");
    });

    it("fails with wrong credentials", function() {
      login("spam", "eggs");

      cy.contains(/invalid|missing|wrong/i)
        .parent("[data-testid^='Alert_']")
        .should("have.css", "background-color", "rgb(131, 49, 37)");

      cy.get("[data-testid='Login_form']").should("be.visible");
      cy.get("[data-testid='App_blogs']").should("not.be.visible");
    });
  });
});
