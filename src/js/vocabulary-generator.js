'use strict';

let fs = require('fs');

const PATH = process.argv[2];
const TRAIN_PATH = '../train.csv';
const DEST_PATH = '../vocabulario.txt';
const RESERVEDWORDS = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among',
'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot',
'could','dear','did','do','does','either','else','ever','every','from','get','got','had','has',
'have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just',
'least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of',
'off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so',
'some','than','that','the','their','them','then','there','these','they',
'this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while',
'who','whom','why','will','with','would','yet','you','your'];

if (process.argv[2] === '--help') {
  console.log('<Corpus entrada>');
  process.exit(0);
}

const NUMBER = /.*\d+.*/;
const URL = /^com$|^io$|^net$|^org$/;
const LINK = /(.+(\.eu|\.org|\.com|\.es|\.io|\.net|<\/|\.in|\.co).*)|^http.*|.*www.*/g;

let data = fs.readFileSync(PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});
// data = data.split(/\.$|\s|[\-,?!/():;&"']/);
data = data.split(/\s/);
for (let i = 0; i < data.length; i++) {
  data[i] = data[i].replace(LINK, '');
}
data = data.join();
data = data.split(/[^a-zA-Z0-9]/);
let vocabulary = [];
let dictionary = {};
for (let word of data) {
  word = word.toLowerCase();
  if (word === '') continue;
  if (RESERVEDWORDS.find(function(element) { return element == word; })) continue;
  if (NUMBER.test(word)) continue;
  if (URL.test(word)) continue;
  if (dictionary.hasOwnProperty(word)) continue;
  else  { 
    dictionary[word] = null;
    vocabulary.push(word);
  }
}
vocabulary.push('UNK');
vocabulary = vocabulary.sort();

let finalVocab = `Number of words: ${vocabulary.length}\n`;
for (let word of vocabulary) {
  finalVocab += word + '\n';
}
fs.writeFileSync(DEST_PATH, finalVocab);
