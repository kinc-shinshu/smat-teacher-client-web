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
  render() {
    console.log(this.props);
    return (
      <div>
        <Navbar />
        <div className="container">
          <h1>試験作成画面</h1>
          <p>{this.props.match.params.id}</p>
        </div>
      </div>
    );
  }
}
