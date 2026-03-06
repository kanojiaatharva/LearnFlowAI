const cosineSimilarity = require("cosine-similarity");

const vectors = [];

function storeVector(text, embedding) {

  vectors.push({
    text,
    embedding
  });

}

function searchSimilar(queryEmbedding, topK = 3) {

  const scored = vectors.map(v => ({

    text: v.text,

    score: cosineSimilarity(queryEmbedding, v.embedding)

  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);

}

module.exports = {
  storeVector,
  searchSimilar
};