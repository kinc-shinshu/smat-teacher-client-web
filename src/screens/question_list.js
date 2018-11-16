import React, { Component } from "react";
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

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      is_loading: true
    };
    this.getQuestions();
  }

  getQuestions = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.examid;
    const questions = await fetch(URI + "/exams/" + examid + "/questions").then(
      response => response.json()
    );
    this.setState({ questions: questions, is_loading: false });
  };

  render() {
    const items = this.state.questions.map((q, i) => {
      return (
        <Link
          to={"/questions/" + q.id + "/edit"}
          key={i}
          className="collection-item"
          style={{ minHeight: "5em" }}
        >
          <MathJax.Provider>
            <MathJax.Node formula={parse(q.smatex)} className="left" />
          </MathJax.Provider>
        </Link>
      );
    });
    const preloader = (
      <div className="progress">
        <div className="indeterminate" />
      </div>
    );
    if (this.state.is_loading) {
      return preloader;
    } else {
      return <div className="collection left-align">{items}</div>;
    }
  }
}

export class QuestionList extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2>問題一覧</h2>
          <ItemList examid={this.props.match.params.id} />
        </div>
      </div>
    );
  }
}
