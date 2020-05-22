import React, { useState } from "react";
import "antd/dist/antd.css";
import { Menu, Layout } from "antd";
import CreateSubscriptions, { ISubscribeState } from "./AddSubscriptions";
import ViewSubscriptions from "./ViewSubscriptions";
import { ExperimentInfo, ModelInfo } from "../data/dataProvider";
import { getCookie } from "../utilities/mainUtils";

export interface IAppProps {
  post_url: string; // eslint-disable-line
}

export interface IAppState {
  submitSubscriptions: boolean;
}

const initialState: IAppState = { submitSubscriptions: true };

export default function App(props: IAppProps): JSX.Element {
  const [state, setState] = useState<IAppState>(initialState);
  const { Content } = Layout;

  const sendRequest = async (request: Request): Promise<any> => {
    // Perform fetch to send data
    try {
      const response: Response = await fetch(request);
      if (response.status >= 200 && response.status < 300) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
      console.error(`Something went wrong with request to API server! \n\
  Status: ${response.status}. Response Text: ${response.statusText}`);
      window.alert("Form submission failed.");
      return { Error: response.statusText };
    } catch (error) {
      console.error(error);
    }
  };

  const generateRequest = (subState: ISubscribeState): Request => {
    const data: any = {};
    data.activity_ids = subState.activities.selectedIds; // eslint-disable-line
    // eslint-disable-next-line
    data.experiment_ids = subState.experiments.selectedIds.map(
      (experiment: ExperimentInfo) => experiment.experiment_id
    );
    data.frequencies = subState.frequencies.selectedIds;
    data.realms = subState.realms.selectedIds;
    data.variables = subState.variables.selectedIds;
    data.models = subState.models.selectedIds.map(
      (model: ModelInfo) => model.source_id
    );

    console.log(data);

    // Get required csrf toekn for posting request.
    const csrftoken = getCookie("csrftoken");

    // eslint-disable-next-line
    const { post_url } = props;
    const request: Request = new Request(post_url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "X-CSRFToken": csrftoken || "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return request;
  };

  const submitSelections = async (subState: ISubscribeState): Promise<void> => {
    // Generate the request with form data
    const request: Request = generateRequest(subState);
    // Send request and await for response
    const success = await sendRequest(request);
    console.log(success);
  };

  const addSubscriptions = (): void => {
    setState({ submitSubscriptions: true });
  };

  const viewSubscriptions = (): void => {
    setState({ submitSubscriptions: false });
  };

  return (
    <Layout>
      <Content>
        <Menu mode="horizontal">
          <Menu.Item onClick={addSubscriptions}>Add Subscription</Menu.Item>
          <Menu.Item onClick={viewSubscriptions}>View Subscriptions</Menu.Item>
        </Menu>
        {state.submitSubscriptions ? (
          <CreateSubscriptions submitSelections={submitSelections} />
        ) : (
          <ViewSubscriptions submitSelections={submitSelections} />
        )}
      </Content>
    </Layout>
  );
}
