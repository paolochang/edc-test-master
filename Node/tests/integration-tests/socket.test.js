import axios from "axios";
import faker from "faker";
import { io as SocketClient } from "socket.io-client";
import { startServer, stopServer } from "../../app";
import Tester from "./tester_utils";

describe("INTEGRATION TEST: socket", () => {
  let server;
  let request;
  let clientSocket;
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

  beforeEach(() => {
    clientSocket = new SocketClient(
      `http://localhost:${server.address().port}`
    );
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  it("does not accept a connection without authorization token", async () => {
    const errorMessage =
      "Server was expected to accept the connection but did not";

    const socketPromise = new Promise((resolve, reject) => {
      clientSocket.on("connect", () => {
        resolve("success");
      });

      clientSocket.on("connect_error", () => {
        reject(new Error(errorMessage));
      });
    });

    clientSocket.connect();
    await expect(socketPromise).rejects.toThrowError(errorMessage);
  });

  it("accepts a connection with authorization token", async () => {
    const user = await tester.createNewAccount();
    clientSocket.auth = (cb) => cb({ token: user.jwt });

    const socketPromise = new Promise((resolve, reject) => {
      clientSocket.on("connect", () => {
        resolve("success");
      });

      clientSocket.on("connect_error", () => {
        reject(
          new Error("Server was expected to accept the connection but did not")
        );
      });
    });

    clientSocket.connect();
    await expect(socketPromise).resolves.toEqual("success");
  });

  it("emits 'tweets' event when new tweet is posted", async () => {
    const user = await tester.createNewAccount();
    clientSocket.auth = (cb) => cb({ token: user.jwt });
    const text = faker.random.words(3);

    clientSocket.on("connect", async () => {
      await tester.createNewTweet(text, user.jwt);
    });

    const socketPromise = new Promise((resolve) => {
      clientSocket.on("tweets", (tweet) => resolve(tweet));
    });

    clientSocket.connect();

    await expect(socketPromise).resolves.toMatchObject({
      name: user.name,
      username: user.username,
      text,
    });
  });
});
