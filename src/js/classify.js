'use strinct';

let fs = require('fs');

if (process.argv[2] === '--help') {
  console.log('<Fichero a clasificar> <(opcional) Codigo del usuario>');
  process.exit(0);
}

let data = fs.readFileSync(process.argv[2], {encoding: 'utf8'}, function(err) {
  if (err) {
    throw new Error('Unable to read file');
  }
});
data = data.split(/\n/);

const categories = ['H', 'B', 'C', 'E'];
let categoriesHashes = [];

for (let category of categories) { // vamos a crear una hash con la prob de las palabras para todas las categorias
  let aprendizaje = fs.readFileSync('../aprendizaje' + category + '.txt', {encoding: 'utf8'}, function(err) {
    if (err) {
      throw new Error('Unable to read file');
    }
  });
  aprendizaje = aprendizaje.split(/\n/);
  let hash = {};
  for (let line of aprendizaje) {
    linesplittedLine = line.split(/\s/);
    hash[linesplittedLine[1]] = linesplittedLine[5];
  }
  categoriesHashes.push(hash);
}

let finalData = '';
let summary = 'codigo: ';
summary += (process.argv[3]) ? process.argv[3] : 'sin definir';
summary += '\n'; 

for (let line of data) {
  if (line == '') continue;
  splittedLine  = line.split(/[^a-zA-Z0-9]/);
  let categoriesProb = [];
  for (let i = 0; i < categoriesHashes.length; i++) {
    let prob = 0;
    for (let word of splittedLine) {
      if (word === '') continue;
      word = word.toLowerCase();
      if (!categoriesHashes[i].hasOwnProperty(word)) {
        prob += Number(categoriesHashes[i]['UNK']);
      } else {
        prob += Number(categoriesHashes[i][word]);
      }
    } 
    categoriesProb.push(prob.toFixed(2));
  }
  finalData += line + ',';
  categoriesProb.forEach(element => {
    finalData += element + ',';
  });
  finalData += categories[bestCategory(categoriesProb)] + '.\n';
  summary += categories[bestCategory(categoriesProb)] + '\n'
}

fs.writeFileSync('../clasificacion_alu0101240374.csv', finalData, function(err) {
  if (err) {
    throw new Error('Unable to write file');
  }
});

fs.writeFileSync('../resumen_alu0101240374.csv', summary, function(err) {
  if (err) {
    throw new Error('Unable to write file');
  }
});

function bestCategory(probabilitiesVector) {
  let best = probabilitiesVector[0];
  let index = 0;
  for (let i = 1; i < probabilitiesVector.length; i++) {
    if (Number(probabilitiesVector[i]) > Number(best)) {
      best = probabilitiesVector[i];
      index = i;
    }
  }
  return index;
}