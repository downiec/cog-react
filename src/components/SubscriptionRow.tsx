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
        {props.record.activities && props.record.activities.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.activities}
            color="lightblue"
            title="Activities"
            ids={props.record.activities}
          />
        )}
        {props.record.experiments && props.record.experiments.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.experiments}
            color="lightblue"
            title="Experiments"
            ids={props.record.experiments}
          />
        )}
        {props.record.frequencies && props.record.frequencies.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.frequencies}
            color="lightblue"
            title="Frequencies"
            ids={props.record.frequencies}
          />
        )}
        {props.record.models && props.record.models.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.models}
            color="lightblue"
            title="Models"
            ids={props.record.models}
          />
        )}
        {props.record.realms && props.record.realms.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.realms}
            color="lightblue"
            title="Realms"
            ids={props.record.realms}
          />
        )}
        {props.record.variables && props.record.variables.length > 0 && (
          <SubscriptionPanel
            dataType={FIELDS.variables}
            color="lightblue"
            title="Variables"
            ids={props.record.variables}
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
