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

let data = fs.readFileSync(PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

let processedCorpus = [];
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
    let wordObject;
    if (CLASSES.hasOwnProperty(category)) {     // significa que la categoria existe
      wordObject = {'word': word, 'category': category};
    } else {
      wordObject = {'word': word, 'category': 'uknown'};
    }
    processedCorpus.push(wordObject);
  }
}
processedCorpus = processedCorpus.sort(function(a, b) {
  return a['word'].localeCompare(b['word']);
});

let finalVocab = `Number of words: ${processedCorpus.length}\n`;
for (let object of processedCorpus) {
  finalVocab += object['word'] + ' ' + object['category'] + '\n';
}
fs.writeFileSync(DEST_PATH, finalVocab);
