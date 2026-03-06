const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1"
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE = "learnflow-chat-history";

async function saveMessage(sessionId, role, text) {

  const item = {
    sessionId,
    timestamp: Date.now().toString(),
    role,
    text
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: item
    })
  );

}

async function getConversation(sessionId) {

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "sessionId = :s",
      ExpressionAttributeValues: {
        ":s": sessionId
      },
      ScanIndexForward: true
    })
  );

  return result.Items || [];
}

module.exports = {
  saveMessage,
  getConversation
};