//variables GLOBALES para la encuesta
var encuesta = {
    nombre : "",
    preguntas: []
};
var preguntaActual = 0;

//listener del input file
$("input:file").on('change', function () {
    var archivo = getArchivoDelInput();
    //controlamos la extensión
    if (extension(archivo.name) != "txt") {
        alert('Solamente se aceptan archivos .txt');
        return;
    }
    $("#nombreArchivo").html(archivo.name);
    $('#botonTest').attr("disabled", false);
});

//listener del boton Empezar, para arrancar la encuesta
$('#botonEmpezar').click(function () {
    $('#encuesta').toggle('is-active');
    empezarEncuesta();
});

//listener del boton Test que se fija si la encuesta sigue el patron correcto
$('#botonTest').click(function () {
    var archivo = getArchivoDelInput();
    if (archivo == undefined) {
        alert('No hay ningún archivo seleccionado');
        return;
    }
    var reader = new FileReader();    
    reader.onload = function (event) {
        if( controlarEstructuraEncuesta(reader.result)) {            
            $('#botonEmpezar').prop('disabled',false);
        }
        else {
            alert("La estructura del txt no es la adecuada para una encuesta");
            eliminarEncuesta();
            return;
        }
    };
    reader.readAsText(archivo);

});

//metodo auxiliar que controla que el txt tenga realmente una encuesta
function controlarEstructuraEncuesta(texto) {
     return crearEncuesta(texto);
}

//metodo auxiliar que lee el archivo y mete los atributos en el objeto encuesta
function crearEncuesta(texto) {
    var arrayTexto = texto.split('\n');
    encuesta.nombre = arrayTexto[0];    
    for(var i=1;i<arrayTexto.length;i++) {        
        if(esPregunta(arrayTexto[i])){
            encuesta.preguntas.push({
                titulo : arrayTexto[i],
                opciones : [],
                respuesta : ""
            });            
        }
        else encuesta.preguntas[encuesta.preguntas.length-1].opciones.push(arrayTexto[i]);
        console.log(encuesta.preguntas);
        console.log("Contador actual: "+i)
    }
    return true;
}

//metodo auxiliar que determina si un renglon contiene una pregunta
function esPregunta(renglon) {
    return renglon.includes('¿') || renglon.includes("?");
}

//función auxiliar para extraer extensión 
function extension(nombreArchivo) {
    return nombreArchivo.split('.').pop();
}

//función auxilar que devuelve el archivo que tiene el input File
function getArchivoDelInput() {
    return $("input:file").prop('files')[0];
}

//función que reinicia el input y los botones
function eliminarEncuesta() {
    $('#botonEmpezar').prop('disabled',true);
    $('#botonTest').prop('disabled',true);
    $('input:file').val("");
    $("#nombreArchivo").html("");
    preguntaActual = 0;
    encuesta.nombre = "";
    encuesta.preguntas = [];
}

//funcion principal que maneja la encuesta
function empezarEncuesta() {    
    $('#encuestaTitutlo').html(encuesta.nombre);
    var pregunta = encuesta.preguntas[preguntaActual];
    ejecutarPreguntaEncuesta(pregunta);     
}

//funcion auxiliar de la encuesta
function ejecutarPreguntaEncuesta(pregunta) {
    $('#barraProgreso').attr("value",100*(preguntaActual+1)/encuesta.preguntas.length);
    var contenido = '<p class="subtitle">'+pregunta.titulo+"</p>";    
    for(opcion of pregunta.opciones) {
       contenido+='<label class="radio"> <input type="radio" name="radioOpciones" value="'+opcion+'"> '+ opcion +"</label><br>";
    }
    $('#encuestaContenido').empty().append(contenido);
    if(preguntaActual==encuesta.preguntas.length-1) {
        $('#botonSiguiente').show().html("Finalizar");        
    }
    else {
        $('#botonSiguiente').show().html("Siguiente")
    }
    $('#botonVolverHacer').hide();        
}

function finalizarEncuesta() {
    var contenido = '<p class="subtitle">Gracias por Participar!</p><p>Sus respuestas fueron las siguientes:</p>';
    contenido+='<table class="table">';    
    for(var i = 0;i<encuesta.preguntas.length;i++){
        contenido+="<tr><td>"+encuesta.preguntas[i].titulo+'<span class="tag is-link is-light">';
        contenido+=encuesta.preguntas[i].respuesta+"</span></td></tr>";
    }
    contenido+="</table>";
    $('#encuestaContenido').empty().append(contenido);
    $('#botonSiguiente').hide();
    $('#botonVolverHacer').show();
    
    imprimirVariables();
}

//siguiente pregunta
$('#botonSiguiente').click(function(){    
    $('input[name="radioOpciones"]').each(function(){
        if(this.checked) encuesta.preguntas[preguntaActual].respuesta = this.value;            
    });
    if(encuesta.preguntas[preguntaActual].respuesta != "") {        
        preguntaActual++;
        if(preguntaActual == encuesta.preguntas.length) finalizarEncuesta();
        else {
        var pregunta = encuesta.preguntas[preguntaActual];
        ejecutarPreguntaEncuesta(pregunta);
        }
    }
    else alert("Debe seleccionar una opción para poder avanzar..");  
});

//listener del boton para salir de la encuesta
$(".delete").click(function(){
    $("#encuesta").toggle("is-active");
    eliminarEncuesta();
} );

//listener del boton finalizar
$('#botonVolverHacer').click(function() {
    console.log("TODO: implementar funcion para reiniciar encuesta");
    $("#encuesta").toggle("is-active");
    $.wait = function( callback, seconds){
        return window.setTimeout( callback, 2 * 1000 );
     }
     //reiniciamos el contador y ponemos en blanco las respuestas anteriores
     preguntaActual = 0;
     for(pregunta of encuesta.preguntas) pregunta.respuesta = "";
     $("#encuesta").toggle("is-active");
     empezarEncuesta();
});

//auxiliar
function imprimirVariables() {
    console.log(encuesta);
    console.log("Pregunta Actual: "+preguntaActual);
}
