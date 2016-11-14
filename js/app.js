(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    var Map = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');

    Map.init();
    MapSearch.init();
}());

},{"./modules/map-search.js":2,"./modules/map.js":3}],2:[function(require,module,exports){
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
},{"./map.js":3}],3:[function(require,module,exports){
'use strict';

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
            // var mapData = Map.data;
            var initialzoom = 4;
            var maxzoom = 15;
            var minzoom = 3;
            var center_lat = 38.82;
            var center_lon = -94.96;
            var baseLayer = {};
            var mapLayer = {};
            var layerControl;

            var geoURL = '/gwc/service/wms?tiled=true';
            var geo_space = 'fcc';

            L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
            map = L.mapbox.map('map-container', 'fcc.k74ed5ge', {
                    attributionControl: true,
                    maxZoom: maxzoom,
                    minZoom: minzoom,
                    zoomControl: true
                })
                .setView([center_lat, center_lon], initialzoom);

            var hash = L.hash(map);

            //base layers
            baseLayer.Street = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
            baseLayer.Satellite = L.mapbox.tileLayer('fcc.k74d7n0g');
            baseLayer.Terrain = L.mapbox.tileLayer('fcc.k74cm3ol');           

            //map layers
            mapLayer['Fixed broadband 25/3 (Mbps)'] = L.tileLayer.wms(geoURL, {
                format: 'image/png',
                transparent: true,
                layers: 'bpr_dec2016_county_layer_fixed',
                styles: 'bpr_layer_fixed_0'
            }).setZIndex(11).addTo(map);

            mapLayer['No fixed broadband 25/3 (Mbps)'] = L.tileLayer.wms(geoURL, {
                format: 'image/png',
                transparent: true,
                layers: 'bpr_dec2016_county_layer_nonfixed',
                styles: 'bpr_layer_fixed_1'
            }).setZIndex(12).addTo(map);

            //layer control
            layerControl = new L.Control.Layers(
                baseLayer, mapLayer, {
                    position: 'topleft'
                }
            ).addTo(map);

            Map.map = map;

            Map.geocoder = L.mapbox.geocoder('mapbox.places-v1');

        } //end createMap
}; //end MapLayers


