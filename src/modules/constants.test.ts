/* eslint-disable @typescript-eslint/no-explicit-any */
import chromaJs from 'chroma-js';
import { customStyles } from './constants';

describe('Test customStyles', () => {
  const styles = { max: '123', min: '123', ':active': { stuff: true } };
  const color = '#afafaf';
  const chromaColor = chromaJs(color);
  it('returns custom style with white background', () => {
    expect(customStyles.control(styles)).toEqual({
      ...styles,
      backgroundColor: 'white',
    });
  });
  it('returns appropriate multiValue styling', () => {
    expect(customStyles.multiValue(styles, { data: { color: 'red' } })).toEqual(
      {
        ...styles,
        backgroundColor: chromaJs('red').alpha(0.1).css(),
      }
    );
  });
  it('returns appropriate multiValueLabel styling', () => {
    expect(
      customStyles.multiValueLabel(styles, { data: { color: 'red' } })
    ).toEqual({
      ...styles,
      color: 'red',
    });
  });
  it('returns appropriate multiValueRemove styling', () => {
    expect(
      customStyles.multiValueRemove(styles, { data: { color: 'red' } })
    ).toEqual({
      ...styles,
      color: 'red',
      ':hover': {
        backgroundColor: 'red',
        color: 'white',
      },
    });
  });
  it('returns style when data is null', () => {
    expect(
      customStyles.option(styles, {
        isDisabled: true,
        isFocused: true,
        isSelected: true,
      })
    ).toEqual(styles);
  });
  it('returns basic styling when disabled', () => {
    expect(
      customStyles.option(styles, {
        data: { color },
        isDisabled: true,
        isFocused: false,
        isSelected: false,
      })
    ).toEqual({
      ...styles,
      backgroundColor: null,
      color: '#ccc',
      cursor: 'not-allowed',
      ':active': {
        stuff: true,
        backgroundColor: color,
      },
    });
  });
  it('returns styling when focused', () => {
    expect(
      customStyles.option(styles, {
        data: { color },
        isDisabled: false,
        isFocused: true,
        isSelected: false,
      })
    ).toEqual({
      ...styles,
      backgroundColor: chromaColor.alpha(0.1).css(),
      color,
      cursor: 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: chromaColor.alpha(0.3).css(),
      },
    });
  });
  it('returns styling when selected, black', () => {
    expect(
      customStyles.option(styles, {
        data: { color: 'black' },
        isDisabled: false,
        isFocused: false,
        isSelected: true,
      })
    ).toEqual({
      ...styles,
      backgroundColor: 'black',
      color: 'white',
      cursor: 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: 'black',
      },
    });
  });
  it('returns styling when selected, white', () => {
    expect(
      customStyles.option(styles, {
        data: { color: 'white' },
        isDisabled: false,
        isFocused: false,
        isSelected: true,
      })
    ).toEqual({
      ...styles,
      backgroundColor: 'white',
      color: 'black',
      cursor: 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: 'white',
      },
    });
  });
});
