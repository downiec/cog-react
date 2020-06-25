import React from "react";
import { Layout } from "antd";
import Select from "react-windowed-select";
import animated from "react-select/animated";
import { ValueType } from "react-select/src/types";
import { SelectComponents } from "react-select/src/components";
import ErrorBoundary from "./ErrorBoundary";
import { SelectorOption } from "../data/dataProvider";
import { customStyles } from "../constants";
import { renderOption } from "../data/dataRenderer";

const errorRender: JSX.Element = (
  <Layout>
    <h5>An error occured with this dropdown</h5>
  </Layout>
);

const customRender = (data: SelectorOption<any>): JSX.Element | undefined => {
  return renderOption(data);
};

const animatedComponents: SelectComponents<SelectorOption<any>> = animated();

export interface ISelectorProps {
  options: ValueType<SelectorOption<any>>;
  selectedOptions: ValueType<SelectorOption<any>>;
  selectionHandler: (
    selection: ValueType<SelectorOption<any>>
  ) => Promise<void>;
}

export function Selector(props: ISelectorProps): JSX.Element {
  return (
    <ErrorBoundary errorRender={errorRender}>
      <Select
        isMulti
        isSearchable
        isClearable
        backspaceRemovesValue
        closeMenuOnSelect={false}
        openMenuOnClick={!props.selectedOptions}
        components={animatedComponents}
        onChange={async (
          value: ValueType<SelectorOption<any>>
        ): Promise<void> => {
          await props.selectionHandler(value);
        }}
        options={
          props.options
            ? (props.options as Array<SelectorOption<any>>)
            : undefined
        }
        value={props.selectedOptions}
        styles={customStyles}
        placeholder="Make selection"
        formatOptionLabel={customRender}
        noOptionsMessage={(obj: { inputValue: string }): string => {
          return obj.inputValue
            ? `'${obj.inputValue}' was not found.`
            : "No options available.";
        }}
      />
    </ErrorBoundary>
  );
}
