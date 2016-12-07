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
layersProviders['No fixed 25 Mbps/3 Mbps providers'] = {
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

//Technology map layers
layersTech['No fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_dec2016_numprov_0',
    styles: 'bpr_dec2016_numprov_0',
    color: '#ffffcc',
    zIndex: 11
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvbWFpbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtZml4ZWROYXRpb253aWRlLmpzIiwicHVibGljL2pzL21vZHVsZXMvY2hhcnQtc3BlZWQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9jaGFydC10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvaGFzaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1kZXBsb3ltZW50LmpzIiwicHVibGljL2pzL21vZHVsZXMvbGF5ZXJzLXByb3ZpZGVycy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy1zcGVlZC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2xheWVycy10ZWNoLmpzIiwicHVibGljL2pzL21vZHVsZXMvbWFwLXNlYXJjaC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL21hcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLWRlbW9ncmFwaGljcy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL3RhYmxlLW53QXZlLmpzIiwicHVibGljL2pzL21vZHVsZXMvdGFibGUtcHJvdmlkZXJzLmpzIiwicHVibGljL2pzL21vZHVsZXMvdXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBCUFJNYXAgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwLmpzJyk7XHJcbiAgICB2YXIgTWFwU2VhcmNoID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC1zZWFyY2guanMnKTtcclxuICAgIHZhciB0YWJsZU5XQXZlID0gcmVxdWlyZSgnLi9tb2R1bGVzL3RhYmxlLW53QXZlLmpzJyk7XHJcblxyXG4gICAgaWYgKCQoJyNtYXAnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgQlBSTWFwLmluaXQoKTtcclxuICAgICAgICBNYXBTZWFyY2guaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcjdGFibGUtbndBdmUnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGFibGVOV0F2ZS5nZXREYXRhKCk7XHJcbiAgICB9XHJcblxyXG59KCkpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY2hhcnRPcHRzID0ge1xyXG4gICAgbGFiZWxzOiBbXHJcbiAgICAgICAgJ1VyYmFuJyxcclxuICAgICAgICAnUnVyYWwnXHJcbiAgICBdLFxyXG4gICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICcjM0Q1OUQ3JyxcclxuICAgICAgICAgICAgJyM3MURBRDYnXHJcbiAgICAgICAgXVxyXG4gICAgfV1cclxufTtcclxuXHJcbnZhciBjaGFydERlbW9nID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRvbnV0O1xyXG4gICAgICAgIHZhciBjdHhEZW1vZyA9ICQoJyNjaGFydERlbW9nJyk7XHJcbiAgICAgICAgdmFyIGNoYXJ0VmFscyA9IFtdO1xyXG5cclxuICAgICAgICBjaGFydFZhbHMucHVzaChkYXRhLnBlcl91cmJhbm5vZml4ZWQpO1xyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKGRhdGEucGVyX3J1cmFsbm9maXhlZCk7XHJcblxyXG4gICAgICAgIGNoYXJ0T3B0cy5kYXRhc2V0c1swXS5kYXRhID0gY2hhcnRWYWxzO1xyXG5cclxuICAgICAgICBpZiAoJCgnI2NoYXJ0RGVtb2cnKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBkb251dCA9IG5ldyBDaGFydChjdHhEZW1vZywge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0T3B0cyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0RGVtb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydEZpeGVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydEZpeGVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydBbGwnLCAnVXJiYW4nLCAnUnVyYWwnLCAnVHJpYmFsJ10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdGaXhlZCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTm8gRml4ZWQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNkNCQ0Q1J1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc2hvdyBDb3VudHkgRml4ZWQgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydEZpeGVkJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRGaXhlZC5GSVBTKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLkZJUFMgPSBjb3VudHlfZmlwcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJ0Rml4ZWQuZ2V0Q291bnR5RGF0YShjb3VudHlfZmlwcyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q291bnR5RGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFsbENudHlVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfY291bnR5X2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRGaXhlZC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGFsbENudHlVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZ2V0VVJEYXRhKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VVJEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9jb3VudHlfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydEZpeGVkLkZJUFMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC5wcm9jZXNzVVJEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLmdldFRyaWJhbERhdGEoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRUcmliYWxEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdHJpYmFsVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfY291bnR5X3RyaWJhbF9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0Rml4ZWQuRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiB0cmliYWxVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZGlzcGxheSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NVUkRhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGRhdGFMZW4gPSBkYXRhLmZlYXR1cmVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdmFyIHVyYmFuRGF0YSA9IHt9O1xyXG4gICAgICAgIHZhciBydXJhbERhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgdXJiYW5EYXRhLmZlYXR1cmVzID0gW107XHJcbiAgICAgICAgcnVyYWxEYXRhLmZlYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgIGZvciAoaTsgaSA8IGRhdGFMZW47IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy51cmJhbl9ydXJhbCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnVSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJiYW5EYXRhLmZlYXR1cmVzLnB1c2goZGF0YS5mZWF0dXJlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUodXJiYW5EYXRhKTtcclxuICAgICAgICBjaGFydEZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG5cclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0Rml4ZWQuZGF0YS5kYXRhc2V0c1sxXS5kYXRhO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5oYXNfZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN0eEZpeGVkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRGaXhlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRGaXhlZFwiIHdpZHRoPVwiMzUwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjdHhGaXhlZCA9ICQoJyNjaGFydEZpeGVkJyk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5jaGFydCA9IG5ldyBDaGFydChjdHhGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRGaXhlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHhBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdBcmVhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ1BvcHVsYXRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtcy5kYXRhc2V0SW5kZXhdLmxhYmVsICsgJzogJyArIHRvb2x0aXBJdGVtcy55TGFiZWwgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRGaXhlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0TldGaXhlZCA9IHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBsYWJlbHM6IFsnQWxsJywgJ1VyYmFuJywgJ1J1cmFsJywgJ1RyaWJhbCddLFxyXG4gICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICBsYWJlbDogJ0ZpeGVkJyxcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkU3NzMnXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBsYWJlbDogJ05vIEZpeGVkJyxcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyM2Q0JDRDUnXHJcbiAgICAgICAgfV1cclxuICAgIH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL3Nob3cgTmF0aW9ud2lkZSBjaGFydCBpZiBpdCBleGlzdHMgb24gdGhlIHBhZ2VcclxuICAgICAgICBpZiAoJCgnI2NoYXJ0TldGaXhlZCcpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQuZ2V0TldEYXRhKCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0TldEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbndVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1mY2M6YnByX2RlYzIwMTZfbndfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IG53VVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IFxyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5nZXRVcmJhbkRhdGEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFVyYmFuRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHVyYmFuVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfbndfdXJfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHVyYmFuVVJMLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQucHJvY2Vzc1VSRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5nZXRUcmliYWwoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRUcmliYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmliYWxVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9ud190cmliYWxfZm5mJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRyaWJhbFVSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBwcm9jZXNzVVJEYXRhOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHZhciBkYXRhTGVuID0gZGF0YS5mZWF0dXJlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1cmJhbkRhdGEgPSB7fTtcclxuICAgICAgICB2YXIgcnVyYWxEYXRhID0ge307XHJcblxyXG4gICAgICAgIHVyYmFuRGF0YS5mZWF0dXJlcyA9IFtdOyAgICAgICBcclxuICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChpOyBpIDwgZGF0YUxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnVyYmFuX3J1cmFsKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxyXG4gICAgICAgICAgICAgICAgICAgIHJ1cmFsRGF0YS5mZWF0dXJlcy5wdXNoKGRhdGEuZmVhdHVyZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQudXBkYXRlKHVyYmFuRGF0YSk7XHJcbiAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBmaXhlZERhdGEgPSBjaGFydE5XRml4ZWQuZGF0YS5kYXRhc2V0c1swXS5kYXRhO1xyXG4gICAgICAgIHZhciBub0ZpeGVkRGF0YSA9IGNoYXJ0TldGaXhlZC5kYXRhLmRhdGFzZXRzWzFdLmRhdGE7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaCgwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuaGFzX2ZpeGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0ZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhOV0ZpeGVkID0gJCgnI2NoYXJ0TldGaXhlZCcpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRcclxuICAgICAgICBjaGFydE5XRml4ZWQuY2hhcnQgPSBuZXcgQ2hhcnQoY3R4TldGaXhlZCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnROV0ZpeGVkLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ0FyZWEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnUG9wdWxhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtcywgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1zLmRhdGFzZXRJbmRleF0ubGFiZWwgKyAnOiAnICsgdG9vbHRpcEl0ZW1zLnlMYWJlbCArICclJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydE5XRml4ZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydFNwZWVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydFNwZWVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWycuMjAwJywgJzEwJywgJzI1JywgJzUwJywgJzEwMCddLFxyXG4gICAgICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnMCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgOTksIDEzMiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJzEnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1NCwgMTYyLCAyMzUsIDAuOSknLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcyJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyMDYsIDg2LCAwLjkpJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnMycsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDc1LCAxOTIsIDE5MiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vb25seSBzaG93IGNoYXJ0IGlmIGl0IGV4aXN0cyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIGlmICgkKCcjY2hhcnRTcGVlZCcpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2lmIGNvdW50eSBGSVBTIGlzIHRoZSBzYW1lIGRvbid0IHJlZ2VuZXJhdGUgY2hhcnRcclxuICAgICAgICBpZiAoY291bnR5X2ZpcHMgPT09IGNoYXJ0U3BlZWQuRklQUykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hhcnRTcGVlZC5GSVBTID0gY291bnR5X2ZpcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydFNwZWVkLmdldFRlY2goKTtcclxuICAgIH0sXHJcbiAgICBnZXRUZWNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BlZWRVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9yZWZyZXNoX2NvdW50eSZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb3VudHlfZmlwcz0lMjcnICsgY2hhcnRTcGVlZC5GSVBTICsgJyUyNyc7XHJcbiAgICAgICAgdmFyIHNwZWVkTldVUkwgPSAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfZGVjMjAxNl9yZWZyZXNoX25hdGlvbiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24nO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBjaGFydFNwZWVkLkZJUFMgPT09ICdudycgPyBzcGVlZE5XVVJMIDogc3BlZWRVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0U3BlZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRTcGVlZC5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sICAgIFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHRlY2hEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciB0ZWNoVHlwZXMgPSBbJzIwMCcsICcxMCcsICcyNScsICc1MCcsICcxMDAnXTtcclxuICAgICAgICB2YXIgZGF0YXNldHMgPSBjaGFydFNwZWVkLmRhdGEuZGF0YXNldHM7XHJcblxyXG4gICAgICAgIHZhciBwcm9wTmFtZSA9ICcnO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHMoYXJyKSB7IFxyXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2hhcnRTcGVlZC5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7IFxyXG4gICAgICAgICAgICAgICAgcHJvcE5hbWUgPSAnc3BlZWRfJyArIHRlY2hUeXBlc1tpXSArICdfJyArIGo7XHJcbiAgICAgICAgICAgICAgICBkYXRhc2V0c1tqXS5kYXRhLnB1c2goKDEwMCAqIHRlY2hEYXRhW3Byb3BOYW1lXSkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0ZWNoVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2V0VmFscyh0ZWNoVHlwZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN0eFRlY2g7XHJcblxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnRTcGVlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRTcGVlZFwiIHdpZHRoPVwiMzUwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBpZiAoY2hhcnRTcGVlZC5GSVBTID09PSAnbncnKSB7XHJcbiAgICAgICAgICAgICQoJyNoZC1zcGVlZCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNoZC1ud1NwZWVkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcjaGQtbndTcGVlZCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNoZC1zcGVlZCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBjaGFydFxyXG4gICAgICAgIGN0eFRlY2ggPSAkKCcjY2hhcnRTcGVlZCcpO1xyXG4gICAgICAgIGNoYXJ0U3BlZWQuY2hhcnQgPSBuZXcgQ2hhcnQoY3R4VGVjaCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRTcGVlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94V2lkdGg6IDIwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ1NwZWVkIChNYnBzLzEgTWJwcyknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnJSBQb3B1bGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZnVuY3Rpb24odG9vbHRpcEl0ZW0sIGRhdGEpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1NwZWVkOiAnICsgdG9vbHRpcEl0ZW1bMF0ueExhYmVsICsgJ01icHMvMSBNYnBzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyMgUHJvdmlkZXJzOiAnICsgZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlckxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdQb3B1bGF0aW9uOiAnICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0U3BlZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydFRlY2ggPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihjb3VudHlfZmlwcykge1xyXG4gICAgICAgIGNoYXJ0VGVjaC5kYXRhID0ge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFsnMCcsICcxJywgJzInLCAnMyddLFxyXG4gICAgICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQURTTCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgOTksIDEzMiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NhYmxlJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoNTQsIDE2MiwgMjM1LCAwLjkpJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnRmliZXInLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDIwNiwgODYsIDAuOSknLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdPdGhlcicsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDc1LCAxOTIsIDE5MiwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0ZXJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMTUzLCAxMDIsIDI1NSwgMC45KScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vb25seSBzaG93IGNoYXJ0IGlmIGl0IGV4aXN0cyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIGlmICgkKCcjY2hhcnRUZWNoJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgY291bnR5IEZJUFMgaXMgdGhlIHNhbWUgZG9uJ3QgcmVnZW5lcmF0ZSBjaGFydFxyXG4gICAgICAgIGlmIChjb3VudHlfZmlwcyA9PT0gY2hhcnRUZWNoLkZJUFMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoYXJ0VGVjaC5GSVBTID0gY291bnR5X2ZpcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydFRlY2guZ2V0VGVjaCgpO1xyXG4gICAgfSxcclxuICAgIGdldFRlY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ZWNoVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfcmVmcmVzaF9jb3VudHkmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0VGVjaC5GSVBTICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRlY2hVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0VGVjaC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydFRlY2guZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAgICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuICAgICAgICB2YXIgdGVjaFR5cGVzID0gWydhZHNsJywgJ2NhYmxlJywgJ2ZpYmVyJywgJ290aGVyJywgJ2Z3J107XHJcbiAgICAgICAgdmFyIGRhdGFzZXRzID0gY2hhcnRUZWNoLmRhdGEuZGF0YXNldHM7XHJcblxyXG4gICAgICAgIHZhciBwcm9wTmFtZSA9ICcnO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHMoYXJyKSB7XHJcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaGFydFRlY2guZGF0YS5sYWJlbHMubGVuZ3RoOyBqKyspIHsgXHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZSA9ICd0ZWNoXycgKyB0ZWNoVHlwZXNbaV0gKyAnXycgKyBqO1xyXG4gICAgICAgICAgICAgICAgZGF0YXNldHNbaV0uZGF0YS5wdXNoKCgxMDAgKiB0ZWNoRGF0YVtwcm9wTmFtZV0pLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGVjaFR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdldFZhbHModGVjaFR5cGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhUZWNoO1xyXG5cclxuICAgICAgICAvL3JlcGxhY2UgY2hhcnQgY2FudmFzIGlmIGl0IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgJCgnI2NoYXJ0VGVjaCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnRUZWNoXCIgd2lkdGg9XCIzNTBcIiBoZWlnaHQ9XCIyMjBcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAkKCcuY2hhcnRqcy1oaWRkZW4taWZyYW1lJykucmVtb3ZlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jcmVhdGUgbmV3IGNoYXJ0XHJcbiAgICAgICAgY3R4VGVjaCA9ICQoJyNjaGFydFRlY2gnKTtcclxuICAgICAgICBjaGFydFRlY2guY2hhcnQgPSBuZXcgQ2hhcnQoY3R4VGVjaCwge1xyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnRUZWNoLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hXaWR0aDogMjBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJyMgb2YgUHJvdmlkZXJzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICclIFBvcHVsYXRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnIyBvZiBQcm92aWRlcnM6ICcgKyB0b29sdGlwSXRlbVswXS54TGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbCArICc6ICcgKyB0b29sdGlwSXRlbS55TGFiZWwgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRUZWNoO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgSGFzaCA9IHtcclxuICAgIHBhcmFtczoge30sXHJcbiAgICBoYXNIYXNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhhc2ggPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9LCBcclxuICAgIGdldDogZnVuY3Rpb24oQlBSTWFwKSB7XHJcbiAgICAgICAgdmFyIGhhc2ggPSBkZWNvZGVVUklDb21wb25lbnQobG9jYXRpb24uaGFzaCk7XHJcblxyXG4gICAgICAgIC8vbWFwIGxhdCwgbG9uLCB6b29tXHJcbiAgICAgICAgdmFyIGxhdEhhc2ggPSBoYXNoLm1hdGNoKC9sYXQ9KFteJl0rKS9pKTtcclxuICAgICAgICB2YXIgbG9uSGFzaCA9IGhhc2gubWF0Y2goL2xvbj0oW14mXSspL2kpO1xyXG4gICAgICAgIHZhciB6b29tSGFzaCA9IGhhc2gubWF0Y2goL3pvb209KFteJl0rKS9pKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmxhdCA9IGxhdEhhc2ggPT09IG51bGwgPyBCUFJNYXAubGF0IDogZGVjb2RlVVJJQ29tcG9uZW50KGxhdEhhc2hbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XHJcbiAgICAgICAgQlBSTWFwLmxvbiA9IGxvbkhhc2ggPT09IG51bGwgPyBCUFJNYXAubG9uIDogZGVjb2RlVVJJQ29tcG9uZW50KGxvbkhhc2hbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XHJcbiAgICAgICAgQlBSTWFwLnpvb20gPSB6b29tSGFzaCA9PT0gbnVsbCA/IEJQUk1hcC56b29tIDogZGVjb2RlVVJJQ29tcG9uZW50KHpvb21IYXNoWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpO1xyXG5cclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKEJQUk1hcCkge1xyXG5cclxuICAgICAgICAvL21hcCBsYXQsIGxvbiwgem9vbVxyXG4gICAgICAgIEJQUk1hcC56b29tID0gQlBSTWFwLm1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgSGFzaC5wYXJhbXMubGF0ID0gQlBSTWFwLmxhdDtcclxuICAgICAgICBIYXNoLnBhcmFtcy5sb24gPSBCUFJNYXAubG9uO1xyXG4gICAgICAgIEhhc2gucGFyYW1zLnpvb20gPSBCUFJNYXAuem9vbTtcclxuXHJcbiAgICAgICAgLy9zZWxlY3RlZCBtYXAgbGF5ZXJzXHJcbiAgICAgICAgLyokKCcubWFwLWxlZ2VuZCcpLmZpbmQoJzpjaGVja2VkJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcclxuICAgICAgICAgICAgSGFzaC5wYXJhbXNbJ2xheWVyJyArIGluZGV4XSA9ICQoZWwpLmF0dHIoJ2RhdGEtbGF5ZXInKTtcclxuICAgICAgICB9KTsqL1xyXG5cclxuICAgICAgICAvL3NlbGVjdGVkIGJhc2UgbGF5ZXJcclxuICAgICAgICAvLyBIYXNoLnBhcmFtcy5iYXNlTGF5ZXIgPSAkKCcubGVhZmxldC1jb250cm9sLWxheWVycy1iYXNlJykuZmluZCgnOmNoZWNrZWQnKS5uZXh0KCdzcGFuJykudGV4dCgpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgLy9zZWxlY3RlZCB0YWJcclxuICAgICAgICAvLyBIYXNoLnBhcmFtcy50YWIgPSAkKCcubGF5ZXItc3dpdGNoJykuZmluZCgnLmFjdGl2ZSBhJykudGV4dCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gZW5jb2RlVVJJQ29tcG9uZW50KCQucGFyYW0oSGFzaC5wYXJhbXMpKTtcclxuXHJcbiAgICB9LFxyXG4gICAgY2hhbmdlOiBmdW5jdGlvbihCUFJNYXApIHtcclxuICAgIFx0SGFzaC5nZXQoQlBSTWFwKTsgICAgXHRcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNEZXBsb3ltZW50ID0ge307XHJcblxyXG4vL0RlcGxveW1lbnQgbWFwIGxheWVyc1xyXG5sYXllcnNEZXBsb3ltZW50WydGaXhlZCBicm9hZGJhbmQgMjUvMyAoTWJwcyknXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X2NvdW50eV9sYXllcl9maXhlZCcsXHJcbiAgICBzdHlsZXM6ICdicHJfbGF5ZXJfZml4ZWRfMScsXHJcbiAgICBjb2xvcjogJyNGRkU3NzMnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzRGVwbG95bWVudFsnTm8gZml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9jb3VudHlfbGF5ZXJfbm9uZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzAnLFxyXG4gICAgY29sb3I6ICcjNkNCQ0Q1JyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzRGVwbG95bWVudDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1Byb3ZpZGVycyA9IHt9O1xyXG5cclxuLy9Qcm92aWRlcnMgbWFwIGxheWVyc1xyXG5sYXllcnNQcm92aWRlcnNbJ05vIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCcsXHJcbiAgICBjb2xvcjogJyNmZmZmY2MnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydPbmUgZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXInXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzEnLFxyXG4gICAgY29sb3I6ICcjZmRjYzhhJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snVHdvIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8yJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMicsXHJcbiAgICBjb2xvcjogJyNmYzhkNTknLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzUHJvdmlkZXJzWydUaHJlZSBvciBtb3JlIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8zJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMycsXHJcbiAgICBjb2xvcjogJyNkNzMwMWYnLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNQcm92aWRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNTcGVlZCA9IHt9O1xyXG5cclxuLy9TcGVlZCBtYXAgbGF5ZXJzXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBzZXJ2aWNlcyBvZiBhdCBsZWFzdCAyMDAga2JwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyMDAnLFxyXG4gICAgY29sb3I6ICcjYzdlOWI0JyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMTAgTWJwcy8xIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQxMCcsXHJcbiAgICBjb2xvcjogJyM3ZmNkYmInLFxyXG4gICAgekluZGV4OiAxMlxyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCAyNSBNYnBzLzMgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfc3BlZWQyNScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDI1JyxcclxuICAgIGNvbG9yOiAnI2JkZDdlNycsXHJcbiAgICB6SW5kZXg6IDEzXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDUwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkNTAnLFxyXG4gICAgY29sb3I6ICcjMzE4MmJkJyxcclxuICAgIHpJbmRleDogMTRcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMTAwIE1icHMvNSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl9zcGVlZDEwMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDEwMCcsXHJcbiAgICBjb2xvcjogJyMwODMwNmInLFxyXG4gICAgekluZGV4OiAxNVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsYXllcnNTcGVlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGxheWVyc1RlY2ggPSB7fTtcclxuXHJcbi8vVGVjaG5vbG9neSBtYXAgbGF5ZXJzXHJcbmxheWVyc1RlY2hbJ05vIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVycyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X251bXByb3ZfMCcsXHJcbiAgICBjb2xvcjogJyNmZmZmY2MnLFxyXG4gICAgekluZGV4OiAxMVxyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRlRUUCddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9maWJlcicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydDYWJsZSBtb2RlbSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9jYWJsZScsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydEU0wgKGluYy4gRlRUTiksIG90aGVyIGNvcHBlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2RlYzIwMTZfdGVjaF9hZHNsJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTNcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0ZpeGVkIHdpcmVsZXNzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX2Z3JyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTRcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ090aGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfZGVjMjAxNl90ZWNoX290aGVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTVcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzVGVjaDtcclxuIiwiICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgQlBSTWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcclxuXHJcbiAgICB2YXIgTWFwU2VhcmNoID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjYnRuLWxvY1NlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2gubG9jQ2hhbmdlKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1jb29yZFNlYXJjaCcpLm9uKCdjbGljaycsICdidXR0b24nLCBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwpO1xyXG4gICAgICAgICAgICAkKCcjYnRuLWdlb0xvY2F0aW9uJykub24oJ2NsaWNrJywgTWFwU2VhcmNoLmdlb0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgJChcIiNidG4tbmF0aW9uTG9jYXRpb25cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBCUFJNYXAubWFwLnNldFZpZXcoWzUwLCAtMTA1XSwgMyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJChcIiNpbnB1dC1zZWFyY2gtc3dpdGNoXCIpLm9uKCdjbGljaycsICdhJywgTWFwU2VhcmNoLnNlYXJjaF9zd2l0Y2gpO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgICAuYXV0b2NvbXBsZXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcXVlc3QudGVybTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQlBSTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvY2F0aW9uLCBwcm9jZXNzQWRkcmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzQWRkcmVzcyhlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZGF0YS5yZXN1bHRzLmZlYXR1cmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3Nlcy5wdXNoKGZbaV0ucGxhY2VfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZShhZGRyZXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgTWFwU2VhcmNoLmxvY0NoYW5nZSgpOyB9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKS5hZGRDbGFzcygndWktY29ybmVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItdG9wJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci1hbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLmxvY0NoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI2xhdGl0dWRlLCAjbG9uZ2l0dWRlJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBNYXBTZWFyY2guc2VhcmNoX2RlY2ltYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2NDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgQlBSTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvYywgY29kZU1hcCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb2RlTWFwKGVyciwgZGF0YSkgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdHMuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgYWRkcmVzcyBwcm92aWRlZCBjb3VsZCBub3QgYmUgZm91bmQuIFBsZWFzZSBlbnRlciBhIG5ldyBhZGRyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBCUFJNYXAubGF0ID0gZGF0YS5sYXRsbmdbMF07XHJcbiAgICAgICAgICAgICAgICBCUFJNYXAubG9uID0gZGF0YS5sYXRsbmdbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTsgfSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaF9kZWNpbWFsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgQlBSTWFwLmxhdCA9ICQoJyNsYXRpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuICAgICAgICAgICAgQlBSTWFwLmxvbiA9ICQoJyNsb25naXR1ZGUnKS52YWwoKS5yZXBsYWNlKC8gKy9nLCAnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoQlBSTWFwLmxhdCA9PT0gJycgfHwgQlBSTWFwLmxvbiA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgbGF0L2xvbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoQlBSTWFwLmxhdCkgPiA5MCB8fCBNYXRoLmFicyhCUFJNYXAubG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xhdC9Mb24gdmFsdWVzIG91dCBvZiByYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBCUFJNYXAuZ2V0QmxvY2soQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7IH0sIDIwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZW9Mb2NhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xhdCA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xvbiA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19hY2MgPSBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKGdlb19sYXQgKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubG9uID0gTWF0aC5yb3VuZChnZW9fbG9uICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX3N3aXRjaDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VhcmNoID09PSAnbG9jJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWNvb3JkU2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbG9jU2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdBZGRyZXNzJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09PSAnbGF0bG9uLWRlY2ltYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjY29vcmQtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2J0bi1sYWJlbCcpLnRleHQoJ0Nvb3JkaW5hdGVzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFwU2VhcmNoOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoLmpzJyk7XHJcblxyXG52YXIgdGFibGVQcm92aWRlcnMgPSByZXF1aXJlKCcuL3RhYmxlLXByb3ZpZGVycy5qcycpO1xyXG52YXIgdGFibGVEZW1vZyA9IHJlcXVpcmUoJy4vdGFibGUtZGVtb2dyYXBoaWNzLmpzJyk7XHJcbnZhciBjaGFydERlbW9nID0gcmVxdWlyZSgnLi9jaGFydC1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0Rml4ZWQgPSByZXF1aXJlKCcuL2NoYXJ0LWZpeGVkLmpzJyk7XHJcbnZhciBjaGFydE5XRml4ZWQgPSByZXF1aXJlKCcuL2NoYXJ0LWZpeGVkTmF0aW9ud2lkZS5qcycpO1xyXG52YXIgY2hhcnRUZWNoID0gcmVxdWlyZSgnLi9jaGFydC10ZWNoLmpzJyk7XHJcbnZhciBjaGFydFNwZWVkID0gcmVxdWlyZSgnLi9jaGFydC1zcGVlZC5qcycpO1xyXG5cclxudmFyIGxheWVycyA9IHtcclxuICAgIGRlcGxveW1lbnQ6IHJlcXVpcmUoJy4vbGF5ZXJzLWRlcGxveW1lbnQuanMnKSxcclxuICAgIHNwZWVkOiByZXF1aXJlKCcuL2xheWVycy1zcGVlZC5qcycpLFxyXG4gICAgcHJvdmlkZXJzOiByZXF1aXJlKCcuL2xheWVycy1wcm92aWRlcnMuanMnKSxcclxuICAgIHRlY2hub2xvZ3k6IHJlcXVpcmUoJy4vbGF5ZXJzLXRlY2guanMnKSxcclxuICAgIHRyaWJhbDoge1xyXG4gICAgICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgbGF5ZXJzOiAnYnByX3RyaWJhbCcsXHJcbiAgICAgICAgc3R5bGVzOiAnYnByX3RyaWJhbCcsXHJcbiAgICAgICAgekluZGV4OiAxOVxyXG4gICAgfSxcclxuICAgIHVyYmFuOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdmY2M6YnByX2NvdW50eV9sYXllcl91cmJhbl9vbmx5JyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfbGF5ZXJfdXJiYW4nLFxyXG4gICAgICAgIHpJbmRleDogMjBcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBsb2NhdGlvbk1hcmtlcjtcclxudmFyIGNsaWNrZWRDb3VudHlMYXllcjtcclxudmFyIGNsaWNrZWRDb3VudHlTdHlsZSA9IHsgY29sb3I6ICcjMDBmJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjb3VudHlMYXllckRhdGEgPSB7ICdmZWF0dXJlcyc6IFtdIH07XHJcblxyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXI7XHJcbnZhciBjbGlja2VkQmxvY2tTdHlsZSA9IHsgY29sb3I6ICcjMDAwJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjbGlja2VkQmxvY2tMYXllckRhdGE7XHJcblxyXG52YXIgQlBSTWFwID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vIGRlZmF1bHQgbWFwIHNldHRpbmdzXHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyID0ge307XHJcbiAgICAgICAgQlBSTWFwLmxhdCA9IDM4LjgyO1xyXG4gICAgICAgIEJQUk1hcC5sb24gPSAtOTQuOTY7XHJcbiAgICAgICAgQlBSTWFwLnpvb20gPSA0O1xyXG5cclxuICAgICAgICAvLyB0cmlnZ2VyIGhhc2hjaGFuZ2UgYW5kIGdldCBtYXAgc2V0dGluZ3NcclxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBIYXNoLmNoYW5nZSk7XHJcbiAgICAgICAgSGFzaC5jaGFuZ2UoQlBSTWFwKTtcclxuICAgICAgICBCUFJNYXAuY3JlYXRlTWFwKCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAub24oJ2NsaWNrJywgQlBSTWFwLnVwZGF0ZSk7XHJcblxyXG4gICAgICAgIGlmIChIYXNoLmhhc0hhc2goKSkgeyBcclxuICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBtYXAgY29udGFpbmVyIHdpZHRoXHJcbiAgICAgICAgJCgnLmNvbnRyb2wtZnVsbCcpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAkKCdoZWFkZXIgLmNvbnRhaW5lciwgaGVhZGVyIC5jb250YWluZXItZmx1aWQsIG1haW4nKVxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdjb250YWluZXIgY29udGFpbmVyLWZsdWlkJylcclxuICAgICAgICAgICAgICAgIC5vbmUoJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVNYXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtYXh6b29tID0gMTU7XHJcbiAgICAgICAgdmFyIG1pbnpvb20gPSAzO1xyXG4gICAgICAgIHZhciBiYXNlTGF5ZXIgPSB7fTtcclxuICAgICAgICB2YXIgbGF5ZXJDb250cm9sO1xyXG4gICAgICAgIHZhciBsYXllclBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKVsxXTtcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyID0ge307XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZW9VUkwgPSAnL2d3Yy9zZXJ2aWNlL3dtcz90aWxlZD10cnVlJztcclxuICAgICAgICBCUFJNYXAuZ2VvX3NwYWNlID0gJ2ZjYyc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lZMjl0Y0hWMFpXTm9JaXdpWVNJNkluTXlibE15YTNjaWZRLlA4eXBwZXNIa2k1cU15eFRjMkNOTGcnO1xyXG4gICAgICAgIEJQUk1hcC5tYXAgPSBMLm1hcGJveC5tYXAoJ21hcC1jb250YWluZXInLCAnZmNjLms3NGVkNWdlJywge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRpb25Db250cm9sOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWF4Wm9vbTogbWF4em9vbSxcclxuICAgICAgICAgICAgICAgIG1pblpvb206IG1pbnpvb20sXHJcbiAgICAgICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc2V0VmlldyhbQlBSTWFwLmxhdCwgQlBSTWFwLmxvbl0sIEJQUk1hcC56b29tKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLm1hcC5hdHRyaWJ1dGlvbkNvbnRyb2wuYWRkQXR0cmlidXRpb24oJzxhIGhyZWY9XCJodHRwOi8vZmNjLmdvdlwiPkZDQzwvYT4nKTtcclxuXHJcbiAgICAgICAgLy9iYXNlIGxheWVyc1xyXG4gICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRlZDVnZScpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBMLm1hcGJveC50aWxlTGF5ZXIoJ2ZjYy5rNzRkN24wZycpO1xyXG4gICAgICAgIGJhc2VMYXllci5UZXJyYWluID0gTC5tYXBib3gudGlsZUxheWVyKCdmY2Muazc0Y20zb2wnKTtcclxuXHJcbiAgICAgICAgLy9nZXQgdGlsZSBsYXllcnMgYmFzZWQgb24gbG9jYXRpb24gcGF0aG5hbWVcclxuICAgICAgICBmb3IgKHZhciBsYXllciBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwTGF5ZXJbbGF5ZXJdID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVyc1tsYXllclBhdGhdW2xheWVyXSkuc2V0WkluZGV4KGxheWVyc1tsYXllclBhdGhdW2xheWVyXS56SW5kZXgpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgVHJpYmFsIGFuZCBVcmJhbiBsYXllcnNcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXJbJ1RyaWJhbCddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy50cmliYWwpLnNldFpJbmRleChsYXllcnMudHJpYmFsLnpJbmRleCk7XHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyWydVcmJhbiddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy51cmJhbikuc2V0WkluZGV4KGxheWVycy51cmJhbi56SW5kZXgpO1xyXG5cclxuICAgICAgICAvL2xheWVyIGNvbnRyb2xcclxuICAgICAgICBsYXllckNvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKFxyXG4gICAgICAgICAgICBiYXNlTGF5ZXIsIHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICAvLyBoYXNoID0gTC5oYXNoKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2VvY29kZXIgPSBMLm1hcGJveC5nZW9jb2RlcignbWFwYm94LnBsYWNlcy12MScpO1xyXG5cclxuICAgICAgICBCUFJNYXAuY3JlYXRlTGVnZW5kKGxheWVyUGF0aCk7XHJcblxyXG4gICAgICAgIGNoYXJ0TldGaXhlZC5pbml0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKEhhc2guaGFzSGFzaCgpID09PSBmYWxzZSkgeyBcclxuICAgICAgICAgICAgY2hhcnRTcGVlZC5pbml0KCdudycpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG5cclxuICAgIH0sIC8vZW5kIGNyZWF0ZU1hcFxyXG4gICAgY3JlYXRlTGVnZW5kOiBmdW5jdGlvbihsYXllclBhdGgpIHtcclxuICAgICAgICB2YXIgdGQgPSAnJztcclxuICAgICAgICB2YXIgdHIgPSAnJztcclxuICAgICAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbGF5ZXJzW2xheWVyUGF0aF0pIHtcclxuICAgICAgICAgICAgdGQgKz0gJzx0ZD48aW5wdXQgaWQ9XCJjaGsnICsgY291bnQgKyAnXCIgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1sYXllcj1cIicgKyBrZXkgKyAnXCIgY2hlY2tlZD48L3RkPic7XHJcbiAgICAgICAgICAgIHRkICs9ICc8dGQ+PGRpdiBjbGFzcz1cImtleS1zeW1ib2xcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6JyArIGxheWVyc1tsYXllclBhdGhdW2tleV0uY29sb3IgKyAnXCI+PC9kaXY+PC90ZD4nO1xyXG4gICAgICAgICAgICB0ZCArPSAnPHRkPjxsYWJlbCBmb3I9XCJjaGsnICsgY291bnQgKyAnXCI+JyArIGtleSArICc8L2xhYmVsPjwvdGQ+JztcclxuICAgICAgICAgICAgdHIgKz0gJzx0cj4nICsgdGQgKyAnPC90cj4nO1xyXG4gICAgICAgICAgICB0ZCA9ICcnO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLm1hcC1sZWdlbmQnKVxyXG4gICAgICAgICAgICAuZmluZCgndGJvZHknKS5wcmVwZW5kKHRyKVxyXG4gICAgICAgICAgICAuZW5kKClcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsICdbdHlwZT1jaGVja2JveF0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXllck5hbWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbGF5ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcExheWVyW2xheWVyTmFtZV0uYWRkVG8oQlBSTWFwLm1hcCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoQlBSTWFwLm1hcExheWVyW2xheWVyTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihlKSB7ICAgICAgIFxyXG4gICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sYXQpIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgIEJQUk1hcC5sb24gPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sbmcpIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7ICAgICAgICBcclxuXHJcbiAgICB9LCAvL2VuZCB1cGRhdGVcclxuICAgIGdldENvdW50eTogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X2NvdW50eSZtYXhGZWF0dXJlcz0xJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBnZW9VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IEJQUk1hcC5zaG93Q291bnR5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAvL2VuZCBnZXRDb3VudHlcclxuICAgIHNob3dDb3VudHk6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgY291bnR5RGF0YSA9IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcztcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudHlfdGV4dCA9ICdObyBjb3VudHkgZGF0YSBmb3VuZCBhdCB5b3VyIHNlYXJjaGVkL2NsaWNrZWQgbG9jYXRpb24uJztcclxuICAgICAgICAgICAgLy8gJCgnI2Rpc3BsYXktY291bnR5JykuaHRtbChjb3VudHlfdGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoJCgnI3RhYkluc3RydWN0cycpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjdGFiSW5zdHJ1Y3RzLCAjbndGaXhlZCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjZml4ZWQsICNwcm92aWRlciwgI2RlbW9ncmFwaGljcycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpZCA9IGRhdGEuZmVhdHVyZXNbMF0uaWQucmVwbGFjZSgvXFwuLiokLywgJycpO1xyXG5cclxuICAgICAgICBpZiAoaWQgIT09ICdicHJfZGVjMjAxNl9jb3VudHknKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGNsaWNrZWRDb3VudHlMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihjbGlja2VkQ291bnR5TGF5ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKGRhdGEpLnNldFN0eWxlKGNsaWNrZWRDb3VudHlTdHlsZSkuYWRkVG8oQlBSTWFwLm1hcCk7XHJcblxyXG4gICAgICAgIGlmIChjb3VudHlMYXllckRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwIHx8IGNvdW50eUxheWVyRGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzLmNvdW50eV9maXBzICE9PSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5maXRCb3VuZHMoY2xpY2tlZENvdW50eUxheWVyLmdldEJvdW5kcygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRDb3VudHlMYXllci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC51cGRhdGUoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvdW50eUxheWVyRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIEJQUk1hcC5nZXRCbG9jayhCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuXHJcbiAgICAgICAgdGFibGVEZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnREZW1vZy5jcmVhdGUoY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5pbml0KGNvdW50eURhdGEuY291bnR5X2ZpcHMpO1xyXG4gICAgICAgIGNoYXJ0VGVjaC5pbml0KGNvdW50eURhdGEuY291bnR5X2ZpcHMpO1xyXG4gICAgICAgIGNoYXJ0U3BlZWQuaW5pdChjb3VudHlEYXRhLmNvdW50eV9maXBzKTtcclxuXHJcbiAgICB9LCAvL2VuZCBzaG93Q291bnR5XHJcbiAgICBnZXRCbG9jazogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y29udGFpbnMoZ2VvbSwlMjBQT0lOVCgnICsgbG9uICsgJyUyMCcgKyBsYXQgKyAnKSknO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBnZW9VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IEJQUk1hcC5zaG93QmxvY2tcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzaG93QmxvY2s6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgYmxvY2tEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBjbGlja2VkQmxvY2tMYXllckRhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihjbGlja2VkQmxvY2tMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQmxvY2tMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcihjbGlja2VkQmxvY2tMYXllckRhdGEpLnNldFN0eWxlKGNsaWNrZWRCbG9ja1N0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLnNldExvY2F0aW9uTWFya2VyKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1maXBzXScpLnRleHQoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsXScpLnRleHQoYmxvY2tEYXRhLnVyYmFuX3J1cmFsID09PSAnUicgPyAnUnVyYWwnIDogJ1VyYmFuJyk7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIFByb3ZpZGVycyB0YWJsZVxyXG4gICAgICAgIHRhYmxlUHJvdmlkZXJzLmdldERhdGEoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG5cclxuICAgICAgICBIYXNoLnVwZGF0ZShCUFJNYXApO1xyXG4gICAgfSxcclxuICAgIHNldExvY2F0aW9uTWFya2VyOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGxvY2F0aW9uTWFya2VyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGxvY2F0aW9uTWFya2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbbGF0LCBsb25dLCB7IHRpdGxlOiAnJyB9KS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBCUFJNYXAuem9vbVRvQmxvY2soKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB6b29tVG9CbG9jazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAuZml0Qm91bmRzKGNsaWNrZWRCbG9ja0xheWVyLmdldEJvdW5kcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IC8vZW5kIE1hcExheWVyc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCUFJNYXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgdGFibGVEZW1vZyA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oY291bnR5RGF0YSkge1xyXG4gICAgXHR2YXIgcG9wRGF0YSA9IHtcclxuXHRcdFx0Y291bnR5X25hbWU6IGNvdW50eURhdGEuY291bnR5X25hbWUsXHJcblx0XHRcdHN0YXRlX2FiYnI6IGNvdW50eURhdGEuc3RhdGVfYWJicixcclxuXHRcdFx0cG9wMjAxNTogY291bnR5RGF0YS5wb3AyMDE1LFxyXG5cdFx0XHRwb3BkZW5zaXR5OiBjb3VudHlEYXRhLnBvcGRlbnNpdHksXHJcblx0XHRcdHBlcmNhcGluYzogY291bnR5RGF0YS5wZXJjYXBpbmMsXHJcblx0XHRcdHVuc3BvcDI1XzM6IGNvdW50eURhdGEudW5zcG9wMjVfMyxcclxuXHRcdFx0cGVyX3VyYmFubm9maXhlZDogY291bnR5RGF0YS5wZXJfdXJiYW5ub2ZpeGVkLFxyXG5cdFx0XHRwZXJfcnVyYWxub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl9ydXJhbG5vZml4ZWRcclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yICh2YXIgcHJvcE5hbWUgaW4gcG9wRGF0YSkge1xyXG5cdFx0XHRpZiAodXRpbGl0eS5pc051bGwocG9wRGF0YVtwcm9wTmFtZV0pKSB7XHJcblx0XHRcdFx0cG9wRGF0YVtwcm9wTmFtZV0gPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuICAgICAgICAvL3BvcHVsYXRlIENlbnN1cyBCbG9jayB0YWJsZVxyXG4gICAgICAgICQoJ1tkYXRhLWNvdW50eV0nKS50ZXh0KHBvcERhdGEuY291bnR5X25hbWUpO1xyXG4gICAgICAgICQoJ1tkYXRhLXN0YXRlXScpLnRleHQocG9wRGF0YS5zdGF0ZV9hYmJyKTtcclxuICAgICAgICAkKCdbZGF0YS10b3RhbFBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wb3AyMDE1KSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcG9wRGVuc2l0eV0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wb3BkZW5zaXR5KSk7XHJcbiAgICAgICAgJCgnW2RhdGEtaW5jb21lQ2FwaXRhXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBlcmNhcGluYykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wTm9BY2Nlc3NdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEudW5zcG9wMjVfMykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXVyYmFuUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3VyYmFubm9maXhlZCkpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3J1cmFsbm9maXhlZCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZURlbW9nO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4vdXRpbGl0eS5qcycpO1xyXG5cclxudmFyIGNvbHVtbnMgPSBbXHJcbiAgICB7ICdkYXRhJzogJ2F2ZXBvcCcsICd3aWR0aCc6ICcyMCUnIH0sXHJcbiAgICB7ICdkYXRhJzogJ2F2ZWRlbnNpdHknLCAnd2lkdGgnOiAnMjAlJyB9LFxyXG4gICAgeyAnZGF0YSc6ICdwZXJjYXBpdGEnLCAnd2lkdGgnOiAnMjAlJyB9LFxyXG4gICAgeyAnZGF0YSc6ICdob3VzZWhvbGQnLCAnd2lkdGgnOiAnMjAlJyB9LFxyXG4gICAgeyAnZGF0YSc6ICdwb3ZlcnR5JywgJ3dpZHRoJzogJzIwJScgfVxyXG5dO1xyXG5cclxudmFyIHJvd1RpdGxlcyA9IFsnV2l0aG91dCBBY2Nlc3MnLCAnV2l0aCBBY2Nlc3MnXTtcclxuXHJcbnZhciB0YWJsZU5XQXZlID0ge1xyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oYmxvY2tGaXBzKSB7XHJcbiAgICAgICAgdmFyIG53QXZlVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2RlYzIwMTZfbndfYXZlcmFnZSZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24nO1xyXG5cclxuICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAnYWpheCc6IHtcclxuICAgICAgICAgICAgICAgICd1cmwnOiBud0F2ZVVSTCxcclxuICAgICAgICAgICAgICAgICdjb21wbGV0ZSc6IGFkZENvbHMsXHJcbiAgICAgICAgICAgICAgICAnZGF0YVNyYyc6IHRhYmxlTldBdmUuY3JlYXRlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdiU29ydCc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnY29sdW1ucyc6IGNvbHVtbnMsXHJcbiAgICAgICAgICAgICdkZXN0cm95JzogdHJ1ZSxcclxuICAgICAgICAgICAgJ2luZm8nOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8gJ29yZGVyJzogW1xyXG4gICAgICAgICAgICAvLyAgICAgWzAsICdhc2MnXVxyXG4gICAgICAgICAgICAvLyBdLFxyXG4gICAgICAgICAgICAncGFnaW5nJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdzZWFyY2hpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8gJ3Njcm9sbFknOiAnMjgwcHgnLFxyXG4gICAgICAgICAgICAvLyAnc2Nyb2xsQ29sbGFwc2UnOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRDb2xzKCkge1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoZWxtKS5oYXNDbGFzcygnb2RkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsbSkucHJlcGVuZCgnPHRoIGNsYXNzPVwicm93SGVhZGluZ1wiPldpdGhvdXQgQWNjZXNzPC90aD4nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbG0pLnByZXBlbmQoJzx0aCBjbGFzcz1cInJvd0hlYWRpbmdcIj5XaXRoIEFjY2VzczwvdGg+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykucHJlcGVuZCgnPHRoPjwvdGg+Jyk7XHJcbiAgICAgICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLmZpbmQoJ3Rib2R5PnRyJykuZXEoMCkuYmVmb3JlKCc8dHI+PHRoIGNvbHNwYW49XCI3XCI+VW5pdGVkIFN0YXRlcyAoQWxsIEFyZWFzKTwvdGg+PC90cj4nKTtcclxuICAgICAgICAgICAgJCgnI3RhYmxlLW53QXZlJykuZmluZCgndGJvZHk+dHInKS5lcSgyKS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiPlJ1cmFsIEFyZWFzPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDUpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCI+VXJiYW4gQXJlYXM8L3RoPjwvdHI+Jyk7XHJcblxyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDgpLmFmdGVyKCc8dHI+PHRoIGNvbHNwYW49XCI3XCI+VHJpYmFsIExhbmRzPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDExKS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiPlJ1cmFsIEFyZWFzPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDE0KS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiPlVyYmFuIEFyZWFzPC90aD48L3RyPicpO1xyXG5cclxuICAgICAgICAgICAgJCgnI3RhYmxlLW53QXZlJykuZmluZCgndGJvZHk+dHInKS5lcSgxNykuYWZ0ZXIoJzx0cj48dGggY29sc3Bhbj1cIjdcIj5VLlMuIFRlcnJpdG9yaWVzPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDIwKS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiPlJ1cmFsIEFyZWFzPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICAkKCcjdGFibGUtbndBdmUnKS5maW5kKCd0Ym9keT50cicpLmVxKDIzKS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiPlVyYmFuIEFyZWFzPC90aD48L3RyPicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHBvcERhdGEgPSBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXM7XHJcbiAgICAgICAgdmFyIHRlbXBEYXRhID0gW107XHJcbiAgICAgICAgdmFyIHRlbXBPYmogPSB7fTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIGogPSAwO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBQcmVmaXggPSBbJ3VzX2F2ZycsICd1c19ydXJhbF9hdmcnLCAndXNfdXJiYW5fYXZnJywgJ3RyaWJhbF9hdmcnLCAndHJpYmFsX3J1cmFsX2F2ZycsICd0cmliYWxfdXJiYW5fYXZnJywgJ3RlcnJfYXZnJywgJ3RlcnJfcnVyYWxfYXZnJywgJ3RlcnJfdXJiYW5fYXZnJ107XHJcblxyXG4gICAgICAgIHZhciBncm91cFcgPSBbJ3BvcF93JywgJ3BvcGRlbl93JywgJ3BlcmNhcF93JywgJ2hpbmNfdycsICdwb3ZyYXRfdyddO1xyXG4gICAgICAgIHZhciBncm91cFdvID0gWydwb3Bfd28nLCAncG9wZGVuX3dvJywgJ3BlcmNhcF93bycsICdoaW5jX3dvJywgJ3BvdnJhdF93byddO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRWYWxzKGFycikge1xyXG4gICAgICAgICAgICB0ZW1wT2JqID0ge307XHJcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IGdyb3VwUHJlZml4W2ldICsgJ18nICsgYXJyW2pdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbE5hbWUgPSBjb2x1bW5zW2pdLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcE9ialtjb2xOYW1lXSA9IHBvcERhdGFbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBQcmVmaXgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2V0VmFscyhncm91cFdvKTtcclxuICAgICAgICAgICAgdGVtcERhdGEucHVzaCh0ZW1wT2JqKTtcclxuICAgICAgICAgICAgZ2V0VmFscyhncm91cFcpO1xyXG4gICAgICAgICAgICB0ZW1wRGF0YS5wdXNoKHRlbXBPYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRlbXBEYXRhO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZU5XQXZlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdGFibGVQcm92aWRlcnMgPSB7XHJcbiAgICBnZXREYXRhOiBmdW5jdGlvbihibG9ja0ZpcHMpIHtcclxuICAgICAgICB2YXIgcHJvdmlkZXJzVVJMID0gJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9kZWMyMDE2X3Byb3ZpZGVycyZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1ibG9ja19maXBzPSUyNycgKyBibG9ja0ZpcHMgKyAnJTI3JztcclxuXHJcbiAgICAgICAgJCgnI3RhYmxlLXByb3ZpZGVycycpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICdhamF4Jzoge1xyXG4gICAgICAgICAgICAgICAgJ3VybCc6IHByb3ZpZGVyc1VSTCxcclxuICAgICAgICAgICAgICAgICdkYXRhU3JjJzogdGFibGVQcm92aWRlcnMuY3JlYXRlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjb2x1bW5zJzogW1xyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdwcm92aWRlck5hbWUnIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3RlY2gnIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3NwZWVkRG93bicgfSxcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAnc3BlZWRVcCcgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAnZGVzdHJveSc6IHRydWUsXHJcbiAgICAgICAgICAgICdpbmZvJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdvcmRlcic6IFtcclxuICAgICAgICAgICAgICAgIFswLCAnYXNjJ11cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ3BhZ2luZyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnc2VhcmNoaW5nJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdzY3JvbGxZJzogJzI4MHB4JyxcclxuICAgICAgICAgICAgJ3Njcm9sbENvbGxhcHNlJzogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgcHJvdmlkZXJEYXRhID0gZGF0YS5mZWF0dXJlcztcclxuICAgICAgICB2YXIgdGVtcERhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm92aWRlckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGVtcERhdGEucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAncHJvdmlkZXJOYW1lJzogcHJvdmlkZXJEYXRhW2ldLnByb3BlcnRpZXMuZGJhbmFtZSxcclxuICAgICAgICAgICAgICAgICd0ZWNoJzogcHJvdmlkZXJEYXRhW2ldLnByb3BlcnRpZXMudGVjaG5vbG9neSxcclxuICAgICAgICAgICAgICAgICdzcGVlZERvd24nOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kb3dubG9hZF9zcGVlZCxcclxuICAgICAgICAgICAgICAgICdzcGVlZFVwJzogcHJvdmlkZXJEYXRhW2ldLnByb3BlcnRpZXMudXBsb2FkX3NwZWVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRlbXBEYXRhO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZVByb3ZpZGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxpdHkgPSB7XHJcbiAgICBpc051bGw6IGZ1bmN0aW9uKGZpZWxkTmFtZSkge1xyXG4gICAgICAgIHJldHVybiBmaWVsZE5hbWUgPT09IG51bGw7XHJcbiAgICB9LFxyXG4gICAgZm9ybWF0Q29tbWE6IGZ1bmN0aW9uKG51bSkge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IG51bS50b1N0cmluZygpLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgcGFydHNbMF0gPSBwYXJ0c1swXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XHJcbiAgICB9LFxyXG4gICAgZm9ybWF0UGVyY2VudDogZnVuY3Rpb24obnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChudW0gKiAxMDApLnRvRml4ZWQoMikgKyAnJSc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxpdHk7XHJcbiJdfQ==
