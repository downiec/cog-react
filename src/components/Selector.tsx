import React from "react";
import Select from "react-select";
import animated from "react-select/animated";
import { ValueType } from "react-select/src/types";
import ErrorBoundary from "./ErrorBoundary";
import { Container } from "reactstrap";
import { SelectComponents } from "react-select/src/components";
import { SelectorOption } from "../data/dataProvider";
//import { customStyles } from "../constants";
//import Option from "./Option";
import { customStyles } from "../constants";
import { renderOption } from "../data/dataRenderer";

const errorRender: JSX.Element = (
  <Container>
    <h5>An error occured with this dropdown</h5>
  </Container>
);

const customRender = (data: SelectorOption<any>) => {
  return renderOption(data);
};

const animatedComponents: SelectComponents<SelectorOption<any>> = animated();

export interface ISelectorProps {
  options: ValueType<SelectorOption<any>>;
  selectionHandler: (selection: ValueType<SelectorOption<any>>) => void;
}

export interface ISelectorState {
  selectedOptions: ValueType<SelectorOption<any>>;
}

export default class Selector extends React.Component<
  ISelectorProps,
  ISelectorState
> {
  constructor(props: ISelectorProps) {
    super(props);

    this.state = {
      selectedOptions: null
    };
  }

  public render(): JSX.Element {
    return (
      <ErrorBoundary errorRender={errorRender}>
        <Select
          backspaceRemovesValue={true}
          closeMenuOnSelect={false}
          openMenuOnClick={!this.state.selectedOptions}
          components={animatedComponents}
          isMulti={true}
          isSearchable={true}
          isClearable={true}
          onChange={(value: ValueType<SelectorOption<any>>) => {
            this.props.selectionHandler(value);
            this.setState({ selectedOptions: value });
          }}
          options={
            this.props.options
              ? (this.props.options as SelectorOption<any>[])
              : undefined
          }
          value={this.state.selectedOptions}
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
}
