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
  let tester;

  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: "http://localhost:8080",
      validateStatus: null,
    });
    tester = new Tester(request);
  });

  afterAll(async () => {
    await sequelize.drop();
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

  describe("Tweet API", () => {
    describe("POST /tweets", () => {
      it("returns 201 and create a tweet", async () => {
        const user = await tester.createNewAccount();
        const text = faker.random.words(3);

        const res = await request.post(
          "/tweets",
          { text },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );

        expect(res.status).toBe(201);
        expect(res.data).toMatchObject({
          name: user.name,
          username: user.username,
          text,
        });
      });

      it("returns 400 for validation fail when text is less than 3 character", async () => {
        const user = await tester.createNewAccount();
        const text = faker.random.alpha(2);

        const res = await request.post(
          "/tweets",
          { text },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );

        expect(res.status).toBe(400);
        expect(res.data.message).toMatch(
          "text should be at least 3 characters"
        );
      });
    });

    describe("PUT /tweets/:id", () => {
      it("returns 200 and update the tweet when tweetId exist and the tweet is belong to the user", async () => {
        const user = await tester.createNewAccount();
        const tweet = await tester.createNewTweet(user.jwt);

        const res = await request.put(
          `/tweets/${tweet.id}`,
          {
            text: "edited tweet",
          },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );

        expect(res.status).toBe(200);
        expect(res.data.text).toBe("edited tweet");
      });

      it("returns 404 when tweetId is not found", async () => {
        const user = await tester.createNewAccount();
        const tweetId = "nonExistentId";
        const error = { message: `Tweet not found: ${tweetId}` };

        const res = await request.put(
          `/tweets/${tweetId}`,
          {
            text: "edited tweet",
          },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );

        expect(res.status).toBe(404);
        expect(res.data).toMatchObject(error);
      });

      it("returns 403 when tweet is not belong to the user", async () => {
        const user1 = await tester.createNewAccount();
        const user2 = await tester.createNewAccount();
        const tweet = await tester.createNewTweet(user1.jwt);

        const res = await request.put(
          `/tweets/${tweet.id}`,
          {
            text: "edited tweet",
          },
          { headers: { Authorization: `Bearer ${user2.jwt}` } }
        );

        expect(res.status).toBe(403);
        expect(res.data).toBe("Forbidden");
      });
    });

    describe("GET /tweets", () => {
      it("returns all tweets when username is not specified in the query", async () => {
        const user1 = await tester.createNewAccount();
        const user2 = await tester.createNewAccount();

        await request.post(
          "/tweets",
          { text: faker.random.words(3) },
          { headers: { Authorization: `Bearer ${user1.jwt}` } }
        );
        await request.post(
          "/tweets",
          { text: faker.random.words(3) },
          { headers: { Authorization: `Bearer ${user2.jwt}` } }
        );

        const res = await request.get("/tweets", {
          headers: { Authorization: `Bearer ${user1.jwt}` },
        });

        expect(res.status).toBe(200);
        expect(res.data.length).toBeGreaterThanOrEqual(2);
      });

      it("returns only tweets of the given user when username is specified in the query", async () => {
        const user1 = await tester.createNewAccount();
        const user2 = await tester.createNewAccount();

        await request.post(
          "/tweets",
          { text: faker.random.words(3) },
          { headers: { Authorization: `Bearer ${user1.jwt}` } }
        );
        await request.post(
          "/tweets",
          { text: faker.random.words(3) },
          { headers: { Authorization: `Bearer ${user2.jwt}` } }
        );

        const res = await request.get("/tweets", {
          headers: { Authorization: `Bearer ${user1.jwt}` },
          params: { username: user1.username },
        });

        expect(res.status).toBe(200);
        expect(res.data.length).toEqual(1);
        expect(res.data[0].username).toMatch(user1.username);
      });
    });

    describe("GET /tweets/:id", () => {
      it("returns 200 and a tweet when tweet id is found", async () => {
        const user = await tester.createNewAccount();
        const text = faker.random.words(3);

        const tweet = await request.post(
          "/tweets",
          { text },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );

        const res = await request.get(`/tweets/${tweet.data.id}`, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });

        expect(res.status).toBe(200);
        expect(res.data).toMatchObject({
          text,
          name: user.name,
          username: user.username,
        });
      });

      it("returns 404 and a tweet when tweet id is not found", async () => {
        const user = await tester.createNewAccount();
        const tweetId = faker.random.alpha(3);
        const error = { message: `Tweet id(${tweetId}) not found` };

        const res = await request.get(`/tweets/${tweetId}`, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });

        expect(res.status).toBe(404);
        expect(res.data).toMatchObject(error);
      });
    });

    describe("DELETE", () => {});
  });
});

class Tester {
  constructor(request) {
    this.request = request;
    this.fakeUser = {
      ...faker.helpers.userCard(),
      password: faker.internet.password(10, true),
    };
  }

  getNewUserInfo() {
    const newTester = faker.helpers.userCard();
    return {
      name: newTester.name,
      username: newTester.username,
      email: newTester.email,
      password: faker.internet.password(10, true),
    };
  }

  getSignUpInfo() {
    return {
      name: this.fakeUser.name,
      username: this.fakeUser.username,
      email: this.fakeUser.email,
      password: this.fakeUser.password,
    };
  }

  getLoginInfo() {
    return {
      username: this.fakeUser.username,
      password: this.fakeUser.password,
    };
  }

  async createNewAccount() {
    const newTester = this.getNewUserInfo();
    const res = await this.request.post("/auth/signup", newTester);
    return {
      ...newTester,
      jwt: res.data.token,
    };
  }

  async createNewTweet(token) {
    const text = faker.random.words(3);
    const res = await this.request.post(
      "/tweets",
      { text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
}
