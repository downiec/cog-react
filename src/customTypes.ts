import { ExperimentInfo, VariableInfo, ModelInfo } from "./data/dataProvider";

export type SubType = "Experiment" | "Variable" | "Model";
export type Period = "daily" | "weekly" | "biweekly" | "monthly";

export type Subscription = {
  id: number;
  period: Period;
  timestamp: number;
  name?: string;
  activities?: string[];
  experiments?: string[];
  frequencies?: string[];
  models?: string[];
  realms?: string[];
  variables?: string[];
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
