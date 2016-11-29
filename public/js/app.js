(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');
    
    if ($('#map').length > 0) {
        BPRMap.init();
        MapSearch.init();
    } 

}());

},{"./modules/map-search.js":10,"./modules/map.js":11}],2:[function(require,module,exports){
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
                    responsive: false,
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

var chartFixed = {
    init: function(county_fips) {
        chartFixed.data = {
            labels: ['All', 'Urban', 'Rural', 'Tribal'],
            datasets: [{
                label: 'Fixed',
                data: [],
                backgroundColor: '#FFE773'
            }, {
                label: 'No Fixed',
                data: [],
                backgroundColor: '#6CBCD5'
            }]
        };

        //show County Fixed chart if it exists on the page
        if ($('#chartFixed').length === 0) {
            return;
        }

        //if county FIPS is the same don't regenerate chart
        if (county_fips === chartFixed.FIPS) {
            return;
        } else {
            chartFixed.FIPS = county_fips;
        }

        chartFixed.getCountyData(county_fips);
    },
    getCountyData: function() {
        var allCntyURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: allCntyURL,
            success: function(data) {
                chartFixed.update(data);
                chartFixed.getURData();
                
            }
        });
    },
    getURData: function() {
        var urURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_county_ur_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: urURL,
            success: function(data) {
                chartFixed.processURData(data);
                chartFixed.getTribalData();
             }
        });
    },
    getTribalData: function() {
        var tribalURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_county_tribal_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: tribalURL,
            success: function(data) { 
                chartFixed.update(data);
                chartFixed.display();
             }
        });
    },
    processURData: function(data) {
        var i = 0;
        var dataLen = data.features.length;

        var urbanData = {};
        var ruralData = {};

        urbanData.features = [];       
        ruralData.features = [];

        for (i; i < dataLen; i++) {
            switch (data.features[i].properties.urban_rural) {
                case 'U':
                    urbanData.features.push(data.features[i]);
                    break;
                case 'R':
                    ruralData.features.push(data.features[i]);
                    break;
            }
        }

        chartFixed.update(urbanData);
        chartFixed.update(ruralData);
        
    },    
    update: function(data) {
        var i = 0;
        var fixedData = chartFixed.data.datasets[0].data;
        var noFixedData = chartFixed.data.datasets[1].data;

        if (data.features.length === 0) {
            fixedData.push(0);
            noFixedData.push(0);

            return;
        }

        for (i = 0; i < data.features.length; i++) {
            switch (data.features[i].properties.has_fixed) {
                case 0:
                    noFixedData.push(data.features[i].properties.pop_pct.toFixed(2));

                    if (data.features[i].properties.pop_pct === 100) {
                        fixedData.push(0);
                    }

                    break;
                case 1:
                    fixedData.push(data.features[i].properties.pop_pct.toFixed(2));

                    if (data.features[i].properties.pop_pct === 100) {
                        noFixedData.push(0);
                    }

                    break;
            }
        }        
    },
    display: function() {
        var ctxFixed;

        //replace chart canvas if it already exists
        $('#chartFixed').replaceWith('<canvas id="chartFixed" width="300" height="220"></canvas>');
        $('.chartjs-hidden-iframe').remove();

        //create new chart
        ctxFixed = $('#chartFixed');
        chartFixed.chart = new Chart(ctxFixed, {
            type: 'bar',
            data: chartFixed.data,
            options: {
                responsive: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Area'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Population'
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel + '%';
                        }
                    }
                }
            }
        });
    }
};

module.exports = chartFixed;

},{}],4:[function(require,module,exports){
'use strict';

var chartNWFixed = {
    data: {
        labels: ['All', 'Urban', 'Rural'],
        datasets: [{
            label: 'Fixed',
            data: [],
            backgroundColor: '#FFE773'
        }, {
            label: 'No Fixed',
            data: [],
            backgroundColor: '#6CBCD5'
        }]
    },
    init: function() {
        //show Nationwide chart if it exists on the page
        if ($('#chartNWFixed').length === 0) {
            return;
        }

        chartNWFixed.getNWData();
    },
    getNWData: function() {
        var nwURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_nw_fnf&maxFeatures=100&outputFormat=application/json';

        $.ajax({
            type: 'GET',
            url: nwURL,
            success: function(data) { 
                chartNWFixed.update(data);
                chartNWFixed.getUrbanData();
            }
        });
    },
    getUrbanData: function() {
        var urbanURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_nw_ur_fnf&maxFeatures=100&outputFormat=application/json';

        $.ajax({
            type: 'GET',
            url: urbanURL,
            success: function(data) {
                chartNWFixed.update(data);
                chartNWFixed.display();
            }
        });
    },
    update: function(data) {
        var fixedData = chartNWFixed.data.datasets[0].data;
        var noFixedData = chartNWFixed.data.datasets[1].data;

        if (data.features.length === 0) {
            fixedData.push(0);
            noFixedData.push(0);

            return;
        }

        for (var i = 0; i < data.features.length; i++) { 
            switch (data.features[i].properties.has_fixed) {
                case 0:
                    noFixedData.push(data.features[i].properties.pop_pct.toFixed(2));

                    if (data.features[i].properties.type_pop_pct === 100) {
                        fixedData.push(0);
                    }

                    break;
                case 1:                
                    fixedData.push(data.features[i].properties.pop_pct.toFixed(2));

                    if (data.features[i].properties.type_pop_pct === 100) {
                        noFixedData.push(0);
                    }

                    break;
            }
        }

    },
    display: function() {
        var ctxNWFixed = $('#chartNWFixed');

        //create new chart
        chartNWFixed.chart = new Chart(ctxNWFixed, {
            type: 'bar',
            data: chartNWFixed.data,
            options: {
                responsive: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Area'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Population'
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel + '%';
                        }
                    }
                }
            }
        });
    }
};

