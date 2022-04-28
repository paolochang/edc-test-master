import httpMock from "node-mocks-http";
import { isAuth } from "../auth";
import faker from "faker";
import jwt from "jsonwebtoken";
import * as userRepository from "../../data/auth.js";

jest.mock("jsonwebtoken");
jest.mock("../../data/auth.js");

describe("auth middleware", () => {
  it("returns 401 for the request without Authorization header", async () => {
    const request = httpMock.createRequest({
      method: "GET",
      url: "/tweets",
    });
    const response = httpMock.createResponse();
    const next = jest.fn();

    await isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toBeCalled();
  });

  it("returns 401 for the request with unsupported Authorization header", async () => {
    const request = httpMock.createRequest({
      method: "GET",
      url: "/tweets",
      headers: {
        authorization: "Basic",
      },
    });
    const response = httpMock.createResponse();
    const next = jest.fn();

    await isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toBeCalled();
  });

  it("returns 401 for the request with invalid JWT Token", async () => {
    const token = faker.random.alphaNumeric(128);
    const request = httpMock.createRequest({
      method: "GET",
      url: "/tweets",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const response = httpMock.createResponse();
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(new Error("bad token"), undefined);
    });

    await isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toBeCalled();
  });

  it("returns 401 when the user is not found by id", async () => {
    const token = faker.random.alphaNumeric(128);
    const userId = faker.random.alphaNumeric(32);
    const request = httpMock.createRequest({
      method: "GET",
      url: "/tweets",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const response = httpMock.createResponse();
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(undefined, { id: userId });
    });
    userRepository.findById = jest.fn((id) => Promise.resolve(undefined));

    await isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toBeCalled();
  });

  it("returns 200 with valid Authorization header with token", async () => {
    const token = faker.random.alphaNumeric(128);
    const userId = faker.random.alphaNumeric(32);
    const request = httpMock.createRequest({
      method: "GET",
      url: "/tweets",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const response = httpMock.createResponse();
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(undefined, { id: userId });
    });
    userRepository.findById = jest.fn((id) => Promise.resolve({ id }));

    await isAuth(request, response, next);

    expect(request).toMatchObject({ userId, token });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
