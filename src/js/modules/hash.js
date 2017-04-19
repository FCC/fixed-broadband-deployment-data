'use strict';

var Validate = require('./validate.js');

var Hash = {
    params: {},
    hasHash: function() {
        return window.location.hash ? true : false;
    }, 
    get: function(BPRMap) {
        var hash = decodeURIComponent(location.hash);

        //map lat, lon, zoom
        var latHash = hash.match(/lat=([^&]+)/i);
        var lonHash = hash.match(/lon=([^&]+)/i);
        var zoomHash = hash.match(/zoom=([^&]+)/i);

        if (latHash === null || lonHash === null || zoomHash === null || !Validate.coord(latHash[1], lonHash[1], zoomHash[1])) {
            BPRMap.lat = BPRMap.lat;
            BPRMap.lon = BPRMap.lon;
            BPRMap.zoom = BPRMap.zoom;
        } else {
            BPRMap.lat = latHash[1].replace(/\+/g, '%20');
            BPRMap.lon = lonHash[1].replace(/\+/g, '%20');
            BPRMap.zoom = zoomHash[1].replace(/\+/g, '%20');
        }        
    },
    update: function(BPRMap) {

        //map lat, lon, zoom
        BPRMap.zoom = BPRMap.map.getZoom();
        Hash.params.lat = BPRMap.lat;
        Hash.params.lon = BPRMap.lon;
        Hash.params.zoom = BPRMap.zoom;
       
        window.location.hash = $.param(Hash.params);

    },
    change: function(BPRMap) {
    	Hash.get(BPRMap);    	
    }
};


module.exports = Hash;
