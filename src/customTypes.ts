/* eslint-disable @typescript-eslint/camelcase */
import { ExperimentInfo, VariableInfo, ModelInfo } from "./data/dataProvider";

export type SubType = "Experiment" | "Variable" | "Model";
export type Period = "daily" | "weekly" | "biweekly" | "monthly";

export type Subscription = {
  id: number;
  period: Period;
  timestamp: number;
  name?: string;
  activity_id?: string[];
  experiment_id?: string[];
  frequency?: string[];
  source_id?: string[];
  realm?: string[];
  variable_id?: string[];
};

export type OptionType = string | ExperimentInfo | VariableInfo | ModelInfo;

export enum FIELDS {
  activity_id = "activity_id",
  experiment_id = "experiment_id",
  frequency = "frequency",
  source_id = "source_id",
  realm = "realm",
  variable_id = "variable_id",
}