module.exports = chartNWFixed;

},{}],5:[function(require,module,exports){
'use strict';

/*datasets: [
        {
            label: "Blue",
            backgroundColor: "blue",
            data: [3,7,4]
        },
        {
            label: "Red",
            backgroundColor: "red",
            data: [4,3,5]
        },
        {
            label: "Green",
            backgroundColor: "green",
            data: [7,2,6]
        }
    ]*/

var chartTech = {
    init: function(county_fips) {
        chartTech.data = {
            labels: ['0', '1', '2', '3'],
            datasets: [{
                label: 'All',
                backgroundColor: "blue",
                data: [3, 7, 4],
                perData: [10, 15, 20]
            }, {
                label: 'Urban',
                backgroundColor: "red",
                data: [4, 3, 5],
                perData: [23, 33, 44]
            }, {
                label: 'Rural',
                backgroundColor: "green",
                data: [7, 2, 6],
                perData: [11, 12, 32]
            }, {
                label: 'Tribal',
                backgroundColor: "brown",
                data: [5, 12, 16],
                perData: [21, 15, 17]
            }]
        };

        //only show chart if it exists on the page
        if ($('#chartTech').length === 0) {
            return;
        }

        //if county FIPS is the same don't regenerate chart
        if (county_fips === chartTech.FIPS) {
            return;
        } else {
            chartTech.FIPS = county_fips;
        }

        chartTech.getSpeed10Data();
    },
    getSpeed10Data: function() {
        var speed10URL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_speed10_cty_all&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartTech.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: speed10URL,
            success: function(data) {
                // chartTech.update(data);
                chartTech.display();
            }
        });
    },
    getUrbanData: function() {
        var urbanURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_urban_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartTech.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: urbanURL,
            success: function(data) {
                chartTech.update(data);
                chartTech.getRuralData();
            }
        });
    },
    getRuralData: function() {
        var ruralURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_rural_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartTech.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: ruralURL,
            success: function(data) {
                chartTech.update(data);
                chartTech.display();
            }
        });
    },
    update: function(data) {
        var numProv = chartTech.data.datasets;
        var percPop = chartTech.data.datasets[1].data;

        /*if (data.features.length === 0) {
            numProv.push(0);
            percPop.push(0);

            return;
        }*/

        for (var i = 0; i < data.features.length; i++) {

            numProv[i].data.push(data.features[i].properties.num_prov);

            /*if (data.features[i].properties.type_pop_pct === 100) {
                percPop.push(0);
            }

            percPop.push(data.features[i].properties.type_pop_pct.toFixed(2));

            if (data.features[i].properties.type_pop_pct === 100) {
                numProv.push(0);
            }*/

        }

    },
    display: function() {
        var ctxTech;

        //replace chart canvas if it already exists
        $('#chartTech').replaceWith('<canvas id="chartTech" width="300" height="220"></canvas>');
        $('.chartjs-hidden-iframe').remove();
console.log(chartTech.data);
        //create new chart
        ctxTech = $('#chartTech');
        chartTech.chart = new Chart(ctxTech, {
            type: 'bar',
            data: chartTech.data,
            options: {
                responsive: false,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: '# of Providers'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Population'
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        afterBody: function(tooltipItems, data) {
                            return ['Population: ' + data.datasets[tooltipItems[0].datasetIndex].perData[tooltipItems[0].index] + '%'];
                        }
                    }
                }
            }
        });
    }
};

