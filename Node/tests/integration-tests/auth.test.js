import axios from "axios";
import faker from "faker";
import { startServer, stopServer } from "../../app.js";
import { sequelize } from "../../db/database.js";
import Tester from "./tester_utils.js";
/**
 * Before test:
 * 1. start server
 * 2. initialize database
 * After test:
 * 1. clear database
 */

describe("INTEGRATION TEST: auth", () => {
  let server;
  let request;
  let tester;

  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: `http://localhost:${server.address().port}`,
      validateStatus: null,
    });
    tester = new Tester(request);
  });

  afterAll(async () => {
    await stopServer(server);
  });

  describe("POST /auth/signup", () => {
    it("returns 201 with authorization token when user provides valid information", async () => {
      const signup = tester.getSignUpInfo();

      const res = await request.post("/auth/signup", signup);

      expect(res.status).toBe(201);
      expect(res.data.token.length).toBeGreaterThan(0);
    });

    it("returns 409 for existing user", async () => {
      const signup = tester.getSignUpInfo();
      const error = { message: `${signup["username"]} already exists` };

      const res = await request.post("/auth/signup", signup);

      expect(res.status).toBe(409);
      expect(res.data).toMatchObject(error);
    });

    test.each([
      {
        missingFieldName: "username",
        expectedMessage: "username should be at least 5 characters",
      },
      {
        missingFieldName: "password",
        expectedMessage: "password should be at least 5 characters",
      },
      { missingFieldName: "name", expectedMessage: "name is missing" },
      { missingFieldName: "email", expectedMessage: "invalid email" },
    ])(
      `returns 400 for the validation fail when $missingFieldName field is missing`,
      async ({ missingFieldName, expectedMessage }) => {
        const signup = tester.getSignUpInfo();
        delete signup[missingFieldName];

        const res = await request.post("/auth/signup", signup);

        expect(res.status).toBe(400);
        expect(res.data.message).toBe(expectedMessage);
      }
    );

    test.each([
      {
        fieldName: "username",
        expectedMessage: "username should be at least 5 characters",
      },
      {
        fieldName: "password",
        expectedMessage: "password should be at least 5 characters",
      },
    ])(
      `returns 400 for the validation fail when $fieldName is too short`,
      async ({ fieldName, expectedMessage }) => {
        const signup = tester.getNewUserInfo();
        signup[fieldName] = faker.random.alphaNumeric(3);

        const res = await request.post("/auth/signup", signup);

        expect(res.status).toBe(400);
        expect(res.data.message).toBe(expectedMessage);
      }
    );
  });

  describe("POST /auth/login", () => {
    it("returns 200 with username and token", async () => {
      const user = await tester.createNewAccount();

      const res = await request.post("/auth/login", {
        username: user.username,
        password: user.password,
      });

      expect(res.status).toBe(200);
      expect(res.data.username).toBe(user["username"]);
      expect(res.data.token.length).toBeGreaterThan(0);
    });

    test.each([
      { testCase: "inexistent user", fieldName: "username" },
      { testCase: "invalid password", fieldName: "password" },
    ])(`returns 401 for $testCase`, async ({ fieldName }) => {
      const user = await tester.createNewAccount();
      user[fieldName] = user[fieldName] + "X";
      const error = { message: "Invalid user or password" };

      const res = await request.post("/auth/login", {
        username: user.username,
        password: user.password,
      });

      expect(res.status).toBe(401);
      expect(res.data).toMatchObject(error);
    });
  });

  describe("POST /auth/logout", () => {
    it("returns 200 with success message", async () => {
      const message = { message: "User has been logged out" };

      const res = await request.post("/auth/logout");

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject(message);
    });
  });

  describe("GET /auth/me", () => {
    it("returns 200 with username and token", async () => {
      const user = await tester.createNewAccount();

      const res = await request.get("/auth/me", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        username: user.username,
        token: user.jwt,
      });
    });
  });
});
