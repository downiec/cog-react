/* eslint-disable no-shadow */

export enum Panes {
  'AddSubs' = '1',
  'ViewSubs' = '2',
}

export enum FIELDS {
  activity_id = 'activity_id',
  experiment_id = 'experiment_id',
  frequency = 'frequency',
  source_id = 'source_id',
  realm = 'realm',
  variable_id = 'variable_id',
}

export type SubType = 'Experiment' | 'Variable' | 'Model';
export type Period = 'daily' | 'weekly' | 'biweekly' | 'monthly';

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

export interface SelectorOption<T> {
  color: string;
  label: string;
  value: string;
  data: T;
}

export interface ExperimentInfo {
  activity_id: string[];
  additional_allowed_model_components: string[];
  description: string;
  end_year: string;
  experiment: string;
  experiment_id: string;
  min_number_yrs_per_sim: string;
  parent_activity_id: string[];
  parent_experiment_id: string[];
  required_model_components: string[];
  start_year: string;
  sub_experiment_id: string[];
  tier: string;
}

export interface VariableInfo {
  frequency: string;
  modeling_realm: string;
  standard_name: string;
  units: string;
  cell_methods: string;
  cell_measures: string;
  long_name: string;
  comment: string;
  dimensions: string;
  out_name: string;
  type: string;
  positive: string;
  valid_min: string;
  valid_max: string;
  ok_min_mean_abs: string;
  ok_max_mean_abs: string;
}

export interface ModelInfo {
  institution_id: string[];
  label: string;
  label_extended: string;
  release_year: string;
  source_id: string;
  activity_participation: string[];
}
