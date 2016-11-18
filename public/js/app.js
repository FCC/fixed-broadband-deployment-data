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

    var BPRMap = require('./map.js');

    var MapSearch = {
        init: function() {
            $('#btn-locSearch').on('click', 'button', MapSearch.locChange);
            $('#btn-coordSearch').on('click', 'button', MapSearch.search_decimal);
            $('#btn-geoLocation').on('click', MapSearch.geoLocation);
            $("#btn-nationLocation").on('click', function() {
                BPRMap.map.setView([50, -105], 3);
            });

            $("#input-search-switch").on('click', 'a', MapSearch.search_switch);

            $('#location-search')
                .autocomplete({
                    source: function(request, response) {
                        var location = request.term;
                        BPRMap.geocoder.query(location, processAddress);

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
            var loc = $('#location-search').val();

            BPRMap.geocoder.query(loc, codeMap);

            function codeMap(err, data) {                
                if (data.results.features.length === 0) {
                    alert("The address provided could not be found. Please enter a new address.");
                    return;
                }
                BPRMap.lat = data.latlng[0];
                BPRMap.lon = data.latlng[1];

                BPRMap.getCounty(BPRMap.lat, BPRMap.lon);
                setTimeout(function() { BPRMap.getBlock(BPRMap.lat, BPRMap.lon); }, 200);

            }
        },
        search_decimal: function() {
            BPRMap.lat = $('#latitude').val().replace(/ +/g, '');
            BPRMap.lon = $('#longitude').val().replace(/ +/g, '');

            if (BPRMap.lat === '' || BPRMap.lon === '') {
                alert('Please enter lat/lon');
                return;
            }

            if (Math.abs(BPRMap.lat) > 90 || Math.abs(BPRMap.lon) > 180) {
                alert('Lat/Lon values out of range');
                return;
            }

            BPRMap.getCounty(BPRMap.lat, BPRMap.lon);
            setTimeout(function() { BPRMap.getBlock(BPRMap.lat, BPRMap.lon); }, 200);
        },
        geoLocation: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geo_lat = position.coords.latitude;
                    var geo_lon = position.coords.longitude;
                    var geo_acc = position.coords.accuracy;

                    BPRMap.lat = Math.round(geo_lat * 1000000) / 1000000.0;
                    BPRMap.lon = Math.round(geo_lon * 1000000) / 1000000.0;

                    BPRMap.getCounty(BPRMap.lat, BPRMap.lon);
                    setTimeout(function() { BPRMap.getBlock(BPRMap.lat, BPRMap.lon); }, 200);

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
        BPRMap.lat = Math.round(1000000 * e.latlng.lat) / 1000000.0;
        BPRMap.lon = Math.round(1000000 * e.latlng.lng) / 1000000.0;

        // removeBlockCountyLayers();

        BPRMap.getCounty(BPRMap.lat, BPRMap.lon);
        setTimeout(function() { BPRMap.getBlock(BPRMap.lat, BPRMap.lon); }, 200);

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
            // $('#display-county').html(county_text);
            return;
        } else {
            if ($('#tabInstructs').is(':visible')) {
                $('#tabInstructs').addClass('hide');
                $('#fixed, #provider, #demographics').removeClass('hide');
            }
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

        BPRMap.setLocationMarker(BPRMap.lat, BPRMap.lon);

        $('[data-fips]').text(blockData.block_fips);
        $('[data-rural]').text(blockData.urban_rural === 'R' ? 'Rural' : 'Urban');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLWRlcGxveW1lbnQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9sYXllcnMtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXNwZWVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXRlY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAtc2VhcmNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtZGVtb2dyYXBoaWNzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtcG9wdWxhdGlvbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIEJQUk1hcCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAuanMnKTtcclxuICAgIHZhciBNYXBTZWFyY2ggPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLXNlYXJjaC5qcycpO1xyXG5cclxuICAgIEJQUk1hcC5pbml0KCk7XHJcbiAgICBNYXBTZWFyY2guaW5pdCgpO1xyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnRPcHRzID0ge1xyXG4gICAgbGFiZWxzOiBbXHJcbiAgICAgICAgJ1VyYmFuJyxcclxuICAgICAgICAnUnVyYWwnXHJcbiAgICBdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICcjM0Q1OUQ3JyxcclxuICAgICAgICAgICAgJyM3MURBRDYnXHJcbiAgICAgICAgXVxyXG4gICAgfV1cclxufTtcclxuXHJcbnZhciBjaGFydERlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRvbnV0O1xyXG4gICAgICAgIHZhciBjdHhEZW1vZyA9ICQoJyNjaGFydERlbW9nJyk7XHJcbiAgICAgICAgdmFyIGNoYXJ0VmFscyA9IFtdO1xyXG5cclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl91cmJhbm5vZml4ZWQpO1xyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKGRhdGEucGVyX3J1cmFsbm9maXhlZCk7XHJcblxyXG4gICAgICAgIGNoYXJ0T3B0cy5kYXRhc2V0c1swXS5kYXRhID0gY2hhcnRWYWxzO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0RGVtb2cnKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBkb251dCA9IG5ldyBDaGFydChjdHhEZW1vZywge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0T3B0cyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0RGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydERhdGEgPSB7XHJcbiAgICBsYWJlbHM6IFtcIkFsbFwiLCBcIlVyYmFuXCIsIFwiUnVyYWxcIiwgXCJUcmliYWxcIl0sXHJcbiAgICBkYXRhc2V0czogW3tcclxuICAgICAgICBsYWJlbDogJ0JvdGgnLFxyXG4gICAgICAgIGRhdGE6IFs3MjcsIDU4OSwgNTM3LCA1NDNdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCA5OSwgMTMyLCAwLjQpJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiAnRml4ZWQnLFxyXG4gICAgICAgIGRhdGE6IFsyMzgsIDU1MywgNzQ2LCA4ODRdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoNTQsIDE2MiwgMjM1LCAwLjQpJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiAnTW9iaWxlJyxcclxuICAgICAgICBkYXRhOiBbMTIzOCwgNTUzLCA3NDYsIDg4NF0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDIwNiwgODYsIDAuNCknXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGFiZWw6ICdOb25lJyxcclxuICAgICAgICBkYXRhOiBbNTg0LCA3ODksIDI1NCwgNjU0XSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDU0LCAxNjIsIDIzNSwgMC40KSdcclxuICAgIH1dXHJcbn07XHJcblxyXG52YXIgY2hhcnRGaXhlZCA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBjdHhGaXhlZCA9ICQoJyNjaGFydEZpeGVkJyk7XHJcblxyXG4gICAgICAgIGlmICgkKCcjY2hhcnRGaXhlZCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGZpeGVkQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4Rml4ZWQsIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogY2hhcnREYXRhLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydEZpeGVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzRGVwbG95bWVudCA9IHt9O1xyXG5cclxuLy9EZXBsb3ltZW50IG1hcCBsYXllcnNcclxubGF5ZXJzRGVwbG95bWVudFsnRml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnXHJcbn07XHJcblxyXG5sYXllcnNEZXBsb3ltZW50WydObyBmaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9ub25maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMSdcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzRGVwbG95bWVudDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1Byb3ZpZGVycyA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNQcm92aWRlcnNbJ1plcm8gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJ1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydPbmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1R3byBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1RocmVlIG9yIG1vcmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNQcm92aWRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNTcGVlZCA9IHt9O1xyXG5cclxuLy9TcGVlZCBtYXAgbGF5ZXJzXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBzZXJ2aWNlcyBvZiBhdCBsZWFzdCAyMDAga2JwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwIE1icHMvMSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDI1IE1icHMvMyBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDUwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwMCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1NwZWVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzVGVjaCA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNUZWNoWydGVFRQJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2ZpYmVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydDYWJsZSBtb2RlbSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9jYWJsZScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRFNMIChpbmMuIEZUVE4pLCBvdGhlciBjb3BwZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfYWRzbCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJ1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRml4ZWQgd2lyZWxlc3MnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfZncnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCdcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ090aGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX290aGVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1RlY2g7XHJcbiIsIiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIEJQUk1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XHJcblxyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLmxvY0NoYW5nZSk7XHJcbiAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1nZW9Mb2NhdGlvbicpLm9uKCdjbGljaycsIE1hcFNlYXJjaC5nZW9Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICQoXCIjYnRuLW5hdGlvbkxvY2F0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5zZXRWaWV3KFs1MCwgLTEwNV0sIDMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjaW5wdXQtc2VhcmNoLXN3aXRjaFwiKS5vbignY2xpY2snLCAnYScsIE1hcFNlYXJjaC5zZWFyY2hfc3dpdGNoKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKVxyXG4gICAgICAgICAgICAgICAgLmF1dG9jb21wbGV0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSByZXF1ZXN0LnRlcm07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJQUk1hcC5nZW9jb2Rlci5xdWVyeShsb2NhdGlvbiwgcHJvY2Vzc0FkZHJlc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0FkZHJlc3MoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGRhdGEucmVzdWx0cy5mZWF0dXJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGYubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzZXMucHVzaChmW2ldLnBsYWNlX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoYWRkcmVzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTsgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItYWxsJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci10b3AnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLXRvcCcpLmFkZENsYXNzKCd1aS1jb3JuZXItYWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsYXRpdHVkZSwgI2xvbmdpdHVkZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9jQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9ICQoJyNsb2NhdGlvbi1zZWFyY2gnKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIEJQUk1hcC5nZW9jb2Rlci5xdWVyeShsb2MsIGNvZGVNYXApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29kZU1hcChlcnIsIGRhdGEpIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHRzLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGFkZHJlc3MgcHJvdmlkZWQgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgZW50ZXIgYSBuZXcgYWRkcmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQlBSTWFwLmxhdCA9IGRhdGEubGF0bG5nWzBdO1xyXG4gICAgICAgICAgICAgICAgQlBSTWFwLmxvbiA9IGRhdGEubGF0bG5nWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfZGVjaW1hbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sYXQgPSAkKCcjbGF0aXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sb24gPSAkKCcjbG9uZ2l0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKEJQUk1hcC5sYXQgPT09ICcnIHx8IEJQUk1hcC5sb24gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVudGVyIGxhdC9sb24nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKEJQUk1hcC5sYXQpID4gOTAgfHwgTWF0aC5hYnMoQlBSTWFwLmxvbikgPiAxODApIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdMYXQvTG9uIHZhbHVlcyBvdXQgb2YgcmFuZ2UnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2VvTG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sb24gPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fYWNjID0gcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubGF0ID0gTWF0aC5yb3VuZChnZW9fbGF0ICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmxvbiA9IE1hdGgucm91bmQoZ2VvX2xvbiAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9zd2l0Y2g6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlYXJjaCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCd2YWx1ZScpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlYXJjaCA9PT0gJ2xvYycpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQWRkcmVzcycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PT0gJ2xhdGxvbi1kZWNpbWFsJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdDb29yZGluYXRlcycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hcFNlYXJjaDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdGFibGVQb3B1bGF0aW9uID0gcmVxdWlyZSgnLi90YWJsZS1wb3B1bGF0aW9uLmpzJyk7XHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHJlcXVpcmUoJy4vdGFibGUtcHJvdmlkZXJzLmpzJyk7XHJcbnZhciB0YWJsZURlbW9nID0gcmVxdWlyZSgnLi90YWJsZS1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0RGVtb2cgPSByZXF1aXJlKCcuL2NoYXJ0LWRlbW9ncmFwaGljcy5qcycpO1xyXG52YXIgY2hhcnRGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWQuanMnKTtcclxuXHJcbnZhciBsYXllcnMgPSB7XHJcbiAgICBkZXBsb3ltZW50OiByZXF1aXJlKCcuL2xheWVycy1kZXBsb3ltZW50LmpzJyksXHJcbiAgICBzcGVlZDogcmVxdWlyZSgnLi9sYXllcnMtc3BlZWQuanMnKSxcclxuICAgIHByb3ZpZGVyczogcmVxdWlyZSgnLi9sYXllcnMtcHJvdmlkZXJzLmpzJyksXHJcbiAgICB0ZWNobm9sb2d5OiByZXF1aXJlKCcuL2xheWVycy10ZWNoLmpzJyksXHJcbiAgICB0cmliYWw6IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2Jwcl90cmliYWwnLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl90cmliYWwnXHJcbiAgICB9LFxyXG4gICAgdXJiYW46IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2ZjYzpicHJfY291bnR5X2xheWVyX3VyYmFuX29ubHknLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl9sYXllcl91cmJhbidcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBsb2NhdGlvbk1hcmtlcjtcclxudmFyIGNsaWNrZWRDb3VudHlMYXllcjtcclxudmFyIGNsaWNrZWRDb3VudHlTdHlsZSA9IHsgY29sb3I6ICcjMDBmJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjb3VudHlMYXllckRhdGEgPSB7ICdmZWF0dXJlcyc6IFtdIH07XHJcblxyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXI7XHJcbnZhciBjbGlja2VkQmxvY2tTdHlsZSA9IHsgY29sb3I6ICcjMDAwJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjbGlja2VkQmxvY2tMYXllckRhdGE7XHJcblxyXG52YXIgQlBSTWFwID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIEJQUk1hcC5jcmVhdGVNYXAoKTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIG1hcCBjb250YWluZXIgd2lkdGhcclxuICAgICAgICAkKCcjbWFwLWNvbnRhaW5lcicpLm9uKCdjbGljaycsICcuY29udHJvbC1mdWxsIGEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnaGVhZGVyIC5jb250YWluZXIsIGhlYWRlciAuY29udGFpbmVyLWZsdWlkLCBtYWluJylcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcygnY29udGFpbmVyIGNvbnRhaW5lci1mbHVpZCcpXHJcbiAgICAgICAgICAgICAgICAub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJQUk1hcC5tYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcC5vbignY2xpY2snLCBCUFJNYXAudXBkYXRlKTtcclxuXHJcbiAgICAgICAgLy9sZWdlbmRcclxuICAgICAgICAvKmlmICghbWFwT3B0cy5sZWdlbmQpIHtcclxuICAgICAgICAgICAgJCgnLm1hcC1sZWdlbmQsIC5sZWdlbmRfX2ljb24nKS50b2dnbGVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnI2J0bi1jbG9zZUxlZ2VuZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLmhpZGUoJ2Zhc3QnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI2J0bi1vcGVuTGVnZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kJykuc2hvdygnZmFzdCcpO1xyXG4gICAgICAgIH0pOyovXHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy92YXIgbWFwO1xyXG4gICAgICAgIHZhciBoYXNoO1xyXG4gICAgICAgIC8vIHZhciBtYXBEYXRhID0gTWFwLmRhdGE7XHJcbiAgICAgICAgdmFyIGluaXRpYWx6b29tID0gNDtcclxuICAgICAgICB2YXIgbWF4em9vbSA9IDE1O1xyXG4gICAgICAgIHZhciBtaW56b29tID0gMztcclxuICAgICAgICB2YXIgY2VudGVyX2xhdCA9IDM4LjgyO1xyXG4gICAgICAgIHZhciBjZW50ZXJfbG9uID0gLTk0Ljk2O1xyXG4gICAgICAgIHZhciBiYXNlTGF5ZXIgPSB7fTtcclxuICAgICAgICB2YXIgbGF5ZXJDb250cm9sO1xyXG4gICAgICAgIHZhciBsYXllclBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKVsxXTtcclxuICAgICAgICB2YXIgbWFwTGF5ZXIgPSB7fTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdlb1VSTCA9ICcvZ3djL3NlcnZpY2Uvd21zP3RpbGVkPXRydWUnO1xyXG4gICAgICAgIEJQUk1hcC5nZW9fc3BhY2UgPSAnZmNjJztcclxuXHJcbiAgICAgICAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lZMjl0Y0hWMFpXTm9JaXdpWVNJNkluTXlibE15YTNjaWZRLlA4eXBwZXNIa2k1cU15eFRjMkNOTGcnO1xyXG4gICAgICAgIEJQUk1hcC5tYXAgPSBMLm1hcGJveC5tYXAoJ21hcC1jb250YWluZXInLCAnZmNjLms3NGVkNWdlJywge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRpb25Db250cm9sOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWF4Wm9vbTogbWF4em9vbSxcclxuICAgICAgICAgICAgICAgIG1pblpvb206IG1pbnpvb20sXHJcbiAgICAgICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc2V0VmlldyhbY2VudGVyX2xhdCwgY2VudGVyX2xvbl0sIGluaXRpYWx6b29tKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcC5hdHRyaWJ1dGlvbkNvbnRyb2wuYWRkQXR0cmlidXRpb24oJzxhIGhyZWY9XCJodHRwOi8vZmNjLmdvdlwiPkZDQzwvYT4nKTtcclxuXHJcbiAgICAgICAgLy9iYXNlIGxheWVyc1xyXG4gICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRlZDVnZScpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRkN24wZycpO1xyXG4gICAgICAgIGJhc2VMYXllci5UZXJyYWluID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0Y20zb2wnKTtcclxuXHJcbiAgICAgICAgLy9nZXQgdGlsZSBsYXllcnMgYmFzZWQgb24gbG9jYXRpb24gcGF0aG5hbWVcclxuICAgICAgICBmb3IgKHZhciBsYXllciBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICBtYXBMYXllcltsYXllcl0gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzW2xheWVyUGF0aF1bbGF5ZXJdKS5zZXRaSW5kZXgoMTEpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgVHJpYmFsIGFuZCBVcmJhbiBsYXllcnNcclxuICAgICAgICBtYXBMYXllclsnVHJpYmFsJ10gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzLnRyaWJhbCk7XHJcbiAgICAgICAgbWFwTGF5ZXJbJ1VyYmFuJ10gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzLnVyYmFuKTtcclxuXHJcbiAgICAgICAgLy9sYXllciBjb250cm9sXHJcbiAgICAgICAgbGF5ZXJDb250cm9sID0gTC5jb250cm9sLmxheWVycyhcclxuICAgICAgICAgICAgYmFzZUxheWVyLCBtYXBMYXllciwge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaGFzaCA9IEwuaGFzaChCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdlb2NvZGVyID0gTC5tYXBib3guZ2VvY29kZXIoJ21hcGJveC5wbGFjZXMtdjEnKTtcclxuXHJcbiAgICB9LCAvL2VuZCBjcmVhdGVNYXBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIC8qIHZhciBjdXJzb3JYO1xyXG4gICAgICAgIHZhciBjdXJzb3JZO1xyXG4gICAgICAgIHZhciBjbGlja1ggPSAwO1xyXG4gICAgICAgIHZhciBjbGlja1kgPSAwO1xyXG5cclxuICAgICAgICB2YXIgbGFzdFRpbWVzdGFtcCA9IDA7XHJcblxyXG4gICAgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VGltZXN0YW1wID4gMCAmJiB0aW1lc3RhbXAgLSBsYXN0VGltZXN0YW1wIDwgMTAwMCkge1xyXG4gICAgICAgICAgICBsYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgIGNsaWNrWCA9IGN1cnNvclg7XHJcbiAgICAgICAgY2xpY2tZID0gY3Vyc29yWTsqL1xyXG4gICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sYXQpIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgIEJQUk1hcC5sb24gPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sbmcpIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAvLyByZW1vdmVCbG9ja0NvdW50eUxheWVycygpO1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICB9LCAvL2VuZCB1cGRhdGVcclxuICAgIGdldENvdW50eTogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eSZtYXhGZWF0dXJlcz0xJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBnZW9VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IEJQUk1hcC5zaG93Q291bnR5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAvL2VuZCBnZXRDb3VudHlcclxuICAgIHNob3dDb3VudHk6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgY291bnR5RGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudHlfdGV4dCA9ICdObyBjb3VudHkgZGF0YSBmb3VuZCBhdCB5b3VyIHNlYXJjaGVkL2NsaWNrZWQgbG9jYXRpb24uJztcclxuICAgICAgICAgICAgLy8gJCgnI2Rpc3BsYXktY291bnR5JykuaHRtbChjb3VudHlfdGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoJCgnI3RhYkluc3RydWN0cycpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjdGFiSW5zdHJ1Y3RzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNmaXhlZCwgI3Byb3ZpZGVyLCAjZGVtb2dyYXBoaWNzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGFibGVQb3B1bGF0aW9uLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydERlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuXHJcbiAgICB9LCAvL2VuZCBzaG93Q291bnR5XHJcbiAgICBnZXRCbG9jazogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBnZW9VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IEJQUk1hcC5zaG93QmxvY2tcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzaG93QmxvY2s6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgYmxvY2tEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBjbGlja2VkQmxvY2tMYXllckRhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihjbGlja2VkQmxvY2tMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQmxvY2tMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcihjbGlja2VkQmxvY2tMYXllckRhdGEpLnNldFN0eWxlKGNsaWNrZWRCbG9ja1N0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLnNldExvY2F0aW9uTWFya2VyKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1maXBzXScpLnRleHQoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsXScpLnRleHQoYmxvY2tEYXRhLnVyYmFuX3J1cmFsID09PSAnUicgPyAnUnVyYWwnIDogJ1VyYmFuJyk7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIFByb3ZpZGVycyB0YWJsZVxyXG4gICAgICAgIHRhYmxlUHJvdmlkZXJzLmdldERhdGEoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG4gICAgfSxcclxuICAgIHNldExvY2F0aW9uTWFya2VyOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGxvY2F0aW9uTWFya2VyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGxvY2F0aW9uTWFya2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbbGF0LCBsb25dLCB7IHRpdGxlOiAnJyB9KS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBCUFJNYXAuem9vbVRvQmxvY2soKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB6b29tVG9CbG9jazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAuZml0Qm91bmRzKGNsaWNrZWRCbG9ja0xheWVyLmdldEJvdW5kcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IC8vZW5kIE1hcExheWVyc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCUFJNYXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgdGFibGVEZW1vZyA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oY291bnR5RGF0YSkge1xyXG4gICAgXHR2YXIgcG9wRGF0YSA9IHtcclxuXHRcdFx0Y291bnR5X25hbWU6IGNvdW50eURhdGEuY291bnR5X25hbWUsXHJcblx0XHRcdHN0YXRlX2FiYnI6IGNvdW50eURhdGEuc3RhdGVfYWJicixcclxuXHRcdFx0cG9wMjAxNTogY291bnR5RGF0YS5wb3AyMDE1LFxyXG5cdFx0XHRwb3BkZW5zaXR5OiBjb3VudHlEYXRhLnBvcGRlbnNpdHksXHJcblx0XHRcdHBlcmNhcGluYzogY291bnR5RGF0YS5wZXJjYXBpbmMsXHJcblx0XHRcdHVuc3BvcDI1XzM6IGNvdW50eURhdGEudW5zcG9wMjVfMyxcclxuXHRcdFx0cGVyX3VyYmFubm9maXhlZDogY291bnR5RGF0YS5wZXJfdXJiYW5ub2ZpeGVkLFxyXG5cdFx0XHRwZXJfcnVyYWxub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl9ydXJhbG5vZml4ZWRcclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yICh2YXIgcHJvcE5hbWUgaW4gcG9wRGF0YSkge1xyXG5cdFx0XHRpZiAodXRpbGl0eS5pc051bGwocG9wRGF0YVtwcm9wTmFtZV0pKSB7XHJcblx0XHRcdFx0cG9wRGF0YVtwcm9wTmFtZV0gPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuICAgICAgICAvL3BvcHVsYXRlIENlbnN1cyBCbG9jayB0YWJsZVxyXG4gICAgICAgIC8vICQoJ1tkYXRhLWNvdW50eV0nKS50ZXh0KHBvcERhdGEuY291bnR5X25hbWUpO1xyXG4gICAgICAgIC8vICQoJ1tkYXRhLXN0YXRlXScpLnRleHQocG9wRGF0YS5zdGF0ZV9hYmJyKTtcclxuICAgICAgICAvLyAkKCdbZGF0YS10b3RhbFBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wb3AyMDE1KSk7XHJcbiAgICAgICAgLy8gJCgnW2RhdGEtcG9wRGVuc2l0eV0nKS50ZXh0KHBvcERhdGEucG9wZGVuc2l0eSk7XHJcbiAgICAgICAgJCgnW2RhdGEtaW5jb21lQ2FwaXRhXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBlcmNhcGluYykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wTm9BY2Nlc3NdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEudW5zcG9wMjVfMykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXVyYmFuUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3VyYmFubm9maXhlZCkpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3J1cmFsbm9maXhlZCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZURlbW9nO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4vdXRpbGl0eS5qcycpO1xyXG5cclxudmFyIHRhYmxlUG9wdWxhdGlvbiA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oY291bnR5RGF0YSkge1xyXG4gICAgXHR2YXIgcG9wRGF0YSA9IHtcclxuXHRcdFx0Y291bnR5X25hbWU6IGNvdW50eURhdGEuY291bnR5X25hbWUsXHJcblx0XHRcdHN0YXRlX2FiYnI6IGNvdW50eURhdGEuc3RhdGVfYWJicixcclxuXHRcdFx0cG9wMjAxNTogY291bnR5RGF0YS5wb3AyMDE1LFxyXG5cdFx0XHRwb3BkZW5zaXR5OiBjb3VudHlEYXRhLnBvcGRlbnNpdHksXHJcblx0XHRcdHBlcmNhcGluYzogY291bnR5RGF0YS5wZXJjYXBpbmMsXHJcblx0XHRcdHVuc3BvcDI1XzM6IGNvdW50eURhdGEudW5zcG9wMjVfMyxcclxuXHRcdFx0cGVyX3VyYmFubm9maXhlZDogY291bnR5RGF0YS5wZXJfdXJiYW5ub2ZpeGVkLFxyXG5cdFx0XHRwZXJfcnVyYWxub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl9ydXJhbG5vZml4ZWRcclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yICh2YXIgcHJvcE5hbWUgaW4gcG9wRGF0YSkge1xyXG5cdFx0XHRpZiAodXRpbGl0eS5pc051bGwocG9wRGF0YVtwcm9wTmFtZV0pKSB7XHJcblx0XHRcdFx0cG9wRGF0YVtwcm9wTmFtZV0gPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuICAgICAgICAvL3BvcHVsYXRlIENlbnN1cyBCbG9jayB0YWJsZVxyXG4gICAgICAgICQoJ1tkYXRhLWNvdW50eV0nKS50ZXh0KHBvcERhdGEuY291bnR5X25hbWUpO1xyXG4gICAgICAgICQoJ1tkYXRhLXN0YXRlXScpLnRleHQocG9wRGF0YS5zdGF0ZV9hYmJyKTtcclxuICAgICAgICAkKCdbZGF0YS10b3RhbFBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wb3AyMDE1KSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcG9wRGVuc2l0eV0nKS50ZXh0KHBvcERhdGEucG9wZGVuc2l0eSk7XHJcbiAgICAgICAgJCgnW2RhdGEtaW5jb21lQ2FwaXRhXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBlcmNhcGluYykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wTm9BY2Nlc3NdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEudW5zcG9wMjVfMykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXVyYmFuUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3VyYmFubm9maXhlZCkpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3J1cmFsbm9maXhlZCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZVBvcHVsYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHtcclxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGJsb2NrRmlwcykge1xyXG4gICAgICAgIHZhciBwcm92aWRlcnNVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfcHJvdmlkZXJzJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWJsb2NrX2ZpcHM9JTI3JyArIGJsb2NrRmlwcyArICclMjcnO1xyXG5cclxuICAgICAgICAkKCcjdGFibGUtcHJvdmlkZXJzJykuRGF0YVRhYmxlKHtcclxuICAgICAgICAgICAgJ2FqYXgnOiB7XHJcbiAgICAgICAgICAgICAgICAndXJsJzogcHJvdmlkZXJzVVJMLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGFTcmMnOiB0YWJsZVByb3ZpZGVycy5jcmVhdGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3Byb3ZpZGVyTmFtZScgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAndGVjaCcgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAnc3BlZWREb3duJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZFVwJyB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdkZXN0cm95JzogdHJ1ZSxcclxuICAgICAgICAgICAgJ2luZm8nOiBmYWxzZSxcclxuICAgICAgICAgICAgJ29yZGVyJzogW1xyXG4gICAgICAgICAgICAgICAgWzAsICdhc2MnXVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAncGFnaW5nJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdzZWFyY2hpbmcnOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBwcm92aWRlckRhdGEgPSBkYXRhLmZlYXR1cmVzO1xyXG4gICAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvdmlkZXJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRlbXBEYXRhLnB1c2goe1xyXG4gICAgICAgICAgICBcdCdwcm92aWRlck5hbWUnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kYmFuYW1lLFxyXG4gICAgICAgICAgICBcdCd0ZWNoJzogcHJvdmlkZXJEYXRhW2ldLnByb3BlcnRpZXMudGVjaG5vbG9neSxcclxuICAgICAgICAgICAgXHQnc3BlZWREb3duJzogcHJvdmlkZXJEYXRhW2ldLnByb3BlcnRpZXMuZG93bmxvYWRfc3BlZWQsXHJcbiAgICAgICAgICAgIFx0J3NwZWVkVXAnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy51cGxvYWRfc3BlZWRcclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUHJvdmlkZXJzO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSB7XHJcbiAgICBpc051bGwoZmllbGROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkTmFtZSA9PT0gbnVsbDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRDb21tYShudW0pIHtcclxuICAgICAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRQZXJjZW50KG51bSkge1xyXG4gICAgICAgIHJldHVybiAobnVtICogMTAwKS50b0ZpeGVkKDIpICsgJyUnO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dGlsaXR5O1xyXG4iXX0=
