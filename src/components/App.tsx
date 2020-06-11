import React, { useState } from "react";
import "antd/dist/antd.css";
import { Menu, Layout } from "antd";
import { ValueType } from "react-select";
import CreateSubscriptions, { ISubscribeState } from "./CreateSubscriptions";
import ViewSubscriptions, { ICurrentSubsState } from "./ViewSubscriptions";
import {
  ExperimentInfo,
  ModelInfo,
  isExperiment,
  isVariable,
  VariableInfo,
  isModel,
  SelectorOption,
  getOptionListData,
} from "../data/dataProvider";
import { getCookie } from "../utilities/mainUtils";
import { Subscription, Freq, FIELDS } from "../customTypes";

export interface IAppProps {
  post_url: string; // eslint-disable-line
  loadedSubs: { [name: string]: Subscription };
}

export interface IAppState {
  submitSubscriptions: boolean;
  currentSubs: { [name: string]: Subscription };
}

export default function App(props: IAppProps): JSX.Element {
  const initialState: IAppState = {
    submitSubscriptions: true,
    currentSubs: props.loadedSubs,
  };

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
      // window.alert("Form submission failed.");
      return { Error: response.statusText };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  function getSubscriptions(
    options: ValueType<SelectorOption<any>>,
    frequency: Freq
  ): Subscription[] {
    const subs: Subscription[] = [];
    if (!options) {
      return subs;
    }
    const dataList = getOptionListData(options);
    console.log(dataList);
    if (isExperiment(dataList[0])) {
      const experiments = dataList;
      experiments.forEach((opt: ExperimentInfo) => {
        subs.push({
          name: opt.experiment_id,
          type: FIELDS.experiments,
          frequency,
          data: opt,
        });
      });
    }
    if (isVariable(dataList[0][0])) {
      const variables = dataList.map((elem: VariableInfo[]) => {
        return elem[0];
      });
      variables.forEach((opt: VariableInfo, idx: number) => {
        subs.push({
          name: opt.out_name,
          type: FIELDS.variables,
          frequency,
          data: dataList[idx],
        });
      });
    }
    if (isModel(dataList[0])) {
      const models = dataList;
      models.forEach((opt: ModelInfo) => {
        subs.push({
          name: opt.source_id,
          type: FIELDS.models,
          frequency,
          data: opt,
        });
      });
    }

    return subs;
  }

  const generateRequest = (formData: {}): Request => {
    // Get required csrf toekn for posting request.
    const csrftoken = getCookie("csrftoken");

    // eslint-disable-next-line
    const { post_url } = props;
    const request: Request = new Request(post_url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "X-CSRFToken": csrftoken || "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return request;
  };

  const updateSubscriptions = async (
    newSubs: ICurrentSubsState
  ): Promise<void> => {
    console.log("Success!");
  };

  const submitSubscriptions = async (
    subState: ISubscribeState
  ): Promise<void> => {

    // Generate data object from form state
    const data: { [name: string]: Subscription } = state.currentSubs;

    getSubscriptions(
      subState.experiments.selected,
      subState.notificationFreq
    ).forEach((sub: Subscription) => {
      data[`${sub.type}_${sub.name}`] = sub;
    });

    getSubscriptions(
      subState.variables.selected,
      subState.notificationFreq
    ).forEach((sub: Subscription) => {
      data[`${sub.type}_${sub.name}`] = sub;
    });

    getSubscriptions(
      subState.models.selected,
      subState.notificationFreq
    ).forEach((sub: Subscription) => {
      data[`${sub.type}_${sub.name}`] = sub;
    });

    console.log(data);

    // Update current cubscriptions state
    setState({ ...state, currentSubs: data });

    // Generate the request using data object
    const request: Request = generateRequest(data);
    // Send request and await for response
    const success = await sendRequest(request);
    console.log(success);
  };

  const addSubscriptions = (): void => {
    setState({ ...state, submitSubscriptions: true });
  };

  const viewSubscriptions = (): void => {
    setState({ ...state, submitSubscriptions: false });
  };

  return (
    <Layout>
      <Content>
        <Menu mode="horizontal">
          <Menu.Item onClick={addSubscriptions}>Add Subscription</Menu.Item>
          <Menu.Item onClick={viewSubscriptions}>View Subscriptions</Menu.Item>
        </Menu>
        {state.submitSubscriptions ? (
          <CreateSubscriptions submitSubscriptions={submitSubscriptions} />
        ) : (
          <ViewSubscriptions
            updateSubscriptions={updateSubscriptions}
            currentSubs={state.currentSubs}
          />
        )}
      </Content>
    </Layout>
  );
}
