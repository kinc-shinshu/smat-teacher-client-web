import React, { Component, createRef } from "react";
import { parse } from "../helper";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import MathJax from "react-mathjax";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper container">
            <a href="#!" className="brand-logo">
              Smart Teach
            </a>
            <ul className="right hide-on-med-and-down">
              <li>
                <Link to="edit">新しい問題を追加</Link>
              </li>
              <li>
                <label className="white-text" style={{ fontSize: "1em" }}>
                  <a>
                    作成した問題をロード
                    <input
                      type="file"
                      style={{ display: "None" }}
                      onChange={this.change}
                    />
                  </a>
                </label>
              </li>
              <li>
                <Link to="done">完成</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

class MathBox extends Component {
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

  add = text => {
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
        input.setSelectionRange(cursor, cursor + text.length);
      }
    );
  };

  sqrt = () => {
    this.add("#{?}");
  };

  frac = () => {
    this.add("[?]%[?]");
  };

  index = () => {
    this.add("?^{?}");
  };

  times = () => {
    this.add("*");
  };

  div = () => {
    this.add("/");
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
            onChange={this.change}
            value={this.state.input}
          />
        </div>
      </div>
    );
  }
}

export class QuestionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "ax^{2}+bx+c=0",
      answer: "[-b+-#{b^{2}-4ac}]%[2a]"
    };
    this.getQuestion();
    this.updateText = this.updateText.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
  }

  updateText(text) {
    this.setState({ text: text });
  }

  updateAnswer(answer) {
    this.setState({ answer: answer });
  }

  getQuestion = async () => {
    const URI = "https://smat-api.herokuapp.com";
    const qid = this.props.match.params.id;
    const question = await fetch(URI + "/rooms/168/questions/" + qid).then(
      response => response.json()
    );
    console.log(question);
    this.setState({ text: question.text, answer: question.answer });
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="card-panel grey lighten-4">
            <h4>問題</h4>
            <MathBox init={this.state.text} updateState={this.updateText} />
          </div>
          <div className="card-panel grey lighten-4">
            <h4>解答</h4>
            <MathBox init={this.state.answer} updateState={this.updateAnswer} />
          </div>
        </div>
      </div>
    );
  }
}
