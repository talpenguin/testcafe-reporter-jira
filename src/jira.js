"use strict";

var req = require("request");

require("dotenv").config();

function updateTestResult(TestCaseID, TestStatus, TestComment) {
  console.log("Jira User --> " + process.env.JIRA_USERNAME);
  console.log("Test Status --> " + TestStatus);

  //this  will run in case of reserved characters in testname and remove them
  if (/&|#/.test(TestCaseID)) {
    TestCaseID = TestCaseID.replace(/&|#/, "");
  }

  var jiraUrl =
    "https://" +
    process.env.JIRA_USERNAME +
    ":" +
    process.env.JIRA_PASSWORD +
    "@" +
    process.env.JIRA_BASE_URL +
    "/rest/api/2/";

  var getIssue = {
    url: jiraUrl + "search?jql=" + `summary~"\\"${TestCaseID}\\""`,
    method: "GET"
  };

  var postIssue = {
    url: jiraUrl + "issue/",
    method: "POST",
    json: {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_KEY
        },
        summary: TestCaseID,
        description: TestComment,
        issuetype: {
          name: process.env.JIRA_ISSUE_TYPE
        },
        customfield_11200: [
          {
            value: process.env.JIRA_CUSTOMER
          }
        ],
        priority: {
          name: process.env.JIRA_PRIORITY
        },
        components: [
          {
            name: process.env.JIRA_COMPONENT
          }
        ]
      }
    }
  };

  // get issue from Jira's API
  req(getIssue, function(error, response, body) {
    var bodyParse = JSON.parse(body);

    //issue exists- Updating
    if (bodyParse.issues.length > 0) {
      var issueKey = bodyParse.issues[0].key;
      var status = bodyParse.issues[0].fields.status.name;
      console.log("Issue Key ----------> " + issueKey);

      var putIssue = {
        url: jiraUrl + "issue/" + issueKey,
        method: "PUT",
        json: {
          fields: {
            description: TestComment
          }
        }
      };

      var openIssue = {
        url: jiraUrl + "issue/" + issueKey + "/transitions",
        method: "POST",
        body: { transition: { id: "41" } },
        json: true
      };

      var resolveIssue = {
        url: jiraUrl + "issue/" + issueKey + "/transitions",
        method: "POST",
        body: { transition: { id: "31" } },
        json: true
      };

      // test has failed
      if (TestStatus == "Fail") {
        //if issue already resolved- open it again && update
        if (status == "Resolved" || status == "Closed") {
          console.log("REOPENING A RESOLVED ISSUE");
          req(openIssue, function(error, response) {
            //update issue description after changing status
            req(putIssue, function(error, response) {});
          });
        }
        // issue not resolved- only update description
        else {
          req(putIssue, function(error, response) {});
        }
      }
      //test passed- resolve the issue
      else {
        if (status != "Resolved" && status != "Closed") {
          console.log("TEST PASSED- RESOLVING AN ISSUE");
          req(resolveIssue, function(error, response) {});
        }
      }
    }
    // issue doesn't exist and test failed- create a new one
    else {
      if (TestStatus == "Fail") {
        console.log("CREATING A NEW JIRA ISSUE");
        req(postIssue, function(error, response) {});
      }
    }
  });
}
exports.updateTestResult = updateTestResult;
