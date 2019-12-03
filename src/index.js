"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var uploadReport = require("./jira");

exports["default"] = function() {
  return {
    noColors: true,

    reportTaskStart: function reportTaskStart(
      startTime,
      userAgents,
      testCount
    ) {
      this.startTime = startTime;
      this.testCount = testCount;
      this.userAgents = userAgents;
      console.log("Start Time --> " + this.startTime);
      console.log("Browser Agent --> " + this.userAgents);
    },

    reportFixtureStart: function reportFixtureStart(name) {
      this.currentFixtureName = name;
      console.log("Fixture Name --> " + this.currentFixtureName);
    },

    reportTestDone: function reportTestDone(name, testRunInfo) {
      var _this = this;

      var hasErr = !!testRunInfo.errs.length;
      var arr = name.split(":");
      var sTestCaseID = this.currentFixtureName + ": " + arr[0];
      var sTestCaseDescription = arr[1];

      console.log("TestCase Id --> " + sTestCaseID);
      console.log("TestCase Description --> " + sTestCaseDescription);
      if (hasErr) {
        testRunInfo.errs.forEach(function(err, idx) {
          console.log(
            "Test Error --> " + _this.formatError(err, idx + 1 + ") ")
          );
          uploadReport.updateTestResult(
            sTestCaseID,
            "Fail",
            _this.formatError(err, idx + 1 + ") ")
          );
        });
      } else
        uploadReport.updateTestResult(
          sTestCaseID,
          "Pass",
          "Test is successful --> " + sTestCaseDescription
        );
    },

    reportTaskDone: function reportTaskDone(endTime, passed) {
      console.log("End Time --> " + endTime);
      console.log("Total Pass --> " + passed);
    }
  };
};

module.exports = exports["default"];