/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import React from 'react';
import { FIELDS, VariableInfo } from '../types';
import DataProvider from './dataProvider';
import { renderOption, DataPopover, IDataRenderProps } from './dataRenderer';

describe('Test colorByRealm', () => {
  it('returns a hex color based on the modeling_realm', () => {
    expect(
      DataProvider.colorByRealm(['Test', { modeling_realm: 'test' } as VariableInfo])
    ).toEqual('#8beda0');
  });
});

describe('Test DataPopover component', () => {
  it('renders a basic data popover with undefined data', () => {
    const props: IDataRenderProps = {
      option: {
        color: 'black',
        data: { test: 'test_data' },
        label: 'Test',
        value: 'test',
      },
      headerTxt: 'Test',
      descriptionTxt: 'This is a test',
      buttonTxt: 'Click',
      dataHeaders: ['undefined value'],
      data: [undefined],
    };
    const { findByText } = render(
      <DataPopover
        option={props.option}
        headerTxt={props.headerTxt}
        descriptionTxt={props.descriptionTxt}
        buttonTxt={props.buttonTxt}
        dataHeaders={props.dataHeaders}
        data={props.data}
      />
    );
    const popover = findByText('This is a test');
    expect(popover).toBeTruthy();
  });

  it('renders a basic data popover', () => {
    const props: IDataRenderProps = {
      option: {
        color: 'black',
        data: { test: 'test_data' },
        label: 'Test',
        value: 'test',
      },
      headerTxt: 'Test',
      descriptionTxt: 'This is a test',
      buttonTxt: 'Click',
      dataHeaders: ['Data1', 'Data2', 'Data3'],
      data: ['value1', 'value2', 'value3'],
    };
    const { findByText } = render(
      <DataPopover
        option={props.option}
        headerTxt={props.headerTxt}
        descriptionTxt={props.descriptionTxt}
        buttonTxt={props.buttonTxt}
        dataHeaders={props.dataHeaders}
        data={props.data}
      />
    );
    const popover = findByText('This is a test');
    expect(popover).toBeTruthy();
  });

  it('render a data popover with array of data containing arrays', () => {
    const props: IDataRenderProps = {
      option: {
        color: 'black',
        data: { test: 'test_data' },
        label: 'Test',
        value: 'test',
      },
      headerTxt: 'Test',
      descriptionTxt: 'This is a test',
      buttonTxt: 'Click',
      dataHeaders: ['Data1', 'Data2', 'Data3'],
      data: [
        ['var0', 'value1'],
        ['value2', 'var2'],
        ['value3', 'var3'],
      ],
    };
    const { findByText } = render(
      <DataPopover
        option={props.option}
        headerTxt={props.headerTxt}
        descriptionTxt={props.descriptionTxt}
        buttonTxt={props.buttonTxt}
        dataHeaders={props.dataHeaders}
        data={props.data}
      />
    );
    const popover = findByText('This is a test');
    expect(popover).toBeTruthy();
  });
});

describe('Test renderOption renders the appropriate DataPopover', () => {
  const provider = new DataProvider();
  it('renders an empty div if no option is provided', () => {
    const option: any = undefined;
    expect(renderOption(option)).toEqual(<div />);
  });
  it('renders an experiment popover if data is experiment type', () => {
    const option = provider.getOptionItem(FIELDS.experiment_id, '1pctCO2');
    expect(renderOption(option)).toBeTruthy();
  });
  it('renders an experiment popover if data is model type', () => {
    const option = provider.getOptionItem(FIELDS.source_id, 'ACCESS-CM2');
    expect(renderOption(option)).toBeTruthy();
  });
  it('renders an experiment popover if data is variable type', () => {
    const option = provider.getOptionItem(FIELDS.variable_id, 'clt');
    expect(renderOption(option)).toBeTruthy();
  });
  it('renders default popover if option is not specified types above', () => {
    const option: any = provider.getOptionItem(FIELDS.realm, 'land');
    expect(renderOption(option)).toBeTruthy();
  });
});
