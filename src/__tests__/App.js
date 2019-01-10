import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "../App";

Enzyme.configure({ adapter: new Adapter() });

describe("core", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe("view", () => {
  test("renders BrowserRouter component", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("BrowserRouter").length).toBe(1);
  });

  test("renders 7 Route components", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("Route").length).toBe(7);
  });
});
