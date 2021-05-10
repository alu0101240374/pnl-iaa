'use strict';

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

let finalData = '';

data = data.split(/\r?\n/);
for (let line of data) {
  line = line.split(/\s/);
  for (let i = 0; i < line.length; i++) {
    line[i] = line[i].replace(LINK, '');
  }
  line = line.join();
  line  = line.split(/[^a-zA-Z0-9]/);
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '') {
      delete line[i];
      continue;
    }
    line[i] = line[i].toLowerCase();
    if (line[i] === '') {
      delete line[i];
      continue;
    }
    if (RESERVEDWORDS.find(function(element) { return element == line[i]; })) {
      delete line[i];
      continue;
    } 
    if (NUMBER.test(line[i])) {
      delete line[i];
      continue;
    }
    if (URL.test(line[i])) {
      delete line[i];
      continue;
    };
  }
  line = line.join(' ');
  finalData += line + '\n';
}

fs.writeFileSync(DEST_PATH, finalData);
