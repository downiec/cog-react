/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import "antd/dist/antd.css";
import { Layout, Card, Tabs } from "antd";
import CreateSubscriptions, { ISubscribeState } from "./CreateSubscriptions";
import ViewSubscriptions from "./ViewSubscriptions";
import { Subscription, ExperimentInfo, ModelInfo, Panes } from "../modules/types";

export interface IAppProps {
  post_url: string; // eslint-disable-line
  saved_subs: Subscription[];
}

export interface IAppState {
  currentSubs: Subscription[];
  activeTab: Panes;
}

export default function App(props: IAppProps): JSX.Element {
  const initialState: IAppState = {
    currentSubs: props.saved_subs || [],
    activeTab: Panes.AddSubs,
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

  // The following function are copying from
  // https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
  const getCookie = (name: string): string | null => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const generateRequest = (
    formData: { [key: string]: any },
    action: string
  ): Request => {
    // Add action designation to data
    const reqData: { [key: string]: any } = {};
    reqData.action = action;
    reqData.payload = formData;

    // Get required csrf token for posting request.
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
      return sub.id;
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
    const experimentIds: string[] = subState.experiment_id.selectedIds.map(
      (exp: ExperimentInfo): string => {
        return exp.experiment_id;
      }
    );

    // Get model IDs
    const modelIds: string[] = subState.source_id.selectedIds.map(
      (model: ModelInfo) => {
        return model.source_id;
      }
    );

    // Create subscription object to pass to backend
    const time: number = Date.now();
    const newSub: Record<string,unknown> = {
      timestamp: time,
      period: subState.period,
      name: subState.name,
      activity_id: subState.activity_id.selectedIds,
      experiment_id: experimentIds,
      frequency: subState.frequency.selectedIds,
      source_id: modelIds,
      realm: subState.realm.selectedIds,
      variable_id: subState.variable_id.selectedIds,
    };

    // Generate the request using data object
    const request: Request = generateRequest(newSub, "subscribe");

    // Send request and await for response
    const response = await sendRequest(request);

    // Exit if response is undefined
    if(response===undefined){
      return;
    }

    // Update current subscription state, using response id
    const data: Subscription[] = state.currentSubs;

    // Save in front-end state
    data.push({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      id: response.id,
      timestamp: time,
      period: subState.period,
      name: subState.name,
      activity_id: subState.activity_id.selectedIds,
      experiment_id: experimentIds,
      frequency: subState.frequency.selectedIds,
      source_id: modelIds,
      realm: subState.realm.selectedIds,
      variable_id: subState.variable_id.selectedIds,
    });

    // Update current cubscriptions state
    setState({ ...state, currentSubs: data });
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
