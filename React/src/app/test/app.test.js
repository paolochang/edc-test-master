import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "../app.jsx";
import HabitPresenter from "../habit_presenter.js";

describe("App", () => {
  let habitPresenter;
  beforeEach(() => {
    habitPresenter = new HabitPresenter([
      { id: 1, name: "Reading", count: 0 },
      { id: 2, name: "Running", count: 0 },
      { id: 3, name: "Coding", count: 1 },
    ]);
  });

  it("compares snapshot", () => {
    const component = render(<App presenter={habitPresenter} />);
    expect(component.container).toMatchSnapshot();
  });

  describe("integration test", () => {
    beforeEach(() => {
      render(<App presenter={habitPresenter} />);
    });

    it("counts active habits", () => {
      const btnIncrease = screen.getAllByTitle("increase")[0];
      userEvent.click(btnIncrease);
      const count = screen.getByTestId("total-count");
      expect(count.innerHTML).toBe("2");
    });

    it("adds new habit", () => {
      const newHabit = "New habit";
      const input = screen.getByPlaceholderText("Habit");
      const btnAdd = screen.getByText("Add");
      userEvent.type(input, newHabit);
      userEvent.click(btnAdd);
      const addedName = screen.getAllByTestId("habit-name")[3];
      expect(addedName.innerHTML).toBe(newHabit);
      const addedCount = screen.getAllByTestId("habit-count")[3];
      expect(addedCount.innerHTML).toBe("0");
    });

    it("delete an item", () => {
      const btnDelete = screen.getAllByTitle("delete")[0];
      userEvent.click(btnDelete);
      const firstHabit = screen.getAllByTestId("habit-name")[0];
      expect(firstHabit.innerHTML).not.toBe("Reading");
    });

    it("increases the counter", () => {
      const btnIncrease = screen.getAllByTitle("increase")[0];
      userEvent.click(btnIncrease);
      const habitCount = screen.getAllByTestId("habit-count")[0];
      expect(habitCount.innerHTML).toBe("1");
    });

    it("decreases the counter", () => {
      const btnDecrease = screen.getAllByTitle("decrease")[0];
      userEvent.click(btnDecrease);
      const habitCount = screen.getAllByTestId("habit-count")[0];
      expect(habitCount.innerHTML).toBe("0");
    });

    it("resets all counters", () => {
      const btnReset = screen.getByText("Reset All");
      userEvent.click(btnReset);
      screen.getAllByTestId("habit-count").forEach((count) => {
        expect(count.innerHTML).toBe("0");
      });
    });
  });
});
