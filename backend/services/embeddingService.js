const {
  BedrockRuntimeClient,
  InvokeModelCommand
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

async function generateEmbedding(text) {

  const command = new InvokeModelCommand({

    modelId: "amazon.titan-embed-text-v1",

    body: JSON.stringify({
      inputText: text
    }),

    contentType: "application/json",
    accept: "application/json"

  });

  const response = await client.send(command);

  const body = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  return body.embedding;
}

module.exports = { generateEmbedding };