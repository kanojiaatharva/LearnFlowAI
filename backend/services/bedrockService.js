const {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand
} = require("@aws-sdk/client-bedrock-runtime");

const { saveMessage, getConversation } = require("./dynamoService");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});



/*
--------------------------------------------------
NORMAL CHAT (Used by /api/explain)
--------------------------------------------------
Returns full response as text
--------------------------------------------------
*/

async function chatWithNova(sessionId, userMessage) {

  try {

    const messages = [
      {
        role: "user",
        content: [{ text: userMessage }]
      }
    ];

    const command = new ConverseCommand({
      modelId: "global.amazon.nova-2-lite-v1:0",
      messages,
      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.7
      }
    });

    const response = await client.send(command);

    const text = response.output.message.content[0].text;

    return text;

  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}



/*
--------------------------------------------------
STREAMING CHAT (Used by /api/qa)
--------------------------------------------------
Streams response word-by-word
--------------------------------------------------
*/

async function streamChatWithNova(sessionId, userMessage, res) {

  try {

    // Save user message
    await saveMessage(sessionId, "user", userMessage);

    // Get conversation history
    const history = await getConversation(sessionId);

    const messages = history.map(msg => ({
      role: msg.role,
      content: [{ text: msg.text }]
    }));

    const command = new ConverseStreamCommand({
      modelId: "global.amazon.nova-2-lite-v1:0",
      messages,
      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.7
      }
    });

    const response = await client.send(command);

    let fullText = "";

    for await (const chunk of response.stream) {

      if (chunk.contentBlockDelta?.delta?.text) {

        const text = chunk.contentBlockDelta.delta.text;

        fullText += text;

        res.write(text); // stream to frontend

      }

    }

    // Save assistant response
    await saveMessage(sessionId, "assistant", fullText);

    res.end();

  } catch (error) {

    console.error("Streaming error:", error);
    res.status(500).end();

  }

}



module.exports = {
  chatWithNova,
  streamChatWithNova
};