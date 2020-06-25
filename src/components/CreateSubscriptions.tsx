import {
  Typography,
  Button,
  Divider,
  Radio,
  Input,
  Form,
  Row,
  Col,
  Modal,
} from "antd";
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
  VariableInfo,
} from "../data/dataProvider";

import { Period, FIELDS } from "../customTypes";
import ErrorBoundary from "./ErrorBoundary";

export interface ISubscribeProps {
  submitSubscriptions: (state: ISubscribeState) => Promise<void>;
}

export interface IOptionState<InfoType, IDType> {
  filtered: ValueType<SelectorOption<InfoType>>;
  selected: ValueType<SelectorOption<InfoType>>;
  selectedIds: IDType[];
}

export interface ISubscribeState {
  name: string;
  period: Period;
  activities: IOptionState<string, string>;
  experiments: IOptionState<ExperimentInfo, ExperimentInfo>;
  frequencies: IOptionState<string, string>;
  models: IOptionState<ModelInfo, ModelInfo>;
  realms: IOptionState<string, string>;
  variables: IOptionState<VariableInfo[], string>;
}

const errorRender: JSX.Element = (
  <p>
    <h3>An error occured with this form.</h3>
  </p>
);

const initialState: ISubscribeState = {
  name: "",
  period: "weekly",
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

  const notifyFreqOpts: { label: Period; value: Period }[] = [
    { label: "daily", value: "daily" },
    { label: "weekly", value: "weekly" },
    { label: "biweekly", value: "biweekly" },
    { label: "monthly", value: "monthly" },
  ];

  const submitClicked = (): void => {
    if (
      state.activities.selectedIds.length <= 0 &&
      state.experiments.selectedIds.length <= 0 &&
      state.frequencies.selectedIds.length <= 0 &&
      state.models.selectedIds.length <= 0 &&
      state.realms.selectedIds.length <= 0 &&
      state.variables.selectedIds.length <= 0
    ) {
      Modal.error({
        title: "Notice",
        centered: true,
        content: "Make a selection of at least one item, to submit your subscription."
      });
      return;
    }
    setState(initialState);
    props.submitSubscriptions(state);
  };

  const periodHandler = (event: RadioChangeEvent): void => {
    setState({ ...state, period: event.target.value });
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

  const nameHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let nameStr: string = event.target.value;
    nameStr = nameStr.replace(/[^1-9A-z_ ]|\^/gm, "");
    setState({ ...state, name: nameStr });
  };

  const stateSelector = (
    header: string,
    field: FIELDS,
    handler: (selection: ValueType<SelectorOption<any>>) => Promise<void>
  ): JSX.Element => (
    <Form.Item label={header} name="field">
      <Selector
        options={state[field].filtered}
        selectedOptions={state[field].selected}
        selectionHandler={handler}
      />
    </Form.Item>
  );

  return (
    <ErrorBoundary errorRender={errorRender}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="CreateSubscriptions"
      >
        <Divider orientation="center">
          <Typography.Title level={3}>Create New Subscription</Typography.Title>
        </Divider>
        <Row align="middle">
          <Col span={8} style={{ textAlign: "right", paddingRight: ".5em" }}>
            Name (Optional):
          </Col>
          <Col span={16}>
            <Input
              allowClear
              placeholder="Subscription name (OPTIONAL)"
              onChange={nameHandler}
              value={state.name}
            />
          </Col>
        </Row>

        <Form.Item
          label="Notification Interval"
          name="period"
          valuePropName={state.period}
        >
          <Radio.Group
            options={notifyFreqOpts}
            onChange={periodHandler}
            value={state.period}
          />
        </Form.Item>
        <Divider orientation="left">
          <Typography.Title level={4}>
            Subscribe to experiment(s)
          </Typography.Title>
        </Divider>
        {stateSelector(
          "Filter by Activity:",
          FIELDS.activities,
          activityHandler
        )}
        {state.experiments.filtered && // eslint-disable-line
          stateSelector(
            "Select Experiments:",
            FIELDS.experiments,
            experimentHandler
          )}
        <Divider orientation="left">
          <Typography.Title level={4}>
            Subscribe to variables(s)
          </Typography.Title>
        </Divider>
        {stateSelector(
          "Filter By Frequency:",
          FIELDS.frequencies,
          frequencyHandler
        )}
        {stateSelector("Filter By Model Realm:", FIELDS.realms, realmHandler)}
        {stateSelector(
          "Select Variable(s):",
          FIELDS.variables,
          variableHandler
        )}
        <Divider orientation="left">
          <Typography.Title level={4}>Subscribe to model(s)</Typography.Title>
        </Divider>
        {stateSelector("Select Model(s):", FIELDS.models, modelHandler)}
        <Form.Item wrapperCol={{ offset: 12 }}>
          <Button type="primary" htmlType="submit" onClick={submitClicked}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </ErrorBoundary>
  );
}
