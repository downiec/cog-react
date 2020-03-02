import react from "react";
import reactDom from "react-dom";
import App, { IAppProps } from "./App";

const testProps1: IAppProps = {
  dataJSON: "{}"
};

const testProps2: IAppProps = {
  dataJSON: ""
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App {...testProps1} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App {...testProps2} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
