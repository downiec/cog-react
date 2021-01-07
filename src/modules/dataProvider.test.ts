/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExperimentInfo, FIELDS, SelectorOption, VariableInfo } from './types';
import DataProvider from './dataProvider';

const provider = new DataProvider();

describe('Test isExperiment', () => {
  it('returns false if input is not an experiment', () => {
    expect(DataProvider.isExperiment({})).toEqual(false);
    expect(DataProvider.isExperiment(null)).toEqual(false);
  });
  it('returns true is object has experiment id', () => {
    expect(DataProvider.isExperiment({ experiment_id: 'test' })).toEqual(true);
  });
});

describe('Test isModel', () => {
  it('returns false if input is not a model', () => {
    expect(DataProvider.isModel({})).toEqual(false);
    expect(DataProvider.isModel(null)).toEqual(false);
  });
  it('returns true is object has source id', () => {
    expect(DataProvider.isModel({ source_id: 'test' })).toEqual(true);
  });
});

describe('Test isVariable', () => {
  it('returns false if input is not a variable', () => {
    expect(DataProvider.isVariable({})).toEqual(false);
    expect(DataProvider.isVariable(null)).toEqual(false);
  });
  it('returns true is object has a standard name', () => {
    expect(DataProvider.isVariable({ standard_name: 'test' })).toEqual(true);
  });
});

describe('Test areVariables', () => {
  it('returns false if input is not an array', () => {
    expect(DataProvider.areVariables({})).toEqual(false);
    expect(DataProvider.areVariables(null)).toEqual(false);
  });
  it('returns false if it is not an array of variables', () => {
    expect(DataProvider.areVariables([1, 2, 3, 4])).toEqual(false);
    expect(
      DataProvider.areVariables([
        { source_id: test },
        { standard_name: test },
        {},
      ])
    ).toEqual(false);
  });
  it('returns true is object has source id', () => {
    expect(
      DataProvider.areVariables([
        { standard_name: 'test' },
        { standard_name: 'test' },
      ])
    ).toEqual(true);
  });
});

describe('Test getAll', () => {
  it('returns all data of specified type', () => {
    expect(provider.getAllOptions(FIELDS.activity_id)).toBeDefined();
  });
  it('returns all data of specified type', () => {
    expect(provider.getAllOptions(FIELDS.activity_id)).toBeDefined();
  });
});

describe('Test createOptions', () => {
  it('returns null if no data is provided', () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect(DataProvider.createOptions<string>((null as unknown) as {})).toEqual(
      null
    );
  });
  it('returns a default option list from single data', () => {
    const testData = { key: 'test' };
    expect(DataProvider.createOptions<string>(testData)).toEqual([
      { label: 'key', value: 'key', data: 'test', color: 'black' },
    ]);
  });
  it('returns a default option list from multiple data keys', () => {
    const testData = { key: 'test', key2: 'test2' };
    expect(DataProvider.createOptions<string>(testData)).toEqual([
      { label: 'key', value: 'key', data: 'test', color: 'black' },
      { label: 'key2', value: 'key2', data: 'test2', color: 'black' },
    ]);
  });
  it('returns options using speified color function', () => {
    const testData = { key: 'test', key2: 'test2' };
    const colorFunc = (): string => {
      return 'red';
    };
    expect(DataProvider.createOptions<string>(testData, colorFunc)).toEqual([
      { label: 'key', value: 'key', data: 'test', color: 'red' },
      { label: 'key2', value: 'key2', data: 'test2', color: 'red' },
    ]);
  });
});

describe('Test getOptionItem', () => {
  it('returns undefined if id is invalid', () => {
    expect(provider.getOptionItem(FIELDS.activity_id, 'bad_id')).toEqual(
      undefined
    );
  });
  it('returns undefined if id or field is undefined', () => {
    expect(provider.getOptionItem(undefined as any, undefined as any)).toEqual(
      undefined
    );
  });
  it('returns object with data if it is valid', () => {
    expect(provider.getOptionItem(FIELDS.activity_id, 'C4MIP')).toBeDefined();
  });
});

describe('Test getOptionListValues', () => {
  it('returns an empty list if given empty options list', () => {
    expect(DataProvider.getOptionListValues([])).toEqual([]);
  });
  it('returns an empty list if given undefined data', () => {
    expect(DataProvider.getOptionListValues(undefined)).toEqual([]);
  });
  it('returns list of one item if given a single option', () => {
    const option: SelectorOption<string> = {
      label: 'key',
      value: 'test',
      data: 'data',
      color: 'red',
    };
    expect(DataProvider.getOptionListValues(option)).toEqual(['test']);
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
    expect(DataProvider.getOptionListValues(options)).toEqual([
      'test',
      'test2',
    ]);
  });
});

