/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

describe("Habit Tracker", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders home screen", () => {
    cy.findByText("Habit Tracker").should("exist");
  });

  it("add new habit to the end", () => {
    cy.findByPlaceholderText("Habit").type("Debugging");
    cy.findByText("Add").click();
    cy.findAllByTestId("habit-name").last().should("have.text", "Debugging");
    cy.findAllByTestId("habit-count").last().should("have.text", 0);
  });

  it("increases count", () => {
    cy.findAllByTitle("increase").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 1);
  });

  it("decreases count", () => {
    cy.findAllByTitle("increase").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 1);
    cy.findAllByTitle("decrease").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 0);
  });

  it("decreases does not allow below 0", () => {
    cy.findAllByTitle("decrease").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 0);
  });

  it("display active total count", () => {
    cy.findAllByTitle("increase").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 1);
    cy.findByTestId("total-count").should("have.text", 1);
    cy.findAllByTitle("increase").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 2);
    cy.findByTestId("total-count").should("have.text", 1);
    cy.findAllByTitle("increase").last().click();
    cy.findAllByTestId("habit-count").last().should("have.text", 1);
    cy.findByTestId("total-count").should("have.text", 2);
  });

  it("reset all habits to 0", () => {
    cy.findAllByTitle("increase").first().click();
    cy.findAllByTestId("habit-count").first().should("have.text", 1);
    cy.findAllByTitle("increase").last().click();
    cy.findAllByTestId("habit-count").last().should("have.text", 1);
    cy.findByTestId("total-count").should("have.text", 2);
    cy.findByText("Reset All").click();
    cy.findAllByTestId("habit-count").each((item) => {
      cy.wrap(item).should("have.text", 0);
    });
    cy.findByTestId("total-count").should("have.text", 0);
  });

  it("delete first habit", () => {
    cy.findAllByTitle("delete").first().click();
    cy.findAllByTestId("habit-name").findByText("Reading").should("not.exist");
  });
});
