"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var uploadReport = require("./jira");
var SlackMessage = require("./slackMessage");

exports["default"] = function() {
  return {
    noColors: true,


    reportTaskStart: function reportTaskStart(
      startTime,
      userAgents,
      testCount
    ) {
      this.slack = new SlackMessage();

      this.startTime = startTime;
      this.testCount = testCount;
      this.userAgents = userAgents;
      this.slack.sendMessage(
        "*Starting TestCafe-Jira-reporter ---->* " + this.startTime
      );

      console.log("Start Time --> " + this.startTime);
      console.log("Browser Agent --> " + this.userAgents);

    },

    reportFixtureStart: function reportFixtureStart(name) {
      this.currentFixtureName = name;
      var slack = this.slack;

      console.log("Fixture Name --> " + this.currentFixtureName);

      setTimeout(function() {
        this.currentFixtureName = name ;
        slack.sendMessage("*"+this.currentFixtureName+"*")}, 1500);
    },

    reportTestDone: async function reportTestDone(name, testRunInfo) {
      var _this = this;
      var slack = this.slack;

      var hasErr = !!testRunInfo.errs.length;
      var arr = name.split(":");
      var sTestCaseID = this.currentFixtureName + ": " + arr[0];
      var sTestCaseDescription = arr[0];

      console.log("TestCase Id --> " + sTestCaseID);

      // avoid creating issues for skipped tests
      if (sTestCaseID.includes("TEST SKIPPED") || testRunInfo.skipped) {
        slack.addMessage("*SKIPPED:* " + sTestCaseID);
        return;
      }

      if (hasErr) {
        testRunInfo.errs.forEach(async function(err, idx) {
          // run only once for each test, not for each error
          if (idx != testRunInfo.errs.length - 1) {
            return;
          }

          console.log("Test Error --> " + _this.formatError(err));

          var msgToSend = await uploadReport.updateTestResult(
            sTestCaseID,
            "Fail",
            _this.formatError(err)
          );

          if (msgToSend != null) {
            slack.sendMessage(msgToSend);
          }
        });
      } else {
        console.log("Test is successful --> " + sTestCaseDescription);
        var msgToSend = await uploadReport.updateTestResult(
          sTestCaseID,
          "Pass"
        );

        if (msgToSend != null) {
          slack.sendMessage(msgToSend);
        }
      }
    },

    reportTaskDone: async function reportTaskDone(endTime, passed) {
      var slack = this.slack;
      var _this = this;
      var failed = _this.testCount - passed
      const time = this.moment(endTime).format('D/M/YYYY h:mm:ss a');

      console.log("End Time --> " + endTime);
      console.log("Total Pass --> " + passed + " / " + this.testCount);


      await new Promise(resolve => setTimeout(function() {
        slack.addMessage(
          "Total Pass --> " +
            passed +
            " / " +
            _this.testCount +
            "\n *TestCafe-Jira-reporter Done ---->* " +
            endTime
        );
        if (passed != _this.testCount) {
          slack.addMessage(
            "\n<!subteam^" + process.env.TESTCAFE_SLACK_USREGROUP_ID + "> Dear frontend team, there are *" +  failed + "* blocker tickets resulting from the latest test run on " + time + "."
          );
        }
        resolve(slack.sendMessage(slack.getSlackMessage()));
      }, 3000))}
  };
};

module.exports = exports["default"];
