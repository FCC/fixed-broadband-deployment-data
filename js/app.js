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
    styles: 'bpr_layer_fixed_0',
    color: '#FFE773',
    zIndex: 11
};

layersDeployment['No fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_county_layer_nonfixed',
    styles: 'bpr_layer_fixed_1',
    color: '#6CBCD5',
    zIndex: 12
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
    styles: 'bpr_dec2016_numprov_0',
    color: '#ffffcc',
    zIndex: 11
};

layersProviders['One fixed 25 Mbps/3 Mbps provider'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_1',
    styles: 'bpr_dec2016_numprov_1',
    color: '#fdcc8a',
    zIndex: 12
};

layersProviders['Two fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_2',
    styles: 'bpr_dec2016_numprov_2',
    color: '#fc8d59',
    zIndex: 13
};

layersProviders['Three or more fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_3',
    styles: 'bpr_dec2016_numprov_3',
    color: '#d7301f',
    zIndex: 14
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
    styles: 'bpr_dec2016_speed200',
    color: '#c7e9b4',
    zIndex: 11
};

layersSpeed['Residential broadband of at least 10 Mbps/1 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed10',
    styles: 'bpr_dec2016_speed10',
    color: '#7fcdbb',
    zIndex: 12
};

layersSpeed['Residential broadband of at least 25 Mbps/3 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed25',
    styles: 'bpr_dec2016_speed25',
    color: '#bdd7e7',
    zIndex: 13
};

layersSpeed['Residential broadband of at least 50 Mbps/5 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed50',
    styles: 'bpr_dec2016_speed50',
    color: '#3182bd',
    zIndex: 14
};

layersSpeed['Residential broadband of at least 100 Mbps/5 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_speed100',
    styles: 'bpr_dec2016_speed100',
    color: '#08306b',
    zIndex: 15
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
    styles: 'bpr_dec2016_tech',
    color: '#ffffcc',
    zIndex: 11
};

layersTech['Cable modem'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_cable',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 12
};

layersTech['DSL (inc. FTTN), other copper'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_adsl',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 13
};

layersTech['Fixed wireless'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_fw',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 14
};

layersTech['Other'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_other',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 15
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

        BPRMap.createMap();        

        BPRMap.map.on('click', BPRMap.update);        

        // toggle map container width
        $('.control-full').on('click', 'a', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('header .container, header .container-fluid, main')
                .toggleClass('container container-fluid')
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function(e) {
                        BPRMap.map.invalidateSize();
                    });
        });

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
        
        BPRMap.mapLayer = {};

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

        hash = L.hash(BPRMap.map);

        BPRMap.geocoder = L.mapbox.geocoder('mapbox.places-v1');

        BPRMap.createLegend(layerPath);

    }, //end createMap
    createLegend: function(layerPath) {
        var td = '';
        var tr = '';
        var count = 0;

        for(var key in layers[layerPath]) {            
            td += '<td><input id="chk' + count + '" type="checkbox" data-layer="' + key + '" checked></td>';
            td += '<td><div class="key-symbol" style="background-color:' + layers[layerPath][key].color + '"></div></td>';
            td += '<td><label for="chk' + count + '">' + key + '</label></td>';
            tr += '<tr>' + td + '</tr>';
            td = '';
            count++;
        }

        $('.map-legend')
            .find('tbody').prepend(tr)
            .end()
            .on('click', '[type=checkbox]', function() {
                var layerName = $(this).attr('data-layer');

                if (this.checked) { 
                    BPRMap.mapLayer[layerName].addTo(BPRMap.map);
                } else {
                    BPRMap.map.removeLayer(BPRMap.mapLayer[layerName]);
                }
                
            });       
    },
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

        tableDemog.create(countyData);
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

},{"./chart-demographics.js":2,"./chart-fixed.js":3,"./layers-deployment.js":4,"./layers-providers.js":5,"./layers-speed.js":6,"./layers-tech.js":7,"./table-demographics.js":10,"./table-providers.js":11}],10:[function(require,module,exports){
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
        $('[data-county]').text(popData.county_name);
        $('[data-state]').text(popData.state_abbr);
        $('[data-totalPop]').text(utility.formatComma(popData.pop2015));
        $('[data-popDensity]').text(utility.formatComma(popData.popdensity));
        $('[data-incomeCapita]').text(utility.formatComma(popData.percapinc));
        $('[data-totalPopNoAccess]').text(utility.formatComma(popData.unspop25_3));
        $('[data-urbanPop]').text(utility.formatPercent(popData.per_urbannofixed));
        $('[data-ruralPop]').text(utility.formatPercent(popData.per_ruralnofixed));
    }
};

