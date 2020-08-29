import { Tag, Button, Space, Popover, Tooltip } from "antd";
import React from "react";
import chromaJs from "chroma-js";
import { SelectorOption, getOptionItem } from "../data/dataProvider";
import { Subscription, FIELDS } from "../customTypes";
import { renderOption } from "../data/dataRenderer";

export interface ISubRowProps {
  record: Subscription;
}

interface ISubPanelProps {
  title: string;
  ids: string[];
  color: string;
  dataType: FIELDS;
}

interface ISubPanelItem {
  id: string;
  tooltip: string;
  dataType: FIELDS;
}

function SubscriptionItem(props: ISubPanelItem): JSX.Element {
  const opt: SelectorOption<any> = getOptionItem(props.dataType, props.id);
  const col: chromaJs.Color = chromaJs(opt.color);
  const key = `${props.dataType}_${props.id}`;

  return (
    <Tooltip placement="top" title={`${props.tooltip}`}>
      <Tag
        // eslint-disable-next-line react/no-array-index-key
        key={key}
        style={{
          color: col.darken().css(),
          backgroundColor: col.alpha(0.1).css(),
          borderColor: col.css(),
          padding: ".2em",
          margin: ".2em",
        }}
      >
        {renderOption(opt)}
      </Tag>
    </Tooltip>
  );
}

function SubscriptionPanel(props: ISubPanelProps): JSX.Element {
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
        tooltip={`Category: ${props.title}`}
      />
    );
  }

  // Render a panel with multiple itesm under same category
  return (
    <Popover
      trigger="click"
      placement="bottom"
      title={props.title}
      content={
        <div style={{ maxWidth: "270px" }}>
          {props.ids.map((id: string) => {
            return (
              <SubscriptionItem
                id={id}
                dataType={props.dataType}
                tooltip="Click for more details."
              />
            );
          })}
        </div>
      }
    >
      <Tooltip
        placement="top"
        title={`Click to view list of subscribed ${props.title}`}
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
      </Tooltip>
    </Popover>
  );
}

export default function SubscriptionRow(props: ISubRowProps): JSX.Element {
  if (props.record) {
    return (
      <Space size="small" align="center">
        {props.record.activity_id && props.record.activity_id.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.activity_id}
            color="lightblue"
            title="Activities"
            ids={props.record.activity_id}
          />
        )}
        {props.record.experiment_id &&
          props.record.experiment_id.length > 0 && (
            <SubscriptionPanel
              dataType={FIELDS.experiment_id}
              color="lightblue"
              title="Experiments"
              ids={props.record.experiment_id}
            />
          )}
        {props.record.frequency && props.record.frequency.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.frequency}
            color="lightblue"
            title="Frequencies"
            ids={props.record.frequency}
          />
        )}
        {props.record.source_id && props.record.source_id.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.source_id}
            color="lightblue"
            title="Models"
            ids={props.record.source_id}
          />
        )}
        {props.record.realm && props.record.realm.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.realm}
            color="lightblue"
            title="Realms"
            ids={props.record.realm}
          />
        )}
        {props.record.variable_id && props.record.variable_id.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.variable_id}
            color="lightblue"
            title="Variables"
            ids={props.record.variable_id}
          />
        )}
      </Space>
    );
  }

  return (
    <div>
      <h1>Empty Record</h1>
    </div>
  );
}
