import React from "react";
import { render, screen } from "@testing-library/react";
import Habits from "../habits";
import userEvent from "@testing-library/user-event";

describe("Habits", () => {
  const habits = [
    { id: 1, name: "Reading", count: 1 },
    { id: 2, name: "Running", count: 0 },
  ];
  let component;
  let onReset;

  it("compares snapshot", () => {
    component = render(
      <Habits
        habits={habits}
        onIncrement={jest.fn}
        onDecrement={jest.fn}
        onDelete={jest.fn}
        onAdd={jest.fn}
        onReset={jest.fn}
      />
    );
    expect(component.container).toMatchSnapshot();
  });

  describe("tests user interface", () => {
    beforeEach(() => {
      onReset = jest.fn();
      render(
        <Habits
          habits={habits}
          onIncrement={jest.fn}
          onDecrement={jest.fn}
          onDelete={jest.fn}
          onAdd={jest.fn}
          onReset={onReset}
        />
      );
    });

    it("calls reset when reset button is clicked", () => {
      const btnReset = screen.getByText("Reset All");
      userEvent.click(btnReset);
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
