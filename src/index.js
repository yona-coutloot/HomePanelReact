import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {BrowserRouter as Router} from 'react-router-dom'
import App from "./App";
import "antd/dist/antd.css";
import HomePanelStore from "./redux/HomePanelStore";

ReactDOM.render(
  <Provider store={HomePanelStore}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
