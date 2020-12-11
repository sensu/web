import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import properties from "highlight.js/lib/languages/properties";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("properties", properties);
hljs.registerLanguage("xml", xml);

onmessage = message => {
  const [language, data] = message.data.msg;
  const result = hljs.highlight(language, data);
  postMessage([message.data.key, result.value]);
};
