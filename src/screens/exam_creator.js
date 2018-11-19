import React, { Component } from "react";
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
                <Link to="/exams">試験一覧</Link>
              </li>
              <li>
                <label className="white-text" style={{ fontSize: "1em" }}>
                  <a>
                    作成した試験をロード
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

export class ExamCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      open: false
    };
  }

  changeTitle = e => {
    this.setState({ title: e.target.value });
  };

  changeDescription = e => {
    this.setState({ description: e.target.value });
  };

  changeToggle = e => {
    this.setState({ open: e.target.checked });
  };

  createExam = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const tid = 1;
    const data = {
      title: this.state.title,
      description: this.state.description
    };
    const exam = await fetch(URI + "/teachers/" + tid + "/exams", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
    console.log(exam);
    if (this.state.open) {
      const room = await fetch(URI + "/exams/" + exam.id + "/open", {
        method: "POST"
      }).then(response => response.json());
      console.log(room);
    }
    this.props.history.push("/exams");
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h1>新規試験作成</h1>
          <div className="row">
            <div className="input-field col s12">
              <input
                id="title"
                type="text"
                value={this.state.title}
                onChange={this.changeTitle}
              />
              <label for="title">タイトル</label>
            </div>
            <div className="input-field col s12">
              <input
                id="description"
                type="text"
                value={this.state.description}
                onChange={this.changeDescription}
              />
              <label for="description">説明（任意）</label>
            </div>
            <div className="input-field col s12">
              <div className="switch">
                <label>
                  非公開
                  <input
                    type="checkbox"
                    checked={this.state.open}
                    onChange={this.changeToggle}
                  />
                  <span className="lever" />
                  公開
                </label>
              </div>
            </div>
            <button
              onClick={this.createExam}
              className="waves-effect waves-light btn btn-large"
            >
              作成
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ExamCreator);
