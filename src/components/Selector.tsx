import React from "react";
import Select from "react-select";
import animated from "react-select/animated";
import { ValueType } from "react-select/src/types";
import ErrorBoundary from "./ErrorBoundary";
import { Container } from "reactstrap";
import { SelectComponents } from "react-select/src/components";
import { SelectorOption } from "../data/dataProvider";
import { customStyles } from "../constants";
import { renderOption } from "../data/dataRenderer";

const errorRender: JSX.Element = (
  <Container>
    <h5>An error occured with this dropdown</h5>
  </Container>
);

const customRender = (data: SelectorOption<any>): JSX.Element | undefined => {
  return renderOption(data);
};

const animatedComponents: SelectComponents<SelectorOption<any>> = animated();

export interface ISelectorProps {
  options: ValueType<SelectorOption<any>>;
  selectedOptions: ValueType<SelectorOption<any>>;
  selectionHandler: (selection: ValueType<SelectorOption<any>>) => Promise<void>;
}

export function Selector(props: ISelectorProps): JSX.Element {
  return (
    <ErrorBoundary errorRender={errorRender}>
      <Select
        backspaceRemovesValue={true}
        closeMenuOnSelect={false}
        openMenuOnClick={!props.selectedOptions}
        components={animatedComponents}
        isMulti={true}
        isSearchable={true}
        isClearable={true}
        onChange={async (value: ValueType<SelectorOption<any>>) => {
          await props.selectionHandler(value);
        }}
        options={
          props.options
            ? (props.options as Array<SelectorOption<any>>)
            : undefined
        }
        value={props.selectedOptions}
        styles={customStyles}
        placeholder={"Make selection"}
        formatOptionLabel={customRender}
        noOptionsMessage={(obj: { inputValue: string }) => {
          return obj.inputValue
            ? `'${obj.inputValue}' was not found.`
            : "No options available.";
        }}
      />
    </ErrorBoundary>
  );
}
