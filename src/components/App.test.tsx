import react from "react";
import reactDom from "react-dom";
import App, { IAppProps } from "./App";

const testProps: IAppProps = {
  post_url: "",
  saved_subs: []
};

it("renders without crashing", () => {
  // Renders the react app in a dev server apart from COG and Django
  const div = document.createElement("div");
  reactDom.render(react.createElement(App, testProps), div);
});
