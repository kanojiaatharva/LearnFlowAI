const {
  BedrockRuntimeClient,
  ConverseCommand
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

async function callLLM(prompt) {

  const command = new ConverseCommand({
    modelId: "amazon.nova-2-lite-v1:0",

    messages: [
      {
        role: "user",
        content: [
          { text: prompt }
        ]
      }
    ],

    inferenceConfig: {
      maxTokens: 400,
      temperature: 0.7,
      topP: 0.9
    }

  });

  const response = await client.send(command);

  return response.output.message.content[0].text;
}

module.exports = { callLLM };