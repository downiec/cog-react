import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Radio,
  Menu,
  Dropdown,
  Table,
  Space,
} from "antd";
import React, { useState } from "react";
import { Freq, Subscription, FIELDS } from "../customTypes";

export interface ICurrentSubsProps {
  updateSubscriptions: (state: ICurrentSubsState) => Promise<void>;
  currentSubs: { [name: string]: Subscription };
}

export interface ICurrentSubsState {
  currentSubs: { [name: string]: Subscription };
  dataSource: {
    key: number;
    type: FIELDS;
    name: string;
    frequency: Freq;
  }[];
}

export default function ViewSubscriptions(
  props: ICurrentSubsProps
): JSX.Element {
  const subsToData = (newSubs: { [name: string]: Subscription }): any => {
    const newObjs = Object.keys(newSubs).map((subName: string) => {
      return {
        key: `${newSubs[subName].type}_${newSubs[subName].name}`,
        type: newSubs[subName].type,
        name: newSubs[subName].name,
        frequency: newSubs[subName].frequency,
      };
    });
    return newObjs;
  };

  const [state, setState] = useState<ICurrentSubsState>({
    currentSubs: props.currentSubs,
    dataSource: subsToData(props.currentSubs),
  });

  const updateDataSource = (newSubs: {
    [name: string]: Subscription;
  }): void => {
    setState({ currentSubs: newSubs, dataSource: subsToData(newSubs) });
    // props.updateSubscriptions(state);
  };

  const removeSub = (idx: string): void => {
    const newSubs = state.currentSubs;
    delete newSubs[idx];
    console.log(idx)
    console.log(newSubs)
    updateDataSource(newSubs);
  };

  const subTableColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "experiments",
          value: "experiments",
        },
        {
          text: "variables",
          value: "variables",
        },
        {
          text: "models",
          value: "models",
        },
      ],
      filterMultiple: false,
      onFilter: (value: any, record: any): boolean =>
        record.type.indexOf(value) === 0,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: any): JSX.Element => (
        <Space size="middle">
          <Button
            onClick={(): void => {
              removeSub(`${record.type}_${record.name}`);
            }}
          >
            {`Remove '${record.name}'`}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Divider>
        <Typography.Title level={2}>Current Subscriptions</Typography.Title>
      </Divider>
      <Table
        columns={subTableColumns}
        dataSource={state.dataSource}
        pagination={{ hideOnSinglePage: true }}
      />
    </Layout>
  );
}
