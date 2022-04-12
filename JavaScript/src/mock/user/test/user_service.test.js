const UserClient = require("../user_client.js");
const UserService = require("../user_service.js");

jest.mock("../user_client");

describe("UserService", () => {
  const login = jest.fn(async () => "success");

  UserClient.mockImplementation(() => {
    return { login };
  });

  let userService;

  beforeEach(() => {
    userService = new UserService(new UserClient());
  });

  it("call login", async () => {
    await userService.login("abc", "abc");
    expect(login.mock.calls.length).toBe(1);
  });

  it("should not call login when user already logged in", async () => {
    await userService.login("abc", "abc");
    await userService.login("abc", "abc");
    expect(login.mock.calls.length).toBe(1);
  });
});
