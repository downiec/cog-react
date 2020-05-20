import react from "react";
import reactDom from "react-dom";
import App, { IAppProps } from "./App";

const testProps: IAppProps = {
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
  }
};

it("renders without crashing", () => {
  // Renders the react app in a dev server apart from COG and Django
  const div = document.createElement("div");
  reactDom.render(react.createElement(App, testProps), div);
});
