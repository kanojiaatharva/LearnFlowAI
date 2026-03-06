function createLearningPath(goal) {
  return {
    goal,
    steps: [
      "Basics",
      "Core Concepts",
      "Practice",
      "Mini Project",
      "Advanced Topics"
    ]
  };
}

module.exports = { createLearningPath };