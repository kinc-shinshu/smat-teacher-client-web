import React, { Component } from "react";
import { parse, Breadcrumb } from "../helper";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import MathJax from "react-mathjax";
import { Link } from "react-router-dom";

class Navbar extends Component {
  // 問題をPOSTする関数
  postQuestion = async e => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.examid;
    const data = {
      smatex: e.smatex,
      latex: e.latex,
      ans_smatex: e.ans_smatex,
      ans_latex: e.ans_latex,
      examid: e.examid,
      question_type: e.question_type
    };
    const question = await fetch(URI + "/exams/" + examid + "/questions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
    console.log(question);
    this.props.reloadList();
  };
  // Fileを読み込んでPOSTする関数
  inputFile = e => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    fileReader.readAsText(file);
    fileReader.onloadend = event => {
      const json = JSON.parse(event.target.result);
      json.map((q, i) => {
        return this.postQuestion(q);
      });
    };
  };

  render() {
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper container">
            <Link to="/" className="brand-logo">
              Smart Teach
            </Link>
            <ul className="right hide-on-med-and-down">
              <li>
                <Link to="/exams">試験一覧</Link>
              </li>
              <li>
                <Link to={"/exams/" + this.props.examid + "/new"}>
                  新しい問題を追加
                </Link>
              </li>
              <li>
                <label className="white-text" style={{ fontSize: "1em" }}>
                  <a>
                    作成した問題をロード
                    <input
                      type="file"
                      style={{ display: "None" }}
                      onChange={this.inputFile}
                    />
                  </a>
                </label>
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
  constructor(props) {
    super(props);
    this.state = {
      detail: [],
      forReload: true
    };
    this.getDetail();
    this.handler = this.handler.bind(this);
  }
  handler() {
    this.refs.functions.getQuestions();
  }
  getDetail = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
    const detail = await fetch(URI + "/exams/" + examid).then(response =>
      response.json()
    );
    this.setState({ detail });
  };

  render() {
    const examid = this.props.match.params.id;
    const links = [
      { path: "/", text: "トップ" },
      { path: "/exams", text: "試験一覧" },
      { path: "/exams/" + examid, text: this.state.detail.title }
    ];
    return (
      <div>
        <Navbar examid={this.props.match.params.id} reloadList={this.handler} />
        <div className="container">
          <Breadcrumb links={links} />
          <p>{this.state.detail.description}</p>
          <ItemList examid={this.props.match.params.id} ref="functions" />
        </div>
        <div className="fixed-action-btn">
          <Link
            to={"/exams/" + this.props.match.params.id + "/new"}
            className="btn-floating btn-large waves-effect waves-light"
          >
            <i className="large material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}
