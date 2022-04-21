export default class HabitPresenter {
  constructor(habits, maxHabits) {
    this.habits = habits;
    this.maxHabits = maxHabits;
  }

  getHabits() {
    return this.habits;
  }

  setIncrement(habit, update) {
    this.habits = this.habits.map((item) => {
      if (item.id === habit.id) {
        return { ...habit, count: habit.count + 1 };
      }
      return item;
    });
    update(this.habits);
  }

  setDecrement(habit, update) {
    this.habits = this.habits.map((item) => {
      if (item.id === habit.id) {
        const count = item.count - 1;
        return { ...habit, count: count < 0 ? 0 : count };
      }
      return item;
    });
    update(this.habits);
  }

  deleteHabit(habit, update) {
    this.habits = this.habits.filter((item) => item.id !== habit.id);
    update(this.habits);
  }

  addHabit(habit, update) {
    if (this.habits.length === this.maxHabits)
      throw new Error(
        `The habits cannot be exceeded ${this.maxHabits} habits.`
      );
    this.habits = [...this.habits, { id: Date.now(), name: habit, count: 0 }];
    update(this.habits);
  }

  resetHabits(update) {
    // create new object
    // return { ...habit, count: 0 };
    // reset habit count to 0 on the existing object
    this.habits = this.habits.map((habit) => {
      if (habit.count !== 0) {
        return { ...habit, count: 0 };
      }
      return habit;
    });
    update(this.habits);
  }
}
