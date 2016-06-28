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
    }
  });
}
