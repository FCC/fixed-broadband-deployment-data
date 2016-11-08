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
    data: {},
    map: undefined,
    geocoder: undefined,
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
            var mapData = Map.data;
            var initialzoom = 4;
            var maxzoom = 15;
            var minzoom = 3;
            var center_lat = 38.82;
            var center_lon = -94.96;
            var baseLayer = {};
            var layerControl;

            // initialzoom = mapData.init.zoom;
            // maxzoom = mapData.config.zoom.max || maxzoom;
            // minzoom = mapData.config.zoom.min || minzoom;
            // center_lat = mapData.init.lat || center_lat;
            // center_lon = mapData.init.lon || center_lon;

            L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
            map = L.mapbox.map('map-container', 'fcc.k74ed5ge', {
                    attributionControl: true,
                    maxZoom: maxzoom,
                    minZoom: minzoom,
                    zoomControl: true
                })
                .setView([center_lat, center_lon], initialzoom);

            var hash = L.hash(map);

            var baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge');
            var baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
            var baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');

            //base layers
            baseLayer.Street = baseStreet.addTo(map);
            baseLayer.Satellite = baseSatellite;
            baseLayer.Terrain = baseTerrain;

            // if (mapData.map_basemap && mapData.map_basemap[0].toLowerCase() == "street") {
            //     baseLayer["Street"] = baseStreet.addTo(map);
            //     baseLayer["Satellite"] = baseSatellite;
            //     baseLayer["Terrain"] = baseTerrain;
            // } else if (mapData.map_basemap && mapData.map_basemap[0].toLowerCase() == "satellite") {
            //     baseLayer["Street"] = baseStreet;
            //     baseLayer["Satellite"] = baseSatellite.addTo(map);
            //     baseLayer["Terrain"] = baseTerrain;
            // } else if (mapData.map_basemap && mapData.map_basemap[0].toLowerCase() == "terrain") {
            //     baseLayer["Street"] = baseStreet;
            //     baseLayer["Satellite"] = baseSatellite;
            //     baseLayer["Terrain"] = baseTerrain.addTo(map);
            // }

            //map layers
            var mapLayer = {};
            var zindex1 = 10;

            /*if (mapData.layers.length > 0) {
                for (var i = 0; i < mapData.layers.length; i++) {
                    zindex1++;

                    if (mapData.layers[i].type == 'XYZ') {

                        var title = mapData.layers[i].title;
                        if (title == '') {
                            title = '' + i;
                        }

                        var query = mapData.layers[i].query;
                        if (query === '') {
                            query = 'access_token=pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
                        }

                        var url = '//' + mapData.layers[i].domain + '/{z}/{x}/{y}.png?' + query;

                        mapLayer[title] = L.tileLayer(url, {
                            opacity: mapData.layers[i].opacity,
                            zIndex: zindex1
                        });

                        if (mapData.layers[i].visibile === true) {
                            mapLayer[title].addTo(map);
                        }
                    } else if (mapData.layers[i].type === 'WMS') {
                        var titleWMS = mapData.layers[i].title;
                        if (titleWMS === '') {
                            titleWMS = '' + i;
                        }

                        mapLayer[titleWMS] = L.tileLayer.wms(mapData.layers[i].protocol + '://' + mapData.layers[i].domain + '/wms', {
                            format: 'image/' + mapData.layers[i].format,
                            transparent: true,
                            opacity: mapData.layers[i].opacity,
                            layers: mapData.layers[i].name,
                            styles: mapData.layers[i].style,
                            zIndex: zindex1
                        });

                        if (mapData.layers[i].visible === 'on') {
                            mapLayer[titleWMS].addTo(map);
                        }
                    }
                }
            }*/

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC1zZWFyY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBNYXAgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLmpzJyk7XHJcbiAgICB2YXIgTWFwU2VhcmNoID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC1zZWFyY2guanMnKTtcclxuXHJcbiAgICBNYXAuaW5pdCgpO1xyXG4gICAgTWFwU2VhcmNoLmluaXQoKTtcclxufSgpKTtcclxuIiwiICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgTWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcclxuXHJcbiAgICB2YXIgTWFwU2VhcmNoID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2gubG9jQ2hhbmdlKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWdlb0xvY2F0aW9uJykub24oJ2NsaWNrJywgTWFwU2VhcmNoLmdlb0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgJChcIiNidG4tbmF0aW9uTG9jYXRpb25cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoWzUwLCAtMTA1XSwgMyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJChcIiNpbnB1dC1zZWFyY2gtc3dpdGNoXCIpLm9uKCdjbGljaycsICdhJywgTWFwU2VhcmNoLnNlYXJjaF9zd2l0Y2gpO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgICAuYXV0b2NvbXBsZXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcXVlc3QudGVybTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvY2F0aW9uLCBwcm9jZXNzQWRkcmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzQWRkcmVzcyhlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZGF0YS5yZXN1bHRzLmZlYXR1cmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3Nlcy5wdXNoKGZbaV0ucGxhY2VfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZShhZGRyZXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgTWFwU2VhcmNoLmxvY0NoYW5nZSgpOyB9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKS5hZGRDbGFzcygndWktY29ybmVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItdG9wJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLmxvY0NoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xhdGl0dWRlLCAjbG9uZ2l0dWRlJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2NDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gJChcIiNsb2NhdGlvbi1zZWFyY2hcIikudmFsKCk7XHJcbiAgICAgICAgICAgIE1hcC5nZW9jb2Rlci5xdWVyeShsb2MsIGNvZGVNYXApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29kZU1hcChlcnIsIGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHRzLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGFkZHJlc3MgcHJvdmlkZWQgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgZW50ZXIgYSBuZXcgYWRkcmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGxhdCA9IGRhdGEubGF0bG5nWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvbiA9IGRhdGEubGF0bG5nWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbbGF0LCBsb25dLCAxNCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfZGVjaW1hbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsYXQgPSAkKCcjbGF0aXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBsb24gPSAkKCcjbG9uZ2l0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxhdCA9PT0gJycgfHwgbG9uID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciBsYXQvbG9uJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhsYXQpID4gOTAgfHwgTWF0aC5hYnMobG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xhdC9Mb24gdmFsdWVzIG91dCBvZiByYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2xhdCwgbG9uXSwgMTQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2VvTG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sb24gPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fYWNjID0gcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBnZW9fbGF0ID0gTWF0aC5yb3VuZChnZW9fbGF0ICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvX2xvbiA9IE1hdGgucm91bmQoZ2VvX2xvbiAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2dlb19sYXQsIGdlb19sb25dLCAxNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfc3dpdGNoOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2ggPT09ICdsb2MnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0FkZHJlc3MnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT09ICdsYXRsb24tZGVjaW1hbCcpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQ29vcmRpbmF0ZXMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXBTZWFyY2g7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIE1hcCA9IHtcclxuICAgIGRhdGE6IHt9LFxyXG4gICAgbWFwOiB1bmRlZmluZWQsXHJcbiAgICBnZW9jb2RlcjogdW5kZWZpbmVkLFxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIE1hcC5jcmVhdGVNYXAoKTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIG1hcCBjb250YWluZXIgd2lkdGhcclxuICAgICAgICAkKCcjbWFwLWNvbnRhaW5lcicpLm9uKCdjbGljaycsICcuY29udHJvbC1mdWxsIGEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnaGVhZGVyIC5jb250YWluZXIsIGhlYWRlciAuY29udGFpbmVyLWZsdWlkLCBtYWluJylcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcygnY29udGFpbmVyIGNvbnRhaW5lci1mbHVpZCcpXHJcbiAgICAgICAgICAgICAgICAub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcC5tYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9sZWdlbmRcclxuICAgICAgICAvKmlmICghbWFwT3B0cy5sZWdlbmQpIHtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQsIC5sZWdlbmRfX2ljb24nKS50b2dnbGVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnI2J0bi1jbG9zZUxlZ2VuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLmhpZGUoJ2Zhc3QnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI2J0bi1vcGVuTGVnZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kJykuc2hvdygnZmFzdCcpO1xyXG4gICAgICAgIH0pOyovXHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXA7XHJcbiAgICAgICAgICAgIHZhciBtYXBEYXRhID0gTWFwLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBpbml0aWFsem9vbSA9IDQ7XHJcbiAgICAgICAgICAgIHZhciBtYXh6b29tID0gMTU7XHJcbiAgICAgICAgICAgIHZhciBtaW56b29tID0gMztcclxuICAgICAgICAgICAgdmFyIGNlbnRlcl9sYXQgPSAzOC44MjtcclxuICAgICAgICAgICAgdmFyIGNlbnRlcl9sb24gPSAtOTQuOTY7XHJcbiAgICAgICAgICAgIHZhciBiYXNlTGF5ZXIgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGxheWVyQ29udHJvbDtcclxuXHJcbiAgICAgICAgICAgIC8vIGluaXRpYWx6b29tID0gbWFwRGF0YS5pbml0Lnpvb207XHJcbiAgICAgICAgICAgIC8vIG1heHpvb20gPSBtYXBEYXRhLmNvbmZpZy56b29tLm1heCB8fCBtYXh6b29tO1xyXG4gICAgICAgICAgICAvLyBtaW56b29tID0gbWFwRGF0YS5jb25maWcuem9vbS5taW4gfHwgbWluem9vbTtcclxuICAgICAgICAgICAgLy8gY2VudGVyX2xhdCA9IG1hcERhdGEuaW5pdC5sYXQgfHwgY2VudGVyX2xhdDtcclxuICAgICAgICAgICAgLy8gY2VudGVyX2xvbiA9IG1hcERhdGEuaW5pdC5sb24gfHwgY2VudGVyX2xvbjtcclxuXHJcbiAgICAgICAgICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pWTI5dGNIVjBaV05vSWl3aVlTSTZJbk15YmxNeWEzY2lmUS5QOHlwcGVzSGtpNXFNeXhUYzJDTkxnJztcclxuICAgICAgICAgICAgbWFwID0gTC5tYXBib3gubWFwKCdtYXAtY29udGFpbmVyJywgJ2ZjYy5rNzRlZDVnZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4Wm9vbTogbWF4em9vbSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5ab29tOiBtaW56b29tLFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnNldFZpZXcoW2NlbnRlcl9sYXQsIGNlbnRlcl9sb25dLCBpbml0aWFsem9vbSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGFzaCA9IEwuaGFzaChtYXApO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJhc2VTdHJlZXQgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRlZDVnZScpO1xyXG4gICAgICAgICAgICB2YXIgYmFzZVNhdGVsbGl0ZSA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGQ3bjBnJyk7XHJcbiAgICAgICAgICAgIHZhciBiYXNlVGVycmFpbiA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGNtM29sJyk7XHJcblxyXG4gICAgICAgICAgICAvL2Jhc2UgbGF5ZXJzXHJcbiAgICAgICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBiYXNlU3RyZWV0LmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBiYXNlU2F0ZWxsaXRlO1xyXG4gICAgICAgICAgICBiYXNlTGF5ZXIuVGVycmFpbiA9IGJhc2VUZXJyYWluO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgKG1hcERhdGEubWFwX2Jhc2VtYXAgJiYgbWFwRGF0YS5tYXBfYmFzZW1hcFswXS50b0xvd2VyQ2FzZSgpID09IFwic3RyZWV0XCIpIHtcclxuICAgICAgICAgICAgLy8gICAgIGJhc2VMYXllcltcIlN0cmVldFwiXSA9IGJhc2VTdHJlZXQuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgLy8gICAgIGJhc2VMYXllcltcIlNhdGVsbGl0ZVwiXSA9IGJhc2VTYXRlbGxpdGU7XHJcbiAgICAgICAgICAgIC8vICAgICBiYXNlTGF5ZXJbXCJUZXJyYWluXCJdID0gYmFzZVRlcnJhaW47XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAobWFwRGF0YS5tYXBfYmFzZW1hcCAmJiBtYXBEYXRhLm1hcF9iYXNlbWFwWzBdLnRvTG93ZXJDYXNlKCkgPT0gXCJzYXRlbGxpdGVcIikge1xyXG4gICAgICAgICAgICAvLyAgICAgYmFzZUxheWVyW1wiU3RyZWV0XCJdID0gYmFzZVN0cmVldDtcclxuICAgICAgICAgICAgLy8gICAgIGJhc2VMYXllcltcIlNhdGVsbGl0ZVwiXSA9IGJhc2VTYXRlbGxpdGUuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgLy8gICAgIGJhc2VMYXllcltcIlRlcnJhaW5cIl0gPSBiYXNlVGVycmFpbjtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChtYXBEYXRhLm1hcF9iYXNlbWFwICYmIG1hcERhdGEubWFwX2Jhc2VtYXBbMF0udG9Mb3dlckNhc2UoKSA9PSBcInRlcnJhaW5cIikge1xyXG4gICAgICAgICAgICAvLyAgICAgYmFzZUxheWVyW1wiU3RyZWV0XCJdID0gYmFzZVN0cmVldDtcclxuICAgICAgICAgICAgLy8gICAgIGJhc2VMYXllcltcIlNhdGVsbGl0ZVwiXSA9IGJhc2VTYXRlbGxpdGU7XHJcbiAgICAgICAgICAgIC8vICAgICBiYXNlTGF5ZXJbXCJUZXJyYWluXCJdID0gYmFzZVRlcnJhaW4uYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgLy9tYXAgbGF5ZXJzXHJcbiAgICAgICAgICAgIHZhciBtYXBMYXllciA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgemluZGV4MSA9IDEwO1xyXG5cclxuICAgICAgICAgICAgLyppZiAobWFwRGF0YS5sYXllcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXBEYXRhLmxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHppbmRleDErKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hcERhdGEubGF5ZXJzW2ldLnR5cGUgPT0gJ1hZWicpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IG1hcERhdGEubGF5ZXJzW2ldLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGl0bGUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlID0gJycgKyBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSBtYXBEYXRhLmxheWVyc1tpXS5xdWVyeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXJ5ID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSAnYWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pWTI5dGNIVjBaV05vSWl3aVlTSTZJbk15YmxNeWEzY2lmUS5QOHlwcGVzSGtpNXFNeXhUYzJDTkxnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9ICcvLycgKyBtYXBEYXRhLmxheWVyc1tpXS5kb21haW4gKyAnL3t6fS97eH0ve3l9LnBuZz8nICsgcXVlcnk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBMYXllclt0aXRsZV0gPSBMLnRpbGVMYXllcih1cmwsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IG1hcERhdGEubGF5ZXJzW2ldLm9wYWNpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IHppbmRleDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwRGF0YS5sYXllcnNbaV0udmlzaWJpbGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcExheWVyW3RpdGxlXS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXBEYXRhLmxheWVyc1tpXS50eXBlID09PSAnV01TJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGVXTVMgPSBtYXBEYXRhLmxheWVyc1tpXS50aXRsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpdGxlV01TID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVXTVMgPSAnJyArIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcExheWVyW3RpdGxlV01TXSA9IEwudGlsZUxheWVyLndtcyhtYXBEYXRhLmxheWVyc1tpXS5wcm90b2NvbCArICc6Ly8nICsgbWFwRGF0YS5sYXllcnNbaV0uZG9tYWluICsgJy93bXMnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6ICdpbWFnZS8nICsgbWFwRGF0YS5sYXllcnNbaV0uZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBtYXBEYXRhLmxheWVyc1tpXS5vcGFjaXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBtYXBEYXRhLmxheWVyc1tpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVzOiBtYXBEYXRhLmxheWVyc1tpXS5zdHlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogemluZGV4MVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhLmxheWVyc1tpXS52aXNpYmxlID09PSAnb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBMYXllclt0aXRsZVdNU10uYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSovXHJcblxyXG4gICAgICAgICAgICAvL2xheWVyIGNvbnRyb2xcclxuICAgICAgICAgICAgbGF5ZXJDb250cm9sID0gbmV3IEwuQ29udHJvbC5MYXllcnMoXHJcbiAgICAgICAgICAgICAgICBiYXNlTGF5ZXIsIG1hcExheWVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLmFkZFRvKG1hcCk7XHJcblxyXG5cclxuICAgICAgICAgICAgTWFwLm1hcCA9IG1hcDtcclxuXHJcbiAgICAgICAgICAgIE1hcC5nZW9jb2RlciA9IEwubWFwYm94Lmdlb2NvZGVyKCdtYXBib3gucGxhY2VzLXYxJyk7XHJcblxyXG4gICAgICAgIH0gLy9lbmQgY3JlYXRlTWFwXHJcbn07IC8vZW5kIE1hcExheWVyc1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwO1xyXG4iXX0=
