/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from "react";
import "antd/dist/antd.css";
import { Layout, Card, Tabs } from "antd";
import CreateSubscriptions, { ISubscribeState } from "./CreateSubscriptions";
import ViewSubscriptions from "./ViewSubscriptions";
import { ExperimentInfo, ModelInfo } from "../data/dataProvider";
import { getCookie } from "../utilities/mainUtils";
import { Subscription } from "../customTypes";

enum Panes {
  "AddSubs" = "1",
  "ViewSubs" = "2",
}
export interface IAppProps {
  post_url: string; // eslint-disable-line
  saved_subs: Subscription[];
}

export interface IAppState {
  currentSubs: Subscription[];
  activeTab: Panes;
}

export default function App(props: IAppProps): JSX.Element {

  if(props.saved_subs){
    const initSubs: Subscription[] = props.saved_subs.map((sub: any)=>{
      if(sub.id >= 0){
        sub["timestamp"] = sub.id;
      }
      return sub as Subscription;
    });

    console.log(initSubs);
  }

  const initialState: IAppState = {
    currentSubs: props.saved_subs || [],
    activeTab: Panes.AddSubs,
  };

  const [state, setState] = useState<IAppState>(initialState);
  const { Content } = Layout;

  console.log("Subs from DB:");
  console.log(props.saved_subs);
  console.log("Current Subs:");
  console.log(state.currentSubs);

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

  const generateRequest = (
    formData: { [key: string]: any },
    action: string
  ): Request => {
    // Add action designation to data
    const reqData: { [key: string]: any } = {};
    reqData.action = action;
    reqData.payload = formData;

    console.log(reqData);
    // Get required csrf toekn for posting request.
    const csrftoken = getCookie("csrftoken");

    // eslint-disable-next-line
    const { post_url } = props;
    const request: Request = new Request(post_url, {
      method: "POST",
      body: JSON.stringify(reqData),
      headers: {
        "X-CSRFToken": csrftoken || "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return request;
  };

  const deleteSubscriptions = async (
    subsToDelete: Subscription[]
  ): Promise<void> => {
    if (!state.currentSubs) {
      return; // No subscriptions to delete
    }

    const newSubs: Subscription[] = state.currentSubs.filter(
      (sub: Subscription) => {
        return !subsToDelete.includes(sub);
      }
    );
    // Update state
    setState({ ...state, currentSubs: newSubs });

    // Generate data for request
    const data = subsToDelete.map((sub: Subscription) => {
      return [sub.id, sub.timestamp];
    });

    // Generate the request using data object
    const request: Request = generateRequest(data, "unsubscribe");
    // Send request and await for response
    await sendRequest(request);
  };

  const setActivePane = (pane: Panes): void => {
    setState({ ...state, activeTab: pane });
  };

  const submitSubscriptions = async (
    subState: ISubscribeState
  ): Promise<void> => {
    // Get experiment IDs
    const experimentIds: string[] = subState.experiments.selectedIds.map(
      (exp: ExperimentInfo): string => {
        return exp.experiment_id;
      }
    );

    // Get model IDs
    const modelIds: string[] = subState.models.selectedIds.map(
      (model: ModelInfo) => {
        return model.source_id;
      }
    );

    // Create subscription object to pass to backend
    const time: number = Date.now();
    const newSub: {} = {
      timestamp: time,
      period: subState.period,
      name: subState.name,
      activity_id: subState.activities.selectedIds,
      experiment_id: experimentIds,
      frequency: subState.frequencies.selectedIds,
      source_id: modelIds,
      realm: subState.realms.selectedIds,
      variable_id: subState.variables.selectedIds,
    };

    const data: Subscription[] = state.currentSubs;

    // Save in front-end state
    data.push({
      id: -1,
      timestamp: time,
      period: subState.period,
      name: subState.name,
      activities: subState.activities.selectedIds,
      experiments: experimentIds,
      frequencies: subState.frequencies.selectedIds,
      models: modelIds,
      realms: subState.realms.selectedIds,
      variables: subState.variables.selectedIds,
    });

    // Update current cubscriptions state
    setState({ ...state, currentSubs: data });

    // Generate the request using data object
    const request: Request = generateRequest(newSub, "subscribe");
    // Send request and await for response
    await sendRequest(request);

    setActivePane(Panes.ViewSubs);
  };

  return (
    <Layout>
      <Content>
        <Card>
          <Tabs
            activeKey={state.activeTab}
            defaultActiveKey="addSub"
            type="card"
            size="large"
            onTabClick={(key: string): void => {
              setState({ ...state, activeTab: key as Panes });
            }}
          >
            <Tabs.TabPane tab="Add Subscription" key={Panes.AddSubs}>
              <CreateSubscriptions submitSubscriptions={submitSubscriptions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="View Subscriptions" key={Panes.ViewSubs}>
              <ViewSubscriptions
                deleteSubscriptions={deleteSubscriptions}
                currentSubs={state.currentSubs}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}
