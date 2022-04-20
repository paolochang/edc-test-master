import React from "react";
import { render } from "@testing-library/react";
import Navbar from "../navbar";

describe("Navbar", () => {
  it("compares snapshot", () => {
    const component = render(<Navbar totalCount={4} />);
    expect(component.container).toMatchSnapshot();
  });
});
