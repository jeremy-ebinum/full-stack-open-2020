import { login, createBlog } from "./utils";

describe("App ", function() {
  let user;
  let validBlog;

  before(function() {
    user = {
      name: "Test User",
      username: "test_username",
      password: "test_password",
    };
    validBlog = {
      title: "Test Blog Title",
      author: "Test Blog Author",
      url: "http://site.com",
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

  it("user can login", function() {
    login("test_username", "test_password");

    const names = `(${user.username}|${user.name})`;
    const notificationRegex = new RegExp(`logged|signed (.*)?${names}`, "i");
    cy.contains(notificationRegex);
    cy.get("[data-testid='Home_blogs']").should("be.visible");
  });

  describe("when logged in", function() {
    beforeEach(function() {
      login("test_username", "test_password");
    });

    it("user can be logged out", function() {
      cy.get("[data-testid='NavBar_logoutBtn']").click();
      cy.contains(/(logged|signed) out/i);
      cy.get("[data-testid='Login_form']").should("be.visible");
    });

    it("a valid blog can be created", function() {
      cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();
      createBlog(validBlog);
      const blogTitleRegex = new RegExp(`${validBlog.title.slice(0, 10)}(.*)?`);
      cy.contains(blogTitleRegex);
    });

    describe("and a blog is created", function() {
      let blogId;
      beforeEach(function() {
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();
        createBlog(validBlog);
        cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
          (res) => {
            blogId = res.body[0].id;
          }
        );
      });

      it("clicking the blog routes to a Blog view", function() {
        cy.get(`[data-testid="BlogList_Blog_${blogId}"]`).click();
        cy.location().should((loc) => {
          expect(loc.pathname).to.eq(`/blogs/${blogId}`);
        });
      });
    });
  });
});
