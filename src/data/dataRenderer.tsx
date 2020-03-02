import React from "react";
import { convertStrToColor } from "../utilities/mainUtils";
import {
  areVariables,
  ExperimentInfo,
  isExperiment,
  SelectorOption,
  VariableInfo,
  isModel
} from "./dataProvider";
import {
  Button,
  PopoverBody,
  PopoverHeader,
  UncontrolledCollapse,
  UncontrolledPopover
} from "reactstrap";
import chromaJs from "chroma-js";

export const colorByName = (value: [string, any]): string => {
  return convertStrToColor(value[0], {
    minColor: [20, 20, 20],
    maxColor: [220, 220, 220]
  });
};

export const colorShadesBlue = (value: [string, any]): string => {
  return convertStrToColor(value[0], {
    minColor: [50, 100, 200],
    maxColor: [120, 200, 255]
  });
};

export const colorShadesGreen = (value: [string, any]): string => {
  return convertStrToColor(value[0], {
    minColor: [50, 200, 120],
    maxColor: [150, 255, 200]
  });
};

export const colorByActivity = (value: [string, ExperimentInfo]): string => {
  return convertStrToColor(value[1].activity_id[0], {
    minColor: [20, 20, 20],
    maxColor: [220, 220, 220]
  });
};

export const colorByRealm = (value: [string, VariableInfo]): string => {
  return convertStrToColor(value[1].modeling_realm, {
    minColor: [50, 200, 120],
    maxColor: [150, 255, 200]
  });
};

function showData(
  id: number,
  name: string,
  data: any
): JSX.Element | undefined {
  if (data) {
    if (Array.isArray(data)) {
      return (
        <div key={id}>
          <b>{name}</b>: {data.join(", ")}
          <br />
        </div>
      );
    }
    return (
      <div key={id}>
        <b>{name}</b>: {data}
        <br />
      </div>
    );
  }
}

function defaultOption(option: SelectorOption<any>): JSX.Element {
  return <div>{option.label}</div>;
}

function renderData(
  option: SelectorOption<any>,
  headerTxt: string,
  descriptionTxt: string,
  buttonTxt: string,
  dataHeaders: string[],
  data: any[]
) {
  const color: chromaJs.Color = chromaJs(option.color);
  const id = `info_${option.label}`;
  return (
    <div>
      <Button
        style={{
          color: color.css(),
          backgroundColor: color.alpha(0).css(),
          borderColor: color.alpha(0).css()
        }}
        id={id}
        type="button"
      >
        {option.label}
      </Button>
      <UncontrolledPopover trigger="legacy" placement="bottom" target={id}>
        <PopoverHeader
          style={{
            color: color.css(),
            backgroundColor: color.alpha(0.1).css(),
            borderColor: color.alpha(0.5).css(),
            fontSize: "1.5em",
            minWidth: "250px"
          }}
          className="clearfix"
        >
          {headerTxt}
          <Button
            className="float-right"
            style={{
              color: color.css(),
              backgroundColor: color.alpha(0.2).css(),
              borderColor: color.alpha(0.3).css()
            }}
            id={`sub_info_${id}`}
            type="button"
          >
            {buttonTxt}
          </Button>
        </PopoverHeader>
        <PopoverBody
          style={{
            color: color
              .desaturate()
              .darken()
              .css(),
            backgroundColor: "FFF",
            borderColor: color.alpha(0.5).css()
          }}
        >
          {descriptionTxt}
          <UncontrolledCollapse toggler={`sub_info_${id}`}>
            <hr />
            {dataHeaders.map((header: string, idx: number) => {
              return showData(idx, header, data[idx]);
            })}
          </UncontrolledCollapse>
        </PopoverBody>
      </UncontrolledPopover>
    </div>
  );
}

export function renderOption(
  option: SelectorOption<any>
): JSX.Element | undefined {
  if (!option) {
    return;
  }

  if (isExperiment(option.data)) {
    return renderData(
      option,
      "Description",
      option.data.description,
      "Detail",
      [
        "Start Year",
        "End Year",
        "Min Years Per Sim",
        "Experiment ID",
        "Sub Experiment ID",
        "Experiment",
        "Activities",
        "Tier"
      ],
      [
        option.data.start_year,
        option.data.end_year,
        option.data.min_number_yrs_per_sim,
        option.data.experiment_id,
        option.data.sub_experiment_id,
        option.data.experiment,
        option.data.activity_id,
        option.data.tier
      ]
    );
  }

  if (isModel(option.data)) {
    return renderData(
      option,
      "Description",
      option.data.label_extended,
      "Detail",
      [
        "Model",
        "Institution ID",
        "Release Year",
        "Label",
        "Activity Participation"
      ],
      [
        option.data.source_id,
        option.data.institution_id,
        option.data.release_year,
        option.data.label,
        option.data.activity_participation
      ]
    );
  }

  if (areVariables(option.data)) {
    if (option.data.length > 1) {
      /*const color: chromaJs.Color = chromaJs(option.color);
      const id = `info_${option.label}`;
      return (
        <div>
          <Button
            style={{
              color: color.css(),
              backgroundColor: color.alpha(0).css(),
              borderColor: color.alpha(0).css()
            }}
            id={id}
            type="button"
          >
            {option.label}
          </Button>
          <UncontrolledPopover trigger="legacy" placement="bottom" target={id}>
            <PopoverHeader
              style={{
                color: color.css(),
                backgroundColor: color.alpha(0.1).css(),
                borderColor: color.alpha(0.5).css(),
                fontSize: "1.5em",
                minWidth: "250px"
              }}
              className="clearfix"
            >
              Multiple Variables
            </PopoverHeader>
            <PopoverBody
              style={{
                color: color
                  .desaturate()
                  .darken()
                  .css(),
                backgroundColor: "FFF",
                borderColor: color.alpha(0.5).css()
              }}
            >
              {option.data.map((variable, index) => {
                return (
                  <div key={index}>
                    {renderData(
                      option,
                      "Comment",
                      variable.comment,
                      "More Info",
                      [
                        "Standard Name",
                        "Long Name",
                        "Modeling Realm",
                        "Dimensions",
                        "Frequency",
                        "Units",
                        "Out Name"
                      ],
                      [
                        variable.standard_name,
                        variable.long_name,
                        variable.modeling_realm,
                        variable.dimensions,
                        variable.frequency,
                        variable.units,
                        variable.out_name
                      ]
                    )}
                  </div>
                );
              })}
            </PopoverBody>
          </UncontrolledPopover>
        </div>
      );*/
    }
    return renderData(
      option,
      "Comment",
      option.data[0].comment,
      "More Info",
      [
        "Standard Name",
        "Long Name",
        "Modeling Realm",
        "Dimensions",
        "Frequency",
        "Units",
        "Out Name"
      ],
      [
        option.data[0].standard_name,
        option.data[0].long_name,
        option.data[0].modeling_realm,
        option.data[0].dimensions,
        option.data[0].frequency,
        option.data[0].units,
        option.data[0].out_name
      ]
    );
  }

  return defaultOption(option);
}
