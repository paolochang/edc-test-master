import axios from "axios";
import faker from "faker";
import { startServer, stopServer } from "../../app.js";
import { sequelize } from "../../db/database.js";
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

  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: "http://localhost:8080",
      validateStatus: null,
    });
  });

  afterAll(async () => {
    await sequelize.drop();
    await stopServer(server);
  });

  describe("POST to /auth/signup", () => {
    it("returns 201 with authorization token when user provides valid information", async () => {
      const user = makeValidUserDetails();

      const res = await request.post("/auth/signup", user);

      expect(res.status).toBe(201);
      expect(res.data.token.length).toBeGreaterThan(0);
    });

    it("returns 409 for existing user", async () => {
      const user = makeValidUserDetails();
      const error = { message: `${user.username} already exists` };

      const res_1 = await request.post("/auth/signup", user);
      expect(res_1.status).toBe(201);

      const res_2 = await request.post("/auth/signup", user);

      expect(res_2.status).toBe(409);
      expect(res_2.data).toMatchObject(error);
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
        const user = makeValidUserDetails();
        delete user[missingFieldName];

        const res = await request.post("/auth/signup", user);

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
        const user = makeValidUserDetails();
        user[fieldName] = faker.internet.password(3);

        const res = await request.post("/auth/signup", user);

        expect(res.status).toBe(400);
        expect(res.data.message).toBe(expectedMessage);
      }
    );
  });
});

function makeValidUserDetails() {
  const fakeUser = faker.helpers.userCard();
  return {
    name: fakeUser.name,
    username: fakeUser.username,
    email: fakeUser.email,
    password: faker.internet.password(10, true),
  };
}
