
# Get The Docs Document Engine - list document templates

[![Build](https://github.com/get-the-docs/docs-func-aws-template-list-v1/actions/workflows/build.yml/badge.svg)](https://github.com/get-the-docs/docs-func-aws-template-list-v1/actions/workflows/build.yml)
![Tests](https://github.com/get-the-docs/docs-func-aws-template-list-v1/workflows/Tests/badge.svg)
[![Sonar Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=get-the-docs_docs-func-aws-template-list-v1&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=get-the-docs_docs-func-aws-template-list-v1)
[![Codecov branch](https://img.shields.io/codecov/c/github/get-the-docs/get-the-docs_docs-func-aws-template-list-v1/master?label=Coverage)](https://codecov.io/gh/get-the-docs/get-the-docs_docs-func-aws-template-list-v1)

The project provides a docker container for a Lambda function for listing available templates to fill-in. 


## Local build

To compile the project locally some configuration settings are needed:

- **AWS S3 template repository**:

  What you will need:
  an AWS account and an S3 bucket.

  Add the below properties to the project configuration or shell as environment variables:

| Name                                                    | Description                                                       |
|---------------------------------------------------------|-------------------------------------------------------------------|
| REPOSITORY_TEMPLATE_PROVIDER_AWS_S3_BUCKETNAME          | Your test bucket's name                                           | 
| REPOSITORY_TEMPLATE_PROVIDER_AWS_S3_REGION              | Your test bucket's region                                         |
| REPOSITORY_TEMPLATE_PROVIDER_AWS_S3_PREFIX              | Your test bucket's prefix                                         |


Environment variables:

| Name                                                    | Description                                                       |
|---------------------------------------------------------|-------------------------------------------------------------------|
| AWS_ACCESS_KEY_ID                                       | The AWS access key id for a user having S3 object RW permissions. |
| AWS_SECRET_ACCESS_KEY                                   | The secret key for the access key id                              |


## Project tooling
Issue tracking: [Get-the-docs project @ Atlassian Jira](https://getthedocs.atlassian.net/jira/software/c/projects/GD/boards/1)
