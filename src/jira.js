"use strict";

var req = require("request");

require("dotenv").config();

function updateTestResult(TestCaseID, TestStatus, TestComment) {
  console.log("Jira User --> " + process.env.JIRA_USERNAME);
  console.log("Test Status --> " + TestStatus);
  var jiraInfo = {
    url:
      "https://" +
      process.env.JIRA_USERNAME +
      ":" +
      process.env.JIRA_PASSWORD +
      "@" +
      process.env.JIRA_BASE_URL +
      "/rest/api/2/issue/",
    method: "POST",
    json: {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_KEY
        },
        summary: TestCaseID,
        description: TestComment,
        issuetype: {
          name: JIRA_ISSUE_TYPE
        },
        customfield_11200: [
          {
            value: process.env.JIRA_CUSTOMER
          }
        ],
        priority: {
          name: process.env.JIRA_PRIORITY
        }
      }
    }
  };

  req(jiraInfo, function(error, response, body) {
    if (!error && response.statusCode === 200) console.log(response.statusCode);
  });
}
exports.updateTestResult = updateTestResult;
