import { Tag, Tooltip } from 'antd';
import React from 'react';
import chromaJs from 'chroma-js';
import DataProvider from '../../modules/dataProvider';
import { renderOption } from '../../modules/dataRenderer';
import { FIELDS, SelectorOption } from '../../types';

interface ISubPanelItem {
  id: string;
  tooltip: string;
  dataType: FIELDS;
}

export default function SubscriptionItem(props: ISubPanelItem): JSX.Element {
  const opt: SelectorOption<any> = DataProvider.getInstance().getOptionItem(props.dataType, props.id);
  const col: chromaJs.Color = chromaJs(opt.color);
  const key = `${props.dataType}_${props.id}`;

  return (
    <Tooltip placement="top" title={`${props.tooltip}`}>
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
        {renderOption(opt)}
      </Tag>
    </Tooltip>
  );
}
