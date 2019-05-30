declare module '@10xjs/date-input-controller' {
import * as React from 'react';

  export interface Fields {
    year: number;
    yearMin: number|null;
    yearMax: number|null;
    month: number;
    monthMin: number;
    monthMax: number;
    day: number;
    dayMin: number;
    dayMax: number;
    hour: number;
    hourMin: number;
    hourMax: number;
    minute: number;
    minuteMin: number;
    minuteMax: number;
    second: number;
    secondMin: number;
    secondMax: number;
  }


  export interface FieldActions {
    setYear(year: number|string): void;
    setMonth(month: number|string): void;
    setDay(day: number|string): void;
    setHour(hour: number|string): void;
    setMinute(minute: number|string): void;
    setSecond(second: number|string): void;
  }

  interface SetFields {
    year?: number|string;
    month?: number|string;
    day?: number|string;
    hour?: number|string;
    minute?: number|string;
    second?: number|string;
  }

  export interface State extends FieldActions, Fields {
    props: {value: Date; min?: Date; max?: Date; utc: boolean};
    value: Date;

    setFields(fields: SetFields): void;
  }

  export interface Props {
    value: Date;
    min?: Date;
    max?: Date;
    utc: boolean;
    onChange?: (date: Date) => void;
    children(state: State): React.ReactNode;
  }

  class DateInputController extends React.Component<Props, State> {
    public static defaultProps: {utc: boolean};
    public static getDerivedStateFromProps(props: Props, state: State):
        Partial<State>;

    public setYear(value: number): void;
    public setMonth(value: number): void;
    public setDay(value: number): void;
    public setHour(value: number): void;
    public setMinute(value: number): void;
    public setSecond(value: number): void;

    public setFields(fields: SetFields): void;
  }

  export default DateInputController;
}
