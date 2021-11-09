/* eslint-disable react/prop-types */

import React from "/vendor/react";
import Worker from "./ANSIColor.worker";

const worker = new Worker();
const pending = {};

worker.onmessage = event => {
  const [key, data] = event.data;
  pending[key].call(this, data);
};

let idx = 0;
function postMessage(msg, callback) {
  const key = idx;
  pending[idx] = data => {
    callback(data);
    delete pending[idx];
  };
  worker.postMessage({ key, msg });
  idx += 1;
}

const ANSIColor = ({ children, ...other }) => {
  const [result, setResult] = React.useState({ value: "", processed: false });
  React.useEffect(() => {
    postMessage([children], result => {
      setResult({ value: result, processed: true });
    });
  }, [children, setResult]);

  return <code dangerouslySetInnerHTML={{ __html: result.value }} {...other} />;
};

export default ANSIColor;
