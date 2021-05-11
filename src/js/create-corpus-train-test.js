let fs = require('fs');

if (process.argv[2] === '--help') {
  console.log('<Corpus a crear train y test>');
  process.exit(0);
}

const TRAIN_SIZE = 0.70;
const PATH = process.argv[2];

let data = fs.readFileSync(PATH, {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});

let train = '';
data = data.split(/\n/);
let i = 0;
for (i; i < data.length * TRAIN_SIZE - 1; i++) {
  train += data[i] + '\n';
}

fs.writeFileSync('../train.csv', train);

let test = '';
for (i; i < data.length; i++) {
  let splittedLine = data[i].split(/[^a-zA-Z0-9]/);
  splittedLine.splice(0,1) + '\n';
  splittedLine = splittedLine.join(' ');
  test += splittedLine + '\n';
}

fs.writeFileSync('../test.csv', test);

