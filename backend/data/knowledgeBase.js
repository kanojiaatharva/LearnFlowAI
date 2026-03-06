const store = [];

function saveExplanation(exp) {
  store.push(exp);
}

function getAll() {
  return store;
}

module.exports = { saveExplanation, getAll };