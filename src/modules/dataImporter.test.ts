/* eslint-disable @typescript-eslint/no-explicit-any */
import { FIELDS } from '../types';
import {
  activityData,
  experimentData,
  frequencyData,
  modelData,
  realmData,
} from '../data/output/appdata';
import DataImporter from './DataImporter';
import { variableData } from '../data/output/variableData';

const dataImporter = new DataImporter();

describe('test importDataList', () => {
  it('returns frequency data when field is frequency', () => {
    expect(dataImporter.importDataList(FIELDS.frequency)).toEqual(frequencyData);
  });
  it('returns activity data when field is activity_id', () => {
    expect(dataImporter.importDataList(FIELDS.activity_id)).toEqual(activityData);
  });
  it('returns empty object when no field passed', () => {
    expect(dataImporter.importDataList(undefined as any)).toEqual({});
  });
});

describe('test importDataItem', () => {
  it('returns data object with undefined value if invalid id passed', () => {
    expect(dataImporter.importDataItem(FIELDS.activity_id, 'invalidIDValue')).toEqual({
      invalidIDValue: undefined,
    });
  });
  it('returns empty object with bad field name', () => {
    expect(dataImporter.importDataItem('invalid' as any, 'invalid')).toEqual({});
  });
  it('returns a single activity item having specified id', () => {
    expect(dataImporter.importDataItem(FIELDS.activity_id, 'C4MIP')).toEqual({
      C4MIP: activityData.C4MIP,
    });
    expect(dataImporter.importDataItem(FIELDS.experiment_id, '1pctCO2')).toEqual({
      '1pctCO2': experimentData['1pctCO2'],
    });
    expect(dataImporter.importDataItem(FIELDS.frequency, '1hr')).toEqual({
      '1hr': frequencyData['1hr'],
    });
    expect(dataImporter.importDataItem(FIELDS.realm, 'aerosol')).toEqual({
      aerosol: realmData.aerosol,
    });
    expect(dataImporter.importDataItem(FIELDS.source_id, 'ACCESS-CM2')).toEqual({
      'ACCESS-CM2': modelData['ACCESS-CM2'],
    });
  });
  expect(dataImporter.importDataItem(FIELDS.variable_id, 'clt')).toEqual({
    clt: variableData.clt,
  });
});
