import React, { useState } from "react";

import { Button, Popover } from "antd";
import chromaJs from "chroma-js";
import { convertStrToColor } from "../utilities/mainUtils";
import {
  areVariables,
  ExperimentInfo,
  isExperiment,
  isModel,
  SelectorOption,
  VariableInfo,
} from "./dataProvider";

export const colorByName = (value: [string, any]): string => {
  return convertStrToColor(value[0], {
    minColor: [20, 20, 20],
    maxColor: [220, 220, 220],
  });
};

export const colorShadesBlue = (value: [string, any]): string => {
  return convertStrToColor(value[0], {
    minColor: [50, 100, 200],
    maxColor: [120, 200, 255],
  });
};

export const colorShadesGreen = (value: [string, any]): string => {
  return convertStrToColor(value[0], {
    minColor: [50, 200, 120],
    maxColor: [150, 255, 200],
  });
};

export const colorByActivity = (value: [string, ExperimentInfo]): string => {
  return convertStrToColor(value[1].activity_id[0], {
    minColor: [20, 20, 20],
    maxColor: [220, 220, 220],
  });
};

export const colorByRealm = (value: [string, VariableInfo]): string => {
  return convertStrToColor(value[1].modeling_realm, {
    minColor: [50, 200, 120],
    maxColor: [150, 255, 200],
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

interface IDataRenderProps {
  option: SelectorOption<any>;
  headerTxt: string;
  descriptionTxt: string;
  buttonTxt: string;
  dataHeaders: string[];
  data: any[];
}

function DataPopover(props: IDataRenderProps): JSX.Element {
  const [show, setShow] = useState(false);

  const color: chromaJs.Color = chromaJs(props.option.color);
  const id = `info_${props.option.label}`;
  const toggle = (): void => {
    setShow(!show);
  };
  return (
    <div>
      <Popover
        trigger="click"
        placement="bottom"
        overlayStyle={{ minWidth: "250px" }}
        title={
          <div
            style={{
              color: color.css(),
              fontSize: "1.5em",
              width: "270px",
            }}
          >
            {props.headerTxt}
            <Button
              className="float-right"
              style={{
                color: color.css(),
                backgroundColor: color.alpha(0.2).css(),
                borderColor: color.alpha(0.3).css(),
              }}
              id={`sub_info_${id}`}
              onClick={toggle}
            >
              {props.buttonTxt}
            </Button>
          </div>
        }
        content={
          <div
            style={{
              maxWidth: "270px",
              color: color
                .desaturate()
                .darken()
                .css(),
            }}
          >
            {props.descriptionTxt}
            <div
              id={`sub_info_${id}`}
              style={{ display: show ? "block" : "none", maxWidth: "250px" }}
            >
              <hr />
              {props.dataHeaders.map((header: string, idx: number) => {
                return showData(idx, header, props.data[idx]);
              })}
            </div>
          </div>
        }
      >
        <Button
          style={{
            color: color.css(),
            backgroundColor: color.alpha(0).css(),
            borderColor: color.alpha(0).css(),
          }}
          id={id}
        >
          {props.option.label}
        </Button>
      </Popover>
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
    return (
      <DataPopover
        option={option}
        headerTxt="Description"
        descriptionTxt={option.data.description}
        buttonTxt="Detail"
        dataHeaders={[
          "Start Year",
          "End Year",
          "Min Years Per Sim",
          "Experiment ID",
          "Sub Experiment ID",
          "Experiment",
          "Activities",
          "Tier",
        ]}
        data={[
          option.data.start_year,
          option.data.end_year,
          option.data.min_number_yrs_per_sim,
          option.data.experiment_id,
          option.data.sub_experiment_id,
          option.data.experiment,
          option.data.activity_id,
          option.data.tier,
        ]}
      />
    );
  }

  if (isModel(option.data)) {
    return (
      <DataPopover
        option={option}
        headerTxt="Description"
        descriptionTxt={option.data.label_extended}
        buttonTxt="Detail"
        dataHeaders={[
          "Model",
          "Institution ID",
          "Release Year",
          "Label",
          "Activity Participation",
        ]}
        data={[
          option.data.source_id,
          option.data.institution_id,
          option.data.release_year,
          option.data.label,
          option.data.activity_participation,
        ]}
      />
    );
  }

  if (areVariables(option.data)) {
    return (
      <DataPopover
        option={option}
        headerTxt="Comment"
        descriptionTxt={option.data[0].comment}
        buttonTxt="More Info"
        dataHeaders={[
          "Standard Name",
          "Long Name",
          "Modeling Realm",
          "Dimensions",
          "Frequency",
          "Units",
          "Out Name",
        ]}
        data={[
          option.data[0].standard_name,
          option.data[0].long_name,
          option.data[0].modeling_realm,
          option.data[0].dimensions,
          option.data[0].frequency,
          option.data[0].units,
          option.data[0].out_name,
        ]}
      />
    );
  }

  return defaultOption(option);
}
