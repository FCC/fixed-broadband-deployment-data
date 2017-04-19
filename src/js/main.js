(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');
    var tableNWAve = require('./modules/table-nwAve.js');
    var pathname = window.location.pathname.split('\\').pop().split('/').pop().split('.')[0];

    window.GEOHOST = 'https://geo.fcc.gov/fcc'; 
    
    if (pathname === '' || pathname === 'index') {
        window.page = 'deployment';
    } else {
        window.page = pathname;
    }
    
    // set active main nav link
    if (window.page === 'deployment') {
        $('[href="index.html"]').addClass('active');
    } else {
        $('[href="' + window.page + '.html"]').addClass('active');
    }

    // initialize map search
    if ($('#map').length > 0) {
        BPRMap.init();
        MapSearch.init();
    }

    // display Nationwide table if available
    if ($('#table-nwAve').length > 0) {
        tableNWAve.getData();
    }

}());
