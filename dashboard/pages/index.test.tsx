import { render, screen } from "@testing-library/react";
import Home from "./index";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: "Welcome to Storybook Academy",
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders homepage unchanged", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
