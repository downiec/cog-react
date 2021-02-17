/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Typography,
  Button,
  Divider,
  Table,
  Space,
  Modal,
  Tooltip,
  Form,
} from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
// eslint-disable-next-line
import React from 'react';
import { Subscription } from '../modules/types';
import SubscriptionRow from './Subscription/SubscriptionRow';
import ErrorBoundary from './ErrorBoundary';

const errorRender: JSX.Element = (
  <p>
    <h3>An error occured with this form.</h3>
  </p>
);

export interface ICurrentSubsProps {
  deleteSubscriptions: ((subs: Subscription[]) => Promise<void>)
  | ((subs: Subscription[]) => void);
  currentSubs: Subscription[];
}

export interface ICurrentSubsState {
  currentSubs: Subscription[];
}

export default function ViewSubscriptions(
  props: ICurrentSubsProps
): JSX.Element {
  let deleteSub: Subscription | undefined;
  const removeSub = (id: number | string, timestamp: number): void => {
    // Remove using id if it is valid (string or number)
    if ((typeof id === 'string' && id !== "") || (typeof id === 'number' && id >= 0)) {
      deleteSub = props.currentSubs.find((sub: Subscription) => {
        return sub.id === id;
      });
      // If no ide, then subscription exists only in front-end, remove using timestamp
    } else {
      deleteSub = props.currentSubs.find((sub: Subscription) => {
        return sub.timestamp === timestamp;
      });
    }
    if (deleteSub !== undefined) {
      props.deleteSubscriptions([deleteSub]);
    }
  };

  function renderTitle(title: string, tooltip: string): () => JSX.Element {
    return (): JSX.Element => {
      return (
        <h4 style={{ margin: 0, padding: 0 }}>
          {title}
          {tooltip !== '' ? (
            <Tooltip placement="top" title={tooltip}>
              <QuestionCircleTwoTone
                translate="no"
                style={{
                  fontSize: '0.9em',
                  verticalAlign: 'top',
                  margin: '5px',
                }}
              />
            </Tooltip>
          ) : null}
        </h4>
      );
    };
  }

  const removeAllSubs = (): void => {
    Modal.error({
      title: 'Notice',
      centered: true,
      okCancel: true,
      onOk: (): void => {
        props.deleteSubscriptions(props.currentSubs);
      },
      content: 'Are you sure you wish to remove ALL of your subscriptions?',
    });
  };

  const subTableColumns = [
    {
      title: renderTitle('ID', ''),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: renderTitle(
        'Period',
        'The frequency for subscription notifications. Click the filter icon to filter subscriptions by period.'
      ),
      dataIndex: 'period',
      key: 'period',
      filters: [
        {
          text: 'daily',
          value: 'daily',
        },
        {
          text: 'weekly',
          value: 'weekly',
        },
        {
          text: 'biweekly',
          value: 'biweekly',
        },
        {
          text: 'monthly',
          value: 'monthly',
        },
      ],
      filterMultiple: true,
      onFilter: (value: any, record: Subscription): boolean =>
        record.period.indexOf(value) === 0,
    },
    {
      title: renderTitle(
        'Name',
        '(Optional) The name used to identify the subscription.'
      ),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: renderTitle(
        'Selections',
        'You can click an item below to view more information for that subscription item.'
      ),
      dataIndex: 'selections',
      key: 'selections',
      render: (text: string, record: Subscription): JSX.Element => {
        return <SubscriptionRow record={record} />;
      },
    },
    {
      title: renderTitle('Actions', ''),
      key: 'action',
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
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="CreateSubscriptions"
        style={{ minHeight: '1024px' }}
      >
        <Divider>
          <Typography.Title level={3}>Current Subscriptions</Typography.Title>
        </Divider>
        <Button onClick={removeAllSubs} type="primary" danger>
          Unsubscribe All
        </Button>
        <Table
          size="large"
          scroll={{ x: true, scrollToFirstRowOnChange: true }}
          columns={subTableColumns}
          dataSource={dataSource}
          pagination={{ hideOnSinglePage: true }}
        />
      </Form>
    </ErrorBoundary>
  );
}
