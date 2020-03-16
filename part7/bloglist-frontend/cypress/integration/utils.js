export const uiLogin = (username, password) => {
  cy.get("[data-testid='Login_username']").type(username);
  cy.get("[data-testid='Login_password']").type(password);
  cy.get("[data-testid='Login_submitButton']").click();
};

export const uiCreateBlog = ({ title, author, url }) => {
  cy.get("[data-testid='BlogForm_title']").type(title);
  cy.get("[data-testid='BlogForm_author']").type(author);
  cy.get("[data-testid='BlogForm_url']").type(url);
  cy.get("[data-testid='BlogForm_submitButton']").click();
};
