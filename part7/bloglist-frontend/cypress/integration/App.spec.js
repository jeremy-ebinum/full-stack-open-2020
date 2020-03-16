import { uiLogin, uiCreateBlog } from "./utils";

describe("App ", function() {
  let user;
  let userId;
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
    cy.request("POST", "http://localhost:3003/api/users/", user).then((res) => {
      userId = res.body.id;
    });

    cy.visit("/");
  });

  it("first time visit displays a login page", function() {
    cy.get("[data-testid='Login_form']").should("be.visible");
  });

  it("user can login", function() {
    uiLogin("test_username", "test_password");

    const names = `(${user.username}|${user.name})`;
    const notificationRegex = new RegExp(`logged|signed (.*)?${names}`, "i");
    cy.contains(notificationRegex);
    cy.get("[data-testid='Home_blogs']").should("be.visible");
  });

  describe("when logged in", function() {
    let blogsPath = "/";
    let usersPath = "/users";

    beforeEach(function() {
      uiLogin("test_username", "test_password");
    });

    it("user can be logged out", function() {
      cy.get("[data-testid='NavBar_logoutBtn']").click();
      cy.contains(/(logged|signed) out/i);
      cy.get("[data-testid='Login_form']").should("be.visible");
    });

    it("NavBar links route to correct views", function() {
      cy.get("[data-testid='NavBar_blogsLink']").click();
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(blogsPath);
      });

      cy.get("[data-testid='NavBar_usersLink']").click();
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(usersPath);
      });
    });

    describe("within the blogs view at /", function() {
      it("a valid blog can be created", function() {
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();
        uiCreateBlog(validBlog);
        const blogTitleRegex = new RegExp(
          `${validBlog.title.slice(0, 10)}(.*)?`
        );
        cy.contains(blogTitleRegex);
      });

      it("clicking on a created blog routes to a Blog view", function() {
        let blogId;
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();
        uiCreateBlog(validBlog);
        cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
          (res) => {
            blogId = res.body[0].id;
            cy.get(`[data-testid="BlogList_blogLink_${blogId}"]`).click();
            cy.location().should((loc) => {
              expect(loc.pathname).to.eq(`/blogs/${blogId}`);
            });
          }
        );
      });
    });

    describe("within the view of a created Blog at /blogs/:id", function() {
      let blogId;
      let blogLikes;
      beforeEach(function() {
        cy.get("[data-testid='Toggleable_showBlogFormBtn']").click();
        uiCreateBlog(validBlog);
        cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
          (res) => {
            blogId = res.body[0].id;
            blogLikes = res.body[0].likes;
            cy.get(`[data-testid="BlogList_blogLink_${blogId}"]`).click();
          }
        );
      });

      it("the Blog can be liked", function() {
        cy.get("[data-testid='Blog_likesTxt']").as("blogLikesTxt");
        cy.get("@blogLikesTxt").should("contain.text", blogLikes);
        cy.get("[data-testid='Blog_likeButton']").click();
        cy.get("@blogLikesTxt").should("contain.text", blogLikes + 1);
      });

      it("the Blog can be deleted", function() {
        cy.get("[data-testid='Blog_deleteButton']").click();
        cy.location().should((loc) => {
          expect(loc.pathname).to.eq(`/`);
        });
        cy.get("[data-testid='BlogList_container']").within(() => {
          cy.get(`[data-testid="BlogList_blogLink_${blogId}"]`).should(
            "not.exist"
          );
        });
      });

      it("a comment can be added to the blog", function() {
        let comment = "Test Comment";
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
        cy.get(`[data-testid="Users_userLink_${userId}"]`).click();
        cy.location().should((loc) => {
          expect(loc.pathname).to.eq(`/users/${userId}`);
        });
      });
    });
  });
});
