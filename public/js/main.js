(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');    

    if ($('#map').length > 0) {
        BPRMap.init();
        MapSearch.init();
    }

}());
