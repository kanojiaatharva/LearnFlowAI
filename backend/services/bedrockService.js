const {
  BedrockRuntimeClient,
  ConverseCommand
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

async function generateExplanation(prompt) {
  try {

    const command = new ConverseCommand({
      modelId: "global.amazon.nova-2-lite-v1:0",

      messages: [
        {
          role: "user",
          content: [{ text: prompt }]
        }
      ],

      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.7,
        topP: 0.9
      }
    });

    const response = await client.send(command);

    return response.output.message.content[0].text;

  } catch (error) {

    console.error("Bedrock error:", error);
    throw error;

  }
}

module.exports = { generateExplanation };