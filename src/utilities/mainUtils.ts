import chromaJs from "chroma-js";

type color = [number, number, number];

/**
 * Converts a string into a number. The same string input will always return the same number output.
 * @param str The string to convert into a number.
 * @param maxVal The maximium output value a string should have, must be less than Number.MAX_VALUE - 1;
 */
function convertStrToNum(str: string, maxVal: number): number {
  // Allow only printable characters
  const newstr: string = str.replace(/[^ -~]+/g, "");

  // Using Horner's rule with x = 31
  let value: number = newstr.charCodeAt(0);
  for (let i = 1; i < newstr.length; i += 1) {
    value = (value * 31 + newstr.charCodeAt(0)) % maxVal;
  }
  return value;
}

export function convertStrToChromaColor(
  str: string,
  rgbRange?: {
    minColor: color;
    maxColor: color;
  }
): chromaJs.Color {
  let newStr = str;
  if (!newStr) {
    return chromaJs("green");
  }

  // Make string large enough to cover all colors
  newStr = newStr.repeat(6);

  // Obtain number from string ascii values then reduce range to RGB color range
  const baseNum: number = convertStrToNum(newStr, 16777215);

  // Convert value to RGB value array
  const colors: color = chromaJs(baseNum).rgb();

  // Modify RGB values based on rgbRange desired
  if (rgbRange) {
    const scaleRGB = [1, 1, 1];
    for (let i = 0; i < 3; i += 1) {
      scaleRGB[i] = colors[i] / 256; // Normalize value to 0-1
      colors[i] = Math.floor(
        (rgbRange.maxColor[i] - rgbRange.minColor[i]) * scaleRGB[i] +
          rgbRange.minColor[i]
      );
    }
  }

  return chromaJs(colors);
}

export function convertStrToHexColor(
  str: string,
  rgbRange?: {
    minColor: color;
    maxColor: color;
  }
): string {
  return convertStrToChromaColor(str, rgbRange).hex();
}

// The following function are copying from
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
export function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const memoize = (fn: any) => {
  const cache: any = {};
  return (...args: any) => {
    const stringArgs: any = JSON.stringify(args);
    // eslint-disable-next-line no-multi-assign
    const result: any = (cache[stringArgs] =
      typeof cache[stringArgs] === "undefined"
        ? fn(...args)
        : cache[stringArgs]);
    return result;
  };
};
