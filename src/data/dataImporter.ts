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
    case FIELDS.activities:
      return activityData;
    case FIELDS.experiments:
      return experimentData;
    case FIELDS.frequencies:
      return frequencyData;
    case FIELDS.realms:
      return realmData;
    case FIELDS.variables:
      return variableData;
    case FIELDS.models:
      return modelData;
    default:
      return {};
  }
}

export function importDataItem(type: FIELDS, id: string): any {
  const data: { [key: string]: any } = {};

  switch (type) {
    case FIELDS.activities:
      data[id] = activityData[id];
      break;
    case FIELDS.experiments:
      data[id] = experimentData[id];
      break;
    case FIELDS.frequencies:
      data[id] = frequencyData[id];
      break;
    case FIELDS.realms:
      data[id] = realmData[id];
      break;
    case FIELDS.variables:
      data[id] = variableData[id];
      break;
    case FIELDS.models:
      data[id] = modelData[id];
      break;
    default:
      return {};
  }
  return data;
}
