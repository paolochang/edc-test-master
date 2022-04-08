const Calculator = require("../calculator.js");

describe("Calculator", () => {
  let calc;
  beforeEach(() => {
    calc = new Calculator();
  });

  it("inits with 0", () => {
    expect(calc.value).toBe(0);
  });

  it("set", () => {
    calc.set(10);
    expect(calc.value).toBe(10);
  });

  it("clear", () => {
    calc.set(10);
    expect(calc.value).toBe(10);
    calc.clear();
    expect(calc.value).toBe(0);
  });

  describe("add", () => {
    it("0 + 10 = 10", () => {
      calc.add(10);
      expect(calc.value).toBe(10);
    });

    it("must throw error for adding greater than 100", () => {
      expect(() => {
        calc.add(110);
      }).toThrow("Value can not be greater than 100");
    });
  });

  it("subtract", () => {
    calc.set(10);
    expect(calc.value).toBe(10);
    calc.subtract(5);
    expect(calc.value).toBe(5);
  });

  it("multiply", () => {
    calc.set(10);
    expect(calc.value).toBe(10);
    calc.multiply(5);
    expect(calc.value).toBe(50);
  });

  describe("divide", () => {
    it("0 / 0 === NaN", () => {
      calc.divide(0);
      expect(calc.value).toBe(NaN);
    });
    it("1 / 0 === Infinity", () => {
      calc.set(1);
      calc.divide(0);
      expect(calc.value).toBe(Infinity);
    });
    it("divide", () => {
      calc.set(50);
      expect(calc.value).toBe(50);
      calc.divide(5);
      expect(calc.value).toBe(10);
    });
  });
});
