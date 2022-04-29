import httpMock from "node-mocks-http";
import faker from "faker";
import { validate } from "../validator";
import * as validator from "express-validator";

jest.mock("express-validator");

describe("validator middleware", () => {
  it("returns next when the validation pass", () => {
    const request = httpMock.createRequest();
    const response = httpMock.createResponse();
    const next = jest.fn();
    validator.validationResult = jest.fn(() => ({
      isEmpty: () => true,
    }));

    validate(request, response, next);

    expect(response.statusCode).toBe(200);
    expect(next).toBeCalled();
  });

  it("returns 400 with error message", () => {
    const request = httpMock.createRequest();
    const response = httpMock.createResponse();
    const next = jest.fn();
    validator.validationResult = jest.fn(() => ({
      isEmpty: () => false,
      array: () => [{ msg: "Error" }],
    }));

    validate(request, response, next);

    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(400);
    expect(response._getJSONData().message).toBe("Error");
  });
});
