import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { parse, Breadcrumb, MathBox } from "../helper";

Enzyme.configure({ adapter: new Adapter() });

describe("parser", () => {
  test("operators can be parsed", () => {
    const result = parse("1*2/3+-4-+5");
    expect(result).toBe("1\\times2\\div3\\pm4\\mp5");
  });

  test("root signs can be parsed", () => {
    const result = parse("#{1}+#{2}");
    expect(result).toBe("\\sqrt{1}+\\sqrt{2}");
  });

  test("fractions can be parsed", () => {
    const result = parse("[1]%[2]+[3]%[4]");
    expect(result).toBe("\\frac{1}{2}+\\frac{3}{4}");
  });

  test("fractions in square root can be parsed", () => {
    const result = parse("#{[1]%[2]+[3]%[4]}");
    expect(result).toBe("\\sqrt{\\frac{1}{2}+\\frac{3}{4}}");
  });

  test("root signs in fraction can be parsed", () => {
    const result = parse("[#{1}+#{2}]%[#{3}+#{4}]");
    expect(result).toBe("\\frac{\\sqrt{1}+\\sqrt{2}}{\\sqrt{3}+\\sqrt{4}}");
  });

  test("various expressions can be parsed", () => {
    const result = parse("[-b+-#{b^{2}-4ac}]%[2a]");
    expect(result).toBe("\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}");
  });
});

describe("breadcrumb", () => {
  test("renders 1 list item", () => {
    const links = [{ path: "/", text: "トップ" }];
    const wrapper = shallow(<Breadcrumb links={links} />);
    expect(wrapper.find("li").length).toBe(1);
  });

  test("renders many list items", () => {
    const links = [
      { path: "/", text: "トップ" },
      { path: "/exams", text: "試験一覧" },
      { path: "/exams/1", text: "試験1" },
      { path: "/exams/1/new", text: "新規作成" }
    ];
    const wrapper = shallow(<Breadcrumb links={links} />);
    expect(wrapper.find("li").length).toBe(4);
  });
});

describe("mathbox", () => {
  // テストの書き方わからん
  test("renders buttons", () => {
    const smatex = "[-b+-#{b^{2}-4ac}]%[2a]";
    const wrapper = shallow(<MathBox init={smatex} />);
    expect(wrapper.find("button").length).toBe(5);
  });
});
