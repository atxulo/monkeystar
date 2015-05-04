// ==UserScript==
// @name        MStar Portfolio Mejorado
// @namespace   https://github.com/enekogb/monkeystar
// @description Mejoras en el portfolio de Morningstar
// @include     http://www.morningstar.es/es/portfoliomanager/portfolio.aspx*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

// see: http://joanpiedra.com/jquery/greasemonkey/
var $;

// Add jQuery
(function(){
    if (typeof unsafeWindow.jQuery == 'undefined') {
        var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
            GM_JQ = document.createElement('script');
 
        GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js';
        GM_JQ.type = 'text/javascript';
        GM_JQ.async = true;
    
        GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
    }
    GM_wait();
})();

// Check if jQuery's loaded
function GM_wait() {
    if (typeof unsafeWindow.jQuery == 'undefined') {
        window.setTimeout(GM_wait, 100);
    } else {
        $ = unsafeWindow.jQuery.noConflict(true);
        letsJQuery();
    }
}

function letsJQuery() {
  // Ocultamos el banner de la derecha
  $('#adContent32739').hide();

  // Anyadimos las nuevas columnas a la tabla
  $('#ctl00_ctl00_MainContent_PM_MainContent_gv_Portfolio').find('tr').each(function(index){
    if (index == 0) {
      $(this).find('th').eq(2).after('<th class="gridHeaderNumeric" scope="col"><a href="#">1s</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">1m</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">3m</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">6m</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">A&ntilde;o</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">1a</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">3a anual</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">5a anualiz</a></th><th class="gridHeaderNumeric" scope="col"><a href="#">10a anual</a></th>');   
    } else {
      $(this).find('td').eq(2).after('<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>');
    }
  });

  // Buscamos los enlaces a los distintos fondos
  $('a[href^="/es/snapshot/snapshot.aspx"]').each(function(index) {
    var fila = $(this).closest('tr');
    urlFondo = $(this).attr('href').replace('es/snapshot', 'es/funds/snapshot');
    $.get(urlFondo + '&tab=1', function(data) {
      htmlTab = $.parseHTML(data, null, false);
      divRentAcum = ($(htmlTab).find("#returnsTrailingDiv"));
      $(divRentAcum).find('.col2').each (function(index) {
        if (index > 1) {
          celda = $(fila).children()[index + 1];
          // col1 = $(this).closest('tr').find('td:first').text();
          col2 = $(this).text().trim();
          $(celda).css('width', '75px');
          if (col2.match(/-[0-9]*,[0-9]+/)) {
            $(celda).css('color', 'Red');
          }
          $(celda).html('&nbsp;' + col2 + '&nbsp;');
        }
      });    
    });
  });

}

function countColumn() {                                                                                
    var colCount = 0;                                                                                   
    $('tr:nth-child(1) td').each(function () {                                                          
        if ($(this).attr('colspan')) {
            colCount += +$(this).attr('colspan');
        } else {
            colCount++;
        }
    });
    return colCount;
}
