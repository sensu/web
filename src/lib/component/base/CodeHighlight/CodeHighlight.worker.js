import hljs from "highlight.js/lib/highlight";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import properties from "highlight.js/lib/languages/properties";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("properties", properties);

onmessage = message => {
  const [language, data] = message.data.msg;
  const result = hljs.highlight(language, data);
  postMessage([message.data.key, result.value]);
};
