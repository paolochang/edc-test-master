import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Habit from "../habit";

describe("habit", () => {
  const habit = { id: 1, name: "Reading", count: 1 };

  it("compares snapshot", () => {
    const component = render(
      <Habit
        habit={habit}
        onIncrement={jest.fn()}
        onDecrement={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(component.container).toMatchSnapshot();
  });

  describe("calls functions", () => {
    let onIncrement = jest.fn();
    let onDecrement = jest.fn();
    let onDelete = jest.fn();
    let btnIncrement;
    beforeEach(() => {
      render(
        <Habit
          habit={habit}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onDelete={onDelete}
        />
      );
    });

    it("handleIncrement", () => {
      btnIncrement = screen.getByTitle("increase");
      userEvent.click(btnIncrement);
      expect(onIncrement).toHaveBeenCalledTimes(1);
    });

    it("handleDecrement", () => {
      btnIncrement = screen.getByTitle("decrease");
      userEvent.click(btnIncrement);
      expect(onIncrement).toHaveBeenCalledTimes(1);
    });

    it("handleDelete", () => {
      btnIncrement = screen.getByTitle("delete");
      userEvent.click(btnIncrement);
      expect(onIncrement).toHaveBeenCalledTimes(1);
    });
  });
});
