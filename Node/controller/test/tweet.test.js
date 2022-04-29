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
});
