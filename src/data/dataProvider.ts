import { ValueType } from "react-select/src/types";
import { isNullOrUndefined, isArray } from "util";
import { importDataItem, importDataList } from "./dataImporter";
import { memoize } from "../utilities/mainUtils";
import {
  colorByActivity,
  colorByName,
  colorShadesBlue,
  colorShadesGreen,
} from "./dataRenderer";
import { FIELDS } from "../customTypes";

export function isExperiment(object: any): object is ExperimentInfo {
  if (!object) {
    return false;
  }
  return object.experiment_id !== undefined;
}

export function isVariable(object: any): object is VariableInfo {
  if (!object) {
    return false;
  }
  return object.standard_name !== undefined;
}

export function isModel(object: any): object is ModelInfo {
  if (!object) {
    return false;
  }
  return object.source_id !== undefined;
}

export function createOptions<T>(
  data: { [key: string]: T },
  colorFunc?: (value: [string, T]) => string
): ValueType<SelectorOption<T>> {
  if (!data) {
    return null;
  }

  const options = new Array<SelectorOption<T>>();
  const entries = Object.entries(data);

  entries.forEach((value: [string, T]) => {
    const col: string = colorFunc ? colorFunc(value) : "black";

    options.push({
      label: value[0],
      value: value[0],
      data: value[1],
      color: col,
    });
  });

  return options;
}

function getOptions(
  dataType: FIELDS,
  data: { [key: string]: any }
): ValueType<SelectorOption<any>> {
  switch (dataType) {
    case FIELDS.experiments:
      return createOptions(data, colorByActivity);
    case FIELDS.frequencies:
      return createOptions(data, colorShadesBlue);
    case FIELDS.realms:
      return createOptions(data, colorShadesGreen);
    default:
      return createOptions(data, colorByName);
  }
}

function getAllOptions(dataType: FIELDS): any {
  const data = importDataList(dataType);
  return getOptions(dataType, data);
}

export function getOptionItem(
  dataType: FIELDS,
  id: string
): SelectorOption<any> {
  const data = importDataItem(dataType, id);
  const opts = getOptions(dataType, data);
  if (!isNullOrUndefined(opts) && isArray(opts)) {
    return opts[0];
  }
  return opts as SelectorOption<any>;
}

export function getOptionList(
  dataType: FIELDS,
  ids: string[] | undefined
): ValueType<SelectorOption<any>>[] {
  if (!ids) {
    return [undefined];
  }

  const data = importDataList(dataType);
  const options: any[] = ids.map((id: string) => {
    return getOptions(dataType, data[id]);
  });
  return options;
}

export const getAll: (data: FIELDS) => ValueType<SelectorOption<any>> = memoize(
  getAllOptions
);

export function areVariables(object: any): object is VariableInfo[] {
  return Array.isArray(object) && isVariable(object[0]);
}

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

export function applyFilters<T>(
  dataList: ValueType<SelectorOption<T>>,
  filterFunctions: Array<(data: SelectorOption<T>, otherData: any) => boolean>,
  otherData: any
): ValueType<SelectorOption<T>> {
  if (!dataList) {
    return;
  }

  if (Array.isArray(dataList)) {
    const newList = Array<SelectorOption<T>>();

    // For each data item, if it passes through all filters, add it to newlist
    dataList.forEach((data: SelectorOption<T>) => {
      const addOption: boolean = filterFunctions
        .map((func) => {
          // Map filter functions to get boolean array
          return func(data, otherData);
        }) // Return true if any result was true
        .some((result: boolean) => {
          return result;
        });

      // Add option to list if all filters for item passed
      if (addOption) {
        newList.push(data);
      }
    });

    // eslint-disable-next-line consistent-return
    return newList;
  }

  const addOption: boolean = filterFunctions
    .map((func) => {
      // Map filter functions to get boolean array
      return func(dataList as SelectorOption<T>, otherData);
    }) // Return true if any result was true
    .some((result: boolean) => {
      return result;
    });

  // Add option to list if all filters for item passed
  if (addOption) {
    // eslint-disable-next-line consistent-return
    return dataList;
  }
}

export function getOptionListValues(
  list: ValueType<SelectorOption<string>>
): string[] {
  let newList = Array<string>();
  if (!list) {
    newList = [];
  }
  if (Array.isArray(list)) {
    list.forEach((option: SelectorOption<string>) => {
      newList.push(option.value);
    });
  } else if (list) {
    const option = list as SelectorOption<string>;
    newList = [option.value];
  }

  return newList;
}

export function getOptionListData<T>(list: ValueType<SelectorOption<T>>): T[] {
  let newList = Array<T>();
  if (!list) {
    newList = [];
  }
  if (Array.isArray(list)) {
    list.forEach((option: SelectorOption<T>) => {
      if (option) {
        newList.push(option.data);
      }
    });
  } else {
    const option = list as SelectorOption<T>;
    if (option) {
      newList = [option.data];
    }
  }

  return newList;
}

export const filterByActivity = (
  option: SelectorOption<ExperimentInfo>,
  activities: string[]
): boolean => {
  if (!activities || activities.length < 1) {
    return true;
  }

  return option.data.activity_id.some((id: string) => {
    return activities.includes(id);
  });
};

export const filterByFrequency = (
  option: SelectorOption<VariableInfo[]>,
  frequencies: string[]
): boolean => {
  if (!frequencies || frequencies.length < 1) {
    return true;
  }

  return option.data
    .map((varInfo: VariableInfo) => {
      return varInfo.frequency;
    })
    .some((varFreq: string) => {
      return frequencies.includes(varFreq);
    });
};

export const filterByRealm = (
  option: SelectorOption<VariableInfo[]>,
  realms: string[]
): boolean => {
  if (!realms || realms.length < 1) {
    return true;
  }

  return option.data
    .map((varInfo: VariableInfo) => {
      return varInfo.modeling_realm;
    })
    .some((varRealm: string) => {
      return realms.includes(varRealm);
    });
};
