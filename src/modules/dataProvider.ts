/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueType } from 'react-select/src/types';
import { importDataItem, importDataList } from './dataImporter';
import {
  ExperimentInfo,
  FIELDS,
  ModelInfo,
  SelectorOption,
  VariableInfo,
} from '../types';
import { convertStrToHexColor } from './utils';

export const colorByName = (value: [string, any]): string => {
  return convertStrToHexColor(value[0], {
    minColor: [20, 20, 20],
    maxColor: [220, 220, 220],
  });
};

export const colorShadesBlue = (value: [string, any]): string => {
  return convertStrToHexColor(value[0], {
    minColor: [50, 100, 200],
    maxColor: [120, 200, 255],
  });
};

export const colorShadesGreen = (value: [string, any]): string => {
  return convertStrToHexColor(value[0], {
    minColor: [50, 200, 120],
    maxColor: [150, 255, 200],
  });
};

export const colorByActivity = (value: [string, ExperimentInfo]): string => {
  return convertStrToHexColor(value[1].activity_id[0], {
    minColor: [20, 20, 20],
    maxColor: [220, 220, 220],
  });
};

export const colorByRealm = (value: [string, VariableInfo]): string => {
  return convertStrToHexColor(value[1].modeling_realm, {
    minColor: [50, 200, 120],
    maxColor: [150, 255, 200],
  });
};

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

export function areVariables(object: any): object is VariableInfo[] {
  return Array.isArray(object) && isVariable(object[0]);
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
    if (!value[1]) {
      return;
    }
    const col: string = colorFunc ? colorFunc(value) : 'black';

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
    case FIELDS.activity_id:
      return createOptions(data, colorByName);
    case FIELDS.experiment_id:
      return createOptions(data, colorByActivity);
    case FIELDS.frequency:
      return createOptions(data, colorShadesBlue);
    case FIELDS.realm:
      return createOptions(data, colorShadesGreen);
    default:
      return createOptions(data, (): string => {
        return 'grey';
      });
  }
}

export function getAllOptions(dataType: FIELDS): any {
  const data = importDataList(dataType);
  return getOptions(dataType, data);
}

export function getOptionItem(
  dataType: FIELDS,
  id: string
): SelectorOption<any> {
  const data = importDataItem(dataType, id);
  const opts = getOptions(dataType, data);
  if (!(opts === null || opts === undefined) && Array.isArray(opts)) {
    return opts[0];
  }
  return opts as SelectorOption<any>;
}

export function applyFilters<T>(
  dataList: ValueType<SelectorOption<T>>,
  filterFunctions: Array<(data: SelectorOption<T>, filterData: any) => boolean>,
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
