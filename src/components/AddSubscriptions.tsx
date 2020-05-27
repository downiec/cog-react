import { Layout, Row, Col, Typography, Button, Divider } from "antd";
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
  VariableGroup,
} from "../data/dataProvider";

import { DATA } from "../constants";

export interface ISubscribeProps {
  submitSelections: (state: ISubscribeState) => Promise<void>;
}

export interface IOptionState<InfoType, IDType> {
  filtered: ValueType<SelectorOption<InfoType>>;
  selected: ValueType<SelectorOption<InfoType>>;
  selectedIds: IDType[];
}

export interface ISubscribeState {
  [type: string]: IOptionState<any, any>;
  activities: IOptionState<string, string>;
  experiments: IOptionState<ExperimentInfo, ExperimentInfo>;
  frequencies: IOptionState<string, string>;
  models: IOptionState<ModelInfo, ModelInfo>;
  realms: IOptionState<string, string>;
  variables: IOptionState<VariableGroup, string>;
}

enum FIELDS {
  activities = "activities",
  experiments = "experiments",
  frequencies = "frequencies",
  models = "models",
  realms = "realms",
  variables = "variables",
}

const initialState: ISubscribeState = {
  activities: {
    filtered: getAll(DATA.ACTIVITIES),
    selected: null,
    selectedIds: [],
  },
  experiments: {
    filtered: getAll(DATA.EXPERIMENTS),
    selected: null,
    selectedIds: [],
  },
  frequencies: {
    filtered: getAll(DATA.FREQUENCIES),
    selected: null,
    selectedIds: [],
  },
  models: {
    filtered: getAll(DATA.MODELS),
    selected: null,
    selectedIds: [],
  },
  realms: {
    filtered: getAll(DATA.REALMS),
    selected: null,
    selectedIds: [],
  },
  variables: {
    filtered: getAll(DATA.VARIABLES),
    selected: null,
    selectedIds: [],
  },
};

export default function CreateSubscriptions(
  props: ISubscribeProps
): JSX.Element {
  const [state, setState] = useState<ISubscribeState>(initialState);

  const submitClicked = (): void => {
    setState(initialState);
    props.submitSelections(state);
  };

  const activityHandler = async (
    activitySelection: ValueType<SelectorOption<string>>
  ): Promise<void> => {
    const newSelection: string[] = getOptionListValues(activitySelection);
    const filteredExperiments = applyFilters<ExperimentInfo>(
      getAll(DATA.EXPERIMENTS),
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
    const filteredVariables = applyFilters<VariableGroup>(
      getAll(DATA.VARIABLES),
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
    const filteredVariables = applyFilters<VariableGroup>(
      getAll(DATA.VARIABLES),
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
    <Row align="stretch">
      <Col flex="300px">
        <Divider orientation="right">
          <Title level={4}>{header}</Title>
        </Divider>
      </Col>
      <Col
        flex="auto"
        style={{ paddingLeft: "30px", paddingRight: "30px", minWidth: "300px" }}
      >
        <Selector
          options={state[field].filtered}
          selectedOptions={state[field].selected}
          selectionHandler={handler}
        />
      </Col>
    </Row>
  );

  const { Title } = Typography;

  return (
    <Layout>
      <Divider>
        <Title level={2}>Select Subscriptions</Title>
      </Divider>
      <Row>
        <Divider orientation="left">
          <Title level={3}>Subscribe to experiment(s)</Title>
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
          <Title level={3}>Subscribe to variables(s)</Title>
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
          <Title level={3}>Subscribe to model(s)</Title>
        </Divider>
      </Row>
      {stateSelector("Select Model(s):", FIELDS.models, modelHandler)}
      <Row align="middle">
        <Divider orientation="center">
          <Button onClick={submitClicked}>Submit</Button>
        </Divider>
      </Row>
    </Layout>
  );
}
