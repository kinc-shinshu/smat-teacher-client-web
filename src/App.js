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
          <Route path="/edit" component={Edit} />
          <Route path="/done" component={Done} />
          <Route path="/list" component={List} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
