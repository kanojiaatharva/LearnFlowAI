const {
  BedrockRuntimeClient,
  ConverseCommand
} = require("@aws-sdk/client-bedrock-runtime");

const { saveMessage, getConversation } = require("./dynamoService");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

async function chatWithNova(sessionId, userMessage) {

  // store user message
  await saveMessage(sessionId, "user", userMessage);

  // fetch conversation history
  const history = await getConversation(sessionId);

  const messages = history.map(msg => ({
    role: msg.role,
    content: [{ text: msg.text }]
  }));

  const command = new ConverseCommand({

    modelId: "global.amazon.nova-2-lite-v1:0",

    messages,

    inferenceConfig: {
      maxTokens: 500,
      temperature: 0.7,
      topP: 0.9
    }

  });

  const response = await client.send(command);

  const aiReply = response.output.message.content[0].text;

  // store AI reply
  await saveMessage(sessionId, "assistant", aiReply);

  return aiReply;
}

module.exports = { chatWithNova };