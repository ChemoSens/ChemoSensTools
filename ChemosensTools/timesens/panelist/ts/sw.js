// Version 2.0 26/10/2017 11:309
// [Important] Changer ce fichier pour faire la mise à jour du service worker

//TODO : utiliser fonction du framework

this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {        
        return cache.addAll([
        '/css/bootstrap.css',
        '/css/panelist.css',
        '/css/controls.css',
        '/css/screenreader.css',
        '/css/jquery-ui.min.css',
        '/css/jquery.modal.min.css',
        '/css/tooltipster.bundle.min.css',
        '/css/jquery.mCustomScrollbar.min.css',
        '/css/fonts/Genome-Thin.woff',
        '/js/Keyboard-master/css/keyboard-basic.css',
        '/css/jquery.dataTables.min.css',
        '/css/nouislider.min.css',
        '/js/jquery.js',
        '/js/crypto-js/crypto-js.js',
        '/js/FileSaver.min.js',
        '/js/offline.min.js',
        '/js/jszip.min.js',
        '/js/jquery.modal.min.js',
        '/js/jquery-ui.min.js',
        '/js/modernizr-min.js',
        '/js/tooltipster.bundle.min.js',
        '/js/Keyboard-master/js/jquery.keyboard.js',
        '/js/jquery.mCustomScrollbar.concat.min.js',
        '/js/jquery.dataTables.min.js',
        '/js/nouislider.min.js',
        '/js/interact.min.js',
        '/js/jquery.ui.touch-punch.min.js',
        '/ts/panelist.js',
        '/ts/views.js',
        '/ts/localization.js',
        '/ts/models.js',
        '/ts/controls.js',
        //'/ts/toolbox.js',
        '/ts/screenreader.js',
        '/ts/ReadJSONWorker.js',
        '/panelist/index.html',
        '/panelist/version.txt',
        '/images/logo_blanc.png',
        //'/images/favicon.png',
        '/images/background.jpg',
        '/images/progressbar.gif',
        '/images/svg/sharpicons_touch.svg',
        '/images/svg/sharpicons_database.svg',
        '/images/svg/sharpicons_settings.svg',
        '/images/svg/sharpicons_support.svg',
        '/images/svg/sharpicons_badge-4.svg',
        '/images/svg/sharpicons_database-confirm.svg',
        '/images/svg/sharpicons_wifi-3.svg',
        '/images/svg/sharpicons_top-favorites.svg',
        '/images/svg/sharpicons_enter-pin.svg',
        '/images/svg/sharpicons_search-open-folder.svg',
        '/images/svg/right-arrow.svg',
        '/images/svg/right-arrows.svg',
        '/images/svg/placeholder.svg',
        '/images/svg/sharpicons_cmyk.svg',
        '/images/svg/sharpicons_flag.svg',
        '/images/svg/sharpicons_keyboard.svg',
        '/images/svg/sharpicons_keylock.svg',
        '/images/svg/sharpicons_full-expand.svg',
        '/images/svg/sharpicons_cloud-refresh.svg',
        '/images/svg/left-arrows.svg',
        '/images/svg/left-arrow-2.svg',
        '/images/svg/cogwheel.svg',
        '/images/svg/close-button.svg',
        '/images/svg/download-symbol-1.svg'
      ]);
    })
  );
});

//Cache, falling back to network
this.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        }
      )
    );
});

//Network falling back to cache
//this.addEventListener('fetch', function (event) {
//    event.respondWith(
//      fetch(event.request).catch(function () {
//          return caches.match(event.request);
//      })
//    );
//});