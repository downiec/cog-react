import { Tag } from 'antd';
// eslint-disable-next-line
import React from 'react';
import chromaJs from 'chroma-js';
import DataProvider from '../../modules/dataProvider';
import { renderOption } from '../../modules/renderData';
import { FIELDS, SelectorOption } from '../../modules/types';

interface ISubPanelItem {
  id: string;
  dataType: FIELDS;
}

export default function SubscriptionItem(props: ISubPanelItem): JSX.Element {
  const opt: SelectorOption<any> = DataProvider.getInstance().getOptionItem(
    props.dataType,
    props.id
  );
  let col: chromaJs.Color;
  if (opt) {
    col = chromaJs(opt.color);
  } else {
    col = chromaJs('black');
  }
  const key = `${props.dataType}_${props.id}`;

  return (

    <Tag
      key={key}
      style={{
        color: col.darken().css(),
        backgroundColor: col.alpha(0.1).css(),
        borderColor: col.css(),
        padding: '.2em',
        margin: '.2em',
      }}
    >
      {opt && renderOption(opt)}
      {!opt && `${props.dataType}: ${props.id}`}
    </Tag>
  );
}
