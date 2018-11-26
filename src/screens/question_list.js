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
    this.props.reloadlist();
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

  deleteClick = async e => {
    const key = e.target.getAttribute("questionId");
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    await fetch(URI + "/questions/" + key, {
      method: "DELETE"
    });
    this.getQuestions();
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
          <Link
            to={"/exams/" + this.props.examid}
            className="secondary-content "
          >
            <i
              className="material-icons"
              questionid={q.id}
              onClick={this.deleteClick}
            >
              delete
            </i>
          </Link>
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
      open: false
    };
    this.getDetail();
    this.getChildQuestions = this.getChildQuestions.bind(this);
  }

  getChildQuestions() {
    this.refs.functions.getQuestions();
  }

  getDetail = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
    const detail = await fetch(URI + "/exams/" + examid).then(response =>
      response.json()
    );
    console.log(detail);
    if (detail.room_id === -1) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
    this.setState({ detail });
  };
  changeRoomStatus = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
    if (this.state.open) {
      await fetch(URI + "/exams/" + examid + "/close", {
        method: "POST"
      }).then(response => console.log(response));
      this.setState({ open: false });
    } else {
      await fetch(URI + "/exams/" + examid + "/open", {
        method: "POST"
      }).then(response => console.log(response));
      this.setState({ open: true });
      const detail = await fetch(URI + "/exams/" + examid).then(response =>
        response.json()
      );
      this.setState({ detail });
    }
  };

  updateDetail = async detail => {
    const data = { ...detail };
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
    const response = await fetch(URI + "/exams/" + examid, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
    console.log(response);
    this.setState({ detail });
  };

  render() {
    const examid = this.props.match.params.id;
    const links = [
      { path: "/", text: "トップ" },
      { path: "/exams", text: "試験一覧" },
      {
        action: () => {
          const title = window.prompt("タイトル", this.state.detail.title);
          if (title === null) return;
          const detail = { ...this.state.detail, title };
          this.updateDetail(detail);
        },
        path: "/exams/" + examid,
        text: this.state.detail.title
      }
    ];
    let roomId = (
      <h5 className="center-align">
        部屋番号:
        {this.state.detail.room_id}
      </h5>
    );
    if (this.state.open === false) {
      roomId = "";
    let description = this.state.detail.description;
    if (description === "") {
      description = <span className="grey-text">クリックで説明を追加</span>;

    }
    return (
      <div>
        <Navbar
          examid={this.props.match.params.id}
          reloadlist={this.getChildQuestions}
        />
        <div className="container">
          <Breadcrumb links={links} />
          <p
            onClick={() => {
              const description = window.prompt(
                "説明",
                this.state.detail.description
              );
              if (description === null) return;
              const detail = { ...this.state.detail, description };
              this.updateDetail(detail);
            }}
          >
            {description}
          </p>
          {roomId}
          <div className="switch right-align">
            <label>
              非公開
              <input
                type="checkbox"
                checked={this.state.open}
                onChange={this.changeRoomStatus}
              />
              <span className="lever" />
              公開
            </label>
          </div>
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