module.exports = chartTech;

},{}],6:[function(require,module,exports){
'use strict';

var layersDeployment = {};

//Deployment map layers
layersDeployment['Fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_county_layer_fixed',
    styles: 'bpr_layer_fixed_1',
    color: '#FFE773',
    zIndex: 11
};

layersDeployment['No fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_county_layer_nonfixed',
    styles: 'bpr_layer_fixed_0',
    color: '#6CBCD5',
    zIndex: 12
};

module.exports = layersDeployment;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

var layersTech = {};

//Providers map layers
layersTech['FTTP'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_tech_fiber',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
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

},{}],10:[function(require,module,exports){
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
},{"./map.js":11}],11:[function(require,module,exports){
'use strict';

var tableProviders = require('./table-providers.js');
var tableDemog = require('./table-demographics.js');
var chartDemog = require('./chart-demographics.js');
var chartFixed = require('./chart-fixed.js');
var chartNWFixed = require('./chart-fixedNationwide.js');
var chartTech = require('./chart-tech.js');

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

        chartNWFixed.init();

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
                $('#tabInstructs, #nwFixed').addClass('hide');
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
        chartFixed.init(countyData.county_fips);
        chartTech.init(countyData.county_fips);

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

},{"./chart-demographics.js":2,"./chart-fixed.js":3,"./chart-fixedNationwide.js":4,"./chart-tech.js":5,"./layers-deployment.js":6,"./layers-providers.js":7,"./layers-speed.js":8,"./layers-tech.js":9,"./table-demographics.js":12,"./table-providers.js":13}],12:[function(require,module,exports){
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

},{"./utility.js":14}],13:[function(require,module,exports){
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
            'searching': false,
            'scrollY': '280px',
            'scrollCollapse': true,
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

},{}],14:[function(require,module,exports){
'use strict';

var utility = {
    isNull: function(fieldName) {
        return fieldName === null;
    },
    formatComma: function(num) {
        var parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    },
    formatPercent: function(num) {
        return (num * 100).toFixed(2) + '%';
    }
};

module.exports = utility;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtZml4ZWROYXRpb253aWRlLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtdGVjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLXNlYXJjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgQlBSTWFwID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC5qcycpO1xyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAtc2VhcmNoLmpzJyk7XHJcbiAgICBcclxuICAgIGlmICgkKCcjbWFwJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIEJQUk1hcC5pbml0KCk7XHJcbiAgICAgICAgTWFwU2VhcmNoLmluaXQoKTtcclxuICAgIH0gXHJcblxyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnRPcHRzID0ge1xyXG4gICAgbGFiZWxzOiBbXHJcbiAgICAgICAgJ1VyYmFuJyxcclxuICAgICAgICAnUnVyYWwnXHJcbiAgICBdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICcjM0Q1OUQ3JyxcclxuICAgICAgICAgICAgJyM3MURBRDYnXHJcbiAgICAgICAgXVxyXG4gICAgfV1cclxufTtcclxuXHJcbnZhciBjaGFydERlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRvbnV0O1xyXG4gICAgICAgIHZhciBjdHhEZW1vZyA9ICQoJyNjaGFydERlbW9nJyk7XHJcbiAgICAgICAgdmFyIGNoYXJ0VmFscyA9IFtdO1xyXG5cclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl91cmJhbm5vZml4ZWQpO1xyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKGRhdGEucGVyX3J1cmFsbm9maXhlZCk7XHJcblxyXG4gICAgICAgIGNoYXJ0T3B0cy5kYXRhc2V0c1swXS5kYXRhID0gY2hhcnRWYWxzO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0RGVtb2cnKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBkb251dCA9IG5ldyBDaGFydChjdHhEZW1vZywge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0T3B0cyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0RGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydEZpeGVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydEZpeGVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydBbGwnLCAnVXJiYW4nLCAnUnVyYWwnLCAnVHJpYmFsJ10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdGaXhlZCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTm8gRml4ZWQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNkNCQ0Q1J1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc2hvdyBDb3VudHkgRml4ZWQgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydEZpeGVkJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRGaXhlZC5GSVBTKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLkZJUFMgPSBjb3VudHlfZmlwcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJ0Rml4ZWQuZ2V0Q291bnR5RGF0YShjb3VudHlfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q291bnR5RGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFsbENudHlVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5X2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRGaXhlZC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGFsbENudHlVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRGaXhlZC5nZXRVUkRhdGEoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VVJEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9jb3VudHlfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydEZpeGVkLkZJUFMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQucHJvY2Vzc1VSRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZ2V0VHJpYmFsRGF0YSgpO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFRyaWJhbERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmliYWxVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9jb3VudHlfdHJpYmFsX2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRGaXhlZC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRyaWJhbFVSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyBcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRGaXhlZC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc1VSRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgZGF0YUxlbiA9IGRhdGEuZmVhdHVyZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdXJiYW5EYXRhID0ge307XHJcbiAgICAgICAgdmFyIHJ1cmFsRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMgPSBbXTsgICAgICAgXHJcbiAgICAgICAgcnVyYWxEYXRhLmZlYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgIGZvciAoaTsgaSA8IGRhdGFMZW47IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy51cmJhbl9ydXJhbCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnVSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJiYW5EYXRhLmZlYXR1cmVzLnB1c2goZGF0YS5mZWF0dXJlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUodXJiYW5EYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG4gICAgICAgIFxyXG4gICAgfSwgICAgXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1sxXS5kYXRhO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5oYXNfZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH0sXHJcbiAgICBkaXNwbGF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY3R4Rml4ZWQ7XHJcblxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRGaXhlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRGaXhlZFwiIHdpZHRoPVwiMzAwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjdHhGaXhlZCA9ICQoJyNjaGFydEZpeGVkJyk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5jaGFydCA9IG5ldyBDaGFydChjdHhGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRGaXhlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHhBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdBcmVhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ1BvcHVsYXRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtcy5kYXRhc2V0SW5kZXhdLmxhYmVsICsgJzogJyArIHRvb2x0aXBJdGVtcy55TGFiZWwgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0TldGaXhlZCA9IHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBsYWJlbHM6IFsnQWxsJywgJ1VyYmFuJywgJ1J1cmFsJ10sXHJcbiAgICAgICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgICAgIGxhYmVsOiAnRml4ZWQnLFxyXG4gICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZGRTc3MydcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxhYmVsOiAnTm8gRml4ZWQnLFxyXG4gICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzZDQkNENSdcclxuICAgICAgICB9XVxyXG4gICAgfSxcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vc2hvdyBOYXRpb253aWRlIGNoYXJ0IGlmIGl0IGV4aXN0cyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIGlmICgkKCcjY2hhcnROV0ZpeGVkJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJ0TldGaXhlZC5nZXROV0RhdGEoKTtcclxuICAgIH0sXHJcbiAgICBnZXROV0RhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBud1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9ud19mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogbndVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgXHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLmdldFVyYmFuRGF0YSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VXJiYW5EYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJiYW5VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9ud191cl9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJiYW5VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQuZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGZpeGVkRGF0YSA9IGNoYXJ0TldGaXhlZC5kYXRhLmRhdGFzZXRzWzBdLmRhdGE7XHJcbiAgICAgICAgdmFyIG5vRml4ZWREYXRhID0gY2hhcnROV0ZpeGVkLmRhdGEuZGF0YXNldHNbMV0uZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7IFxyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5oYXNfZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnR5cGVfcG9wX3BjdCA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnR5cGVfcG9wX3BjdCA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN0eE5XRml4ZWQgPSAkKCcjY2hhcnROV0ZpeGVkJyk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBjaGFydFxyXG4gICAgICAgIGNoYXJ0TldGaXhlZC5jaGFydCA9IG5ldyBDaGFydChjdHhOV0ZpeGVkLCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICBkYXRhOiBjaGFydE5XRml4ZWQuZGF0YSxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnQXJlYSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIHlBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdQb3B1bGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24odG9vbHRpcEl0ZW1zLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbXMuZGF0YXNldEluZGV4XS5sYWJlbCArICc6ICcgKyB0b29sdGlwSXRlbXMueUxhYmVsICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0TldGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypkYXRhc2V0czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiQmx1ZVwiLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiYmx1ZVwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbMyw3LDRdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlZFwiLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IFs0LDMsNV1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiR3JlZW5cIixcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IFs3LDIsNl1cclxuICAgICAgICB9XHJcbiAgICBdKi9cclxuXHJcbnZhciBjaGFydFRlY2ggPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihjb3VudHlfZmlwcykge1xyXG4gICAgICAgIGNoYXJ0VGVjaC5kYXRhID0ge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFsnMCcsICcxJywgJzInLCAnMyddLFxyXG4gICAgICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQWxsJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJibHVlXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbMywgNywgNF0sXHJcbiAgICAgICAgICAgICAgICBwZXJEYXRhOiBbMTAsIDE1LCAyMF1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdVcmJhbicsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbNCwgMywgNV0sXHJcbiAgICAgICAgICAgICAgICBwZXJEYXRhOiBbMjMsIDMzLCA0NF1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdSdXJhbCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgIGRhdGE6IFs3LCAyLCA2XSxcclxuICAgICAgICAgICAgICAgIHBlckRhdGE6IFsxMSwgMTIsIDMyXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ1RyaWJhbCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiYnJvd25cIixcclxuICAgICAgICAgICAgICAgIGRhdGE6IFs1LCAxMiwgMTZdLFxyXG4gICAgICAgICAgICAgICAgcGVyRGF0YTogWzIxLCAxNSwgMTddXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9vbmx5IHNob3cgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydFRlY2gnKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9pZiBjb3VudHkgRklQUyBpcyB0aGUgc2FtZSBkb24ndCByZWdlbmVyYXRlIGNoYXJ0XHJcbiAgICAgICAgaWYgKGNvdW50eV9maXBzID09PSBjaGFydFRlY2guRklQUykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hhcnRUZWNoLkZJUFMgPSBjb3VudHlfZmlwcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJ0VGVjaC5nZXRTcGVlZDEwRGF0YSgpO1xyXG4gICAgfSxcclxuICAgIGdldFNwZWVkMTBEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BlZWQxMFVSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9zcGVlZDEwX2N0eV9hbGwmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0VGVjaC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHNwZWVkMTBVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoYXJ0VGVjaC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydFRlY2guZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VXJiYW5EYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJiYW5VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5X3VyYmFuX2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRUZWNoLkZJUFMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJiYW5VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0VGVjaC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydFRlY2guZ2V0UnVyYWxEYXRhKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRSdXJhbERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBydXJhbFVSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9jb3VudHlfcnVyYWxfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydFRlY2guRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBydXJhbFVSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY2hhcnRUZWNoLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0VGVjaC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgbnVtUHJvdiA9IGNoYXJ0VGVjaC5kYXRhLmRhdGFzZXRzO1xyXG4gICAgICAgIHZhciBwZXJjUG9wID0gY2hhcnRUZWNoLmRhdGEuZGF0YXNldHNbMV0uZGF0YTtcclxuXHJcbiAgICAgICAgLyppZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbnVtUHJvdi5wdXNoKDApO1xyXG4gICAgICAgICAgICBwZXJjUG9wLnB1c2goMCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSovXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbnVtUHJvdltpXS5kYXRhLnB1c2goZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLm51bV9wcm92KTtcclxuXHJcbiAgICAgICAgICAgIC8qaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgcGVyY1BvcC5wdXNoKDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwZXJjUG9wLnB1c2goZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnR5cGVfcG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMudHlwZV9wb3BfcGN0ID09PSAxMDApIHtcclxuICAgICAgICAgICAgICAgIG51bVByb3YucHVzaCgwKTtcclxuICAgICAgICAgICAgfSovXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN0eFRlY2g7XHJcblxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRUZWNoJykucmVwbGFjZVdpdGgoJzxjYW52YXMgaWQ9XCJjaGFydFRlY2hcIiB3aWR0aD1cIjMwMFwiIGhlaWdodD1cIjIyMFwiPjwvY2FudmFzPicpO1xyXG4gICAgICAgICQoJy5jaGFydGpzLWhpZGRlbi1pZnJhbWUnKS5yZW1vdmUoKTtcclxuY29uc29sZS5sb2coY2hhcnRUZWNoLmRhdGEpO1xyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBjaGFydFxyXG4gICAgICAgIGN0eFRlY2ggPSAkKCcjY2hhcnRUZWNoJyk7XHJcbiAgICAgICAgY2hhcnRUZWNoLmNoYXJ0ID0gbmV3IENoYXJ0KGN0eFRlY2gsIHtcclxuICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgIGRhdGE6IGNoYXJ0VGVjaC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHhBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICcjIG9mIFByb3ZpZGVycydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIHlBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdQb3B1bGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlckJvZHk6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtcywgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnUG9wdWxhdGlvbjogJyArIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1zWzBdLmRhdGFzZXRJbmRleF0ucGVyRGF0YVt0b29sdGlwSXRlbXNbMF0uaW5kZXhdICsgJyUnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydFRlY2g7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNEZXBsb3ltZW50ID0ge307XHJcblxyXG4vL0RlcGxveW1lbnQgbWFwIGxheWVyc1xyXG5sYXllcnNEZXBsb3ltZW50WydGaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMScsXHJcbiAgICBjb2xvcjogJyNGRkU3NzMnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzRGVwbG95bWVudFsnTm8gZml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfbm9uZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnLFxyXG4gICAgY29sb3I6ICcjNkNCQ0Q1JyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzRGVwbG95bWVudDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1Byb3ZpZGVycyA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNQcm92aWRlcnNbJ1plcm8gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIGNvbG9yOiAnI2ZmZmZjYycsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ09uZSBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBjb2xvcjogJyNmZGNjOGEnLFxyXG4gICAgekluZGV4OiAxMlxyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUd28gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJyxcclxuICAgIGNvbG9yOiAnI2ZjOGQ1OScsXHJcbiAgICB6SW5kZXg6IDEzXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1RocmVlIG9yIG1vcmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJyxcclxuICAgIGNvbG9yOiAnI2Q3MzAxZicsXHJcbiAgICB6SW5kZXg6IDE0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1Byb3ZpZGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1NwZWVkID0ge307XHJcblxyXG4vL1NwZWVkIG1hcCBsYXllcnNcclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIHNlcnZpY2VzIG9mIGF0IGxlYXN0IDIwMCBrYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDIwMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDIwMCcsXHJcbiAgICBjb2xvcjogJyNjN2U5YjQnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMCBNYnBzLzEgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJyxcclxuICAgIGNvbG9yOiAnIzdmY2RiYicsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDI1IE1icHMvMyBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnLFxyXG4gICAgY29sb3I6ICcjYmRkN2U3JyxcclxuICAgIHpJbmRleDogMTNcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgNTAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQ1MCcsXHJcbiAgICBjb2xvcjogJyMzMTgyYmQnLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMDAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIGNvbG9yOiAnIzA4MzA2YicsXHJcbiAgICB6SW5kZXg6IDE1XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1NwZWVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzVGVjaCA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNUZWNoWydGVFRQJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2ZpYmVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0NhYmxlIG1vZGVtJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2NhYmxlJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0RTTCAoaW5jLiBGVFROKSwgb3RoZXIgY29wcGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2Fkc2wnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRml4ZWQgd2lyZWxlc3MnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfZncnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnT3RoZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfb3RoZXInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxNVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNUZWNoO1xyXG4iLCIgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBCUFJNYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xyXG5cclxuICAgIHZhciBNYXBTZWFyY2ggPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5sb2NDaGFuZ2UpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCk7XHJcbiAgICAgICAgICAgICQoJyNidG4tZ2VvTG9jYXRpb24nKS5vbignY2xpY2snLCBNYXBTZWFyY2guZ2VvTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAkKFwiI2J0bi1uYXRpb25Mb2NhdGlvblwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIEJQUk1hcC5tYXAuc2V0VmlldyhbNTAsIC0xMDVdLCAzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2lucHV0LXNlYXJjaC1zd2l0Y2hcIikub24oJ2NsaWNrJywgJ2EnLCBNYXBTZWFyY2guc2VhcmNoX3N3aXRjaCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJylcclxuICAgICAgICAgICAgICAgIC5hdXRvY29tcGxldGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24ocmVxdWVzdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gcmVxdWVzdC50ZXJtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCUFJNYXAuZ2VvY29kZXIucXVlcnkobG9jYXRpb24sIHByb2Nlc3NBZGRyZXNzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NBZGRyZXNzKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBkYXRhLnJlc3VsdHMuZmVhdHVyZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc2VzLnB1c2goZltpXS5wbGFjZV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGFkZHJlc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7IH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLWFsbCcpLmFkZENsYXNzKCd1aS1jb3JuZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci10b3AnKS5hZGRDbGFzcygndWktY29ybmVyLWFsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbGF0aXR1ZGUsICNsb25naXR1ZGUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvY0NoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSAkKCcjbG9jYXRpb24tc2VhcmNoJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBCUFJNYXAuZ2VvY29kZXIucXVlcnkobG9jLCBjb2RlTWFwKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvZGVNYXAoZXJyLCBkYXRhKSB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0cy5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBhZGRyZXNzIHByb3ZpZGVkIGNvdWxkIG5vdCBiZSBmb3VuZC4gUGxlYXNlIGVudGVyIGEgbmV3IGFkZHJlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBkYXRhLmxhdGxuZ1swXTtcclxuICAgICAgICAgICAgICAgIEJQUk1hcC5sb24gPSBkYXRhLmxhdGxuZ1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX2RlY2ltYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBCUFJNYXAubGF0ID0gJCgnI2xhdGl0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG4gICAgICAgICAgICBCUFJNYXAubG9uID0gJCgnI2xvbmdpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChCUFJNYXAubGF0ID09PSAnJyB8fCBCUFJNYXAubG9uID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciBsYXQvbG9uJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhCUFJNYXAubGF0KSA+IDkwIHx8IE1hdGguYWJzKEJQUk1hcC5sb24pID4gMTgwKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnTGF0L0xvbiB2YWx1ZXMgb3V0IG9mIHJhbmdlJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdlb0xvY2F0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbGF0ID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbG9uID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2FjYyA9IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmxhdCA9IE1hdGgucm91bmQoZ2VvX2xhdCAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5sb24gPSBNYXRoLnJvdW5kKGdlb19sb24gKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfc3dpdGNoOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2ggPT09ICdsb2MnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0FkZHJlc3MnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT09ICdsYXRsb24tZGVjaW1hbCcpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQ29vcmRpbmF0ZXMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXBTZWFyY2g7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHRhYmxlUHJvdmlkZXJzID0gcmVxdWlyZSgnLi90YWJsZS1wcm92aWRlcnMuanMnKTtcclxudmFyIHRhYmxlRGVtb2cgPSByZXF1aXJlKCcuL3RhYmxlLWRlbW9ncmFwaGljcy5qcycpO1xyXG52YXIgY2hhcnREZW1vZyA9IHJlcXVpcmUoJy4vY2hhcnQtZGVtb2dyYXBoaWNzLmpzJyk7XHJcbnZhciBjaGFydEZpeGVkID0gcmVxdWlyZSgnLi9jaGFydC1maXhlZC5qcycpO1xyXG52YXIgY2hhcnROV0ZpeGVkID0gcmVxdWlyZSgnLi9jaGFydC1maXhlZE5hdGlvbndpZGUuanMnKTtcclxudmFyIGNoYXJ0VGVjaCA9IHJlcXVpcmUoJy4vY2hhcnQtdGVjaC5qcycpO1xyXG5cclxudmFyIGxheWVycyA9IHtcclxuICAgIGRlcGxveW1lbnQ6IHJlcXVpcmUoJy4vbGF5ZXJzLWRlcGxveW1lbnQuanMnKSxcclxuICAgIHNwZWVkOiByZXF1aXJlKCcuL2xheWVycy1zcGVlZC5qcycpLFxyXG4gICAgcHJvdmlkZXJzOiByZXF1aXJlKCcuL2xheWVycy1wcm92aWRlcnMuanMnKSxcclxuICAgIHRlY2hub2xvZ3k6IHJlcXVpcmUoJy4vbGF5ZXJzLXRlY2guanMnKSxcclxuICAgIHRyaWJhbDoge1xyXG4gICAgICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgbGF5ZXJzOiAnYnByX3RyaWJhbCcsXHJcbiAgICAgICAgc3R5bGVzOiAnYnByX3RyaWJhbCcsXHJcbiAgICAgICAgekluZGV4OiAxOVxyXG4gICAgfSxcclxuICAgIHVyYmFuOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdmY2M6YnByX2NvdW50eV9sYXllcl91cmJhbl9vbmx5JyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfbGF5ZXJfdXJiYW4nLFxyXG4gICAgICAgIHpJbmRleDogMjBcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBsb2NhdGlvbk1hcmtlcjtcclxudmFyIGNsaWNrZWRDb3VudHlMYXllcjtcclxudmFyIGNsaWNrZWRDb3VudHlTdHlsZSA9IHsgY29sb3I6ICcjMDBmJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjb3VudHlMYXllckRhdGEgPSB7ICdmZWF0dXJlcyc6IFtdIH07XHJcblxyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXI7XHJcbnZhciBjbGlja2VkQmxvY2tTdHlsZSA9IHsgY29sb3I6ICcjMDAwJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjbGlja2VkQmxvY2tMYXllckRhdGE7XHJcblxyXG52YXIgQlBSTWFwID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIEJQUk1hcC5jcmVhdGVNYXAoKTsgICAgICAgIFxyXG5cclxuICAgICAgICBCUFJNYXAubWFwLm9uKCdjbGljaycsIEJQUk1hcC51cGRhdGUpOyAgICAgICAgXHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBtYXAgY29udGFpbmVyIHdpZHRoXHJcbiAgICAgICAgJCgnLmNvbnRyb2wtZnVsbCcpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAkKCdoZWFkZXIgLmNvbnRhaW5lciwgaGVhZGVyIC5jb250YWluZXItZmx1aWQsIG1haW4nKVxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdjb250YWluZXIgY29udGFpbmVyLWZsdWlkJylcclxuICAgICAgICAgICAgICAgIC5vbmUoJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVNYXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdmFyIG1hcDtcclxuICAgICAgICB2YXIgaGFzaDtcclxuICAgICAgICAvLyB2YXIgbWFwRGF0YSA9IE1hcC5kYXRhO1xyXG4gICAgICAgIHZhciBpbml0aWFsem9vbSA9IDQ7XHJcbiAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICB2YXIgbWluem9vbSA9IDM7XHJcbiAgICAgICAgdmFyIGNlbnRlcl9sYXQgPSAzOC44MjtcclxuICAgICAgICB2YXIgY2VudGVyX2xvbiA9IC05NC45NjtcclxuICAgICAgICB2YXIgYmFzZUxheWVyID0ge307XHJcbiAgICAgICAgdmFyIGxheWVyQ29udHJvbDtcclxuICAgICAgICB2YXIgbGF5ZXJQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJylbMV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyID0ge307XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9VUkwgPSAnL2d3Yy9zZXJ2aWNlL3dtcz90aWxlZD10cnVlJztcclxuICAgICAgICBCUFJNYXAuZ2VvX3NwYWNlID0gJ2ZjYyc7XHJcblxyXG4gICAgICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pWTI5dGNIVjBaV05vSWl3aVlTSTZJbk15YmxNeWEzY2lmUS5QOHlwcGVzSGtpNXFNeXhUYzJDTkxnJztcclxuICAgICAgICBCUFJNYXAubWFwID0gTC5tYXBib3gubWFwKCdtYXAtY29udGFpbmVyJywgJ2ZjYy5rNzRlZDVnZScsIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1heFpvb206IG1heHpvb20sXHJcbiAgICAgICAgICAgICAgICBtaW5ab29tOiBtaW56b29tLFxyXG4gICAgICAgICAgICAgICAgem9vbUNvbnRyb2w6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnNldFZpZXcoW2NlbnRlcl9sYXQsIGNlbnRlcl9sb25dLCBpbml0aWFsem9vbSk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAuYXR0cmlidXRpb25Db250cm9sLmFkZEF0dHJpYnV0aW9uKCc8YSBocmVmPVwiaHR0cDovL2ZjYy5nb3ZcIj5GQ0M8L2E+Jyk7XHJcblxyXG4gICAgICAgIC8vYmFzZSBsYXllcnNcclxuICAgICAgICBiYXNlTGF5ZXIuU3RyZWV0ID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZWQ1Z2UnKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICBiYXNlTGF5ZXIuU2F0ZWxsaXRlID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0ZDduMGcnKTtcclxuICAgICAgICBiYXNlTGF5ZXIuVGVycmFpbiA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGNtM29sJyk7XHJcblxyXG4gICAgICAgIC8vZ2V0IHRpbGUgbGF5ZXJzIGJhc2VkIG9uIGxvY2F0aW9uIHBhdGhuYW1lXHJcbiAgICAgICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzW2xheWVyUGF0aF0pIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcExheWVyW2xheWVyXSA9IEwudGlsZUxheWVyLndtcyhCUFJNYXAuZ2VvVVJMLCBsYXllcnNbbGF5ZXJQYXRoXVtsYXllcl0pLnNldFpJbmRleChsYXllcnNbbGF5ZXJQYXRoXVtsYXllcl0uekluZGV4KS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIFRyaWJhbCBhbmQgVXJiYW4gbGF5ZXJzXHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyWydUcmliYWwnXSA9IEwudGlsZUxheWVyLndtcyhCUFJNYXAuZ2VvVVJMLCBsYXllcnMudHJpYmFsKS5zZXRaSW5kZXgobGF5ZXJzLnRyaWJhbC56SW5kZXgpO1xyXG4gICAgICAgIEJQUk1hcC5tYXBMYXllclsnVXJiYW4nXSA9IEwudGlsZUxheWVyLndtcyhCUFJNYXAuZ2VvVVJMLCBsYXllcnMudXJiYW4pLnNldFpJbmRleChsYXllcnMudXJiYW4uekluZGV4KTtcclxuXHJcbiAgICAgICAgLy9sYXllciBjb250cm9sXHJcbiAgICAgICAgbGF5ZXJDb250cm9sID0gTC5jb250cm9sLmxheWVycyhcclxuICAgICAgICAgICAgYmFzZUxheWVyLCB7fSwge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaGFzaCA9IEwuaGFzaChCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdlb2NvZGVyID0gTC5tYXBib3guZ2VvY29kZXIoJ21hcGJveC5wbGFjZXMtdjEnKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmNyZWF0ZUxlZ2VuZChsYXllclBhdGgpO1xyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQuaW5pdCgpO1xyXG5cclxuICAgIH0sIC8vZW5kIGNyZWF0ZU1hcFxyXG4gICAgY3JlYXRlTGVnZW5kOiBmdW5jdGlvbihsYXllclBhdGgpIHtcclxuICAgICAgICB2YXIgdGQgPSAnJztcclxuICAgICAgICB2YXIgdHIgPSAnJztcclxuICAgICAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBsYXllcnNbbGF5ZXJQYXRoXSkgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0ZCArPSAnPHRkPjxpbnB1dCBpZD1cImNoaycgKyBjb3VudCArICdcIiB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWxheWVyPVwiJyArIGtleSArICdcIiBjaGVja2VkPjwvdGQ+JztcclxuICAgICAgICAgICAgdGQgKz0gJzx0ZD48ZGl2IGNsYXNzPVwia2V5LXN5bWJvbFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjonICsgbGF5ZXJzW2xheWVyUGF0aF1ba2V5XS5jb2xvciArICdcIj48L2Rpdj48L3RkPic7XHJcbiAgICAgICAgICAgIHRkICs9ICc8dGQ+PGxhYmVsIGZvcj1cImNoaycgKyBjb3VudCArICdcIj4nICsga2V5ICsgJzwvbGFiZWw+PC90ZD4nO1xyXG4gICAgICAgICAgICB0ciArPSAnPHRyPicgKyB0ZCArICc8L3RyPic7XHJcbiAgICAgICAgICAgIHRkID0gJyc7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcubWFwLWxlZ2VuZCcpXHJcbiAgICAgICAgICAgIC5maW5kKCd0Ym9keScpLnByZXBlbmQodHIpXHJcbiAgICAgICAgICAgIC5lbmQoKVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJ1t0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxheWVyTmFtZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXllcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcExheWVyW2xheWVyTmFtZV0uYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoQlBSTWFwLm1hcExheWVyW2xheWVyTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pOyAgICAgICBcclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvKiB2YXIgY3Vyc29yWDtcclxuICAgICAgICB2YXIgY3Vyc29yWTtcclxuICAgICAgICB2YXIgY2xpY2tYID0gMDtcclxuICAgICAgICB2YXIgY2xpY2tZID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGxhc3RUaW1lc3RhbXAgPSAwO1xyXG5cclxuICAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICBpZiAobGFzdFRpbWVzdGFtcCA+IDAgJiYgdGltZXN0YW1wIC0gbGFzdFRpbWVzdGFtcCA8IDEwMDApIHtcclxuICAgICAgICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICBjbGlja1ggPSBjdXJzb3JYO1xyXG4gICAgICAgIGNsaWNrWSA9IGN1cnNvclk7Ki9cclxuICAgICAgICBCUFJNYXAubGF0ID0gTWF0aC5yb3VuZCgxMDAwMDAwICogZS5sYXRsbmcubGF0KSAvIDEwMDAwMDAuMDtcclxuICAgICAgICBCUFJNYXAubG9uID0gTWF0aC5yb3VuZCgxMDAwMDAwICogZS5sYXRsbmcubG5nKSAvIDEwMDAwMDAuMDtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlQmxvY2tDb3VudHlMYXllcnMoKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcblxyXG4gICAgfSwgLy9lbmQgdXBkYXRlXHJcbiAgICBnZXRDb3VudHk6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgdmFyIGdlb1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9jb3VudHkmbWF4RmVhdHVyZXM9MSZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvbnRhaW5zKGdlb20sJTIwUE9JTlQoJyArIGxvbiArICclMjAnICsgbGF0ICsgJykpJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogZ2VvVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBCUFJNYXAuc2hvd0NvdW50eVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgLy9lbmQgZ2V0Q291bnR5XHJcbiAgICBzaG93Q291bnR5OiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGNvdW50eURhdGEgPSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXM7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgY291bnR5X3RleHQgPSAnTm8gY291bnR5IGRhdGEgZm91bmQgYXQgeW91ciBzZWFyY2hlZC9jbGlja2VkIGxvY2F0aW9uLic7XHJcbiAgICAgICAgICAgIC8vICQoJyNkaXNwbGF5LWNvdW50eScpLmh0bWwoY291bnR5X3RleHQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCQoJyN0YWJJbnN0cnVjdHMnKS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnI3RhYkluc3RydWN0cywgI253Rml4ZWQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2ZpeGVkLCAjcHJvdmlkZXIsICNkZW1vZ3JhcGhpY3MnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaWQgPSBkYXRhLmZlYXR1cmVzWzBdLmlkLnJlcGxhY2UoL1xcLi4qJC8sICcnKTtcclxuXHJcbiAgICAgICAgaWYgKGlkICE9PSAnYnByX2RlYzIwMTZfY291bnR5Jykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQ291bnR5TGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRDb3VudHlMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcihkYXRhKS5zZXRTdHlsZShjbGlja2VkQ291bnR5U3R5bGUpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBpZiAoY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCB8fCBjb3VudHlMYXllckRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcyAhPT0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzLmNvdW50eV9maXBzKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAuZml0Qm91bmRzKGNsaWNrZWRDb3VudHlMYXllci5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBCUFJNYXAudXBkYXRlKGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb3VudHlMYXllckRhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydERlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLmluaXQoY291bnR5RGF0YS5jb3VudHlfZmlwcyk7XHJcbiAgICAgICAgY2hhcnRUZWNoLmluaXQoY291bnR5RGF0YS5jb3VudHlfZmlwcyk7XHJcblxyXG4gICAgfSwgLy9lbmQgc2hvd0NvdW50eVxyXG4gICAgZ2V0QmxvY2s6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgdmFyIGdlb1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWJwcl9kZWMyMDE2Jm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvbnRhaW5zKGdlb20sJTIwUE9JTlQoJyArIGxvbiArICclMjAnICsgbGF0ICsgJykpJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogZ2VvVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBCUFJNYXAuc2hvd0Jsb2NrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Jsb2NrOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGJsb2NrRGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuXHJcbiAgICAgICAgY2xpY2tlZEJsb2NrTGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZEJsb2NrTGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXJEYXRhKS5zZXRTdHlsZShjbGlja2VkQmxvY2tTdHlsZSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5zZXRMb2NhdGlvbk1hcmtlcihCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtZmlwc10nKS50ZXh0KGJsb2NrRGF0YS5ibG9ja19maXBzKTtcclxuICAgICAgICAkKCdbZGF0YS1ydXJhbF0nKS50ZXh0KGJsb2NrRGF0YS51cmJhbl9ydXJhbCA9PT0gJ1InID8gJ1J1cmFsJyA6ICdVcmJhbicpO1xyXG5cclxuICAgICAgICAvL3VwZGF0ZSBQcm92aWRlcnMgdGFibGVcclxuICAgICAgICB0YWJsZVByb3ZpZGVycy5nZXREYXRhKGJsb2NrRGF0YS5ibG9ja19maXBzKTtcclxuICAgIH0sXHJcbiAgICBzZXRMb2NhdGlvbk1hcmtlcjogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihsb2NhdGlvbk1hcmtlcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihsb2NhdGlvbk1hcmtlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvY2F0aW9uTWFya2VyID0gTC5tYXJrZXIoW2xhdCwgbG9uXSwgeyB0aXRsZTogJycgfSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIGxvY2F0aW9uTWFya2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnpvb21Ub0Jsb2NrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgem9vbVRvQmxvY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRCbG9ja0xheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQmxvY2tMYXllci5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyAvL2VuZCBNYXBMYXllcnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQlBSTWFwO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4vdXRpbGl0eS5qcycpO1xyXG5cclxudmFyIHRhYmxlRGVtb2cgPSB7XHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGNvdW50eURhdGEpIHtcclxuICAgIFx0dmFyIHBvcERhdGEgPSB7XHJcblx0XHRcdGNvdW50eV9uYW1lOiBjb3VudHlEYXRhLmNvdW50eV9uYW1lLFxyXG5cdFx0XHRzdGF0ZV9hYmJyOiBjb3VudHlEYXRhLnN0YXRlX2FiYnIsXHJcblx0XHRcdHBvcDIwMTU6IGNvdW50eURhdGEucG9wMjAxNSxcclxuXHRcdFx0cG9wZGVuc2l0eTogY291bnR5RGF0YS5wb3BkZW5zaXR5LFxyXG5cdFx0XHRwZXJjYXBpbmM6IGNvdW50eURhdGEucGVyY2FwaW5jLFxyXG5cdFx0XHR1bnNwb3AyNV8zOiBjb3VudHlEYXRhLnVuc3BvcDI1XzMsXHJcblx0XHRcdHBlcl91cmJhbm5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3VyYmFubm9maXhlZCxcclxuXHRcdFx0cGVyX3J1cmFsbm9maXhlZDogY291bnR5RGF0YS5wZXJfcnVyYWxub2ZpeGVkXHJcblx0XHR9O1xyXG5cclxuXHRcdGZvciAodmFyIHByb3BOYW1lIGluIHBvcERhdGEpIHtcclxuXHRcdFx0aWYgKHV0aWxpdHkuaXNOdWxsKHBvcERhdGFbcHJvcE5hbWVdKSkge1xyXG5cdFx0XHRcdHBvcERhdGFbcHJvcE5hbWVdID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcbiAgICAgICAgLy9wb3B1bGF0ZSBDZW5zdXMgQmxvY2sgdGFibGVcclxuICAgICAgICAkKCdbZGF0YS1jb3VudHldJykudGV4dChwb3BEYXRhLmNvdW50eV9uYW1lKTtcclxuICAgICAgICAkKCdbZGF0YS1zdGF0ZV0nKS50ZXh0KHBvcERhdGEuc3RhdGVfYWJicik7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucG9wMjAxNSkpO1xyXG4gICAgICAgICQoJ1tkYXRhLXBvcERlbnNpdHldJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucG9wZGVuc2l0eSkpO1xyXG4gICAgICAgICQoJ1tkYXRhLWluY29tZUNhcGl0YV0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wZXJjYXBpbmMpKTtcclxuICAgICAgICAkKCdbZGF0YS10b3RhbFBvcE5vQWNjZXNzXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnVuc3BvcDI1XzMpKTtcclxuICAgICAgICAkKCdbZGF0YS11cmJhblBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0UGVyY2VudChwb3BEYXRhLnBlcl91cmJhbm5vZml4ZWQpKTtcclxuICAgICAgICAkKCdbZGF0YS1ydXJhbFBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0UGVyY2VudChwb3BEYXRhLnBlcl9ydXJhbG5vZml4ZWQpKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGFibGVEZW1vZztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHRhYmxlUHJvdmlkZXJzID0ge1xyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oYmxvY2tGaXBzKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyc1VSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfZGVjMjAxNl9wcm92aWRlcnMmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9YmxvY2tfZmlwcz0lMjcnICsgYmxvY2tGaXBzICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1wcm92aWRlcnMnKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAnYWpheCc6IHtcclxuICAgICAgICAgICAgICAgICd1cmwnOiBwcm92aWRlcnNVUkwsXHJcbiAgICAgICAgICAgICAgICAnZGF0YVNyYyc6IHRhYmxlUHJvdmlkZXJzLmNyZWF0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAncHJvdmlkZXJOYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICd0ZWNoJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZERvd24nIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3NwZWVkVXAnIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnb3JkZXInOiBbXHJcbiAgICAgICAgICAgICAgICBbMCwgJ2FzYyddXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdwYWdpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3NlYXJjaGluZyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnc2Nyb2xsWSc6ICcyODBweCcsXHJcbiAgICAgICAgICAgICdzY3JvbGxDb2xsYXBzZSc6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpZGVyRGF0YSA9IGRhdGEuZmVhdHVyZXM7XHJcbiAgICAgICAgdmFyIHRlbXBEYXRhID0gW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvdmlkZXJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRlbXBEYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgJ3Byb3ZpZGVyTmFtZSc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRiYW5hbWUsXHJcbiAgICAgICAgICAgICAgICAndGVjaCc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLnRlY2hub2xvZ3ksXHJcbiAgICAgICAgICAgICAgICAnc3BlZWREb3duJzogcHJvdmlkZXJEYXRhW2ldLnByb3BlcnRpZXMuZG93bmxvYWRfc3BlZWQsXHJcbiAgICAgICAgICAgICAgICAnc3BlZWRVcCc6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLnVwbG9hZF9zcGVlZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wRGF0YTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdGFibGVQcm92aWRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0ge1xyXG4gICAgaXNOdWxsOiBmdW5jdGlvbihmaWVsZE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gZmllbGROYW1lID09PSBudWxsO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdENvbW1hOiBmdW5jdGlvbihudW0pIHtcclxuICAgICAgICB2YXIgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpO1xyXG4gICAgICAgIHBhcnRzWzBdID0gcGFydHNbMF0ucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbignLicpO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdFBlcmNlbnQ6IGZ1bmN0aW9uKG51bSkge1xyXG4gICAgICAgIHJldHVybiAobnVtICogMTAwKS50b0ZpeGVkKDIpICsgJyUnO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dGlsaXR5O1xyXG4iXX0=
