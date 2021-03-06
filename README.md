# testcafe-reporter-testcafe-jira

This is the **Jira-reporter** plugin for [TestCafe](http://devexpress.github.io/testcafe).

## Install

```
npm install testcafe-reporter-testcafe-jira
```

## Usage

In order to use this TestCafe reporter plugin it is necessary to define .env variables at the root of your test project

Edit or create the .env file by adding the following required variables:

```
JIRA_BASE_URL=test.jira.com
JIRA_USERNAME=username
JIRA_PASSWORD=password
JIRA_PROJECT_KEY=key
JIRA_CUSTOMER=customer
JIRA_ISSUE_TYPE=issuetype
JIRA_PRIORITY=priority
JIRA_COMPONENT=component
```

Slack messages can be integrated as well by adding following variables to your .env file

```
TESTCAFE_SLACK_WEBHOOK=
TESTCAFE_SLACK_CHANNEL=
TESTCAFE_SLACK_USERNAME=
TESTCAFE_SLACK_LOGGING_LEVEL=
TESTCAFE_SLACK_USREGROUP_ID=
```

Transition id numbers in `jira.js` file might need to get modified, ss well as other values such as `customfield` according to your own Jira transition API.

When you run tests from the command line, specify the reporter name by using the `--reporter` or `-r` option:

```
testcafe chrome 'path/to/test/file.js' -r testcafe-jira
```

When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
  .createRunner()
  .src("path/to/test/file.js")
  .browsers("chrome")
  .reporter("testcafe-jira") // <-
  .run();
```

## Author

Tal Erez

Skeleton code used from [testcafe-reporter-jira-report](https://www.jsdelivr.com/package/npm/testcafe-reporter-jira-report)
