'use strict';

let fs = require('fs');

if (process.argv[2] === '--help') {
  console.log('<Corpus preprocesado>');
  process.exit(0);
}

const PATH = process.argv[2];
const DEST_PATH = '../learning-file.txt';

const CLASSES = {
  'Electronics': 0,
  'Books': 1,
  'Clothing': 2,
  'Household': 3
};

let data = fs.readFileSync(PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

let vocabulary = fs.readFileSync('../vocabulario.txt', {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});
vocabulary = vocabulary.split('\n');
const VOCABULARY_SIZE = vocabulary[0].split(/\s/)[3];
let category;

let classCounter = [];

for (let key in CLASSES) {
  let newCounter = {numberOfLines: 0, numberOfWords: 0};
  classCounter.push(newCounter);
}

for (let word of vocabulary) {
  for (let counter of classCounter) {
    counter[word] = 0;
  }
}

let totalDocuments = 0;
data = data.split(/\r?\n/);
for (let i = 0; i < Object.keys(CLASSES).length; i++) {
  let line = data[i + 1].split(/\s/);
  classCounter[CLASSES[line[0]]].numberOfLines = line[1];
}


for (let line of data) {
  line = line.split(/\s/);
  category = line[1];
  if (CLASSES.hasOwnProperty(category)) {     // significa que la categoria existe
    if (classCounter[CLASSES[category]].hasOwnProperty(line[0])) {
      classCounter[CLASSES[category]]['numberOfWords'] += 1;
      classCounter[CLASSES[category]][line[0]] += 1;
    }
  }
}

for (let word of vocabulary) {
  for (let counter of classCounter) {
    if (counter[word] == 0) {
      if (word !== 'UNK') {
        delete counter[word];
      }
    }
  }
}

for (let key in CLASSES) {
  const CLASS_FREQUENCY = classCounter[CLASSES[key].numberOfLines]
  writeOnFile('../aprendizaje' + key[0] + '.txt', vocabulary, classCounter[CLASSES[key]].numberOfLines, classCounter[CLASSES[key]], classCounter[CLASSES[key]].numberOfWords, totalDocuments);
}

function countertoString(vocabulary, lineNumber, classCounter, wordNumber) { // en esta función imprimiremos un fichero de aprendizaje 
  let finalString = '';
  finalString = 'Número de documentos del corpus: ' + lineNumber + '\n';
  finalString += 'Número de palabras del corpus: ' + wordNumber + '\n';
  for (let item of vocabulary) {
    if (!classCounter.hasOwnProperty(item)) continue;
    let frequency = classCounter[item];
    let probability = computeProb(VOCABULARY_SIZE, frequency, wordNumber);
    finalString += 'Palabra: ' + item + ' Frec: ' + frequency + ' LogProb: ' + probability + '\n';
  }
  return finalString;
}

function writeOnFile(fileName, vocabulary, lineNumber, classCounter, wordNumber) {
  let finalString = countertoString(vocabulary, lineNumber, classCounter, wordNumber);
  fs.writeFileSync(fileName, finalString);
}

function computeProb(vocabularySize, frequency, wordNumber, classFrequency) {
  let numerator = frequency + 1;
  let denominator = Number(wordNumber) + Number(vocabularySize);
  return Math.log(numerator / denominator);
}
