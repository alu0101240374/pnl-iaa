let fs = require('fs');

if (process.argv[2] === '--help') {
  console.log('<Corpus test original> <Fichero clasificacion>');
  process.exit(0);
}

const TRAIN_SIZE = 0.7;
const TEST_SIZE = 1 - TRAIN_SIZE;

const CORPUS_PATH = process.argv[2];
const CLASSIFIED_PATH = process.argv[3];

let corpus = fs.readFileSync(CORPUS_PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

let classified = fs.readFileSync(CLASSIFIED_PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

corpus = corpus.split(/\n/);
classified = classified.split(/\n/);

let correct = 0;

let j = 1;
for (let i = corpus.length * TRAIN_SIZE - 1; i < corpus.length; i++) {
  if (corpus[i][0] === classified[j][0]) {
    correct++;
  }
  j++;
}
console.log(correct / (corpus.length - (corpus.length * TRAIN_SIZE - 1)) * 100);
