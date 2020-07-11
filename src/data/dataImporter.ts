import {
  activityData,
  experimentData,
  frequencyData,
  modelData,
  realmData,
} from "./output/appdata";
import { variableData } from "./output/variableData";
import { FIELDS } from "../customTypes";

export function importDataList(data: FIELDS): any {
  // Note that currently this returns hardcoded data found in the 'appdata.ts' file
  // This function will be updated to use an API call when API is ready.
  switch (data) {
    case FIELDS.activity_id:
      return activityData;
    case FIELDS.experiment_id:
      return experimentData;
    case FIELDS.frequency:
      return frequencyData;
    case FIELDS.realm:
      return realmData;
    case FIELDS.variable_id:
      return variableData;
    case FIELDS.source_id:
      return modelData;
    default:
      return {};
  }
}

export function importDataItem(type: FIELDS, id: string): any {
  const data: { [key: string]: any } = {};

  switch (type) {
    case FIELDS.activity_id:
      data[id] = activityData[id];
      break;
    case FIELDS.experiment_id:
      data[id] = experimentData[id];
      break;
    case FIELDS.frequency:
      data[id] = frequencyData[id];
      break;
    case FIELDS.realm:
      data[id] = realmData[id];
      break;
    case FIELDS.variable_id:
      data[id] = variableData[id];
      break;
    case FIELDS.source_id:
      data[id] = modelData[id];
      break;
    default:
      return {};
  }
  return data;
}
