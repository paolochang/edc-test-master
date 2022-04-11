const ProductService = require("../product_service_no_di.js");
const ProductClient = require("../product_client.js");

jest.mock("../product_client");

describe("ProductService", () => {
  const fetchItems = jest.fn(async () => [
    { item: "Milk", available: true },
    { item: "Banana", available: false },
  ]);

  ProductClient.mockImplementation(() => {
    return { fetchItems };
  });

  let productService;

  beforeEach(() => {
    productService = new ProductService();
    /**
     * jest.config.js
     * clearMocks: true
     * or
     * manually clear the mocks
     */
    fetchItems.mockClear();
    ProductClient.mockClear();
  });

  it("filter available items", async () => {
    const items = await productService.fetchAvailableItems();
    expect(items.length).toBe(1);
    expect(items).toEqual([{ item: "Milk", available: true }]);
  });
});
