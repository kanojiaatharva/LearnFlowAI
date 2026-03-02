const users = {};

function assessSkill(userId) {
  if (!users[userId]) {
    users[userId] = { level: "beginner" };
  }
  return users[userId];
}

module.exports = { assessSkill };