import { Button, Popover } from 'antd';
// eslint-disable-next-line
import React from 'react';
import chromaJs from 'chroma-js';
import { FIELDS } from '../../modules/types';
import SubscriptionItem from './SubscriptionItem';

interface ISubPanelProps {
  title: string;
  ids: string[];
  color: string;
  dataType: FIELDS;
}

export default function SubscriptionPanel(props: ISubPanelProps): JSX.Element {
  if (props.ids.length === 0) {
    return <div />;
  }
  const color: chromaJs.Color = chromaJs(props.color);

  // Render just the one item
  if (props.ids.length === 1) {
    return (
      <SubscriptionItem
        dataType={props.dataType}
        id={props.ids[0]}
      />
    );
  }

  // Render a panel with multiple itesm under same category
  return (
    <div key={Date.now()}>
      <Popover
        trigger="click"
        placement="top"
        title={props.title}
        content={
          <div style={{ maxWidth: '270px' }}>
            {props.ids.map((id: string) => {
              return (
                <SubscriptionItem
                  id={id}
                  dataType={props.dataType}
                />
              );
            })}
          </div>
        }
      >
        <Button
          style={{
            color: color.darken().css(),
            backgroundColor: color.alpha(0.2).css(),
            borderColor: color.css(),
          }}
        >
          {props.title}
        </Button>
      </Popover>
    </div>
  );
}
