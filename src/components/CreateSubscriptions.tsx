/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/camelcase */
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
  Tooltip,
} from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";
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
  activity_id: IOptionState<string, string>;
  experiment_id: IOptionState<ExperimentInfo, ExperimentInfo>;
  frequency: IOptionState<string, string>;
  source_id: IOptionState<ModelInfo, ModelInfo>;
  realm: IOptionState<string, string>;
  variable_id: IOptionState<VariableInfo[], string>;
}

const errorRender: JSX.Element = (
  <p>
    <h3>An error occured with this form.</h3>
  </p>
);

const initialState: ISubscribeState = {
  name: "",
  period: "weekly",
  activity_id: {
    filtered: getAll(FIELDS.activity_id),
    selected: null,
    selectedIds: [],
  },
  experiment_id: {
    filtered: getAll(FIELDS.experiment_id),
    selected: null,
    selectedIds: [],
  },
  frequency: {
    filtered: getAll(FIELDS.frequency),
    selected: null,
    selectedIds: [],
  },
  source_id: {
    filtered: getAll(FIELDS.source_id),
    selected: null,
    selectedIds: [],
  },
  realm: {
    filtered: getAll(FIELDS.realm),
    selected: null,
    selectedIds: [],
  },
  variable_id: {
    filtered: getAll(FIELDS.variable_id),
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
      state.activity_id.selectedIds.length <= 0 &&
      state.experiment_id.selectedIds.length <= 0 &&
      state.frequency.selectedIds.length <= 0 &&
      state.source_id.selectedIds.length <= 0 &&
      state.realm.selectedIds.length <= 0 &&
      state.variable_id.selectedIds.length <= 0
    ) {
      Modal.error({
        title: "Notice",
        centered: true,
        content:
          "Make a selection of at least one item, to submit your subscription.",
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
      getAll(FIELDS.experiment_id),
      [filterByActivity],
      newSelection
    );

    setState({
      ...state,
      activity_id: {
        ...state.activity_id,
        selected: activitySelection,
        selectedIds: newSelection,
      },
      experiment_id: {
        ...state.experiment_id,
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
      experiment_id: {
        ...state.experiment_id,
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
      getAll(FIELDS.variable_id),
      [filterByFrequency, filterByRealm],
      newSelection
    );
    setState({
      ...state,
      frequency: {
        ...state.frequency,
        selected: frequencySelection,
        selectedIds: newSelection,
      },
      variable_id: {
        ...state.variable_id,
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
      source_id: {
        ...state.source_id,
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
      getAll(FIELDS.variable_id),
      [filterByFrequency, filterByRealm],
      newSelection
    );
    setState({
      ...state,
      realm: {
        ...state.realm,
        selected: realmSelection,
        selectedIds: newSelection,
      },
      variable_id: {
        ...state.variable_id,
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
      variable_id: {
        ...state.variable_id,
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

  const selectorTitle = (title: string, tooltip: string): JSX.Element => {
    if (tooltip === "") {
      return <div>{title}</div>;
    }

    return (
      <div>
        <Tooltip placement="top" title={tooltip}>
          <QuestionCircleTwoTone
            translate=""
            style={{
              fontSize: "0.7em",
              margin: "5px",
              verticalAlign: "top",
            }}
          />
        </Tooltip>
        {title}
      </div>
    );
  };

  const stateSelector = (
    header: string,
    tooltip: string,
    field: FIELDS,
    handler: (selection: ValueType<SelectorOption<any>>) => Promise<void>
  ): JSX.Element => (
    <Form.Item label={selectorTitle(header, tooltip)} name="field">
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
            Subscription Name (Optional):
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
          "Filter by Activities",
          "You can narrow activity drop-down results by entering the name within the input field. \
          The activities selected will be used to filter the experiments drop-down below.",
          FIELDS.activity_id,
          activityHandler
        )}
        {state.experiment_id.filtered && // eslint-disable-line
          stateSelector(
            "Select Experiments",
            "You can narrow experiment drop-down results by typing in the input field. \
            Note: Experiments listed will be filtered by the activities selected above.",
            FIELDS.experiment_id,
            experimentHandler
          )}
        <Divider orientation="left">
          <Typography.Title level={4}>
            Subscribe to variables(s)
          </Typography.Title>
        </Divider>
        {stateSelector(
          "Filter By Frequency",
          "Use this field to narrow down the variable drop-down results by frequency.",
          FIELDS.frequency,
          frequencyHandler
        )}
        {stateSelector(
          "Filter By Model Realm",
          "Use this field to narrow down the variable drop-down results by model realm.",
          FIELDS.realm,
          realmHandler
        )}
        {stateSelector(
          "Select Variable(s)",
          "Select which variables you want to subscribe to. You can narrow results by using\
          the filters above, or by typing the specific variable name within this field.",
          FIELDS.variable_id,
          variableHandler
        )}
        <Divider orientation="left">
          <Typography.Title level={4}>Subscribe to model(s)</Typography.Title>
        </Divider>
        {stateSelector(
          "Select Model(s)",
          "You can narrow down model results by typing the name within the input field.",
          FIELDS.source_id,
          modelHandler
        )}
        <Form.Item wrapperCol={{ offset: 12 }}>
          <Button type="primary" htmlType="submit" onClick={submitClicked}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </ErrorBoundary>
  );
}
