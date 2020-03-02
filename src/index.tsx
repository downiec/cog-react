import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

declare global {
  interface Window {
    react_mount: any;
    props: any;
  }
}

try {
  // Renders react app in the COG Django server
  ReactDOM.render(
    React.createElement(App, {}), // gets the props that are passed in the template
    window.react_mount // a reference to the #react div that we render to
  );
} catch (error) {
  // Renders the react app in a dev server apart from COG and Django
  ReactDOM.render(
    React.createElement(App, {}),
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
