// node corpus-preprocessing.js ecom-train.csv preprocessed-corpus-test.txt 

'use strict';

const { WSAECONNREFUSED } = require('constants');
let fs = require('fs');

const PATH = process.argv[2]
const TRAIN_PATH = './train.csv';
const DEST_PATH = process.argv[3];
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

let data = fs.readFileSync(PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

let processedCorpus = [];
let category;
let categoriesLines = {      // lines
  'Electronics': 0,
  'Books': 0,
  'Clothing': 0,
  'Household': 0
};

let classesCounter = [];

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
  if (CLASSES.hasOwnProperty(category)) {
    categoriesLines[category] += 1;
  }
  for (let word of line) {
    word = word.toLowerCase();
    if (word === '') continue;
    if (RESERVEDWORDS.find(function(element) { return element == word; })) continue;
    if (NUMBER.test(word)) continue;
    if (URL.test(word)) continue;
    let wordObject;
    if (CLASSES.hasOwnProperty(category)) {     // significa que la categoria existe
        wordObject = {'word': word, 'category': category};
    } else {
      wordObject = {'word': word, 'category': 'unknown'};
    }
    processedCorpus.push(wordObject);
  }
}
processedCorpus = processedCorpus.sort(function(a, b) {
  return a['word'].localeCompare(b['word']);
});

let finalVocab = `Numero de palabras: ${processedCorpus.length}\n`;
for (let key in categoriesLines) {
  finalVocab += `${key} ${categoriesLines[key]}\n`;  
}
for (let object of processedCorpus) {
  finalVocab += object['word'] + ' ' + object['category'] + '\n';
}
//finalVocab -= finalVocab[finalVocab.length - 1];
fs.writeFileSync(DEST_PATH, finalVocab);
