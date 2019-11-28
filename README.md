# testcafe-reporter-jira

This is the **Jira-reporter** plugin for [TestCafe](http://devexpress.github.io/testcafe).

## Install

```
npm install testcafe-jira
```

## Usage

In order to use this TestCafe reporter plugin it is necessary to define .env variables at the root of your test project

- cd into your test project.
- Edit or create the .env file by adding the following required variables:

```

JIRA_BASE_URL=test.jira.com
JIRA_USERNAME=username
JIRA_PASSWORD=password
JIRA_PROJECT_KEY=key
JIRA_CUSTOMER=customer
JIRA_ISSUE_TYPE=issuetype
JIRA_PRIORITY=priority
```

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter jira
```

When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
  .createRunner()
  .src("path/to/test/file.js")
  .browsers("chrome")
  .reporter("jira") // <-
  .run();
```

## Author

Tal Erez
