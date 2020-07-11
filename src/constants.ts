/* eslint-disable @typescript-eslint/camelcase */
import chromaJs from "chroma-js";
import { Subscription } from "./customTypes";

// eslint-disable-next-line import/prefer-default-export
export const customStyles = {
  control: (styles: any): {} => ({ ...styles, backgroundColor: "white" }),
  option: (
    styles: any,
    { data, isDisabled, isFocused, isSelected }: any
  ): {} => {
    if (!data) {
      return styles;
    }
    const color = chromaJs(data.color);
    let backgroundCol = null;
    if (!isDisabled) {
      if (isSelected) {
        backgroundCol = data.color;
      } else if (isFocused) {
        backgroundCol = color.alpha(0.1).css();
      }
    }
    let textCol = "#ccc";
    if (!isDisabled) {
      if (isSelected) {
        if (chromaJs.contrast(color, "white") > 2) {
          textCol = "white";
        } else {
          textCol = "black";
        }
      } else {
        textCol = data.color;
      }
    }
    return {
      ...styles,
      backgroundColor: backgroundCol,
      color: textCol,
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles: any, { data }: any): {} => {
    const color = chromaJs(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles: any, { data }: any): {} => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles: any, { data }: any): {} => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};

export const defaultSubscriptions: Subscription[] = [
  {
    id: 1,
    timestamp: Date.now(),
    period: "weekly",
    activity_id: ["CMIP"],
    experiment_id: [],
    frequency: [],
    source_id: [],
    realm: ["land"],
    variable_id: ["clt"],
  },
];
