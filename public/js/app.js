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

        if ($('#tabInstructs').is(':visible')) {
            $('#tabInstructs').addClass('hide');
            $('#fixed, #provider, #demographics').removeClass('hide');
        }        

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLWRlcGxveW1lbnQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9sYXllcnMtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXNwZWVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXRlY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAtc2VhcmNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtZGVtb2dyYXBoaWNzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtcG9wdWxhdGlvbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgQlBSTWFwID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC5qcycpO1xyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAtc2VhcmNoLmpzJyk7XHJcblxyXG4gICAgQlBSTWFwLmluaXQoKTtcclxuICAgIE1hcFNlYXJjaC5pbml0KCk7XHJcbn0oKSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydE9wdHMgPSB7XHJcbiAgICBsYWJlbHM6IFtcclxuICAgICAgICAnVXJiYW4nLFxyXG4gICAgICAgICdSdXJhbCdcclxuICAgIF0sXHJcbiAgICBkYXRhc2V0czogW3tcclxuICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFtcclxuICAgICAgICAgICAgJyMzRDU5RDcnLFxyXG4gICAgICAgICAgICAnIzcxREFENidcclxuICAgICAgICBdXHJcbiAgICB9XVxyXG59O1xyXG5cclxudmFyIGNoYXJ0RGVtb2cgPSB7XHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgZG9udXQ7XHJcbiAgICAgICAgdmFyIGN0eERlbW9nID0gJCgnI2NoYXJ0RGVtb2cnKTtcclxuICAgICAgICB2YXIgY2hhcnRWYWxzID0gW107XHJcblxyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKGRhdGEucGVyX3VyYmFubm9maXhlZCk7XHJcbiAgICAgICAgY2hhcnRWYWxzLnB1c2goZGF0YS5wZXJfcnVyYWxub2ZpeGVkKTtcclxuXHJcbiAgICAgICAgY2hhcnRPcHRzLmRhdGFzZXRzWzBdLmRhdGEgPSBjaGFydFZhbHM7XHJcblxyXG4gICAgICAgIGlmICgkKCcjY2hhcnREZW1vZycpLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIGRvbnV0ID0gbmV3IENoYXJ0KGN0eERlbW9nLCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZG91Z2hudXQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogY2hhcnRPcHRzLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnREZW1vZztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0RGF0YSA9IHtcclxuICAgIGxhYmVsczogW1wiQWxsXCIsIFwiVXJiYW5cIiwgXCJSdXJhbFwiLCBcIlRyaWJhbFwiXSxcclxuICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgIGxhYmVsOiAnQm90aCcsXHJcbiAgICAgICAgZGF0YTogWzcyNywgNTg5LCA1MzcsIDU0M10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDk5LCAxMzIsIDAuNCknXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGFiZWw6ICdGaXhlZCcsXHJcbiAgICAgICAgZGF0YTogWzIzOCwgNTUzLCA3NDYsIDg4NF0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1NCwgMTYyLCAyMzUsIDAuNCknXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGFiZWw6ICdNb2JpbGUnLFxyXG4gICAgICAgIGRhdGE6IFsxMjM4LCA1NTMsIDc0NiwgODg0XSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgMjA2LCA4NiwgMC40KSdcclxuICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogJ05vbmUnLFxyXG4gICAgICAgIGRhdGE6IFs1ODQsIDc4OSwgMjU0LCA2NTRdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoNTQsIDE2MiwgMjM1LCAwLjQpJ1xyXG4gICAgfV1cclxufTtcclxuXHJcbnZhciBjaGFydEZpeGVkID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGN0eEZpeGVkID0gJCgnI2NoYXJ0Rml4ZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydEZpeGVkJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgZml4ZWRDaGFydCA9IG5ldyBDaGFydChjdHhGaXhlZCwge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBjaGFydERhdGEsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Rml4ZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNEZXBsb3ltZW50ID0ge307XHJcblxyXG4vL0RlcGxveW1lbnQgbWFwIGxheWVyc1xyXG5sYXllcnNEZXBsb3ltZW50WydGaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMCdcclxufTtcclxuXHJcbmxheWVyc0RlcGxveW1lbnRbJ05vIGZpeGVkIGJyb2FkYmFuZCAyNS8zIChNYnBzKSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfY291bnR5X2xheWVyX25vbmZpeGVkJyxcclxuICAgIHN0eWxlczogJ2Jwcl9sYXllcl9maXhlZF8xJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNEZXBsb3ltZW50O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzUHJvdmlkZXJzID0ge307XHJcblxyXG4vL1Byb3ZpZGVycyBtYXAgbGF5ZXJzXHJcbmxheWVyc1Byb3ZpZGVyc1snWmVybyBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ09uZSBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMSdcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snVHdvIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMidcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snVGhyZWUgb3IgbW9yZSBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMycsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1Byb3ZpZGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1NwZWVkID0ge307XHJcblxyXG4vL1NwZWVkIG1hcCBsYXllcnNcclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIHNlcnZpY2VzIG9mIGF0IGxlYXN0IDIwMCBrYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDIwMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDIwMCdcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMTAgTWJwcy8xIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCdcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMjUgTWJwcy8zIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyNSdcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgNTAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQ1MCdcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMTAwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwMCdcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzU3BlZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNUZWNoID0ge307XHJcblxyXG4vL1Byb3ZpZGVycyBtYXAgbGF5ZXJzXHJcbmxheWVyc1RlY2hbJ0ZUVFAnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfZmliZXInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCdcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0NhYmxlIG1vZGVtJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2NhYmxlJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydEU0wgKGluYy4gRlRUTiksIG90aGVyIGNvcHBlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9hZHNsJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydGaXhlZCB3aXJlbGVzcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9mdycsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnT3RoZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfb3RoZXInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCdcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzVGVjaDtcclxuIiwiICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgTWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcclxuXHJcbiAgICB2YXIgTWFwU2VhcmNoID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2gubG9jQ2hhbmdlKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWdlb0xvY2F0aW9uJykub24oJ2NsaWNrJywgTWFwU2VhcmNoLmdlb0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgJChcIiNidG4tbmF0aW9uTG9jYXRpb25cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoWzUwLCAtMTA1XSwgMyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJChcIiNpbnB1dC1zZWFyY2gtc3dpdGNoXCIpLm9uKCdjbGljaycsICdhJywgTWFwU2VhcmNoLnNlYXJjaF9zd2l0Y2gpO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgICAuYXV0b2NvbXBsZXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcXVlc3QudGVybTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvY2F0aW9uLCBwcm9jZXNzQWRkcmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzQWRkcmVzcyhlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZGF0YS5yZXN1bHRzLmZlYXR1cmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3Nlcy5wdXNoKGZbaV0ucGxhY2VfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZShhZGRyZXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgTWFwU2VhcmNoLmxvY0NoYW5nZSgpOyB9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKS5hZGRDbGFzcygndWktY29ybmVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItdG9wJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLmxvY0NoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xhdGl0dWRlLCAjbG9uZ2l0dWRlJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2NDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gJChcIiNsb2NhdGlvbi1zZWFyY2hcIikudmFsKCk7XHJcbiAgICAgICAgICAgIE1hcC5nZW9jb2Rlci5xdWVyeShsb2MsIGNvZGVNYXApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29kZU1hcChlcnIsIGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHRzLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGFkZHJlc3MgcHJvdmlkZWQgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgZW50ZXIgYSBuZXcgYWRkcmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGxhdCA9IGRhdGEubGF0bG5nWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvbiA9IGRhdGEubGF0bG5nWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIE1hcC5tYXAuc2V0VmlldyhbbGF0LCBsb25dLCAxNCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfZGVjaW1hbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsYXQgPSAkKCcjbGF0aXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBsb24gPSAkKCcjbG9uZ2l0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxhdCA9PT0gJycgfHwgbG9uID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciBsYXQvbG9uJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhsYXQpID4gOTAgfHwgTWF0aC5hYnMobG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xhdC9Mb24gdmFsdWVzIG91dCBvZiByYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2xhdCwgbG9uXSwgMTQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2VvTG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sb24gPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fYWNjID0gcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBnZW9fbGF0ID0gTWF0aC5yb3VuZChnZW9fbGF0ICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvX2xvbiA9IE1hdGgucm91bmQoZ2VvX2xvbiAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBNYXAubWFwLnNldFZpZXcoW2dlb19sYXQsIGdlb19sb25dLCAxNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfc3dpdGNoOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2ggPT09ICdsb2MnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0FkZHJlc3MnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT09ICdsYXRsb24tZGVjaW1hbCcpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQ29vcmRpbmF0ZXMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXBTZWFyY2g7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHRhYmxlUG9wdWxhdGlvbiA9IHJlcXVpcmUoJy4vdGFibGUtcG9wdWxhdGlvbi5qcycpO1xyXG52YXIgdGFibGVQcm92aWRlcnMgPSByZXF1aXJlKCcuL3RhYmxlLXByb3ZpZGVycy5qcycpO1xyXG52YXIgdGFibGVEZW1vZyA9IHJlcXVpcmUoJy4vdGFibGUtZGVtb2dyYXBoaWNzLmpzJyk7XHJcbnZhciBjaGFydERlbW9nID0gcmVxdWlyZSgnLi9jaGFydC1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0Rml4ZWQgPSByZXF1aXJlKCcuL2NoYXJ0LWZpeGVkLmpzJyk7XHJcblxyXG52YXIgbGF5ZXJzID0ge1xyXG4gICAgZGVwbG95bWVudDogcmVxdWlyZSgnLi9sYXllcnMtZGVwbG95bWVudC5qcycpLFxyXG4gICAgc3BlZWQ6IHJlcXVpcmUoJy4vbGF5ZXJzLXNwZWVkLmpzJyksXHJcbiAgICBwcm92aWRlcnM6IHJlcXVpcmUoJy4vbGF5ZXJzLXByb3ZpZGVycy5qcycpLFxyXG4gICAgdGVjaG5vbG9neTogcmVxdWlyZSgnLi9sYXllcnMtdGVjaC5qcycpLFxyXG4gICAgdHJpYmFsOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdicHJfdHJpYmFsJyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfdHJpYmFsJ1xyXG4gICAgfSxcclxuICAgIHVyYmFuOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdmY2M6YnByX2NvdW50eV9sYXllcl91cmJhbl9vbmx5JyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfbGF5ZXJfdXJiYW4nXHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgbG9jYXRpb25MYXQ7XHJcbnZhciBsb2NhdGlvbkxvbjtcclxudmFyIGxvY2F0aW9uTWFya2VyO1xyXG52YXIgY2xpY2tlZENvdW50eUxheWVyO1xyXG52YXIgY2xpY2tlZENvdW50eVN0eWxlID0geyBjb2xvcjogJyMwMGYnLCBvcGFjaXR5OiAwLjUsIGZpbGxPcGFjaXR5OiAwLjEsIGZpbGxDb2xvcjogJyNmZmYnLCB3ZWlnaHQ6IDMgfTtcclxudmFyIGNvdW50eUxheWVyRGF0YSA9IHsgJ2ZlYXR1cmVzJzogW10gfTtcclxuXHJcbnZhciBjbGlja2VkQmxvY2tMYXllcjtcclxudmFyIGNsaWNrZWRCbG9ja1N0eWxlID0geyBjb2xvcjogJyMwMDAnLCBvcGFjaXR5OiAwLjUsIGZpbGxPcGFjaXR5OiAwLjEsIGZpbGxDb2xvcjogJyNmZmYnLCB3ZWlnaHQ6IDMgfTtcclxudmFyIGNsaWNrZWRCbG9ja0xheWVyRGF0YTtcclxuXHJcbnZhciBCUFJNYXAgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgQlBSTWFwLmNyZWF0ZU1hcCgpO1xyXG5cclxuICAgICAgICAvLyB0b2dnbGUgbWFwIGNvbnRhaW5lciB3aWR0aFxyXG4gICAgICAgICQoJyNtYXAtY29udGFpbmVyJykub24oJ2NsaWNrJywgJy5jb250cm9sLWZ1bGwgYScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCdoZWFkZXIgLmNvbnRhaW5lciwgaGVhZGVyIC5jb250YWluZXItZmx1aWQsIG1haW4nKVxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdjb250YWluZXIgY29udGFpbmVyLWZsdWlkJylcclxuICAgICAgICAgICAgICAgIC5vbmUoJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBCUFJNYXAubWFwLm9uKCdjbGljaycsIEJQUk1hcC51cGRhdGUpO1xyXG5cclxuICAgICAgICAvL2xlZ2VuZFxyXG4gICAgICAgIC8qaWYgKCFtYXBPcHRzLmxlZ2VuZCkge1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCwgLmxlZ2VuZF9faWNvbicpLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcjYnRuLWNsb3NlTGVnZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kJykuaGlkZSgnZmFzdCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjYnRuLW9wZW5MZWdlbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQnKS5zaG93KCdmYXN0Jyk7XHJcbiAgICAgICAgfSk7Ki9cclxuXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlTWFwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL3ZhciBtYXA7XHJcbiAgICAgICAgdmFyIGhhc2g7XHJcbiAgICAgICAgLy8gdmFyIG1hcERhdGEgPSBNYXAuZGF0YTtcclxuICAgICAgICB2YXIgaW5pdGlhbHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBtYXh6b29tID0gMTU7XHJcbiAgICAgICAgdmFyIG1pbnpvb20gPSAzO1xyXG4gICAgICAgIHZhciBjZW50ZXJfbGF0ID0gMzguODI7XHJcbiAgICAgICAgdmFyIGNlbnRlcl9sb24gPSAtOTQuOTY7XHJcbiAgICAgICAgdmFyIGJhc2VMYXllciA9IHt9O1xyXG4gICAgICAgIHZhciBsYXllckNvbnRyb2w7XHJcbiAgICAgICAgdmFyIGxheWVyUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpWzFdO1xyXG4gICAgICAgIHZhciBtYXBMYXllciA9IHt9O1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2VvVVJMID0gJy9nd2Mvc2VydmljZS93bXM/dGlsZWQ9dHJ1ZSc7XHJcbiAgICAgICAgQlBSTWFwLmdlb19zcGFjZSA9ICdmY2MnO1xyXG5cclxuICAgICAgICBMLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaVkyOXRjSFYwWldOb0lpd2lZU0k2SW5NeWJsTXlhM2NpZlEuUDh5cHBlc0hraTVxTXl4VGMyQ05MZyc7XHJcbiAgICAgICAgQlBSTWFwLm1hcCA9IEwubWFwYm94Lm1hcCgnbWFwLWNvbnRhaW5lcicsICdmY2Muazc0ZWQ1Z2UnLCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtYXhab29tOiBtYXh6b29tLFxyXG4gICAgICAgICAgICAgICAgbWluWm9vbTogbWluem9vbSxcclxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zZXRWaWV3KFtjZW50ZXJfbGF0LCBjZW50ZXJfbG9uXSwgaW5pdGlhbHpvb20pO1xyXG5cclxuICAgICAgICBCUFJNYXAubWFwLmF0dHJpYnV0aW9uQ29udHJvbC5hZGRBdHRyaWJ1dGlvbignPGEgaHJlZj1cImh0dHA6Ly9mY2MuZ292XCI+RkNDPC9hPicpO1xyXG5cclxuICAgICAgICAvL2Jhc2UgbGF5ZXJzXHJcbiAgICAgICAgYmFzZUxheWVyLlN0cmVldCA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGVkNWdlJykuYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgYmFzZUxheWVyLlNhdGVsbGl0ZSA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGQ3bjBnJyk7XHJcbiAgICAgICAgYmFzZUxheWVyLlRlcnJhaW4gPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRjbTNvbCcpO1xyXG5cclxuICAgICAgICAvL2dldCB0aWxlIGxheWVycyBiYXNlZCBvbiBsb2NhdGlvbiBwYXRobmFtZVxyXG4gICAgICAgIGZvciAodmFyIGxheWVyIGluIGxheWVyc1tsYXllclBhdGhdKSB7XHJcbiAgICAgICAgICAgIG1hcExheWVyW2xheWVyXSA9IEwudGlsZUxheWVyLndtcyhCUFJNYXAuZ2VvVVJMLCBsYXllcnNbbGF5ZXJQYXRoXVtsYXllcl0pLnNldFpJbmRleCgxMSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2FkZCBUcmliYWwgYW5kIFVyYmFuIGxheWVyc1xyXG4gICAgICAgIG1hcExheWVyWydUcmliYWwnXSA9IEwudGlsZUxheWVyLndtcyhCUFJNYXAuZ2VvVVJMLCBsYXllcnMudHJpYmFsKTtcclxuICAgICAgICBtYXBMYXllclsnVXJiYW4nXSA9IEwudGlsZUxheWVyLndtcyhCUFJNYXAuZ2VvVVJMLCBsYXllcnMudXJiYW4pO1xyXG5cclxuICAgICAgICAvL2xheWVyIGNvbnRyb2xcclxuICAgICAgICBsYXllckNvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKFxyXG4gICAgICAgICAgICBiYXNlTGF5ZXIsIG1hcExheWVyLCB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBoYXNoID0gTC5oYXNoKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2VvY29kZXIgPSBMLm1hcGJveC5nZW9jb2RlcignbWFwYm94LnBsYWNlcy12MScpO1xyXG5cclxuICAgIH0sIC8vZW5kIGNyZWF0ZU1hcFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLyogdmFyIGN1cnNvclg7XHJcbiAgICAgICAgdmFyIGN1cnNvclk7XHJcbiAgICAgICAgdmFyIGNsaWNrWCA9IDA7XHJcbiAgICAgICAgdmFyIGNsaWNrWSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBsYXN0VGltZXN0YW1wID0gMDtcclxuXHJcbiAgICAgICB2YXIgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgaWYgKGxhc3RUaW1lc3RhbXAgPiAwICYmIHRpbWVzdGFtcCAtIGxhc3RUaW1lc3RhbXAgPCAxMDAwKSB7XHJcbiAgICAgICAgICAgIGxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgY2xpY2tYID0gY3Vyc29yWDtcclxuICAgICAgICBjbGlja1kgPSBjdXJzb3JZOyovXHJcbiAgICAgICAgdmFyIGxhdCA9IE1hdGgucm91bmQoMTAwMDAwMCAqIGUubGF0bG5nLmxhdCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgdmFyIGxvbiA9IE1hdGgucm91bmQoMTAwMDAwMCAqIGUubGF0bG5nLmxuZykgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgbG9jYXRpb25MYXQgPSBsYXQ7XHJcbiAgICAgICAgbG9jYXRpb25Mb24gPSBsb247XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZUJsb2NrQ291bnR5TGF5ZXJzKCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZXRDb3VudHkobGF0LCBsb24pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhsYXQsIGxvbik7IH0sIDIwMCk7XHJcblxyXG4gICAgICAgIGlmICgkKCcjdGFiSW5zdHJ1Y3RzJykuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgJCgnI3RhYkluc3RydWN0cycpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNmaXhlZCwgI3Byb3ZpZGVyLCAjZGVtb2dyYXBoaWNzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB9ICAgICAgICBcclxuXHJcbiAgICB9LCAvL2VuZCB1cGRhdGVcclxuICAgIGdldENvdW50eTogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eSZtYXhGZWF0dXJlcz0xJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dDb3VudHlcclxuICAgICAgICB9KTtcclxuICAgIH0sIC8vZW5kIGdldENvdW50eVxyXG4gICAgc2hvd0NvdW50eTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBjb3VudHlEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50eV90ZXh0ID0gJ05vIGNvdW50eSBkYXRhIGZvdW5kIGF0IHlvdXIgc2VhcmNoZWQvY2xpY2tlZCBsb2NhdGlvbi4nO1xyXG4gICAgICAgICAgICAkKCcjZGlzcGxheS1jb3VudHknKS5odG1sKGNvdW50eV90ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGFibGVQb3B1bGF0aW9uLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydERlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBcclxuICAgIH0sIC8vZW5kIHNob3dDb3VudHlcclxuICAgIGdldEJsb2NrOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dCbG9ja1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNob3dCbG9jazogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBibG9ja0RhdGEgPSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXM7XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRCbG9ja0xheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyRGF0YSkuc2V0U3R5bGUoY2xpY2tlZEJsb2NrU3R5bGUpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuc2V0TG9jYXRpb25NYXJrZXIobG9jYXRpb25MYXQsIGxvY2F0aW9uTG9uKTtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtZmlwc10nKS50ZXh0KGJsb2NrRGF0YS5ibG9ja19maXBzKTtcclxuICAgICAgICAkKCdbZGF0YS1ydXJhbF0nKS50ZXh0KGJsb2NrRGF0YS51cmJhbl9ydXJhbCA9PT0gJ1InID8gJ1J1cmFsJzonVXJiYW4nKTtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgUHJvdmlkZXJzIHRhYmxlXHJcbiAgICAgICAgdGFibGVQcm92aWRlcnMuZ2V0RGF0YShibG9ja0RhdGEuYmxvY2tfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgc2V0TG9jYXRpb25NYXJrZXI6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIobG9jYXRpb25NYXJrZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIobG9jYXRpb25NYXJrZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2NhdGlvbk1hcmtlciA9IEwubWFya2VyKFtsYXQsIGxvbl0sIHsgdGl0bGU6ICcnIH0pLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBsb2NhdGlvbk1hcmtlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC56b29tVG9CbG9jaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHpvb21Ub0Jsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5maXRCb3VuZHMoY2xpY2tlZEJsb2NrTGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsgLy9lbmQgTWFwTGF5ZXJzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJQUk1hcDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuL3V0aWxpdHkuanMnKTtcclxuXHJcbnZhciB0YWJsZURlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgLy8gJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgLy8gJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgIC8vICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAvLyAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQocG9wRGF0YS5wb3BkZW5zaXR5KTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlRGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgdGFibGVQb3B1bGF0aW9uID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQocG9wRGF0YS5wb3BkZW5zaXR5KTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUG9wdWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHRhYmxlUHJvdmlkZXJzID0ge1xyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oYmxvY2tGaXBzKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyc1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9wcm92aWRlcnMmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9YmxvY2tfZmlwcz0lMjcnICsgYmxvY2tGaXBzICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1wcm92aWRlcnMnKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAnYWpheCc6IHtcclxuICAgICAgICAgICAgICAgICd1cmwnOiBwcm92aWRlcnNVUkwsXHJcbiAgICAgICAgICAgICAgICAnZGF0YVNyYyc6IHRhYmxlUHJvdmlkZXJzLmNyZWF0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAncHJvdmlkZXJOYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICd0ZWNoJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZERvd24nIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3NwZWVkVXAnIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnb3JkZXInOiBbXHJcbiAgICAgICAgICAgICAgICBbMCwgJ2FzYyddXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdwYWdpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3NlYXJjaGluZyc6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyRGF0YSA9IGRhdGEuZmVhdHVyZXM7XHJcbiAgICAgICAgdmFyIHRlbXBEYXRhID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm92aWRlckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGVtcERhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIFx0J3Byb3ZpZGVyTmFtZSc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRiYW5hbWUsXHJcbiAgICAgICAgICAgIFx0J3RlY2gnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy50ZWNobm9sb2d5LFxyXG4gICAgICAgICAgICBcdCdzcGVlZERvd24nOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kb3dubG9hZF9zcGVlZCxcclxuICAgICAgICAgICAgXHQnc3BlZWRVcCc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLnVwbG9hZF9zcGVlZFxyXG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wRGF0YTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGFibGVQcm92aWRlcnM7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHtcclxuICAgIGlzTnVsbChmaWVsZE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gZmllbGROYW1lID09PSBudWxsO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdENvbW1hKG51bSkge1xyXG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdFBlcmNlbnQobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChudW0gKiAxMDApLnRvRml4ZWQoMikgKyAnJSc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxpdHk7XHJcbiJdfQ==
