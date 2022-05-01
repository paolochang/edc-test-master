import faker from "faker";
import { TweetController } from "../tweet.js";
import httpMocks from "node-mocks-http";
// import * as tweetsRepository from "../../data/tweet.js";

jest.mock("../../data/tweet.js");

describe("TweetController", () => {
  let tweetController;
  let tweetsRepository;
  let mockedSocket;
  beforeEach(() => {
    tweetsRepository = {};
    mockedSocket = { emit: jest.fn() };
    tweetController = new TweetController(tweetsRepository, () => mockedSocket);
  });

  describe("getTweets", () => {
    it("returns all tweets when username is not provided", async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const allTweets = [
        {
          text: faker.random.words(3),
        },
        {
          text: faker.random.words(3),
        },
      ];
      tweetsRepository.getAll = () => allTweets;

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(allTweets);
    });

    it("returns tweets for the given user when username is provided", async () => {
      const username = faker.internet.userName();
      const request = httpMocks.createRequest({
        query: { username },
      });
      const response = httpMocks.createResponse();
      const userTweets = [
        {
          text: faker.random.words(3),
        },
      ];
      tweetsRepository.getAllByUsername = jest.fn(() => userTweets);

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(userTweets);
      expect(tweetsRepository.getAllByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe("getTweet", () => {
    let tweetId, request, response;

    beforeEach(() => {
      tweetId = faker.datatype.uuid();
      request = httpMocks.createRequest({
        params: { id: tweetId },
      });
      response = httpMocks.createResponse();
    });

    it("returns a tweet for the given id", async () => {
      const aTweet = { text: faker.random.words(3) };
      tweetsRepository.getById = jest.fn(() => aTweet);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(aTweet);
      expect(tweetsRepository.getById).toHaveBeenCalledWith(tweetId);
    });

    it("returns 404 when tweet is not found with the given id", async () => {
      const error = { message: `Tweet id(${tweetId}) not found` };
      tweetsRepository.getById = jest.fn(() => undefined);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual(error);
      expect(tweetsRepository.getById).toHaveBeenCalledWith(tweetId);
    });
  });

  describe("createTweet", () => {
    let newTweet, userId, request, response;

    beforeEach(() => {
      newTweet = faker.random.words(3);
      userId = faker.datatype.uuid();
      request = httpMocks.createRequest({
        body: { text: newTweet },
        userId,
      });
      response = httpMocks.createResponse();
    });

    it("return 201 with new tweet", async () => {
      tweetsRepository.create = jest.fn((text, userId) => ({ text, userId }));

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({ text: newTweet, userId });
      expect(tweetsRepository.create).toHaveBeenCalledWith(newTweet, userId);
    });

    it("should send an event to a websocket channel", async () => {
      tweetsRepository.create = jest.fn((text, userId) => ({ text, userId }));

      await tweetController.createTweet(request, response);

      expect(mockedSocket.emit).toHaveBeenCalledWith("tweets", {
        text: newTweet,
        userId,
      });
    });
  });

  describe("updateTweet", () => {
    let tweetId, updatedText, request, response, userId;

    beforeEach(() => {
      tweetId = faker.datatype.uuid();
      updatedText = faker.random.words(3);
      userId = faker.datatype.uuid();
      request = httpMocks.createRequest({
        params: { id: tweetId },
        body: { text: updatedText },
        userId,
      });
      response = httpMocks.createResponse();
    });

    it("returns 200 with updated tweet", async () => {
      tweetsRepository.getById = () => ({
        text: faker.random.words(3),
        userId,
      });
      tweetsRepository.update = (tweetId, newText) => ({ text: newText });

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ text: updatedText });
    });
  });

  describe("deleteTweet", () => {});
});
