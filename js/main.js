(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');
    var tableNWAve = require('./modules/table-nwAve.js');

    if ($('#map').length > 0) {
        BPRMap.init();
        MapSearch.init();
    }

    if ($('#table-nwAve').length > 0) {
        tableNWAve.getData();
    }

}());
