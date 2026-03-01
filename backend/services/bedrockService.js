require("dotenv").config();

const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generateExplanation(content) {
  const prompt = `
Explain this technical concept simply for a beginner:

${content}
`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0", // cheaper model 💰
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 300, // keeps cost LOW
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const response = await client.send(command);

  const responseBody = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  return responseBody.content[0].text;
}

module.exports = { generateExplanation };