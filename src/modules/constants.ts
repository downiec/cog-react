/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import chromaJs from 'chroma-js';
import { Subscription } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const customStyles = {
  control: (styles: any): Record<string, unknown> => ({
    ...styles,
    backgroundColor: 'white',
  }),
  option: (
    styles: any,
    { data, isDisabled, isFocused, isSelected }: any
  ): Record<string, unknown> => {
    if (!data) {
      return styles;
    }
    const color = chromaJs(data.color);
    let backgroundCol = null;
    let activeBackground = data.color;
    let textCol = '#ccc';
    if (!isDisabled) {
      if (isSelected) {
        backgroundCol = data.color;
        if (chromaJs.contrast(color, 'white') > 2) {
          textCol = 'white';
        } else {
          textCol = 'black';
        }
      } else {
        if (isFocused) {
          backgroundCol = color.alpha(0.1).css();
        }
        activeBackground = color.alpha(0.3).css();
        textCol = data.color;
      }
    }

    return {
      ...styles,
      backgroundColor: backgroundCol,
      color: textCol,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: activeBackground,
      },
    };
  },
  multiValue: (styles: any, { data }: any): Record<string, unknown> => {
    const color = chromaJs(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles: any, { data }: any): Record<string, unknown> => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles: any, { data }: any): Record<string, unknown> => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

export const defaultSubscriptions: Subscription[] = [
  {
    id: 1234567,
    timestamp: Date.now(),
    period: 'weekly',
    activity_id: ['CMIP'],
    experiment_id: [],
    frequency: [],
    source_id: [],
    realm: ['land'],
    variable_id: ['clt'],
  },
];
