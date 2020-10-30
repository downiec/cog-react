/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExperimentInfo, FIELDS, SelectorOption, VariableInfo } from '../types';
import {
  isExperiment,
  isModel,
  isVariable,
  areVariables,
  getOptionItem,
  getOptionListData,
  getOptionListValues,
  applyFilters,
  filterByActivity,
  filterByFrequency,
  filterByRealm,
  createOptions,
  getAllOptions,
} from './dataProvider';

describe('Test isExperiment', () => {
  it('returns false if input is not an experiment', () => {
    expect(isExperiment({})).toEqual(false);
    expect(isExperiment(null)).toEqual(false);
  });
  it('returns true is object has experiment id', () => {
    expect(isExperiment({ experiment_id: 'test' })).toEqual(true);
  });
});

describe('Test isModel', () => {
  it('returns false if input is not a model', () => {
    expect(isModel({})).toEqual(false);
    expect(isModel(null)).toEqual(false);
  });
  it('returns true is object has source id', () => {
    expect(isModel({ source_id: 'test' })).toEqual(true);
  });
});

describe('Test isVariable', () => {
  it('returns false if input is not a variable', () => {
    expect(isVariable({})).toEqual(false);
    expect(isVariable(null)).toEqual(false);
  });
  it('returns true is object has a standard name', () => {
    expect(isVariable({ standard_name: 'test' })).toEqual(true);
  });
});

describe('Test areVariables', () => {
  it('returns false if input is not an array', () => {
    expect(areVariables({})).toEqual(false);
    expect(areVariables(null)).toEqual(false);
  });
  it('returns false if it is not an array of variables', () => {
    expect(areVariables([1, 2, 3, 4])).toEqual(false);
    expect(
      areVariables([{ source_id: test }, { standard_name: test }, {}])
    ).toEqual(false);
  });
  it('returns true is object has source id', () => {
    expect(
      areVariables([{ standard_name: 'test' }, { standard_name: 'test' }])
    ).toEqual(true);
  });
});

describe('Test getAll', () => {
  it('returns all data of specified type', () => {
    expect(getAllOptions(FIELDS.activity_id)).toBeDefined();
  });
  it('returns all data of specified type', () => {
    expect(getAllOptions(FIELDS.activity_id)).toBeDefined();
  });
});

describe('Test createOptions', () => {
  it('returns null if no data is provided', () => {
    expect(createOptions<string>((null as unknown) as {})).toEqual(null);
  });
  it('returns a default option list from single data', () => {
    const testData = { key: 'test' };
    expect(createOptions<string>(testData)).toEqual([
      { label: 'key', value: 'key', data: 'test', color: 'black' },
    ]);
  });
  it('returns a default option list from multiple data keys', () => {
    const testData = { key: 'test', key2: 'test2' };
    expect(createOptions<string>(testData)).toEqual([
      { label: 'key', value: 'key', data: 'test', color: 'black' },
      { label: 'key2', value: 'key2', data: 'test2', color: 'black' },
    ]);
  });
  it('returns options using speified color function', () => {
    const testData = { key: 'test', key2: 'test2' };
    const colorFunc = (value: [string, string]) => {
      return 'red';
    };
    expect(createOptions<string>(testData, colorFunc)).toEqual([
      { label: 'key', value: 'key', data: 'test', color: 'red' },
      { label: 'key2', value: 'key2', data: 'test2', color: 'red' },
    ]);
  });
});

describe('Test getOptionItem', () => {
  it('returns undefined if id is invalid', () => {
    expect(getOptionItem(FIELDS.activity_id, 'bad_id')).toEqual(undefined);
  });
  it('returns undefined if id or field is undefined', () => {
    expect(getOptionItem(undefined as any, undefined as any)).toEqual(
      undefined
    );
  });
  it('returns object with data if it is valid', () => {
    expect(getOptionItem(FIELDS.activity_id, 'C4MIP')).toBeDefined();
  });
});

describe('Test getOptionListValues', () => {
  it('returns an empty list if given empty options list', () => {
    expect(getOptionListValues([])).toEqual([]);
  });
  it('returns an empty list if given undefined data', () => {
    expect(getOptionListValues(undefined)).toEqual([]);
  });
  it('returns list of one item if given a single option', () => {
    const option: SelectorOption<string> = {
      label: 'key',
      value: 'test',
      data: 'data',
      color: 'red',
    };
    expect(getOptionListValues(option)).toEqual(['test']);
  });
  it('returns a list of multiple items if multiple options', () => {
    const options: SelectorOption<string>[] = [
      {
        label: 'key',
        value: 'test',
        data: 'data',
        color: 'red',
      },
      {
        label: 'key2',
        value: 'test2',
        data: 'data2',
        color: 'red',
      },
    ];
    expect(getOptionListValues(options)).toEqual(['test', 'test2']);
  });
});

describe('Test getOptionListData', () => {
  it('returns an empty list if given empty options list', () => {
    expect(getOptionListData([])).toEqual([]);
  });
  it('returns an empty list if given undefined data', () => {
    expect(getOptionListData(undefined)).toEqual([]);
  });
  it('returns list of one item if given a single option', () => {
    const option: SelectorOption<string> = {
      label: 'key',
      value: 'key',
      data: 'test',
      color: 'red',
    };
    expect(getOptionListData(option)).toEqual(['test']);
  });
  it('returns a list of multiple items if multiple options', () => {
    const options: SelectorOption<string>[] = [
      {
        label: 'key',
        value: 'key',
        data: 'test',
        color: 'red',
      },
      {
        label: 'key2',
        value: 'key2',
        data: 'test2',
        color: 'red',
      },
    ];
    expect(getOptionListData(options)).toEqual(['test', 'test2']);
  });
});

