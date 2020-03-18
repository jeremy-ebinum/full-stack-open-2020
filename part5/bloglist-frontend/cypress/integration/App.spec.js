import { login, createBlog } from "../support/utils";

describe("App ", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.fixture("users.json").as("users");
    cy.fixture("blogs.json").as("blogs");

    cy.get("@users").then((users) => {
      const user = users[0];
      cy.request("POST", "http://localhost:3003/api/users/", user);
    });

    cy.visit("http://localhost:3000");
  });

  it("first time visit displays a login page", function() {
    cy.get("[data-testid='Login_form']").should("be.visible");
  });

  describe("Logging in", function() {
    it("succeeds with correct credentials", function() {
      cy.get("@users").then((users) => {
        const user = users[0];
        login(user.username, user.password);

        const names = `(${user.username}|${user.name})`;
        const notificationRegex = new RegExp(
          `logged|signed (.*)?${names}`,
          "i"
        );

        cy.contains(notificationRegex);
        cy.get("[data-testid='App_blogs']").should("be.visible");
      });
    });

    it("fails with wrong credentials", function() {
      cy.server();
      cy.route("POST", "/api/login").as("failedLoginReq");

      login("spam", "eggs");

      cy.get("@failedLoginReq").should("have.property", "status", 401);

      cy.contains(/invalid|missing|wrong/i)
        .parent("[data-testid^='Alert_']")
        .should("have.css", "background-color", "rgb(131, 49, 37)");

      cy.get("[data-testid='Login_form']").should("be.visible");
      cy.get("[data-testid='App_blogs']").should("not.be.visible");
    });
  });

  describe("When logged in", function() {
    beforeEach(function() {
      cy.get("@users").then((users) => {
        const user = users[0];
        login(user.username, user.password);
      });
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
      cy.get("@blogs").then((blogs) => {
        createBlog(blogs[0]);
      });

      cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
        (res) => {
          const blogs = res.body;
          const blog = blogs[0];
          expect(blogs).to.have.length(1);
          cy.get("@blogs").then((blogs) => {
            const { title, author, url } = blogs[0];

            expect(blog.title).to.equal(title);
            expect(blog.author).to.equal(author);
            expect(blog.url).to.equal(url);
          });

          cy.get("[data-testid='BlogList_container']").within(() => {
            cy.get(`[data-testid="Blog_${blog.id}"]`);
          });
        }
      );
    });

    describe("A created blog", function() {
      beforeEach(function() {
        cy.server();
        cy.route("/api/blogs").as("initBlogs");
        cy.wait(["@initBlogs"]);
        cy.get("[data-testid='App_showBlogFormBtn']").click();
        cy.get("@blogs").then((blogs) => {
          createBlog(blogs[0]);
        });

        cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
          (res) => {
            const createdBlog = {
              id: res.body[0].id,
              likes: res.body[0].likes,
            };

            cy.wrap(createdBlog).as("createdBlog");
          }
        );
      });

      it("can be liked", function() {
        cy.get("@createdBlog").then((blog) => {
          cy.get(`[data-testid='Blog_${blog.id}_viewButton']`).click();
          cy.get(`[data-testid='Blog_${blog.id}_likesTxt']`).as("blogLikesTxt");
          cy.get("@blogLikesTxt").should("contain.text", blog.likes);

          cy.get(`[data-testid='Blog_${blog.id}_likeButton']`).click();
          cy.get("@blogLikesTxt").should("contain.text", blog.likes + 1);
        });
      });

      it("can be deleted by the user who created it", function() {
        cy.get("@createdBlog").then((blog) => {
          cy.get(`[data-testid="Blog_${blog.id}"]`);

          cy.get(`[data-testid='Blog_${blog.id}_viewButton']`).click();
          cy.get(`[data-testid='Blog_${blog.id}_deleteButton']`).click();

          cy.get(`[data-testid="Blog_${blog.id}"]`).should("not.exist");
        });
      });

      it("can not be deleted by other users", function() {
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

          login(otherUser.username, otherUser.password);
        });

        cy.server();
        cy.route("/api/blogs").as("initBlogs");
        cy.wait(["@initBlogs"]);

        cy.get("@createdBlog").then((blog) => {
          cy.get(`[data-testid='Blog_${blog.id}']`).within(() => {
            cy.get(`[data-testid='Blog_${blog.id}_viewButton']`).click();
            cy.get(`[data-testid='Blog_${blog.id}_deleteButton']`).should(
              "not.exist"
            );
          });

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
              cy.get(`[data-testid='Blog_${blog.id}']`);
            });
          });
        });
      });
    });

    it("Blogs are ordered desc according to likes", function() {
      cy.server();
      cy.route("/api/blogs").as("initBlogs");
      cy.wait(["@initBlogs"]);

      cy.get("@blogs").then((blogs) => {
        if (blogs.length < 3) throw Error("Not Enough Blogs");
        const [firstBlog, secondBlog, thirdBlog] = blogs;

        cy.get("[data-testid='App_showBlogFormBtn']").click();
        createBlog(firstBlog);
        cy.get("[data-testid='App_showBlogFormBtn']").click();
        createBlog(secondBlog);
        cy.get("[data-testid='App_showBlogFormBtn']").click();
        createBlog(thirdBlog);
      });

      cy.request("GET", "http://localhost:3003/api/testing/blogs").then(
        (res) => {
          const blogs = res.body;

          const [blogOne, blogTwo, blogThree] = blogs.map((blog) => {
            return { id: blog.id, title: blog.title };
          });

          cy.get(`[data-testid='Blog_${blogOne.id}_viewButton']`).click();
          cy.get(`[data-testid='Blog_${blogTwo.id}_viewButton']`).click();
          cy.get(`[data-testid='Blog_${blogThree.id}_viewButton']`).click();

          // blogTwo will have 2 likes, blogThree, 1 like and blogOne, 0 likes
          cy.get(`[data-testid='Blog_${blogTwo.id}_likeButton']`)
            .click()
            .click();
          cy.get(`[data-testid='Blog_${blogThree.id}_likeButton']`).click();

          cy.get(`[data-testid='BlogList_container']`)
            .children(`[data-testid^='Blog_']`)
            .as("blogList");

          // blogTwo should be first
          cy.get("@blogList")
            .first()
            .should("contain.text", blogTwo.title);

          // blogOne should be last
          cy.get("@blogList")
            .last()
            .should("contain.text", blogOne.title);
        }
      );
    });
  });
});
