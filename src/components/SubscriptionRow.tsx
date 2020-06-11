import { Table, Button, Space } from "antd";
import React, { useState } from "react";
import { ValueType } from "react-select/src/types";
import { SelectorOption, isExperiment } from "../data/dataProvider";

export interface ISubRowProps {
  option: ValueType<SelectorOption<any>>;
}

export default function SubscriptionRow(props: ISubRowProps): JSX.Element {
  return <div><h1>Hello</h1></div>;
}
