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

  it("5!", () => {
    const input = 5;
    const output = "120";

    cy.intercept("POST", "**/factorial").as("createJob");

    cy.get("#factorial-input").clear().type(input).type("{enter}");

    cy.wait("@createJob").should(({ request, response }) => {
      expect(request.body).to.eql({ input });
      expect(response.statusCode).to.equal(200);
    });

    cy.get("[data-testid=row-0-input]").should("have.text", input);
    cy.get("[data-testid=row-0-output]").should("have.text", output);
    cy.get("[data-testid=row-0-queue-time]")
      .invoke("text")
      .should("match", /\d+m?s/);
    cy.get("[data-testid=row-0-work-time]")
      .invoke("text")
      .should("match", /\d+m?s/);
  });

  it("42!", () => {
    const input = 42;
    const output = "14050061177528798985e32";

    cy.intercept("POST", "**/factorial").as("createJob");

    cy.get("#factorial-input").clear().type(input).type("{enter}");

    cy.wait("@createJob").should(({ request, response }) => {
      expect(request.body).to.eql({ input });
      expect(response.statusCode).to.equal(200);
    });

    cy.get("[data-testid=row-0-input]").should("have.text", input);
    cy.get("[data-testid=row-0-output]").should("have.text", output);
    cy.get("[data-testid=row-0-queue-time]")
      .invoke("text")
      .should("match", /\d+m?s/);
    cy.get("[data-testid=row-0-work-time]")
      .invoke("text")
      .should("match", /\d+m?s/);
  });
});
