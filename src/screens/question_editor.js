import React, { Component } from "react";
import { MathBox } from "../helper";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
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

export class QuestionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "ax^{2}+bx+c=0",
      answer: "[-b+-#{b^{2}-4ac}]%[2a]",
      examid: 0,
      question_type: "Math",
      is_loading: true
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
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const qid = this.props.match.params.id;
    const question = await fetch(URI + "/questions/" + qid).then(response =>
      response.json()
    );
    this.setState({
      text: question.text,
      answer: question.answer,
      examid: question.exam_id,
      question_type: question.question_type,
      is_loading: false
    });
  };

  updateQuestion = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const qid = this.props.match.params.id;
    const data = {
      text: this.state.text,
      answer: this.state.answer,
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
  };

  render() {
    const questionInput = (
      <MathBox init={this.state.text} updateState={this.updateText} />
    );
    const answerInput = (
      <MathBox init={this.state.answer} updateState={this.updateAnswer} />
    );
    const preloader = (
      <div className="progress">
        <div className="indeterminate" />
      </div>
    );
    if (this.state.is_loading) {
      return preloader;
    }
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="card-panel grey lighten-4">
            <h4>問題</h4>
            {questionInput}
          </div>
          <div className="card-panel grey lighten-4">
            <h4>解答</h4>
            {answerInput}
          </div>
          <Link
            to={"/exams/" + this.state.examid}
            className="waves-effect waves-light btn-large"
            onClick={this.updateQuestion}
          >
            完成
          </Link>
        </div>
      </div>
    );
  }
}
