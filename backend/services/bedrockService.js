const {
  BedrockRuntimeClient,
  ConverseCommand
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

// store conversation history
let conversation = [];

async function chatWithNova(userMessage) {

  try {

    // add user message
    conversation.push({
      role: "user",
      content: [{ text: userMessage }]
    });

    const command = new ConverseCommand({

      modelId: "global.amazon.nova-2-lite-v1:0",

      messages: conversation,

      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.7,
        topP: 0.9
      }

    });

    const response = await client.send(command);

    const aiReply = response.output.message.content[0].text;

    // add assistant reply
    conversation.push({
      role: "assistant",
      content: [{ text: aiReply }]
    });

    return aiReply;

  } catch (error) {

    console.error("Bedrock error:", error);
    throw error;

  }
}

module.exports = { chatWithNova };