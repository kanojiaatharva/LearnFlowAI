const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

async function callLLM(prompt) {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const res = await client.send(command);
  const body = JSON.parse(new TextDecoder().decode(res.body));

  return body.content[0].text;
}

module.exports = { callLLM };