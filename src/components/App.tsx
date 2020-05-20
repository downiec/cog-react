import * as React from "react";
import bindDecorator from "bind-decorator";
import { Button, Col, Container, Label, Row } from "reactstrap";
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
  VariableGroup
} from "../data/dataProvider";

import { DATA } from "./../constants";
import { getCookie } from "../utilities/mainUtils";

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.5rem"
};

export interface IAppProps {
  post_url: string;
  user_info: any;
  activities: any;
  experiments: any;
}

export interface IAppState {
  filteredActivities: ValueType<SelectorOption<string>>;
  filteredExperiments: ValueType<SelectorOption<ExperimentInfo>>;
  filteredFrequencies: ValueType<SelectorOption<string>>;
  filteredRealms: ValueType<SelectorOption<string>>;
  filteredVariables: ValueType<SelectorOption<VariableGroup>>;
  filteredModels: ValueType<SelectorOption<ModelInfo>>;
  selectedActivities: ValueType<SelectorOption<string>>;
  selectedExperiments: ValueType<SelectorOption<ExperimentInfo>>;
  selectedFrequencies: ValueType<SelectorOption<string>>;
  selectedRealms: ValueType<SelectorOption<string>>;
  selectedVariables: ValueType<SelectorOption<VariableGroup>>;
  selectedModels: ValueType<SelectorOption<ModelInfo>>;
  selectedActivityIds: string[];
  selectedExperimentInfo: ExperimentInfo[];
  selectedFrequencyNames: string[];
  selectedRealmNames: string[];
  selectedVariableNames: string[];
  selectedModelInfo: ModelInfo[];
}

