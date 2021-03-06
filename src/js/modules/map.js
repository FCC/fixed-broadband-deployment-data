'use strict';

var Hash = require('./hash.js');

var tableProviders = require('./table-providers.js');
var tableDemog = require('./table-demographics.js');
var chartDemog = require('./chart-demographics.js');
var chartFixed = require('./chart-fixed.js');
var chartNWFixed = require('./chart-fixedNationwide.js');
var chartSpeed = require('./chart-speed.js');

var layers = {
    deployment: require('./layers-deployment.js'),
    speed: require('./layers-speed.js'),
    providers: require('./layers-providers.js'),
    technology: require('./layers-tech.js'),
    tribal: {
        format: 'image/png',
        transparent: true,
        layers: 'bpr_tribal',
        styles: 'bpr_tribal',
        zIndex: 19
    },
    urban: {
        format: 'image/png',
        transparent: true,
        layers: 'fcc:bpr_county_layer_urban_only',
        styles: 'bpr_layer_urban',
        zIndex: 20
    }
};

var locationMarker;
var clickedCountyLayer;
var clickedCountyStyle = { color: '#00f', opacity: 0.5, fillOpacity: 0.1, fillColor: '#fff', weight: 3 };
var countyLayerData = { 'features': [] };

var clickedBlockLayer;
var clickedBlockStyle = { color: '#000', opacity: 0.5, fillOpacity: 0.1, fillColor: '#fff', weight: 3 };
var clickedBlockLayerData;

