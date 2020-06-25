import { Typography, Button, Divider, Table, Space } from "antd";
import React, { useState } from "react";
import { Subscription } from "../customTypes";
import SubscriptionRow from "./SubscriptionRow";
import ErrorBoundary from "./ErrorBoundary";

const errorRender: JSX.Element = (
  <p>
    <h3>An error occured with this form.</h3>
  </p>
);

export interface ICurrentSubsProps {
  updateSubscriptions: (state: ICurrentSubsState) => Promise<void>;
  currentSubs: Subscription[];
}

export interface ICurrentSubsState {
  currentSubs: Subscription[];
}

export default function ViewSubscriptions(
  props: ICurrentSubsProps
): JSX.Element {
  const [state, setState] = useState<ICurrentSubsState>({
    currentSubs: props.currentSubs,
  });

  const updateDataSource = (newSubs: Subscription[]): void => {
    setState({ currentSubs: newSubs });
    props.updateSubscriptions({ currentSubs: newSubs });
  };

  const removeSub = (timestamp: number): void => {
    const newSubs = state.currentSubs.filter((sub: Subscription) => {
      return sub.timestamp !== timestamp;
    });
    updateDataSource(newSubs);
  };

  const subTableColumns = [
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      filters: [
        {
          text: "daily",
          value: "daily",
        },
        {
          text: "weekly",
          value: "weekly",
        },
        {
          text: "biweekly",
          value: "biweekly",
        },
        {
          text: "monthly",
          value: "monthly",
        },
      ],
      filterMultiple: true,
      onFilter: (value: any, record: Subscription): boolean =>
        record.period.indexOf(value) === 0,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Selections",
      dataIndex: "selections",
      key: "selections",
      render: (text: string, record: Subscription): JSX.Element => {
        return <SubscriptionRow record={record} />;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: Subscription): JSX.Element => (
        <Space size="small">
          <Button
            onClick={(): void => {
              removeSub(record.timestamp);
            }}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = state.currentSubs.map((sub: Subscription) => {
    return { ...sub, key: sub.timestamp };
  });

  return (
    <ErrorBoundary errorRender={errorRender}>
      <Divider>
        <Typography.Title level={3}>Current Subscriptions</Typography.Title>
      </Divider>
      <Table
        columns={subTableColumns}
        dataSource={dataSource}
        pagination={{ hideOnSinglePage: true }}
      />
    </ErrorBoundary>
  );
}
