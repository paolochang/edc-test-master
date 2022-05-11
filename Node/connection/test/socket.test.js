import jwt from "jsonwebtoken";
import { getSocketIO, initSocket } from "../socket";

jest.mock("jsonwebtoken");

describe("socket", () => {
  it("throw an error when socket is not initialized", () => {
    expect(function () {
      getSocketIO();
    }).toThrow(new Error("Please call init first"));
  });
});