var BPRMap = {
    init: function() {

        // default map settings
        BPRMap.mapLayer = {};
        BPRMap.lat = 38.82;
        BPRMap.lon = -94.96;
        BPRMap.zoom = 4;

        // trigger hashchange and get map settings
        $(window).on('hashchange', Hash.change);
        Hash.change(BPRMap);
        BPRMap.createMap();

        BPRMap.map.on('click', BPRMap.update);
        BPRMap.map.on('zoomend', function() {
            Hash.update(BPRMap);
        });

        if (Hash.hasHash()) {
            BPRMap.getCounty(BPRMap.lat, BPRMap.lon);

            // use zoom value from hash only on initial page load
            BPRMap.hashZoom = true;
        }

        // toggle map container width
        $('.control-full').on('click', 'a', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('header .container, header .container-fluid, main')
                .toggleClass('container container-fluid')
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function() {
                        BPRMap.map.invalidateSize();
                        $('#table-providers').DataTable().columns.adjust().draw();
                    });
        });

    },
    createMap: function() {
        var maxzoom = 15;
        var minzoom = 3;
        var baseLayer = {};
        var layerControl;
        var layerPath = window.page;

        BPRMap.mapLayer = {};

        BPRMap.geoURL = window.GEOHOST + '/wms?tiled=true';

        L.mapbox.accessToken = 'pk.eyJ1IjoiZmNjIiwiYSI6InBiaGMyLU0ifQ.LOmVYpUCFv2yWpbvxDdQNg';
        BPRMap.map = L.mapbox.map('map-container').setView([BPRMap.lat, BPRMap.lon], BPRMap.zoom);

        BPRMap.map.attributionControl.addAttribution('<a href="http://fcc.gov">FCC</a>');

        //move Mapbox logo to top right
        $('#map-container').find('.leaflet-bottom.leaflet-left').toggleClass('leaflet-bottom leaflet-left leaflet-top leaflet-right');

        //base layers
        baseLayer.Street = L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10').addTo(BPRMap.map);
        baseLayer.Satellite = L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v11');
        baseLayer.Terrain = L.mapbox.styleLayer('mapbox://styles/mapbox/outdoors-v11');

        //get tile layers based on location pathname
        for (var layer in layers[layerPath]) {
            BPRMap.mapLayer[layer] = L.tileLayer.wms(BPRMap.geoURL, layers[layerPath][layer]).setZIndex(layers[layerPath][layer].zIndex).addTo(BPRMap.map);
        }

        //add Tribal and Urban layers
        BPRMap.mapLayer['Tribal'] = L.tileLayer.wms(BPRMap.geoURL, layers.tribal).setZIndex(layers.tribal.zIndex);
        BPRMap.mapLayer['Urban'] = L.tileLayer.wms(BPRMap.geoURL, layers.urban).setZIndex(layers.urban.zIndex);

        //layer control
        layerControl = L.control.layers(
            baseLayer, {}, {
                position: 'topleft'
            }
        ).addTo(BPRMap.map);

        BPRMap.geocoder = L.mapbox.geocoder('mapbox.places-v1');

        BPRMap.createLegend(layerPath);

        chartNWFixed.init();

        if (Hash.hasHash() === false) {
            chartSpeed.init('nw');
        }

        $('.leaflet-control-zoom-in, .leaflet-control-zoom-out').click(function() {
            Hash.update(BPRMap);
        });

    }, //end createMap
    createLegend: function(layerPath) {
        var li = '';
        var count = 0;

        for (var key in layers[layerPath]) {
            li += '<li>';
            li += '<input id="chk' + count + '" type="checkbox" data-layer="' + key + '" checked> ';
            li += '<div class="key-symbol" style="background-color:' + layers[layerPath][key].color + '"></div> ';
            li += '<label for="chk' + count + '">' + key + '</label>';
            li += '</li>';

            count++;
        }

        $('.map-legend')
            .find('ul').prepend(li)
            .end()
            .on('click', '[type=checkbox]', function() {
                var layerName = $(this).attr('data-layer');

                if (this.checked) {
                    BPRMap.mapLayer[layerName].addTo(BPRMap.map);
                } else {
                    BPRMap.map.removeLayer(BPRMap.mapLayer[layerName]);
                }

            });

        // Technology Map show legend
        $('#btn-closeLegend').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('.map-legend').hide('fast');
        });

        // Technology Map hide legend
        $('#btn-openLegend').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('.map-legend').show('fast');
        });
    },
    update: function(e) {
        BPRMap.lat = Math.round(1000000 * e.latlng.lat) / 1000000.0;
        BPRMap.lon = Math.round(1000000 * e.latlng.lng) / 1000000.0;
        
        // Fix lon when navigating between East/West hemispheres
        if (BPRMap.lon < -180) {
            BPRMap.lon = BPRMap.lon + 360;
        }

        if (BPRMap.lon > 180) {
            BPRMap.lon = BPRMap.lon - 360;
        }

        BPRMap.getCounty(BPRMap.lat, BPRMap.lon);

    }, //end update
    getCounty: function(lat, lon) {
        var geoURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_apr2017_county&maxFeatures=1&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';

        $.ajax({
            type: 'GET',
            url: geoURL
        }).done(function(data) {
            BPRMap.showCounty(data);            
        }).fail(function(){
            alert('Unable to access county data.');
        });
    }, //end getCounty
    showCounty: function(data) {
        var countyData;

        if (data.features.length === 0) {
            alert('No county data found at the seleted location. Please select a new location.');

            return;
        } else {
            countyData = data.features[0].properties;

            if ($('#tabInstructs').is(':visible')) {
                $('#tabInstructs, #nwFixed').addClass('hide');
                $('#fixed, #provider, #demographics').removeClass('hide');
            }
        }

        var id = data.features[0].id.replace(/\..*$/, '');

        if (id !== 'bpr_apr2017_county') {
            return;
        }

        if (BPRMap.map.hasLayer(clickedCountyLayer)) {
            BPRMap.map.removeLayer(clickedCountyLayer);
        }

        clickedCountyLayer = L.mapbox.featureLayer(data).setStyle(clickedCountyStyle).addTo(BPRMap.map);

        // use zoom value from hash only on initial page load
        if (BPRMap.hashZoom) {
            BPRMap.map.setView([BPRMap.lat, BPRMap.lon], BPRMap.zoom);
            BPRMap.hashZoom = false;
        } else if (countyLayerData.features.length === 0 || countyLayerData.features[0].properties.county_fips !== data.features[0].properties.county_fips) {
            BPRMap.map.fitBounds(clickedCountyLayer.getBounds());
        }

        clickedCountyLayer.on('click', function(e) {
            BPRMap.update(e);
        });

        countyLayerData = data;

        BPRMap.getBlock(BPRMap.lat, BPRMap.lon);

        tableDemog.create(countyData);
        chartDemog.init(countyData.county_fips, countyData);
        chartFixed.init(countyData.county_fips);
        chartSpeed.init(countyData.county_fips);

    }, //end showCounty
    getBlock: function(lat, lon) {
        var geoURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017&maxFeatures=100&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';

        $.ajax({
            type: 'GET',
            url: geoURL
        }).done(function(data) {
            BPRMap.showBlock(data);            
        }).fail(function(){
            alert('Unable to access block data.');
        });
    },
    showBlock: function(data) {
        var blockData = data.features[0].properties;

        clickedBlockLayerData = data;

        if (BPRMap.map.hasLayer(clickedBlockLayer)) {
            BPRMap.map.removeLayer(clickedBlockLayer);
        }

        clickedBlockLayer = L.mapbox.featureLayer(clickedBlockLayerData).setStyle(clickedBlockStyle).addTo(BPRMap.map);

        BPRMap.setLocationMarker(BPRMap.lat, BPRMap.lon);

        $('[data-fips]').text(blockData.block_fips);
        $('[data-rural]').text(blockData.urban_rural === 'R' ? 'Rural' : 'Urban');

        //update Providers table
        tableProviders.getData(blockData.block_fips);

        Hash.update(BPRMap);
    },
    setLocationMarker: function(lat, lon) {
        if (BPRMap.map.hasLayer(locationMarker)) {
            BPRMap.map.removeLayer(locationMarker);
        }
        locationMarker = L.marker([lat, lon], { title: '' }).addTo(BPRMap.map);

        locationMarker.on('click', function(e) {
            BPRMap.zoomToBlock();
        });
    },
    zoomToBlock: function() {
        if (BPRMap.map.hasLayer(clickedBlockLayer)) {
            BPRMap.map.fitBounds(clickedBlockLayer.getBounds());
        }
    }
}; //end MapLayers

module.exports = BPRMap;
