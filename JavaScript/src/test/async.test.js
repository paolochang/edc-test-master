const fetchProduct = require("../async");

describe("Async", () => {
  const dataObject = { item: "Milk", price: 4.99 };

  it("promises return object / callback done", (done) => {
    fetchProduct().then((data) => {
      expect(data).toEqual(dataObject);
      done();
    });
  });

  it("promises return object / return", () => {
    return fetchProduct().then((data) => {
      expect(data).toEqual(dataObject);
    });
  });

  it("async / await", async () => {
    const data = await fetchProduct();
    expect(data).toEqual(dataObject);
  });

  it("async - resolves", () => {
    return expect(fetchProduct()).resolves.toEqual(dataObject);
  });

  it("promises error", () => {
    return expect(fetchProduct("error")).rejects.toBe("network error");
  });

  it("async / await error", async () => {
    try {
      await fetchProduct("error");
    } catch (err) {
      expect(err).toBe("network error");
    }
  });
});
