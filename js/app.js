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
                chartNWFixed.getTribal(data);
            }
        });
    },
    getTribal: function() {
        var tribalURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_nw_tribal_fnf&maxFeatures=100&outputFormat=application/json';

        $.ajax({
            type: 'GET',
            url: tribalURL,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtZml4ZWROYXRpb253aWRlLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtdGVjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLXNlYXJjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgQlBSTWFwID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC5qcycpO1xyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAtc2VhcmNoLmpzJyk7XHJcbiAgICBcclxuICAgIGlmICgkKCcjbWFwJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIEJQUk1hcC5pbml0KCk7XHJcbiAgICAgICAgTWFwU2VhcmNoLmluaXQoKTtcclxuICAgIH0gXHJcblxyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnRPcHRzID0ge1xyXG4gICAgbGFiZWxzOiBbXHJcbiAgICAgICAgJ1VyYmFuJyxcclxuICAgICAgICAnUnVyYWwnXHJcbiAgICBdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICcjM0Q1OUQ3JyxcclxuICAgICAgICAgICAgJyM3MURBRDYnXHJcbiAgICAgICAgXVxyXG4gICAgfV1cclxufTtcclxuXHJcbnZhciBjaGFydERlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRvbnV0O1xyXG4gICAgICAgIHZhciBjdHhEZW1vZyA9ICQoJyNjaGFydERlbW9nJyk7XHJcbiAgICAgICAgdmFyIGNoYXJ0VmFscyA9IFtdO1xyXG5cclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl91cmJhbm5vZml4ZWQpO1xyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKGRhdGEucGVyX3J1cmFsbm9maXhlZCk7XHJcblxyXG4gICAgICAgIGNoYXJ0T3B0cy5kYXRhc2V0c1swXS5kYXRhID0gY2hhcnRWYWxzO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0RGVtb2cnKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBkb251dCA9IG5ldyBDaGFydChjdHhEZW1vZywge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0T3B0cyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0RGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydEZpeGVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydEZpeGVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydBbGwnLCAnVXJiYW4nLCAnUnVyYWwnLCAnVHJpYmFsJ10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdGaXhlZCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTm8gRml4ZWQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNkNCQ0Q1J1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc2hvdyBDb3VudHkgRml4ZWQgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydEZpeGVkJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRGaXhlZC5GSVBTKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLkZJUFMgPSBjb3VudHlfZmlwcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJ0Rml4ZWQuZ2V0Q291bnR5RGF0YShjb3VudHlfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q291bnR5RGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFsbENudHlVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5X2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRGaXhlZC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGFsbENudHlVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRGaXhlZC5nZXRVUkRhdGEoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VVJEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9jb3VudHlfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydEZpeGVkLkZJUFMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQucHJvY2Vzc1VSRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZ2V0VHJpYmFsRGF0YSgpO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFRyaWJhbERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmliYWxVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9jb3VudHlfdHJpYmFsX2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRGaXhlZC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRyaWJhbFVSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyBcclxuICAgICAgICAgICAgICAgIGNoYXJ0Rml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRGaXhlZC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc1VSRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgZGF0YUxlbiA9IGRhdGEuZmVhdHVyZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdXJiYW5EYXRhID0ge307XHJcbiAgICAgICAgdmFyIHJ1cmFsRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMgPSBbXTsgICAgICAgXHJcbiAgICAgICAgcnVyYWxEYXRhLmZlYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgIGZvciAoaTsgaSA8IGRhdGFMZW47IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy51cmJhbl9ydXJhbCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnVSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJiYW5EYXRhLmZlYXR1cmVzLnB1c2goZGF0YS5mZWF0dXJlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUodXJiYW5EYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG4gICAgICAgIFxyXG4gICAgfSwgICAgXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1sxXS5kYXRhO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5oYXNfZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH0sXHJcbiAgICBkaXNwbGF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY3R4Rml4ZWQ7XHJcblxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRGaXhlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRGaXhlZFwiIHdpZHRoPVwiMzAwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjdHhGaXhlZCA9ICQoJyNjaGFydEZpeGVkJyk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5jaGFydCA9IG5ldyBDaGFydChjdHhGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRGaXhlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHhBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdBcmVhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ1BvcHVsYXRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtcy5kYXRhc2V0SW5kZXhdLmxhYmVsICsgJzogJyArIHRvb2x0aXBJdGVtcy55TGFiZWwgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0TldGaXhlZCA9IHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBsYWJlbHM6IFsnQWxsJywgJ1VyYmFuJywgJ1J1cmFsJywgJ1RyaWJhbCddLFxyXG4gICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICBsYWJlbDogJ0ZpeGVkJyxcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBsYWJlbDogJ05vIEZpeGVkJyxcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyM2Q0JDRDUnXHJcbiAgICAgICAgfV1cclxuICAgIH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL3Nob3cgTmF0aW9ud2lkZSBjaGFydCBpZiBpdCBleGlzdHMgb24gdGhlIHBhZ2VcclxuICAgICAgICBpZiAoJCgnI2NoYXJ0TldGaXhlZCcpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQuZ2V0TldEYXRhKCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0TldEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbndVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfbndfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IG53VVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IFxyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5nZXRVcmJhbkRhdGEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFVyYmFuRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHVyYmFuVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfbndfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHVyYmFuVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLmdldFRyaWJhbChkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFRyaWJhbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRyaWJhbFVSTCA9ICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWJwcl9kZWMyMDE2X253X3RyaWJhbF9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdHJpYmFsVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLmRpc3BsYXkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBmaXhlZERhdGEgPSBjaGFydE5XRml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0TldGaXhlZC5kYXRhLmRhdGFzZXRzWzFdLmRhdGE7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaCgwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuaGFzX2ZpeGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhOV0ZpeGVkID0gJCgnI2NoYXJ0TldGaXhlZCcpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjaGFydE5XRml4ZWQuY2hhcnQgPSBuZXcgQ2hhcnQoY3R4TldGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnROV0ZpeGVkLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ0FyZWEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnUG9wdWxhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtcywgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1zLmRhdGFzZXRJbmRleF0ubGFiZWwgKyAnOiAnICsgdG9vbHRpcEl0ZW1zLnlMYWJlbCArICclJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydE5XRml4ZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qZGF0YXNldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIkJsdWVcIixcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsdWVcIixcclxuICAgICAgICAgICAgZGF0YTogWzMsNyw0XVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZWRcIixcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInJlZFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbNCwzLDVdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIkdyZWVuXCIsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbNywyLDZdXHJcbiAgICAgICAgfVxyXG4gICAgXSovXHJcblxyXG52YXIgY2hhcnRUZWNoID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydFRlY2guZGF0YSA9IHtcclxuICAgICAgICAgICAgbGFiZWxzOiBbJzAnLCAnMScsICcyJywgJzMnXSxcclxuICAgICAgICAgICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0FsbCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiYmx1ZVwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogWzMsIDcsIDRdLFxyXG4gICAgICAgICAgICAgICAgcGVyRGF0YTogWzEwLCAxNSwgMjBdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnVXJiYW4nLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInJlZFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogWzQsIDMsIDVdLFxyXG4gICAgICAgICAgICAgICAgcGVyRGF0YTogWzIzLCAzMywgNDRdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnUnVyYWwnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbNywgMiwgNl0sXHJcbiAgICAgICAgICAgICAgICBwZXJEYXRhOiBbMTEsIDEyLCAzMl1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdUcmliYWwnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJyb3duXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbNSwgMTIsIDE2XSxcclxuICAgICAgICAgICAgICAgIHBlckRhdGE6IFsyMSwgMTUsIDE3XVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vb25seSBzaG93IGNoYXJ0IGlmIGl0IGV4aXN0cyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIGlmICgkKCcjY2hhcnRUZWNoJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRUZWNoLkZJUFMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoYXJ0VGVjaC5GSVBTID0gY291bnR5X2ZpcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydFRlY2guZ2V0U3BlZWQxMERhdGEoKTtcclxuICAgIH0sXHJcbiAgICBnZXRTcGVlZDEwRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNwZWVkMTBVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfc3BlZWQxMF9jdHlfYWxsJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydFRlY2guRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBzcGVlZDEwVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGFydFRlY2gudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRUZWNoLmRpc3BsYXkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFVyYmFuRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHVyYmFuVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eV91cmJhbl9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0VGVjaC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHVyYmFuVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjaGFydFRlY2gudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRUZWNoLmdldFJ1cmFsRGF0YSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0UnVyYWxEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcnVyYWxVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5X3J1cmFsX2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRUZWNoLkZJUFMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogcnVyYWxVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0VGVjaC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydFRlY2guZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIG51bVByb3YgPSBjaGFydFRlY2guZGF0YS5kYXRhc2V0cztcclxuICAgICAgICB2YXIgcGVyY1BvcCA9IGNoYXJ0VGVjaC5kYXRhLmRhdGFzZXRzWzFdLmRhdGE7XHJcblxyXG4gICAgICAgIC8qaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIG51bVByb3YucHVzaCgwKTtcclxuICAgICAgICAgICAgcGVyY1BvcC5wdXNoKDApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0qL1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIG51bVByb3ZbaV0uZGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5udW1fcHJvdik7XHJcblxyXG4gICAgICAgICAgICAvKmlmIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMudHlwZV9wb3BfcGN0ID09PSAxMDApIHtcclxuICAgICAgICAgICAgICAgIHBlcmNQb3AucHVzaCgwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGVyY1BvcC5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QudG9GaXhlZCgyKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnR5cGVfcG9wX3BjdCA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICBudW1Qcm92LnB1c2goMCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhUZWNoO1xyXG5cclxuICAgICAgICAvL3JlcGxhY2UgY2hhcnQgY2FudmFzIGlmIGl0IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgJCgnI2NoYXJ0VGVjaCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRUZWNoXCIgd2lkdGg9XCIzMDBcIiBoZWlnaHQ9XCIyMjBcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAkKCcuY2hhcnRqcy1oaWRkZW4taWZyYW1lJykucmVtb3ZlKCk7XHJcbmNvbnNvbGUubG9nKGNoYXJ0VGVjaC5kYXRhKTtcclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjdHhUZWNoID0gJCgnI2NoYXJ0VGVjaCcpO1xyXG4gICAgICAgIGNoYXJ0VGVjaC5jaGFydCA9IG5ldyBDaGFydChjdHhUZWNoLCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICBkYXRhOiBjaGFydFRlY2guZGF0YSxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnIyBvZiBQcm92aWRlcnMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnUG9wdWxhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJCb2R5OiBmdW5jdGlvbih0b29sdGlwSXRlbXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ1BvcHVsYXRpb246ICcgKyBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtc1swXS5kYXRhc2V0SW5kZXhdLnBlckRhdGFbdG9vbHRpcEl0ZW1zWzBdLmluZGV4XSArICclJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRUZWNoO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzRGVwbG95bWVudCA9IHt9O1xyXG5cclxuLy9EZXBsb3ltZW50IG1hcCBsYXllcnNcclxubGF5ZXJzRGVwbG95bWVudFsnRml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzEnLFxyXG4gICAgY29sb3I6ICcjRkZFNzczJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc0RlcGxveW1lbnRbJ05vIGZpeGVkIGJyb2FkYmFuZCAyNS8zIChNYnBzKSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfY291bnR5X2xheWVyX25vbmZpeGVkJyxcclxuICAgIHN0eWxlczogJ2Jwcl9sYXllcl9maXhlZF8wJyxcclxuICAgIGNvbG9yOiAnIzZDQkNENScsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc0RlcGxveW1lbnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNQcm92aWRlcnMgPSB7fTtcclxuXHJcbi8vUHJvdmlkZXJzIG1hcCBsYXllcnNcclxubGF5ZXJzUHJvdmlkZXJzWydaZXJvIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCcsXHJcbiAgICBjb2xvcjogJyNmZmZmY2MnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydPbmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnLFxyXG4gICAgY29sb3I6ICcjZmRjYzhhJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snVHdvIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMicsXHJcbiAgICBjb2xvcjogJyNmYzhkNTknLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUaHJlZSBvciBtb3JlIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMycsXHJcbiAgICBjb2xvcjogJyNkNzMwMWYnLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNQcm92aWRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNTcGVlZCA9IHt9O1xyXG5cclxuLy9TcGVlZCBtYXAgbGF5ZXJzXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBzZXJ2aWNlcyBvZiBhdCBsZWFzdCAyMDAga2JwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgY29sb3I6ICcjYzdlOWI0JyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMTAgTWJwcy8xIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCcsXHJcbiAgICBjb2xvcjogJyM3ZmNkYmInLFxyXG4gICAgekluZGV4OiAxMlxyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAyNSBNYnBzLzMgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyNScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIGNvbG9yOiAnI2JkZDdlNycsXHJcbiAgICB6SW5kZXg6IDEzXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDUwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnLFxyXG4gICAgY29sb3I6ICcjMzE4MmJkJyxcclxuICAgIHpJbmRleDogMTRcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMTAwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwMCcsXHJcbiAgICBjb2xvcjogJyMwODMwNmInLFxyXG4gICAgekluZGV4OiAxNVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNTcGVlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1RlY2ggPSB7fTtcclxuXHJcbi8vUHJvdmlkZXJzIG1hcCBsYXllcnNcclxubGF5ZXJzVGVjaFsnRlRUUCddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9maWJlcicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydDYWJsZSBtb2RlbSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9jYWJsZScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydEU0wgKGluYy4gRlRUTiksIG90aGVyIGNvcHBlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9hZHNsJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTNcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0ZpeGVkIHdpcmVsZXNzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2Z3JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTRcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ090aGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX290aGVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTVcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzVGVjaDtcclxuIiwiICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgQlBSTWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcclxuXHJcbiAgICB2YXIgTWFwU2VhcmNoID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2gubG9jQ2hhbmdlKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWdlb0xvY2F0aW9uJykub24oJ2NsaWNrJywgTWFwU2VhcmNoLmdlb0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgJChcIiNidG4tbmF0aW9uTG9jYXRpb25cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBCUFJNYXAubWFwLnNldFZpZXcoWzUwLCAtMTA1XSwgMyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJChcIiNpbnB1dC1zZWFyY2gtc3dpdGNoXCIpLm9uKCdjbGljaycsICdhJywgTWFwU2VhcmNoLnNlYXJjaF9zd2l0Y2gpO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgICAuYXV0b2NvbXBsZXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcXVlc3QudGVybTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvY2F0aW9uLCBwcm9jZXNzQWRkcmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzQWRkcmVzcyhlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZGF0YS5yZXN1bHRzLmZlYXR1cmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3Nlcy5wdXNoKGZbaV0ucGxhY2VfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZShhZGRyZXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgTWFwU2VhcmNoLmxvY0NoYW5nZSgpOyB9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKS5hZGRDbGFzcygndWktY29ybmVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItdG9wJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLmxvY0NoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xhdGl0dWRlLCAjbG9uZ2l0dWRlJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2NDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgQlBSTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvYywgY29kZU1hcCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb2RlTWFwKGVyciwgZGF0YSkgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdHMuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgYWRkcmVzcyBwcm92aWRlZCBjb3VsZCBub3QgYmUgZm91bmQuIFBsZWFzZSBlbnRlciBhIG5ldyBhZGRyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBCUFJNYXAubGF0ID0gZGF0YS5sYXRsbmdbMF07XHJcbiAgICAgICAgICAgICAgICBCUFJNYXAubG9uID0gZGF0YS5sYXRsbmdbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9kZWNpbWFsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgQlBSTWFwLmxhdCA9ICQoJyNsYXRpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuICAgICAgICAgICAgQlBSTWFwLmxvbiA9ICQoJyNsb25naXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoQlBSTWFwLmxhdCA9PT0gJycgfHwgQlBSTWFwLmxvbiA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgbGF0L2xvbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoQlBSTWFwLmxhdCkgPiA5MCB8fCBNYXRoLmFicyhCUFJNYXAubG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xhdC9Mb24gdmFsdWVzIG91dCBvZiByYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZW9Mb2NhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xhdCA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xvbiA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19hY2MgPSBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKGdlb19sYXQgKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubG9uID0gTWF0aC5yb3VuZChnZW9fbG9uICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX3N3aXRjaDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VhcmNoID09PSAnbG9jJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdBZGRyZXNzJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09PSAnbGF0bG9uLWRlY2ltYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0Nvb3JkaW5hdGVzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFwU2VhcmNoOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHJlcXVpcmUoJy4vdGFibGUtcHJvdmlkZXJzLmpzJyk7XHJcbnZhciB0YWJsZURlbW9nID0gcmVxdWlyZSgnLi90YWJsZS1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0RGVtb2cgPSByZXF1aXJlKCcuL2NoYXJ0LWRlbW9ncmFwaGljcy5qcycpO1xyXG52YXIgY2hhcnRGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWQuanMnKTtcclxudmFyIGNoYXJ0TldGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWROYXRpb253aWRlLmpzJyk7XHJcbnZhciBjaGFydFRlY2ggPSByZXF1aXJlKCcuL2NoYXJ0LXRlY2guanMnKTtcclxuXHJcbnZhciBsYXllcnMgPSB7XHJcbiAgICBkZXBsb3ltZW50OiByZXF1aXJlKCcuL2xheWVycy1kZXBsb3ltZW50LmpzJyksXHJcbiAgICBzcGVlZDogcmVxdWlyZSgnLi9sYXllcnMtc3BlZWQuanMnKSxcclxuICAgIHByb3ZpZGVyczogcmVxdWlyZSgnLi9sYXllcnMtcHJvdmlkZXJzLmpzJyksXHJcbiAgICB0ZWNobm9sb2d5OiByZXF1aXJlKCcuL2xheWVycy10ZWNoLmpzJyksXHJcbiAgICB0cmliYWw6IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2Jwcl90cmliYWwnLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl90cmliYWwnLFxyXG4gICAgICAgIHpJbmRleDogMTlcclxuICAgIH0sXHJcbiAgICB1cmJhbjoge1xyXG4gICAgICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgbGF5ZXJzOiAnZmNjOmJwcl9jb3VudHlfbGF5ZXJfdXJiYW5fb25seScsXHJcbiAgICAgICAgc3R5bGVzOiAnYnByX2xheWVyX3VyYmFuJyxcclxuICAgICAgICB6SW5kZXg6IDIwXHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgbG9jYXRpb25NYXJrZXI7XHJcbnZhciBjbGlja2VkQ291bnR5TGF5ZXI7XHJcbnZhciBjbGlja2VkQ291bnR5U3R5bGUgPSB7IGNvbG9yOiAnIzAwZicsIG9wYWNpdHk6IDAuNSwgZmlsbE9wYWNpdHk6IDAuMSwgZmlsbENvbG9yOiAnI2ZmZicsIHdlaWdodDogMyB9O1xyXG52YXIgY291bnR5TGF5ZXJEYXRhID0geyAnZmVhdHVyZXMnOiBbXSB9O1xyXG5cclxudmFyIGNsaWNrZWRCbG9ja0xheWVyO1xyXG52YXIgY2xpY2tlZEJsb2NrU3R5bGUgPSB7IGNvbG9yOiAnIzAwMCcsIG9wYWNpdHk6IDAuNSwgZmlsbE9wYWNpdHk6IDAuMSwgZmlsbENvbG9yOiAnI2ZmZicsIHdlaWdodDogMyB9O1xyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXJEYXRhO1xyXG5cclxudmFyIEJQUk1hcCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBCUFJNYXAuY3JlYXRlTWFwKCk7ICAgICAgICBcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcC5vbignY2xpY2snLCBCUFJNYXAudXBkYXRlKTsgICAgICAgIFxyXG5cclxuICAgICAgICAvLyB0b2dnbGUgbWFwIGNvbnRhaW5lciB3aWR0aFxyXG4gICAgICAgICQoJy5jb250cm9sLWZ1bGwnKS5vbignY2xpY2snLCAnYScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgJCgnaGVhZGVyIC5jb250YWluZXIsIGhlYWRlciAuY29udGFpbmVyLWZsdWlkLCBtYWluJylcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcygnY29udGFpbmVyIGNvbnRhaW5lci1mbHVpZCcpXHJcbiAgICAgICAgICAgICAgICAub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJQUk1hcC5tYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlTWFwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL3ZhciBtYXA7XHJcbiAgICAgICAgdmFyIGhhc2g7XHJcbiAgICAgICAgLy8gdmFyIG1hcERhdGEgPSBNYXAuZGF0YTtcclxuICAgICAgICB2YXIgaW5pdGlhbHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBtYXh6b29tID0gMTU7XHJcbiAgICAgICAgdmFyIG1pbnpvb20gPSAzO1xyXG4gICAgICAgIHZhciBjZW50ZXJfbGF0ID0gMzguODI7XHJcbiAgICAgICAgdmFyIGNlbnRlcl9sb24gPSAtOTQuOTY7XHJcbiAgICAgICAgdmFyIGJhc2VMYXllciA9IHt9O1xyXG4gICAgICAgIHZhciBsYXllckNvbnRyb2w7XHJcbiAgICAgICAgdmFyIGxheWVyUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpWzFdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEJQUk1hcC5tYXBMYXllciA9IHt9O1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2VvVVJMID0gJy9nd2Mvc2VydmljZS93bXM/dGlsZWQ9dHJ1ZSc7XHJcbiAgICAgICAgQlBSTWFwLmdlb19zcGFjZSA9ICdmY2MnO1xyXG5cclxuICAgICAgICBMLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaVkyOXRjSFYwWldOb0lpd2lZU0k2SW5NeWJsTXlhM2NpZlEuUDh5cHBlc0hraTVxTXl4VGMyQ05MZyc7XHJcbiAgICAgICAgQlBSTWFwLm1hcCA9IEwubWFwYm94Lm1hcCgnbWFwLWNvbnRhaW5lcicsICdmY2Muazc0ZWQ1Z2UnLCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtYXhab29tOiBtYXh6b29tLFxyXG4gICAgICAgICAgICAgICAgbWluWm9vbTogbWluem9vbSxcclxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zZXRWaWV3KFtjZW50ZXJfbGF0LCBjZW50ZXJfbG9uXSwgaW5pdGlhbHpvb20pO1xyXG5cclxuICAgICAgICBCUFJNYXAubWFwLmF0dHJpYnV0aW9uQ29udHJvbC5hZGRBdHRyaWJ1dGlvbignPGEgaHJlZj1cImh0dHA6Ly9mY2MuZ292XCI+RkNDPC9hPicpO1xyXG5cclxuICAgICAgICAvL2Jhc2UgbGF5ZXJzXHJcbiAgICAgICAgYmFzZUxheWVyLlN0cmVldCA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGVkNWdlJykuYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgYmFzZUxheWVyLlNhdGVsbGl0ZSA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGQ3bjBnJyk7XHJcbiAgICAgICAgYmFzZUxheWVyLlRlcnJhaW4gPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRjbTNvbCcpO1xyXG5cclxuICAgICAgICAvL2dldCB0aWxlIGxheWVycyBiYXNlZCBvbiBsb2NhdGlvbiBwYXRobmFtZVxyXG4gICAgICAgIGZvciAodmFyIGxheWVyIGluIGxheWVyc1tsYXllclBhdGhdKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXBMYXllcltsYXllcl0gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzW2xheWVyUGF0aF1bbGF5ZXJdKS5zZXRaSW5kZXgobGF5ZXJzW2xheWVyUGF0aF1bbGF5ZXJdLnpJbmRleCkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2FkZCBUcmliYWwgYW5kIFVyYmFuIGxheWVyc1xyXG4gICAgICAgIEJQUk1hcC5tYXBMYXllclsnVHJpYmFsJ10gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzLnRyaWJhbCkuc2V0WkluZGV4KGxheWVycy50cmliYWwuekluZGV4KTtcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXJbJ1VyYmFuJ10gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzLnVyYmFuKS5zZXRaSW5kZXgobGF5ZXJzLnVyYmFuLnpJbmRleCk7XHJcblxyXG4gICAgICAgIC8vbGF5ZXIgY29udHJvbFxyXG4gICAgICAgIGxheWVyQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoXHJcbiAgICAgICAgICAgIGJhc2VMYXllciwge30sIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wbGVmdCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIGhhc2ggPSBMLmhhc2goQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9jb2RlciA9IEwubWFwYm94Lmdlb2NvZGVyKCdtYXBib3gucGxhY2VzLXYxJyk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5jcmVhdGVMZWdlbmQobGF5ZXJQYXRoKTtcclxuXHJcbiAgICAgICAgY2hhcnROV0ZpeGVkLmluaXQoKTtcclxuXHJcbiAgICB9LCAvL2VuZCBjcmVhdGVNYXBcclxuICAgIGNyZWF0ZUxlZ2VuZDogZnVuY3Rpb24obGF5ZXJQYXRoKSB7XHJcbiAgICAgICAgdmFyIHRkID0gJyc7XHJcbiAgICAgICAgdmFyIHRyID0gJyc7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gbGF5ZXJzW2xheWVyUGF0aF0pIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGQgKz0gJzx0ZD48aW5wdXQgaWQ9XCJjaGsnICsgY291bnQgKyAnXCIgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1sYXllcj1cIicgKyBrZXkgKyAnXCIgY2hlY2tlZD48L3RkPic7XHJcbiAgICAgICAgICAgIHRkICs9ICc8dGQ+PGRpdiBjbGFzcz1cImtleS1zeW1ib2xcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6JyArIGxheWVyc1tsYXllclBhdGhdW2tleV0uY29sb3IgKyAnXCI+PC9kaXY+PC90ZD4nO1xyXG4gICAgICAgICAgICB0ZCArPSAnPHRkPjxsYWJlbCBmb3I9XCJjaGsnICsgY291bnQgKyAnXCI+JyArIGtleSArICc8L2xhYmVsPjwvdGQ+JztcclxuICAgICAgICAgICAgdHIgKz0gJzx0cj4nICsgdGQgKyAnPC90cj4nO1xyXG4gICAgICAgICAgICB0ZCA9ICcnO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLm1hcC1sZWdlbmQnKVxyXG4gICAgICAgICAgICAuZmluZCgndGJvZHknKS5wcmVwZW5kKHRyKVxyXG4gICAgICAgICAgICAuZW5kKClcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsICdbdHlwZT1jaGVja2JveF0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXllck5hbWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbGF5ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5tYXBMYXllcltsYXllck5hbWVdLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKEJQUk1hcC5tYXBMYXllcltsYXllck5hbWVdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTsgICAgICAgXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLyogdmFyIGN1cnNvclg7XHJcbiAgICAgICAgdmFyIGN1cnNvclk7XHJcbiAgICAgICAgdmFyIGNsaWNrWCA9IDA7XHJcbiAgICAgICAgdmFyIGNsaWNrWSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBsYXN0VGltZXN0YW1wID0gMDtcclxuXHJcbiAgICAgICB2YXIgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgaWYgKGxhc3RUaW1lc3RhbXAgPiAwICYmIHRpbWVzdGFtcCAtIGxhc3RUaW1lc3RhbXAgPCAxMDAwKSB7XHJcbiAgICAgICAgICAgIGxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgY2xpY2tYID0gY3Vyc29yWDtcclxuICAgICAgICBjbGlja1kgPSBjdXJzb3JZOyovXHJcbiAgICAgICAgQlBSTWFwLmxhdCA9IE1hdGgucm91bmQoMTAwMDAwMCAqIGUubGF0bG5nLmxhdCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgQlBSTWFwLmxvbiA9IE1hdGgucm91bmQoMTAwMDAwMCAqIGUubGF0bG5nLmxuZykgLyAxMDAwMDAwLjA7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZUJsb2NrQ291bnR5TGF5ZXJzKCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG5cclxuICAgIH0sIC8vZW5kIHVwZGF0ZVxyXG4gICAgZ2V0Q291bnR5OiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5Jm1heEZlYXR1cmVzPTEmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dDb3VudHlcclxuICAgICAgICB9KTtcclxuICAgIH0sIC8vZW5kIGdldENvdW50eVxyXG4gICAgc2hvd0NvdW50eTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBjb3VudHlEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50eV90ZXh0ID0gJ05vIGNvdW50eSBkYXRhIGZvdW5kIGF0IHlvdXIgc2VhcmNoZWQvY2xpY2tlZCBsb2NhdGlvbi4nO1xyXG4gICAgICAgICAgICAvLyAkKCcjZGlzcGxheS1jb3VudHknKS5odG1sKGNvdW50eV90ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgkKCcjdGFiSW5zdHJ1Y3RzJykuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICQoJyN0YWJJbnN0cnVjdHMsICNud0ZpeGVkJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNmaXhlZCwgI3Byb3ZpZGVyLCAjZGVtb2dyYXBoaWNzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGFibGVEZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgdGFibGVEZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnREZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5pbml0KGNvdW50eURhdGEuY291bnR5X2ZpcHMpO1xyXG4gICAgICAgIGNoYXJ0VGVjaC5pbml0KGNvdW50eURhdGEuY291bnR5X2ZpcHMpO1xyXG5cclxuICAgIH0sIC8vZW5kIHNob3dDb3VudHlcclxuICAgIGdldEJsb2NrOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dCbG9ja1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNob3dCbG9jazogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBibG9ja0RhdGEgPSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXM7XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRCbG9ja0xheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyRGF0YSkuc2V0U3R5bGUoY2xpY2tlZEJsb2NrU3R5bGUpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuc2V0TG9jYXRpb25NYXJrZXIoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLWZpcHNdJykudGV4dChibG9ja0RhdGEuYmxvY2tfZmlwcyk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxdJykudGV4dChibG9ja0RhdGEudXJiYW5fcnVyYWwgPT09ICdSJyA/ICdSdXJhbCcgOiAnVXJiYW4nKTtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgUHJvdmlkZXJzIHRhYmxlXHJcbiAgICAgICAgdGFibGVQcm92aWRlcnMuZ2V0RGF0YShibG9ja0RhdGEuYmxvY2tfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgc2V0TG9jYXRpb25NYXJrZXI6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIobG9jYXRpb25NYXJrZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIobG9jYXRpb25NYXJrZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2NhdGlvbk1hcmtlciA9IEwubWFya2VyKFtsYXQsIGxvbl0sIHsgdGl0bGU6ICcnIH0pLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBsb2NhdGlvbk1hcmtlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC56b29tVG9CbG9jaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHpvb21Ub0Jsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5maXRCb3VuZHMoY2xpY2tlZEJsb2NrTGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsgLy9lbmQgTWFwTGF5ZXJzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJQUk1hcDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuL3V0aWxpdHkuanMnKTtcclxuXHJcbnZhciB0YWJsZURlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcGRlbnNpdHkpKTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlRGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHtcclxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGJsb2NrRmlwcykge1xyXG4gICAgICAgIHZhciBwcm92aWRlcnNVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfcHJvdmlkZXJzJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWJsb2NrX2ZpcHM9JTI3JyArIGJsb2NrRmlwcyArICclMjcnO1xyXG5cclxuICAgICAgICAkKCcjdGFibGUtcHJvdmlkZXJzJykuRGF0YVRhYmxlKHtcclxuICAgICAgICAgICAgJ2FqYXgnOiB7XHJcbiAgICAgICAgICAgICAgICAndXJsJzogcHJvdmlkZXJzVVJMLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGFTcmMnOiB0YWJsZVByb3ZpZGVycy5jcmVhdGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3Byb3ZpZGVyTmFtZScgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAndGVjaCcgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAnc3BlZWREb3duJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZFVwJyB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdkZXN0cm95JzogdHJ1ZSxcclxuICAgICAgICAgICAgJ2luZm8nOiBmYWxzZSxcclxuICAgICAgICAgICAgJ29yZGVyJzogW1xyXG4gICAgICAgICAgICAgICAgWzAsICdhc2MnXVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAncGFnaW5nJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdzZWFyY2hpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3Njcm9sbFknOiAnMjgwcHgnLFxyXG4gICAgICAgICAgICAnc2Nyb2xsQ29sbGFwc2UnOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBwcm92aWRlckRhdGEgPSBkYXRhLmZlYXR1cmVzO1xyXG4gICAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3ZpZGVyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0ZW1wRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdwcm92aWRlck5hbWUnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kYmFuYW1lLFxyXG4gICAgICAgICAgICAgICAgJ3RlY2gnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy50ZWNobm9sb2d5LFxyXG4gICAgICAgICAgICAgICAgJ3NwZWVkRG93bic6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRvd25sb2FkX3NwZWVkLFxyXG4gICAgICAgICAgICAgICAgJ3NwZWVkVXAnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy51cGxvYWRfc3BlZWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHtcclxuICAgIGlzTnVsbDogZnVuY3Rpb24oZmllbGROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkTmFtZSA9PT0gbnVsbDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRDb21tYTogZnVuY3Rpb24obnVtKSB7XHJcbiAgICAgICAgdmFyIHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcclxuICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJy4nKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRQZXJjZW50OiBmdW5jdGlvbihudW0pIHtcclxuICAgICAgICByZXR1cm4gKG51bSAqIDEwMCkudG9GaXhlZCgyKSArICclJztcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXRpbGl0eTtcclxuIl19
