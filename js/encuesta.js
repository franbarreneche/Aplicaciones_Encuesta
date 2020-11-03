//variables GLOBALES para la encuesta
var encuesta;
var preguntaActual = 0;
var respuestas= new Map();

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
            reiniciar();
            return;
        }
    };
    reader.readAsText(archivo);

});

//metodo auxiliar que controla que el txt tenga realmente una encuesta
function controlarEstructuraEncuesta(texto) {
    var enc = crearEncuesta(texto);
    if (typeof enc !== 'undefined' && enc.length > 0){
        //seteamos la variable global con la encuesta ahora que sabemos que esta bien hecha
        encuesta = enc;
        return true;
    }
    else return false;
}

//metodo auxiliar crear arreglo 2d con la encuesta
function crearEncuesta(texto) {
    var encuesta = new Array(); encuesta[0] = new Array();
    var arrayEncuesta = texto.split('\n');
    var nPregunta = 0;
    for(renglon of arrayEncuesta) {
        if(!esPregunta(renglon)) {
            encuesta[nPregunta].push(renglon);
        }
        else {
            encuesta.push(new Array());
            nPregunta++;
            encuesta[nPregunta].push(renglon);
        }
    }
    return encuesta;
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
function reiniciar() {
    $('#botonEmpezar').prop('disabled',true);
    $('#botonTest').prop('disabled',true);
    $('input:file').val("");
    $("#nombreArchivo").html("");
}

//funcion principal que maneja la encuesta
function empezarEncuesta() {    
    $('#encuestaTitutlo').html(encuesta[0][0]);
    preguntaActual = 1;
    var pregunta = encuesta[preguntaActual];
    ejecutarPreguntaEncuesta(pregunta);     
}

//funcion auxiliar de la encuesta
function ejecutarPreguntaEncuesta(pregunta) {
    var contenido = "";
    for(opcion of pregunta) {
       contenido+='<label class="checkbox"> <input type="checkbox" value="'+opcion+'">'+ opcion +"</label><br>";
    }
    $('#encuestaContenido').empty();
    $('#encuestaContenido').append(contenido); 
    if(preguntaActual<encuesta.length-1) {
        $('#botonSiguiente').prop('disabled',false);
        $('#botonFinalizar').prop('disabled',true);
    }
    else {
        $('#botonSiguiente').prop('disabled',true);
        $('#botonFinalizar').prop('disabled',false);
    }
    imprimirVariables();
}

//siguiente pregunta
$('#botonSiguiente').click(function(){
    preguntaActual++;
    var pregunta = encuesta[preguntaActual];
    ejecutarPreguntaEncuesta(pregunta);
    imprimirVariables();
});

//listener del boton para salir de la encuesta
$(".delete").click(function(){
    $("#encuesta").remove();
    reiniciar();
} );


//auxiliar
function imprimirVariables() {
    console.log(encuesta);
    console.log("Pregunta Actual: "+preguntaActual);
    console.log("Respuestas: "+respuestas);
}
