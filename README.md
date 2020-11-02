# Aplicaciones_API_DnD
Ejercicio para la cátedra Aplicaciones I del segundo semestre del 2020 en la UPSO.
Con el enunciado siguiente:

Se pide desarrollar una página que acepte una encuesta desde un archivo txt y la muestre en la página.
La página deberá estar preparada para aceptar cualquier encuesta.
El archivo txt deberá contener las preguntas y las posibles respuestas, donde sólo se podrá elegir una.
La primer línea del archivo TXT contendrá el nombre de la encuesta. Por ejemplo:
Encuesta COVID
1)¿Cuentan en el hogar con insumos de prevención, limpieza y desinfección suficientes?
a) Si
b)No
2) ¿Cuál o cuáles diría usted que le faltan?
a)Barbijo
b)Alcohol en gel
c)Lavandina
d)Alcohol
Menos la primer pregunta, el resto permanecerá oculta y se irá visualizando a medida que se vayan respondiendo las anteriores, o se podrán visualizar a gusto del usuario, por ejemplo con el efecto acordeon. Sea como sea, las preguntas no deben verse todas al mismo tiempo, sino que se deben desplegar o mostrar de a una por vez en la pantalla.
La encuesta estará lista sólo una vez que se hayan respondido todas las preguntas, en este momento se habilitará el botón FINALIZAR ENCUESTA. Es decir que deberá saberse si el usuario respondió todas las preguntas o no.
En caso que alguna de las respuestas posibles sea Otro, deberá habilitarse un cuadro de diálogo para que se ingrese un texto. En el archivo txt debe existir al menos una respuesta Otro para alguna de las preguntas.
El botón FINALIZAR ENCUESTA solo mostrará un mensaje agradeciendo la realización de la encuesta
Deberá proveerse un botón para volver a realizar la encuesta.
El archivo conteniendo la encuesta deberá elegirse por medio de un botón o soltándose en un área determinada, se deben facilitar ambas opciones.
Realizar el trabajo mediante jQuery, es decir que por ejemplo la asignación de eventos debe hacerse con on() y no con addEventListener.
Una barra de progreso indicará la completitud de la encuesta, a medida que se vayan respondiendo se irá completando dicha barra.
Junto al trabajo se debe entregar una encuesta en TXT referente al tema COVID con al menos 10 preguntas. Pueden consultar algunas preguntas en este enlace https://www.unicef.org/argentina/media/7866/file
Aplicar estilos e imágenes para que quede bonito. El usuario debe saber qué hacer, debe ser intuitivo.
Los script deberán cargarse de forma diferida en el encabezado del documento.
El código jQuery deberá estar separado del documento HTML