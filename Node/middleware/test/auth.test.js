import httpMock from "node-mocks-http";
import { isAuth } from "../auth";

describe("auth middleware", () => {
  it("returns 401 for the request without Authorization header", () => {
    const request = httpMock.createRequest({
      method: "GET",
      url: "/tweets",
    });
    const response = httpMock.createResponse();
    const next = jest.fn();

    isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toBeCalled();
  });
});
