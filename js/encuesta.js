//variables GLOBALES para la encuesta
var encuesta = {
    nombre : "",
    preguntas: []
};
var preguntaActual = 0;

//prevenir comportamiento default cuando arrastran algo adentro de la ventana
$(window).on('dragover',function(e){
    e.preventDefault();
});
$(window).on('drop',function(e){
    e.preventDefault();
});

//listeners de la zona de arrastre de archivos
$('#dropZone').on('dragenter dragleave',function(event){
    $('#dropZone').toggleClass('is-link');
});

$('#dropZone').on('dragover',function(event){
    event.preventDefault();    
    event.stopPropagation();    
    event.originalEvent.dataTransfer.dropEffect = 'copy';
});

$('#dropZone').on('drop',function(event){
    event.preventDefault();
    event.stopPropagation();
    $('#dropZone').removeClass('is-link');
    if(event.originalEvent.dataTransfer.files.length > 1 )
        alert("boludo no podes mas de un archivo");
    else {        
        $('#inputArchivo').prop('files',event.originalEvent.dataTransfer.files);
        manejadorCambioInputFile();
    }    
});

//listener de cambios en el input file
$("#inputArchivo").on('change',manejadorCambioInputFile);

function manejadorCambioInputFile() {
    var archivo = getArchivoDelInput();
    //controlamos la extensión
    if (extension(archivo.name) != "txt") {
        alert('Solamente se aceptan archivos .txt');
        return;
    }
    $("#nombreArchivo").html(archivo.name);
    $('#botonTest').attr("disabled", false);
}

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
    crearEncuesta(texto);
    //acá deberían ir los controles que verifiquen que el archivo está bien formado
    //chequeando el contenido de la variable global "encuesta"
     return true;
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

//funcion inicial que arranca la encuesta
function empezarEncuesta() {    
    $('#encuestaTitutlo').html(encuesta.nombre);
    var pregunta = encuesta.preguntas[preguntaActual];
    ejecutarPreguntaEncuesta(pregunta);     
}

//funcion auxiliar de la encuesta que muestra lo relacionado con una pregunta
function ejecutarPreguntaEncuesta(pregunta) {
    $('#barraProgreso').attr("value",100*(preguntaActual+1)/encuesta.preguntas.length);
    $('#encuestaNumeroPregunta').html("Pregunta "+(preguntaActual+1)+" de "+encuesta.preguntas.length);
    var contenido = '<p class="subtitle">'+pregunta.titulo+"</p>";    
    for(opcion of pregunta.opciones) {
        var htmlOpcion = "";
        if(opcion.includes("Otro")) {
            htmlOpcion = 'Otro: <input type="text" name="inputOtro'+preguntaActual+'" class="input is-small">';
            opcion = "otro";
        }
       else htmlOpcion = opcion;
       contenido+='<div class="field is-expanded"><label class="radio"> <input type="radio" name="radioOpciones" value="'+opcion+'"> '+"</label> "+htmlOpcion+"<div><br>";
    }
    $('#encuestaContenido').empty().append(contenido);
    if(preguntaActual == encuesta.preguntas.length-1) {
        $('#botonSiguiente').show().html("Finalizar").removeClass("is-link").addClass("is-success");        
    }
    else {
        $('#botonSiguiente').show().html("Siguiente").removeClass("is-success").addClass("is-link");
    }
    $('#botonVolverHacer').hide();        
}

//funcion auxiliar de la encuesta que muestra un mensaje y las opciones que eligió el usuario
function finalizarEncuesta() {
    var contenido = '<p class="subtitle">¡Gracias por Participar!</p><p>Sus respuestas fueron las siguientes:</p>';
    contenido+='<table class="table">';    
    for(var i = 0;i<encuesta.preguntas.length;i++){
        contenido+="<tr><td>"+encuesta.preguntas[i].titulo+'<span class="tag is-link is-light">';
        contenido+=encuesta.preguntas[i].respuesta+"</span></td></tr>";
    }
    contenido+="</table>";
    $('#encuestaContenido').empty().append(contenido);
    $('#botonSiguiente').hide();
    $('#botonVolverHacer').show();
    imprimirVariables(); //comentar este metodo si no se quiere ver nada en consola
}

//listener boton siguiente pregunta
$('#botonSiguiente').click(function(){    
    $('input[name="radioOpciones"]').each(function(){
        if(this.checked) encuesta.preguntas[preguntaActual].respuesta = (this.value != "otro")? this.value : $('input[name="inputOtro'+preguntaActual+'"]').val();            
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

//listener del boton Volver A Hacer Encuesta
$('#botonVolverHacer').click(function() {
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
    console.log("Pregunta Actual: "+(preguntaActual+1));
}
