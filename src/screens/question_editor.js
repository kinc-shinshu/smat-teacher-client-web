import React, { Component } from "react";
import { MathBox, parse, Breadcrumb } from "../helper";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class Navbar extends Component {
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
                <Link to={"/exams/" + this.props.examid}>問題一覧</Link>
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
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export class QuestionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latex: "ax^{2}+bx+c=0",
      smatex: "ax^{2}+bx+c=0",
      ans_latex: "\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}",
      ans_smatex: "[-b+-#{b^{2}-4ac}]%[2a]",
      examid: 0,
      question_type: "Math",
      is_loading: true,
      detail: []
    };
    this.getQuestion();
    this.updateText = this.updateText.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
  }

  updateText(text) {
    this.setState({ smatex: text });
    this.setState({ latex: parse(text) });
  }

  updateAnswer(answer) {
    this.setState({ ans_smatex: answer });
    this.setState({ ans_latex: parse(answer) });
  }

  getQuestion = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const qid = this.props.match.params.id;
    const question = await fetch(URI + "/questions/" + qid).then(response =>
      response.json()
    );
    await this.setState({
      smatex: question.smatex,
      latex: question.latex,
      ans_smatex: question.ans_smatex,
      ans_latex: question.ans_latex,
      examid: question.exam_id,
      question_type: question.question_type,
      is_loading: false
    });
    this.getDetail();
  };

  updateQuestion = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const qid = this.props.match.params.id;
    const data = {
      smatex: this.state.smatex,
      latex: this.state.latex,
      ans_smatex: this.state.ans_smatex,
      ans_latex: this.state.ans_latex,
      question_type: this.state.question_type
    };
    const question = await fetch(URI + "/questions/" + qid, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
    console.log(question);
    this.props.history.push("/exams/" + this.state.examid);
  };

  getDetail = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.state.examid;
    const detail = await fetch(URI + "/exams/" + examid).then(response =>
      response.json()
    );
    this.setState({ detail });
  };

  render() {
    const questionInput = (
      <MathBox init={this.state.smatex} updateState={this.updateText} />
    );
    const answerInput = (
      <MathBox init={this.state.ans_smatex} updateState={this.updateAnswer} />
    );
    const preloader = (
      <div className="progress">
        <div className="indeterminate" />
      </div>
    );
    if (this.state.is_loading) {
      return preloader;
    }
    const examid = this.state.examid;
    const links = [
      { path: "/", text: "トップ" },
      { path: "/exams", text: "試験一覧" },
      { path: "/exams/" + examid, text: this.state.detail.title },
      { path: "/exams/" + examid + "/new", text: "新規作成" }
    ];
    return (
      <div>
        <Navbar examid={this.state.examid} />
        <div className="container">
          <Breadcrumb links={links} />
          <div className="card-panel grey lighten-4">
            <h4>問題</h4>
            {questionInput}
          </div>
          <div className="card-panel grey lighten-4">
            <h4>解答</h4>
            {answerInput}
          </div>
          <a
            className="waves-effect waves-light btn-large"
            onClick={this.updateQuestion}
          >
            完成
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(QuestionEditor);
