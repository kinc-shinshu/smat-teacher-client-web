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
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export class Top extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container center-align">
          <h1>さあ試験をはじめよう</h1>
          <Link className="waves-effect waves-light btn-large" to="/exams">
            試験一覧
          </Link>
        </div>
      </div>
    );
  }
}
