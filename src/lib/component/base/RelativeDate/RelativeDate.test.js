import React from "/vendor/react";
import IntlRelativeFormat from "intl-relativeformat";
import { render } from "react-testing-library";

import RelativeDate from "./RelativeDate";

global.IntlRelativeFormat = IntlRelativeFormat;

test("RelativeDate given date seconds ago", () => {
  const now = new Date();
  const date = new Date(now.getTime() - 12000);
  const { getByText } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} />,
  );

  expect(getByText("seconds ago"));
});

test("RelativeDate given date seconds ahead", () => {
  const now = new Date();
  const date = new Date(now.getTime() + 6000);
  const { getByText } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} />,
  );

  expect(getByText("in a few seconds"));
});

test("RelativeDate given date that will occur in less than a minute", () => {
  const now = new Date();
  const date = new Date(now.getTime() + 20000);
  const { getByText } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} />,
  );

  expect(getByText("in less than a minute"));
});

test("RelativeDate given capitalize prop", () => {
  const now = new Date();
  const date = new Date(now.getTime() + 20000);
  const { getByText } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} capitalize />,
  );

  expect(getByText("In less than a minute"));
});
