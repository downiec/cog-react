import { Typography, Button, Divider, Table, Space, Modal } from "antd";
import React from "react";
import { Subscription } from "../customTypes";
import SubscriptionRow from "./SubscriptionRow";
import ErrorBoundary from "./ErrorBoundary";

const errorRender: JSX.Element = (
  <p>
    <h3>An error occured with this form.</h3>
  </p>
);

export interface ICurrentSubsProps {
  deleteSubscriptions: (subs: Subscription[]) => Promise<void>;
  currentSubs: Subscription[];
}

export interface ICurrentSubsState {
  currentSubs: Subscription[];
}

export default function ViewSubscriptions(
  props: ICurrentSubsProps
): JSX.Element {
  let deleteSub: Subscription | undefined;
  const removeSub = (id: number, timestamp: number): void => {
    if (id >= 0) {
      deleteSub = props.currentSubs.find((sub: Subscription) => {
        return sub.id === id;
      });
    } else {
      deleteSub = props.currentSubs.find((sub: Subscription) => {
        return sub.timestamp === timestamp;
      });
    }
    if (deleteSub !== undefined) {
      props.deleteSubscriptions([deleteSub]);
    }
  };

  const removeAllSubs = (): void => {
    Modal.error({
      title: "Notice",
      centered: true,
      okCancel: true,
      onOk: (): void => {
        props.deleteSubscriptions(props.currentSubs);
      },
      content: "Are you sure you wish to remove ALL of your subscriptions?",
    });
  };

  const subTableColumns = [
    { title: "id", dataIndex: "id", key: "id" },
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
              removeSub(record.id, record.timestamp);
            }}
          >
            Unsubscribe
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = props.currentSubs.map((sub: Subscription) => {
    return { ...sub, key: sub.timestamp };
  });

  return (
    <ErrorBoundary errorRender={errorRender}>
      <Divider>
        <Typography.Title level={3}>Current Subscriptions</Typography.Title>
      </Divider>
      <Button onClick={removeAllSubs} type="primary" danger>
        Unsubscribe All
      </Button>
      <Table
        columns={subTableColumns}
        dataSource={dataSource}
        pagination={{ hideOnSinglePage: true }}
      />
    </ErrorBoundary>
  );
}
