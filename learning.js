'use strict';

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

let vocabulary = fs.readFileSync('vocabulary.txt', {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});
vocabulary = vocabulary.split('\n');
const VOCABULARY_SIZE = vocabulary[0].split(/\s/)[3];
//console.log(VOCABULARY_SIZE)
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
      //counter['UNK'] += 1;
    }
  }
}

for (let key in CLASSES) {
  writeOnFile('aprendizaje' + key[0] + '.txt', vocabulary, classCounter[CLASSES[key]].numberOfLines, classCounter[CLASSES[key]], classCounter[CLASSES[key]].numberOfWords);
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
  let numerator = frequency + 1;
  let denominator = Number(wordNumber) + Number(vocabularySize);
  // console.log(numerator)
 // console.log(Number(vocabularySize))
  return Math.log(numerator / denominator);
}
