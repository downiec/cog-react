/* eslint-disable @typescript-eslint/no-explicit-any */
import chromaJs from 'chroma-js';
import { convertStrToChromaColor, convertStrToHexColor } from './utils';

describe('Test convertStrToChromaColor', () => {
  it('returns a default green chroma color with empty string', () => {
    expect(convertStrToChromaColor('')).toEqual(chromaJs('green'));
  });

  it('returns a chroma color with short string', () => {
    expect(convertStrToChromaColor('a')).toBeTruthy();
  });

  it('returns a chroma color with long string', () => {
    expect(convertStrToChromaColor('abcdefghijklmnopqrstuvwxyz')).toBeTruthy();
  });

  it('returns a chroma color matching min and max specifications', () => {
    expect(
      convertStrToChromaColor('a', {
        minColor: [10, 10, 10],
        maxColor: [10, 10, 10],
      })
    ).toEqual(chromaJs([10, 10, 10]));
  });
});

describe('Test convertStrToHexColor', () => {
  it('returns a default green chroma color with empty string', () => {
    expect(convertStrToHexColor('')).toEqual(chromaJs('green').hex());
  });

  it('returns a chroma color with short string', () => {
    expect(convertStrToChromaColor('a')).toBeTruthy();
  });

  it('returns a chroma color with long string', () => {
    expect(convertStrToHexColor('abcdefghijklmnopqrstuvwxyz')).toBeTruthy();
  });

  it('returns a chroma color matching min and max specifications', () => {
    expect(
      convertStrToHexColor('a', {
        minColor: [10, 10, 10],
        maxColor: [10, 10, 10],
      })
    ).toEqual(chromaJs([10, 10, 10]).hex());
  });
});
