(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');
    var tableNWAve = require('./modules/table-nwAve.js');

    if ($('#map').length > 0) {
        BPRMap.init();
        MapSearch.init();
    }

    if ($('#table-nwAve').length > 0) {
        tableNWAve.getData();
    }

}());

},{"./modules/map-search.js":12,"./modules/map.js":13,"./modules/table-nwAve.js":15}],2:[function(require,module,exports){
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
            url: allCntyURL
        }).done(function(data) {
            chartFixed.update(data);
            chartFixed.getURData();
        });
    },
    getURData: function() {
        var urURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_county_ur_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: urURL
        }).done(function(data) {
            chartFixed.processURData(data);
            chartFixed.getTribalData();
        });
    },
    getTribalData: function() {
        var tribalURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_county_tribal_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: tribalURL
        }).done(function(data) {
            chartFixed.update(data);
            chartFixed.display();
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
        $('#chartFixed').replaceWith('<canvas id="chartFixed" width="350" height="220"></canvas>');
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
                chartNWFixed.processURData(data);
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

        chartNWFixed.update(urbanData);
        chartNWFixed.update(ruralData);
        
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

var chartSpeed = {
    init: function(county_fips) {
        chartSpeed.data = {
            labels: ['.200', '10', '25', '50', '100'],
            datasets: [{
                label: '0',
                backgroundColor: 'rgba(255, 99, 132, 0.9)',
                data: []
            }, {
                label: '1',
                backgroundColor: 'rgba(54, 162, 235, 0.9)',
                data: []
            }, {
                label: '2',
                backgroundColor: 'rgba(255, 206, 86, 0.9)',
                data: []
            }, {
                label: '3',
                backgroundColor: 'rgba(75, 192, 192, 0.9)',
                data: []
            }]
        };

        //only show chart if it exists on the page
        if ($('#chartSpeed').length === 0) {
            return;
        }

        //if county FIPS is the same don't regenerate chart
        if (county_fips === chartSpeed.FIPS) {
            return;
        } else {
            chartSpeed.FIPS = county_fips;
        }

        chartSpeed.getTech();
    },
    getTech: function() {
        var speedURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_refresh_county&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartSpeed.FIPS + '%27';
        var speedNWURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_refresh_nation&maxFeatures=100&outputFormat=application/json';

        $.ajax({
            type: 'GET',
            url: chartSpeed.FIPS === 'nw' ? speedNWURL : speedURL,
            success: function(data) {
                chartSpeed.update(data);
                chartSpeed.display();
            }
        });
    },    
    update: function(data) {
        var techData = data.features[0].properties;
        var techTypes = ['200', '10', '25', '50', '100'];
        var datasets = chartSpeed.data.datasets;

        var propName = '';
        var i = 0;
        var j = 0;

        function getVals(arr) { 
            for (j = 0; j < chartSpeed.data.datasets.length; j++) { 
                propName = 'speed_' + techTypes[i] + '_' + j;
                datasets[j].data.push((100 * techData[propName]).toFixed(2));
            }
        }

        for (i = 0; i < techTypes.length; i++) {
            getVals(techTypes);
        }

    },
    display: function() {
        var ctxTech;

        //replace chart canvas if it already exists
        $('#chartSpeed').replaceWith('<canvas id="chartSpeed" width="350" height="220"></canvas>');
        $('.chartjs-hidden-iframe').remove();

        if (chartSpeed.FIPS === 'nw') {
            $('#hd-speed').addClass('hide');
            $('#hd-nwSpeed').removeClass('hide');
        } else {
            $('#hd-nwSpeed').addClass('hide');
            $('#hd-speed').removeClass('hide');
        }
        
        //create new chart
        ctxTech = $('#chartSpeed');
        chartSpeed.chart = new Chart(ctxTech, {
            type: 'bar',
            data: chartSpeed.data,
            options: {
                legend: {
                    labels: {
                        boxWidth: 20
                    }
                },
                responsive: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Speed (Mbps/1 Mbps)'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: '% Population'
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItem, data) { 
                            return 'Speed: ' + tooltipItem[0].xLabel + 'Mbps/1 Mbps';
                        },
                        label: function(tooltipItem, data) {
                            return '# Providers: ' + data.datasets[tooltipItem.datasetIndex].label;
                        },
                        afterLabel: function(tooltipItem, data) {
                            return 'Population: ' + tooltipItem.yLabel + '%';
                        }
                    }
                }
            }
        });
    }
};

module.exports = chartSpeed;

},{}],6:[function(require,module,exports){
'use strict';

var chartTech = {
    init: function(county_fips) {
        chartTech.data = {
            labels: ['0', '1', '2', '3'],
            datasets: [{
                label: 'ADSL',
                backgroundColor: 'rgba(255, 99, 132, 0.9)',
                data: []
            }, {
                label: 'Cable',
                backgroundColor: 'rgba(54, 162, 235, 0.9)',
                data: []
            }, {
                label: 'Fiber',
                backgroundColor: 'rgba(255, 206, 86, 0.9)',
                data: []
            }, {
                label: 'Other',
                backgroundColor: 'rgba(75, 192, 192, 0.9)',
                data: []
            }, {
                label: 'FW',
                backgroundColor: 'rgba(153, 102, 255, 0.9)',
                data: []
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

        chartTech.getTech();
    },
    getTech: function() {
        var techURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_refresh_county&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartTech.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: techURL,
            success: function(data) {
                chartTech.update(data);
                chartTech.display();
            }
        });
    },    
    update: function(data) {
        var techData = data.features[0].properties;
        var techTypes = ['adsl', 'cable', 'fiber', 'other', 'fw'];
        var datasets = chartTech.data.datasets;

        var propName = '';
        var i = 0;
        var j = 0;

        function getVals(arr) {
            for (j = 0; j < chartTech.data.labels.length; j++) { 
                propName = 'tech_' + techTypes[i] + '_' + j;
                datasets[i].data.push((100 * techData[propName]).toFixed(2));
            }
        }

        for (i = 0; i < techTypes.length; i++) {
            getVals(techTypes);
        }

    },
    display: function() {
        var ctxTech;

        //replace chart canvas if it already exists
        $('#chartTech').replaceWith('<canvas id="chartTech" width="350" height="220"></canvas>');
        $('.chartjs-hidden-iframe').remove();
        
        //create new chart
        ctxTech = $('#chartTech');
        chartTech.chart = new Chart(ctxTech, {
            type: 'bar',
            data: chartTech.data,
            options: {
                legend: {
                    labels: {
                        boxWidth: 20
                    }
                },
                responsive: false,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            stacked: true,
                            display: true,
                            labelString: '# of Providers'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            stacked: true,
                            display: true,
                            labelString: '% Population'
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItem, data) { 
                            return '# of Providers: ' + tooltipItem[0].xLabel;
                        },
                        label: function(tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel + '%';
                        }
                    }
                }
            }
        });
    }
};

