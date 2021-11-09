import Convert from "ansi-to-html";
import { encodeXML } from "entities";

onmessage = message => {
  const [data] = message.data.msg;
  const convert = new Convert();
  postMessage([message.data.key, convert.toHtml(encodeXML(data))]);
};
