# Deploying a Multi-Model and Multi-RAG Powered Chatbot Using AWS CDK on AWS

[![Full Documentation](https://img.shields.io/badge/Full%20Documentation-blue?style=for-the-badge&logo=Vite&logoColor=white)](https://aws-samples.github.io/aws-genai-llm-chatbot/)


## Local Frontend Setup

These instructions are designed for KAIP developers to get up and running for frontend development in this project.

### Node Version 16 or 18

To run this project you need to have node 16 or 18. You have two options
- Upgrade to node 18 manually
- Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and run `nvm install` or `nvm use` in the root folder.

### TypeScript

If you don't have TypeScript run
```shell
npm install -g typescript
```

### :rocket: Building Project
1. :vertical_traffic_light: Run the following commands in the root folder:
```shell
npm install
npm run build
curl https://d2ins6zcpv691t.cloudfront.net/aws-exports.json -o ./lib/user-interface/react-app/public/aws-exports.json
```
> [!Note]
> The curl command download the [ASW Export](https://d2ins6zcpv691t.cloudfront.net/aws-exports.json)
and save it to your local project.
2. :computer: Go to [AWS Cloud9](https://us-east-2.console.aws.amazon.com/cloud9control/home?region=us-east-2#/shared) and Open `sjdc-genAI-chatbot-demo` in the **Cloud9 IDE**.

1. :floppy_disk: After the Cloud9 IDE loads, download: \
   `/bin/config.json` \
   and save to: \
   `./bin/config.json`

1. :computer: From the root run the following commands:
```shell
cd lib/user-interface/react-app/
npm install
npm run build:dev
curl https://d2ins6zcpv691t.cloudfront.net/aws-exports.json -o ./public/aws-exports.json
npm run dev
```
> [!Note]
> I know we downloaded this already, but aws-exports.json gets overwritten with bad config data.

5. :tada: Enjoy!

---

## Embedding Standalone Chat-bot in website

### Embedding Demo Chat-bot

1. Open the [Chat Script Config](https://d2ins6zcpv691t.cloudfront.net/kai/common-ui/embed-chat.html) page.
1. Select all and copy the script.
1. In a new tab open one of the following:
    2. https://kaipartners.com
    3. https://www.deltacollege.edu
1. Open the developer tools in the web browser.
2. Make sure the Developer Tools **Console** is open.
3. Past the `chat.js` script into the developer console.

### Embedding Local Chat-bot

The local standalone chat-bot can be accessed at http://localhost:3000/embedded

Here is the JavaScript embed chat script http://localhost:3000/chat.js

To test out embedding the local chat-bot follow these steps:

1. Open ./lib/user-interface/react-app/public/chat.js
1. Change these two lines:
```javascript
iframe.setAttribute('src', 'https://d2ins6zcpv691t.cloudfront.net/embedded')
// iframe.setAttribute('src', 'http://localhost:3000/embedded')
```
to
```javascript
// iframe.setAttribute('src', 'https://d2ins6zcpv691t.cloudfront.net/embedded')
iframe.setAttribute('src', 'http://localhost:3000/embedded')
```
3. Start your local user-interface server.
1. Open the [chat.js](http://localhost:3000/chat.js) script.
1. Select all and copy the script.
1. In a new tab open one of the following:
    1. http://127.0.0.1:5173
    2. https://kaipartners.com
    3. https://www.deltacollege.edu
1. Open the developer tools in the web browser.
2. Make sure the Developer Tools **Console** is open.
3. Past the `chat.js` script into the developer console.

---


![sample](docs/about/assets/chabot-sample.gif "AWS GenAI Chatbot")

This solution provides ready-to-use code so you can start **experimenting with a variety of Large Language Models and Multimodal Language Models, settings and prompts** in your own AWS account.

Supported model providers:

- [Amazon Bedrock](https://aws.amazon.com/bedrock/)
- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) self-hosted models from Foundation, Jumpstart and HuggingFace.
- Third-party providers via API such as Anthropic, Cohere, AI21 Labs, OpenAI, etc. [See available langchain integrations](https://python.langchain.com/docs/integrations/llms/) for a comprehensive list.
