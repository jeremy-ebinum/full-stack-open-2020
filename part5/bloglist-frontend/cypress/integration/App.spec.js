import { login, createBlog } from "../support/utils";

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

  describe("When logged in", function() {
    beforeEach(function() {
      login(user.username, user.password);
    });

    it("user can be logged out", function() {
      cy.get("[data-testid='NavBar_logoutBtn']").click();
      cy.contains(/(logged|signed) out/i);
      cy.get("[data-testid='Login_form']").should("be.visible");
    });

    it("A blog can be created", function() {
      cy.server();
      cy.route("/api/blogs").as("initBlogs");
      cy.wait(["@initBlogs"]);
      cy.get("[data-testid='App_showBlogFormBtn']").click();
      createBlog(validBlog);

      cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
        (res) => {
          const blogs = res.body;
          expect(blogs).to.have.length(1);
          const blog = blogs[0];
          expect(blog.title).to.equal(validBlog.title);
          expect(blog.author).to.equal(validBlog.author);
          expect(blog.url).to.equal(validBlog.url);

          cy.get("[data-testid='BlogList_container']").within(() => {
            cy.get(`[data-testid="Blog_${blog.id}"]`).should("exist");
          });
        }
      );
    });

    describe("A created blog", function() {
      let blogId;
      let blogLikes;

      beforeEach(function() {
        cy.server();
        cy.route("/api/blogs").as("initBlogs");
        cy.wait(["@initBlogs"]);
        cy.get("[data-testid='App_showBlogFormBtn']").click();
        createBlog(validBlog);

        cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
          (res) => {
            blogId = res.body[0].id;
            blogLikes = res.body[0].likes;
          }
        );
      });

      it("can be liked", function() {
        cy.get(`[data-testid='Blog_${blogId}_viewButton']`).click();
        cy.get(`[data-testid='Blog_${blogId}_likesTxt']`).as("blogLikesTxt");
        cy.get("@blogLikesTxt").should("contain.text", blogLikes);
        cy.get(`[data-testid='Blog_${blogId}_likeButton']`).click();
        cy.get("@blogLikesTxt").should("contain.text", blogLikes + 1);
      });

      it("can be deleted by the user who created it", function() {
        cy.get(`[data-testid="Blog_${blogId}"]`).should("exist");
        cy.get(`[data-testid='Blog_${blogId}_viewButton']`).click();
        cy.get(`[data-testid='Blog_${blogId}_deleteButton']`).click();
        cy.get(`[data-testid="Blog_${blogId}"]`).should("not.exist");
      });

      it("can not be deleted by other users", function() {
        cy.get("[data-testid='NavBar_logoutBtn']").click();

        let otherUser = {
          name: "Other Test User",
          username: "other_test_username",
          password: "other_test_password",
        };

        cy.request("POST", "http://localhost:3003/api/users/", otherUser);

        cy.request("POST", "http://localhost:3003/api/login/", {
          username: otherUser.username,
          password: otherUser.password,
        }).then((res) => {
          const { token } = res.body;

          login(otherUser.username, otherUser.password);

          cy.server();
          cy.route("/api/blogs").as("initBlogs");
          cy.wait(["@initBlogs"]);

          cy.get(`[data-testid='Blog_${blogId}']`).within(() => {
            cy.get(`[data-testid='Blog_${blogId}_viewButton']`).click();
            cy.get(`[data-testid='Blog_${blogId}_deleteButton']`).should(
              "not.exist"
            );
          });

          const options = {
            url: `http://localhost:3003/api/blogs/${blogId}`,
            method: "DELETE",
            headers: {
              "User-Agent": "request",
              Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
          };

          cy.request(options).then((res) => {
            expect(res.status).to.eq(403);

            cy.get(`[data-testid='Blog_${blogId}']`).should("exist");
          });
        });
      });
    });

    it("Blogs are ordered desc according to likes", function() {
      cy.server();
      cy.route("/api/blogs").as("initBlogs");
      cy.wait(["@initBlogs"]);

      const firstBlog = { ...validBlog, title: "First Blog" };
      const secondBlog = { ...validBlog, title: "Second Blog" };
      const thirdBlog = { ...validBlog, title: "Third Blog" };

      cy.get("[data-testid='App_showBlogFormBtn']").click();
      createBlog(firstBlog);
      cy.get("[data-testid='App_showBlogFormBtn']").click();
      createBlog(secondBlog);
      cy.get("[data-testid='App_showBlogFormBtn']").click();
      createBlog(thirdBlog);

      cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
        (res) => {
          const blogs = res.body;

          let firstBlogId;
          let secondBlogId;
          let thirdBlogId;

          blogs.reduce((acc, blog) => {
            if (blog.title === firstBlog.title) {
              firstBlogId = blog.id;
            } else if (blog.title === secondBlog.title) {
              secondBlogId = blog.id;
            } else {
              thirdBlogId = blog.id;
            }

            return acc;
          }, []);

          cy.get(`[data-testid='Blog_${firstBlogId}_viewButton']`).click();
          cy.get(`[data-testid='Blog_${secondBlogId}_viewButton']`).click();
          cy.get(`[data-testid='Blog_${thirdBlogId}_viewButton']`).click();

          cy.get(`[data-testid='Blog_${secondBlogId}_likeButton']`).click();
          cy.get(`[data-testid='Blog_${secondBlogId}_likeButton']`).click();
          cy.get(`[data-testid='Blog_${thirdBlogId}_likeButton']`).click();

          cy.get(`[data-testid='BlogList_container']`)
            .children(`[data-testid^='Blog_']`)
            .as("blogList");

          cy.get("@blogList")
            .first()
            .should("contain.text", secondBlog.title);

          cy.get("@blogList")
            .last()
            .should("contain.text", firstBlog.title);
        }
      );
    });
  });
});