describe('Test getOptionListData', () => {
  it('returns an empty list if given empty options list', () => {
    expect(DataProvider.getOptionListData([])).toEqual([]);
  });
  it('returns an empty list if given undefined data', () => {
    expect(DataProvider.getOptionListData(undefined)).toEqual([]);
  });
  it('returns list of one item if given a single option', () => {
    const option: SelectorOption<string> = {
      label: 'key',
      value: 'key',
      data: 'test',
      color: 'red',
    };
    expect(DataProvider.getOptionListData(option)).toEqual(['test']);
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
    expect(DataProvider.getOptionListData(options)).toEqual(['test', 'test2']);
  });
});

describe('Test applyFilters using activity filter', () => {
  const filter = DataProvider.filterByActivity;
  const allExperiments = provider.getAllOptions(FIELDS.experiment_id);
  const oneExperiment = provider.getOptionItem(FIELDS.experiment_id, '1pctCO2');

  it('returns undefined if data list provided was undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = DataProvider.getOptionListValues(selection);
    expect(
      DataProvider.applyFilters<ExperimentInfo>(
        undefined,
        [filter],
        newSelection
      )
    ).toEqual(undefined);
  });
  it('returns all data if selection is undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = DataProvider.getOptionListValues(selection);
    expect(
      DataProvider.applyFilters<ExperimentInfo>(
        allExperiments,
        [filter],
        newSelection
      )
    ).toEqual(allExperiments);
  });
  it('returns single item if data is only single item and selection undefined', () => {
    expect(
      DataProvider.applyFilters<ExperimentInfo>(
        oneExperiment,
        [filter],
        undefined
      )
    ).toEqual(oneExperiment);
  });
  it('returns empty list if filter value is not found', () => {
    expect(
      DataProvider.applyFilters<ExperimentInfo>(
        allExperiments,
        [filter],
        'invalid_activity_id'
      )
    ).toEqual([]);
  });
  it('returns filtered list if filter value is found', () => {
    const allItemsArray = allExperiments as Array<SelectorOption<any>>;
    const filteredArray = DataProvider.applyFilters<ExperimentInfo>(
      allExperiments,
      [filter],
      'C4MIP'
    ) as Array<SelectorOption<any>>;
    expect(allItemsArray.length).toBeGreaterThan(filteredArray.length);
  });
});

describe('Test applyFilters using frequency filter', () => {
  const filter = DataProvider.filterByFrequency;
  const allVariables = provider.getAllOptions(FIELDS.variable_id);
  const oneVariable = provider.getOptionItem(FIELDS.frequency, 'clt');

  it('returns undefined if data list provided was undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = DataProvider.getOptionListValues(selection);
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        undefined,
        [filter],
        newSelection
      )
    ).toEqual(undefined);
  });
  it('returns all data if selection is undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = DataProvider.getOptionListValues(selection);
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        allVariables,
        [filter],
        newSelection
      )
    ).toEqual(allVariables);
  });
  it('returns single item if data is only single item and selection undefined', () => {
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        oneVariable,
        [filter],
        undefined
      )
    ).toEqual(oneVariable);
  });
  it('returns empty list if filter value is not found', () => {
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        allVariables,
        [filter],
        'invalid_frequency'
      )
    ).toEqual([]);
  });
  it('returns filtered list if filter value is found', () => {
    const allItemsArray = allVariables as Array<SelectorOption<any>>;
    const filteredArray = DataProvider.applyFilters<VariableInfo[]>(
      allVariables,
      [filter],
      '1hr'
    ) as Array<SelectorOption<any>>;
    expect(allItemsArray.length).toBeGreaterThan(filteredArray.length);
  });
});

describe('Test applyFilters using realm filter', () => {
  const filter = DataProvider.filterByRealm;
  const allVariables = provider.getAllOptions(FIELDS.variable_id);
  const oneVariable = provider.getOptionItem(FIELDS.realm, 'clt');

  it('returns undefined if data list provided was undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = DataProvider.getOptionListValues(selection);
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        undefined,
        [filter],
        newSelection
      )
    ).toEqual(undefined);
  });
  it('returns all data if selection is undefined', () => {
    const selection: any = undefined;
    const newSelection: string[] = DataProvider.getOptionListValues(selection);
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        allVariables,
        [filter],
        newSelection
      )
    ).toEqual(allVariables);
  });
  it('returns single item if data is only single item and selection undefined', () => {
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        oneVariable,
        [filter],
        undefined
      )
    ).toEqual(oneVariable);
  });
  it('returns empty list if filter value is not found', () => {
    expect(
      DataProvider.applyFilters<VariableInfo[]>(
        allVariables,
        [filter],
        'invalid_realm'
      )
    ).toEqual([]);
  });
  it('returns filtered list if filter value is found', () => {
    const allItemsArray = allVariables as Array<SelectorOption<any>>;
    const filteredArray = DataProvider.applyFilters<VariableInfo[]>(
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
