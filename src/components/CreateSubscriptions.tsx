import { Layout, Row, Col, Typography, Button, Divider, Radio } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import React, { useState } from "react";
import { ValueType } from "react-select/src/types";
import { Selector } from "./Selector";
import {
  applyFilters,
  ExperimentInfo,
  filterByActivity,
  filterByFrequency,
  filterByRealm,
  getAll,
  getOptionListData,
  getOptionListValues,
  ModelInfo,
  SelectorOption,
  VariableInfo
} from "../data/dataProvider";

import { Freq, FIELDS } from "../customTypes";

export interface ISubscribeProps {
  submitSubscriptions: (state: ISubscribeState) => Promise<void>;
}

export interface IOptionState<InfoType, IDType> {
  filtered: ValueType<SelectorOption<InfoType>>;
  selected: ValueType<SelectorOption<InfoType>>;
  selectedIds: IDType[];
}

export interface ISubscribeState {
  notificationFreq: Freq;
  activities: IOptionState<string, string>;
  experiments: IOptionState<ExperimentInfo, ExperimentInfo>;
  frequencies: IOptionState<string, string>;
  models: IOptionState<ModelInfo, ModelInfo>;
  realms: IOptionState<string, string>;
  variables: IOptionState<VariableInfo[], string>;
}

const initialState: ISubscribeState = {
  notificationFreq: "weekly",
  activities: {
    filtered: getAll(FIELDS.activities),
    selected: null,
    selectedIds: [],
  },
  experiments: {
    filtered: getAll(FIELDS.experiments),
    selected: null,
    selectedIds: [],
  },
  frequencies: {
    filtered: getAll(FIELDS.frequencies),
    selected: null,
    selectedIds: [],
  },
  models: {
    filtered: getAll(FIELDS.models),
    selected: null,
    selectedIds: [],
  },
  realms: {
    filtered: getAll(FIELDS.realms),
    selected: null,
    selectedIds: [],
  },
  variables: {
    filtered: getAll(FIELDS.variables),
    selected: null,
    selectedIds: [],
  },
};

