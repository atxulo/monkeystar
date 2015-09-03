// ==UserScript==
// @name        Fondotop Portfolio Mejorado
// @namespace   https://github.com/enekogb/monkeystar
// @description Mejoras en el portfolio de Fondotop
// @include     https://www.fondotop.com/fondotop*
// @version     1.0.4
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

// Nos aseguramos de estar en la pestanya principal
if ($("a:contains('Tu Cuenta de fondos')").length > 0) {
  // Comprobamos los traspasos pendientes
  var txtTraspasosPendientes = '';
  $.ajax({
    url: 'https://www.fondotop.com/fondotop?TX=patrimonio&STD=51',
    async: false, // Parche para evitar el problema de que se solapen las respuestas
    success: function (data) {
      txtTraspasosPendientes = $(data).text();
    },
    complete: function() {

      // Buscamos todos los numeros negativos de la tabla y los pintamos en rojo
      $('#cuenta_fondos').find('td').each(function (index) {
          var valor = $(this).text();
          if (valor.indexOf('-') === 0 && valor.length > 1) {
            $(this).css('color', 'red');
          }
      });

      // Anyadimos las nuevas columnas a la tabla
      $('#cuenta_fondos').find('.cabecera').find('tr').each(function (index) {
        $(this).find('td').eq(0).after('<td class="tabla_tbody" align="center">* MStar</td>');
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
      $('#cuenta_fondos').find('.contenido').find('tr.tabla_tbody').each(function (index) {
        $(this).find('td:first').attr('colspan',20);
      });

      // Anyadimos las nuevas columnas a la filas con datos
      $('#cuenta_fondos').find('.contenido').find('tr:not(.tabla_tbody)').each(function (index) {
        $(this).find('td').eq(0).after('<td class="tabla_td" align="left">&nbsp;</td>');
        $(this).find('td').eq(4).after('<td class="tabla_td" align="left">&nbsp;</td>');
        for (i=0; i<8; i++) $(this).append('<td class="tabla_td" align="right">&nbsp;</td>');
      });

      // Buscamos los enlaces a los distintos fondos
      var filasDatos = {};
      $('a[href^="fondotop?TX=buscador_fnd"]').each(function (index, enlace) {
        var urlFondo = $(enlace).attr('href');
        var nombreFondo = isin = $(enlace).text().substring(0, $(enlace).text().lastIndexOf(" / "));
        var isin = $(enlace).text().substring($(enlace).text().lastIndexOf(" / ") + 3);

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
              var celda = $(filasDatos[isinRespuesta]).children() [index + 10];
              $(celda).html(valor);
              if (valor.indexOf('-') === 0 && valor.length > 1) {
                $(celda).css('color', 'red');
              }
            });

            // Mostramos las estrellas morningstar
            var celdaEstrellas = $(filasDatos[isinRespuesta]).children() [1];
            $('<img />').attr('src',$(imgEstrellasMSTar).attr('src')).css('margin-left', '3px').appendTo($(celdaEstrellas));

            // Mostramos la fecha del VL
            var celdaFecha = $(filasDatos[isinRespuesta]).children() [5];
            $(celdaFecha).html(fecha);
            
            // Si en los traspasos pendientes aparece el fondo, lo mostramos
            if (txtTraspasosPendientes.indexOf(nombreFondo) > -1) {
              $('<img />').attr('src','https://individual.icons-land.com/IconsPreview/POI/PNG/Circled/16x16/Currency_Euro_Circle_Green.png').attr('title', 'Traspaso pendiente').css('margin-left', '3px').insertAfter($(enlace));
            }

            // Mostramos los datos operativos como info
            var txtInfo = '';
            txtInfo = txtInfo + tablaToInfo(tablaClasificacion);
            txtInfo = txtInfo + '\r\n';
            txtInfo = txtInfo + tablaToInfo(tablaDatosOperativos);
            txtInfo = txtInfo + '\r\n';
            txtInfo = txtInfo + tablaToInfo(tablaComisiones);
            txtInfo = txtInfo + '\r\n';
            txtInfo = txtInfo + tablaToInfo(tablaInversionMinima);
            $(filasDatos[isinRespuesta]).find('a[href^="fondotop?TX=buscador_fnd"]').eq(0).each(function (index, enlace) {
               $('<img />').attr('src','https://creativecommons.org/images/information.png').attr('title', txtInfo).css('margin-left', '3px').insertAfter($(enlace));
            });


          }
        });
      });
    }
  }); 
}  
