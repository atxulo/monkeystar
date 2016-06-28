// ==UserScript==
// @name        Renta4 Fondotop Mejorado
// @namespace   https://github.com/enekogb/monkeystar
// @include     https://www.r4.com/portal?TX=goto&FWD=MAIN_FONDOS&PORTLET=MAIN_FONDOS&PAG=5&SUB_HOJ=1*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @version     1.0
// @grant       GM_addStyle
// ==/UserScript==

// Constantes
var URL_TRASPASOS_PENDIENTES = 'https://www.r4.com/portal?TX=patrimonio&PAG=6&STD=9&HOJA=1';
var URL_IMG_EURO = 'https://individual.icons-land.com/IconsPreview/POI/PNG/Circled/16x16/Currency_Euro_Circle_Green.png';
var COD_ISIN_REGEXP = /.*COD_ISIN=([A-Z0-9]+)/i;

// Obtenemos el jquery que usa la pagina
this.$ = this.jQuery = jQuery.noConflict(true);

// Esperamos a que se cargue el objeto donde se muestra el TOP 5
waitForKeyElements('h2:contains("TOP 5")', cargarTraspasosPendientes);

function cargarTraspasosPendientes(nodoTop5) {
  // Buscamos los traspasos pendientes
  $.ajax({
    url: URL_TRASPASOS_PENDIENTES,
    success: function (data) {
      // Introducimos los elementos entre estos dos enlaces delante del TOP 5
      $(data).find('a[name=fondos]').nextUntil('a[name=rentaf]').insertBefore(nodoTop5);
      
      // Buscamos los fondos en la tabla de fondos
      var txtTraspasosPendientes = $(data).text();
      $(".tablemorning").find('a.msnombrefondo').each(function(index, enlace) {
        var urlEnlace = $(enlace).attr('href');
        var m;
        if ((m = COD_ISIN_REGEXP.exec(urlEnlace)) !== null) {
          if (m.index === COD_ISIN_REGEXP.lastIndex) {
            COD_ISIN_REGEXP.lastIndex++;
          }
          var isin = m[1];
          if (txtTraspasosPendientes.indexOf(isin) > -1) {
            $('<img />').attr('src',URL_IMG_EURO).attr('title', 'Traspaso pendiente').css('margin-right', '3px').insertBefore($(enlace));
          }
        }
      });
    }
  });
}
