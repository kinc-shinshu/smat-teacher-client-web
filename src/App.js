import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Top } from "./screens/top";
import { ExamList } from "./screens/exam_list";
import { ExamCreator } from "./screens/exam_creator";
import { QuestionList } from "./screens/question_list";
import { QuestionCreator } from "./screens/question_creator";
import { QuestionEditor } from "./screens/question_editor";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Top} />
          <Route exact path="/exams" component={ExamList} />
          <Route exact path="/exams/new" component={ExamCreator} />
          <Route exact path="/exams/:id(\d+)" component={QuestionList} />
          <Route exact path="/exams/:id/new" component={QuestionCreator} />
          <Route
            exact
            path="/questions/:id(\d+)/edit"
            component={QuestionEditor}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
