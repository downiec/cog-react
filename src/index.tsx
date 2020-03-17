import react from "react";
import reactDom from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

declare global {
  interface Window {
    react_mount: any;
    token: string;
    props: {
      token: string;
      post_url: string;
      user_info: any;
      activities: any;
      experiments: any;
    };
  }
}

try {
  const regex = /value='(.+)'/gm;
  let m;
  if ((m = regex.exec(window.token)) !== null) {
    window.props.token = m[1];
  }
  const element: any = react.createElement(App, window.props);

  // Renders react app in the COG Django server
  reactDom.render(
    element, // gets the props that are passed in the template
    window.react_mount // a reference to the #react div that we render to
  );
} catch (error) {
  const props: any = {
    post_url: "",
    user_info: {
      first: "John",
      last: "Doe",
      hobbies: "Programming.",
      send_emails_to: "This place."
    },
    activities: { method: ["email"], weekly: ["CMIP"], monthly: ["CMIP6"] },
    experiments: {
      method: ["popup"],
      daily: ["test", "experiment 2"],
      weekly: ["test2"]
    },
    token: "YgknaKrZGkWHrSI7CdsKOI6uTnWaGbPv79MULJtn3TZZxvzvJRbmCwqy65jknma4"
  };

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
