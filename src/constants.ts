import chromaJs from "chroma-js";

export const customStyles = {
  control: (styles: any) => ({ ...styles, backgroundColor: "white" }),
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    const color = chromaJs(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chromaJs.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css())
      }
    };
  },
  multiValue: (
    styles: any,
    { data, isDisabled, isFocused, isSelected }: any
  ) => {
    const color = chromaJs(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    };
  },
  multiValueLabel: (
    styles: any,
    { data, isDisabled, isFocused, isSelected }: any
  ) => ({
    ...styles,
    color: data.color
  }),
  multiValueRemove: (
    styles: any,
    { data, isDisabled, isFocused, isSelected }: any
  ) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white"
    }
  })
};