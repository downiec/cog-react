import {
  activityData,
  experimentData,
  frequencyData,
  modelData,
  realmData
} from "../data/output/appdata";
import { variableData } from "./output/variableData";
import { DATA } from "./../constants";

export function importData(data: DATA): any {
  switch (data) {
    case DATA.ACTIVITIES:
      return importActivities();
    case DATA.EXPERIMENTS:
      return importExperiments();
    case DATA.FREQUENCIES:
      return importFrequencies();
    case DATA.REALMS:
      return importRealms();
    case DATA.VARIABLES:
      return importVariables();
    case DATA.MODELS:
      return importModels();
    default:
      return {}
  }
}

function importActivities(): any {
  return activityData;
}

function importExperiments(): any {
  return experimentData;
}

function importFrequencies(): any {
  return frequencyData;
}

function importRealms(): any {
  return realmData;
}

function importVariables(): any {
  return variableData;
}

function importModels(): any {
  return modelData;
}
