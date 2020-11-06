/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  activityData,
  experimentData,
  frequencyData,
  modelData,
  realmData,
} from '../data/output/appdata';
import { variableData } from '../data/output/variableData';
import { FIELDS } from './types';

export type IComponentData = {
  activityData: { [id: string]: string };
  experimentData: { [id: string]: any };
  frequencyData: { [id: string]: any };
  modelData: { [id: string]: any };
  realmData: { [id: string]: any };
  variableData: { [id: string]: any };
}
export default class DataImporter {
  private _data: IComponentData;

  constructor(componentData?: IComponentData) {
    if (componentData) {
      this._data = componentData;
    } else {
      this._data = {
        activityData,
        experimentData,
        frequencyData,
        modelData,
        realmData,
        variableData,
      };
    }
    this.importDataItem = this.importDataItem.bind(this);
    this.importDataList = this.importDataList.bind(this);
  }

  get importedData(): IComponentData {
    return this._data;
  }

  set importedData(data: IComponentData) {
    if (data) {
      this._data = data;
    } else {
      this._data = {
        activityData,
        experimentData,
        frequencyData,
        modelData,
        realmData,
        variableData,
      };
    }
  }

  public importDataList(dataType: FIELDS): any {
    // Note that currently this returns hardcoded data found in the 'appdata.ts' file
    // This function will be updated to use an API call when API is ready.
    switch (dataType) {
      case FIELDS.activity_id:
        return this._data.activityData;
      case FIELDS.experiment_id:
        return this._data.experimentData;
      case FIELDS.frequency:
        return this._data.frequencyData;
      case FIELDS.realm:
        return this._data.realmData;
      case FIELDS.variable_id:
        return this._data.variableData;
      case FIELDS.source_id:
        return this._data.modelData;
      default:
        return {};
    }
  }

  public importDataItem(type: FIELDS, id: string): any {
    const data: { [key: string]: any } = {};

    switch (type) {
      case FIELDS.activity_id:
        data[id] = this._data.activityData[id];
        break;
      case FIELDS.experiment_id:
        data[id] = this._data.experimentData[id];
        break;
      case FIELDS.frequency:
        data[id] = this._data.frequencyData[id];
        break;
      case FIELDS.realm:
        data[id] = this._data.realmData[id];
        break;
      case FIELDS.source_id:
        data[id] = this._data.modelData[id];
        break;
      case FIELDS.variable_id:
        data[id] = this._data.variableData[id];
        break;
      default:
        return {};
    }
    return data;
  }
}
