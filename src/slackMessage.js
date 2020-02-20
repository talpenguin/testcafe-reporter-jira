class SlackMessage {
  constructor() {
    let slackNode = require("slack-node");
    this.slack = new slackNode();
    this.slack.setWebhook(process.env.TESTCAFE_SLACK_WEBHOOK);
    this.loggingLevel = process.env.TESTCAFE_SLACK_LOGGING_LEVEL;
    this.messages = [];
    this.errorMessages = [];
  }

  addMessage(message) {
    this.messages.push(message);
  }

  sendMessage(message, slackProperties = null) {
    this.slack.webhook(
      Object.assign(
        {
          channel: process.env.TESTCAFE_SLACK_CHANNEL,
          username: process.env.TESTCAFE_SLACK_USERNAME,
          text: message
        },
        slackProperties
      ),
      function(err, response) {
        console.log(`The following message is send to slack: \n ${message}`);
      }
    );
  }

  getSlackMessage() {
    return this.messages.join("\n");
  }
}

module.exports = SlackMessage;