export default function CreateSubscriptions(
  props: ISubscribeProps
): JSX.Element {
  const [state, setState] = useState<ISubscribeState>(initialState);

  const notifyFreqOpts: { label: Freq; value: Freq }[] = [
    { label: "daily", value: "daily" },
    { label: "weekly", value: "weekly" },
    { label: "biweekly", value: "biweekly" },
    { label: "monthly", value: "monthly" }
  ];

  const submitClicked = (): void => {
    setState(initialState);
    props.submitSubscriptions(state);
  };

  const notifyFreqHandler = (event: RadioChangeEvent): void => {
    setState({ ...state, notificationFreq: event.target.value });
  };

  const activityHandler = async (
    activitySelection: ValueType<SelectorOption<string>>
  ): Promise<void> => {
    const newSelection: string[] = getOptionListValues(activitySelection);
    const filteredExperiments = applyFilters<ExperimentInfo>(
      getAll(FIELDS.experiments),
      [filterByActivity],
      newSelection
    );

    setState({
      ...state,
      activities: {
        ...state.activities,
        selected: activitySelection,
        selectedIds: newSelection,
      },
      experiments: {
        ...state.experiments,
        filtered: filteredExperiments,
      },
    });
  };

  const experimentHandler = async (
    experimentSelection: ValueType<SelectorOption<any>>
  ): Promise<void> => {
    const newSelection: ExperimentInfo[] = getOptionListData(
      experimentSelection
    );
    setState({
      ...state,
      experiments: {
        ...state.experiments,
        selected: experimentSelection,
        selectedIds: newSelection,
      },
    });
  };

  const frequencyHandler = async (
    frequencySelection: ValueType<SelectorOption<any>>
  ): Promise<void> => {
    const newSelection: string[] = getOptionListValues(frequencySelection);
    const filteredVariables = applyFilters<VariableInfo[]>(
      getAll(FIELDS.variables),
      [filterByFrequency, filterByRealm],
      newSelection
    );
    setState({
      ...state,
      frequencies: {
        ...state.frequencies,
        selected: frequencySelection,
        selectedIds: newSelection,
      },
      variables: {
        ...state.variables,
        filtered: filteredVariables,
      },
    });
  };

  const modelHandler = async (
    modelSelection: ValueType<SelectorOption<any>>
  ): Promise<void> => {
    const newSelection: ModelInfo[] = getOptionListData(modelSelection);
    setState({
      ...state,
      models: {
        ...state.models,
        selected: modelSelection,
        selectedIds: newSelection,
      },
    });
  };

  const realmHandler = async (
    realmSelection: ValueType<SelectorOption<any>>
  ): Promise<void> => {
    const newSelection: string[] = getOptionListValues(realmSelection);
    const filteredVariables = applyFilters<VariableInfo[]>(
      getAll(FIELDS.variables),
      [filterByFrequency, filterByRealm],
      newSelection
    );
    setState({
      ...state,
      realms: {
        ...state.realms,
        selected: realmSelection,
        selectedIds: newSelection,
      },
      variables: {
        ...state.variables,
        filtered: filteredVariables,
      },
    });
  };

  const variableHandler = async (
    variableSelection: ValueType<SelectorOption<any>>
  ): Promise<void> => {
    const newSelection: string[] = getOptionListValues(variableSelection);
    setState({
      ...state,
      variables: {
        ...state.variables,
        selected: variableSelection,
        selectedIds: newSelection,
      },
    });
  };

  const stateSelector = (
    header: string,
    field: FIELDS,
    handler: (selection: ValueType<SelectorOption<any>>) => Promise<void>
  ): JSX.Element => (
    <Row align="middle" style={{ margin: "5px" }}>
      <Col flex="250px">
        <h6 style={{ textAlign: "right", margin: 0 }}>{header}</h6>
      </Col>
      <Col
        flex="auto"
        style={{
          paddingLeft: "15px",
          paddingRight: "15px",
          minWidth: "300px",
        }}
      >
        <Selector
          options={state[field].filtered}
          selectedOptions={state[field].selected}
          selectionHandler={handler}
        />
      </Col>
    </Row>
  );

  return (
    <Layout>
      <Divider>
        <Typography.Title level={2}>Select Subscriptions</Typography.Title>
      </Divider>
      <Row>
        <Divider orientation="left">
          <Typography.Title level={3}>
            Subscribe to experiment(s)
          </Typography.Title>
        </Divider>
      </Row>
      {stateSelector("Filter by Activity:", FIELDS.activities, activityHandler)}
      {state.experiments.filtered && // eslint-disable-line
        stateSelector(
          "Select Experiments:",
          FIELDS.experiments,
          experimentHandler
        )}
      <Row>
        <Divider orientation="left">
          <Typography.Title level={3}>
            Subscribe to variables(s)
          </Typography.Title>
        </Divider>
      </Row>
      {stateSelector(
        "Filter By Frequency:",
        FIELDS.frequencies,
        frequencyHandler
      )}
      {stateSelector("Filter By Model Realm:", FIELDS.realms, realmHandler)}
      {stateSelector("Select Variable(s):", FIELDS.variables, variableHandler)}
      <Row>
        <Divider orientation="left">
          <Typography.Title level={3}>Subscribe to model(s)</Typography.Title>
        </Divider>
      </Row>
      {stateSelector("Select Model(s):", FIELDS.models, modelHandler)}
      <Row align="middle">
        <Col flex="250px">
          <Divider orientation="left">
            <Typography.Title level={3}>
              Notification Frequency:
            </Typography.Title>
          </Divider>
        </Col>
        <Col
          flex="auto"
          style={{
            paddingLeft: "15px",
            paddingRight: "15px",
            minWidth: "300px",
          }}
        >
          <Radio.Group
            options={notifyFreqOpts}
            onChange={notifyFreqHandler}
            value={state.notificationFreq}
          />
        </Col>
      </Row>
      <Row align="middle">
        <Divider orientation="center">
          <Button onClick={submitClicked}>Submit</Button>
        </Divider>
      </Row>
    </Layout>
  );
}
