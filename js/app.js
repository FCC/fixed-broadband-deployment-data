(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');

    BPRMap.init();
    MapSearch.init();
}());

},{"./modules/map-search.js":6,"./modules/map.js":7}],2:[function(require,module,exports){
'use strict';

var layersDeployment = {};

//Deployment map layers
layersDeployment['Fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_county_layer_fixed',
    styles: 'bpr_layer_fixed_0'
};

layersDeployment['No fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_county_layer_nonfixed',
    styles: 'bpr_layer_fixed_1'
};

module.exports = layersDeployment;

},{}],3:[function(require,module,exports){
'use strict';

var layersProviders = {};

//Providers map layers
layersProviders['Zero fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_0',
    styles: 'bpr_dec2016_numprov_0'
};

layersProviders['One fixed 25 Mbps/3 Mbps provider'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_1',
    styles: 'bpr_dec2016_numprov_1'
};

layersProviders['Two fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_2',
    styles: 'bpr_dec2016_numprov_2'
};

layersProviders['Three or more fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_3',
    styles: 'bpr_dec2016_numprov_3'
};

module.exports = layersProviders;

},{}],4:[function(require,module,exports){
'use strict';

var layersSpeed = {};

//Speed map layers
layersSpeed['Residential services of at least 200 kbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed200',
    styles: 'bpr_dec2016_speed200'
};

layersSpeed['Residential broadband of at least 10 Mbps/1 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed10',
    styles: 'bpr_dec2016_speed10'
};

layersSpeed['Residential broadband of at least 25 Mbps/3 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed25',
    styles: 'bpr_dec2016_speed25'
};

layersSpeed['Residential broadband of at least 50 Mbps/5 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed50',
    styles: 'bpr_dec2016_speed50'
};

layersSpeed['Residential broadband of at least 100 Mbps/5 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed100',
    styles: 'bpr_dec2016_speed100'
};

module.exports = layersSpeed;

},{}],5:[function(require,module,exports){
'use strict';

var layersTech = {};

//Providers map layers
layersTech['FTTP'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_fiber',
    styles: 'bpr_dec2016_tech'
};

layersTech['Cable modem'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_cable',
    styles: 'bpr_dec2016_tech'
};

layersTech['DSL (inc. FTTN), other copper'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_adsl',
    styles: 'bpr_dec2016_tech'
};

layersTech['Fixed wireless'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_fw',
    styles: 'bpr_dec2016_tech'
};

layersTech['Other'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_other',
    styles: 'bpr_dec2016_tech'
};

module.exports = layersTech;

},{}],6:[function(require,module,exports){
    'use strict';

    var Map = require('./map.js');

    var MapSearch = {
        init: function() {
            $('#btn-locSearch').on('click', 'button', MapSearch.locChange);
            $('#btn-coordSearch').on('click', 'button', MapSearch.search_decimal);
            $('#btn-geoLocation').on('click', MapSearch.geoLocation);
            $("#btn-nationLocation").on('click', function() {
                Map.map.setView([50, -105], 3);
            });

            $("#input-search-switch").on('click', 'a', MapSearch.search_switch);

            $('#location-search')
                .autocomplete({
                    source: function(request, response) {
                        var location = request.term;
                        Map.geocoder.query(location, processAddress);

                        function processAddress(err, data) {
                            var f = data.results.features;
                            var addresses = [];

                            for (var i = 0; i < f.length; i++) {
                                addresses.push(f[i].place_name);
                            }
                            response(addresses);
                        }
                    },
                    minLength: 3,
                    select: function(event, ui) {
                        setTimeout(function() { MapSearch.locChange(); }, 200);
                    },
                    open: function() {
                        $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
                    },
                    close: function() {
                        $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
                    }
                })
                .keypress(function(e) {
                    var key = e.which;

                    if (key === 13) {
                        MapSearch.locChange();
                    }
                });

            $('#latitude, #longitude').keypress(function(e) {
                var key = e.which;

                if (key === 13) {
                    MapSearch.search_decimal();
                }
            });
        },
        locChange: function() {
            var loc = $("#location-search").val();
            Map.geocoder.query(loc, codeMap);

            function codeMap(err, data) {

                if (data.results.features.length === 0) {
                    alert("The address provided could not be found. Please enter a new address.");
                    return;
                }
                var lat = data.latlng[0];
                var lon = data.latlng[1];

                Map.map.setView([lat, lon], 14);

            }
        },
        search_decimal: function() {
            var lat = $('#latitude').val().replace(/ +/g, '');
            var lon = $('#longitude').val().replace(/ +/g, '');

            if (lat === '' || lon === '') {
                alert('Please enter lat/lon');
                return;
            }

            if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
                alert('Lat/Lon values out of range');
                return;
            }

            Map.map.setView([lat, lon], 14);
        },
        geoLocation: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geo_lat = position.coords.latitude;
                    var geo_lon = position.coords.longitude;
                    var geo_acc = position.coords.accuracy;

                    geo_lat = Math.round(geo_lat * 1000000) / 1000000.0;
                    geo_lon = Math.round(geo_lon * 1000000) / 1000000.0;

                    Map.map.setView([geo_lat, geo_lon], 14);

                }, function(error) {
                    alert('Sorry, your current location could not be determined. \nPlease use the search box to enter your location.');
                });
            } else {
                alert('Sorry, your current location could not be determined. \nPlease use the search box to enter your location.');
            }

            return false;
        },
        search_switch: function(e) {
            var search = $(e.currentTarget).data('value');

            e.preventDefault();

            if (search === 'loc') {
                $('#coord-search').addClass('hide');
                $('#btn-coordSearch').addClass('hide');

                $('#location-search').removeClass('hide');
                $('#btn-locSearch').removeClass('hide');
                $('#btn-label').text('Address');
            } else if (search === 'latlon-decimal') {
                $('#coord-search').removeClass('hide');
                $('#btn-coordSearch').removeClass('hide');

                $('#location-search').addClass('hide');
                $('#btn-locSearch').addClass('hide');
                $('#btn-label').text('Coordinates');
            }
        }
    };

    module.exports = MapSearch;
},{"./map.js":7}],7:[function(require,module,exports){
'use strict';

var tablePopulation = require('./table-population.js');

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

var BPRMap = {
    init: function() {

        BPRMap.createMap();

        // toggle map container width
        $('#map-container').on('click', '.control-full a', function() {
            $('header .container, header .container-fluid, main')
                .toggleClass('container container-fluid')
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function(e) {
                        BPRMap.map.invalidateSize();
                    });
        });

        BPRMap.map.on('click', BPRMap.update);

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
        //var map;
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

        BPRMap.geoURL = '/gwc/service/wms?tiled=true';
        BPRMap.geo_space = 'fcc';

        L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
        BPRMap.map = L.mapbox.map('map-container', 'fcc.k74ed5ge', {
                attributionControl: true,
                maxZoom: maxzoom,
                minZoom: minzoom,
                zoomControl: true
            })
            .setView([center_lat, center_lon], initialzoom);

        BPRMap.map.attributionControl.addAttribution('<a href="http://fcc.gov">FCC</a>');

        //base layers
        baseLayer.Street = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(BPRMap.map);
        baseLayer.Satellite = L.mapbox.tileLayer('fcc.k74d7n0g');
        baseLayer.Terrain = L.mapbox.tileLayer('fcc.k74cm3ol');

        //get tile layers based on location pathname
        for (var layer in layers[layerPath]) {
            mapLayer[layer] = L.tileLayer.wms(BPRMap.geoURL, layers[layerPath][layer]).setZIndex(11).addTo(BPRMap.map);
        }

        //add Tribal and Urban layers
        mapLayer['Tribal'] = L.tileLayer.wms(BPRMap.geoURL, layers.tribal);
        mapLayer['Urban'] = L.tileLayer.wms(BPRMap.geoURL, layers.urban);

        //layer control
        layerControl = L.control.layers(
            baseLayer, mapLayer, {
                position: 'topleft'
            }
        ).addTo(BPRMap.map);

        hash = L.hash(BPRMap.map);

        // Map.map = map;

        BPRMap.geocoder = L.mapbox.geocoder('mapbox.places-v1');

    }, //end createMap
    update: function(e) {
        /* var cursorX;
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
        clickY = cursorY;*/
        var lat = Math.round(1000000 * e.latlng.lat) / 1000000.0;
        var lon = Math.round(1000000 * e.latlng.lng) / 1000000.0;
        locationLat = lat;
        locationLon = lon;

        // removeBlockCountyLayers();

        BPRMap.getCounty(lat, lon);
        setTimeout(function() { BPRMap.getBlock(lat, lon); }, 200);

    }, //end update
    getCounty: function(lat, lon) {
        var geoURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county&maxFeatures=1&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';
        
        $.ajax({
            type: 'GET',
            url: geoURL,
            success: BPRMap.showCounty
        });
    }, //end getCounty
    showCounty: function(data) {
        var countyData = data.features[0].properties;

        if (data.features.length === 0) {
            var county_text = 'No county data found at your searched/clicked location.';
            $('#display-county').html(county_text);
            return;
        }

        var id = data.features[0].id.replace(/\..*$/, '');

        if (id !== 'bpr_dec2016_county') {
            return;
        }

        if (BPRMap.map.hasLayer(clickedCountyLayer)) {
            BPRMap.map.removeLayer(clickedCountyLayer);
        }

        clickedCountyLayer = L.mapbox.featureLayer(data).setStyle(clickedCountyStyle).addTo(BPRMap.map);

        if (countyLayerData.features.length === 0 || countyLayerData.features[0].properties.county_fips !== data.features[0].properties.county_fips) {
            BPRMap.map.fitBounds(clickedCountyLayer.getBounds());
        }

        clickedCountyLayer.on('click', function(e) {
            BPRMap.update(e);
        });

        countyLayerData = data;

        tablePopulation.create(countyData);        
        
    }, //end showCounty
    getBlock: function(lat, lon) {
        var geoURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016&maxFeatures=100&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';

        $.ajax({
            type: 'GET',
            url: geoURL,
            success: BPRMap.showBlock
        });
    },
    showBlock: function(data) {
        var blockData = data.features[0].properties;

        clickedBlockLayerData = data;

        if (BPRMap.map.hasLayer(clickedBlockLayer)) {
            BPRMap.map.removeLayer(clickedBlockLayer);
        }

        clickedBlockLayer = L.mapbox.featureLayer(clickedBlockLayerData).setStyle(clickedBlockStyle).addTo(BPRMap.map);

        BPRMap.setLocationMarker(locationLat, locationLon);

        $('[data-fips]').text(blockData.block_fips);
        $('[data-rural]').text(blockData.urban_rural === 'R' ? 'Rural':'Urban');
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

},{"./layers-deployment.js":2,"./layers-providers.js":3,"./layers-speed.js":4,"./layers-tech.js":5,"./table-population.js":8}],8:[function(require,module,exports){
'use strict';

var utility = require('./utility.js');

var tablePopulation = {
    create: function(countyData) {
    	var popData = {
			county_name: countyData.county_name,
			state_abbr: countyData.state_abbr,
			pop2015: countyData.pop2015,
			popdensity: countyData.popdensity,
			percapinc: countyData.percapinc,
			unspop25_3: countyData.unspop25_3,
			per_urbannofixed: countyData.per_urbannofixed,
			per_ruralnofixed: countyData.per_ruralnofixed
		};

		for (var propName in popData) {
			if (utility.isNull(popData[propName])) {
				popData[propName] = '';
			}
		}

        //populate Census Block table
        $('[data-county]').text(popData.county_name);
        $('[data-state]').text(popData.state_abbr);
        $('[data-totalPop]').text(utility.formatComma(popData.pop2015));
        $('[data-popDensity]').text(popData.popdensity);
        $('[data-incomeCapita]').text(utility.formatComma(popData.percapinc));
        $('[data-totalPopNoAccess]').text(utility.formatComma(popData.unspop25_3));
        $('[data-urbanPop]').text(utility.formatPercent(popData.per_urbannofixed));
        $('[data-ruralPop]').text(utility.formatPercent(popData.per_ruralnofixed));
    }
};

module.exports = tablePopulation;

},{"./utility.js":9}],9:[function(require,module,exports){
'use strict';

var utility = {
    isNull(fieldName) {
        return fieldName === null;
    },
    formatComma(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatPercent(num) {
        return (num * 100).toFixed(2) + '%';
    }
};

module.exports = utility;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLXNlYXJjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLXBvcHVsYXRpb24uanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIEJQUk1hcCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAuanMnKTtcclxuICAgIHZhciBNYXBTZWFyY2ggPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLXNlYXJjaC5qcycpO1xyXG5cclxuICAgIEJQUk1hcC5pbml0KCk7XHJcbiAgICBNYXBTZWFyY2guaW5pdCgpO1xyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzRGVwbG95bWVudCA9IHt9O1xyXG5cclxuLy9EZXBsb3ltZW50IG1hcCBsYXllcnNcclxubGF5ZXJzRGVwbG95bWVudFsnRml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnXHJcbn07XHJcblxyXG5sYXllcnNEZXBsb3ltZW50WydObyBmaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9ub25maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMSdcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzRGVwbG95bWVudDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1Byb3ZpZGVycyA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNQcm92aWRlcnNbJ1plcm8gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydPbmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1R3byBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1RocmVlIG9yIG1vcmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNQcm92aWRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNTcGVlZCA9IHt9O1xyXG5cclxuLy9TcGVlZCBtYXAgbGF5ZXJzXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBzZXJ2aWNlcyBvZiBhdCBsZWFzdCAyMDAga2JwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwIE1icHMvMSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDI1IE1icHMvMyBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDUwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwMCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1NwZWVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzVGVjaCA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNUZWNoWydGVFRQJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2ZpYmVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydDYWJsZSBtb2RlbSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9jYWJsZScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRFNMIChpbmMuIEZUVE4pLCBvdGhlciBjb3BwZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfYWRzbCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRml4ZWQgd2lyZWxlc3MnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfZncnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCdcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ090aGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX290aGVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1RlY2g7XHJcbiIsIiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIE1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XHJcblxyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLmxvY0NoYW5nZSk7XHJcbiAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1nZW9Mb2NhdGlvbicpLm9uKCdjbGljaycsIE1hcFNlYXJjaC5nZW9Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICQoXCIjYnRuLW5hdGlvbkxvY2F0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFs1MCwgLTEwNV0sIDMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjaW5wdXQtc2VhcmNoLXN3aXRjaFwiKS5vbignY2xpY2snLCAnYScsIE1hcFNlYXJjaC5zZWFyY2hfc3dpdGNoKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKVxyXG4gICAgICAgICAgICAgICAgLmF1dG9jb21wbGV0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSByZXF1ZXN0LnRlcm07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcC5nZW9jb2Rlci5xdWVyeShsb2NhdGlvbiwgcHJvY2Vzc0FkZHJlc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0FkZHJlc3MoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGRhdGEucmVzdWx0cy5mZWF0dXJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGYubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzZXMucHVzaChmW2ldLnBsYWNlX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoYWRkcmVzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTsgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItYWxsJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci10b3AnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLXRvcCcpLmFkZENsYXNzKCd1aS1jb3JuZXItYWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsYXRpdHVkZSwgI2xvbmdpdHVkZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9jQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9ICQoXCIjbG9jYXRpb24tc2VhcmNoXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICBNYXAuZ2VvY29kZXIucXVlcnkobG9jLCBjb2RlTWFwKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvZGVNYXAoZXJyLCBkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0cy5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBhZGRyZXNzIHByb3ZpZGVkIGNvdWxkIG5vdCBiZSBmb3VuZC4gUGxlYXNlIGVudGVyIGEgbmV3IGFkZHJlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBsYXQgPSBkYXRhLmxhdGxuZ1swXTtcclxuICAgICAgICAgICAgICAgIHZhciBsb24gPSBkYXRhLmxhdGxuZ1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2xhdCwgbG9uXSwgMTQpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX2RlY2ltYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbGF0ID0gJCgnI2xhdGl0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG4gICAgICAgICAgICB2YXIgbG9uID0gJCgnI2xvbmdpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXQgPT09ICcnIHx8IGxvbiA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgbGF0L2xvbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMobGF0KSA+IDkwIHx8IE1hdGguYWJzKGxvbikgPiAxODApIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdMYXQvTG9uIHZhbHVlcyBvdXQgb2YgcmFuZ2UnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFtsYXQsIGxvbl0sIDE0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdlb0xvY2F0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbGF0ID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbG9uID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2FjYyA9IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvX2xhdCA9IE1hdGgucm91bmQoZ2VvX2xhdCAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGdlb19sb24gPSBNYXRoLnJvdW5kKGdlb19sb24gKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFtnZW9fbGF0LCBnZW9fbG9uXSwgMTQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX3N3aXRjaDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VhcmNoID09PSAnbG9jJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdBZGRyZXNzJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09PSAnbGF0bG9uLWRlY2ltYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0Nvb3JkaW5hdGVzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFwU2VhcmNoOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB0YWJsZVBvcHVsYXRpb24gPSByZXF1aXJlKCcuL3RhYmxlLXBvcHVsYXRpb24uanMnKTtcclxuXHJcbnZhciBsYXllcnMgPSB7XHJcbiAgICBkZXBsb3ltZW50OiByZXF1aXJlKCcuL2xheWVycy1kZXBsb3ltZW50LmpzJyksXHJcbiAgICBzcGVlZDogcmVxdWlyZSgnLi9sYXllcnMtc3BlZWQuanMnKSxcclxuICAgIHByb3ZpZGVyczogcmVxdWlyZSgnLi9sYXllcnMtcHJvdmlkZXJzLmpzJyksXHJcbiAgICB0ZWNobm9sb2d5OiByZXF1aXJlKCcuL2xheWVycy10ZWNoLmpzJyksXHJcbiAgICB0cmliYWw6IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2Jwcl90cmliYWwnLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl90cmliYWwnXHJcbiAgICB9LFxyXG4gICAgdXJiYW46IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2ZjYzpicHJfY291bnR5X2xheWVyX3VyYmFuX29ubHknLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl9sYXllcl91cmJhbidcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBsb2NhdGlvbkxhdDtcclxudmFyIGxvY2F0aW9uTG9uO1xyXG52YXIgbG9jYXRpb25NYXJrZXI7XHJcbnZhciBjbGlja2VkQ291bnR5TGF5ZXI7XHJcbnZhciBjbGlja2VkQ291bnR5U3R5bGUgPSB7IGNvbG9yOiAnIzAwZicsIG9wYWNpdHk6IDAuNSwgZmlsbE9wYWNpdHk6IDAuMSwgZmlsbENvbG9yOiAnI2ZmZicsIHdlaWdodDogMyB9O1xyXG52YXIgY291bnR5TGF5ZXJEYXRhID0geyAnZmVhdHVyZXMnOiBbXSB9O1xyXG5cclxudmFyIGNsaWNrZWRCbG9ja0xheWVyO1xyXG52YXIgY2xpY2tlZEJsb2NrU3R5bGUgPSB7IGNvbG9yOiAnIzAwMCcsIG9wYWNpdHk6IDAuNSwgZmlsbE9wYWNpdHk6IDAuMSwgZmlsbENvbG9yOiAnI2ZmZicsIHdlaWdodDogMyB9O1xyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXJEYXRhO1xyXG5cclxudmFyIEJQUk1hcCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBCUFJNYXAuY3JlYXRlTWFwKCk7XHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBtYXAgY29udGFpbmVyIHdpZHRoXHJcbiAgICAgICAgJCgnI21hcC1jb250YWluZXInKS5vbignY2xpY2snLCAnLmNvbnRyb2wtZnVsbCBhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJ2hlYWRlciAuY29udGFpbmVyLCBoZWFkZXIgLmNvbnRhaW5lci1mbHVpZCwgbWFpbicpXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NvbnRhaW5lciBjb250YWluZXItZmx1aWQnKVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAub24oJ2NsaWNrJywgQlBSTWFwLnVwZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vbGVnZW5kXHJcbiAgICAgICAgLyppZiAoIW1hcE9wdHMubGVnZW5kKSB7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kLCAubGVnZW5kX19pY29uJykudG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJyNidG4tY2xvc2VMZWdlbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQnKS5oaWRlKCdmYXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNidG4tb3BlbkxlZ2VuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLnNob3coJ2Zhc3QnKTtcclxuICAgICAgICB9KTsqL1xyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVNYXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdmFyIG1hcDtcclxuICAgICAgICB2YXIgaGFzaDtcclxuICAgICAgICAvLyB2YXIgbWFwRGF0YSA9IE1hcC5kYXRhO1xyXG4gICAgICAgIHZhciBpbml0aWFsem9vbSA9IDQ7XHJcbiAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICB2YXIgbWluem9vbSA9IDM7XHJcbiAgICAgICAgdmFyIGNlbnRlcl9sYXQgPSAzOC44MjtcclxuICAgICAgICB2YXIgY2VudGVyX2xvbiA9IC05NC45NjtcclxuICAgICAgICB2YXIgYmFzZUxheWVyID0ge307XHJcbiAgICAgICAgdmFyIGxheWVyQ29udHJvbDtcclxuICAgICAgICB2YXIgbGF5ZXJQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJylbMV07XHJcbiAgICAgICAgdmFyIG1hcExheWVyID0ge307XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9VUkwgPSAnL2d3Yy9zZXJ2aWNlL3dtcz90aWxlZD10cnVlJztcclxuICAgICAgICBCUFJNYXAuZ2VvX3NwYWNlID0gJ2ZjYyc7XHJcblxyXG4gICAgICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pWTI5dGNIVjBaV05vSWl3aVlTSTZJbk15YmxNeWEzY2lmUS5QOHlwcGVzSGtpNXFNeXhUYzJDTkxnJztcclxuICAgICAgICBCUFJNYXAubWFwID0gTC5tYXBib3gubWFwKCdtYXAtY29udGFpbmVyJywgJ2ZjYy5rNzRlZDVnZScsIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1heFpvb206IG1heHpvb20sXHJcbiAgICAgICAgICAgICAgICBtaW5ab29tOiBtaW56b29tLFxyXG4gICAgICAgICAgICAgICAgem9vbUNvbnRyb2w6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnNldFZpZXcoW2NlbnRlcl9sYXQsIGNlbnRlcl9sb25dLCBpbml0aWFsem9vbSk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAuYXR0cmlidXRpb25Db250cm9sLmFkZEF0dHJpYnV0aW9uKCc8YSBocmVmPVwiaHR0cDovL2ZjYy5nb3ZcIj5GQ0M8L2E+Jyk7XHJcblxyXG4gICAgICAgIC8vYmFzZSBsYXllcnNcclxuICAgICAgICBiYXNlTGF5ZXIuU3RyZWV0ID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZWQ1Z2UnKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICBiYXNlTGF5ZXIuU2F0ZWxsaXRlID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZDduMGcnKTtcclxuICAgICAgICBiYXNlTGF5ZXIuVGVycmFpbiA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGNtM29sJyk7XHJcblxyXG4gICAgICAgIC8vZ2V0IHRpbGUgbGF5ZXJzIGJhc2VkIG9uIGxvY2F0aW9uIHBhdGhuYW1lXHJcbiAgICAgICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzW2xheWVyUGF0aF0pIHtcclxuICAgICAgICAgICAgbWFwTGF5ZXJbbGF5ZXJdID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVyc1tsYXllclBhdGhdW2xheWVyXSkuc2V0WkluZGV4KDExKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIFRyaWJhbCBhbmQgVXJiYW4gbGF5ZXJzXHJcbiAgICAgICAgbWFwTGF5ZXJbJ1RyaWJhbCddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy50cmliYWwpO1xyXG4gICAgICAgIG1hcExheWVyWydVcmJhbiddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy51cmJhbik7XHJcblxyXG4gICAgICAgIC8vbGF5ZXIgY29udHJvbFxyXG4gICAgICAgIGxheWVyQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoXHJcbiAgICAgICAgICAgIGJhc2VMYXllciwgbWFwTGF5ZXIsIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wbGVmdCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIGhhc2ggPSBMLmhhc2goQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIC8vIE1hcC5tYXAgPSBtYXA7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9jb2RlciA9IEwubWFwYm94Lmdlb2NvZGVyKCdtYXBib3gucGxhY2VzLXYxJyk7XHJcblxyXG4gICAgfSwgLy9lbmQgY3JlYXRlTWFwXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvKiB2YXIgY3Vyc29yWDtcclxuICAgICAgICB2YXIgY3Vyc29yWTtcclxuICAgICAgICB2YXIgY2xpY2tYID0gMDtcclxuICAgICAgICB2YXIgY2xpY2tZID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGxhc3RUaW1lc3RhbXAgPSAwO1xyXG5cclxuICAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICBpZiAobGFzdFRpbWVzdGFtcCA+IDAgJiYgdGltZXN0YW1wIC0gbGFzdFRpbWVzdGFtcCA8IDEwMDApIHtcclxuICAgICAgICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICBjbGlja1ggPSBjdXJzb3JYO1xyXG4gICAgICAgIGNsaWNrWSA9IGN1cnNvclk7Ki9cclxuICAgICAgICB2YXIgbGF0ID0gTWF0aC5yb3VuZCgxMDAwMDAwICogZS5sYXRsbmcubGF0KSAvIDEwMDAwMDAuMDtcclxuICAgICAgICB2YXIgbG9uID0gTWF0aC5yb3VuZCgxMDAwMDAwICogZS5sYXRsbmcubG5nKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICBsb2NhdGlvbkxhdCA9IGxhdDtcclxuICAgICAgICBsb2NhdGlvbkxvbiA9IGxvbjtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlQmxvY2tDb3VudHlMYXllcnMoKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdldENvdW50eShsYXQsIGxvbik7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKGxhdCwgbG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICB9LCAvL2VuZCB1cGRhdGVcclxuICAgIGdldENvdW50eTogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eSZtYXhGZWF0dXJlcz0xJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dDb3VudHlcclxuICAgICAgICB9KTtcclxuICAgIH0sIC8vZW5kIGdldENvdW50eVxyXG4gICAgc2hvd0NvdW50eTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBjb3VudHlEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50eV90ZXh0ID0gJ05vIGNvdW50eSBkYXRhIGZvdW5kIGF0IHlvdXIgc2VhcmNoZWQvY2xpY2tlZCBsb2NhdGlvbi4nO1xyXG4gICAgICAgICAgICAkKCcjZGlzcGxheS1jb3VudHknKS5odG1sKGNvdW50eV90ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGFibGVQb3B1bGF0aW9uLmNyZWF0ZShjb3VudHlEYXRhKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfSwgLy9lbmQgc2hvd0NvdW50eVxyXG4gICAgZ2V0QmxvY2s6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgdmFyIGdlb1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWJwcl9kZWMyMDE2Jm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvbnRhaW5zKGdlb20sJTIwUE9JTlQoJyArIGxvbiArICclMjAnICsgbGF0ICsgJykpJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogZ2VvVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBCUFJNYXAuc2hvd0Jsb2NrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Jsb2NrOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGJsb2NrRGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuXHJcbiAgICAgICAgY2xpY2tlZEJsb2NrTGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZEJsb2NrTGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXJEYXRhKS5zZXRTdHlsZShjbGlja2VkQmxvY2tTdHlsZSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5zZXRMb2NhdGlvbk1hcmtlcihsb2NhdGlvbkxhdCwgbG9jYXRpb25Mb24pO1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1maXBzXScpLnRleHQoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsXScpLnRleHQoYmxvY2tEYXRhLnVyYmFuX3J1cmFsID09PSAnUicgPyAnUnVyYWwnOidVcmJhbicpO1xyXG4gICAgfSxcclxuICAgIHNldExvY2F0aW9uTWFya2VyOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGxvY2F0aW9uTWFya2VyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGxvY2F0aW9uTWFya2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbbGF0LCBsb25dLCB7IHRpdGxlOiAnJyB9KS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBCUFJNYXAuem9vbVRvQmxvY2soKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB6b29tVG9CbG9jazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAuZml0Qm91bmRzKGNsaWNrZWRCbG9ja0xheWVyLmdldEJvdW5kcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IC8vZW5kIE1hcExheWVyc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCUFJNYXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgdGFibGVQb3B1bGF0aW9uID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQocG9wRGF0YS5wb3BkZW5zaXR5KTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUG9wdWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSB7XHJcbiAgICBpc051bGwoZmllbGROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkTmFtZSA9PT0gbnVsbDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRDb21tYShudW0pIHtcclxuICAgICAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRQZXJjZW50KG51bSkge1xyXG4gICAgICAgIHJldHVybiAobnVtICogMTAwKS50b0ZpeGVkKDIpICsgJyUnO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dGlsaXR5O1xyXG4iXX0=
