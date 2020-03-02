import * as React from "react";
import bindDecorator from "bind-decorator";
import { Col, Container, Label, Row } from "reactstrap";
import { ValueType } from "react-select/src/types";
import Selector from "./Selector";
import {
  SelectorOption,
  createOptionList,
  ExperimentInfo,
  ModelInfo,
  applyFilters,
  filterByActivity,
  getOptionListValues,
  filterByFrequency,
  VariableGroup,
  filterByRealm
} from "../data/dataProvider";

import {
  activityData,
  experimentData,
  frequencyData,
  realmData,
  modelData
} from "../data/output/appdata";
import {
  colorByActivity,
  colorByName,
  colorShadesBlue,
  colorShadesGreen
} from "../data/dataRenderer";
import { variableData } from "../data/output/variableData";

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.5rem"
};

export interface IAppProps {
  //activityList: { [id: string]: string };
  //experimentList: { [id: string]: ExperimentInfo };
}

export interface IAppState {
  activities: ValueType<SelectorOption<string>>;
  experiments: ValueType<SelectorOption<ExperimentInfo>>;
  frequencies: ValueType<SelectorOption<string>>;
  realms: ValueType<SelectorOption<string>>;
  variables: ValueType<SelectorOption<VariableGroup>>;
  models: ValueType<SelectorOption<ModelInfo>>;
  selectedActivities: string[];
  SelectedExperiments: ExperimentInfo[];
  selectedFrequencies: string[];
  selectedRealms: string[];
  selectedVariables: string[];
  selectedModels: ModelInfo[];
}

export default class App extends React.Component<IAppProps, IAppState> {
  allActivities = createOptionList(activityData, colorByName);
  allExperiments = createOptionList<ExperimentInfo>(
    experimentData,
    colorByActivity
  );
  allFrequencies = createOptionList(frequencyData, colorShadesBlue);
  allRealms = createOptionList(realmData, colorShadesGreen);
  allVariables = createOptionList<VariableGroup>(variableData, colorByName);
  allModels = createOptionList<ModelInfo>(modelData, colorByName);

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      activities: this.allActivities,
      experiments: this.allExperiments,
      frequencies: this.allFrequencies,
      realms: this.allRealms,
      variables: this.allVariables,
      models: this.allModels,
      selectedActivities: [],
      SelectedExperiments: [],
      selectedFrequencies: [],
      selectedRealms: [],
      selectedVariables: [],
      selectedModels: []
    };
  }

  @bindDecorator
  public activityHandler(
    activitySelection: ValueType<SelectorOption<string>>
  ): void {
    let newSelection: string[] = getOptionListValues(activitySelection);
    const filteredExperiments = applyFilters<ExperimentInfo>(
      this.allExperiments,
      [filterByActivity],
      newSelection
    );
    this.setState({
      selectedActivities: newSelection,
      experiments: filteredExperiments
    });
  }

  @bindDecorator
  public experimentHandler(
    experimentSelection: ValueType<SelectorOption<any>>
  ): void {}

  @bindDecorator
  public frequencyHandler(
    frequencySelection: ValueType<SelectorOption<any>>
  ): void {
    let newSelection: string[] = getOptionListValues(frequencySelection);
    const filteredVariables = applyFilters<VariableGroup>(
      this.allVariables,
      [filterByFrequency, filterByRealm],
      newSelection
    );
    this.setState({
      selectedFrequencies: newSelection,
      variables: filteredVariables
    });
  }

  @bindDecorator
  public realmHandler(
    frequencySelection: ValueType<SelectorOption<any>>
  ): void {
    let newSelection: string[] = getOptionListValues(frequencySelection);
    const filteredVariables = applyFilters<VariableGroup>(
      this.allVariables,
      [filterByFrequency, filterByRealm],
      newSelection
    );
    this.setState({
      selectedFrequencies: newSelection,
      variables: filteredVariables
    });
  }

  @bindDecorator
  public variableHandler(
    frequencySelection: ValueType<SelectorOption<any>>
  ): void {}

  @bindDecorator
  public modelHandler(
    modelSelection: ValueType<SelectorOption<any>>
  ): void {}

  public render(): JSX.Element {
    return (
      <Container id="main-app">
        <h1>Subscription Page</h1>
        <Row>
          <h2>Subscribe to experiment(s):</h2>
        </Row>
        <br />
        <Row>
          <Col style={{ textAlign: "right", padding: 0 }} xs="3">
            <Label style={labelStyle} className="mr-sm-2">
              List by Activity:
            </Label>
          </Col>
          <Col style={{ textAlign: "left", padding: 0 }} xs="9">
            <Selector
              options={this.state.activities}
              selectionHandler={this.activityHandler}
            />
          </Col>
        </Row>
        {this.state.experiments && (
          <Row>
            <Col style={{ textAlign: "right", padding: 0 }} xs="3">
              <Label style={labelStyle} className="mr-sm-2">
                Select Experiment(s):
              </Label>
            </Col>
            <Col style={{ textAlign: "left", padding: 0 }} xs="9">
              <Selector
                options={this.state.experiments}
                selectionHandler={this.experimentHandler}
              />
            </Col>
          </Row>
        )}
        <Row>
          <h2>Subscribe to variable(s):</h2>
        </Row>
        <br />
        <Row>
          <Col style={{ textAlign: "right", padding: 0 }} xs="3">
            <Label style={labelStyle} className="mr-sm-2">
              List By Frequency:
            </Label>
          </Col>
          <Col style={{ textAlign: "left", padding: 0 }} xs="9">
            <Selector
              options={this.state.frequencies}
              selectionHandler={this.frequencyHandler}
            />
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "right", padding: 0 }} xs="3">
            <Label style={labelStyle} className="mr-sm-2">
              List By Model Realm:
            </Label>
          </Col>
          <Col style={{ textAlign: "left", padding: 0 }} xs="9">
            <Selector
              options={this.state.realms}
              selectionHandler={this.realmHandler}
            />
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "right", padding: 0 }} xs="3">
            <Label style={labelStyle} className="mr-sm-2">
              Select Variable(s):
            </Label>
          </Col>
          <Col style={{ textAlign: "left", padding: 0 }} xs="9">
            <Selector
              options={this.state.variables}
              selectionHandler={this.variableHandler}
            />
          </Col>
        </Row>
        <Row>
          <h2>Subscribe to model(s):</h2>
        </Row>
        <br />
        <Row>
          <Col style={{ textAlign: "right", padding: 0 }} xs="3">
            <Label style={labelStyle} className="mr-sm-2">
              Select Model(s):
            </Label>
          </Col>
          <Col style={{ textAlign: "left", padding: 0 }} xs="9">
            <Selector
              options={this.state.models}
              selectionHandler={this.modelHandler}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
