import HabitPresenter from "../habit_presenter";

describe("HabitPresenter", () => {
  const habits = [
    { id: 1, name: "Reading", count: 1 },
    { id: 2, name: "Running", count: 0 },
  ];

  let habitPresenter;
  let update;

  beforeEach(() => {
    habitPresenter = new HabitPresenter(habits, 3);
    update = jest.fn();
  });

  it("inits with habits", () => {
    expect(habitPresenter.getHabits()).toEqual(habits);
  });

  it("increments habit count", () => {
    habitPresenter.setIncrement(habits[0], update);
    expect(habitPresenter.getHabits()[0].count).toBe(2);
    checkUpdateIsCalled();
  });

  it("decrements habit count", () => {
    habitPresenter.setDecrement(habits[0], update);
    expect(habitPresenter.getHabits()[0].count).toBe(0);
    checkUpdateIsCalled();
  });

  it("does not set the count value below 0 when decrements", () => {
    habitPresenter.setDecrement(habits[0], update);
    habitPresenter.setDecrement(habits[0], update);
    expect(habitPresenter.getHabits()[0].count).toBe(0);
  });

  it("deletes habit from the list", () => {
    habitPresenter.deleteHabit(habits[0], update);
    expect(habitPresenter.getHabits().length).toBe(1);
    expect(habitPresenter.getHabits()[0].name).toBe("Running");
    checkUpdateIsCalled();
  });

  describe("add", () => {
    it("adds new habit from the list", () => {
      habitPresenter.addHabit("Coding", update);
      expect(habitPresenter.getHabits().length).toBe(3);
      expect(habitPresenter.getHabits()[2].name).toBe("Coding");
      expect(habitPresenter.getHabits()[2].count).toBe(0);
      checkUpdateIsCalled();
    });

    it("throws an error when the max habits limit is exceeded", () => {
      habitPresenter.addHabit("Coding", update);
      expect(() => habitPresenter.addHabit("Testing", update)).toThrow(
        "The habits cannot be exceeded 3 habits."
      );
    });
  });

  describe("reset", () => {
    it("set all habit's count to 0", () => {
      habitPresenter.resetHabits(update);
      expect(habitPresenter.getHabits()[0].count).toBe(0);
      expect(habitPresenter.getHabits()[1].count).toBe(0);
      checkUpdateIsCalled();
    });

    it("does not create new object when count is 0", () => {
      const habits = habitPresenter.getHabits();
      habitPresenter.resetHabits(update);
      const updateHabits = habitPresenter.getHabits();
      expect(updateHabits[1]).toBe(habits[1]);
    });
  });

  function checkUpdateIsCalled() {
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(habitPresenter.getHabits());
  }
});