export default class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      filteredActivities: getAll(DATA.ACTIVITIES),
      filteredExperiments: getAll(DATA.EXPERIMENTS),
      filteredFrequencies: getAll(DATA.FREQUENCIES),
      filteredRealms: getAll(DATA.REALMS),
      filteredVariables: getAll(DATA.VARIABLES),
      filteredModels: getAll(DATA.MODELS),
      selectedActivities: null,
      selectedExperiments: null,
      selectedFrequencies: null,
      selectedRealms: null,
      selectedVariables: null,
      selectedModels: null,
      selectedActivityIds: [],
      selectedExperimentInfo: [],
      selectedFrequencyNames: [],
      selectedRealmNames: [],
      selectedVariableNames: [],
      selectedModelInfo: []
    };
  }

  @bindDecorator
  public clearAll(): void {
    this.setState({
      filteredActivities: getAll(DATA.ACTIVITIES),
      filteredExperiments: getAll(DATA.EXPERIMENTS),
      filteredFrequencies: getAll(DATA.FREQUENCIES),
      filteredRealms: getAll(DATA.REALMS),
      filteredVariables: getAll(DATA.VARIABLES),
      filteredModels: getAll(DATA.MODELS),
      selectedActivities: null,
      selectedExperiments: null,
      selectedFrequencies: null,
      selectedRealms: null,
      selectedVariables: null,
      selectedModels: null,
      selectedActivityIds: [],
      selectedExperimentInfo: [],
      selectedFrequencyNames: [],
      selectedRealmNames: [],
      selectedVariableNames: [],
      selectedModelInfo: []
    });
  }

  @bindDecorator
  public async submitSelections(): Promise<void> {
    // Generate the request with form data
    const request: Request = this.generateRequest();
    // Send request and await for response
    const success = await this.sendRequest(request);
    console.log(success);
    // Clear form
    if (success) {
      this.clearAll();
    }
  }

  @bindDecorator
  public async activityHandler(
    activitySelection: ValueType<SelectorOption<string>>
  ): Promise<void> {
    const newSelection: string[] = getOptionListValues(activitySelection);
    const filteredExperiments = applyFilters<ExperimentInfo>(
      getAll(DATA.EXPERIMENTS),
      [filterByActivity],
      newSelection
    );
    this.setState({
      selectedActivities: activitySelection,
      selectedActivityIds: newSelection,
      filteredExperiments
    });
  }

  @bindDecorator
  public async experimentHandler(
    experimentSelection: ValueType<SelectorOption<any>>
  ): Promise<void> {
    const newSelection: ExperimentInfo[] = getOptionListData(
      experimentSelection
    );
    this.setState({
      selectedExperiments: experimentSelection,
      selectedExperimentInfo: newSelection
    });
  }

  @bindDecorator
  public async frequencyHandler(
    frequencySelection: ValueType<SelectorOption<any>>
  ): Promise<void> {
    const newSelection: string[] = getOptionListValues(frequencySelection);
    const filteredVariables = applyFilters<VariableGroup>(
      getAll(DATA.VARIABLES),
      [filterByFrequency, filterByRealm],
      newSelection
    );
    this.setState({
      selectedFrequencies: frequencySelection,
      selectedFrequencyNames: newSelection,
      filteredVariables
    });
  }

  @bindDecorator
  public async realmHandler(
    realmSelection: ValueType<SelectorOption<any>>
  ): Promise<void> {
    const newSelection: string[] = getOptionListValues(realmSelection);
    const filteredVariables = applyFilters<VariableGroup>(
      getAll(DATA.VARIABLES),
      [filterByFrequency, filterByRealm],
      newSelection
    );
    this.setState({
      selectedRealms: realmSelection,
      selectedRealmNames: newSelection,
      filteredVariables
    });
  }

  @bindDecorator
  public async variableHandler(
    variableSelection: ValueType<SelectorOption<any>>
  ): Promise<void> {
    const newSelection: string[] = getOptionListValues(variableSelection);
    this.setState({
      selectedVariables: variableSelection,
      selectedVariableNames: newSelection
    });
  }

  @bindDecorator
  public async modelHandler(
    modelSelection: ValueType<SelectorOption<any>>
  ): Promise<void> {
    const newSelection: ModelInfo[] = getOptionListData(modelSelection);
    this.setState({
      selectedModels: modelSelection,
      selectedModelInfo: newSelection
    });
  }

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
              options={this.state.filteredActivities}
              selectedOptions={this.state.selectedActivities}
              selectionHandler={this.activityHandler}
            />
          </Col>
        </Row>
        {this.state.filteredExperiments && (
          <Row>
            <Col style={{ textAlign: "right", padding: 0 }} xs="3">
              <Label style={labelStyle} className="mr-sm-2">
                Select Experiment(s):
              </Label>
            </Col>
            <Col style={{ textAlign: "left", padding: 0 }} xs="9">
              <Selector
                options={this.state.filteredExperiments}
                selectedOptions={this.state.selectedExperiments}
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
              options={this.state.filteredFrequencies}
              selectedOptions={this.state.selectedFrequencies}
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
              options={this.state.filteredRealms}
              selectedOptions={this.state.selectedRealms}
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
              options={this.state.filteredVariables}
              selectedOptions={this.state.selectedVariables}
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
              options={this.state.filteredModels}
              selectedOptions={this.state.selectedModels}
              selectionHandler={this.modelHandler}
            />
          </Col>
        </Row>
        <Row>
          <Button onClick={this.submitSelections}>Submit</Button>
        </Row>
      </Container>
    );
  }

  private async sendRequest(request: Request): Promise<any> {
    // Perform fetch to send data
    try {
      const response: Response = await fetch(request);
      if (response.status >= 200 && response.status < 300) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
      console.log(
        `Something went wrong with request to API server! \n\
Status: ${response.status}. Response Text: ${response.statusText}`
      );
      window.alert(`Form submission failed.`);
      return { Error: response.statusText };
    } catch (error) {
      console.error(error);
    }
  }

  @bindDecorator
  private generateRequest(): Request {
    const data: any = {};
    data.activity_ids = this.state.selectedActivityIds;
    data.experiment_ids = this.state.selectedExperimentInfo.map(
      (experiment: ExperimentInfo) => {
        return experiment.experiment_id;
      }
    );
    data.frequencies = this.state.selectedFrequencyNames;
    data.realms = this.state.selectedRealmNames;
    data.variables = this.state.selectedVariableNames;
    data.models = this.state.selectedModelInfo.map((model: ModelInfo) => {
      return model.source_id;
    });

    // Get required csrf toekn for posting request.
    const csrftoken = getCookie("csrftoken");

    const request: Request = new Request(this.props.post_url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "X-CSRFToken": csrftoken ? csrftoken : "",
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });

    return request;
  }
}
