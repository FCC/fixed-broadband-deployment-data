(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');

    BPRMap.init();
    MapSearch.init();
}());

},{"./modules/map-search.js":8,"./modules/map.js":9}],2:[function(require,module,exports){
'use strict';

var chartOpts = {
    labels: [
        'Urban',
        'Rural'
    ],
    datasets: [{
        data: [],
        backgroundColor: [
            '#3D59D7',
            '#71DAD6'
        ]
    }]
};

var chartDemog = {
    create: function(data) {
        var donut;
        var ctxDemog = $('#chartDemog');
        var chartVals = [];

        chartVals.push(data.per_urbannofixed);
        chartVals.push(data.per_ruralnofixed);

        chartOpts.datasets[0].data = chartVals;

        if ($('#chartDemog').length > 0) {

            donut = new Chart(ctxDemog, {
                type: 'doughnut',
                data: chartOpts,
                options: {
                    legend: {
                        position: 'bottom'
                    }
                }
            });
        }
    }
};

module.exports = chartDemog;

},{}],3:[function(require,module,exports){
'use strict';

var chartData = {
    labels: ["All", "Urban", "Rural", "Tribal"],
    datasets: [{
        label: 'Both',
        data: [727, 589, 537, 543],
        backgroundColor: 'rgba(255, 99, 132, 0.4)'
    }, {
        label: 'Fixed',
        data: [238, 553, 746, 884],
        backgroundColor: 'rgba(54, 162, 235, 0.4)'
    }, {
        label: 'Mobile',
        data: [1238, 553, 746, 884],
        backgroundColor: 'rgba(255, 206, 86, 0.4)'
    }, {
        label: 'None',
        data: [584, 789, 254, 654],
        backgroundColor: 'rgba(54, 162, 235, 0.4)'
    }]
};

var chartFixed = {
    create: function(data) {
        var ctxFixed = $('#chartFixed');

        if ($('#chartFixed').length > 0) {
            var fixedChart = new Chart(ctxFixed, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }
            });
        }
    }
};

