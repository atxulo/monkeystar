// ==UserScript==
// @name        Fondotop Portfolio Mejorado
// @namespace   https://github.com/enekogb/monkeystar
// @description Mejoras en el portfolio de Fondotop
// @include     https://www.fondotop.com/fondotop*
// @version     1.0.0
// @grant       none
// ==/UserScript==

// Obtenemos el jquery que usa la pagina
var $, jQuery;
$ = jQuery = window.jQuery;

// Anyadimos las nuevas columnas a la tabla
$('#cuenta_fondos').find('.cabecera').find('tr').each(function (index) {
  $(this).append('<td class="tabla_tbody" align="right">a.actual</td>');
  $(this).append('<td class="tabla_tbody" align="right">1m</td>');
  $(this).append('<td class="tabla_tbody" align="right">3m</td>');
  $(this).append('<td class="tabla_tbody" align="right">6m</td>');
  $(this).append('<td class="tabla_tbody" align="right">1a</td>');
  $(this).append('<td class="tabla_tbody" align="right">3a</td>');
  $(this).append('<td class="tabla_tbody" align="right">5a</td>');
  $(this).append('<td class="tabla_tbody" align="right">10a</td>');
});

// Anyadimos las nuevas columnas a la filas con titulo
$('#cuenta_fondos').find('.contenido').find('tr.tabla_tbody').each(function (index) {
  $(this).find('td:first').attr('colspan',18);
});

// Anyadimos las nuevas columnas a la filas con datos
$('#cuenta_fondos').find('.contenido').find('tr:not(.tabla_tbody)').each(function (index) {
  for (i=0; i<8; i++) $(this).append('<td class="tabla_td" align="right">&nbsp;</td>');
});

// Buscamos los enlaces a los distintos fondos
var filasDatos = {};
$('a[href^="fondotop?TX=buscador_fnd"]').each(function (index, enlace) {
  var urlFondo = $(enlace).attr('href');
  var isin = $(enlace).text();
  isin = isin.substring(isin.lastIndexOf(" / ") + 3);   
  filasDatos[isin] = $(enlace).parents('tr');
  $.ajax({
    url: urlFondo,
    async: false, // Parche para evitar el problema de que se solapen las respuestas
    success: function (data) {
      var isinRespuesta = $(data).find('.cajasmorningtit:contains("ISIN:")').next('td').text();
      var datosFondo = ($(data).find('.cajasmorning:eq(6) tr:eq(1) .cajasmorningcont'));   
      $(datosFondo).each(function (index) {
        var valor = $(this).text();
        var celda = $(filasDatos[isinRespuesta]).children() [index + 9];
        $(celda).html(valor);
      });
    }
  });
});
