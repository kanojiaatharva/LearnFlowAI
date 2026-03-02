async function fallbackLLM(content) {
  return `
[Prototype Mode Explanation]

Concept Summary:
${content.slice(0,200)}

Steps:
1. Identify main idea
2. Break into smaller concepts
3. Apply with examples
`;
}

module.exports = { fallbackLLM };