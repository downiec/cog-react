
import React from "react";

const defaultErrorRender: JSX.Element = (
  <p style={{ color: "red", backgroundColor: "white", fontSize: "1rem" }}>
    There was an error when attempting to render this option.
  </p>
);
/*
//export type RenderState = "selected" | "hover" | "default" | "error";

export interface IOptionProps {
  optionData: SelectorOption;
  renderFunction?: (
    //state: RenderState,
    optionData: SelectorOption
  ) => JSX.Element; // Function that renders the option based on it's state
  onClickHandler?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void; // Function to perform when clicked
}

export interface IOptionState {
  //renderState: RenderState;
  hovered: boolean;
  selected: boolean;
}

export default class Options extends React.Component<
  IOptionProps,
  IOptionState
> {
  constructor(props: IOptionProps) {
    super(props);
    this.state = {
      //renderState: "default",
      hovered: false,
      selected: false
    };
  }

  @bindDecorator
  selectRenderer(): void {
    //let newState: RenderState = "default";
    if (this.state.hovered) {
      newState = "hover";
    } else if (this.state.selected) {
      newState = "selected";
    }
    this.setState({ renderState: newState });
  }

  public render(): JSX.Element {
    if (this.props.renderFunction) {
      const optionElement: JSX.Element = this.props.renderFunction(
        //this.state.renderState,
        this.props.optionData
      );
      return (
        <ErrorBoundary
          errorRender={this.props.renderFunction(
            //"error",
            this.props.optionData
          )}
        >
          <div
            key={this.props.optionData.value}
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              if (this.props.onClickHandler) {
                this.props.onClickHandler(event);
              }
              this.setState({ selected: !this.state.selected });
              this.selectRenderer();
            }}
            onMouseEnter={() => {
              this.setState({ hovered: true });
              this.selectRenderer();
            }}
            onMouseLeave={() => {
              this.setState({ hovered: false });
              this.selectRenderer();
            }}
          >
            {optionElement}
          </div>
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary errorRender={defaultErrorRender}>
        <div
          key={this.props.optionData.value}
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (this.props.onClickHandler) {
              this.props.onClickHandler(event);
            }
            this.setState({ selected: !this.state.selected });
            this.selectRenderer();
            throw new Error("Testing error");
          }}
        >
          <div>
            <span>{this.props.optionData.value}</span>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
*/