module.exports = chartTech;

},{}],7:[function(require,module,exports){
'use strict';

var Hash = {
    params: {},
    hasHash: function() {
        return window.location.hash ? true : false;
    }, 
    get: function(BPRMap) {
        var hash = decodeURIComponent(location.hash);

        //map lat, lon, zoom
        var latHash = hash.match(/lat=([^&]+)/i);
        var lonHash = hash.match(/lon=([^&]+)/i);
        var zoomHash = hash.match(/zoom=([^&]+)/i);

        BPRMap.lat = latHash === null ? BPRMap.lat : decodeURIComponent(latHash[1].replace(/\+/g, '%20'));
        BPRMap.lon = lonHash === null ? BPRMap.lon : decodeURIComponent(lonHash[1].replace(/\+/g, '%20'));
        BPRMap.zoom = zoomHash === null ? BPRMap.zoom : decodeURIComponent(zoomHash[1].replace(/\+/g, '%20'));

    },
    update: function(BPRMap) {

        //map lat, lon, zoom
        BPRMap.zoom = BPRMap.map.getZoom();
        Hash.params.lat = BPRMap.lat;
        Hash.params.lon = BPRMap.lon;
        Hash.params.zoom = BPRMap.zoom;

        //selected map layers
        /*$('.map-legend').find(':checked').each(function(index, el) {
            Hash.params['layer' + index] = $(el).attr('data-layer');
        });*/

        //selected base layer
        // Hash.params.baseLayer = $('.leaflet-control-layers-base').find(':checked').next('span').text().trim();

        //selected tab
        // Hash.params.tab = $('.layer-switch').find('.active a').text();
        
        window.location.hash = encodeURIComponent($.param(Hash.params));

    },
    change: function(BPRMap) {
    	Hash.get(BPRMap);    	
    }
};


module.exports = Hash;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
},{"./map.js":13}],13:[function(require,module,exports){
'use strict';

var Hash = require('./hash.js');

var tableProviders = require('./table-providers.js');
var tableDemog = require('./table-demographics.js');
var chartDemog = require('./chart-demographics.js');
var chartFixed = require('./chart-fixed.js');
var chartNWFixed = require('./chart-fixedNationwide.js');
var chartTech = require('./chart-tech.js');
var chartSpeed = require('./chart-speed.js');

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

        // default map settings
        BPRMap.mapLayer = {};
        BPRMap.lat = 38.82;
        BPRMap.lon = -94.96;
        BPRMap.zoom = 4;

        // trigger hashchange and get map settings
        $(window).on('hashchange', Hash.change);
        Hash.change(BPRMap);
        BPRMap.createMap();

        BPRMap.map.on('click', BPRMap.update);

        if (Hash.hasHash()) { 
            BPRMap.getCounty(BPRMap.lat, BPRMap.lon);
        }

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
        var maxzoom = 15;
        var minzoom = 3;
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
            .setView([BPRMap.lat, BPRMap.lon], BPRMap.zoom);

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

        // hash = L.hash(BPRMap.map);

        BPRMap.geocoder = L.mapbox.geocoder('mapbox.places-v1');

        BPRMap.createLegend(layerPath);

        chartNWFixed.init();
        
        if (Hash.hasHash() === false) { 
            chartSpeed.init('nw');
        }        

    }, //end createMap
    createLegend: function(layerPath) {
        var td = '';
        var tr = '';
        var count = 0;

        for (var key in layers[layerPath]) {
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
        BPRMap.lat = Math.round(1000000 * e.latlng.lat) / 1000000.0;
        BPRMap.lon = Math.round(1000000 * e.latlng.lng) / 1000000.0;
        
        BPRMap.getCounty(BPRMap.lat, BPRMap.lon);        

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

        BPRMap.getBlock(BPRMap.lat, BPRMap.lon);

        tableDemog.create(countyData);
        chartDemog.create(countyData);
        chartFixed.init(countyData.county_fips);
        chartTech.init(countyData.county_fips);
        chartSpeed.init(countyData.county_fips);

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

        Hash.update(BPRMap);
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

},{"./chart-demographics.js":2,"./chart-fixed.js":3,"./chart-fixedNationwide.js":4,"./chart-speed.js":5,"./chart-tech.js":6,"./hash.js":7,"./layers-deployment.js":8,"./layers-providers.js":9,"./layers-speed.js":10,"./layers-tech.js":11,"./table-demographics.js":14,"./table-providers.js":16}],14:[function(require,module,exports){
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

},{"./utility.js":17}],15:[function(require,module,exports){
'use strict';

var utility = require('./utility.js');

var columns = [
    { 'data': 'avepop', 'width': '20%' },
    { 'data': 'avedensity', 'width': '20%' },
    { 'data': 'percapita', 'width': '20%' },
    { 'data': 'household', 'width': '20%' },
    { 'data': 'poverty', 'width': '20%' }
];

var rowTitles = ['Without Access', 'With Access'];

var tableNWAve = {
    getData: function(blockFips) {
        var nwAveURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_nw_average&maxFeatures=100&outputFormat=application/json';

        $('#table-nwAve').DataTable({
            'ajax': {
                'url': nwAveURL,
                'complete': addCols,
                'dataSrc': tableNWAve.create
            },
            'bSort': false,
            'columns': columns,
            'destroy': true,
            'info': false,
            // 'order': [
            //     [0, 'asc']
            // ],
            'paging': false,
            'searching': false,
            // 'scrollY': '280px',
            // 'scrollCollapse': true,
        });

        function addCols() {
            $('#table-nwAve').find('tbody>tr').each(function(index, elm) {
                if ($(elm).hasClass('odd')) {
                    $(elm).prepend('<th class="rowHeading">Without Access</th>');
                } else {
                    $(elm).prepend('<th class="rowHeading">With Access</th>');
                }

            });

            $('#table-nwAve').find('tbody>tr').prepend('<th></th>');
            $('#table-nwAve').find('tbody>tr').eq(0).before('<tr><th colspan="7">United States (All Areas)</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(2).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(5).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');

            $('#table-nwAve').find('tbody>tr').eq(8).after('<tr><th colspan="7">Tribal Lands</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(11).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(14).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');

            $('#table-nwAve').find('tbody>tr').eq(17).after('<tr><th colspan="7">U.S. Territories</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(20).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(23).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');
        }

    },
    create: function(data) {
        var popData = data.features[0].properties;
        var tempData = [];
        var tempObj = {};
        var i = 0;
        var j = 0;

        var groupPrefix = ['us_avg', 'us_rural_avg', 'us_urban_avg', 'tribal_avg', 'tribal_rural_avg', 'tribal_urban_avg', 'terr_avg', 'terr_rural_avg', 'terr_urban_avg'];

        var groupW = ['pop_w', 'popden_w', 'percap_w', 'hinc_w', 'povrat_w'];
        var groupWo = ['pop_wo', 'popden_wo', 'percap_wo', 'hinc_wo', 'povrat_wo'];

        function getVals(arr) {
            tempObj = {};
            for (j = 0; j < arr.length; j++) {
                var propName = groupPrefix[i] + '_' + arr[j];
                var colName = columns[j].data;

                tempObj[colName] = popData[propName];
            }
        }

        for (i = 0; i < groupPrefix.length; i++) {
            getVals(groupWo);
            tempData.push(tempObj);
            getVals(groupW);
            tempData.push(tempObj);
        }

        return tempData;
    }
};

module.exports = tableNWAve;

},{"./utility.js":17}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtZml4ZWROYXRpb253aWRlLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtc3BlZWQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9jaGFydC10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvaGFzaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLXNlYXJjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLW53QXZlLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBCUFJNYXAgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLmpzJyk7XHJcbiAgICB2YXIgTWFwU2VhcmNoID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC1zZWFyY2guanMnKTtcclxuICAgIHZhciB0YWJsZU5XQXZlID0gcmVxdWlyZSgnLi9tb2R1bGVzL3RhYmxlLW53QXZlLmpzJyk7XHJcblxyXG4gICAgaWYgKCQoJyNtYXAnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgQlBSTWFwLmluaXQoKTtcclxuICAgICAgICBNYXBTZWFyY2guaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcjdGFibGUtbndBdmUnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGFibGVOV0F2ZS5nZXREYXRhKCk7XHJcbiAgICB9XHJcblxyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnRPcHRzID0ge1xyXG4gICAgbGFiZWxzOiBbXHJcbiAgICAgICAgJ1VyYmFuJyxcclxuICAgICAgICAnUnVyYWwnXHJcbiAgICBdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICcjM0Q1OUQ3JyxcclxuICAgICAgICAgICAgJyM3MURBRDYnXHJcbiAgICAgICAgXVxyXG4gICAgfV1cclxufTtcclxuXHJcbnZhciBjaGFydERlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRvbnV0O1xyXG4gICAgICAgIHZhciBjdHhEZW1vZyA9ICQoJyNjaGFydERlbW9nJyk7XHJcbiAgICAgICAgdmFyIGNoYXJ0VmFscyA9IFtdO1xyXG5cclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl91cmJhbm5vZml4ZWQpO1xyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKGRhdGEucGVyX3J1cmFsbm9maXhlZCk7XHJcblxyXG4gICAgICAgIGNoYXJ0T3B0cy5kYXRhc2V0c1swXS5kYXRhID0gY2hhcnRWYWxzO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0RGVtb2cnKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBkb251dCA9IG5ldyBDaGFydChjdHhEZW1vZywge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0T3B0cyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0RGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydEZpeGVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydEZpeGVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydBbGwnLCAnVXJiYW4nLCAnUnVyYWwnLCAnVHJpYmFsJ10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdGaXhlZCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTm8gRml4ZWQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNkNCQ0Q1J1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc2hvdyBDb3VudHkgRml4ZWQgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydEZpeGVkJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRGaXhlZC5GSVBTKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLkZJUFMgPSBjb3VudHlfZmlwcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJ0Rml4ZWQuZ2V0Q291bnR5RGF0YShjb3VudHlfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q291bnR5RGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFsbENudHlVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5X2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRGaXhlZC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGFsbENudHlVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZ2V0VVJEYXRhKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VVJEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9jb3VudHlfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydEZpeGVkLkZJUFMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC5wcm9jZXNzVVJEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLmdldFRyaWJhbERhdGEoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRUcmliYWxEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdHJpYmFsVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfY291bnR5X3RyaWJhbF9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0Rml4ZWQuRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiB0cmliYWxVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZGlzcGxheSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NVUkRhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGRhdGFMZW4gPSBkYXRhLmZlYXR1cmVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdmFyIHVyYmFuRGF0YSA9IHt9O1xyXG4gICAgICAgIHZhciBydXJhbERhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgdXJiYW5EYXRhLmZlYXR1cmVzID0gW107XHJcbiAgICAgICAgcnVyYWxEYXRhLmZlYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgIGZvciAoaTsgaSA8IGRhdGFMZW47IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy51cmJhbl9ydXJhbCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnVSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJiYW5EYXRhLmZlYXR1cmVzLnB1c2goZGF0YS5mZWF0dXJlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUodXJiYW5EYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG5cclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1sxXS5kYXRhO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5oYXNfZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN0eEZpeGVkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRGaXhlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRGaXhlZFwiIHdpZHRoPVwiMzUwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjdHhGaXhlZCA9ICQoJyNjaGFydEZpeGVkJyk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5jaGFydCA9IG5ldyBDaGFydChjdHhGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRGaXhlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHhBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdBcmVhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ1BvcHVsYXRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtcy5kYXRhc2V0SW5kZXhdLmxhYmVsICsgJzogJyArIHRvb2x0aXBJdGVtcy55TGFiZWwgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0TldGaXhlZCA9IHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBsYWJlbHM6IFsnQWxsJywgJ1VyYmFuJywgJ1J1cmFsJywgJ1RyaWJhbCddLFxyXG4gICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICBsYWJlbDogJ0ZpeGVkJyxcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBsYWJlbDogJ05vIEZpeGVkJyxcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyM2Q0JDRDUnXHJcbiAgICAgICAgfV1cclxuICAgIH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL3Nob3cgTmF0aW9ud2lkZSBjaGFydCBpZiBpdCBleGlzdHMgb24gdGhlIHBhZ2VcclxuICAgICAgICBpZiAoJCgnI2NoYXJ0TldGaXhlZCcpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQuZ2V0TldEYXRhKCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0TldEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbndVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfbndfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IG53VVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IFxyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5nZXRVcmJhbkRhdGEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFVyYmFuRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHVyYmFuVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfbndfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHVyYmFuVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQucHJvY2Vzc1VSRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5nZXRUcmliYWwoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRUcmliYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmliYWxVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9ud190cmliYWxfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRyaWJhbFVSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBwcm9jZXNzVVJEYXRhOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHZhciBkYXRhTGVuID0gZGF0YS5mZWF0dXJlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1cmJhbkRhdGEgPSB7fTtcclxuICAgICAgICB2YXIgcnVyYWxEYXRhID0ge307XHJcblxyXG4gICAgICAgIHVyYmFuRGF0YS5mZWF0dXJlcyA9IFtdOyAgICAgICBcclxuICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChpOyBpIDwgZGF0YUxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnVyYmFuX3J1cmFsKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxyXG4gICAgICAgICAgICAgICAgICAgIHJ1cmFsRGF0YS5mZWF0dXJlcy5wdXNoKGRhdGEuZmVhdHVyZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQudXBkYXRlKHVyYmFuRGF0YSk7XHJcbiAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBmaXhlZERhdGEgPSBjaGFydE5XRml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0TldGaXhlZC5kYXRhLmRhdGFzZXRzWzFdLmRhdGE7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaCgwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuaGFzX2ZpeGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhOV0ZpeGVkID0gJCgnI2NoYXJ0TldGaXhlZCcpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjaGFydE5XRml4ZWQuY2hhcnQgPSBuZXcgQ2hhcnQoY3R4TldGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnROV0ZpeGVkLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ0FyZWEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnUG9wdWxhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtcywgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1zLmRhdGFzZXRJbmRleF0ubGFiZWwgKyAnOiAnICsgdG9vbHRpcEl0ZW1zLnlMYWJlbCArICclJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydE5XRml4ZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydFNwZWVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydFNwZWVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWycuMjAwJywgJzEwJywgJzI1JywgJzUwJywgJzEwMCddLFxyXG4gICAgICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnMCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgOTksIDEzMiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJzEnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1NCwgMTYyLCAyMzUsIDAuOSknLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcyJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyMDYsIDg2LCAwLjkpJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnMycsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDc1LCAxOTIsIDE5MiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vb25seSBzaG93IGNoYXJ0IGlmIGl0IGV4aXN0cyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIGlmICgkKCcjY2hhcnRTcGVlZCcpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2lmIGNvdW50eSBGSVBTIGlzIHRoZSBzYW1lIGRvbid0IHJlZ2VuZXJhdGUgY2hhcnRcclxuICAgICAgICBpZiAoY291bnR5X2ZpcHMgPT09IGNoYXJ0U3BlZWQuRklQUykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hhcnRTcGVlZC5GSVBTID0gY291bnR5X2ZpcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydFNwZWVkLmdldFRlY2goKTtcclxuICAgIH0sXHJcbiAgICBnZXRUZWNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BlZWRVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9yZWZyZXNoX2NvdW50eSZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRTcGVlZC5GSVBTICsgJyUyNyc7XHJcbiAgICAgICAgdmFyIHNwZWVkTldVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9yZWZyZXNoX25hdGlvbiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24nO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBjaGFydFNwZWVkLkZJUFMgPT09ICdudycgPyBzcGVlZE5XVVJMIDogc3BlZWRVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0U3BlZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRTcGVlZC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sICAgIFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHRlY2hEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciB0ZWNoVHlwZXMgPSBbJzIwMCcsICcxMCcsICcyNScsICc1MCcsICcxMDAnXTtcclxuICAgICAgICB2YXIgZGF0YXNldHMgPSBjaGFydFNwZWVkLmRhdGEuZGF0YXNldHM7XHJcblxyXG4gICAgICAgIHZhciBwcm9wTmFtZSA9ICcnO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHMoYXJyKSB7IFxyXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2hhcnRTcGVlZC5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7IFxyXG4gICAgICAgICAgICAgICAgcHJvcE5hbWUgPSAnc3BlZWRfJyArIHRlY2hUeXBlc1tpXSArICdfJyArIGo7XHJcbiAgICAgICAgICAgICAgICBkYXRhc2V0c1tqXS5kYXRhLnB1c2goKDEwMCAqIHRlY2hEYXRhW3Byb3BOYW1lXSkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0ZWNoVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2V0VmFscyh0ZWNoVHlwZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN0eFRlY2g7XHJcblxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRTcGVlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRTcGVlZFwiIHdpZHRoPVwiMzUwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBpZiAoY2hhcnRTcGVlZC5GSVBTID09PSAnbncnKSB7XHJcbiAgICAgICAgICAgICQoJyNoZC1zcGVlZCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNoZC1ud1NwZWVkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcjaGQtbndTcGVlZCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNoZC1zcGVlZCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBjaGFydFxyXG4gICAgICAgIGN0eFRlY2ggPSAkKCcjY2hhcnRTcGVlZCcpO1xyXG4gICAgICAgIGNoYXJ0U3BlZWQuY2hhcnQgPSBuZXcgQ2hhcnQoY3R4VGVjaCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRTcGVlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94V2lkdGg6IDIwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ1NwZWVkIChNYnBzLzEgTWJwcyknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnJSBQb3B1bGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZnVuY3Rpb24odG9vbHRpcEl0ZW0sIGRhdGEpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1NwZWVkOiAnICsgdG9vbHRpcEl0ZW1bMF0ueExhYmVsICsgJ01icHMvMSBNYnBzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyMgUHJvdmlkZXJzOiAnICsgZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlckxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdQb3B1bGF0aW9uOiAnICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0U3BlZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydFRlY2ggPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihjb3VudHlfZmlwcykge1xyXG4gICAgICAgIGNoYXJ0VGVjaC5kYXRhID0ge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFsnMCcsICcxJywgJzInLCAnMyddLFxyXG4gICAgICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQURTTCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgOTksIDEzMiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NhYmxlJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoNTQsIDE2MiwgMjM1LCAwLjkpJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnRmliZXInLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDIwNiwgODYsIDAuOSknLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdPdGhlcicsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDc1LCAxOTIsIDE5MiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0ZXJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMTUzLCAxMDIsIDI1NSwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vb25seSBzaG93IGNoYXJ0IGlmIGl0IGV4aXN0cyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIGlmICgkKCcjY2hhcnRUZWNoJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRUZWNoLkZJUFMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoYXJ0VGVjaC5GSVBTID0gY291bnR5X2ZpcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydFRlY2guZ2V0VGVjaCgpO1xyXG4gICAgfSxcclxuICAgIGdldFRlY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ZWNoVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfcmVmcmVzaF9jb3VudHkmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0VGVjaC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRlY2hVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0VGVjaC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydFRlY2guZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAgICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuICAgICAgICB2YXIgdGVjaFR5cGVzID0gWydhZHNsJywgJ2NhYmxlJywgJ2ZpYmVyJywgJ290aGVyJywgJ2Z3J107XHJcbiAgICAgICAgdmFyIGRhdGFzZXRzID0gY2hhcnRUZWNoLmRhdGEuZGF0YXNldHM7XHJcblxyXG4gICAgICAgIHZhciBwcm9wTmFtZSA9ICcnO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHMoYXJyKSB7XHJcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaGFydFRlY2guZGF0YS5sYWJlbHMubGVuZ3RoOyBqKyspIHsgXHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZSA9ICd0ZWNoXycgKyB0ZWNoVHlwZXNbaV0gKyAnXycgKyBqO1xyXG4gICAgICAgICAgICAgICAgZGF0YXNldHNbaV0uZGF0YS5wdXNoKCgxMDAgKiB0ZWNoRGF0YVtwcm9wTmFtZV0pLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGVjaFR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdldFZhbHModGVjaFR5cGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhUZWNoO1xyXG5cclxuICAgICAgICAvL3JlcGxhY2UgY2hhcnQgY2FudmFzIGlmIGl0IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgJCgnI2NoYXJ0VGVjaCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRUZWNoXCIgd2lkdGg9XCIzNTBcIiBoZWlnaHQ9XCIyMjBcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAkKCcuY2hhcnRqcy1oaWRkZW4taWZyYW1lJykucmVtb3ZlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jcmVhdGUgbmV3IGNoYXJ0XHJcbiAgICAgICAgY3R4VGVjaCA9ICQoJyNjaGFydFRlY2gnKTtcclxuICAgICAgICBjaGFydFRlY2guY2hhcnQgPSBuZXcgQ2hhcnQoY3R4VGVjaCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRUZWNoLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hXaWR0aDogMjBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJyMgb2YgUHJvdmlkZXJzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICclIFBvcHVsYXRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnIyBvZiBQcm92aWRlcnM6ICcgKyB0b29sdGlwSXRlbVswXS54TGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbCArICc6ICcgKyB0b29sdGlwSXRlbS55TGFiZWwgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRUZWNoO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgSGFzaCA9IHtcclxuICAgIHBhcmFtczoge30sXHJcbiAgICBoYXNIYXNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhhc2ggPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9LCBcclxuICAgIGdldDogZnVuY3Rpb24oQlBSTWFwKSB7XHJcbiAgICAgICAgdmFyIGhhc2ggPSBkZWNvZGVVUklDb21wb25lbnQobG9jYXRpb24uaGFzaCk7XHJcblxyXG4gICAgICAgIC8vbWFwIGxhdCwgbG9uLCB6b29tXHJcbiAgICAgICAgdmFyIGxhdEhhc2ggPSBoYXNoLm1hdGNoKC9sYXQ9KFteJl0rKS9pKTtcclxuICAgICAgICB2YXIgbG9uSGFzaCA9IGhhc2gubWF0Y2goL2xvbj0oW14mXSspL2kpO1xyXG4gICAgICAgIHZhciB6b29tSGFzaCA9IGhhc2gubWF0Y2goL3pvb209KFteJl0rKS9pKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmxhdCA9IGxhdEhhc2ggPT09IG51bGwgPyBCUFJNYXAubGF0IDogZGVjb2RlVVJJQ29tcG9uZW50KGxhdEhhc2hbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XHJcbiAgICAgICAgQlBSTWFwLmxvbiA9IGxvbkhhc2ggPT09IG51bGwgPyBCUFJNYXAubG9uIDogZGVjb2RlVVJJQ29tcG9uZW50KGxvbkhhc2hbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XHJcbiAgICAgICAgQlBSTWFwLnpvb20gPSB6b29tSGFzaCA9PT0gbnVsbCA/IEJQUk1hcC56b29tIDogZGVjb2RlVVJJQ29tcG9uZW50KHpvb21IYXNoWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpO1xyXG5cclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKEJQUk1hcCkge1xyXG5cclxuICAgICAgICAvL21hcCBsYXQsIGxvbiwgem9vbVxyXG4gICAgICAgIEJQUk1hcC56b29tID0gQlBSTWFwLm1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgSGFzaC5wYXJhbXMubGF0ID0gQlBSTWFwLmxhdDtcclxuICAgICAgICBIYXNoLnBhcmFtcy5sb24gPSBCUFJNYXAubG9uO1xyXG4gICAgICAgIEhhc2gucGFyYW1zLnpvb20gPSBCUFJNYXAuem9vbTtcclxuXHJcbiAgICAgICAgLy9zZWxlY3RlZCBtYXAgbGF5ZXJzXHJcbiAgICAgICAgLyokKCcubWFwLWxlZ2VuZCcpLmZpbmQoJzpjaGVja2VkJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcclxuICAgICAgICAgICAgSGFzaC5wYXJhbXNbJ2xheWVyJyArIGluZGV4XSA9ICQoZWwpLmF0dHIoJ2RhdGEtbGF5ZXInKTtcclxuICAgICAgICB9KTsqL1xyXG5cclxuICAgICAgICAvL3NlbGVjdGVkIGJhc2UgbGF5ZXJcclxuICAgICAgICAvLyBIYXNoLnBhcmFtcy5iYXNlTGF5ZXIgPSAkKCcubGVhZmxldC1jb250cm9sLWxheWVycy1iYXNlJykuZmluZCgnOmNoZWNrZWQnKS5uZXh0KCdzcGFuJykudGV4dCgpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgLy9zZWxlY3RlZCB0YWJcclxuICAgICAgICAvLyBIYXNoLnBhcmFtcy50YWIgPSAkKCcubGF5ZXItc3dpdGNoJykuZmluZCgnLmFjdGl2ZSBhJykudGV4dCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gZW5jb2RlVVJJQ29tcG9uZW50KCQucGFyYW0oSGFzaC5wYXJhbXMpKTtcclxuXHJcbiAgICB9LFxyXG4gICAgY2hhbmdlOiBmdW5jdGlvbihCUFJNYXApIHtcclxuICAgIFx0SGFzaC5nZXQoQlBSTWFwKTsgICAgXHRcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNEZXBsb3ltZW50ID0ge307XHJcblxyXG4vL0RlcGxveW1lbnQgbWFwIGxheWVyc1xyXG5sYXllcnNEZXBsb3ltZW50WydGaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMScsXHJcbiAgICBjb2xvcjogJyNGRkU3NzMnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzRGVwbG95bWVudFsnTm8gZml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfbm9uZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnLFxyXG4gICAgY29sb3I6ICcjNkNCQ0Q1JyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzRGVwbG95bWVudDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1Byb3ZpZGVycyA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNQcm92aWRlcnNbJ1plcm8gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIGNvbG9yOiAnI2ZmZmZjYycsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ09uZSBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBjb2xvcjogJyNmZGNjOGEnLFxyXG4gICAgekluZGV4OiAxMlxyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUd28gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJyxcclxuICAgIGNvbG9yOiAnI2ZjOGQ1OScsXHJcbiAgICB6SW5kZXg6IDEzXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1RocmVlIG9yIG1vcmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJyxcclxuICAgIGNvbG9yOiAnI2Q3MzAxZicsXHJcbiAgICB6SW5kZXg6IDE0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1Byb3ZpZGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1NwZWVkID0ge307XHJcblxyXG4vL1NwZWVkIG1hcCBsYXllcnNcclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIHNlcnZpY2VzIG9mIGF0IGxlYXN0IDIwMCBrYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDIwMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDIwMCcsXHJcbiAgICBjb2xvcjogJyNjN2U5YjQnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMCBNYnBzLzEgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwJyxcclxuICAgIGNvbG9yOiAnIzdmY2RiYicsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDI1IE1icHMvMyBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjUnLFxyXG4gICAgY29sb3I6ICcjYmRkN2U3JyxcclxuICAgIHpJbmRleDogMTNcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgNTAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQ1MCcsXHJcbiAgICBjb2xvcjogJyMzMTgyYmQnLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAxMDAgTWJwcy81IE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIGNvbG9yOiAnIzA4MzA2YicsXHJcbiAgICB6SW5kZXg6IDE1XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1NwZWVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzVGVjaCA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNUZWNoWydGVFRQJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2ZpYmVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0NhYmxlIG1vZGVtJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2NhYmxlJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0RTTCAoaW5jLiBGVFROKSwgb3RoZXIgY29wcGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2Fkc2wnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRml4ZWQgd2lyZWxlc3MnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfZncnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnT3RoZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3RlY2hfb3RoZXInLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxNVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNUZWNoO1xyXG4iLCIgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBCUFJNYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xyXG5cclxuICAgIHZhciBNYXBTZWFyY2ggPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5sb2NDaGFuZ2UpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykub24oJ2NsaWNrJywgJ2J1dHRvbicsIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCk7XHJcbiAgICAgICAgICAgICQoJyNidG4tZ2VvTG9jYXRpb24nKS5vbignY2xpY2snLCBNYXBTZWFyY2guZ2VvTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAkKFwiI2J0bi1uYXRpb25Mb2NhdGlvblwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIEJQUk1hcC5tYXAuc2V0VmlldyhbNTAsIC0xMDVdLCAzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2lucHV0LXNlYXJjaC1zd2l0Y2hcIikub24oJ2NsaWNrJywgJ2EnLCBNYXBTZWFyY2guc2VhcmNoX3N3aXRjaCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJylcclxuICAgICAgICAgICAgICAgIC5hdXRvY29tcGxldGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24ocmVxdWVzdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gcmVxdWVzdC50ZXJtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCUFJNYXAuZ2VvY29kZXIucXVlcnkobG9jYXRpb24sIHByb2Nlc3NBZGRyZXNzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NBZGRyZXNzKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBkYXRhLnJlc3VsdHMuZmVhdHVyZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc2VzLnB1c2goZltpXS5wbGFjZV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGFkZHJlc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7IH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLWFsbCcpLmFkZENsYXNzKCd1aS1jb3JuZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci10b3AnKS5hZGRDbGFzcygndWktY29ybmVyLWFsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2gubG9jQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbGF0aXR1ZGUsICNsb25naXR1ZGUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5zZWFyY2hfZGVjaW1hbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvY0NoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSAkKCcjbG9jYXRpb24tc2VhcmNoJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBCUFJNYXAuZ2VvY29kZXIucXVlcnkobG9jLCBjb2RlTWFwKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvZGVNYXAoZXJyLCBkYXRhKSB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0cy5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBhZGRyZXNzIHByb3ZpZGVkIGNvdWxkIG5vdCBiZSBmb3VuZC4gUGxlYXNlIGVudGVyIGEgbmV3IGFkZHJlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBkYXRhLmxhdGxuZ1swXTtcclxuICAgICAgICAgICAgICAgIEJQUk1hcC5sb24gPSBkYXRhLmxhdGxuZ1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX2RlY2ltYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBCUFJNYXAubGF0ID0gJCgnI2xhdGl0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG4gICAgICAgICAgICBCUFJNYXAubG9uID0gJCgnI2xvbmdpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChCUFJNYXAubGF0ID09PSAnJyB8fCBCUFJNYXAubG9uID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciBsYXQvbG9uJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhCUFJNYXAubGF0KSA+IDkwIHx8IE1hdGguYWJzKEJQUk1hcC5sb24pID4gMTgwKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnTGF0L0xvbiB2YWx1ZXMgb3V0IG9mIHJhbmdlJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdlb0xvY2F0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbGF0ID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9fbG9uID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2FjYyA9IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmxhdCA9IE1hdGgucm91bmQoZ2VvX2xhdCAqIDEwMDAwMDApIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5sb24gPSBNYXRoLnJvdW5kKGdlb19sb24gKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnU29ycnksIHlvdXIgY3VycmVudCBsb2NhdGlvbiBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZC4gXFxuUGxlYXNlIHVzZSB0aGUgc2VhcmNoIGJveCB0byBlbnRlciB5b3VyIGxvY2F0aW9uLicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2hfc3dpdGNoOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2ggPT09ICdsb2MnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0FkZHJlc3MnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT09ICdsYXRsb24tZGVjaW1hbCcpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjb29yZC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQ29vcmRpbmF0ZXMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXBTZWFyY2g7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEhhc2ggPSByZXF1aXJlKCcuL2hhc2guanMnKTtcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHJlcXVpcmUoJy4vdGFibGUtcHJvdmlkZXJzLmpzJyk7XHJcbnZhciB0YWJsZURlbW9nID0gcmVxdWlyZSgnLi90YWJsZS1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0RGVtb2cgPSByZXF1aXJlKCcuL2NoYXJ0LWRlbW9ncmFwaGljcy5qcycpO1xyXG52YXIgY2hhcnRGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWQuanMnKTtcclxudmFyIGNoYXJ0TldGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWROYXRpb253aWRlLmpzJyk7XHJcbnZhciBjaGFydFRlY2ggPSByZXF1aXJlKCcuL2NoYXJ0LXRlY2guanMnKTtcclxudmFyIGNoYXJ0U3BlZWQgPSByZXF1aXJlKCcuL2NoYXJ0LXNwZWVkLmpzJyk7XHJcblxyXG52YXIgbGF5ZXJzID0ge1xyXG4gICAgZGVwbG95bWVudDogcmVxdWlyZSgnLi9sYXllcnMtZGVwbG95bWVudC5qcycpLFxyXG4gICAgc3BlZWQ6IHJlcXVpcmUoJy4vbGF5ZXJzLXNwZWVkLmpzJyksXHJcbiAgICBwcm92aWRlcnM6IHJlcXVpcmUoJy4vbGF5ZXJzLXByb3ZpZGVycy5qcycpLFxyXG4gICAgdGVjaG5vbG9neTogcmVxdWlyZSgnLi9sYXllcnMtdGVjaC5qcycpLFxyXG4gICAgdHJpYmFsOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdicHJfdHJpYmFsJyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfdHJpYmFsJyxcclxuICAgICAgICB6SW5kZXg6IDE5XHJcbiAgICB9LFxyXG4gICAgdXJiYW46IHtcclxuICAgICAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgIGxheWVyczogJ2ZjYzpicHJfY291bnR5X2xheWVyX3VyYmFuX29ubHknLFxyXG4gICAgICAgIHN0eWxlczogJ2Jwcl9sYXllcl91cmJhbicsXHJcbiAgICAgICAgekluZGV4OiAyMFxyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGxvY2F0aW9uTWFya2VyO1xyXG52YXIgY2xpY2tlZENvdW50eUxheWVyO1xyXG52YXIgY2xpY2tlZENvdW50eVN0eWxlID0geyBjb2xvcjogJyMwMGYnLCBvcGFjaXR5OiAwLjUsIGZpbGxPcGFjaXR5OiAwLjEsIGZpbGxDb2xvcjogJyNmZmYnLCB3ZWlnaHQ6IDMgfTtcclxudmFyIGNvdW50eUxheWVyRGF0YSA9IHsgJ2ZlYXR1cmVzJzogW10gfTtcclxuXHJcbnZhciBjbGlja2VkQmxvY2tMYXllcjtcclxudmFyIGNsaWNrZWRCbG9ja1N0eWxlID0geyBjb2xvcjogJyMwMDAnLCBvcGFjaXR5OiAwLjUsIGZpbGxPcGFjaXR5OiAwLjEsIGZpbGxDb2xvcjogJyNmZmYnLCB3ZWlnaHQ6IDMgfTtcclxudmFyIGNsaWNrZWRCbG9ja0xheWVyRGF0YTtcclxuXHJcbnZhciBCUFJNYXAgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy8gZGVmYXVsdCBtYXAgc2V0dGluZ3NcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXIgPSB7fTtcclxuICAgICAgICBCUFJNYXAubGF0ID0gMzguODI7XHJcbiAgICAgICAgQlBSTWFwLmxvbiA9IC05NC45NjtcclxuICAgICAgICBCUFJNYXAuem9vbSA9IDQ7XHJcblxyXG4gICAgICAgIC8vIHRyaWdnZXIgaGFzaGNoYW5nZSBhbmQgZ2V0IG1hcCBzZXR0aW5nc1xyXG4gICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIEhhc2guY2hhbmdlKTtcclxuICAgICAgICBIYXNoLmNoYW5nZShCUFJNYXApO1xyXG4gICAgICAgIEJQUk1hcC5jcmVhdGVNYXAoKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcC5vbignY2xpY2snLCBCUFJNYXAudXBkYXRlKTtcclxuXHJcbiAgICAgICAgaWYgKEhhc2guaGFzSGFzaCgpKSB7IFxyXG4gICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIG1hcCBjb250YWluZXIgd2lkdGhcclxuICAgICAgICAkKCcuY29udHJvbC1mdWxsJykub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICQoJ2hlYWRlciAuY29udGFpbmVyLCBoZWFkZXIgLmNvbnRhaW5lci1mbHVpZCwgbWFpbicpXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NvbnRhaW5lciBjb250YWluZXItZmx1aWQnKVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICB2YXIgbWluem9vbSA9IDM7XHJcbiAgICAgICAgdmFyIGJhc2VMYXllciA9IHt9O1xyXG4gICAgICAgIHZhciBsYXllckNvbnRyb2w7XHJcbiAgICAgICAgdmFyIGxheWVyUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpWzFdO1xyXG5cclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXIgPSB7fTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdlb1VSTCA9ICcvZ3djL3NlcnZpY2Uvd21zP3RpbGVkPXRydWUnO1xyXG4gICAgICAgIEJQUk1hcC5nZW9fc3BhY2UgPSAnZmNjJztcclxuICAgICAgICBcclxuICAgICAgICBMLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaVkyOXRjSFYwWldOb0lpd2lZU0k2SW5NeWJsTXlhM2NpZlEuUDh5cHBlc0hraTVxTXl4VGMyQ05MZyc7XHJcbiAgICAgICAgQlBSTWFwLm1hcCA9IEwubWFwYm94Lm1hcCgnbWFwLWNvbnRhaW5lcicsICdmY2Muazc0ZWQ1Z2UnLCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtYXhab29tOiBtYXh6b29tLFxyXG4gICAgICAgICAgICAgICAgbWluWm9vbTogbWluem9vbSxcclxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zZXRWaWV3KFtCUFJNYXAubGF0LCBCUFJNYXAubG9uXSwgQlBSTWFwLnpvb20pO1xyXG5cclxuICAgICAgICBCUFJNYXAubWFwLmF0dHJpYnV0aW9uQ29udHJvbC5hZGRBdHRyaWJ1dGlvbignPGEgaHJlZj1cImh0dHA6Ly9mY2MuZ292XCI+RkNDPC9hPicpO1xyXG5cclxuICAgICAgICAvL2Jhc2UgbGF5ZXJzXHJcbiAgICAgICAgYmFzZUxheWVyLlN0cmVldCA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGVkNWdlJykuYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgYmFzZUxheWVyLlNhdGVsbGl0ZSA9IEwubWFwYm94LnRpbGVMYXllcignZmNjLms3NGQ3bjBnJyk7XHJcbiAgICAgICAgYmFzZUxheWVyLlRlcnJhaW4gPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRjbTNvbCcpO1xyXG5cclxuICAgICAgICAvL2dldCB0aWxlIGxheWVycyBiYXNlZCBvbiBsb2NhdGlvbiBwYXRobmFtZVxyXG4gICAgICAgIGZvciAodmFyIGxheWVyIGluIGxheWVyc1tsYXllclBhdGhdKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXBMYXllcltsYXllcl0gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzW2xheWVyUGF0aF1bbGF5ZXJdKS5zZXRaSW5kZXgobGF5ZXJzW2xheWVyUGF0aF1bbGF5ZXJdLnpJbmRleCkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2FkZCBUcmliYWwgYW5kIFVyYmFuIGxheWVyc1xyXG4gICAgICAgIEJQUk1hcC5tYXBMYXllclsnVHJpYmFsJ10gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzLnRyaWJhbCkuc2V0WkluZGV4KGxheWVycy50cmliYWwuekluZGV4KTtcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXJbJ1VyYmFuJ10gPSBMLnRpbGVMYXllci53bXMoQlBSTWFwLmdlb1VSTCwgbGF5ZXJzLnVyYmFuKS5zZXRaSW5kZXgobGF5ZXJzLnVyYmFuLnpJbmRleCk7XHJcblxyXG4gICAgICAgIC8vbGF5ZXIgY29udHJvbFxyXG4gICAgICAgIGxheWVyQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoXHJcbiAgICAgICAgICAgIGJhc2VMYXllciwge30sIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wbGVmdCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIC8vIGhhc2ggPSBMLmhhc2goQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9jb2RlciA9IEwubWFwYm94Lmdlb2NvZGVyKCdtYXBib3gucGxhY2VzLXYxJyk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5jcmVhdGVMZWdlbmQobGF5ZXJQYXRoKTtcclxuXHJcbiAgICAgICAgY2hhcnROV0ZpeGVkLmluaXQoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoSGFzaC5oYXNIYXNoKCkgPT09IGZhbHNlKSB7IFxyXG4gICAgICAgICAgICBjaGFydFNwZWVkLmluaXQoJ253Jyk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcblxyXG4gICAgfSwgLy9lbmQgY3JlYXRlTWFwXHJcbiAgICBjcmVhdGVMZWdlbmQ6IGZ1bmN0aW9uKGxheWVyUGF0aCkge1xyXG4gICAgICAgIHZhciB0ZCA9ICcnO1xyXG4gICAgICAgIHZhciB0ciA9ICcnO1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICB0ZCArPSAnPHRkPjxpbnB1dCBpZD1cImNoaycgKyBjb3VudCArICdcIiB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWxheWVyPVwiJyArIGtleSArICdcIiBjaGVja2VkPjwvdGQ+JztcclxuICAgICAgICAgICAgdGQgKz0gJzx0ZD48ZGl2IGNsYXNzPVwia2V5LXN5bWJvbFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjonICsgbGF5ZXJzW2xheWVyUGF0aF1ba2V5XS5jb2xvciArICdcIj48L2Rpdj48L3RkPic7XHJcbiAgICAgICAgICAgIHRkICs9ICc8dGQ+PGxhYmVsIGZvcj1cImNoaycgKyBjb3VudCArICdcIj4nICsga2V5ICsgJzwvbGFiZWw+PC90ZD4nO1xyXG4gICAgICAgICAgICB0ciArPSAnPHRyPicgKyB0ZCArICc8L3RyPic7XHJcbiAgICAgICAgICAgIHRkID0gJyc7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcubWFwLWxlZ2VuZCcpXHJcbiAgICAgICAgICAgIC5maW5kKCd0Ym9keScpLnByZXBlbmQodHIpXHJcbiAgICAgICAgICAgIC5lbmQoKVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJ1t0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxheWVyTmFtZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXllcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwTGF5ZXJbbGF5ZXJOYW1lXS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihCUFJNYXAubWFwTGF5ZXJbbGF5ZXJOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGUpIHsgICAgICAgXHJcbiAgICAgICAgQlBSTWFwLmxhdCA9IE1hdGgucm91bmQoMTAwMDAwMCAqIGUubGF0bG5nLmxhdCkgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgQlBSTWFwLmxvbiA9IE1hdGgucm91bmQoMTAwMDAwMCAqIGUubGF0bG5nLmxuZykgLyAxMDAwMDAwLjA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgICAgICAgIFxyXG5cclxuICAgIH0sIC8vZW5kIHVwZGF0ZVxyXG4gICAgZ2V0Q291bnR5OiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5Jm1heEZlYXR1cmVzPTEmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dDb3VudHlcclxuICAgICAgICB9KTtcclxuICAgIH0sIC8vZW5kIGdldENvdW50eVxyXG4gICAgc2hvd0NvdW50eTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBjb3VudHlEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50eV90ZXh0ID0gJ05vIGNvdW50eSBkYXRhIGZvdW5kIGF0IHlvdXIgc2VhcmNoZWQvY2xpY2tlZCBsb2NhdGlvbi4nO1xyXG4gICAgICAgICAgICAvLyAkKCcjZGlzcGxheS1jb3VudHknKS5odG1sKGNvdW50eV90ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgkKCcjdGFiSW5zdHJ1Y3RzJykuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICQoJyN0YWJJbnN0cnVjdHMsICNud0ZpeGVkJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNmaXhlZCwgI3Byb3ZpZGVyLCAjZGVtb2dyYXBoaWNzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gZGF0YS5mZWF0dXJlc1swXS5pZC5yZXBsYWNlKC9cXC4uKiQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmIChpZCAhPT0gJ2Jwcl9kZWMyMDE2X2NvdW50eScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRDb3VudHlMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQ291bnR5TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoZGF0YSkuc2V0U3R5bGUoY2xpY2tlZENvdW50eVN0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG5cclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydERlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLmluaXQoY291bnR5RGF0YS5jb3VudHlfZmlwcyk7XHJcbiAgICAgICAgY2hhcnRUZWNoLmluaXQoY291bnR5RGF0YS5jb3VudHlfZmlwcyk7XHJcbiAgICAgICAgY2hhcnRTcGVlZC5pbml0KGNvdW50eURhdGEuY291bnR5X2ZpcHMpO1xyXG5cclxuICAgIH0sIC8vZW5kIHNob3dDb3VudHlcclxuICAgIGdldEJsb2NrOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogQlBSTWFwLnNob3dCbG9ja1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNob3dCbG9jazogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBibG9ja0RhdGEgPSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXM7XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRCbG9ja0xheWVyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRCbG9ja0xheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKGNsaWNrZWRCbG9ja0xheWVyRGF0YSkuc2V0U3R5bGUoY2xpY2tlZEJsb2NrU3R5bGUpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuc2V0TG9jYXRpb25NYXJrZXIoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLWZpcHNdJykudGV4dChibG9ja0RhdGEuYmxvY2tfZmlwcyk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxdJykudGV4dChibG9ja0RhdGEudXJiYW5fcnVyYWwgPT09ICdSJyA/ICdSdXJhbCcgOiAnVXJiYW4nKTtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgUHJvdmlkZXJzIHRhYmxlXHJcbiAgICAgICAgdGFibGVQcm92aWRlcnMuZ2V0RGF0YShibG9ja0RhdGEuYmxvY2tfZmlwcyk7XHJcblxyXG4gICAgICAgIEhhc2gudXBkYXRlKEJQUk1hcCk7XHJcbiAgICB9LFxyXG4gICAgc2V0TG9jYXRpb25NYXJrZXI6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIobG9jYXRpb25NYXJrZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIobG9jYXRpb25NYXJrZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2NhdGlvbk1hcmtlciA9IEwubWFya2VyKFtsYXQsIGxvbl0sIHsgdGl0bGU6ICcnIH0pLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBsb2NhdGlvbk1hcmtlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC56b29tVG9CbG9jaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHpvb21Ub0Jsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5maXRCb3VuZHMoY2xpY2tlZEJsb2NrTGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsgLy9lbmQgTWFwTGF5ZXJzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJQUk1hcDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuL3V0aWxpdHkuanMnKTtcclxuXHJcbnZhciB0YWJsZURlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihjb3VudHlEYXRhKSB7XHJcbiAgICBcdHZhciBwb3BEYXRhID0ge1xyXG5cdFx0XHRjb3VudHlfbmFtZTogY291bnR5RGF0YS5jb3VudHlfbmFtZSxcclxuXHRcdFx0c3RhdGVfYWJicjogY291bnR5RGF0YS5zdGF0ZV9hYmJyLFxyXG5cdFx0XHRwb3AyMDE1OiBjb3VudHlEYXRhLnBvcDIwMTUsXHJcblx0XHRcdHBvcGRlbnNpdHk6IGNvdW50eURhdGEucG9wZGVuc2l0eSxcclxuXHRcdFx0cGVyY2FwaW5jOiBjb3VudHlEYXRhLnBlcmNhcGluYyxcclxuXHRcdFx0dW5zcG9wMjVfMzogY291bnR5RGF0YS51bnNwb3AyNV8zLFxyXG5cdFx0XHRwZXJfdXJiYW5ub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl91cmJhbm5vZml4ZWQsXHJcblx0XHRcdHBlcl9ydXJhbG5vZml4ZWQ6IGNvdW50eURhdGEucGVyX3J1cmFsbm9maXhlZFxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKHZhciBwcm9wTmFtZSBpbiBwb3BEYXRhKSB7XHJcblx0XHRcdGlmICh1dGlsaXR5LmlzTnVsbChwb3BEYXRhW3Byb3BOYW1lXSkpIHtcclxuXHRcdFx0XHRwb3BEYXRhW3Byb3BOYW1lXSA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgQ2Vuc3VzIEJsb2NrIHRhYmxlXHJcbiAgICAgICAgJCgnW2RhdGEtY291bnR5XScpLnRleHQocG9wRGF0YS5jb3VudHlfbmFtZSk7XHJcbiAgICAgICAgJCgnW2RhdGEtc3RhdGVdJykudGV4dChwb3BEYXRhLnN0YXRlX2FiYnIpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcDIwMTUpKTtcclxuICAgICAgICAkKCdbZGF0YS1wb3BEZW5zaXR5XScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBvcGRlbnNpdHkpKTtcclxuICAgICAgICAkKCdbZGF0YS1pbmNvbWVDYXBpdGFdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEucGVyY2FwaW5jKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdG90YWxQb3BOb0FjY2Vzc10nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS51bnNwb3AyNV8zKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtdXJiYW5Qb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfdXJiYW5ub2ZpeGVkKSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcnVyYWxQb3BdJykudGV4dCh1dGlsaXR5LmZvcm1hdFBlcmNlbnQocG9wRGF0YS5wZXJfcnVyYWxub2ZpeGVkKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlRGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgY29sdW1ucyA9IFtcclxuICAgIHsgJ2RhdGEnOiAnYXZlcG9wJywgJ3dpZHRoJzogJzIwJScgfSxcclxuICAgIHsgJ2RhdGEnOiAnYXZlZGVuc2l0eScsICd3aWR0aCc6ICcyMCUnIH0sXHJcbiAgICB7ICdkYXRhJzogJ3BlcmNhcGl0YScsICd3aWR0aCc6ICcyMCUnIH0sXHJcbiAgICB7ICdkYXRhJzogJ2hvdXNlaG9sZCcsICd3aWR0aCc6ICcyMCUnIH0sXHJcbiAgICB7ICdkYXRhJzogJ3BvdmVydHknLCAnd2lkdGgnOiAnMjAlJyB9XHJcbl07XHJcblxyXG52YXIgcm93VGl0bGVzID0gWydXaXRob3V0IEFjY2VzcycsICdXaXRoIEFjY2VzcyddO1xyXG5cclxudmFyIHRhYmxlTldBdmUgPSB7XHJcbiAgICBnZXREYXRhOiBmdW5jdGlvbihibG9ja0ZpcHMpIHtcclxuICAgICAgICB2YXIgbndBdmVVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9ud19hdmVyYWdlJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICdhamF4Jzoge1xyXG4gICAgICAgICAgICAgICAgJ3VybCc6IG53QXZlVVJMLFxyXG4gICAgICAgICAgICAgICAgJ2NvbXBsZXRlJzogYWRkQ29scyxcclxuICAgICAgICAgICAgICAgICdkYXRhU3JjJzogdGFibGVOV0F2ZS5jcmVhdGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2JTb3J0JzogZmFsc2UsXHJcbiAgICAgICAgICAgICdjb2x1bW5zJzogY29sdW1ucyxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyAnb3JkZXInOiBbXHJcbiAgICAgICAgICAgIC8vICAgICBbMCwgJ2FzYyddXHJcbiAgICAgICAgICAgIC8vIF0sXHJcbiAgICAgICAgICAgICdwYWdpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3NlYXJjaGluZyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyAnc2Nyb2xsWSc6ICcyODBweCcsXHJcbiAgICAgICAgICAgIC8vICdzY3JvbGxDb2xsYXBzZSc6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZENvbHMoKSB7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJChlbG0pLmhhc0NsYXNzKCdvZGQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxtKS5wcmVwZW5kKCc8dGggY2xhc3M9XCJyb3dIZWFkaW5nXCI+V2l0aG91dCBBY2Nlc3M8L3RoPicpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsbSkucHJlcGVuZCgnPHRoIGNsYXNzPVwicm93SGVhZGluZ1wiPldpdGggQWNjZXNzPC90aD4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI3RhYmxlLW53QXZlJykuZmluZCgndGJvZHk+dHInKS5wcmVwZW5kKCc8dGg+PC90aD4nKTtcclxuICAgICAgICAgICAgJCgnI3RhYmxlLW53QXZlJykuZmluZCgndGJvZHk+dHInKS5lcSgwKS5iZWZvcmUoJzx0cj48dGggY29sc3Bhbj1cIjdcIj5Vbml0ZWQgU3RhdGVzIChBbGwgQXJlYXMpPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDIpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCI+UnVyYWwgQXJlYXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoNSkuYWZ0ZXIoJzx0cj48dGggY2xhc3M9XCJzdWJIZWFkaW5nXCIgY29sc3Bhbj1cIjdcIj5VcmJhbiBBcmVhczwvdGg+PC90cj4nKTtcclxuXHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoOCkuYWZ0ZXIoJzx0cj48dGggY29sc3Bhbj1cIjdcIj5UcmliYWwgTGFuZHM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoMTEpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCI+UnVyYWwgQXJlYXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoMTQpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCI+VXJiYW4gQXJlYXM8L3RoPjwvdHI+Jyk7XHJcblxyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDE3KS5hZnRlcignPHRyPjx0aCBjb2xzcGFuPVwiN1wiPlUuUy4gVGVycml0b3JpZXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoMjApLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCI+UnVyYWwgQXJlYXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoMjMpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCI+VXJiYW4gQXJlYXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgcG9wRGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuICAgICAgICB2YXIgdGVtcERhdGEgPSBbXTtcclxuICAgICAgICB2YXIgdGVtcE9iaiA9IHt9O1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cFByZWZpeCA9IFsndXNfYXZnJywgJ3VzX3J1cmFsX2F2ZycsICd1c191cmJhbl9hdmcnLCAndHJpYmFsX2F2ZycsICd0cmliYWxfcnVyYWxfYXZnJywgJ3RyaWJhbF91cmJhbl9hdmcnLCAndGVycl9hdmcnLCAndGVycl9ydXJhbF9hdmcnLCAndGVycl91cmJhbl9hdmcnXTtcclxuXHJcbiAgICAgICAgdmFyIGdyb3VwVyA9IFsncG9wX3cnLCAncG9wZGVuX3cnLCAncGVyY2FwX3cnLCAnaGluY193JywgJ3BvdnJhdF93J107XHJcbiAgICAgICAgdmFyIGdyb3VwV28gPSBbJ3BvcF93bycsICdwb3BkZW5fd28nLCAncGVyY2FwX3dvJywgJ2hpbmNfd28nLCAncG92cmF0X3dvJ107XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHMoYXJyKSB7XHJcbiAgICAgICAgICAgIHRlbXBPYmogPSB7fTtcclxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BOYW1lID0gZ3JvdXBQcmVmaXhbaV0gKyAnXycgKyBhcnJbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgY29sTmFtZSA9IGNvbHVtbnNbal0uZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2NvbE5hbWVdID0gcG9wRGF0YVtwcm9wTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBncm91cFByZWZpeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnZXRWYWxzKGdyb3VwV28pO1xyXG4gICAgICAgICAgICB0ZW1wRGF0YS5wdXNoKHRlbXBPYmopO1xyXG4gICAgICAgICAgICBnZXRWYWxzKGdyb3VwVyk7XHJcbiAgICAgICAgICAgIHRlbXBEYXRhLnB1c2godGVtcE9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlTldBdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHtcclxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGJsb2NrRmlwcykge1xyXG4gICAgICAgIHZhciBwcm92aWRlcnNVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfcHJvdmlkZXJzJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWJsb2NrX2ZpcHM9JTI3JyArIGJsb2NrRmlwcyArICclMjcnO1xyXG5cclxuICAgICAgICAkKCcjdGFibGUtcHJvdmlkZXJzJykuRGF0YVRhYmxlKHtcclxuICAgICAgICAgICAgJ2FqYXgnOiB7XHJcbiAgICAgICAgICAgICAgICAndXJsJzogcHJvdmlkZXJzVVJMLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGFTcmMnOiB0YWJsZVByb3ZpZGVycy5jcmVhdGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3Byb3ZpZGVyTmFtZScgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAndGVjaCcgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAnc3BlZWREb3duJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZFVwJyB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdkZXN0cm95JzogdHJ1ZSxcclxuICAgICAgICAgICAgJ2luZm8nOiBmYWxzZSxcclxuICAgICAgICAgICAgJ29yZGVyJzogW1xyXG4gICAgICAgICAgICAgICAgWzAsICdhc2MnXVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAncGFnaW5nJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdzZWFyY2hpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3Njcm9sbFknOiAnMjgwcHgnLFxyXG4gICAgICAgICAgICAnc2Nyb2xsQ29sbGFwc2UnOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBwcm92aWRlckRhdGEgPSBkYXRhLmZlYXR1cmVzO1xyXG4gICAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3ZpZGVyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0ZW1wRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdwcm92aWRlck5hbWUnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kYmFuYW1lLFxyXG4gICAgICAgICAgICAgICAgJ3RlY2gnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy50ZWNobm9sb2d5LFxyXG4gICAgICAgICAgICAgICAgJ3NwZWVkRG93bic6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRvd25sb2FkX3NwZWVkLFxyXG4gICAgICAgICAgICAgICAgJ3NwZWVkVXAnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy51cGxvYWRfc3BlZWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHtcclxuICAgIGlzTnVsbDogZnVuY3Rpb24oZmllbGROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkTmFtZSA9PT0gbnVsbDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRDb21tYTogZnVuY3Rpb24obnVtKSB7XHJcbiAgICAgICAgdmFyIHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcclxuICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJy4nKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRQZXJjZW50OiBmdW5jdGlvbihudW0pIHtcclxuICAgICAgICByZXR1cm4gKG51bSAqIDEwMCkudG9GaXhlZCgyKSArICclJztcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXRpbGl0eTtcclxuIl19
