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

export class QuestionCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "ax^{2}+bx+c=0",
      answer: "[-b+-#{b^{2}-4ac}]%[2a]",
      examid: this.props.match.params.id,
      question_type: "Math",
      is_loading: true
    };
    this.updateText = this.updateText.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
  }

  updateText(text) {
    this.setState({ text: text });
  }

  updateAnswer(answer) {
    this.setState({ answer: answer });
  }

  updateQuestion = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
    const data = {
      text: this.state.text,
      answer: this.state.answer,
      examid: this.state.examid,
      question_type: this.state.question_type
    };
    const question = await fetch(URI + "/exams/" + examid + "/questions", {
      method: "POST",
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
