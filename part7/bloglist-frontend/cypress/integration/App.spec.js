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

  describe("Logging in", function() {
    it("succeeds with correct credentials", function() {
      cy.get("@users").then((users) => {
        const user = users[0];
        uiLogin(user.username, user.password);

        const names = `(${user.username}|${user.name})`;
        const regex = new RegExp(`logged|signed (.*)?${names}`, "i");

        cy.contains(regex);
        cy.get("[data-testid='Home_blogs']");
        cy.location().should("have.property", "pathname", "/");
      });
    });

    it("fails with wrong credentials", function() {
      cy.server();
      cy.route("POST", "/api/login").as("failedLoginReq");

      uiLogin("spam", "eggs");

      cy.get("@failedLoginReq").should("have.property", "status", 401);

      cy.contains(/invalid|missing|wrong/i)
        .parent("[data-testid^='Notification_']")
        .should("have.css", "background-color", "rgb(131, 49, 37)");

      cy.location().should("have.property", "pathname", "/login");
      cy.get("[data-testid='Login_form']");
      cy.get("[data-testid='Home_blogs']").should("not.exist");
    });
  });

  describe("when logged in", function() {
    beforeEach(function() {
      cy.server();
      cy.route("POST", "/api/login").as("loginReq");
      uiLogin("test_username", "test_password");
      cy.wait("@loginReq")
        .its("response.body")
        .then((user) => {
          cy.wrap(user).as("loggedInUser");
        });

      cy.location().should("have.property", "pathname", "/");
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

    it("blogs are rendered in descending order of likes", function() {
      cy.location().should("have.property", "pathname", "/");

      cy.get("@loggedInUser").then((user) => {
        const { token } = user;

        cy.get("@blogs").then((blogs) => {
          const options = {
            url: `http://localhost:3003/api/blogs/`,
            method: "POST",
            headers: {
              "User-Agent": "request",
              Authorization: `Bearer ${token}`,
            },
          };

          const blogOne = { ...blogs[0], likes: 10 };
          const blogTwo = { ...blogs[1], likes: 5 };
          const blogThree = { ...blogs[2], likes: 1 };

          cy.request({ ...options, body: blogOne });
          cy.request({ ...options, body: blogTwo });
          cy.request({ ...options, body: blogThree });

          cy.reload();
          cy.get(`[data-testid='BlogList_container']`)
            .children(`[data-testid^='BlogList_blogLink']`)
            .as("blogList");

          cy.get("@blogList")
            .first()
            .should("contain.text", blogOne.title);

          cy.get("@blogList")
            .last()
            .should("contain.text", blogThree.title);
        });
      });
    });

    describe("within the blogs view at /", function() {
      beforeEach(function() {
        cy.location().should("have.property", "pathname", "/");
      });

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
              cy.location().should("have.property", "pathname", `/blogs/${id}`);
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

      it("the Blog can be deleted by the user who created it", function() {
        cy.get("@createdBlog")
          .its("id")
          .then((id) => {
            cy.location().should("have.property", "pathname", `/blogs/${id}`);
            cy.get("[data-testid='Blog_deleteButton']").click();
            cy.location().should("have.property", "pathname", "/");
            cy.get("[data-testid='BlogList_container']").within(() => {
              cy.get(`[data-testid="BlogList_blogLink_${id}"]`).should(
                "not.exist"
              );
            });
          });
      });

      it("the Blog cannot not be deleted by other users", function() {
        cy.get("[data-testid='NavBar_logoutBtn']").click();

        cy.get("@users").then((users) => {
          const otherUser = users[1];
          cy.request("POST", "http://localhost:3003/api/users/", otherUser);

          cy.request("POST", "http://localhost:3003/api/login/", {
            username: otherUser.username,
            password: otherUser.password,
          }).then((res) => {
            const { token } = res.body;

            cy.wrap(token).as("otherUserToken");
          });

          uiLogin(otherUser.username, otherUser.password);
          cy.location().should("have.property", "pathname", "/");
        });

        cy.get("@createdBlog").then((blog) => {
          cy.get(`[data-testid="BlogList_blogLink_${blog.id}"]`).click();
          cy.get("[data-testid='Blog_deleteButton']").should("not.exist");

          cy.get("@otherUserToken").then((token) => {
            const options = {
              url: `http://localhost:3003/api/blogs/${blog.id}`,
              method: "DELETE",
              headers: {
                "User-Agent": "request",
                Authorization: `Bearer ${token}`,
              },
              failOnStatusCode: false,
            };

            cy.request(options).then((res) => {
              expect(res.status).to.eq(403);
              cy.contains(blog.title);
              cy.url().should("include", `/blogs/${blog.id}`);
            });
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
