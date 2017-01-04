'use strict';

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

        BPRMap.lat = latHash === null ? BPRMap.lat : decodeURIComponent(latHash[1].replace(/\+/g, '%20'));
        BPRMap.lon = lonHash === null ? BPRMap.lon : decodeURIComponent(lonHash[1].replace(/\+/g, '%20'));
        BPRMap.zoom = zoomHash === null ? BPRMap.zoom : decodeURIComponent(zoomHash[1].replace(/\+/g, '%20'));

    },
    update: function(BPRMap) {

        //map lat, lon, zoom
        BPRMap.zoom = BPRMap.map.getZoom();
        Hash.params.lat = BPRMap.lat;
        Hash.params.lon = BPRMap.lon;
        Hash.params.zoom = BPRMap.zoom;

        //selected map layers
        /*$('.map-legend').find(':checked').each(function(index, el) {
            Hash.params['layer' + index] = $(el).attr('data-layer');
        });*/

        //selected base layer
        // Hash.params.baseLayer = $('.leaflet-control-layers-base').find(':checked').next('span').text().trim();

        //selected tab
        // Hash.params.tab = $('.layer-switch').find('.active a').text();
        
        window.location.hash = encodeURIComponent($.param(Hash.params));

    },
    change: function(BPRMap) {
    	Hash.get(BPRMap);    	
    }
};


module.exports = Hash;
