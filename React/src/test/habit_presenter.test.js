import HabitPresenter from "../habit_presenter";

describe("HabitPresenter", () => {
  const habits = [
    { id: 1, name: "Reading", count: 1 },
    { id: 2, name: "Running", count: 0 },
    { id: 3, name: "Coding", count: 0 },
  ];

  let habitPresenter;
  let update;

  beforeEach(() => {
    habitPresenter = new HabitPresenter(habits);
    update = jest.fn();
  });

  it("inits with habits", () => {
    expect(habitPresenter.getHabits()).toEqual(habits);
  });

  it("increments habit count and call update callback", () => {
    habitPresenter.setIncrement(habits[0], update);
    expect(habitPresenter.getHabits()[0].count).toBe(2);
    checkUpdateIsCalled();
  });

  it("decrements habit count and call update callback", () => {
    habitPresenter.setDecrement(habits[0], update);
    expect(habitPresenter.getHabits()[0].count).toBe(0);
    checkUpdateIsCalled();
  });

  it("does not set the count value below 0 when decrements", () => {
    habitPresenter.setDecrement(habits[0], update);
    habitPresenter.setDecrement(habits[0], update);
    expect(habitPresenter.getHabits()[0].count).toBe(0);
  });

  function checkUpdateIsCalled() {
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(habitPresenter.getHabits());
  }
});
