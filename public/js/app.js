(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    var Map = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');

    Map.init();
    MapSearch.init();
}());

},{"./modules/map-search.js":5,"./modules/map.js":6}],2:[function(require,module,exports){
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
},{"./map.js":6}],6:[function(require,module,exports){
'use strict';

var layers = {
    deployment: require('./layers-deployment.js'),
    speed: require('./layers-speed.js'),
    providers: require('./layers-providers.js'),
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

        } //end createMap
}; //end MapLayers

module.exports = Map;

},{"./layers-deployment.js":2,"./layers-providers.js":3,"./layers-speed.js":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC1zZWFyY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIE1hcCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAuanMnKTtcclxuICAgIHZhciBNYXBTZWFyY2ggPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLXNlYXJjaC5qcycpO1xyXG5cclxuICAgIE1hcC5pbml0KCk7XHJcbiAgICBNYXBTZWFyY2guaW5pdCgpO1xyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzRGVwbG95bWVudCA9IHt9O1xyXG5cclxuLy9EZXBsb3ltZW50IG1hcCBsYXllcnNcclxubGF5ZXJzRGVwbG95bWVudFsnRml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnXHJcbn07XHJcblxyXG5sYXllcnNEZXBsb3ltZW50WydObyBmaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9ub25maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMSdcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzRGVwbG95bWVudDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1Byb3ZpZGVycyA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNQcm92aWRlcnNbJ1plcm8gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydPbmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1R3byBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1RocmVlIG9yIG1vcmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNQcm92aWRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNTcGVlZCA9IHt9O1xyXG5cclxuLy9TcGVlZCBtYXAgbGF5ZXJzXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBzZXJ2aWNlcyBvZiBhdCBsZWFzdCAyMDAga2JwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwIE1icHMvMSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDI1IE1icHMvMyBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDUwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwMCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1NwZWVkO1xyXG4iLCIgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBNYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xyXG5cclxuICAgIHZhciBNYXBTZWFyY2ggPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5sb2NDaGFuZ2UpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCk7XHJcbiAgICAgICAgICAgICQoJyNidG4tZ2VvTG9jYXRpb24nKS5vbignY2xpY2snLCBNYXBTZWFyY2guZ2VvTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAkKFwiI2J0bi1uYXRpb25Mb2NhdGlvblwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbNTAsIC0xMDVdLCAzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2lucHV0LXNlYXJjaC1zd2l0Y2hcIikub24oJ2NsaWNrJywgJ2EnLCBNYXBTZWFyY2guc2VhcmNoX3N3aXRjaCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJylcclxuICAgICAgICAgICAgICAgIC5hdXRvY29tcGxldGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24ocmVxdWVzdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gcmVxdWVzdC50ZXJtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXAuZ2VvY29kZXIucXVlcnkobG9jYXRpb24sIHByb2Nlc3NBZGRyZXNzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NBZGRyZXNzKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBkYXRhLnJlc3VsdHMuZmVhdHVyZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc2VzLnB1c2goZltpXS5wbGFjZV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGFkZHJlc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7IH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLWFsbCcpLmFkZENsYXNzKCd1aS1jb3JuZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci10b3AnKS5hZGRDbGFzcygndWktY29ybmVyLWFsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbGF0aXR1ZGUsICNsb25naXR1ZGUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvY0NoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSAkKFwiI2xvY2F0aW9uLXNlYXJjaFwiKS52YWwoKTtcclxuICAgICAgICAgICAgTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvYywgY29kZU1hcCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb2RlTWFwKGVyciwgZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdHMuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgYWRkcmVzcyBwcm92aWRlZCBjb3VsZCBub3QgYmUgZm91bmQuIFBsZWFzZSBlbnRlciBhIG5ldyBhZGRyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0ID0gZGF0YS5sYXRsbmdbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9uID0gZGF0YS5sYXRsbmdbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFtsYXQsIGxvbl0sIDE0KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9kZWNpbWFsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxhdCA9ICQoJyNsYXRpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuICAgICAgICAgICAgdmFyIGxvbiA9ICQoJyNsb25naXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGF0ID09PSAnJyB8fCBsb24gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVudGVyIGxhdC9sb24nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGxhdCkgPiA5MCB8fCBNYXRoLmFicyhsb24pID4gMTgwKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnTGF0L0xvbiB2YWx1ZXMgb3V0IG9mIHJhbmdlJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbbGF0LCBsb25dLCAxNCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZW9Mb2NhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xhdCA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xvbiA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19hY2MgPSBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdlb19sYXQgPSBNYXRoLnJvdW5kKGdlb19sYXQgKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICAgICAgICAgICAgICBnZW9fbG9uID0gTWF0aC5yb3VuZChnZW9fbG9uICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbZ2VvX2xhdCwgZ2VvX2xvbl0sIDE0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9zd2l0Y2g6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlYXJjaCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCd2YWx1ZScpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlYXJjaCA9PT0gJ2xvYycpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQWRkcmVzcycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PT0gJ2xhdGxvbi1kZWNpbWFsJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdDb29yZGluYXRlcycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hcFNlYXJjaDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzID0ge1xyXG4gICAgZGVwbG95bWVudDogcmVxdWlyZSgnLi9sYXllcnMtZGVwbG95bWVudC5qcycpLFxyXG4gICAgc3BlZWQ6IHJlcXVpcmUoJy4vbGF5ZXJzLXNwZWVkLmpzJyksXHJcbiAgICBwcm92aWRlcnM6IHJlcXVpcmUoJy4vbGF5ZXJzLXByb3ZpZGVycy5qcycpLFxyXG4gICAgdHJpYmFsOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdicHJfdHJpYmFsJyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfdHJpYmFsJ1xyXG4gICAgfSxcclxuICAgIHVyYmFuOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdmY2M6YnByX2NvdW50eV9sYXllcl91cmJhbl9vbmx5JyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfbGF5ZXJfdXJiYW4nXHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgTWFwID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIE1hcC5jcmVhdGVNYXAoKTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIG1hcCBjb250YWluZXIgd2lkdGhcclxuICAgICAgICAkKCcjbWFwLWNvbnRhaW5lcicpLm9uKCdjbGljaycsICcuY29udHJvbC1mdWxsIGEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnaGVhZGVyIC5jb250YWluZXIsIGhlYWRlciAuY29udGFpbmVyLWZsdWlkLCBtYWluJylcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcygnY29udGFpbmVyIGNvbnRhaW5lci1mbHVpZCcpXHJcbiAgICAgICAgICAgICAgICAub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcC5tYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9sZWdlbmRcclxuICAgICAgICAvKmlmICghbWFwT3B0cy5sZWdlbmQpIHtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQsIC5sZWdlbmRfX2ljb24nKS50b2dnbGVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnI2J0bi1jbG9zZUxlZ2VuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLmhpZGUoJ2Zhc3QnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI2J0bi1vcGVuTGVnZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kJykuc2hvdygnZmFzdCcpO1xyXG4gICAgICAgIH0pOyovXHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXA7XHJcbiAgICAgICAgICAgIHZhciBoYXNoO1xyXG4gICAgICAgICAgICAvLyB2YXIgbWFwRGF0YSA9IE1hcC5kYXRhO1xyXG4gICAgICAgICAgICB2YXIgaW5pdGlhbHpvb20gPSA0O1xyXG4gICAgICAgICAgICB2YXIgbWF4em9vbSA9IDE1O1xyXG4gICAgICAgICAgICB2YXIgbWluem9vbSA9IDM7XHJcbiAgICAgICAgICAgIHZhciBjZW50ZXJfbGF0ID0gMzguODI7XHJcbiAgICAgICAgICAgIHZhciBjZW50ZXJfbG9uID0gLTk0Ljk2O1xyXG4gICAgICAgICAgICB2YXIgYmFzZUxheWVyID0ge307XHJcbiAgICAgICAgICAgIHZhciBsYXllckNvbnRyb2w7XHJcbiAgICAgICAgICAgIHZhciBsYXllclBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKVsxXTtcclxuICAgICAgICAgICAgdmFyIG1hcExheWVyID0ge307XHJcblxyXG4gICAgICAgICAgICBNYXAuZ2VvVVJMID0gJy9nd2Mvc2VydmljZS93bXM/dGlsZWQ9dHJ1ZSc7XHJcbiAgICAgICAgICAgIE1hcC5nZW9fc3BhY2UgPSAnZmNjJztcclxuXHJcbiAgICAgICAgICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pWTI5dGNIVjBaV05vSWl3aVlTSTZJbk15YmxNeWEzY2lmUS5QOHlwcGVzSGtpNXFNeXhUYzJDTkxnJztcclxuICAgICAgICAgICAgbWFwID0gTC5tYXBib3gubWFwKCdtYXAtY29udGFpbmVyJywgJ2ZjYy5rNzRlZDVnZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4Wm9vbTogbWF4em9vbSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5ab29tOiBtaW56b29tLFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnNldFZpZXcoW2NlbnRlcl9sYXQsIGNlbnRlcl9sb25dLCBpbml0aWFsem9vbSk7XHJcblxyXG4gICAgICAgICAgICBtYXAuYXR0cmlidXRpb25Db250cm9sLmFkZEF0dHJpYnV0aW9uKCc8YSBocmVmPVwiaHR0cDovL2ZjYy5nb3ZcIj5GQ0M8L2E+Jyk7XHJcblxyXG4gICAgICAgICAgICAvL2Jhc2UgbGF5ZXJzXHJcbiAgICAgICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRlZDVnZScpLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRkN24wZycpO1xyXG4gICAgICAgICAgICBiYXNlTGF5ZXIuVGVycmFpbiA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGNtM29sJyk7XHJcblxyXG4gICAgICAgICAgICAvL2dldCB0aWxlIGxheWVycyBiYXNlZCBvbiBsb2NhdGlvbiBwYXRobmFtZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBsYXllciBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICAgICAgbWFwTGF5ZXJbbGF5ZXJdID0gTC50aWxlTGF5ZXIud21zKE1hcC5nZW9VUkwsIGxheWVyc1tsYXllclBhdGhdW2xheWVyXSkuc2V0WkluZGV4KDExKS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2FkZCBUcmliYWwgYW5kIFVyYmFuIGxheWVyc1xyXG4gICAgICAgICAgICBtYXBMYXllclsnVHJpYmFsJ10gPSBMLnRpbGVMYXllci53bXMoTWFwLmdlb1VSTCwgbGF5ZXJzLnRyaWJhbCk7XHJcbiAgICAgICAgICAgIG1hcExheWVyWydVcmJhbiddID0gTC50aWxlTGF5ZXIud21zKE1hcC5nZW9VUkwsIGxheWVycy51cmJhbik7XHJcblxyXG4gICAgICAgICAgICAvL2xheWVyIGNvbnRyb2xcclxuICAgICAgICAgICAgbGF5ZXJDb250cm9sID0gTC5jb250cm9sLmxheWVycyhcclxuICAgICAgICAgICAgICAgIGJhc2VMYXllciwgbWFwTGF5ZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgIGhhc2ggPSBMLmhhc2gobWFwKTtcclxuXHJcbiAgICAgICAgICAgIE1hcC5tYXAgPSBtYXA7XHJcblxyXG4gICAgICAgICAgICBNYXAuZ2VvY29kZXIgPSBMLm1hcGJveC5nZW9jb2RlcignbWFwYm94LnBsYWNlcy12MScpO1xyXG5cclxuICAgICAgICB9IC8vZW5kIGNyZWF0ZU1hcFxyXG59OyAvL2VuZCBNYXBMYXllcnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwO1xyXG4iXX0=
