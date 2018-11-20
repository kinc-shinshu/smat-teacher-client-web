import React, { Component, createRef } from "react";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import MathJax from "react-mathjax";

export function parse(text) {
  let result = text.replace(/\*/g, "\\times");
  result = result.replace(/\//g, "\\div");
  result = result.replace(/\+-/g, "\\pm");
  result = result.replace(/-\+/g, "\\mp");
  const ss = result.match(/#{.+?}/g);
  if (ss != null) {
    for (let s of ss) {
      let k = s.match(/[^#]+/g);
      result = result.replace(s, "\\sqrt{" + k[0].slice(1, -1) + "}");
    }
  }
  const fs = result.match(/\[.+?]%\[.+?]/g);
  if (fs != null) {
    for (let f of fs) {
      let k = f.match(/[^%]+/g);
      result = result.replace(
        f,
        "\\frac{" + k[0].slice(1, -1) + "}{" + k[1].slice(1, -1) + "}"
      );
    }
  }
  result = result.replace(/@|#|\$|%|&/, "");
  return result;
}

export class MathBox extends Component {
  constructor(props) {
    super(props);
    const initText = this.props.init;
    this.state = {
      timer: undefined,
      input: initText,
      output: parse(initText)
    };
    this.inputForm = createRef();
  }

  add = (text, range) => {
    const input = this.inputForm.current;
    const cursor = input.selectionStart;
    const before = this.state.input.slice(0, cursor);
    const after = this.state.input.slice(cursor);
    const changed = before + text + after;
    this.props.updateState(changed);
    this.setState(
      {
        input: changed,
        output: parse(changed)
      },
      () => {
        input.focus();
        input.setSelectionRange(cursor + range[0], cursor + range[1]);
      }
    );
  };

  sqrt = () => {
    this.add("#{?}", [2, 3]);
  };

  frac = () => {
    this.add("[?]%[?]", [5, 6]);
  };

  index = () => {
    this.add("?^{?}", [0, 1]);
  };

  times = () => {
    this.add("*", [1, 1]);
  };

  div = () => {
    this.add("/", [1, 1]);
  };

  keydown = e => {
    const key = e.keyCode;
    if (key === 103) {
      this.sqrt();
      e.preventDefault();
    }
    if (key === 104) {
      this.frac();
      e.preventDefault();
    }
    if (key === 105) {
      this.index();
      e.preventDefault();
    }
  };

  change = e => {
    const input = e.target.value;
    const result = parse(input);
    this.setState({
      input: input
    });
    this.props.updateState(input);
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(() => {
        this.setState({
          output: result
        });
      }, 300)
    });
  };

  render() {
    return (
      <div>
        <div className="card white">
          <div className="card-content flow-text" style={{ minHeight: "6em" }}>
            <MathJax.Provider>
              <MathJax.Node formula={this.state.output} />
            </MathJax.Provider>
          </div>
        </div>
        <button
          className="waves-effect waves-light btn-large"
          onClick={this.sqrt}
          style={{ fontSize: "0.8em" }}
        >
          <MathJax.Provider>
            <MathJax.Node formula="\sqrt{\boxed{\phantom{0}}}" />
          </MathJax.Provider>
        </button>
        <button
          className="waves-effect waves-light btn-large"
          onClick={this.frac}
          style={{ fontSize: "0.6em" }}
        >
          <MathJax.Provider>
            <MathJax.Node formula="\frac{\boxed{\phantom{0}}}{\boxed{\phantom{0}}}" />
          </MathJax.Provider>
        </button>
        <button
          className="waves-effect waves-light btn-large"
          onClick={this.index}
          style={{ fontSize: "0.8em" }}
        >
          <MathJax.Provider>
            <MathJax.Node formula="\boxed{\phantom{0}}^{\boxed{\phantom{0}}}" />
          </MathJax.Provider>
        </button>
        <button
          className="waves-effect waves-light btn-large"
          onClick={this.times}
          style={{ fontSize: "1.2em" }}
        >
          <MathJax.Provider>
            <MathJax.Node formula="\times" />
          </MathJax.Provider>
        </button>
        <button
          className="waves-effect waves-light btn-large"
          onClick={this.div}
          style={{ fontSize: "1.2em" }}
        >
          <MathJax.Provider>
            <MathJax.Node formula="\div" />
          </MathJax.Provider>
        </button>
        <div className="input-field">
          <input
            ref={this.inputForm}
            type="text"
            style={{ fontSize: "2em" }}
            onKeyDown={this.keydown}
            onChange={this.change}
            value={this.state.input}
          />
        </div>
      </div>
    );
  }
}
