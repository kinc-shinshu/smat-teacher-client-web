import React, { Component } from "react";
import { MathBox, parse, Breadcrumb } from "../helper";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { Bar, Pie, Line } from "react-chartjs-2";

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

export class ExamResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smatex: "ax^{2}+bx+c=0",
      latex: "ax^{2}+bx+c=0",
      ans_smatex: "[-b+-#{b^{2}-4ac}]%[2a]",
      ans_latex: "\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}",
      examid: this.props.match.params.id,
      question_type: "Math",
      is_loading: true,
      detail: []
    };
    this.getDetail();
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

  createQuestion = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
    const data = {
      smatex: this.state.smatex,
      latex: this.state.latex,
      ans_smatex: this.state.ans_smatex,
      ans_latex: this.state.ans_latex,
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
    this.props.history.push("/exams/" + this.state.examid);
  };

  getDetail = async () => {
    const URI = "https://smat-api-dev.herokuapp.com/v1";
    const examid = this.props.match.params.id;
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
    const examid = this.props.match.params.id;
    const links = [
      { path: "/", text: "トップ" },
      { path: "/exams", text: "試験一覧" },
      { path: "/exams/" + examid, text: this.state.detail.title },
      { path: "/exams/" + examid + "/results", text: "結果" }
    ];

    const data = {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "#26a69a",
          data: [0.1, 0.2, 0.3, 0.5, 0.8, 0.4, 0.7]
        }
      ]
    };

    const dataForContest = {
      labels: [
        "問題1",
        "問題2",
        "問題3",
        "問題4"
      ],
      datasets: [
        {
          label: "正解率",
          backgroundColor: "#26a69a",
          data: [
            0.44722263,
            0.74711034,
            0.82173555,
            0.37008046,
            0.72391986,
            0.47375261,
            0.93916767,
            0.59019516,
            0.85392795,
            0.76520539,
            0.66937194,
            0.52311575,
            0.86767557,
            0.92118334,
            0.8665264
          ]
        }
      ]
    };

    const dataForContestSmall1 = {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          label: "正解率",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [0.44722263, 0.59019516, 0.74711034, 0.77008046, 0.82173555]
        }
      ]
    };

    const dataForContestSmall2 = {
      labels: [1, 2, 3, 4],
      datasets: [
        {
          label: "正解率",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [0.5722263, 0.79019516, 0.83711034, 0.83008046]
        }
      ]
    };

    const dataForContestSmall3 = {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          label: "正解率",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [0.14722263, 0.19019516, 0.34711034, 0.47008046, 0.52173555]
        }
      ]
    };

    const pieData = {
      labels: ["Red", "Green", "Yellow"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
        }
      ]
    };

    const pieDataForContest = {
      labels: ["正解", "不正解"],
      datasets: [
        {
          data: [0.7370019446910346, 1 - 0.7370019446910346],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"]
        }
      ]
    };

    return (
      <div>
        <Navbar examid={this.props.match.params.id} />
        <div className="container">
          <Breadcrumb links={links} />
          <h3 className="center-align">全体結果</h3>
          <div className="row">
            <div className="col s3">
              <Pie data={pieDataForContest} height={300} />
            </div>
            <div className="col s9">
              <Bar
                data={dataForContest}
                width={100}
                height={300}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          max: 1,
                          beginAtZero: true
                        }
                      }
                    ]
                  }
                }}
              />
            </div>
          </div>
          <h3 className="center-align">挑戦回数</h3>
          <div className="row">
            <div className="col s6">
              <Line
                data={dataForContestSmall1}
                options={{
                  title: {
                    display: true,
                    text: "問題１"
                  },
                  legend: {
                    display: true,
                    position: "bottom"
                  }
                }}
              />
            </div>
            <div className="col s6">
              <Line
                data={dataForContestSmall2}
                options={{
                  title: {
                    display: true,
                    text: "問題2"
                  },
                  legend: {
                    display: true,
                    position: "bottom"
                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Line
                data={dataForContestSmall1}
                options={{
                  title: {
                    display: true,
                    text: "問題4"
                  },
                  legend: {
                    display: true,
                    position: "bottom"
                  }
                }}
              />
            </div>
            <div className="col s6">
              <Line
                data={dataForContestSmall3}
                options={{
                  title: {
                    display: true,
                    text: "問題3"
                  },
                  legend: {
                    display: true,
                    position: "bottom"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ExamResult);
