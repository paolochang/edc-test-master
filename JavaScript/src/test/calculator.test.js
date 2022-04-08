const Calculator = require("../calculator.js");

test("set", () => {
  const calc = new Calculator();
  calc.set(5);
  expect(calc.value).toBe(5);
});

test("clear", () => {
  const calc = new Calculator();
  calc.set(10);
  expect(calc.value).toBe(10);
  calc.clear();
  expect(calc.value).toBe(0);
});

test("add", () => {
  const calc = new Calculator();
  calc.add(10);
  expect(calc.value).toBe(10);
});

test("add throw error for greater than 100", () => {
  const calc = new Calculator();
  calc.add(110);
  expect(calc.value).toThrow(Error);
});

test("subtract", () => {
  const calc = new Calculator();
  calc.set(10);
  expect(calc.value).toBe(10);
  calc.subtract(5);
  expect(calc.value).toBe(5);
});

test("multiply", () => {
  const calc = new Calculator();
  calc.set(10);
  expect(calc.value).toBe(10);
  calc.multiply(5);
  expect(calc.value).toBe(50);
});

test("divide", () => {
  const calc = new Calculator();
  calc.set(50);
  expect(calc.value).toBe(50);
  calc.divide(5);
  expect(calc.value).toBe(10);
});
