// ==UserScript==
// @name        Fondotop Traspasos Internos Mejorados
// @namespace   https://github.com/enekogb/monkeystar
// @include     https://www.fondotop.com/fondotop*
// @version     1.0.1
// @grant       none
// ==/UserScript==

// Obtenemos el jquery que usa la pagina
var $, jQuery;
$ = jQuery = window.jQuery;

function tablaToInfo(tabla) {
  var txtInfo = '';
  tabla.find('td').each(function(index){
    if ((index % 2) == 1) txtInfo = txtInfo + '-  ';
    else txtInfo = txtInfo + ' ';
    txtInfo = txtInfo + $.trim($(this).text());
    if ((index % 2) != 1) txtInfo = txtInfo + '\r\n';
  });
  return txtInfo;
}

// Comprobamos que exista el radio "TODOS" para deducir que estamos en traspasos internos
if($(':radio[name=RB_OPERACION][value=T]').length == 1) {
  // Buscamos todos los numeros negativos de la tabla y los pintamos en rojo
  $('table.tabla:eq(0)').find('td').each(function (index) {
    var valor = $(this).text();
    if (valor.indexOf('-') === 0 && valor.length > 1) {
      $(this).css('color', 'red');
    }
  });

  // Anyadimos las nuevas columnas a la tabla
  $('table.tabla:eq(0)').find('.cabecera').find('tr').each(function (index) {
    $(this).find('td').eq(0).after('<td class="tabla_tbody" align="center">ISIN</td>');
    $(this).find('td').eq(1).after('<td class="tabla_tbody" align="center">* MStar</td>');
    $(this).find('td').eq(4).after('<td class="tabla_tbody" align="center">A fecha</td>');
    $(this).append('<td class="tabla_tbody" align="center">a.actual</td>');
    $(this).append('<td class="tabla_tbody" align="center">1m</td>');
    $(this).append('<td class="tabla_tbody" align="center">3m</td>');
    $(this).append('<td class="tabla_tbody" align="center">6m</td>');
    $(this).append('<td class="tabla_tbody" align="center">1a</td>');
    $(this).append('<td class="tabla_tbody" align="center">3a</td>');
    $(this).append('<td class="tabla_tbody" align="center">5a</td>');
    $(this).append('<td class="tabla_tbody" align="center">10a</td>');
  });

  // Anyadimos las nuevas columnas a la filas con titulo
  $('table.tabla:eq(0)').find('.contenido').find('tr.tabla_tbody').each(function (index) {
    $(this).find('td:first').attr('colspan',21);
  });

  // Anyadimos las nuevas columnas a la filas con datos
  $('table.tabla:eq(0)').find('.contenido').find('tr:not(.tabla_tbody)').each(function (index) {
    $(this).find('td').eq(0).after('<td class="tabla_td" align="left">&nbsp;</td>');
    $(this).find('td').eq(1).after('<td class="tabla_td" align="left">&nbsp;</td>');
    $(this).find('td').eq(4).after('<td class="tabla_td" align="left">&nbsp;</td>');
    for (i=0; i<8; i++) $(this).append('<td class="tabla_td" align="right">&nbsp;</td>');
  });

  // Buscamos los enlaces a los distintos fondos
  var filasDatos = {};
  $('a:contains("Ficha")').each(function (index, enlace) {
    var onclick = $(enlace).attr('onclick').toString();
    var urlFondo = eval(/windowopener\((.*)\,'fichafondo/.exec(onclick)[1]);
    var nombreFondo = $(enlace.closest("tr")).children("td:first").text();
    var isin = /isin: '([^']*)'/.exec(onclick)[1];

    filasDatos[isin] = $(enlace).parents('tr');

    $.ajax({
      url: urlFondo,
      async: false, // Parche para evitar el problema de que se solapen las respuestas
      success: function (data) {

        var isinRespuesta = $(data).find('.cajasmorningtit:contains("ISIN:")').next('td').text();
        var fecha = $(data).find('.cajasmorningtit:contains("A fecha:")').next('td').text();
        var datosFondo = ($(data).find('.cajasmorning:eq(6) tr:eq(1) .cajasmorningcont'));
        var tablaClasificacion = ($(data).find('td .titamarillo:contains("Clasificaci")').parents('tbody').eq(0));
        var tablaComisiones = ($(data).find('td .titamarillo:contains("Comisiones")').parents('tbody').eq(0));
        var tablaDatosOperativos = ($(data).find('td .titamarillo:contains("Datos operativos")').parents('tbody').eq(0));
        var tablaInversionMinima = ($(data).find('td .titamarillo:contains("nima")').parents('tbody').eq(0));
        var imgEstrellasMSTar = ($(data).find('img[src^="/images/microsites/morning/star"]'));

        // Pintamos los datos del fondo
        $(datosFondo).each(function (index) {
          var valor = $(this).text();
          var celda = $(filasDatos[isinRespuesta]).children() [index + 8];
          $(celda).html(valor);
          if (valor.indexOf('-') === 0 && valor.length > 1) {
            $(celda).css('color', 'red');
          }
        });

        // Mostramos el ISIN
        var celdaISIN = $(filasDatos[isinRespuesta]).children() [1];
        $(celdaISIN).html(isinRespuesta);

        // Mostramos las estrellas morningstar
        var celdaEstrellas = $(filasDatos[isinRespuesta]).children() [2];
        $('<img />').attr('src',$(imgEstrellasMSTar).attr('src')).css('margin-left', '3px').appendTo($(celdaEstrellas));

        // Mostramos la fecha del VL
        var celdaFecha = $(filasDatos[isinRespuesta]).children() [5];
        $(celdaFecha).html(fecha);

        // Mostramos los datos operativos como info
        var txtInfo = '';
        txtInfo = txtInfo + tablaToInfo(tablaClasificacion);
        txtInfo = txtInfo + '\r\n';
        txtInfo = txtInfo + tablaToInfo(tablaDatosOperativos);
        txtInfo = txtInfo + '\r\n';
        txtInfo = txtInfo + tablaToInfo(tablaComisiones);
        txtInfo = txtInfo + '\r\n';
        txtInfo = txtInfo + tablaToInfo(tablaInversionMinima);
        $(filasDatos[isinRespuesta]).find('a').eq(0).each(function (index, enlace) {
          $('<img />').attr('src','https://creativecommons.org/images/information.png').attr('title', txtInfo).css('margin-left', '3px').insertAfter($(enlace));
        });
      }
    });
  });

  // Volvemos a pedir la pagina inicial para evitar que de un problema diciendo que no tienes cartera
  $.ajax({
    url: window.location.href,
    async: false, // Parche para evitar el problema de que se solapen las respuestas
    success: function (data) {
    }
  });      
} 
