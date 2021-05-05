'use strict';

const VOCABULARY_SIZE = process.argv[2];

const { WSAECONNREFUSED } = require('constants');
let fs = require('fs');

const PATH = './preprocessed-corpus.txt';
const DEST_PATH = './learning-file.txt';

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

let vocabulary = [];
let counter = {};
let category;

let classesCounter = [];

for (let key in CLASSES) {
  let newCounter = {lines: 0};
  classesCounter.push(newCounter);
}

data = data.split(/\r?\n/);
for (let i = 0; i < Object.keys(CLASSES).length; i++) {
  let line = data[i + 1].split(/\s/);
  classesCounter[CLASSES[line[0]]].lines = line[1];
}
// console.log(data[2])
// data = data.splice(1, Object.keys(CLASSES).length - 1);

for (let line of data) {
  line = line.split(/\s/);
  category = line[1];
  if (CLASSES.hasOwnProperty(category)) {     // significa que la categoria existe
    if (classesCounter[CLASSES[category]].hasOwnProperty(line[0])) {
      classesCounter[CLASSES[category]][line[0]] += 1;
    } else {
      classesCounter[CLASSES[category]][line[0]] = 1;
    }
  }
  if (counter.hasOwnProperty(line[0])) {
    counter[line[0]] += 1;
  } else  {
    counter[line[0]] = 1;
    vocabulary.push(line[0]);
  }
}

vocabulary = vocabulary.sort();

for (let key in CLASSES) {
  writeOnFile('aprendizaje' + key[0] + '.txt', vocabulary, classesCounter[CLASSES[key]].lines, classesCounter[CLASSES[key]], Object.keys(classesCounter[CLASSES[key]]).length);
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

function computeProb(vocabularySize, frequency, wordNumber) {
  let prob = 0;
  let numerator = frequency + 1;
  let denominator = wordNumber + vocabularySize;
  return Math.log(numerator / denominator);
}
