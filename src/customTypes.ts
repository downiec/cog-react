import { ExperimentInfo, VariableInfo, ModelInfo } from "./data/dataProvider";

export type SubType = "Experiment" | "Variable" | "Model";
export type Freq = "daily" | "weekly" | "biweekly" | "monthly";
export type Subscription = {
  name: string;
  type: FIELDS;
  frequency: Freq;
  data: OptionType;
};

export type OptionType = string | ExperimentInfo | VariableInfo | ModelInfo;

export enum FIELDS {
  activities = "activities",
  experiments = "experiments",
  frequencies = "frequencies",
  models = "models",
  realms = "realms",
  variables = "variables",
}
