/* eslint-disable @typescript-eslint/camelcase */
import chromaJs from "chroma-js";
import { Subscription, FIELDS } from "./customTypes";

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

export const defaultSubscriptions: { [name: string]: Subscription } = {
  variables_clt: {
    name: "clt",
    type: FIELDS.variables,
    frequency: "weekly",
    data: {
      frequency: "3hr",
      modeling_realm: "atmos",
      standard_name: "cloud_area_fraction",
      units: "%",
      cell_methods: "area: time: mean",
      cell_measures: "area: areacella",
      long_name: "Total Cloud Cover Percentage",
      comment:
        "Total cloud area fraction (reported as a percentage) for the whole atmospheric column, as seen from the surface or the top of the atmosphere. Includes both large-scale and convective cloud.",
      dimensions: "longitude latitude time",
      out_name: "clt",
      type: "real",
      positive: "",
      valid_min: "",
      valid_max: "",
      ok_min_mean_abs: "",
      ok_max_mean_abs: "",
    },
  },
};
