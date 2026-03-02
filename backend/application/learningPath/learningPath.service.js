function createLearningPath(goal) {
  return {
    goal,
    steps: [
      "Understand basics",
      "Practice examples",
      "Build mini project",
      "Advanced concepts"
    ]
  };
}

module.exports = { createLearningPath };