//agregar "hanglder" / listener al input file
$("input:file").on('change',function(){
    //console.log($(this).val());
    //tirar error si el archivo no es .txt
    console.log($("input:file").prop('files')[0]);
    var archivo = $("input:file").prop('files')[0];
    $("#nombreArchivo").html(archivo.name);
    $('#botonTest').attr("disabled",false);
    $('#botonTest').click(testArchivoEncuesta);
});


//procesar archivo de texto
function testArchivoEncuesta() {
    console.log("esta testeando archivo...");
    var archivo = $("input:file").prop('files')[0];
    jQuery.get(archivo, function(data) {
        
        alert(data);
        //process text file line by line
        $('#div').html(data.replace('n',''));
     });
}