module.exports = chartFixed;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
},{"./map.js":9}],9:[function(require,module,exports){
'use strict';

var tablePopulation = require('./table-population.js');
var tableProviders = require('./table-providers.js');
var tableDemog = require('./table-demographics.js');
var chartDemog = require('./chart-demographics.js');
var chartFixed = require('./chart-fixed.js');

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
        tableDemog.create(countyData);
        chartDemog.create(countyData);
        chartFixed.create(countyData);
        
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

        //update Providers table
        tableProviders.getData(blockData.block_fips);
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

},{"./chart-demographics.js":2,"./chart-fixed.js":3,"./layers-deployment.js":4,"./layers-providers.js":5,"./layers-speed.js":6,"./layers-tech.js":7,"./table-demographics.js":10,"./table-population.js":11,"./table-providers.js":12}],10:[function(require,module,exports){
'use strict';

var utility = require('./utility.js');

var tableDemog = {
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
        // $('[data-county]').text(popData.county_name);
        // $('[data-state]').text(popData.state_abbr);
        // $('[data-totalPop]').text(utility.formatComma(popData.pop2015));
        // $('[data-popDensity]').text(popData.popdensity);
        $('[data-incomeCapita]').text(utility.formatComma(popData.percapinc));
        $('[data-totalPopNoAccess]').text(utility.formatComma(popData.unspop25_3));
        $('[data-urbanPop]').text(utility.formatPercent(popData.per_urbannofixed));
        $('[data-ruralPop]').text(utility.formatPercent(popData.per_ruralnofixed));
    }
};

module.exports = tableDemog;

},{"./utility.js":13}],11:[function(require,module,exports){
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

},{"./utility.js":13}],12:[function(require,module,exports){
'use strict';

var tableProviders = {
    getData: function(blockFips) {
        var providersURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_providers&maxFeatures=100&outputFormat=application/json&cql_filter=block_fips=%27' + blockFips + '%27';

        $('#table-providers').DataTable({
            'ajax': {
                'url': providersURL,
                'dataSrc': tableProviders.create
            },
            'columns': [
                { 'data': 'providerName' },
                { 'data': 'tech' },
                { 'data': 'speedDown' },
                { 'data': 'speedUp' }
            ],
            'destroy': true,
            'info': false,
            'order': [
                [0, 'asc']
            ],
            'paging': false,
            'searching': false
        });
    },
    create: function(data) {
        var providerData = data.features;
        var tempData = [];
        
        for (var i = 0; i < providerData.length; i++) {
            tempData.push({
            	'providerName': providerData[i].properties.dbaname,
            	'tech': providerData[i].properties.technology,
            	'speedDown': providerData[i].properties.download_speed,
            	'speedUp': providerData[i].properties.upload_speed
            });            
        }

        return tempData;
    }
};

module.exports = tableProviders;


},{}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLWRlcGxveW1lbnQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9sYXllcnMtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXNwZWVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXRlY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAtc2VhcmNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtZGVtb2dyYXBoaWNzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtcG9wdWxhdGlvbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBCUFJNYXAgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLmpzJyk7XHJcbiAgICB2YXIgTWFwU2VhcmNoID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC1zZWFyY2guanMnKTtcclxuXHJcbiAgICBCUFJNYXAuaW5pdCgpO1xyXG4gICAgTWFwU2VhcmNoLmluaXQoKTtcclxufSgpKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0T3B0cyA9IHtcclxuICAgIGxhYmVsczogW1xyXG4gICAgICAgICdVcmJhbicsXHJcbiAgICAgICAgJ1J1cmFsJ1xyXG4gICAgXSxcclxuICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogW1xyXG4gICAgICAgICAgICAnIzNENTlENycsXHJcbiAgICAgICAgICAgICcjNzFEQUQ2J1xyXG4gICAgICAgIF1cclxuICAgIH1dXHJcbn07XHJcblxyXG52YXIgY2hhcnREZW1vZyA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBkb251dDtcclxuICAgICAgICB2YXIgY3R4RGVtb2cgPSAkKCcjY2hhcnREZW1vZycpO1xyXG4gICAgICAgIHZhciBjaGFydFZhbHMgPSBbXTtcclxuXHJcbiAgICAgICAgY2hhcnRWYWxzLnB1c2goZGF0YS5wZXJfdXJiYW5ub2ZpeGVkKTtcclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl9ydXJhbG5vZml4ZWQpO1xyXG5cclxuICAgICAgICBjaGFydE9wdHMuZGF0YXNldHNbMF0uZGF0YSA9IGNoYXJ0VmFscztcclxuXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydERlbW9nJykubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgZG9udXQgPSBuZXcgQ2hhcnQoY3R4RGVtb2csIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdkb3VnaG51dCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBjaGFydE9wdHMsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydERlbW9nO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnREYXRhID0ge1xyXG4gICAgbGFiZWxzOiBbXCJBbGxcIiwgXCJVcmJhblwiLCBcIlJ1cmFsXCIsIFwiVHJpYmFsXCJdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgbGFiZWw6ICdCb3RoJyxcclxuICAgICAgICBkYXRhOiBbNzI3LCA1ODksIDUzNywgNTQzXSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgOTksIDEzMiwgMC40KSdcclxuICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogJ0ZpeGVkJyxcclxuICAgICAgICBkYXRhOiBbMjM4LCA1NTMsIDc0NiwgODg0XSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDU0LCAxNjIsIDIzNSwgMC40KSdcclxuICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogJ01vYmlsZScsXHJcbiAgICAgICAgZGF0YTogWzEyMzgsIDU1MywgNzQ2LCA4ODRdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyMDYsIDg2LCAwLjQpJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiAnTm9uZScsXHJcbiAgICAgICAgZGF0YTogWzU4NCwgNzg5LCAyNTQsIDY1NF0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1NCwgMTYyLCAyMzUsIDAuNCknXHJcbiAgICB9XVxyXG59O1xyXG5cclxudmFyIGNoYXJ0Rml4ZWQgPSB7XHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgY3R4Rml4ZWQgPSAkKCcjY2hhcnRGaXhlZCcpO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0Rml4ZWQnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBmaXhlZENoYXJ0ID0gbmV3IENoYXJ0KGN0eEZpeGVkLCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0RGF0YSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc0RlcGxveW1lbnQgPSB7fTtcclxuXHJcbi8vRGVwbG95bWVudCBtYXAgbGF5ZXJzXHJcbmxheWVyc0RlcGxveW1lbnRbJ0ZpeGVkIGJyb2FkYmFuZCAyNS8zIChNYnBzKSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfY291bnR5X2xheWVyX2ZpeGVkJyxcclxuICAgIHN0eWxlczogJ2Jwcl9sYXllcl9maXhlZF8wJ1xyXG59O1xyXG5cclxubGF5ZXJzRGVwbG95bWVudFsnTm8gZml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfbm9uZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzEnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc0RlcGxveW1lbnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNQcm92aWRlcnMgPSB7fTtcclxuXHJcbi8vUHJvdmlkZXJzIG1hcCBsYXllcnNcclxubGF5ZXJzUHJvdmlkZXJzWydaZXJvIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCdcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snT25lIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUd28gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUaHJlZSBvciBtb3JlIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMydcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzU3BlZWQgPSB7fTtcclxuXHJcbi8vU3BlZWQgbWFwIGxheWVyc1xyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgc2VydmljZXMgb2YgYXQgbGVhc3QgMjAwIGticHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJ1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMCBNYnBzLzEgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJ1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAyNSBNYnBzLzMgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyNScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDI1J1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCA1MCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQ1MCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJ1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMDAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNTcGVlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1RlY2ggPSB7fTtcclxuXHJcbi8vUHJvdmlkZXJzIG1hcCBsYXllcnNcclxubGF5ZXJzVGVjaFsnRlRUUCddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9maWJlcicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnQ2FibGUgbW9kZW0nXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfY2FibGUnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCdcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0RTTCAoaW5jLiBGVFROKSwgb3RoZXIgY29wcGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2Fkc2wnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCdcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0ZpeGVkIHdpcmVsZXNzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2Z3JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydPdGhlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9vdGhlcicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNUZWNoO1xyXG4iLCIgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBNYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xyXG5cclxuICAgIHZhciBNYXBTZWFyY2ggPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5sb2NDaGFuZ2UpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCk7XHJcbiAgICAgICAgICAgICQoJyNidG4tZ2VvTG9jYXRpb24nKS5vbignY2xpY2snLCBNYXBTZWFyY2guZ2VvTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAkKFwiI2J0bi1uYXRpb25Mb2NhdGlvblwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbNTAsIC0xMDVdLCAzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2lucHV0LXNlYXJjaC1zd2l0Y2hcIikub24oJ2NsaWNrJywgJ2EnLCBNYXBTZWFyY2guc2VhcmNoX3N3aXRjaCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJylcclxuICAgICAgICAgICAgICAgIC5hdXRvY29tcGxldGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24ocmVxdWVzdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gcmVxdWVzdC50ZXJtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXAuZ2VvY29kZXIucXVlcnkobG9jYXRpb24sIHByb2Nlc3NBZGRyZXNzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NBZGRyZXNzKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBkYXRhLnJlc3VsdHMuZmVhdHVyZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc2VzLnB1c2goZltpXS5wbGFjZV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGFkZHJlc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7IH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLWFsbCcpLmFkZENsYXNzKCd1aS1jb3JuZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci10b3AnKS5hZGRDbGFzcygndWktY29ybmVyLWFsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbGF0aXR1ZGUsICNsb25naXR1ZGUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvY0NoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSAkKFwiI2xvY2F0aW9uLXNlYXJjaFwiKS52YWwoKTtcclxuICAgICAgICAgICAgTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvYywgY29kZU1hcCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb2RlTWFwKGVyciwgZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdHMuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgYWRkcmVzcyBwcm92aWRlZCBjb3VsZCBub3QgYmUgZm91bmQuIFBsZWFzZSBlbnRlciBhIG5ldyBhZGRyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0ID0gZGF0YS5sYXRsbmdbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9uID0gZGF0YS5sYXRsbmdbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgTWFwLm1hcC5zZXRWaWV3KFtsYXQsIGxvbl0sIDE0KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9kZWNpbWFsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxhdCA9ICQoJyNsYXRpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuICAgICAgICAgICAgdmFyIGxvbiA9ICQoJyNsb25naXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGF0ID09PSAnJyB8fCBsb24gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVudGVyIGxhdC9sb24nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGxhdCkgPiA5MCB8fCBNYXRoLmFicyhsb24pID4gMTgwKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnTGF0L0xvbiB2YWx1ZXMgb3V0IG9mIHJhbmdlJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbbGF0LCBsb25dLCAxNCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZW9Mb2NhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xhdCA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xvbiA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19hY2MgPSBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdlb19sYXQgPSBNYXRoLnJvdW5kKGdlb19sYXQgKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICAgICAgICAgICAgICBnZW9fbG9uID0gTWF0aC5yb3VuZChnZW9fbG9uICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbZ2VvX2xhdCwgZ2VvX2xvbl0sIDE0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9zd2l0Y2g6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlYXJjaCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCd2YWx1ZScpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlYXJjaCA9PT0gJ2xvYycpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQWRkcmVzcycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PT0gJ2xhdGxvbi1kZWNpbWFsJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdDb29yZGluYXRlcycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hcFNlYXJjaDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdGFibGVQb3B1bGF0aW9uID0gcmVxdWlyZSgnLi90YWJsZS1wb3B1bGF0aW9uLmpzJyk7XHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHJlcXVpcmUoJy4vdGFibGUtcHJvdmlkZXJzLmpzJyk7XHJcbnZhciB0YWJsZURlbW9nID0gcmVxdWlyZSgnLi90YWJsZS1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0RGVtb2cgPSByZXF1aXJlKCcuL2NoYXJ0LWRlbW9ncmFwaGljcy5qcycpO1xyXG52YXIgY2hhcnRGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWQuanMnKTtcclxuXHJcbnZhciBsYXllcnMgPSB7XHJcbiAgICBkZXBsb3ltZW50OiByZXF1aXJlKCcuL2xheWVycy1kZXBsb3ltZW50LmpzJyksXHJcbiAgICBzcGVlZDogcmVxdWlyZSgnLi9sYXllcnMtc3BlZWQuanMnKSxcclxuICAgIHByb3ZpZGVyczogcmVxdWlyZSgnLi9sYXllcnMtcHJvdmlkZXJzLmpzJyksXHJcbiAgICB0ZWNobm9sb2d5OiByZXF1aXJlKCcuL2xheWVycy10ZWNoLmpzJyksXHJcbiAgICB0cmliYWw6IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2Jwcl90cmliYWwnLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl90cmliYWwnXHJcbiAgICB9LFxyXG4gICAgdXJiYW46IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2ZjYzpicHJfY291bnR5X2xheWVyX3VyYmFuX29ubHknLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl9sYXllcl91cmJhbidcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBsb2NhdGlvbkxhdDtcclxudmFyIGxvY2F0aW9uTG9uO1xyXG52YXIgbG9jYXRpb25NYXJrZXI7XHJcbnZhciBjbGlja2VkQ291bnR5TGF5ZXI7XHJcbnZhciBjbGlja2VkQ291bnR5U3R5bGUgPSB7IGNvbG9yOiAnIzAwZicsIG9wYWNpdHk6IDAuNSwgZmlsbE9wYWNpdHk6IDAuMSwgZmlsbENvbG9yOiAnI2ZmZicsIHdlaWdodDogMyB9O1xyXG52YXIgY291bnR5TGF5ZXJEYXRhID0geyAnZmVhdHVyZXMnOiBbXSB9O1xyXG5cclxudmFyIGNsaWNrZWRCbG9ja0xheWVyO1xyXG52YXIgY2xpY2tlZEJsb2NrU3R5bGUgPSB7IGNvbG9yOiAnIzAwMCcsIG9wYWNpdHk6IDAuNSwgZmlsbE9wYWNpdHk6IDAuMSwgZmlsbENvbG9yOiAnI2ZmZicsIHdlaWdodDogMyB9O1xyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXJEYXRhO1xyXG5cclxudmFyIEJQUk1hcCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBCUFJNYXAuY3JlYXRlTWFwKCk7XHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBtYXAgY29udGFpbmVyIHdpZHRoXHJcbiAgICAgICAgJCgnI21hcC1jb250YWluZXInKS5vbignY2xpY2snLCAnLmNvbnRyb2wtZnVsbCBhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJ2hlYWRlciAuY29udGFpbmVyLCBoZWFkZXIgLmNvbnRhaW5lci1mbHVpZCwgbWFpbicpXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NvbnRhaW5lciBjb250YWluZXItZmx1aWQnKVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAub24oJ2NsaWNrJywgQlBSTWFwLnVwZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vbGVnZW5kXHJcbiAgICAgICAgLyppZiAoIW1hcE9wdHMubGVnZW5kKSB7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kLCAubGVnZW5kX19pY29uJykudG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJyNidG4tY2xvc2VMZWdlbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQnKS5oaWRlKCdmYXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNidG4tb3BlbkxlZ2VuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLnNob3coJ2Zhc3QnKTtcclxuICAgICAgICB9KTsqL1xyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVNYXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdmFyIG1hcDtcclxuICAgICAgICB2YXIgaGFzaDtcclxuICAgICAgICAvLyB2YXIgbWFwRGF0YSA9IE1hcC5kYXRhO1xyXG4gICAgICAgIHZhciBpbml0aWFsem9vbSA9IDQ7XHJcbiAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICB2YXIgbWluem9vbSA9IDM7XHJcbiAgICAgICAgdmFyIGNlbnRlcl9sYXQgPSAzOC44MjtcclxuICAgICAgICB2YXIgY2VudGVyX2xvbiA9IC05NC45NjtcclxuICAgICAgICB2YXIgYmFzZUxheWVyID0ge307XHJcbiAgICAgICAgdmFyIGxheWVyQ29udHJvbDtcclxuICAgICAgICB2YXIgbGF5ZXJQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJylbMV07XHJcbiAgICAgICAgdmFyIG1hcExheWVyID0ge307XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9VUkwgPSAnL2d3Yy9zZXJ2aWNlL3dtcz90aWxlZD10cnVlJztcclxuICAgICAgICBCUFJNYXAuZ2VvX3NwYWNlID0gJ2ZjYyc7XHJcblxyXG4gICAgICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pWTI5dGNIVjBaV05vSWl3aVlTSTZJbk15YmxNeWEzY2lmUS5QOHlwcGVzSGtpNXFNeXhUYzJDTkxnJztcclxuICAgICAgICBCUFJNYXAubWFwID0gTC5tYXBib3gubWFwKCdtYXAtY29udGFpbmVyJywgJ2ZjYy5rNzRlZDVnZScsIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1heFpvb206IG1heHpvb20sXHJcbiAgICAgICAgICAgICAgICBtaW5ab29tOiBtaW56b29tLFxyXG4gICAgICAgICAgICAgICAgem9vbUNvbnRyb2w6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnNldFZpZXcoW2NlbnRlcl9sYXQsIGNlbnRlcl9sb25dLCBpbml0aWFsem9vbSk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAuYXR0cmlidXRpb25Db250cm9sLmFkZEF0dHJpYnV0aW9uKCc8YSBocmVmPVwiaHR0cDovL2ZjYy5nb3ZcIj5GQ0M8L2E+Jyk7XHJcblxyXG4gICAgICAgIC8vYmFzZSBsYXllcnNcclxuICAgICAgICBiYXNlTGF5ZXIuU3RyZWV0ID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZWQ1Z2UnKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICBiYXNlTGF5ZXIuU2F0ZWxsaXRlID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZDduMGcnKTtcclxuICAgICAgICBiYXNlTGF5ZXIuVGVycmFpbiA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGNtM29sJyk7XHJcblxyXG4gICAgICAgIC8vZ2V0IHRpbGUgbGF5ZXJzIGJhc2VkIG9uIGxvY2F0aW9uIHBhdGhuYW1lXHJcbiAgICAgICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzW2xheWVyUGF0aF0pIHtcclxuICAgICAgICAgICAgbWFwTGF5ZXJbbGF5ZXJdID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVyc1tsYXllclBhdGhdW2xheWVyXSkuc2V0WkluZGV4KDExKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIFRyaWJhbCBhbmQgVXJiYW4gbGF5ZXJzXHJcbiAgICAgICAgbWFwTGF5ZXJbJ1RyaWJhbCddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy50cmliYWwpO1xyXG4gICAgICAgIG1hcExheWVyWydVcmJhbiddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy51cmJhbik7XHJcblxyXG4gICAgICAgIC8vbGF5ZXIgY29udHJvbFxyXG4gICAgICAgIGxheWVyQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoXHJcbiAgICAgICAgICAgIGJhc2VMYXllciwgbWFwTGF5ZXIsIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wbGVmdCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIGhhc2ggPSBMLmhhc2goQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9jb2RlciA9IEwubWFwYm94Lmdlb2NvZGVyKCdtYXBib3gucGxhY2VzLXYxJyk7XHJcblxyXG4gICAgfSwgLy9lbmQgY3JlYXRlTWFwXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvKiB2YXIgY3Vyc29yWDtcclxuICAgICAgICB2YXIgY3Vyc29yWTtcclxuICAgICAgICB2YXIgY2xpY2tYID0gMDtcclxuICAgICAgICB2YXIgY2xpY2tZID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGxhc3RUaW1lc3RhbXAgPSAwO1xyXG5cclxuICAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICBpZiAobGFzdFRpbWVzdGFtcCA+IDAgJiYgdGltZXN0YW1wIC0gbGFzdFRpbWVzdGFtcCA8IDEwMDApIHtcclxuICAgICAgICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICBjbGlja1ggPSBjdXJzb3JYO1xyXG4gICAgICAgIGNsaWNrWSA9IGN1cnNvclk7Ki9cclxuICAgICAgICB2YXIgbGF0ID0gTWF0aC5yb3VuZCgxMDAwMDAwICogZS5sYXRsbmcubGF0KSAvIDEwMDAwMDAuMDtcclxuICAgICAgICB2YXIgbG9uID0gTWF0aC5yb3VuZCgxMDAwMDAwICogZS5sYXRsbmcubG5nKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICBsb2NhdGlvbkxhdCA9IGxhdDtcclxuICAgICAgICBsb2NhdGlvbkxvbiA9IGxvbjtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlQmxvY2tDb3VudHlMYXllcnMoKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdldENvdW50eShsYXQsIGxvbik7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKGxhdCwgbG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICB9LCAvL2VuZCB1cGRhdGVcclxuICAgIGdldENvdW50eTogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eSZtYXhGZWF0dXJlcz0xJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dDb3VudHlcclxuICAgICAgICB9KTtcclxuICAgIH0sIC8vZW5kIGdldENvdW50eVxyXG4gICAgc2hvd0NvdW50eTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBjb3VudHlEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50eV90ZXh0ID0gJ05vIGNvdW50eSBkYXRhIGZvdW5kIGF0IHlvdXIgc2VhcmNoZWQvY2xpY2tlZCBsb2NhdGlvbi4nO1xyXG4gICAgICAgICAgICAkKCcjZGlzcGxheS1jb3VudHknKS5odG1sKGNvdW50eV90ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGFibGVQb3B1bGF0aW9uLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydERlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBcclxuICAgIH0sIC8vZW5kIHNob3dDb3VudHlcclxuICAgIGdldEJsb2NrOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dCbG9ja1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNob3dCbG9jazogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBibG9ja0RhdGEgPSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXM7XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRCbG9ja0xheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyRGF0YSkuc2V0U3R5bGUoY2xpY2tlZEJsb2NrU3R5bGUpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuc2V0TG9jYXRpb25NYXJrZXIobG9jYXRpb25MYXQsIGxvY2F0aW9uTG9uKTtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtZmlwc10nKS50ZXh0KGJsb2NrRGF0YS5ibG9ja19maXBzKTtcclxuICAgICAgICAkKCdbZGF0YS1ydXJhbF0nKS50ZXh0KGJsb2NrRGF0YS51cmJhbl9ydXJhbCA9PT0gJ1InID8gJ1J1cmFsJzonVXJiYW4nKTtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgUHJvdmlkZXJzIHRhYmxlXHJcbiAgICAgICAgdGFibGVQcm92aWRlcnMuZ2V0RGF0YShibG9ja0RhdGEuYmxvY2tfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgc2V0TG9jYXRpb25NYXJrZXI6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIobG9jYXRpb25NYXJrZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIobG9jYXRpb25NYXJrZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2NhdGlvbk1hcmtlciA9IEwubWFya2VyKFtsYXQsIGxvbl0sIHsgdGl0bGU6ICcnIH0pLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBsb2NhdGlvbk1hcmtlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC56b29tVG9CbG9jaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHpvb21Ub0Jsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5maXRCb3VuZHMoY2xpY2tlZEJsb2NrTGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsgLy9lbmQgTWFwTGF5ZXJzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJQUk1hcDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuL3V0aWxpdHkuanMnKTtcclxuXHJcbnZhciB0YWJsZURlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgLy8gJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgLy8gJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgIC8vICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAvLyAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQocG9wRGF0YS5wb3BkZW5zaXR5KTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlRGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgdGFibGVQb3B1bGF0aW9uID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQocG9wRGF0YS5wb3BkZW5zaXR5KTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUG9wdWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHRhYmxlUHJvdmlkZXJzID0ge1xyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oYmxvY2tGaXBzKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyc1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9wcm92aWRlcnMmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9YmxvY2tfZmlwcz0lMjcnICsgYmxvY2tGaXBzICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1wcm92aWRlcnMnKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAnYWpheCc6IHtcclxuICAgICAgICAgICAgICAgICd1cmwnOiBwcm92aWRlcnNVUkwsXHJcbiAgICAgICAgICAgICAgICAnZGF0YVNyYyc6IHRhYmxlUHJvdmlkZXJzLmNyZWF0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAncHJvdmlkZXJOYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICd0ZWNoJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZERvd24nIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3NwZWVkVXAnIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnb3JkZXInOiBbXHJcbiAgICAgICAgICAgICAgICBbMCwgJ2FzYyddXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdwYWdpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3NlYXJjaGluZyc6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyRGF0YSA9IGRhdGEuZmVhdHVyZXM7XHJcbiAgICAgICAgdmFyIHRlbXBEYXRhID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm92aWRlckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGVtcERhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIFx0J3Byb3ZpZGVyTmFtZSc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRiYW5hbWUsXHJcbiAgICAgICAgICAgIFx0J3RlY2gnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy50ZWNobm9sb2d5LFxyXG4gICAgICAgICAgICBcdCdzcGVlZERvd24nOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kb3dubG9hZF9zcGVlZCxcclxuICAgICAgICAgICAgXHQnc3BlZWRVcCc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLnVwbG9hZF9zcGVlZFxyXG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wRGF0YTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGFibGVQcm92aWRlcnM7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHtcclxuICAgIGlzTnVsbChmaWVsZE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gZmllbGROYW1lID09PSBudWxsO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdENvbW1hKG51bSkge1xyXG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdFBlcmNlbnQobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChudW0gKiAxMDApLnRvRml4ZWQoMikgKyAnJSc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxpdHk7XHJcbiJdfQ==
