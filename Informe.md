# Informe - Clasificación de textos en lenguaje natural

_Gabriel García Jaubert_

GitHub: https://github.com/alu0101240374/pnl-iaa.git

```
Lenguaje escogido: JavaScript
```

## Preprocesamiento

Para preprocesar el vocabulario no se llevaron a cabo tareas muy complejas como lematización o truncamiento. Los cambios que se efectuaron fueron:  
- Pasar a minúsculas.  
- Eliminación de signos de puntiación.
- Eliminación de palabras reservadas.
- Eliminación de emojis y emoticonos o su conversión a palabras.
- Eliminación de URLs, etiquetas HTML, hashtags.

Para la mayoría de esas tareas se usaron diferentes expresiones regulares, y si casaban con algún elemento, se eliminaba el elemento en cuestión.  

## Librerías utilizadas

Las únicas librerías utilizadas ha sido 'fs' para leer y escribir en ficheros.

## Implementación de los programas

Abarcar toda la implementación sería una tarea muy costosa, es por ello que veremos un pequeó resumen de las estructuras de datos más importantes usadas.  
La parte más importante en mi opinión es la utilización de diccionarios para que el timepo de búsqueda de una palabra sea constante. De esa manera sabemos si por ejemplo ya hemos añadido una palabra o si queremos definir el número de veces que aparece, pues el tiempo se reduce a si estuviera en un vector donde tenemos que buscarla. Para navegar por los ficheros se utiliza el método split() que permite dividir una cadena según una regexp que le introduzcamos al método como parámetro. Por ejempo: _data.split(/\s/)_

## Error sobre el corpus de entrenamiento

Para comprobar la efectividad se dividió el corpus de entrenamiento en un 70% para entrenar, y un 30% para test. El resultado fue de un 93.98% de acierto.  

## Programas y ficheros pedidos

En el directorio /js se encuentran todos los códigos en javaScript:
* check-accuracy.js: Calcula la precisión de la clasificación respecto al corpus original
* classify.js: Clasifica un texto
* corpus-preprocessing.js: Preprocesa el corpus  
* create-corpus-train-test.js: Divide un corpus en train y test
* learning.js: Aprende dado un corpus preprocesado
* preprocess-corpus-test.js: Preprocesa un corpus para análisis manteniendo el formato original
* vocabulary-generator.js: Genera un vocabulario a raíz de un corpus preprocesado.

Ficheros obligatorios:
* ecom-train.csv
* vocabulario.txt  
* aprendizaje\<H,B,C o E\>.txt
* clasificación_alu0101240374.csv
* resumen_alu0101240374.csv  

Ficheros extra:
* Los corpus preprocesados
* Train y test