'use strict';

const { WSAECONNREFUSED } = require('constants');
let fs = require('fs');

const PATH = './ecom-train.csv';
const TRAIN_PATH = './train.csv';
const DEST_PATH = './preprocessed-corpus.txt';
const RESERVEDWORDS = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among',
'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot',
'could','dear','did','do','does','either','else','ever','every','from','get','got','had','has',
'have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just',
'least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of',
'off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so',
'some','than','that','the','their','them','then','there','these','they',
'this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while',
'who','whom','why','will','with','would','yet','you','your'];


const NUMBER = /.*\d+.*/;
const URL = /^com$|^io$|^net$|^org$/;
const LINK = /(.+(\.eu|\.org|\.com|\.es|\.io|\.net|<\/|\.in|\.co).*)|^http.*|.*www.*/g;

const CLASSES = {
  'Electronics': 0,
  'Books': 1,
  'Clothing': 2,
  'Household': 3
};

let data = fs.readFileSync(TRAIN_PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

let vocabulary = [];
let counter = {};
let category;

let classesCounter = [];

for (let key in CLASSES) {
  let newCounter = {};
  classesCounter.push(newCounter);
}

data = data.split(/\r?\n/);
let lineNumber = data.length;
for (let line of data) {
  line = line.split(/\s/);
  for (let i = 0; i < line.length; i++) {
    line[i] = line[i].replace(LINK, '');
  }
  line = line.join();
  line  = line.split(/[^a-zA-Z0-9]/);
  category = line[0];
  for (let word of line) {
    word = word.toLowerCase();
    if (word === '') continue;
    if (RESERVEDWORDS.find(function(element) { return element == word; })) continue;
    if (NUMBER.test(word)) continue;
    if (URL.test(word)) continue;
    if (CLASSES.hasOwnProperty(category)) {     // significa que la categoria existe
      if (classesCounter[CLASSES[category]].hasOwnProperty(word)) {
        classesCounter[CLASSES[category]][word] += 1;
      } else {
        classesCounter[CLASSES[category]][word] = 1;
      }
    }
    if (counter.hasOwnProperty(word)) {
      counter[word] += 1;
    } else  {
      counter[word] = 1;
      vocabulary.push(word);
    }
  }
}
vocabulary = vocabulary.sort();

let wordNumber = counter.length;

let finalVocab = `Number of words: ${vocabulary.length}\n`;
for (let word of vocabulary) {
  finalVocab += word + '\n';
}
fs.writeFileSync(DEST_PATH, JSON.stringify(counter, null, 2));

function countertoString(vocabulary, lineNumber, classCounter) { // en esta función imprimiremos un fichero de aprendizaje 
  let finalString = '';
  finalString = 'Número de documentos del corpus: ' + lineNumber + '\n';
  finalString += 'Número de palabras del corpus:' + wordNumber + '\n';
  for (item of vocabulary) {
    if (!classCounter.hasOwnProperty(word))
    let frecuency = classCounter[item];
    finalString += 'Palabra: ' + item + 'Frec: ' + frecuency;
  }
}