module.exports = tableDemog;

},{"./utility.js":12}],11:[function(require,module,exports){
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


},{}],12:[function(require,module,exports){
'use strict';

var utility = {
    isNull(fieldName) {
        return fieldName === null;
    },
    formatComma(num) {
        var parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    },
    formatPercent(num) {
        return (num * 100).toFixed(2) + '%';
    }
};

module.exports = utility;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLWRlcGxveW1lbnQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9sYXllcnMtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXNwZWVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXRlY2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9tYXAtc2VhcmNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtZGVtb2dyYXBoaWNzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBCUFJNYXAgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLmpzJyk7XHJcbiAgICB2YXIgTWFwU2VhcmNoID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC1zZWFyY2guanMnKTtcclxuXHJcbiAgICBCUFJNYXAuaW5pdCgpO1xyXG4gICAgTWFwU2VhcmNoLmluaXQoKTtcclxufSgpKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0T3B0cyA9IHtcclxuICAgIGxhYmVsczogW1xyXG4gICAgICAgICdVcmJhbicsXHJcbiAgICAgICAgJ1J1cmFsJ1xyXG4gICAgXSxcclxuICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogW1xyXG4gICAgICAgICAgICAnIzNENTlENycsXHJcbiAgICAgICAgICAgICcjNzFEQUQ2J1xyXG4gICAgICAgIF1cclxuICAgIH1dXHJcbn07XHJcblxyXG52YXIgY2hhcnREZW1vZyA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBkb251dDtcclxuICAgICAgICB2YXIgY3R4RGVtb2cgPSAkKCcjY2hhcnREZW1vZycpO1xyXG4gICAgICAgIHZhciBjaGFydFZhbHMgPSBbXTtcclxuXHJcbiAgICAgICAgY2hhcnRWYWxzLnB1c2goZGF0YS5wZXJfdXJiYW5ub2ZpeGVkKTtcclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl9ydXJhbG5vZml4ZWQpO1xyXG5cclxuICAgICAgICBjaGFydE9wdHMuZGF0YXNldHNbMF0uZGF0YSA9IGNoYXJ0VmFscztcclxuXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydERlbW9nJykubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgZG9udXQgPSBuZXcgQ2hhcnQoY3R4RGVtb2csIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdkb3VnaG51dCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBjaGFydE9wdHMsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydERlbW9nO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnREYXRhID0ge1xyXG4gICAgbGFiZWxzOiBbXCJBbGxcIiwgXCJVcmJhblwiLCBcIlJ1cmFsXCIsIFwiVHJpYmFsXCJdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgbGFiZWw6ICdCb3RoJyxcclxuICAgICAgICBkYXRhOiBbNzI3LCA1ODksIDUzNywgNTQzXSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgOTksIDEzMiwgMC40KSdcclxuICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogJ0ZpeGVkJyxcclxuICAgICAgICBkYXRhOiBbMjM4LCA1NTMsIDc0NiwgODg0XSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDU0LCAxNjIsIDIzNSwgMC40KSdcclxuICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogJ01vYmlsZScsXHJcbiAgICAgICAgZGF0YTogWzEyMzgsIDU1MywgNzQ2LCA4ODRdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyMDYsIDg2LCAwLjQpJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiAnTm9uZScsXHJcbiAgICAgICAgZGF0YTogWzU4NCwgNzg5LCAyNTQsIDY1NF0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1NCwgMTYyLCAyMzUsIDAuNCknXHJcbiAgICB9XVxyXG59O1xyXG5cclxudmFyIGNoYXJ0Rml4ZWQgPSB7XHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgY3R4Rml4ZWQgPSAkKCcjY2hhcnRGaXhlZCcpO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0Rml4ZWQnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBmaXhlZENoYXJ0ID0gbmV3IENoYXJ0KGN0eEZpeGVkLCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0RGF0YSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc0RlcGxveW1lbnQgPSB7fTtcclxuXHJcbi8vRGVwbG95bWVudCBtYXAgbGF5ZXJzXHJcbmxheWVyc0RlcGxveW1lbnRbJ0ZpeGVkIGJyb2FkYmFuZCAyNS8zIChNYnBzKSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfY291bnR5X2xheWVyX2ZpeGVkJyxcclxuICAgIHN0eWxlczogJ2Jwcl9sYXllcl9maXhlZF8wJyxcclxuICAgIGNvbG9yOiAnI0ZGRTc3MycsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNEZXBsb3ltZW50WydObyBmaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9ub25maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMScsXHJcbiAgICBjb2xvcjogJyM2Q0JDRDUnLFxyXG4gICAgekluZGV4OiAxMlxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNEZXBsb3ltZW50O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzUHJvdmlkZXJzID0ge307XHJcblxyXG4vL1Byb3ZpZGVycyBtYXAgbGF5ZXJzXHJcbmxheWVyc1Byb3ZpZGVyc1snWmVybyBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgY29sb3I6ICcjZmZmZmNjJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snT25lIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJyxcclxuICAgIGNvbG9yOiAnI2ZkY2M4YScsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1R3byBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInLFxyXG4gICAgY29sb3I6ICcjZmM4ZDU5JyxcclxuICAgIHpJbmRleDogMTNcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snVGhyZWUgb3IgbW9yZSBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMycsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgY29sb3I6ICcjZDczMDFmJyxcclxuICAgIHpJbmRleDogMTRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzU3BlZWQgPSB7fTtcclxuXHJcbi8vU3BlZWQgbWFwIGxheWVyc1xyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgc2VydmljZXMgb2YgYXQgbGVhc3QgMjAwIGticHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJyxcclxuICAgIGNvbG9yOiAnI2M3ZTliNCcsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwIE1icHMvMSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnLFxyXG4gICAgY29sb3I6ICcjN2ZjZGJiJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMjUgTWJwcy8zIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyNScsXHJcbiAgICBjb2xvcjogJyNiZGQ3ZTcnLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCA1MCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQ1MCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIGNvbG9yOiAnIzMxODJiZCcsXHJcbiAgICB6SW5kZXg6IDE0XHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwMCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMDAnLFxyXG4gICAgY29sb3I6ICcjMDgzMDZiJyxcclxuICAgIHpJbmRleDogMTVcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzU3BlZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNUZWNoID0ge307XHJcblxyXG4vL1Byb3ZpZGVycyBtYXAgbGF5ZXJzXHJcbmxheWVyc1RlY2hbJ0ZUVFAnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfZmliZXInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyNmZmZmY2MnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnQ2FibGUgbW9kZW0nXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfY2FibGUnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxMlxyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRFNMIChpbmMuIEZUVE4pLCBvdGhlciBjb3BwZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfYWRzbCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDEzXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydGaXhlZCB3aXJlbGVzcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9mdycsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDE0XHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydPdGhlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9vdGhlcicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDE1XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1RlY2g7XHJcbiIsIiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIEJQUk1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XHJcblxyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLmxvY0NoYW5nZSk7XHJcbiAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1nZW9Mb2NhdGlvbicpLm9uKCdjbGljaycsIE1hcFNlYXJjaC5nZW9Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICQoXCIjYnRuLW5hdGlvbkxvY2F0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5zZXRWaWV3KFs1MCwgLTEwNV0sIDMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjaW5wdXQtc2VhcmNoLXN3aXRjaFwiKS5vbignY2xpY2snLCAnYScsIE1hcFNlYXJjaC5zZWFyY2hfc3dpdGNoKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKVxyXG4gICAgICAgICAgICAgICAgLmF1dG9jb21wbGV0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSByZXF1ZXN0LnRlcm07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJQUk1hcC5nZW9jb2Rlci5xdWVyeShsb2NhdGlvbiwgcHJvY2Vzc0FkZHJlc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0FkZHJlc3MoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGRhdGEucmVzdWx0cy5mZWF0dXJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGYubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzZXMucHVzaChmW2ldLnBsYWNlX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoYWRkcmVzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTsgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItYWxsJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci10b3AnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLXRvcCcpLmFkZENsYXNzKCd1aS1jb3JuZXItYWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsYXRpdHVkZSwgI2xvbmdpdHVkZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9jQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9ICQoJyNsb2NhdGlvbi1zZWFyY2gnKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIEJQUk1hcC5nZW9jb2Rlci5xdWVyeShsb2MsIGNvZGVNYXApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29kZU1hcChlcnIsIGRhdGEpIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHRzLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGFkZHJlc3MgcHJvdmlkZWQgY291bGQgbm90IGJlIGZvdW5kLiBQbGVhc2UgZW50ZXIgYSBuZXcgYWRkcmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQlBSTWFwLmxhdCA9IGRhdGEubGF0bG5nWzBdO1xyXG4gICAgICAgICAgICAgICAgQlBSTWFwLmxvbiA9IGRhdGEubGF0bG5nWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfZGVjaW1hbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sYXQgPSAkKCcjbGF0aXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sb24gPSAkKCcjbG9uZ2l0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKEJQUk1hcC5sYXQgPT09ICcnIHx8IEJQUk1hcC5sb24gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVudGVyIGxhdC9sb24nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKEJQUk1hcC5sYXQpID4gOTAgfHwgTWF0aC5hYnMoQlBSTWFwLmxvbikgPiAxODApIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdMYXQvTG9uIHZhbHVlcyBvdXQgb2YgcmFuZ2UnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2VvTG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19sb24gPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fYWNjID0gcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubGF0ID0gTWF0aC5yb3VuZChnZW9fbGF0ICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmxvbiA9IE1hdGgucm91bmQoZ2VvX2xvbiAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBjdXJyZW50IGxvY2F0aW9uIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkLiBcXG5QbGVhc2UgdXNlIHRoZSBzZWFyY2ggYm94IHRvIGVudGVyIHlvdXIgbG9jYXRpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9zd2l0Y2g6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlYXJjaCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCd2YWx1ZScpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlYXJjaCA9PT0gJ2xvYycpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQWRkcmVzcycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PT0gJ2xhdGxvbi1kZWNpbWFsJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdDb29yZGluYXRlcycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hcFNlYXJjaDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdGFibGVQcm92aWRlcnMgPSByZXF1aXJlKCcuL3RhYmxlLXByb3ZpZGVycy5qcycpO1xyXG52YXIgdGFibGVEZW1vZyA9IHJlcXVpcmUoJy4vdGFibGUtZGVtb2dyYXBoaWNzLmpzJyk7XHJcbnZhciBjaGFydERlbW9nID0gcmVxdWlyZSgnLi9jaGFydC1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0Rml4ZWQgPSByZXF1aXJlKCcuL2NoYXJ0LWZpeGVkLmpzJyk7XHJcblxyXG52YXIgbGF5ZXJzID0ge1xyXG4gICAgZGVwbG95bWVudDogcmVxdWlyZSgnLi9sYXllcnMtZGVwbG95bWVudC5qcycpLFxyXG4gICAgc3BlZWQ6IHJlcXVpcmUoJy4vbGF5ZXJzLXNwZWVkLmpzJyksXHJcbiAgICBwcm92aWRlcnM6IHJlcXVpcmUoJy4vbGF5ZXJzLXByb3ZpZGVycy5qcycpLFxyXG4gICAgdGVjaG5vbG9neTogcmVxdWlyZSgnLi9sYXllcnMtdGVjaC5qcycpLFxyXG4gICAgdHJpYmFsOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdicHJfdHJpYmFsJyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfdHJpYmFsJyxcclxuICAgICAgICB6SW5kZXg6IDE5XHJcbiAgICB9LFxyXG4gICAgdXJiYW46IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2ZjYzpicHJfY291bnR5X2xheWVyX3VyYmFuX29ubHknLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl9sYXllcl91cmJhbicsXHJcbiAgICAgICAgekluZGV4OiAyMFxyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGxvY2F0aW9uTWFya2VyO1xyXG52YXIgY2xpY2tlZENvdW50eUxheWVyO1xyXG52YXIgY2xpY2tlZENvdW50eVN0eWxlID0geyBjb2xvcjogJyMwMGYnLCBvcGFjaXR5OiAwLjUsIGZpbGxPcGFjaXR5OiAwLjEsIGZpbGxDb2xvcjogJyNmZmYnLCB3ZWlnaHQ6IDMgfTtcclxudmFyIGNvdW50eUxheWVyRGF0YSA9IHsgJ2ZlYXR1cmVzJzogW10gfTtcclxuXHJcbnZhciBjbGlja2VkQmxvY2tMYXllcjtcclxudmFyIGNsaWNrZWRCbG9ja1N0eWxlID0geyBjb2xvcjogJyMwMDAnLCBvcGFjaXR5OiAwLjUsIGZpbGxPcGFjaXR5OiAwLjEsIGZpbGxDb2xvcjogJyNmZmYnLCB3ZWlnaHQ6IDMgfTtcclxudmFyIGNsaWNrZWRCbG9ja0xheWVyRGF0YTtcclxuXHJcbnZhciBCUFJNYXAgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgQlBSTWFwLmNyZWF0ZU1hcCgpOyAgICAgICAgXHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAub24oJ2NsaWNrJywgQlBSTWFwLnVwZGF0ZSk7ICAgICAgICBcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIG1hcCBjb250YWluZXIgd2lkdGhcclxuICAgICAgICAkKCcuY29udHJvbC1mdWxsJykub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICQoJ2hlYWRlciAuY29udGFpbmVyLCBoZWFkZXIgLmNvbnRhaW5lci1mbHVpZCwgbWFpbicpXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NvbnRhaW5lciBjb250YWluZXItZmx1aWQnKVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy92YXIgbWFwO1xyXG4gICAgICAgIHZhciBoYXNoO1xyXG4gICAgICAgIC8vIHZhciBtYXBEYXRhID0gTWFwLmRhdGE7XHJcbiAgICAgICAgdmFyIGluaXRpYWx6b29tID0gNDtcclxuICAgICAgICB2YXIgbWF4em9vbSA9IDE1O1xyXG4gICAgICAgIHZhciBtaW56b29tID0gMztcclxuICAgICAgICB2YXIgY2VudGVyX2xhdCA9IDM4LjgyO1xyXG4gICAgICAgIHZhciBjZW50ZXJfbG9uID0gLTk0Ljk2O1xyXG4gICAgICAgIHZhciBiYXNlTGF5ZXIgPSB7fTtcclxuICAgICAgICB2YXIgbGF5ZXJDb250cm9sO1xyXG4gICAgICAgIHZhciBsYXllclBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKVsxXTtcclxuICAgICAgICBcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXIgPSB7fTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdlb1VSTCA9ICcvZ3djL3NlcnZpY2Uvd21zP3RpbGVkPXRydWUnO1xyXG4gICAgICAgIEJQUk1hcC5nZW9fc3BhY2UgPSAnZmNjJztcclxuXHJcbiAgICAgICAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lZMjl0Y0hWMFpXTm9JaXdpWVNJNkluTXlibE15YTNjaWZRLlA4eXBwZXNIa2k1cU15eFRjMkNOTGcnO1xyXG4gICAgICAgIEJQUk1hcC5tYXAgPSBMLm1hcGJveC5tYXAoJ21hcC1jb250YWluZXInLCAnZmNjLms3NGVkNWdlJywge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRpb25Db250cm9sOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWF4Wm9vbTogbWF4em9vbSxcclxuICAgICAgICAgICAgICAgIG1pblpvb206IG1pbnpvb20sXHJcbiAgICAgICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc2V0VmlldyhbY2VudGVyX2xhdCwgY2VudGVyX2xvbl0sIGluaXRpYWx6b29tKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcC5hdHRyaWJ1dGlvbkNvbnRyb2wuYWRkQXR0cmlidXRpb24oJzxhIGhyZWY9XCJodHRwOi8vZmNjLmdvdlwiPkZDQzwvYT4nKTtcclxuXHJcbiAgICAgICAgLy9iYXNlIGxheWVyc1xyXG4gICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRlZDVnZScpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRkN24wZycpO1xyXG4gICAgICAgIGJhc2VMYXllci5UZXJyYWluID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0Y20zb2wnKTtcclxuXHJcbiAgICAgICAgLy9nZXQgdGlsZSBsYXllcnMgYmFzZWQgb24gbG9jYXRpb24gcGF0aG5hbWVcclxuICAgICAgICBmb3IgKHZhciBsYXllciBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwTGF5ZXJbbGF5ZXJdID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVyc1tsYXllclBhdGhdW2xheWVyXSkuc2V0WkluZGV4KGxheWVyc1tsYXllclBhdGhdW2xheWVyXS56SW5kZXgpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgVHJpYmFsIGFuZCBVcmJhbiBsYXllcnNcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXJbJ1RyaWJhbCddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy50cmliYWwpLnNldFpJbmRleChsYXllcnMudHJpYmFsLnpJbmRleCk7XHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyWydVcmJhbiddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy51cmJhbikuc2V0WkluZGV4KGxheWVycy51cmJhbi56SW5kZXgpO1xyXG5cclxuICAgICAgICAvL2xheWVyIGNvbnRyb2xcclxuICAgICAgICBsYXllckNvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKFxyXG4gICAgICAgICAgICBiYXNlTGF5ZXIsIHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBoYXNoID0gTC5oYXNoKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2VvY29kZXIgPSBMLm1hcGJveC5nZW9jb2RlcignbWFwYm94LnBsYWNlcy12MScpO1xyXG5cclxuICAgICAgICBCUFJNYXAuY3JlYXRlTGVnZW5kKGxheWVyUGF0aCk7XHJcblxyXG4gICAgfSwgLy9lbmQgY3JlYXRlTWFwXHJcbiAgICBjcmVhdGVMZWdlbmQ6IGZ1bmN0aW9uKGxheWVyUGF0aCkge1xyXG4gICAgICAgIHZhciB0ZCA9ICcnO1xyXG4gICAgICAgIHZhciB0ciA9ICcnO1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIGxheWVyc1tsYXllclBhdGhdKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRkICs9ICc8dGQ+PGlucHV0IGlkPVwiY2hrJyArIGNvdW50ICsgJ1wiIHR5cGU9XCJjaGVja2JveFwiIGRhdGEtbGF5ZXI9XCInICsga2V5ICsgJ1wiIGNoZWNrZWQ+PC90ZD4nO1xyXG4gICAgICAgICAgICB0ZCArPSAnPHRkPjxkaXYgY2xhc3M9XCJrZXktc3ltYm9sXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOicgKyBsYXllcnNbbGF5ZXJQYXRoXVtrZXldLmNvbG9yICsgJ1wiPjwvZGl2PjwvdGQ+JztcclxuICAgICAgICAgICAgdGQgKz0gJzx0ZD48bGFiZWwgZm9yPVwiY2hrJyArIGNvdW50ICsgJ1wiPicgKyBrZXkgKyAnPC9sYWJlbD48L3RkPic7XHJcbiAgICAgICAgICAgIHRyICs9ICc8dHI+JyArIHRkICsgJzwvdHI+JztcclxuICAgICAgICAgICAgdGQgPSAnJztcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy5tYXAtbGVnZW5kJylcclxuICAgICAgICAgICAgLmZpbmQoJ3Rib2R5JykucHJlcGVuZCh0cilcclxuICAgICAgICAgICAgLmVuZCgpXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCAnW3R5cGU9Y2hlY2tib3hdJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF5ZXJOYW1lID0gJCh0aGlzKS5hdHRyKCdkYXRhLWxheWVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCkgeyBcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwTGF5ZXJbbGF5ZXJOYW1lXS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihCUFJNYXAubWFwTGF5ZXJbbGF5ZXJOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7ICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIC8qIHZhciBjdXJzb3JYO1xyXG4gICAgICAgIHZhciBjdXJzb3JZO1xyXG4gICAgICAgIHZhciBjbGlja1ggPSAwO1xyXG4gICAgICAgIHZhciBjbGlja1kgPSAwO1xyXG5cclxuICAgICAgICB2YXIgbGFzdFRpbWVzdGFtcCA9IDA7XHJcblxyXG4gICAgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VGltZXN0YW1wID4gMCAmJiB0aW1lc3RhbXAgLSBsYXN0VGltZXN0YW1wIDwgMTAwMCkge1xyXG4gICAgICAgICAgICBsYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgIGNsaWNrWCA9IGN1cnNvclg7XHJcbiAgICAgICAgY2xpY2tZID0gY3Vyc29yWTsqL1xyXG4gICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sYXQpIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgIEJQUk1hcC5sb24gPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sbmcpIC8gMTAwMDAwMC4wO1xyXG5cclxuICAgICAgICAvLyByZW1vdmVCbG9ja0NvdW50eUxheWVycygpO1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICB9LCAvL2VuZCB1cGRhdGVcclxuICAgIGdldENvdW50eTogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eSZtYXhGZWF0dXJlcz0xJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBnZW9VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IEJQUk1hcC5zaG93Q291bnR5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAvL2VuZCBnZXRDb3VudHlcclxuICAgIHNob3dDb3VudHk6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgY291bnR5RGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudHlfdGV4dCA9ICdObyBjb3VudHkgZGF0YSBmb3VuZCBhdCB5b3VyIHNlYXJjaGVkL2NsaWNrZWQgbG9jYXRpb24uJztcclxuICAgICAgICAgICAgLy8gJCgnI2Rpc3BsYXktY291bnR5JykuaHRtbChjb3VudHlfdGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoJCgnI3RhYkluc3RydWN0cycpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjdGFiSW5zdHJ1Y3RzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNmaXhlZCwgI3Byb3ZpZGVyLCAjZGVtb2dyYXBoaWNzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGFibGVEZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgdGFibGVEZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnREZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5jcmVhdGUoY291bnR5RGF0YSk7XHJcblxyXG4gICAgfSwgLy9lbmQgc2hvd0NvdW50eVxyXG4gICAgZ2V0QmxvY2s6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgdmFyIGdlb1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWJwcl9kZWMyMDE2Jm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvbnRhaW5zKGdlb20sJTIwUE9JTlQoJyArIGxvbiArICclMjAnICsgbGF0ICsgJykpJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogZ2VvVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBCUFJNYXAuc2hvd0Jsb2NrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Jsb2NrOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGJsb2NrRGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuXHJcbiAgICAgICAgY2xpY2tlZEJsb2NrTGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZEJsb2NrTGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXJEYXRhKS5zZXRTdHlsZShjbGlja2VkQmxvY2tTdHlsZSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5zZXRMb2NhdGlvbk1hcmtlcihCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtZmlwc10nKS50ZXh0KGJsb2NrRGF0YS5ibG9ja19maXBzKTtcclxuICAgICAgICAkKCdbZGF0YS1ydXJhbF0nKS50ZXh0KGJsb2NrRGF0YS51cmJhbl9ydXJhbCA9PT0gJ1InID8gJ1J1cmFsJyA6ICdVcmJhbicpO1xyXG5cclxuICAgICAgICAvL3VwZGF0ZSBQcm92aWRlcnMgdGFibGVcclxuICAgICAgICB0YWJsZVByb3ZpZGVycy5nZXREYXRhKGJsb2NrRGF0YS5ibG9ja19maXBzKTtcclxuICAgIH0sXHJcbiAgICBzZXRMb2NhdGlvbk1hcmtlcjogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihsb2NhdGlvbk1hcmtlcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihsb2NhdGlvbk1hcmtlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvY2F0aW9uTWFya2VyID0gTC5tYXJrZXIoW2xhdCwgbG9uXSwgeyB0aXRsZTogJycgfSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIGxvY2F0aW9uTWFya2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnpvb21Ub0Jsb2NrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgem9vbVRvQmxvY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRCbG9ja0xheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQmxvY2tMYXllci5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyAvL2VuZCBNYXBMYXllcnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQlBSTWFwO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4vdXRpbGl0eS5qcycpO1xyXG5cclxudmFyIHRhYmxlRGVtb2cgPSB7XHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGNvdW50eURhdGEpIHtcclxuICAgIFx0dmFyIHBvcERhdGEgPSB7XHJcblx0XHRcdGNvdW50eV9uYW1lOiBjb3VudHlEYXRhLmNvdW50eV9uYW1lLFxyXG5cdFx0XHRzdGF0ZV9hYmJyOiBjb3VudHlEYXRhLnN0YXRlX2FiYnIsXHJcblx0XHRcdHBvcDIwMTU6IGNvdW50eURhdGEucG9wMjAxNSxcclxuXHRcdFx0cG9wZGVuc2l0eTogY291bnR5RGF0YS5wb3BkZW5zaXR5LFxyXG5cdFx0XHRwZXJjYXBpbmM6IGNvdW50eURhdGEucGVyY2FwaW5jLFxyXG5cdFx0XHR1bnNwb3AyNV8zOiBjb3VudHlEYXRhLnVuc3BvcDI1XzMsXHJcblx0XHRcdHBlcl91cmJhbm5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3VyYmFubm9maXhlZCxcclxuXHRcdFx0cGVyX3J1cmFsbm9maXhlZDogY291bnR5RGF0YS5wZXJfcnVyYWxub2ZpeGVkXHJcblx0XHR9O1xyXG5cclxuXHRcdGZvciAodmFyIHByb3BOYW1lIGluIHBvcERhdGEpIHtcclxuXHRcdFx0aWYgKHV0aWxpdHkuaXNOdWxsKHBvcERhdGFbcHJvcE5hbWVdKSkge1xyXG5cdFx0XHRcdHBvcERhdGFbcHJvcE5hbWVdID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcbiAgICAgICAgLy9wb3B1bGF0ZSBDZW5zdXMgQmxvY2sgdGFibGVcclxuICAgICAgICAkKCdbZGF0YS1jb3VudHldJykudGV4dChwb3BEYXRhLmNvdW50eV9uYW1lKTtcclxuICAgICAgICAkKCdbZGF0YS1zdGF0ZV0nKS50ZXh0KHBvcERhdGEuc3RhdGVfYWJicik7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucG9wMjAxNSkpO1xyXG4gICAgICAgICQoJ1tkYXRhLXBvcERlbnNpdHldJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucG9wZGVuc2l0eSkpO1xyXG4gICAgICAgICQoJ1tkYXRhLWluY29tZUNhcGl0YV0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wZXJjYXBpbmMpKTtcclxuICAgICAgICAkKCdbZGF0YS10b3RhbFBvcE5vQWNjZXNzXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnVuc3BvcDI1XzMpKTtcclxuICAgICAgICAkKCdbZGF0YS11cmJhblBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0UGVyY2VudChwb3BEYXRhLnBlcl91cmJhbm5vZml4ZWQpKTtcclxuICAgICAgICAkKCdbZGF0YS1ydXJhbFBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0UGVyY2VudChwb3BEYXRhLnBlcl9ydXJhbG5vZml4ZWQpKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGFibGVEZW1vZztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHRhYmxlUHJvdmlkZXJzID0ge1xyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oYmxvY2tGaXBzKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyc1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9wcm92aWRlcnMmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9YmxvY2tfZmlwcz0lMjcnICsgYmxvY2tGaXBzICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1wcm92aWRlcnMnKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAnYWpheCc6IHtcclxuICAgICAgICAgICAgICAgICd1cmwnOiBwcm92aWRlcnNVUkwsXHJcbiAgICAgICAgICAgICAgICAnZGF0YVNyYyc6IHRhYmxlUHJvdmlkZXJzLmNyZWF0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAncHJvdmlkZXJOYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICd0ZWNoJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZERvd24nIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3NwZWVkVXAnIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnb3JkZXInOiBbXHJcbiAgICAgICAgICAgICAgICBbMCwgJ2FzYyddXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdwYWdpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3NlYXJjaGluZyc6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyRGF0YSA9IGRhdGEuZmVhdHVyZXM7XHJcbiAgICAgICAgdmFyIHRlbXBEYXRhID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm92aWRlckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGVtcERhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIFx0J3Byb3ZpZGVyTmFtZSc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRiYW5hbWUsXHJcbiAgICAgICAgICAgIFx0J3RlY2gnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy50ZWNobm9sb2d5LFxyXG4gICAgICAgICAgICBcdCdzcGVlZERvd24nOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kb3dubG9hZF9zcGVlZCxcclxuICAgICAgICAgICAgXHQnc3BlZWRVcCc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLnVwbG9hZF9zcGVlZFxyXG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wRGF0YTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGFibGVQcm92aWRlcnM7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHtcclxuICAgIGlzTnVsbChmaWVsZE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gZmllbGROYW1lID09PSBudWxsO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdENvbW1hKG51bSkge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IG51bS50b1N0cmluZygpLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgcGFydHNbMF0gPSBwYXJ0c1swXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XHJcbiAgICB9LFxyXG4gICAgZm9ybWF0UGVyY2VudChudW0pIHtcclxuICAgICAgICByZXR1cm4gKG51bSAqIDEwMCkudG9GaXhlZCgyKSArICclJztcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXRpbGl0eTtcclxuIl19
