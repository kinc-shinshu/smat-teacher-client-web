import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "../App";

Enzyme.configure({ adapter: new Adapter() });

describe("core", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe("view", () => {
  it("renders BrowserRouter component", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("BrowserRouter").length).toBe(1);
  });

  it("renders 7 Route components", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("Route").length).toBe(7);
  });
});
