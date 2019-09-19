var req = require("request");

require("dotenv").config();

function updateTestResult(TestCaseID, TestStatus, TestComment) {
  console.log("Jira User --> " + process.env.JIRA_USERNAME);
  var jiraInfo = {
    uri:
      "https://" +
      process.env.JIRA_USERNAME +
      ":" +
      process.env.JIRA_PASSWORD +
      "@" +
      process.env.JIRA_BASE_URL +
      "/rest/atm/1.0/testrun/" +
      process.env.JIRA_TEST_RUN +
      "/testcase/" +
      TestCaseID +
      "/testresult",
    method: "POST",
    json: {
      status: TestStatus,
      userKey: process.env.JIRA_USERNAME,
      scriptResults: [
        {
          index: 0,
          status: TestStatus,
          comment: TestComment
        }
      ]
    }
  };

  req(jiraInfo, function(error, response) {
    if (!error && response.statusCode === 200) console.log(response.statusCode);
  });
}
exports.updateTestResult = updateTestResult;