module.exports = Map;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC1zZWFyY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgTWFwID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC5qcycpO1xyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAtc2VhcmNoLmpzJyk7XHJcblxyXG4gICAgTWFwLmluaXQoKTtcclxuICAgIE1hcFNlYXJjaC5pbml0KCk7XHJcbn0oKSk7XHJcbiIsIiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIE1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XHJcblxyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLmxvY0NoYW5nZSk7XHJcbiAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1nZW9Mb2NhdGlvbicpLm9uKCdjbGljaycsIE1hcFNlYXJjaC5nZW9Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICQoXCIjYnRuLW5hdGlvbkxvY2F0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFs1MCwgLTEwNV0sIDMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjaW5wdXQtc2VhcmNoLXN3aXRjaFwiKS5vbignY2xpY2snLCAnYScsIE1hcFNlYXJjaC5zZWFyY2hfc3dpdGNoKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKVxyXG4gICAgICAgICAgICAgICAgLmF1dG9jb21wbGV0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSByZXF1ZXN0LnRlcm07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcC5nZW9jb2Rlci5xdWVyeShsb2NhdGlvbiwgcHJvY2Vzc0FkZHJlc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0FkZHJlc3MoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGRhdGEucmVzdWx0cy5mZWF0dXJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGYubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzZXMucHVzaChmW2ldLnBsYWNlX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoYWRkcmVzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTsgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItYWxsJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci10b3AnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLXRvcCcpLmFkZENsYXNzKCd1aS1jb3JuZXItYWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsYXRpdHVkZSwgI2xvbmdpdHVkZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9jQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9ICQoXCIjbG9jYXRpb24tc2VhcmNoXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICBNYXAuZ2VvY29kZXIucXVlcnkobG9jLCBjb2RlTWFwKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvZGVNYXAoZXJyLCBkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0cy5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBhZGRyZXNzIHByb3ZpZGVkIGNvdWxkIG5vdCBiZSBmb3VuZC4gUGxlYXNlIGVudGVyIGEgbmV3IGFkZHJlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBsYXQgPSBkYXRhLmxhdGxuZ1swXTtcclxuICAgICAgICAgICAgICAgIHZhciBsb24gPSBkYXRhLmxhdGxuZ1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2xhdCwgbG9uXSwgMTQpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX2RlY2ltYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbGF0ID0gJCgnI2xhdGl0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG4gICAgICAgICAgICB2YXIgbG9uID0gJCgnI2xvbmdpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXQgPT09ICcnIHx8IGxvbiA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgbGF0L2xvbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMobGF0KSA+IDkwIHx8IE1hdGguYWJzKGxvbikgPiAxODApIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdMYXQvTG9uIHZhbHVlcyBvdXQgb2YgcmFuZ2UnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFtsYXQsIGxvbl0sIDE0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdlb0xvY2F0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbGF0ID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbG9uID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2FjYyA9IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvX2xhdCA9IE1hdGgucm91bmQoZ2VvX2xhdCAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGdlb19sb24gPSBNYXRoLnJvdW5kKGdlb19sb24gKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFtnZW9fbGF0LCBnZW9fbG9uXSwgMTQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX3N3aXRjaDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VhcmNoID09PSAnbG9jJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdBZGRyZXNzJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09PSAnbGF0bG9uLWRlY2ltYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0Nvb3JkaW5hdGVzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFwU2VhcmNoOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBNYXAgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgTWFwLmNyZWF0ZU1hcCgpO1xyXG5cclxuICAgICAgICAvLyB0b2dnbGUgbWFwIGNvbnRhaW5lciB3aWR0aFxyXG4gICAgICAgICQoJyNtYXAtY29udGFpbmVyJykub24oJ2NsaWNrJywgJy5jb250cm9sLWZ1bGwgYScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCdoZWFkZXIgLmNvbnRhaW5lciwgaGVhZGVyIC5jb250YWluZXItZmx1aWQsIG1haW4nKVxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdjb250YWluZXIgY29udGFpbmVyLWZsdWlkJylcclxuICAgICAgICAgICAgICAgIC5vbmUoJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwLm1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2xlZ2VuZFxyXG4gICAgICAgIC8qaWYgKCFtYXBPcHRzLmxlZ2VuZCkge1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCwgLmxlZ2VuZF9faWNvbicpLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcjYnRuLWNsb3NlTGVnZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kJykuaGlkZSgnZmFzdCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjYnRuLW9wZW5MZWdlbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQnKS5zaG93KCdmYXN0Jyk7XHJcbiAgICAgICAgfSk7Ki9cclxuXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlTWFwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1hcDtcclxuICAgICAgICAgICAgLy8gdmFyIG1hcERhdGEgPSBNYXAuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGluaXRpYWx6b29tID0gNDtcclxuICAgICAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICAgICAgdmFyIG1pbnpvb20gPSAzO1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyX2xhdCA9IDM4LjgyO1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyX2xvbiA9IC05NC45NjtcclxuICAgICAgICAgICAgdmFyIGJhc2VMYXllciA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgbWFwTGF5ZXIgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGxheWVyQ29udHJvbDtcclxuXHJcbiAgICAgICAgICAgIHZhciBnZW9VUkwgPSAnL2d3Yy9zZXJ2aWNlL3dtcz90aWxlZD10cnVlJztcclxuICAgICAgICAgICAgdmFyIGdlb19zcGFjZSA9ICdmY2MnO1xyXG5cclxuICAgICAgICAgICAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lZMjl0Y0hWMFpXTm9JaXdpWVNJNkluTXlibE15YTNjaWZRLlA4eXBwZXNIa2k1cU15eFRjMkNOTGcnO1xyXG4gICAgICAgICAgICBtYXAgPSBMLm1hcGJveC5tYXAoJ21hcC1jb250YWluZXInLCAnZmNjLms3NGVkNWdlJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXhab29tOiBtYXh6b29tLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pblpvb206IG1pbnpvb20sXHJcbiAgICAgICAgICAgICAgICAgICAgem9vbUNvbnRyb2w6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2VudGVyX2xhdCwgY2VudGVyX2xvbl0sIGluaXRpYWx6b29tKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBoYXNoID0gTC5oYXNoKG1hcCk7XHJcblxyXG4gICAgICAgICAgICAvL2Jhc2UgbGF5ZXJzXHJcbiAgICAgICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRlZDVnZScpLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRkN24wZycpO1xyXG4gICAgICAgICAgICBiYXNlTGF5ZXIuVGVycmFpbiA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGNtM29sJyk7ICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIC8vbWFwIGxheWVyc1xyXG4gICAgICAgICAgICBtYXBMYXllclsnRml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSBMLnRpbGVMYXllci53bXMoZ2VvVVJMLCB7XHJcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfZml4ZWQnLFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnXHJcbiAgICAgICAgICAgIH0pLnNldFpJbmRleCgxMSkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgIG1hcExheWVyWydObyBmaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IEwudGlsZUxheWVyLndtcyhnZW9VUkwsIHtcclxuICAgICAgICAgICAgICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9ub25maXhlZCcsXHJcbiAgICAgICAgICAgICAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMSdcclxuICAgICAgICAgICAgfSkuc2V0WkluZGV4KDEyKS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgLy9sYXllciBjb250cm9sXHJcbiAgICAgICAgICAgIGxheWVyQ29udHJvbCA9IG5ldyBMLkNvbnRyb2wuTGF5ZXJzKFxyXG4gICAgICAgICAgICAgICAgYmFzZUxheWVyLCBtYXBMYXllciwge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wbGVmdCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgTWFwLm1hcCA9IG1hcDtcclxuXHJcbiAgICAgICAgICAgIE1hcC5nZW9jb2RlciA9IEwubWFwYm94Lmdlb2NvZGVyKCdtYXBib3gucGxhY2VzLXYxJyk7XHJcblxyXG4gICAgICAgIH0gLy9lbmQgY3JlYXRlTWFwXHJcbn07IC8vZW5kIE1hcExheWVyc1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwO1xyXG4iXX0=