describe('Test applyFilters using activity filter', () => {
  const filter = filterByActivity;
  const allExperiments = getAllOptions(FIELDS.experiment_id);
  const oneExperiment = getOptionItem(FIELDS.experiment_id, '1pctCO2');

  it('returns undefined if data list provided was undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = getOptionListValues(selection);
    expect(
      applyFilters<ExperimentInfo>(undefined, [filter], newSelection)
    ).toEqual(undefined);
  });
  it('returns all data if selection is undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = getOptionListValues(selection);
    expect(
      applyFilters<ExperimentInfo>(allExperiments, [filter], newSelection)
    ).toEqual(allExperiments);
  });
  it('returns single item if data is only single item and selection undefined', () => {
    expect(
      applyFilters<ExperimentInfo>(oneExperiment, [filter], undefined)
    ).toEqual(oneExperiment);
  });
  it('returns empty list if filter value is not found', () => {
    expect(
      applyFilters<ExperimentInfo>(
        allExperiments,
        [filter],
        'invalid_activity_id'
      )
    ).toEqual([]);
  });
  it('returns filtered list if filter value is found', () => {
    const allItemsArray = allExperiments as Array<SelectorOption<any>>;
    const filteredArray = applyFilters<ExperimentInfo>(
      allExperiments,
      [filter],
      'C4MIP'
    ) as Array<SelectorOption<any>>;
    expect(allItemsArray.length).toBeGreaterThan(filteredArray.length);
  });
});

describe('Test applyFilters using frequency filter', () => {
  const filter = filterByFrequency;
  const allVariables = getAllOptions(FIELDS.variable_id);
  const oneVariable = getOptionItem(FIELDS.frequency, 'clt');

  it('returns undefined if data list provided was undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = getOptionListValues(selection);
    expect(
      applyFilters<VariableInfo[]>(undefined, [filter], newSelection)
    ).toEqual(undefined);
  });
  it('returns all data if selection is undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = getOptionListValues(selection);
    expect(
      applyFilters<VariableInfo[]>(allVariables, [filter], newSelection)
    ).toEqual(allVariables);
  });
  it('returns single item if data is only single item and selection undefined', () => {
    expect(
      applyFilters<VariableInfo[]>(oneVariable, [filter], undefined)
    ).toEqual(oneVariable);
  });
  it('returns empty list if filter value is not found', () => {
    expect(
      applyFilters<VariableInfo[]>(allVariables, [filter], 'invalid_frequency')
    ).toEqual([]);
  });
  it('returns filtered list if filter value is found', () => {
    const allItemsArray = allVariables as Array<SelectorOption<any>>;
    const filteredArray = applyFilters<VariableInfo[]>(
      allVariables,
      [filter],
      '1hr'
    ) as Array<SelectorOption<any>>;
    expect(allItemsArray.length).toBeGreaterThan(filteredArray.length);
  });
});

describe('Test applyFilters using realm filter', () => {
  const filter = filterByRealm;
  const allVariables = getAllOptions(FIELDS.variable_id);
  const oneVariable = getOptionItem(FIELDS.realm, 'clt');

  it('returns undefined if data list provided was undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = getOptionListValues(selection);
    expect(
      applyFilters<VariableInfo[]>(undefined, [filter], newSelection)
    ).toEqual(undefined);
  });
  it('returns all data if selection is undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = getOptionListValues(selection);
    expect(
      applyFilters<VariableInfo[]>(allVariables, [filter], newSelection)
    ).toEqual(allVariables);
  });
  it('returns single item if data is only single item and selection undefined', () => {
    expect(
      applyFilters<VariableInfo[]>(oneVariable, [filter], undefined)
    ).toEqual(oneVariable);
  });
  it('returns empty list if filter value is not found', () => {
    expect(
      applyFilters<VariableInfo[]>(allVariables, [filter], 'invalid_realm')
    ).toEqual([]);
  });
  it('returns filtered list if filter value is found', () => {
    const allItemsArray = allVariables as Array<SelectorOption<any>>;
    const filteredArray = applyFilters<VariableInfo[]>(
      allVariables,
      [filter],
      'land'
    ) as Array<SelectorOption<any>>;
    expect(allItemsArray.length).toBeGreaterThan(filteredArray.length);
  });
});

/*
describe('Test getOptionsList', () => {
  it('returns empty array when no ids are provided', () => {
    expect(getOptionList(FIELDS.activity_id, [])).toEqual([]);
  });
  it('returns undefined array when ids input is undefined', () => {
    expect(getOptionList(FIELDS.activity_id, undefined)).toEqual([undefined]);
  });
  it('returns array with null value if id is invalid', () => {
    expect(getOptionList(FIELDS.activity_id,["test"])).toEqual([null]);
  });
  it('returns array with one value if array with single id is provided', () => {
    expect(getOptionList(FIELDS.activity_id,["TEST","C4MIP"])).toEqual("");
  });
});
*/
