'use strict';

var layers = {
    deployment: require('./layers-deployment.js'),
    speed: require('./layers-speed.js'),
    providers: require('./layers-providers.js'),
    technology: require('./layers-tech.js'),
    tribal: {
        format: 'image/png',
        transparent: true,
        layers: 'bpr_tribal',
        styles: 'bpr_tribal'
    },
    urban: {
        format: 'image/png',
        transparent: true,
        layers: 'fcc:bpr_county_layer_urban_only',
        styles: 'bpr_layer_urban'
    }
};

var locationLat;
var locationLon;
var locationMarker;
var clickedCountyLayer;
var clickedCountyStyle = { color: '#00f', opacity: 0.5, fillOpacity: 0.1, fillColor: '#fff', weight: 3 };
var countyLayerData = { 'features': [] };

var clickedBlockLayer;
var clickedBlockStyle = { color: '#000', opacity: 0.5, fillOpacity: 0.1, fillColor: '#fff', weight: 3 };
var clickedBlockLayerData;

var Map = {
    init: function() {

        Map.createMap();

        // toggle map container width
        $('#map-container').on('click', '.control-full a', function() {
            $('header .container, header .container-fluid, main')
                .toggleClass('container container-fluid')
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function(e) {
                        Map.map.invalidateSize();
                    });
        });

        Map.map.on('click', Map.update);

        //legend
        /*if (!mapOpts.legend) {
            $('.map-legend, .legend__icon').toggleClass('hide');
        }

        $('#btn-closeLegend').on('click', function(e) {
            e.preventDefault();
            $('.map-legend').hide('fast');
        });

        $('#btn-openLegend').on('click', function(e) {
            e.preventDefault();
            $('.map-legend').show('fast');
        });*/

    },
    createMap: function() {
        var map;
        var hash;
        // var mapData = Map.data;
        var initialzoom = 4;
        var maxzoom = 15;
        var minzoom = 3;
        var center_lat = 38.82;
        var center_lon = -94.96;
        var baseLayer = {};
        var layerControl;
        var layerPath = window.location.pathname.split('/')[1];
        var mapLayer = {};

        Map.geoURL = '/gwc/service/wms?tiled=true';
        Map.geo_space = 'fcc';

        L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
        map = L.mapbox.map('map-container', 'fcc.k74ed5ge', {
                attributionControl: true,
                maxZoom: maxzoom,
                minZoom: minzoom,
                zoomControl: true
            })
            .setView([center_lat, center_lon], initialzoom);

        map.attributionControl.addAttribution('<a href="http://fcc.gov">FCC</a>');

        //base layers
        baseLayer.Street = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
        baseLayer.Satellite = L.mapbox.tileLayer('fcc.k74d7n0g');
        baseLayer.Terrain = L.mapbox.tileLayer('fcc.k74cm3ol');

        //get tile layers based on location pathname
        for (var layer in layers[layerPath]) {
            mapLayer[layer] = L.tileLayer.wms(Map.geoURL, layers[layerPath][layer]).setZIndex(11).addTo(map);
        }

        //add Tribal and Urban layers
        mapLayer['Tribal'] = L.tileLayer.wms(Map.geoURL, layers.tribal);
        mapLayer['Urban'] = L.tileLayer.wms(Map.geoURL, layers.urban);

        //layer control
        layerControl = L.control.layers(
            baseLayer, mapLayer, {
                position: 'topleft'
            }
        ).addTo(map);

        hash = L.hash(map);

        Map.map = map;

        Map.geocoder = L.mapbox.geocoder('mapbox.places-v1');

    }, //end createMap
    update: function(e) {
        var cursorX;
        var cursorY;
        var clickX = 0;
        var clickY = 0;

        var lastTimestamp = 0;

        var timestamp = Date.now();

        if (lastTimestamp > 0 && timestamp - lastTimestamp < 1000) {
            lastTimestamp = timestamp;
            return;
        }

        lastTimestamp = timestamp;
        clickX = cursorX;
        clickY = cursorY;
        var lat = Math.round(1000000 * e.latlng.lat) / 1000000.0;
        var lon = Math.round(1000000 * e.latlng.lng) / 1000000.0;
        locationLat = lat;
        locationLon = lon;

        // removeBlockCountyLayers();

        Map.getCounty(lat, lon);
        setTimeout(function() { Map.getBlock(lat, lon); }, 200);

    }, //end update
    getCounty: function(lat, lon) {
        var geoURL = 'https://geo.fcc.gov/fcc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_county&maxFeatures=1&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';
        
        $.ajax({
            type: 'GET',
            url: geoURL,
            success: Map.showCounty
        });
    }, //end getCounty
    showCounty: function(data) {
        console.log(data);

        if (data.features.length === 0) {
            var county_text = 'No county data found at your searched/clicked location.';
            $('#display-county').html(county_text);
            return;
        }

        var id = data.features[0].id.replace(/\..*$/, '');

        if (id !== 'bpr_county') {
            return;
        }

        if (Map.map.hasLayer(clickedCountyLayer)) {
            Map.map.removeLayer(clickedCountyLayer);
        }

        clickedCountyLayer = L.mapbox.featureLayer(data).setStyle(clickedCountyStyle).addTo(Map.map);

        if (countyLayerData.features.length === 0 || countyLayerData.features[0].properties.county_fips !== data.features[0].properties.county_fips) {
            Map.map.fitBounds(clickedCountyLayer.getBounds());
        }

        clickedCountyLayer.on('click', function(e) {
            Map.update(e);
        });

        countyLayerData = data;
    }, //end showCounty
    getBlock: function(lat, lon) {
        var geoURL = 'https://geo.fcc.gov/fcc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_block_layer&maxFeatures=100&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';

        console.log('getBlock');
        console.log(lat);
        console.log(lon);

        $.ajax({
            type: 'GET',
            url: geoURL,
            success: Map.showBlock
        });
    },
    showBlock: function(data) { console.log(data);
        clickedBlockLayerData = data;

        if (Map.map.hasLayer(clickedBlockLayer)) {
            Map.map.removeLayer(clickedBlockLayer);
        }

        clickedBlockLayer = L.mapbox.featureLayer(clickedBlockLayerData).setStyle(clickedBlockStyle).addTo(Map.map);

        Map.setLocationMarker(locationLat, locationLon);
    },
    setLocationMarker: function(lat, lon) {
        if (Map.map.hasLayer(locationMarker)) {
            Map.map.removeLayer(locationMarker);
        }
        locationMarker = L.marker([lat, lon], { title: '' }).addTo(Map.map);

        locationMarker.on('click', function(e) {
            Map.zoomToBlock();
        });
    },
    zoomToBlock: function() {
        if (Map.map.hasLayer(clickedBlockLayer)) {
            Map.map.fitBounds(clickedBlockLayer.getBounds());
        }
    }
}; //end MapLayers

module.exports = Map;
