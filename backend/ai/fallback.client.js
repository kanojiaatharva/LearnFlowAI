async function fallbackLLM(content) {
  return `
[Prototype AI Mode]

Explanation:
${content.slice(0,200)}

Steps:
1. Identify core idea
2. Break into components
3. Apply practically
`;
}

module.exports = { fallbackLLM };