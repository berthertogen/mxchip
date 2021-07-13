const {
  apiUrl
} = require("./configuration");

function prettyJson(object) {
  return JSON.stringify(object, null, 6)
     .replace(/\n( *)/g, function (match, p1) {
         return '<br>' + '&nbsp;'.repeat(p1.length);
     });
}

async function receive() {
  const pre = document.body.getElementsByTagName("pre");
  fetch(`${apiUrl}/iot-events/10`)
  .then(response => response.json())
  .then(data => pre[0].innerHTML = `<code>${prettyJson(data)}</code>`);
}

receive();