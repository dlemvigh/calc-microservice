describe("factorio app", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.inter;
  });

  it("loads initial page", () => {
    cy.get("h1").should("have.text", "Factorials'r'us");
  });

  it("input is required", () => {
    cy.get("#factorial-input").clear();
    cy.get("#factorial-input-helper-text").should("have.text", "Required");
  });

  it("input should be integer", () => {
    cy.get("#factorial-input").clear().type("1.1");
    cy.get("#factorial-input-helper-text").should(
      "have.text",
      "Must be a whole number"
    );
  });

  it("input should be positive", () => {
    cy.get("#factorial-input").clear().type("-1");
    cy.get("#factorial-input-helper-text").should(
      "have.text",
      "Must be a positive number"
    );
  });

  it.only("5!", () => {
    cy.intercept("POST", "**/factorial").as("createJob");

    cy.get("#factorial-input").clear().type("2000").type("{enter}");

    cy.wait("@createJob").should(({ request, response }) => {
      expect(request.body).to.eql({ input: 2000 });
      expect(response.statusCode).to.equal(200);
    });
  });
});
