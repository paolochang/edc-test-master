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
    let fakeUser;
    beforeAll(() => {
      fakeUser = faker.helpers.userCard();
    });

    it("returns 201 with authorization token when user provides valid information", async () => {
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10, true),
      };

      const res = await request.post("/auth/signup", user);

      expect(res.status).toBe(201);
      expect(res.data.token.length).toBeGreaterThan(0);
    });

    it("returns 409 for existing user", async () => {
      const error = { message: `${fakeUser.username} already exists` };
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10, true),
      };

      const res = await request.post("/auth/signup", user);

      expect(res.status).toBe(409);
      expect(res.data).toMatchObject(error);
    });
  });
});
