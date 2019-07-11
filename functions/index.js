const functions = require("firebase-functions");
const request = require("request-promise");

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 9nSTcc5oCNvx8EAgV90RFzGokPOWjzyk2qy5Wr+6kGlUx+junfWlrTH9OP5JN2Q27OoIxvpLO5QxZClCb5Fu4/+iO1O+6JK10OwRmqE+B2RpkwLnjENHwH4JjhTXlB7JhtDe4mlkuQUNhkPx02mqCwdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0]
    if (event.type === "message" && event.message.type === "text") {
      postToDialogflow(req);
    } else {
      reply(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request.post({
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://bots.dialogflow.com/line/13dd6be0-9dac-49d9-8953-b28dda246b46/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};