import { uiLogin, uiCreateBlog } from "../support/utils";

describe("App ", function() {
  beforeEach(function() {
    cy.fixture("users.json").as("users");
    cy.fixture("blogs.json").as("blogs");

    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.get("@users").then((users) => {
      const user = users[0];
      cy.request("POST", "http://localhost:3003/api/users/", user).then(
        (res) => {
          cy.wrap(res.body.id).as("userId");
        }
      );
    });

    cy.visit("/");
  });

  it("first time visit displays a login page", function() {
    cy.get("[data-testid='Login_form']");
    cy.get("[data-testid='Login_username']").should("be.visible");
    cy.get("[data-testid='Login_password']").should("be.visible");
    cy.get("[data-testid='Login_submitButton']").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("user can login", function() {
    cy.get("@users").then((users) => {
      const user = users[0];
      uiLogin(user.username, user.password);

      const names = `(${user.username}|${user.name})`;
      const notificationRegex = new RegExp(`logged|signed (.*)?${names}`, "i");

      cy.contains(notificationRegex);
      cy.get("[data-testid='Home_blogs']");
    });
  });

  describe("when logged in", function() {
    beforeEach(function() {
      uiLogin("test_username", "test_password");
    });

    it("user can be logged out", function() {
      cy.get("[data-testid='NavBar_logoutBtn']").click();
      cy.contains(/(logged|signed) out/i);
      cy.get("[data-testid='Login_form']");
      cy.url().should("include", "/login");
    });

    it("NavBar links route to correct views", function() {
      cy.get("[data-testid='NavBar_blogsLink']").click();
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);

      cy.get("[data-testid='NavBar_usersLink']").click();
      cy.url().should("eq", `${Cypress.config().baseUrl}/users`);
    });

    describe("within the blogs view at /", function() {
      it("a valid blog can be created", function() {
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();
        cy.get("@blogs").then((blogs) => {
          const blog = blogs[0];
          cy.server();
          cy.route("POST", "/api/blogs").as("createBlogReq");
          uiCreateBlog(blog);

          cy.get("@createBlogReq")
            .its("response.body")
            .then((createdBlog) => {
              cy.get(`[data-testid="BlogList_blogLink_${createdBlog.id}"]`);
            });
        });
      });

      it("clicking on a created blog routes to a Blog view", function() {
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();

        cy.get("@blogs").then((blogs) => {
          const blog = blogs[0];
          uiCreateBlog(blog);
        });

        cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
          (res) => {
            const blogId = res.body[0].id;
            cy.get(`[data-testid="BlogList_blogLink_${blogId}"]`).click();
            cy.url().should("include", `/blogs/${blogId}`);
          }
        );
      });
    });

    describe("within the view of a created Blog at /blogs/:id", function() {
      beforeEach(function() {
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();

        cy.get("@blogs").then((blogs) => {
          const blog = blogs[0];
          cy.server();
          cy.route("POST", "/api/blogs").as("createBlogReq");
          uiCreateBlog(blog);

          cy.get("@createBlogReq")
            .its("response.body")
            .then((createdBlog) => {
              cy.wrap(createdBlog).as("createdBlog");
              const { id } = createdBlog;
              cy.get(`[data-testid="BlogList_blogLink_${id}"]`).click();
            });
        });
      });

      it("the Blog can be liked", function() {
        cy.get("@createdBlog")
          .its("likes")
          .then((likes) => {
            cy.get("[data-testid='Blog_likesTxt']").as("blogLikesTxt");
            cy.get("@blogLikesTxt").should("contain.text", likes);
            cy.get("[data-testid='Blog_likeButton']").click();
            cy.get("@blogLikesTxt").should("contain.text", likes + 1);
          });
      });

      it("the Blog can be deleted", function() {
        cy.get("[data-testid='Blog_deleteButton']").click();
        cy.location()
          .its("pathname")
          .should("eq", "/");

        cy.get("@createdBlog")
          .its("id")
          .then((id) => {
            cy.get("[data-testid='BlogList_container']").within(() => {
              cy.get(`[data-testid="BlogList_blogLink_${id}"]`).should(
                "not.exist"
              );
            });
          });
      });

      it("a comment can be added to the blog", function() {
        const comment = "Test Comment";
        cy.get("[data-testid='Comments_input']").type(comment);
        cy.get("[data-testid='Comments_submitButton']").click();
        cy.reload();
        cy.get("[data-testid='Comments_list']").within(() => {
          cy.contains(comment);
        });
      });
    });

    describe("within the users view at /users", function() {
      beforeEach(function() {
        cy.get("[data-testid='NavBar_usersLink']").click();
      });

      it("a link routes to a detailed view for each created user", function() {
        cy.request("GET", "http://localhost:3003/api/testing/users").then(
          (res) => {
            const user = res.body[0];
            cy.get(`[data-testid="Users_userLink_${user.id}"]`).click();
            cy.location()
              .its("pathname")
              .should("eq", `/users/${user.id}`);
          }
        );
      });
    });
  });
});
