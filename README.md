Para aprendizaje:
node create-corpus-train-test.js ../ecom-train.csv
node vocabulary-generator.js ../train.csv
node corpus-preprocessing.js ../train.csv ../preprocessed-corpus.txt
node learning.js ../preprocessed-corpus.txt

test:
node preprocess-corpus-test.js ../test.csv ../test.txt
node classify.js ../test.txt
node check-accuracy.js ../ecom-train.csv ../clasificacion_alu0101240374.csv 
el tamaño de train se cambia desde check accuracy y create test-train