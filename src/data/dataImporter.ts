import {
  activityData,
  experimentData,
  frequencyData,
  modelData,
  realmData,
} from "./output/appdata";
import { variableData } from "./output/variableData";
import { FIELDS } from "../customTypes";

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

export default function importData(data: FIELDS): any {
  switch (data) {
    case FIELDS.activities:
      return importActivities();
    case FIELDS.experiments:
      return importExperiments();
    case FIELDS.frequencies:
      return importFrequencies();
    case FIELDS.realms:
      return importRealms();
    case FIELDS.variables:
      return importVariables();
    case FIELDS.models:
      return importModels();
    default:
      return {};
  }
}
