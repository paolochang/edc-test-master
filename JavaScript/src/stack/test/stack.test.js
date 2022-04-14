const Stack = require("../stack.js");

describe("Stack", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("created empty stack", () => {
    expect(stack.size()).toBe(0);
  });

  it("allows to push an item", () => {
    stack.push("🍌");
    expect(stack.size()).toBe(1);
    // BAD: will fail if stack implementation changes
    // expect(stack.array[0]).toBe("🍌");
  });

  describe("pop", () => {
    it("throws an error if stack is empty", () => {
      expect(() => {
        stack.pop();
      }).toThrow("Stack is empty");
    });

    it("returns the last item and removes it from the stack", () => {
      stack.push("🍌");
      stack.push("🍎");
      expect(stack.pop()).toBe("🍎");
      expect(stack.size()).toBe(1);
    });
  });

  describe("peak", () => {
    it("throws an error if stack is empty", () => {
      expect(() => {
        stack.peak();
      }).toThrow("Stack is empty");
    });

    it("returns the last item but keep it from the stack", () => {
      stack.push("🍌");
      stack.push("🍎");
      expect(stack.peak()).toBe("🍎");
      expect(stack.size()).toBe(2);
    });
  });
});
