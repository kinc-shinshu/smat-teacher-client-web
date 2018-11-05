import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Top } from "./screens/Top";
import { Edit } from "./screens/Edit";
import { Done } from "./screens/Done";
import { List } from "./screens/List";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Top} />
          <Route exact path="/exams/:id/edit" component={Edit} />
          <Route exact path="/exams/new" component={Edit} />
          <Route exact path="/exams" component={List} />
          <Route exact path="/done" component={Done} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
