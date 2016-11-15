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
    providers: require('./layers-providers.js')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC1zZWFyY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBNYXAgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLmpzJyk7XHJcbiAgICB2YXIgTWFwU2VhcmNoID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC1zZWFyY2guanMnKTtcclxuXHJcbiAgICBNYXAuaW5pdCgpO1xyXG4gICAgTWFwU2VhcmNoLmluaXQoKTtcclxufSgpKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc0RlcGxveW1lbnQgPSB7fTtcclxuXHJcbi8vRGVwbG95bWVudCBtYXAgbGF5ZXJzXHJcbmxheWVyc0RlcGxveW1lbnRbJ0ZpeGVkIGJyb2FkYmFuZCAyNS8zIChNYnBzKSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfY291bnR5X2xheWVyX2ZpeGVkJyxcclxuICAgIHN0eWxlczogJ2Jwcl9sYXllcl9maXhlZF8wJ1xyXG59O1xyXG5cclxubGF5ZXJzRGVwbG95bWVudFsnTm8gZml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfbm9uZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzEnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc0RlcGxveW1lbnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNQcm92aWRlcnMgPSB7fTtcclxuXHJcbi8vUHJvdmlkZXJzIG1hcCBsYXllcnNcclxubGF5ZXJzUHJvdmlkZXJzWydaZXJvIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCdcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snT25lIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUd28gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUaHJlZSBvciBtb3JlIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMydcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzU3BlZWQgPSB7fTtcclxuXHJcbi8vU3BlZWQgbWFwIGxheWVyc1xyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgc2VydmljZXMgb2YgYXQgbGVhc3QgMjAwIGticHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJ1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMCBNYnBzLzEgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJ1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAyNSBNYnBzLzMgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyNScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDI1J1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCA1MCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQ1MCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJ1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMDAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNTcGVlZDtcclxuIiwiICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgTWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcclxuXHJcbiAgICB2YXIgTWFwU2VhcmNoID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2gubG9jQ2hhbmdlKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWdlb0xvY2F0aW9uJykub24oJ2NsaWNrJywgTWFwU2VhcmNoLmdlb0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgJChcIiNidG4tbmF0aW9uTG9jYXRpb25cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoWzUwLCAtMTA1XSwgMyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJChcIiNpbnB1dC1zZWFyY2gtc3dpdGNoXCIpLm9uKCdjbGljaycsICdhJywgTWFwU2VhcmNoLnNlYXJjaF9zd2l0Y2gpO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgICAuYXV0b2NvbXBsZXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcXVlc3QudGVybTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvY2F0aW9uLCBwcm9jZXNzQWRkcmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzQWRkcmVzcyhlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZGF0YS5yZXN1bHRzLmZlYXR1cmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3Nlcy5wdXNoKGZbaV0ucGxhY2VfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZShhZGRyZXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgTWFwU2VhcmNoLmxvY0NoYW5nZSgpOyB9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKS5hZGRDbGFzcygndWktY29ybmVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItdG9wJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLmxvY0NoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xhdGl0dWRlLCAjbG9uZ2l0dWRlJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2NDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gJChcIiNsb2NhdGlvbi1zZWFyY2hcIikudmFsKCk7XHJcbiAgICAgICAgICAgIE1hcC5nZW9jb2Rlci5xdWVyeShsb2MsIGNvZGVNYXApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29kZU1hcChlcnIsIGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHRzLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGFkZHJlc3MgcHJvdmlkZWQgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgZW50ZXIgYSBuZXcgYWRkcmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGxhdCA9IGRhdGEubGF0bG5nWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvbiA9IGRhdGEubGF0bG5nWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbbGF0LCBsb25dLCAxNCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfZGVjaW1hbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsYXQgPSAkKCcjbGF0aXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBsb24gPSAkKCcjbG9uZ2l0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxhdCA9PT0gJycgfHwgbG9uID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciBsYXQvbG9uJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhsYXQpID4gOTAgfHwgTWF0aC5hYnMobG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xhdC9Mb24gdmFsdWVzIG91dCBvZiByYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2xhdCwgbG9uXSwgMTQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2VvTG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sb24gPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fYWNjID0gcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBnZW9fbGF0ID0gTWF0aC5yb3VuZChnZW9fbGF0ICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvX2xvbiA9IE1hdGgucm91bmQoZ2VvX2xvbiAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2dlb19sYXQsIGdlb19sb25dLCAxNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfc3dpdGNoOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2ggPT09ICdsb2MnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0FkZHJlc3MnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT09ICdsYXRsb24tZGVjaW1hbCcpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQ29vcmRpbmF0ZXMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXBTZWFyY2g7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVycyA9IHtcclxuICAgIGRlcGxveW1lbnQ6IHJlcXVpcmUoJy4vbGF5ZXJzLWRlcGxveW1lbnQuanMnKSxcclxuICAgIHNwZWVkOiByZXF1aXJlKCcuL2xheWVycy1zcGVlZC5qcycpLFxyXG4gICAgcHJvdmlkZXJzOiByZXF1aXJlKCcuL2xheWVycy1wcm92aWRlcnMuanMnKVxyXG59O1xyXG5cclxudmFyIE1hcCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBNYXAuY3JlYXRlTWFwKCk7XHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBtYXAgY29udGFpbmVyIHdpZHRoXHJcbiAgICAgICAgJCgnI21hcC1jb250YWluZXInKS5vbignY2xpY2snLCAnLmNvbnRyb2wtZnVsbCBhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJ2hlYWRlciAuY29udGFpbmVyLCBoZWFkZXIgLmNvbnRhaW5lci1mbHVpZCwgbWFpbicpXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NvbnRhaW5lciBjb250YWluZXItZmx1aWQnKVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXAubWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vbGVnZW5kXHJcbiAgICAgICAgLyppZiAoIW1hcE9wdHMubGVnZW5kKSB7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kLCAubGVnZW5kX19pY29uJykudG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJyNidG4tY2xvc2VMZWdlbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQnKS5oaWRlKCdmYXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNidG4tb3BlbkxlZ2VuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLnNob3coJ2Zhc3QnKTtcclxuICAgICAgICB9KTsqL1xyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVNYXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbWFwO1xyXG4gICAgICAgICAgICB2YXIgaGFzaDtcclxuICAgICAgICAgICAgLy8gdmFyIG1hcERhdGEgPSBNYXAuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGluaXRpYWx6b29tID0gNDtcclxuICAgICAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICAgICAgdmFyIG1pbnpvb20gPSAzO1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyX2xhdCA9IDM4LjgyO1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyX2xvbiA9IC05NC45NjtcclxuICAgICAgICAgICAgdmFyIGJhc2VMYXllciA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgbGF5ZXJDb250cm9sO1xyXG4gICAgICAgICAgICB2YXIgbGF5ZXJQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJylbMV07XHJcbiAgICAgICAgICAgIHZhciBtYXBMYXllciA9IHt9O1xyXG5cclxuICAgICAgICAgICAgTWFwLmdlb1VSTCA9ICcvZ3djL3NlcnZpY2Uvd21zP3RpbGVkPXRydWUnO1xyXG4gICAgICAgICAgICBNYXAuZ2VvX3NwYWNlID0gJ2ZjYyc7XHJcblxyXG4gICAgICAgICAgICBMLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaVkyOXRjSFYwWldOb0lpd2lZU0k2SW5NeWJsTXlhM2NpZlEuUDh5cHBlc0hraTVxTXl4VGMyQ05MZyc7XHJcbiAgICAgICAgICAgIG1hcCA9IEwubWFwYm94Lm1hcCgnbWFwLWNvbnRhaW5lcicsICdmY2Muazc0ZWQ1Z2UnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb25Db250cm9sOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heFpvb206IG1heHpvb20sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWm9vbTogbWluem9vbSxcclxuICAgICAgICAgICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5zZXRWaWV3KFtjZW50ZXJfbGF0LCBjZW50ZXJfbG9uXSwgaW5pdGlhbHpvb20pO1xyXG5cclxuICAgICAgICAgICAgbWFwLmF0dHJpYnV0aW9uQ29udHJvbC5hZGRBdHRyaWJ1dGlvbignPGEgaHJlZj1cImh0dHA6Ly9mY2MuZ292XCI+RkNDPC9hPicpOyAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLy9iYXNlIGxheWVyc1xyXG4gICAgICAgICAgICBiYXNlTGF5ZXIuU3RyZWV0ID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZWQ1Z2UnKS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICBiYXNlTGF5ZXIuU2F0ZWxsaXRlID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZDduMGcnKTtcclxuICAgICAgICAgICAgYmFzZUxheWVyLlRlcnJhaW4gPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRjbTNvbCcpO1xyXG5cclxuICAgICAgICAgICAgLy9nZXQgdGlsZSBsYXllcnMgYmFzZWQgb24gbG9jYXRpb24gcGF0aG5hbWVcclxuICAgICAgICAgICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzW2xheWVyUGF0aF0pIHtcclxuICAgICAgICAgICAgICAgIG1hcExheWVyW2xheWVyXSA9IEwudGlsZUxheWVyLndtcyhNYXAuZ2VvVVJMLCBsYXllcnNbbGF5ZXJQYXRoXVtsYXllcl0pLnNldFpJbmRleCgxMSkuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9sYXllciBjb250cm9sXHJcbiAgICAgICAgICAgIGxheWVyQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoXHJcbiAgICAgICAgICAgICAgICBiYXNlTGF5ZXIsIG1hcExheWVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgICAgICBoYXNoID0gTC5oYXNoKG1hcCk7XHJcblxyXG4gICAgICAgICAgICBNYXAubWFwID0gbWFwO1xyXG5cclxuICAgICAgICAgICAgTWFwLmdlb2NvZGVyID0gTC5tYXBib3guZ2VvY29kZXIoJ21hcGJveC5wbGFjZXMtdjEnKTtcclxuXHJcbiAgICAgICAgfSAvL2VuZCBjcmVhdGVNYXBcclxufTsgLy9lbmQgTWFwTGF5ZXJzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcclxuIl19
