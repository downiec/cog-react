import react from "react";
import reactDom from "react-dom";
import "./index.css";
import App, { IAppProps } from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { defaultSubscriptions } from "./constants";

declare global {
  interface Window {
    react_mount: any; // eslint-disable-line
    token: string;
    props: {
      token: string;
      post_url: string; // eslint-disable-line
      saved_subs: [];
    };
  }
}

try {
  const regex = /value='(.+)'/gm;
  let m;
  // eslint-disable-next-line
  if ((m = regex.exec(window.token)) !== null) {
    // eslint-disable-next-line prefer-destructuring
    window.props.token = m[1]; // Get the token
  }

  const element: any = react.createElement(App, window.props);

  // Renders react app in the COG Django server
  reactDom.render(
    element, // gets the props that are passed in the template
    window.react_mount // a reference to the #react div that we render to
  );
} catch (error) {
  const props: IAppProps = { post_url: "", saved_subs: defaultSubscriptions }; // eslint-disable-line

  // Renders the react app in a dev server apart from COG and Django
  reactDom.render(
    react.createElement(App, props),
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
