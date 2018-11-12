import React, { Component } from "react";
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

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: [],
      is_loading: true
    };
    this.getExams();
  }

  getExams = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const tid = this.props.tid;
    const exams = await fetch(URI + "/teachers/" + tid + "/exams").then(
      response => response.json()
    );
    this.setState({ exams: exams, is_loading: false });
  };

  render() {
    const items = this.state.exams.map((e, i) => {
      return (
        <Link to={"/exams/" + e.id} key={i} className="collection-item">
          {e.title}
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

export class ExamList extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2>試験一覧</h2>
          <ItemList tid={1} />
        </div>
      </div>
    );
  }
}
