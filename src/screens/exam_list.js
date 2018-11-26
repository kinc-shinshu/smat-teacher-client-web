import React, { Component } from "react";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../helper";

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
                <Link to="/">トップページ</Link>
              </li>
              <li>
                <Link to="/exams/new">新しい試験を作成</Link>
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
  deleteClick = async e => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const key = e.target.getAttribute("roomId");
    await fetch(URI + "/exams/" + key, {
      method: "DELETE"
    });
    this.getExams();
  };

  render() {
    const items = this.state.exams.map((e, i) => {
      return (
        <Link to={"/exams/" + e.id} key={i} className="collection-item">
          {e.title}
          <Link to={"/exams/"} href="#delete" className="secondary-content ">
            <i
              className="material-icons"
              roomid={e.id}
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

export class ExamList extends Component {
  render() {
    const links = [
      { path: "/", text: "トップ" },
      { path: "/exams", text: "試験一覧" }
    ];
    return (
      <div>
        <Navbar />
        <div className="container">
          <Breadcrumb links={links} />
          <ItemList tid={1} />
        </div>
        <div className="fixed-action-btn">
          <Link
            to="/exams/new"
            className="btn-floating btn-large waves-effect waves-light"
          >
            <i className="large material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}
