import React from 'react';
import { Space } from 'antd';
import { Subscription, FIELDS } from '../../modules/types';
import SubscriptionPanel from './SubscriptionPanel';

interface ISubRowProps {
  record: Subscription;
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
