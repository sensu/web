import React from "/vendor/react";
import IntlRelativeFormat from "intl-relativeformat";
import { render } from "react-testing-library";

import RelativeDate from "./RelativeDate";

global.IntlRelativeFormat = IntlRelativeFormat;

test("RelativeDate given date seconds ago", () => {
  const now = new Date();
  const date = new Date(now.getTime() - 12000);
  const { container } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} />,
  );

  expect(container).toHaveTextContent("seconds ago");
});

test("RelativeDate given date seconds ahead", () => {
  const now = new Date();
  const date = new Date(now.getTime() + 6000);
  const { container } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} />,
  );

  expect(container).toHaveTextContent("in a few seconds");
});

test("RelativeDate given date that will occur in less than a minute", () => {
  const now = new Date();
  const date = new Date(now.getTime() + 20000);
  const { container } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} />,
  );

  expect(container).toHaveTextContent("in less than a minute");
});

test("RelativeDate given capitalize prop", () => {
  const now = new Date();
  const date = new Date(now.getTime() + 20000);
  const { container } = render(
    <RelativeDate to={now} dateTime={date.toUTCString()} capitalize />,
  );

  expect(container).toHaveTextContent("In less than a minute");
});
