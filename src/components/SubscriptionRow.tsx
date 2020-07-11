import { Tag, Button, Space, Popover } from "antd";
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

function SubscriptionPanel(props: ISubPanelProps): JSX.Element {
  if (props.ids.length === 0) {
    return <div />;
  }
  const color: chromaJs.Color = chromaJs(props.color);
  return (
    <Popover
      trigger="click"
      placement="bottom"
      title={props.title}
      content={
        <div style={{ maxWidth: "270px" }}>
          {props.ids.map((id: string) => {
            const opt: SelectorOption<any> = getOptionItem(props.dataType, id);
            const col: chromaJs.Color = chromaJs(opt.color);
            const key = `${props.dataType}_${id}`;

            return (
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
        {props.record.experiment_id && props.record.experiment_id.length > 0 && (
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
