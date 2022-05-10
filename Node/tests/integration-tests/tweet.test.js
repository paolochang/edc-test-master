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

describe("INTEGRATION TEST: tweet", () => {
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
      expect(res.data.message).toMatch("text should be at least 3 characters");
    });
  });

  describe("PUT /tweets/:id", () => {
    it("returns 200 and update the tweet when tweetId exist and the tweet is belong to the user", async () => {
      const user = await tester.createNewAccount();
      const text = faker.random.words(3);
      const tweet = await tester.createNewTweet(text, user.jwt);

      const res = await request.put(
        `/tweets/${tweet.data.id}`,
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
      const text = faker.random.words(3);
      const tweet = await tester.createNewTweet(text, user2.jwt);

      const res = await request.put(
        `/tweets/${tweet.data.id}`,
        {
          text: "edited tweet",
        },
        { headers: { Authorization: `Bearer ${user1.jwt}` } }
      );

      expect(res.status).toBe(403);
      expect(res.data).toBe("Forbidden");
    });
  });

  describe("GET /tweets", () => {
    it("returns all tweets when username is not specified in the query", async () => {
      const user1 = await tester.createNewAccount();
      const user2 = await tester.createNewAccount();
      const text1 = faker.random.words(3);
      const text2 = faker.random.words(3);
      await tester.createNewTweet(text1, user1.jwt);
      await tester.createNewTweet(text2, user2.jwt);

      const res = await request.get("/tweets", {
        headers: { Authorization: `Bearer ${user1.jwt}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThanOrEqual(2);
    });

    it("returns only tweets of the given user when username is specified in the query", async () => {
      const user1 = await tester.createNewAccount();
      const user2 = await tester.createNewAccount();
      const text1 = faker.random.words(3);
      const text2 = faker.random.words(3);
      await tester.createNewTweet(text1, user1.jwt);
      await tester.createNewTweet(text2, user2.jwt);

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
      const tweet = await tester.createNewTweet(text, user.jwt);

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
      const tweetId = "nonExistentId";
      const error = { message: `Tweet id(${tweetId}) not found` };

      const res = await request.get(`/tweets/${tweetId}`, {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject(error);
    });
  });

  describe("DELETE", () => {
    it("returns 204 and delete the tweet", async () => {
      const user = await tester.createNewAccount();
      const text = faker.random.words(3);
      const tweet = await tester.createNewTweet(text, user.jwt);
      const error = { message: `Tweet id(${tweet.data.id}) not found` };

      const res = await request.delete(`/tweets/${tweet.data.id}`, {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });

      const check = await request.get(`/tweets/${tweet.data.id}`, {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });

      expect(res.status).toBe(204);
      expect(check.status).toBe(404);
      expect(check.data).toMatchObject(error);
    });

    it("returns 404 when tweet id is not found", async () => {
      const user = await tester.createNewAccount();
      const tweetId = "nonExistentId";
      const error = { message: `Tweet not found: ${tweetId}` };

      const res = await request.delete(`/tweets/${tweetId}`, {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject(error);
    });

    it("returns 403 when tweet is not belong to the user", async () => {
      const user1 = await tester.createNewAccount();
      const user2 = await tester.createNewAccount();
      const text = faker.random.words(3);
      const tweet = await tester.createNewTweet(text, user2.jwt);

      const res = await request.delete(`/tweets/${tweet.data.id}`, {
        headers: { Authorization: `Bearer ${user1.jwt}` },
      });

      const check = await request.get(`/tweets/${tweet.data.id}`, {
        headers: { Authorization: `Bearer ${user2.jwt}` },
      });

      expect(res.status).toBe(403);
      expect(check.status).toBe(200);
      expect(check.data.text).toBe(tweet.data.text);
    });
  });
});
