import faker from "faker";
import { AuthController } from "../auth.js";
import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("AuthController", () => {
  let authController;
  let userRepository;
  beforeEach(() => {
    userRepository = {};
    authController = new AuthController(userRepository);
  });

  describe("signup", () => {
    let name, username, password, request, response;

    beforeEach(() => {
      name = faker.internet.userName();
      username = name.toLowerCase();
      password = faker.random.alphaNumeric(8);
      request = httpMocks.createRequest({
        body: {
          username,
          name,
          email: `${username}@test.com`,
          password,
        },
      });
      response = httpMocks.createResponse();
    });

    it("returns 409 for existing username", async () => {
      const error = { message: `${username} already exists` };
      userRepository.findByUsername = jest.fn((username) => ({ username }));

      await authController.signup(request, response);

      expect(response.statusCode).toBe(409);
      expect(response._getJSONData()).toMatchObject(error);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(username);
    });

    // TODO: FIX ReferenceError: createJwtToken is not defined
    // it("returns 201 with username and token after user creataion", async () => {
    //   userRepository.findByUsername = jest.fn();
    //   userRepository.createUser = jest.fn();

    //   await authController.signup(request, response);

    //   expect(response.statusCode).toBe(201);
    // });
  });

  describe("login", () => {
    let username, password, request, response;

    beforeEach(() => {
      username = faker.internet.userName().toLowerCase();
      password = faker.random.alphaNumeric(8);
      request = httpMocks.createRequest({
        body: {
          username,
          password,
        },
      });
      response = httpMocks.createResponse();
    });

    it("returns 401 if username is not found", async () => {
      userRepository.findByUsername = jest.fn(() => undefined);
      const error = { message: "Invalid user or password" };

      await authController.login(request, response);

      expect(response.statusCode).toBe(401);
      expect(response._getJSONData()).toMatchObject(error);
    });

    it("returns 401 if password is not valid", async () => {
      userRepository.findByUsername = jest.fn(() => true);
      bcrypt.compare = jest.fn(() => false);
      const error = { message: "Invalid user or password" };

      await authController.login(request, response);

      expect(response.statusCode).toBe(401);
      expect(response._getJSONData()).toMatchObject(error);
    });

    // TODO: ReferenceError: createJwtToken is not defined
    // it("returns 200 with username and token", async () => {
    //   const token = faker.random.alphaNumeric(32);
    //   userRepository.findByUsername = jest.fn(() => true);
    //   bcrypt.compare = jest.fn(() => true);
    //   authController.createJwtToken = jest.fn(() => token);

    //   await authController.login(request, response);

    //   expect(response.statusCode).toBe(200);
    //   expect(response._getJSONData()).toEqual(error);
    // });
  });

  // TODO: complete following unit test
  // describe("createJwtToken", () => {
  //   it("returns jwt sign", () => {
  //     const userId = faker.datatype.uuid();
  //     jwt.sign = jest.fn(({ id }, secret, callback) => {});

  //     authController.createJwtToken(userId);

  //     expect(authController.createJwtToken()).toHaveBeenCalledWith(userId);
  //   });
  // });

  describe("logout", () => {
    it("returns 200 with success message", () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const message = { message: "User has been logged out" };

      authController.logout(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject(message);
    });
  });

  describe("me", () => {
    let userId, request, response;
    beforeEach(() => {
      request = httpMocks.createRequest({
        request: {
          userId,
          token: faker.random.alphaNumeric(34),
        },
      });
      response = httpMocks.createResponse();
    });

    it("returns 404 if user is not found", async () => {
      const error = { message: "User not found" };
      userRepository.findById = jest.fn(() => undefined);

      await authController.me(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toMatchObject(error);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("returns 200 with token and username", async () => {
      const user = {
        username: faker.internet.userName(),
      };
      userRepository.findById = jest.fn(() => user);

      await authController.me(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject(user);
    });
  });
});
