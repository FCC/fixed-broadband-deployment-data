(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function() {
    'use strict';

    var BPRMap = require('./modules/map.js');
    var MapSearch = require('./modules/map-search.js');
    var tableNWAve = require('./modules/table-nwAve.js');
    var pathname = window.location.pathname.split('\\').pop().split('/').pop().split('.')[0];

    window.GEOHOST = 'https://geo.fcc.gov/fcc'; 
    
    if (pathname === '' || pathname === 'index') {
        window.page = 'deployment';
    } else {
        window.page = pathname;
    }
    
    // set active main nav link
    if (window.page === 'deployment') {
        $('[href="index.html"]').addClass('active');
    } else {
        $('[href="' + window.page + '.html"]').addClass('active');
    }

    // initialize map search
    if ($('#map').length > 0) {
        BPRMap.init();
        MapSearch.init();
    }

    // display Nationwide table if available
    if ($('#table-nwAve').length > 0) {
        tableNWAve.getData();
    }

}());

},{"./modules/map-search.js":11,"./modules/map.js":12,"./modules/table-nwAve.js":14}],2:[function(require,module,exports){
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
    init: function(county_fips, data) {
        //show chart if it exists on the page
        if ($('#chartDemog').length === 0) {
            return;
        }

        //if county FIPS is the same don't regenerate chart
        if (county_fips === chartDemog.FIPS) {
            return;
        } else {
            chartDemog.FIPS = county_fips;
        }

        chartDemog.create(data);
    },
    create: function(data) {
        var donut;
        var ctxDemog;
        var chartVals = [];

        var population = data.pop2015;
        var urbanpop = data.urbanpop;
        var ruralpop = data.ruralpop;
        var urbanper;
        var ruralper;
        
        function calcPercent(d) {
            var percentage;

            if (d === null) {
                percentage = 0;
            } else {
                percentage = (100 * (d / population)).toFixed(2);
            }

            return percentage;
        }
        
        urbanper = calcPercent(urbanpop);
        ruralper = calcPercent(ruralpop);

        chartVals.push(urbanper);
        chartVals.push(ruralper);

        chartOpts.datasets[0].data = chartVals;

        //replace chart canvas if it already exists
        $('#chartDemog').replaceWith('<canvas id="chartDemog" width="350" height="220"></canvas>');
        $('.chartjs-hidden-iframe').remove();

        ctxDemog = $('#chartDemog');

        donut = new Chart(ctxDemog, {
            type: 'doughnut',
            data: chartOpts,
            options: {
                responsive: false,
                legend: {
                    position: 'bottom'
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            var value = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];

                            return data.labels[tooltipItems.index] + ': ' + value + '%';
                        }
                    }
                }
            }
        });

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
        var allCntyURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_apr2017_county_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: allCntyURL
        }).done(function(data) {
            chartFixed.update(data);
            chartFixed.getURData();
        }).fail(function(){
            alert('Unable to access county data.');
        });
    },
    getURData: function() {
        var urURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_county_ur_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: urURL
        }).done(function(data) {
            chartFixed.processURData(data);
            chartFixed.getTribalData();
        }).fail(function(){
            alert('Unable to access urban and rural data.');
        });
    },
    getTribalData: function() {
        var tribalURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_county_tribal_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: tribalURL
        }).done(function(data) {
            chartFixed.update(data);
            chartFixed.display();
        }).fail(function(){
            alert('Unable to access tribal data.');
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
        $('#chartFixed').replaceWith('<canvas id="chartFixed" width="350" height="255"></canvas>');
        $('.chartjs-hidden-iframe').remove();

        //create new chart
        ctxFixed = $('#chartFixed');
        chartFixed.chart = new Chart(ctxFixed, {
            type: 'bar',
            data: chartFixed.data,
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                responsive: true,
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

        // View Nationwide link
        $('.sect-fixed').on('click', '.link-nw', function(e) {            
            e.preventDefault();

            $('#tabInstructs, #nwFixed').removeClass('hide');
            $('#fixed, #provider, #demographics').addClass('hide');
            $('#btn-nationLocation').click();

            $('.search-field').find('input').val('');

            chartNWFixed.data.datasets[0].data = [];
            chartNWFixed.data.datasets[1].data = [];
            chartNWFixed.getNWData();
        });

        chartNWFixed.getNWData();
    },
    getNWData: function() {
        var nwURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_apr2017_nw_fnf&maxFeatures=100&outputFormat=application/json';

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
        var urbanURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_nw_ur_fnf&maxFeatures=100&outputFormat=application/json';

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
        var tribalURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_nw_tribal_fnf&maxFeatures=100&outputFormat=application/json';

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
        var ctxNWFixed;

        //replace chart canvas if it already exists
        $('#chartNWFixed').replaceWith('<canvas id="chartNWFixed" width="350" height="255"></canvas>');
        $('.chartjs-hidden-iframe').remove();

        //create new chart
        ctxNWFixed = $('#chartNWFixed');
        chartNWFixed.chart = new Chart(ctxNWFixed, {
            type: 'bar',
            data: chartNWFixed.data,
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                responsive: true,
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
            labels: ['0.2', '10/1', '25/3', '50/5', '100/10'],
            datasets: [{
                label: '0',
                backgroundColor: '#ffffcc',
                data: []
            }, {
                label: '1',
                backgroundColor: '#fdcc8a',
                data: []
            }, {
                label: '2',
                backgroundColor: '#fc8d59',
                data: []
            }, {
                label: '3',
                backgroundColor: '#d7301f',
                data: []
            }]
        };

        // only show chart if it exists on the page
        if ($('#chartSpeed').length === 0) {
            return;
        }

        // if county FIPS is the same don't regenerate chart
        if (county_fips === chartSpeed.FIPS) {
            return;
        } else {
            chartSpeed.FIPS = county_fips;
        }

        // show Nationwide chart
        $('.sect-speed').on('click', '.link-nw', function() {
            chartSpeed.init('nw');
            $('.sect-speed').addClass('hide');
            $('.sect-speedNW').removeClass('hide');
            $('#btn-nationLocation').click();
        });

        chartSpeed.getTech();
    },
    getTech: function() {
        var speedURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_refresh_county&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartSpeed.FIPS + '%27';
        var speedNWURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_refresh_nation&maxFeatures=100&outputFormat=application/json';

        $.ajax({
            type: 'GET',
            url: chartSpeed.FIPS === 'nw' ? speedNWURL : speedURL
        }).done(function(data) {
            chartSpeed.update(data);
            chartSpeed.display();
        }).fail(function(){
            alert('Unable to access chart data.');
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
        var chartID;

        if (chartSpeed.FIPS === 'nw') {
            chartID = 'chartSpeedNW';

            $('.sect-speed').addClass('hide');
            $('.sect-speedNW').removeClass('hide');
        } else {
            chartID = 'chartSpeed';

            $('.sect-speed').removeClass('hide');
            $('.sect-speedNW').addClass('hide');
        }

        //replace chart canvas if it already exists
        $('#' + chartID).replaceWith('<canvas id="' + chartID + '" width="350" height="255"></canvas>');
        $('.chartjs-hidden-iframe').remove();

        //create new charts
        ctxTech = $('#' + chartID);
        chartSpeed.chart = new Chart(ctxTech, {
            type: 'bar',
            data: chartSpeed.data,
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Speed (Mbps downstream/upstream)'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: '% Population'
                        },
                        ticks: {
                            max: 100,
                            min: 0,
                            stepSize: 20
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

var Validate = require('./validate.js');

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

        if (latHash === null || lonHash === null || zoomHash === null || !Validate.coord(latHash[1], lonHash[1], zoomHash[1])) {
            BPRMap.lat = BPRMap.lat;
            BPRMap.lon = BPRMap.lon;
            BPRMap.zoom = BPRMap.zoom;
        } else {
            BPRMap.lat = latHash[1].replace(/\+/g, '%20');
            BPRMap.lon = lonHash[1].replace(/\+/g, '%20');
            BPRMap.zoom = zoomHash[1].replace(/\+/g, '%20');
        }        
    },
    update: function(BPRMap) {

        //map lat, lon, zoom
        BPRMap.zoom = BPRMap.map.getZoom();
        Hash.params.lat = BPRMap.lat;
        Hash.params.lon = BPRMap.lon;
        Hash.params.zoom = BPRMap.zoom;
       
        window.location.hash = $.param(Hash.params);

    },
    change: function(BPRMap) {
    	Hash.get(BPRMap);    	
    }
};


module.exports = Hash;

},{"./validate.js":17}],7:[function(require,module,exports){
'use strict';

var layersDeployment = {};

//Deployment map layers
layersDeployment['Fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_county_layer_fixed',
    styles: 'bpr_layer_fixed_1',
    color: '#FFE773',
    zIndex: 11
};

layersDeployment['No fixed broadband 25/3 (Mbps)'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_county_layer_nonfixed',
    styles: 'bpr_layer_fixed_0',
    color: '#6CBCD5',
    zIndex: 12
};

module.exports = layersDeployment;

},{}],8:[function(require,module,exports){
'use strict';

var layersProviders = {};

//Providers map layers
layersProviders['No fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_numprov_0',
    styles: 'bpr_dec2016_numprov_0',
    color: '#ffffcc',
    zIndex: 11
};

layersProviders['One fixed 25 Mbps/3 Mbps provider'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_numprov_1',
    styles: 'bpr_dec2016_numprov_1',
    color: '#fdcc8a',
    zIndex: 12
};

layersProviders['Two fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_numprov_2',
    styles: 'bpr_dec2016_numprov_2',
    color: '#fc8d59',
    zIndex: 13
};

layersProviders['Three or more fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_numprov_3',
    styles: 'bpr_dec2016_numprov_3',
    color: '#d7301f',
    zIndex: 14
};

module.exports = layersProviders;

},{}],9:[function(require,module,exports){
'use strict';

var layersSpeed = {};

//Speed map layers

layersSpeed['No residential services at 200 kbps or above'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_speed_lt_200',
    styles: 'bpr_dec2016_speed_lt_200',
    color: '#ffffcc',
    zIndex: 10
};

layersSpeed['Residential services of at least 200 kbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_speed200',
    styles: 'bpr_dec2016_speed200',
    color: '#c7e9b4',
    zIndex: 11
};

layersSpeed['Residential broadband of at least 10 Mbps/1 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_speed10',
    styles: 'bpr_dec2016_speed10',
    color: '#7fcdbb',
    zIndex: 12
};

layersSpeed['Residential broadband of at least 25 Mbps/3 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_speed25',
    styles: 'bpr_dec2016_speed25',
    color: '#bdd7e7',
    zIndex: 13
};

layersSpeed['Residential broadband of at least 50 Mbps/5 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_speed50',
    styles: 'bpr_dec2016_speed50',
    color: '#3182bd',
    zIndex: 14
};

layersSpeed['Residential broadband of at least 100 Mbps/10 Mbps'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_speed100',
    styles: 'bpr_dec2016_speed100',
    color: '#08306b',
    zIndex: 15
};

module.exports = layersSpeed;

},{}],10:[function(require,module,exports){
'use strict';

var layersTech = {};

//Technology map layers
layersTech['No fixed 25 Mbps/3 Mbps providers'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_numprov_0',
    styles: 'bpr_dec2016_numprov_0',
    color: '#ffffcc',
    zIndex: 11
};

layersTech['FTTP'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_tech_fiber',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 11
};

layersTech['Cable modem'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_tech_cable',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 12
};

layersTech['DSL (inc. FTTN), other copper'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_tech_adsl',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 13
};

layersTech['Fixed wireless'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_tech_fw',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 14
};

layersTech['Satellite'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_tech_sat',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 15
};

layersTech['Other'] = {
    format: 'image/png',
    transparent: true,
    layers: 'bpr_apr2017_tech_other',
    styles: 'bpr_dec2016_tech',
    color: '#6e016b',
    zIndex: 16
};

module.exports = layersTech;

},{}],11:[function(require,module,exports){
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

            if (loc === '') {
                alert('Please enter a valid address.');
                return;
            }

            BPRMap.geocoder.query(loc, codeMap);

            function codeMap(err, data) {
                if (data.results.features.length === 0) {
                    alert("The address provided could not be found. Please enter a new address.");
                    return;
                }
                BPRMap.lat = data.latlng[0];
                BPRMap.lon = data.latlng[1];

                BPRMap.getCounty(BPRMap.lat, BPRMap.lon);                
            }
        },
        search_decimal: function() {
            BPRMap.lat = $('#latitude').val().replace(/ +/g, '');
            BPRMap.lon = $('#longitude').val().replace(/ +/g, '');

            if (BPRMap.lat === '' || BPRMap.lon === '') {
                alert('Please enter a valid latitude and longitude.');
                return;
            }

            if (!BPRMap.lat.match(/^-?\d+\.?\d*$/) || !BPRMap.lon.match(/^-?\d+\.?\d*$/)) {
                alert('Invalid latitude or longitude value.');
                return;
            }
            if (Math.abs(BPRMap.lat) > 90 || Math.abs(BPRMap.lon) > 180) {
                alert('Latitude or longitude value is out of range.');
                return;
            }

            BPRMap.getCounty(BPRMap.lat, BPRMap.lon);            
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
                $('#coord-search, #btn-coordSearch').addClass('hide');
                $('#location-search, #btn-locSearch').removeClass('hide');

                $('#latitude, #longitude').val('');

                $('#btn-label').text('Address');
            } else if (search === 'latlon-decimal') {
                $('#coord-search, #btn-coordSearch').removeClass('hide');

                $('#location-search, #btn-locSearch').addClass('hide');
                $('#location-search').val('');

                if ($('[data-value="latlon-decimal"]').find('.hidden-sm').is(':visible')) {
                    $('#btn-label').text('Coordinates');    
                } else {
                    $('#btn-label').text('Coord.');
                }
                
            }
        }
    };

    module.exports = MapSearch;

},{"./map.js":12}],12:[function(require,module,exports){
'use strict';

var Hash = require('./hash.js');

var tableProviders = require('./table-providers.js');
var tableDemog = require('./table-demographics.js');
var chartDemog = require('./chart-demographics.js');
var chartFixed = require('./chart-fixed.js');
var chartNWFixed = require('./chart-fixedNationwide.js');
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
        BPRMap.map.on('zoomend', function() {
            Hash.update(BPRMap);
        });

        if (Hash.hasHash()) {
            BPRMap.getCounty(BPRMap.lat, BPRMap.lon);

            // use zoom value from hash only on initial page load
            BPRMap.hashZoom = true;
        }

        // toggle map container width
        $('.control-full').on('click', 'a', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('header .container, header .container-fluid, main')
                .toggleClass('container container-fluid')
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function() {
                        BPRMap.map.invalidateSize();
                        $('#table-providers').DataTable().columns.adjust().draw();
                    });
        });

    },
    createMap: function() {
        var maxzoom = 15;
        var minzoom = 3;
        var baseLayer = {};
        var layerControl;
        var layerPath = window.page;

        BPRMap.mapLayer = {};

        BPRMap.geoURL = window.GEOHOST + '/wms?tiled=true';

        L.mapbox.accessToken = 'pk.eyJ1IjoiZmNjIiwiYSI6InBiaGMyLU0ifQ.LOmVYpUCFv2yWpbvxDdQNg';
        BPRMap.map = L.mapbox.map('map-container').setView([BPRMap.lat, BPRMap.lon], BPRMap.zoom);

        BPRMap.map.attributionControl.addAttribution('<a href="http://fcc.gov">FCC</a>');

        //move Mapbox logo to top right
        $('#map-container').find('.leaflet-bottom.leaflet-left').toggleClass('leaflet-bottom leaflet-left leaflet-top leaflet-right');

        //base layers
        baseLayer.Street = L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10').addTo(BPRMap.map);
        baseLayer.Satellite = L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v11');
        baseLayer.Terrain = L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-v9');

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

        BPRMap.geocoder = L.mapbox.geocoder('mapbox.places-v1');

        BPRMap.createLegend(layerPath);

        chartNWFixed.init();

        if (Hash.hasHash() === false) {
            chartSpeed.init('nw');
        }

        $('.leaflet-control-zoom-in, .leaflet-control-zoom-out').click(function() {
            Hash.update(BPRMap);
        });

    }, //end createMap
    createLegend: function(layerPath) {
        var li = '';
        var count = 0;

        for (var key in layers[layerPath]) {
            li += '<li>';
            li += '<input id="chk' + count + '" type="checkbox" data-layer="' + key + '" checked> ';
            li += '<div class="key-symbol" style="background-color:' + layers[layerPath][key].color + '"></div> ';
            li += '<label for="chk' + count + '">' + key + '</label>';
            li += '</li>';

            count++;
        }

        $('.map-legend')
            .find('ul').prepend(li)
            .end()
            .on('click', '[type=checkbox]', function() {
                var layerName = $(this).attr('data-layer');

                if (this.checked) {
                    BPRMap.mapLayer[layerName].addTo(BPRMap.map);
                } else {
                    BPRMap.map.removeLayer(BPRMap.mapLayer[layerName]);
                }

            });

        // Technology Map show legend
        $('#btn-closeLegend').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('.map-legend').hide('fast');
        });

        // Technology Map hide legend
        $('#btn-openLegend').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('.map-legend').show('fast');
        });
    },
    update: function(e) {
        BPRMap.lat = Math.round(1000000 * e.latlng.lat) / 1000000.0;
        BPRMap.lon = Math.round(1000000 * e.latlng.lng) / 1000000.0;
        
        // Fix lon when navigating between East/West hemispheres
        if (BPRMap.lon < -180) {
            BPRMap.lon = BPRMap.lon + 360;
        }

        if (BPRMap.lon > 180) {
            BPRMap.lon = BPRMap.lon - 360;
        }

        BPRMap.getCounty(BPRMap.lat, BPRMap.lon);

    }, //end update
    getCounty: function(lat, lon) {
        var geoURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_apr2017_county&maxFeatures=1&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';

        $.ajax({
            type: 'GET',
            url: geoURL
        }).done(function(data) {
            BPRMap.showCounty(data);            
        }).fail(function(){
            alert('Unable to access county data.');
        });
    }, //end getCounty
    showCounty: function(data) {
        var countyData;

        if (data.features.length === 0) {
            alert('No county data found at the seleted location. Please select a new location.');

            return;
        } else {
            countyData = data.features[0].properties;

            if ($('#tabInstructs').is(':visible')) {
                $('#tabInstructs, #nwFixed').addClass('hide');
                $('#fixed, #provider, #demographics').removeClass('hide');
            }
        }

        var id = data.features[0].id.replace(/\..*$/, '');

        if (id !== 'bpr_apr2017_county') {
            return;
        }

        if (BPRMap.map.hasLayer(clickedCountyLayer)) {
            BPRMap.map.removeLayer(clickedCountyLayer);
        }

        clickedCountyLayer = L.mapbox.featureLayer(data).setStyle(clickedCountyStyle).addTo(BPRMap.map);

        // use zoom value from hash only on initial page load
        if (BPRMap.hashZoom) {
            BPRMap.map.setView([BPRMap.lat, BPRMap.lon], BPRMap.zoom);
            BPRMap.hashZoom = false;
        } else if (countyLayerData.features.length === 0 || countyLayerData.features[0].properties.county_fips !== data.features[0].properties.county_fips) {
            BPRMap.map.fitBounds(clickedCountyLayer.getBounds());
        }

        clickedCountyLayer.on('click', function(e) {
            BPRMap.update(e);
        });

        countyLayerData = data;

        BPRMap.getBlock(BPRMap.lat, BPRMap.lon);

        tableDemog.create(countyData);
        chartDemog.init(countyData.county_fips, countyData);
        chartFixed.init(countyData.county_fips);
        chartSpeed.init(countyData.county_fips);

    }, //end showCounty
    getBlock: function(lat, lon) {
        var geoURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017&maxFeatures=100&outputFormat=application/json&cql_filter=contains(geom,%20POINT(' + lon + '%20' + lat + '))';

        $.ajax({
            type: 'GET',
            url: geoURL
        }).done(function(data) {
            BPRMap.showBlock(data);            
        }).fail(function(){
            alert('Unable to access block data.');
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

},{"./chart-demographics.js":2,"./chart-fixed.js":3,"./chart-fixedNationwide.js":4,"./chart-speed.js":5,"./hash.js":6,"./layers-deployment.js":7,"./layers-providers.js":8,"./layers-speed.js":9,"./layers-tech.js":10,"./table-demographics.js":13,"./table-providers.js":15}],13:[function(require,module,exports){
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

},{"./utility.js":16}],14:[function(require,module,exports){
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
        var nwAveURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_apr2017_nw_average&maxFeatures=100&outputFormat=application/json';

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
            'paging': false,
            'searching': false
        });

        function addCols() {
            var tableRows = $('#table-nwAve').find('tbody>tr');

            tableRows.each(function(index, elm) {
                if ($(elm).hasClass('odd')) {
                    $(elm).prepend('<th class="rowHeading">Without Access</th>');
                } else {
                    $(elm).prepend('<th class="rowHeading">With Access</th>');
                }
            });

            tableRows.eq(0).before('<tr><th colspan="7" scope="col">United States (All Areas)</th></tr>');
            tableRows.eq(1).after('<tr><th class="subHeading" colspan="7" scope="row">Rural Areas</th></tr>');
            tableRows.eq(3).after('<tr><th class="subHeading" colspan="7" scope="row">Urban Areas</th></tr>');

            tableRows.eq(5).after('<tr><th colspan="7" scope="col">Tribal Lands</th></tr>');
            tableRows.eq(7).after('<tr><th class="subHeading" colspan="7" scope="row">Rural Areas</th></tr>');
            tableRows.eq(9).after('<tr><th class="subHeading" colspan="7" scope="row">Urban Areas</th></tr>');

            tableRows.eq(11).after('<tr><th colspan="7" scope="col">U.S. Territories</th></tr>');
            tableRows.eq(13).after('<tr><th class="subHeading" colspan="7" scope="row">Rural Areas</th></tr>');
            tableRows.eq(15).after('<tr><th class="subHeading" colspan="7" scope="row">Urban Areas</th></tr>');
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

                // format values
                if (arr[j] === 'percap_w' || arr[j] === 'percap_wo' || arr[j] === 'hinc_w' || arr[j] === 'hinc_wo') {
                    tempObj[colName] = '$' + utility.formatComma(popData[propName].toFixed(2));
                } else if (arr[j] === 'povrat_w' || arr[j] === 'povrat_wo') {
                    tempObj[colName] = utility.formatComma(popData[propName].toFixed(2)) + '%';
                }
                else {
                    tempObj[colName] = utility.formatComma(popData[propName].toFixed(2));
                }
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

},{"./utility.js":16}],15:[function(require,module,exports){
'use strict';

var tableProviders = {
    getData: function(blockFips) {
        var providersURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_apr2017_providers&maxFeatures=100&outputFormat=application/json&cql_filter=block_fips=%27' + blockFips + '%27';

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
        
        // adjust fixed Datatable header width
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            if ($(e.target).attr('href') === '#provider') {
                $('#table-providers').DataTable().columns.adjust().draw();
            }
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';

var validate = {
    coord: function(lat, lon, zoom) {
        var zoomVal = zoom;

        if (lat === '' || lon === '') {
            return false;
        }

        if (!lat.match(/^-?\d+\.?\d*$/) || !lon.match(/^-?\d+\.?\d*$/)) {
            return false;
        }

        if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
            return false;
        }

        if (zoomVal > 15 || zoomVal < 3 || isNaN(zoomVal)) { 
            return false;
        }       

        return true;
    }
};

module.exports = validate;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL2NoYXJ0LWRlbW9ncmFwaGljcy5qcyIsInNyYy9qcy9tb2R1bGVzL2NoYXJ0LWZpeGVkLmpzIiwic3JjL2pzL21vZHVsZXMvY2hhcnQtZml4ZWROYXRpb253aWRlLmpzIiwic3JjL2pzL21vZHVsZXMvY2hhcnQtc3BlZWQuanMiLCJzcmMvanMvbW9kdWxlcy9oYXNoLmpzIiwic3JjL2pzL21vZHVsZXMvbGF5ZXJzLWRlcGxveW1lbnQuanMiLCJzcmMvanMvbW9kdWxlcy9sYXllcnMtcHJvdmlkZXJzLmpzIiwic3JjL2pzL21vZHVsZXMvbGF5ZXJzLXNwZWVkLmpzIiwic3JjL2pzL21vZHVsZXMvbGF5ZXJzLXRlY2guanMiLCJzcmMvanMvbW9kdWxlcy9tYXAtc2VhcmNoLmpzIiwic3JjL2pzL21vZHVsZXMvbWFwLmpzIiwic3JjL2pzL21vZHVsZXMvdGFibGUtZGVtb2dyYXBoaWNzLmpzIiwic3JjL2pzL21vZHVsZXMvdGFibGUtbndBdmUuanMiLCJzcmMvanMvbW9kdWxlcy90YWJsZS1wcm92aWRlcnMuanMiLCJzcmMvanMvbW9kdWxlcy91dGlsaXR5LmpzIiwic3JjL2pzL21vZHVsZXMvdmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgQlBSTWFwID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcC5qcycpO1xyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXAtc2VhcmNoLmpzJyk7XHJcbiAgICB2YXIgdGFibGVOV0F2ZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy90YWJsZS1ud0F2ZS5qcycpO1xyXG4gICAgdmFyIHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCdcXFxcJykucG9wKCkuc3BsaXQoJy8nKS5wb3AoKS5zcGxpdCgnLicpWzBdO1xyXG5cclxuICAgIHdpbmRvdy5HRU9IT1NUID0gJ2h0dHBzOi8vZ2VvLmZjYy5nb3YvZmNjJzsgXHJcbiAgICBcclxuICAgIGlmIChwYXRobmFtZSA9PT0gJycgfHwgcGF0aG5hbWUgPT09ICdpbmRleCcpIHtcclxuICAgICAgICB3aW5kb3cucGFnZSA9ICdkZXBsb3ltZW50JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LnBhZ2UgPSBwYXRobmFtZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gc2V0IGFjdGl2ZSBtYWluIG5hdiBsaW5rXHJcbiAgICBpZiAod2luZG93LnBhZ2UgPT09ICdkZXBsb3ltZW50Jykge1xyXG4gICAgICAgICQoJ1tocmVmPVwiaW5kZXguaHRtbFwiXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCgnW2hyZWY9XCInICsgd2luZG93LnBhZ2UgKyAnLmh0bWxcIl0nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW5pdGlhbGl6ZSBtYXAgc2VhcmNoXHJcbiAgICBpZiAoJCgnI21hcCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBCUFJNYXAuaW5pdCgpO1xyXG4gICAgICAgIE1hcFNlYXJjaC5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGlzcGxheSBOYXRpb253aWRlIHRhYmxlIGlmIGF2YWlsYWJsZVxyXG4gICAgaWYgKCQoJyN0YWJsZS1ud0F2ZScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0YWJsZU5XQXZlLmdldERhdGEoKTtcclxuICAgIH1cclxuXHJcbn0oKSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydE9wdHMgPSB7XHJcbiAgICBsYWJlbHM6IFtcclxuICAgICAgICAnVXJiYW4nLFxyXG4gICAgICAgICdSdXJhbCdcclxuICAgIF0sXHJcbiAgICBkYXRhc2V0czogW3tcclxuICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFtcclxuICAgICAgICAgICAgJyMzRDU5RDcnLFxyXG4gICAgICAgICAgICAnIzcxREFENidcclxuICAgICAgICBdXHJcbiAgICB9XVxyXG59O1xyXG5cclxudmFyIGNoYXJ0RGVtb2cgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihjb3VudHlfZmlwcywgZGF0YSkge1xyXG4gICAgICAgIC8vc2hvdyBjaGFydCBpZiBpdCBleGlzdHMgb24gdGhlIHBhZ2VcclxuICAgICAgICBpZiAoJCgnI2NoYXJ0RGVtb2cnKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9pZiBjb3VudHkgRklQUyBpcyB0aGUgc2FtZSBkb24ndCByZWdlbmVyYXRlIGNoYXJ0XHJcbiAgICAgICAgaWYgKGNvdW50eV9maXBzID09PSBjaGFydERlbW9nLkZJUFMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoYXJ0RGVtb2cuRklQUyA9IGNvdW50eV9maXBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhcnREZW1vZy5jcmVhdGUoZGF0YSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRvbnV0O1xyXG4gICAgICAgIHZhciBjdHhEZW1vZztcclxuICAgICAgICB2YXIgY2hhcnRWYWxzID0gW107XHJcblxyXG4gICAgICAgIHZhciBwb3B1bGF0aW9uID0gZGF0YS5wb3AyMDE1O1xyXG4gICAgICAgIHZhciB1cmJhbnBvcCA9IGRhdGEudXJiYW5wb3A7XHJcbiAgICAgICAgdmFyIHJ1cmFscG9wID0gZGF0YS5ydXJhbHBvcDtcclxuICAgICAgICB2YXIgdXJiYW5wZXI7XHJcbiAgICAgICAgdmFyIHJ1cmFscGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50KGQpIHtcclxuICAgICAgICAgICAgdmFyIHBlcmNlbnRhZ2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcGVyY2VudGFnZSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwZXJjZW50YWdlID0gKDEwMCAqIChkIC8gcG9wdWxhdGlvbikpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwZXJjZW50YWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB1cmJhbnBlciA9IGNhbGNQZXJjZW50KHVyYmFucG9wKTtcclxuICAgICAgICBydXJhbHBlciA9IGNhbGNQZXJjZW50KHJ1cmFscG9wKTtcclxuXHJcbiAgICAgICAgY2hhcnRWYWxzLnB1c2godXJiYW5wZXIpO1xyXG4gICAgICAgIGNoYXJ0VmFscy5wdXNoKHJ1cmFscGVyKTtcclxuXHJcbiAgICAgICAgY2hhcnRPcHRzLmRhdGFzZXRzWzBdLmRhdGEgPSBjaGFydFZhbHM7XHJcblxyXG4gICAgICAgIC8vcmVwbGFjZSBjaGFydCBjYW52YXMgaWYgaXQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAkKCcjY2hhcnREZW1vZycpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnREZW1vZ1wiIHdpZHRoPVwiMzUwXCIgaGVpZ2h0PVwiMjIwXCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBjdHhEZW1vZyA9ICQoJyNjaGFydERlbW9nJyk7XHJcblxyXG4gICAgICAgIGRvbnV0ID0gbmV3IENoYXJ0KGN0eERlbW9nLCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdkb3VnaG51dCcsXHJcbiAgICAgICAgICAgIGRhdGE6IGNoYXJ0T3B0cyxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24odG9vbHRpcEl0ZW1zLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtcy5kYXRhc2V0SW5kZXhdLmRhdGFbdG9vbHRpcEl0ZW1zLmluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5sYWJlbHNbdG9vbHRpcEl0ZW1zLmluZGV4XSArICc6ICcgKyB2YWx1ZSArICclJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnREZW1vZztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNoYXJ0Rml4ZWQgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihjb3VudHlfZmlwcykge1xyXG4gICAgICAgIGNoYXJ0Rml4ZWQuZGF0YSA9IHtcclxuICAgICAgICAgICAgbGFiZWxzOiBbJ0FsbCcsICdVcmJhbicsICdSdXJhbCcsICdUcmliYWwnXSxcclxuICAgICAgICAgICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0ZpeGVkJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZGRTc3MydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdObyBGaXhlZCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyM2Q0JDRDUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9zaG93IENvdW50eSBGaXhlZCBjaGFydCBpZiBpdCBleGlzdHMgb24gdGhlIHBhZ2VcclxuICAgICAgICBpZiAoJCgnI2NoYXJ0Rml4ZWQnKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9pZiBjb3VudHkgRklQUyBpcyB0aGUgc2FtZSBkb24ndCByZWdlbmVyYXRlIGNoYXJ0XHJcbiAgICAgICAgaWYgKGNvdW50eV9maXBzID09PSBjaGFydEZpeGVkLkZJUFMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuRklQUyA9IGNvdW50eV9maXBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhcnRGaXhlZC5nZXRDb3VudHlEYXRhKGNvdW50eV9maXBzKTtcclxuICAgIH0sXHJcbiAgICBnZXRDb3VudHlEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYWxsQ250eVVSTCA9IHdpbmRvdy5HRU9IT1NUICsgJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9hcHIyMDE3X2NvdW50eV9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0Rml4ZWQuRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBhbGxDbnR5VVJMXHJcbiAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLmdldFVSRGF0YSgpO1xyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBhY2Nlc3MgY291bnR5IGRhdGEuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VVJEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJVUkwgPSB3aW5kb3cuR0VPSE9TVCArICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWJwcl9hcHIyMDE3X2NvdW50eV91cl9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0Rml4ZWQuRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiB1clVSTFxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICBjaGFydEZpeGVkLnByb2Nlc3NVUkRhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZ2V0VHJpYmFsRGF0YSgpO1xyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBhY2Nlc3MgdXJiYW4gYW5kIHJ1cmFsIGRhdGEuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VHJpYmFsRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRyaWJhbFVSTCA9IHdpbmRvdy5HRU9IT1NUICsgJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2FwcjIwMTdfY291bnR5X3RyaWJhbF9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9Y291bnR5X2ZpcHM9JTI3JyArIGNoYXJ0Rml4ZWQuRklQUyArICclMjcnO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiB0cmliYWxVUkxcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY2hhcnRGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGNoYXJ0Rml4ZWQuZGlzcGxheSgpO1xyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBhY2Nlc3MgdHJpYmFsIGRhdGEuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc1VSRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgZGF0YUxlbiA9IGRhdGEuZmVhdHVyZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdXJiYW5EYXRhID0ge307XHJcbiAgICAgICAgdmFyIHJ1cmFsRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMgPSBbXTtcclxuICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChpOyBpIDwgZGF0YUxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnVyYmFuX3J1cmFsKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxyXG4gICAgICAgICAgICAgICAgICAgIHJ1cmFsRGF0YS5mZWF0dXJlcy5wdXNoKGRhdGEuZmVhdHVyZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydEZpeGVkLnVwZGF0ZSh1cmJhbkRhdGEpO1xyXG4gICAgICAgIGNoYXJ0Rml4ZWQudXBkYXRlKHJ1cmFsRGF0YSk7XHJcblxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgZml4ZWREYXRhID0gY2hhcnRGaXhlZC5kYXRhLmRhdGFzZXRzWzBdLmRhdGE7XHJcbiAgICAgICAgdmFyIG5vRml4ZWREYXRhID0gY2hhcnRGaXhlZC5kYXRhLmRhdGFzZXRzWzFdLmRhdGE7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaCgwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmhhc19maXhlZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QudG9GaXhlZCgyKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdCA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgZml4ZWREYXRhLnB1c2goZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnBvcF9wY3QudG9GaXhlZCgyKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdCA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkaXNwbGF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY3R4Rml4ZWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9yZXBsYWNlIGNoYXJ0IGNhbnZhcyBpZiBpdCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICQoJyNjaGFydEZpeGVkJykucmVwbGFjZVdpdGgoJzxjYW52YXMgaWQ9XCJjaGFydEZpeGVkXCIgd2lkdGg9XCIzNTBcIiBoZWlnaHQ9XCIyNTVcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAkKCcuY2hhcnRqcy1oaWRkZW4taWZyYW1lJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBjaGFydFxyXG4gICAgICAgIGN0eEZpeGVkID0gJCgnI2NoYXJ0Rml4ZWQnKTtcclxuICAgICAgICBjaGFydEZpeGVkLmNoYXJ0ID0gbmV3IENoYXJ0KGN0eEZpeGVkLCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICBkYXRhOiBjaGFydEZpeGVkLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnQXJlYSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIHlBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6ICdQb3B1bGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24odG9vbHRpcEl0ZW1zLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbXMuZGF0YXNldEluZGV4XS5sYWJlbCArICc6ICcgKyB0b29sdGlwSXRlbXMueUxhYmVsICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Rml4ZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydE5XRml4ZWQgPSB7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgbGFiZWxzOiBbJ0FsbCcsICdVcmJhbicsICdSdXJhbCcsICdUcmliYWwnXSxcclxuICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgbGFiZWw6ICdGaXhlZCcsXHJcbiAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZFNzczJ1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgbGFiZWw6ICdObyBGaXhlZCcsXHJcbiAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNkNCQ0Q1J1xyXG4gICAgICAgIH1dXHJcbiAgICB9LFxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9zaG93IE5hdGlvbndpZGUgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydE5XRml4ZWQnKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVmlldyBOYXRpb253aWRlIGxpbmtcclxuICAgICAgICAkKCcuc2VjdC1maXhlZCcpLm9uKCdjbGljaycsICcubGluay1udycsIGZ1bmN0aW9uKGUpIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgJCgnI3RhYkluc3RydWN0cywgI253Rml4ZWQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAkKCcjZml4ZWQsICNwcm92aWRlciwgI2RlbW9ncmFwaGljcycpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNidG4tbmF0aW9uTG9jYXRpb24nKS5jbGljaygpO1xyXG5cclxuICAgICAgICAgICAgJCgnLnNlYXJjaC1maWVsZCcpLmZpbmQoJ2lucHV0JykudmFsKCcnKTtcclxuXHJcbiAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5kYXRhLmRhdGFzZXRzWzBdLmRhdGEgPSBbXTtcclxuICAgICAgICAgICAgY2hhcnROV0ZpeGVkLmRhdGEuZGF0YXNldHNbMV0uZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICBjaGFydE5XRml4ZWQuZ2V0TldEYXRhKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoYXJ0TldGaXhlZC5nZXROV0RhdGEoKTtcclxuICAgIH0sXHJcbiAgICBnZXROV0RhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBud1VSTCA9IHdpbmRvdy5HRU9IT1NUICsgJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9ZmNjOmJwcl9hcHIyMDE3X253X2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24nO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiBud1VSTCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5nZXRVcmJhbkRhdGEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFVyYmFuRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHVyYmFuVVJMID0gd2luZG93LkdFT0hPU1QgKyAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfYXByMjAxN19ud191cl9mbmYmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogdXJiYW5VUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC5wcm9jZXNzVVJEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY2hhcnROV0ZpeGVkLmdldFRyaWJhbChkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFRyaWJhbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRyaWJhbFVSTCA9IHdpbmRvdy5HRU9IT1NUICsgJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2FwcjIwMTdfbndfdHJpYmFsX2ZuZiZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24nO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiB0cmliYWxVUkwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0TldGaXhlZC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjaGFydE5XRml4ZWQuZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc1VSRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgZGF0YUxlbiA9IGRhdGEuZmVhdHVyZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdXJiYW5EYXRhID0ge307XHJcbiAgICAgICAgdmFyIHJ1cmFsRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMgPSBbXTtcclxuICAgICAgICBydXJhbERhdGEuZmVhdHVyZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChpOyBpIDwgZGF0YUxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnVyYmFuX3J1cmFsKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgICAgICB1cmJhbkRhdGEuZmVhdHVyZXMucHVzaChkYXRhLmZlYXR1cmVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxyXG4gICAgICAgICAgICAgICAgICAgIHJ1cmFsRGF0YS5mZWF0dXJlcy5wdXNoKGRhdGEuZmVhdHVyZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFydE5XRml4ZWQudXBkYXRlKHVyYmFuRGF0YSk7XHJcbiAgICAgICAgY2hhcnROV0ZpeGVkLnVwZGF0ZShydXJhbERhdGEpO1xyXG5cclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgZml4ZWREYXRhID0gY2hhcnROV0ZpeGVkLmRhdGEuZGF0YXNldHNbMF0uZGF0YTtcclxuICAgICAgICB2YXIgbm9GaXhlZERhdGEgPSBjaGFydE5XRml4ZWQuZGF0YS5kYXRhc2V0c1sxXS5kYXRhO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuaGFzX2ZpeGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgbm9GaXhlZERhdGEucHVzaChkYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMucG9wX3BjdC50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy50eXBlX3BvcF9wY3QgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZERhdGEucHVzaCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkRGF0YS5wdXNoKGRhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5wb3BfcGN0LnRvRml4ZWQoMikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLnR5cGVfcG9wX3BjdCA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vRml4ZWREYXRhLnB1c2goMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhOV0ZpeGVkO1xyXG5cclxuICAgICAgICAvL3JlcGxhY2UgY2hhcnQgY2FudmFzIGlmIGl0IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgJCgnI2NoYXJ0TldGaXhlZCcpLnJlcGxhY2VXaXRoKCc8Y2FudmFzIGlkPVwiY2hhcnROV0ZpeGVkXCIgd2lkdGg9XCIzNTBcIiBoZWlnaHQ9XCIyNTVcIj48L2NhbnZhcz4nKTtcclxuICAgICAgICAkKCcuY2hhcnRqcy1oaWRkZW4taWZyYW1lJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBjaGFydFxyXG4gICAgICAgIGN0eE5XRml4ZWQgPSAkKCcjY2hhcnROV0ZpeGVkJyk7XHJcbiAgICAgICAgY2hhcnROV0ZpeGVkLmNoYXJ0ID0gbmV3IENoYXJ0KGN0eE5XRml4ZWQsIHtcclxuICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgIGRhdGE6IGNoYXJ0TldGaXhlZC5kYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ0FyZWEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnUG9wdWxhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtcywgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1zLmRhdGFzZXRJbmRleF0ubGFiZWwgKyAnOiAnICsgdG9vbHRpcEl0ZW1zLnlMYWJlbCArICclJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydE5XRml4ZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjaGFydFNwZWVkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY291bnR5X2ZpcHMpIHtcclxuICAgICAgICBjaGFydFNwZWVkLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWycwLjInLCAnMTAvMScsICcyNS8zJywgJzUwLzUnLCAnMTAwLzEwJ10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcwJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmY2MnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcxJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZGNjOGEnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcyJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmYzhkNTknLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICczJyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNkNzMwMWYnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBvbmx5IHNob3cgY2hhcnQgaWYgaXQgZXhpc3RzIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgaWYgKCQoJyNjaGFydFNwZWVkJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGNvdW50eSBGSVBTIGlzIHRoZSBzYW1lIGRvbid0IHJlZ2VuZXJhdGUgY2hhcnRcclxuICAgICAgICBpZiAoY291bnR5X2ZpcHMgPT09IGNoYXJ0U3BlZWQuRklQUykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hhcnRTcGVlZC5GSVBTID0gY291bnR5X2ZpcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzaG93IE5hdGlvbndpZGUgY2hhcnRcclxuICAgICAgICAkKCcuc2VjdC1zcGVlZCcpLm9uKCdjbGljaycsICcubGluay1udycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjaGFydFNwZWVkLmluaXQoJ253Jyk7XHJcbiAgICAgICAgICAgICQoJy5zZWN0LXNwZWVkJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgJCgnLnNlY3Qtc3BlZWROVycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQoJyNidG4tbmF0aW9uTG9jYXRpb24nKS5jbGljaygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjaGFydFNwZWVkLmdldFRlY2goKTtcclxuICAgIH0sXHJcbiAgICBnZXRUZWNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BlZWRVUkwgPSB3aW5kb3cuR0VPSE9TVCArICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWJwcl9hcHIyMDE3X3JlZnJlc2hfY291bnR5Jm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvdW50eV9maXBzPSUyNycgKyBjaGFydFNwZWVkLkZJUFMgKyAnJTI3JztcclxuICAgICAgICB2YXIgc3BlZWROV1VSTCA9IHdpbmRvdy5HRU9IT1NUICsgJy9vd3M/c2VydmljZT1XRlMmdmVyc2lvbj0xLjAuMCZyZXF1ZXN0PUdldEZlYXR1cmUmdHlwZU5hbWU9YnByX2FwcjIwMTdfcmVmcmVzaF9uYXRpb24mbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogY2hhcnRTcGVlZC5GSVBTID09PSAnbncnID8gc3BlZWROV1VSTCA6IHNwZWVkVVJMXHJcbiAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGNoYXJ0U3BlZWQudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICBjaGFydFNwZWVkLmRpc3BsYXkoKTtcclxuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdVbmFibGUgdG8gYWNjZXNzIGNoYXJ0IGRhdGEuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIHRlY2hEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciB0ZWNoVHlwZXMgPSBbJzIwMCcsICcxMCcsICcyNScsICc1MCcsICcxMDAnXTtcclxuICAgICAgICB2YXIgZGF0YXNldHMgPSBjaGFydFNwZWVkLmRhdGEuZGF0YXNldHM7XHJcblxyXG4gICAgICAgIHZhciBwcm9wTmFtZSA9ICcnO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHMoYXJyKSB7XHJcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaGFydFNwZWVkLmRhdGEuZGF0YXNldHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BOYW1lID0gJ3NwZWVkXycgKyB0ZWNoVHlwZXNbaV0gKyAnXycgKyBqO1xyXG4gICAgICAgICAgICAgICAgZGF0YXNldHNbal0uZGF0YS5wdXNoKCgxMDAgKiB0ZWNoRGF0YVtwcm9wTmFtZV0pLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGVjaFR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdldFZhbHModGVjaFR5cGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdHhUZWNoO1xyXG4gICAgICAgIHZhciBjaGFydElEO1xyXG5cclxuICAgICAgICBpZiAoY2hhcnRTcGVlZC5GSVBTID09PSAnbncnKSB7XHJcbiAgICAgICAgICAgIGNoYXJ0SUQgPSAnY2hhcnRTcGVlZE5XJztcclxuXHJcbiAgICAgICAgICAgICQoJy5zZWN0LXNwZWVkJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgJCgnLnNlY3Qtc3BlZWROVycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hhcnRJRCA9ICdjaGFydFNwZWVkJztcclxuXHJcbiAgICAgICAgICAgICQoJy5zZWN0LXNwZWVkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgJCgnLnNlY3Qtc3BlZWROVycpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3JlcGxhY2UgY2hhcnQgY2FudmFzIGlmIGl0IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgJCgnIycgKyBjaGFydElEKS5yZXBsYWNlV2l0aCgnPGNhbnZhcyBpZD1cIicgKyBjaGFydElEICsgJ1wiIHdpZHRoPVwiMzUwXCIgaGVpZ2h0PVwiMjU1XCI+PC9jYW52YXM+Jyk7XHJcbiAgICAgICAgJCgnLmNoYXJ0anMtaGlkZGVuLWlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgY2hhcnRzXHJcbiAgICAgICAgY3R4VGVjaCA9ICQoJyMnICsgY2hhcnRJRCk7XHJcbiAgICAgICAgY2hhcnRTcGVlZC5jaGFydCA9IG5ldyBDaGFydChjdHhUZWNoLCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICBkYXRhOiBjaGFydFNwZWVkLmRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnU3BlZWQgKE1icHMgZG93bnN0cmVhbS91cHN0cmVhbSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnJSBQb3B1bGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwU2l6ZTogMjBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1NwZWVkOiAnICsgdG9vbHRpcEl0ZW1bMF0ueExhYmVsICsgJ01icHMvMSBNYnBzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyMgUHJvdmlkZXJzOiAnICsgZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlckxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdQb3B1bGF0aW9uOiAnICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0U3BlZWQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBWYWxpZGF0ZSA9IHJlcXVpcmUoJy4vdmFsaWRhdGUuanMnKTtcclxuXHJcbnZhciBIYXNoID0ge1xyXG4gICAgcGFyYW1zOiB7fSxcclxuICAgIGhhc0hhc2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaGFzaCA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0sIFxyXG4gICAgZ2V0OiBmdW5jdGlvbihCUFJNYXApIHtcclxuICAgICAgICB2YXIgaGFzaCA9IGRlY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbi5oYXNoKTtcclxuXHJcbiAgICAgICAgLy9tYXAgbGF0LCBsb24sIHpvb21cclxuICAgICAgICB2YXIgbGF0SGFzaCA9IGhhc2gubWF0Y2goL2xhdD0oW14mXSspL2kpO1xyXG4gICAgICAgIHZhciBsb25IYXNoID0gaGFzaC5tYXRjaCgvbG9uPShbXiZdKykvaSk7XHJcbiAgICAgICAgdmFyIHpvb21IYXNoID0gaGFzaC5tYXRjaCgvem9vbT0oW14mXSspL2kpO1xyXG5cclxuICAgICAgICBpZiAobGF0SGFzaCA9PT0gbnVsbCB8fCBsb25IYXNoID09PSBudWxsIHx8IHpvb21IYXNoID09PSBudWxsIHx8ICFWYWxpZGF0ZS5jb29yZChsYXRIYXNoWzFdLCBsb25IYXNoWzFdLCB6b29tSGFzaFsxXSkpIHtcclxuICAgICAgICAgICAgQlBSTWFwLmxhdCA9IEJQUk1hcC5sYXQ7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sb24gPSBCUFJNYXAubG9uO1xyXG4gICAgICAgICAgICBCUFJNYXAuem9vbSA9IEJQUk1hcC56b29tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBsYXRIYXNoWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJyk7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sb24gPSBsb25IYXNoWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJyk7XHJcbiAgICAgICAgICAgIEJQUk1hcC56b29tID0gem9vbUhhc2hbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKEJQUk1hcCkge1xyXG5cclxuICAgICAgICAvL21hcCBsYXQsIGxvbiwgem9vbVxyXG4gICAgICAgIEJQUk1hcC56b29tID0gQlBSTWFwLm1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgSGFzaC5wYXJhbXMubGF0ID0gQlBSTWFwLmxhdDtcclxuICAgICAgICBIYXNoLnBhcmFtcy5sb24gPSBCUFJNYXAubG9uO1xyXG4gICAgICAgIEhhc2gucGFyYW1zLnpvb20gPSBCUFJNYXAuem9vbTtcclxuICAgICAgIFxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJC5wYXJhbShIYXNoLnBhcmFtcyk7XHJcblxyXG4gICAgfSxcclxuICAgIGNoYW5nZTogZnVuY3Rpb24oQlBSTWFwKSB7XHJcbiAgICBcdEhhc2guZ2V0KEJQUk1hcCk7ICAgIFx0XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzRGVwbG95bWVudCA9IHt9O1xyXG5cclxuLy9EZXBsb3ltZW50IG1hcCBsYXllcnNcclxubGF5ZXJzRGVwbG95bWVudFsnRml4ZWQgYnJvYWRiYW5kIDI1LzMgKE1icHMpJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN19jb3VudHlfbGF5ZXJfZml4ZWQnLFxyXG4gICAgc3R5bGVzOiAnYnByX2xheWVyX2ZpeGVkXzEnLFxyXG4gICAgY29sb3I6ICcjRkZFNzczJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc0RlcGxveW1lbnRbJ05vIGZpeGVkIGJyb2FkYmFuZCAyNS8zIChNYnBzKSddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2FwcjIwMTdfY291bnR5X2xheWVyX25vbmZpeGVkJyxcclxuICAgIHN0eWxlczogJ2Jwcl9sYXllcl9maXhlZF8wJyxcclxuICAgIGNvbG9yOiAnIzZDQkNENScsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc0RlcGxveW1lbnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBsYXllcnNQcm92aWRlcnMgPSB7fTtcclxuXHJcbi8vUHJvdmlkZXJzIG1hcCBsYXllcnNcclxubGF5ZXJzUHJvdmlkZXJzWydObyBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X251bXByb3ZfMCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzAnLFxyXG4gICAgY29sb3I6ICcjZmZmZmNjJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snT25lIGZpeGVkIDI1IE1icHMvMyBNYnBzIHByb3ZpZGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN19udW1wcm92XzEnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8xJyxcclxuICAgIGNvbG9yOiAnI2ZkY2M4YScsXHJcbiAgICB6SW5kZXg6IDEyXHJcbn07XHJcblxyXG5sYXllcnNQcm92aWRlcnNbJ1R3byBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X251bXByb3ZfMicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzInLFxyXG4gICAgY29sb3I6ICcjZmM4ZDU5JyxcclxuICAgIHpJbmRleDogMTNcclxufTtcclxuXHJcbmxheWVyc1Byb3ZpZGVyc1snVGhyZWUgb3IgbW9yZSBmaXhlZCAyNSBNYnBzLzMgTWJwcyBwcm92aWRlcnMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X251bXByb3ZfMycsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9udW1wcm92XzMnLFxyXG4gICAgY29sb3I6ICcjZDczMDFmJyxcclxuICAgIHpJbmRleDogMTRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJzUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzU3BlZWQgPSB7fTtcclxuXHJcbi8vU3BlZWQgbWFwIGxheWVyc1xyXG5cclxubGF5ZXJzU3BlZWRbJ05vIHJlc2lkZW50aWFsIHNlcnZpY2VzIGF0IDIwMCBrYnBzIG9yIGFib3ZlJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN19zcGVlZF9sdF8yMDAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWRfbHRfMjAwJyxcclxuICAgIGNvbG9yOiAnI2ZmZmZjYycsXHJcbiAgICB6SW5kZXg6IDEwXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgc2VydmljZXMgb2YgYXQgbGVhc3QgMjAwIGticHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X3NwZWVkMjAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMjAwJyxcclxuICAgIGNvbG9yOiAnI2M3ZTliNCcsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwIE1icHMvMSBNYnBzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN19zcGVlZDEwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAnLFxyXG4gICAgY29sb3I6ICcjN2ZjZGJiJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1NwZWVkWydSZXNpZGVudGlhbCBicm9hZGJhbmQgb2YgYXQgbGVhc3QgMjUgTWJwcy8zIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X3NwZWVkMjUnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfc3BlZWQyNScsXHJcbiAgICBjb2xvcjogJyNiZGQ3ZTcnLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzU3BlZWRbJ1Jlc2lkZW50aWFsIGJyb2FkYmFuZCBvZiBhdCBsZWFzdCA1MCBNYnBzLzUgTWJwcyddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2FwcjIwMTdfc3BlZWQ1MCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl9zcGVlZDUwJyxcclxuICAgIGNvbG9yOiAnIzMxODJiZCcsXHJcbiAgICB6SW5kZXg6IDE0XHJcbn07XHJcblxyXG5sYXllcnNTcGVlZFsnUmVzaWRlbnRpYWwgYnJvYWRiYW5kIG9mIGF0IGxlYXN0IDEwMCBNYnBzLzEwIE1icHMnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X3NwZWVkMTAwJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3NwZWVkMTAwJyxcclxuICAgIGNvbG9yOiAnIzA4MzA2YicsXHJcbiAgICB6SW5kZXg6IDE1XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1NwZWVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbGF5ZXJzVGVjaCA9IHt9O1xyXG5cclxuLy9UZWNobm9sb2d5IG1hcCBsYXllcnNcclxubGF5ZXJzVGVjaFsnTm8gZml4ZWQgMjUgTWJwcy8zIE1icHMgcHJvdmlkZXJzJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN19udW1wcm92XzAnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfbnVtcHJvdl8wJyxcclxuICAgIGNvbG9yOiAnI2ZmZmZjYycsXHJcbiAgICB6SW5kZXg6IDExXHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydGVFRQJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN190ZWNoX2ZpYmVyJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTFcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0NhYmxlIG1vZGVtJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN190ZWNoX2NhYmxlJyxcclxuICAgIHN0eWxlczogJ2Jwcl9kZWMyMDE2X3RlY2gnLFxyXG4gICAgY29sb3I6ICcjNmUwMTZiJyxcclxuICAgIHpJbmRleDogMTJcclxufTtcclxuXHJcbmxheWVyc1RlY2hbJ0RTTCAoaW5jLiBGVFROKSwgb3RoZXIgY29wcGVyJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN190ZWNoX2Fkc2wnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxM1xyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnRml4ZWQgd2lyZWxlc3MnXSA9IHtcclxuICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGxheWVyczogJ2Jwcl9hcHIyMDE3X3RlY2hfZncnLFxyXG4gICAgc3R5bGVzOiAnYnByX2RlYzIwMTZfdGVjaCcsXHJcbiAgICBjb2xvcjogJyM2ZTAxNmInLFxyXG4gICAgekluZGV4OiAxNFxyXG59O1xyXG5cclxubGF5ZXJzVGVjaFsnU2F0ZWxsaXRlJ10gPSB7XHJcbiAgICBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBsYXllcnM6ICdicHJfYXByMjAxN190ZWNoX3NhdCcsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDE1XHJcbn07XHJcblxyXG5sYXllcnNUZWNoWydPdGhlciddID0ge1xyXG4gICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbGF5ZXJzOiAnYnByX2FwcjIwMTdfdGVjaF9vdGhlcicsXHJcbiAgICBzdHlsZXM6ICdicHJfZGVjMjAxNl90ZWNoJyxcclxuICAgIGNvbG9yOiAnIzZlMDE2YicsXHJcbiAgICB6SW5kZXg6IDE2XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyc1RlY2g7XHJcbiIsIiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIEJQUk1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XHJcblxyXG4gICAgdmFyIE1hcFNlYXJjaCA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2J0bi1sb2NTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLmxvY0NoYW5nZSk7XHJcbiAgICAgICAgICAgICQoJyNidG4tY29vcmRTZWFyY2gnKS5vbignY2xpY2snLCAnYnV0dG9uJywgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKTtcclxuICAgICAgICAgICAgJCgnI2J0bi1nZW9Mb2NhdGlvbicpLm9uKCdjbGljaycsIE1hcFNlYXJjaC5nZW9Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICQoXCIjYnRuLW5hdGlvbkxvY2F0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5zZXRWaWV3KFs1MCwgLTEwNV0sIDMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjaW5wdXQtc2VhcmNoLXN3aXRjaFwiKS5vbignY2xpY2snLCAnYScsIE1hcFNlYXJjaC5zZWFyY2hfc3dpdGNoKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsb2NhdGlvbi1zZWFyY2gnKVxyXG4gICAgICAgICAgICAgICAgLmF1dG9jb21wbGV0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSByZXF1ZXN0LnRlcm07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJQUk1hcC5nZW9jb2Rlci5xdWVyeShsb2NhdGlvbiwgcHJvY2Vzc0FkZHJlc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0FkZHJlc3MoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGRhdGEucmVzdWx0cy5mZWF0dXJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGYubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzZXMucHVzaChmW2ldLnBsYWNlX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoYWRkcmVzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTsgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd1aS1jb3JuZXItYWxsJykuYWRkQ2xhc3MoJ3VpLWNvcm5lci10b3AnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndWktY29ybmVyLXRvcCcpLmFkZENsYXNzKCd1aS1jb3JuZXItYWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcFNlYXJjaC5sb2NDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNsYXRpdHVkZSwgI2xvbmdpdHVkZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWFwU2VhcmNoLnNlYXJjaF9kZWNpbWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9jQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9ICQoJyNsb2NhdGlvbi1zZWFyY2gnKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsb2MgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVudGVyIGEgdmFsaWQgYWRkcmVzcy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQlBSTWFwLmdlb2NvZGVyLnF1ZXJ5KGxvYywgY29kZU1hcCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb2RlTWFwKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0cy5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBhZGRyZXNzIHByb3ZpZGVkIGNvdWxkIG5vdCBiZSBmb3VuZC4gUGxlYXNlIGVudGVyIGEgbmV3IGFkZHJlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBkYXRhLmxhdGxuZ1swXTtcclxuICAgICAgICAgICAgICAgIEJQUk1hcC5sb24gPSBkYXRhLmxhdGxuZ1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX2RlY2ltYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBCUFJNYXAubGF0ID0gJCgnI2xhdGl0dWRlJykudmFsKCkucmVwbGFjZSgvICsvZywgJycpO1xyXG4gICAgICAgICAgICBCUFJNYXAubG9uID0gJCgnI2xvbmdpdHVkZScpLnZhbCgpLnJlcGxhY2UoLyArL2csICcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChCUFJNYXAubGF0ID09PSAnJyB8fCBCUFJNYXAubG9uID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghQlBSTWFwLmxhdC5tYXRjaCgvXi0/XFxkK1xcLj9cXGQqJC8pIHx8ICFCUFJNYXAubG9uLm1hdGNoKC9eLT9cXGQrXFwuP1xcZCokLykpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdJbnZhbGlkIGxhdGl0dWRlIG9yIGxvbmdpdHVkZSB2YWx1ZS4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoQlBSTWFwLmxhdCkgPiA5MCB8fCBNYXRoLmFicyhCUFJNYXAubG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xhdGl0dWRlIG9yIGxvbmdpdHVkZSB2YWx1ZSBpcyBvdXQgb2YgcmFuZ2UuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZW9Mb2NhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xhdCA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvX2xvbiA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb19hY2MgPSBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKGdlb19sYXQgKiAxMDAwMDAwKSAvIDEwMDAwMDAuMDtcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubG9uID0gTWF0aC5yb3VuZChnZW9fbG9uICogMTAwMDAwMCkgLyAxMDAwMDAwLjA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJQUk1hcC5nZXRDb3VudHkoQlBSTWFwLmxhdCwgQlBSTWFwLmxvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pOyB9LCAyMDApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGN1cnJlbnQgbG9jYXRpb24gY291bGQgbm90IGJlIGRldGVybWluZWQuIFxcblBsZWFzZSB1c2UgdGhlIHNlYXJjaCBib3ggdG8gZW50ZXIgeW91ciBsb2NhdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoX3N3aXRjaDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VhcmNoID09PSAnbG9jJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCwgI2J0bi1jb29yZFNlYXJjaCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjbG9jYXRpb24tc2VhcmNoLCAjYnRuLWxvY1NlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xhdGl0dWRlLCAjbG9uZ2l0dWRlJykudmFsKCcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQWRkcmVzcycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PT0gJ2xhdGxvbi1kZWNpbWFsJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nvb3JkLXNlYXJjaCwgI2J0bi1jb29yZFNlYXJjaCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCwgI2J0bi1sb2NTZWFyY2gnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2xvY2F0aW9uLXNlYXJjaCcpLnZhbCgnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQoJ1tkYXRhLXZhbHVlPVwibGF0bG9uLWRlY2ltYWxcIl0nKS5maW5kKCcuaGlkZGVuLXNtJykuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjYnRuLWxhYmVsJykudGV4dCgnQ29vcmRpbmF0ZXMnKTsgICAgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNidG4tbGFiZWwnKS50ZXh0KCdDb29yZC4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hcFNlYXJjaDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEhhc2ggPSByZXF1aXJlKCcuL2hhc2guanMnKTtcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHJlcXVpcmUoJy4vdGFibGUtcHJvdmlkZXJzLmpzJyk7XHJcbnZhciB0YWJsZURlbW9nID0gcmVxdWlyZSgnLi90YWJsZS1kZW1vZ3JhcGhpY3MuanMnKTtcclxudmFyIGNoYXJ0RGVtb2cgPSByZXF1aXJlKCcuL2NoYXJ0LWRlbW9ncmFwaGljcy5qcycpO1xyXG52YXIgY2hhcnRGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWQuanMnKTtcclxudmFyIGNoYXJ0TldGaXhlZCA9IHJlcXVpcmUoJy4vY2hhcnQtZml4ZWROYXRpb253aWRlLmpzJyk7XHJcbnZhciBjaGFydFNwZWVkID0gcmVxdWlyZSgnLi9jaGFydC1zcGVlZC5qcycpO1xyXG5cclxudmFyIGxheWVycyA9IHtcclxuICAgIGRlcGxveW1lbnQ6IHJlcXVpcmUoJy4vbGF5ZXJzLWRlcGxveW1lbnQuanMnKSxcclxuICAgIHNwZWVkOiByZXF1aXJlKCcuL2xheWVycy1zcGVlZC5qcycpLFxyXG4gICAgcHJvdmlkZXJzOiByZXF1aXJlKCcuL2xheWVycy1wcm92aWRlcnMuanMnKSxcclxuICAgIHRlY2hub2xvZ3k6IHJlcXVpcmUoJy4vbGF5ZXJzLXRlY2guanMnKSxcclxuICAgIHRyaWJhbDoge1xyXG4gICAgICAgIGZvcm1hdDogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgbGF5ZXJzOiAnYnByX3RyaWJhbCcsXHJcbiAgICAgICAgc3R5bGVzOiAnYnByX3RyaWJhbCcsXHJcbiAgICAgICAgekluZGV4OiAxOVxyXG4gICAgfSxcclxuICAgIHVyYmFuOiB7XHJcbiAgICAgICAgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICBsYXllcnM6ICdmY2M6YnByX2NvdW50eV9sYXllcl91cmJhbl9vbmx5JyxcclxuICAgICAgICBzdHlsZXM6ICdicHJfbGF5ZXJfdXJiYW4nLFxyXG4gICAgICAgIHpJbmRleDogMjBcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBsb2NhdGlvbk1hcmtlcjtcclxudmFyIGNsaWNrZWRDb3VudHlMYXllcjtcclxudmFyIGNsaWNrZWRDb3VudHlTdHlsZSA9IHsgY29sb3I6ICcjMDBmJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjb3VudHlMYXllckRhdGEgPSB7ICdmZWF0dXJlcyc6IFtdIH07XHJcblxyXG52YXIgY2xpY2tlZEJsb2NrTGF5ZXI7XHJcbnZhciBjbGlja2VkQmxvY2tTdHlsZSA9IHsgY29sb3I6ICcjMDAwJywgb3BhY2l0eTogMC41LCBmaWxsT3BhY2l0eTogMC4xLCBmaWxsQ29sb3I6ICcjZmZmJywgd2VpZ2h0OiAzIH07XHJcbnZhciBjbGlja2VkQmxvY2tMYXllckRhdGE7XHJcblxyXG52YXIgQlBSTWFwID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vIGRlZmF1bHQgbWFwIHNldHRpbmdzXHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyID0ge307XHJcbiAgICAgICAgQlBSTWFwLmxhdCA9IDM4LjgyO1xyXG4gICAgICAgIEJQUk1hcC5sb24gPSAtOTQuOTY7XHJcbiAgICAgICAgQlBSTWFwLnpvb20gPSA0O1xyXG5cclxuICAgICAgICAvLyB0cmlnZ2VyIGhhc2hjaGFuZ2UgYW5kIGdldCBtYXAgc2V0dGluZ3NcclxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBIYXNoLmNoYW5nZSk7XHJcbiAgICAgICAgSGFzaC5jaGFuZ2UoQlBSTWFwKTtcclxuICAgICAgICBCUFJNYXAuY3JlYXRlTWFwKCk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAub24oJ2NsaWNrJywgQlBSTWFwLnVwZGF0ZSk7XHJcbiAgICAgICAgQlBSTWFwLm1hcC5vbignem9vbWVuZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBIYXNoLnVwZGF0ZShCUFJNYXApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoSGFzaC5oYXNIYXNoKCkpIHtcclxuICAgICAgICAgICAgQlBSTWFwLmdldENvdW50eShCUFJNYXAubGF0LCBCUFJNYXAubG9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHVzZSB6b29tIHZhbHVlIGZyb20gaGFzaCBvbmx5IG9uIGluaXRpYWwgcGFnZSBsb2FkXHJcbiAgICAgICAgICAgIEJQUk1hcC5oYXNoWm9vbSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0b2dnbGUgbWFwIGNvbnRhaW5lciB3aWR0aFxyXG4gICAgICAgICQoJy5jb250cm9sLWZ1bGwnKS5vbignY2xpY2snLCAnYScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgJCgnaGVhZGVyIC5jb250YWluZXIsIGhlYWRlciAuY29udGFpbmVyLWZsdWlkLCBtYWluJylcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcygnY29udGFpbmVyIGNvbnRhaW5lci1mbHVpZCcpXHJcbiAgICAgICAgICAgICAgICAub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjdGFibGUtcHJvdmlkZXJzJykuRGF0YVRhYmxlKCkuY29sdW1ucy5hZGp1c3QoKS5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1heHpvb20gPSAxNTtcclxuICAgICAgICB2YXIgbWluem9vbSA9IDM7XHJcbiAgICAgICAgdmFyIGJhc2VMYXllciA9IHt9O1xyXG4gICAgICAgIHZhciBsYXllckNvbnRyb2w7XHJcbiAgICAgICAgdmFyIGxheWVyUGF0aCA9IHdpbmRvdy5wYWdlO1xyXG5cclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXIgPSB7fTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdlb1VSTCA9IHdpbmRvdy5HRU9IT1NUICsgJy93bXM/dGlsZWQ9dHJ1ZSc7XHJcblxyXG4gICAgICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pWm1Oaklpd2lZU0k2SW5CaWFHTXlMVTBpZlEuTE9tVllwVUNGdjJ5V3BidnhEZFFOZyc7XHJcbiAgICAgICAgQlBSTWFwLm1hcCA9IEwubWFwYm94Lm1hcCgnbWFwLWNvbnRhaW5lcicpLnNldFZpZXcoW0JQUk1hcC5sYXQsIEJQUk1hcC5sb25dLCBCUFJNYXAuem9vbSk7XHJcblxyXG4gICAgICAgIEJQUk1hcC5tYXAuYXR0cmlidXRpb25Db250cm9sLmFkZEF0dHJpYnV0aW9uKCc8YSBocmVmPVwiaHR0cDovL2ZjYy5nb3ZcIj5GQ0M8L2E+Jyk7XHJcblxyXG4gICAgICAgIC8vbW92ZSBNYXBib3ggbG9nbyB0byB0b3AgcmlnaHRcclxuICAgICAgICAkKCcjbWFwLWNvbnRhaW5lcicpLmZpbmQoJy5sZWFmbGV0LWJvdHRvbS5sZWFmbGV0LWxlZnQnKS50b2dnbGVDbGFzcygnbGVhZmxldC1ib3R0b20gbGVhZmxldC1sZWZ0IGxlYWZsZXQtdG9wIGxlYWZsZXQtcmlnaHQnKTtcclxuXHJcbiAgICAgICAgLy9iYXNlIGxheWVyc1xyXG4gICAgICAgIGJhc2VMYXllci5TdHJlZXQgPSBMLm1hcGJveC5zdHlsZUxheWVyKCdtYXBib3g6Ly9zdHlsZXMvbWFwYm94L2xpZ2h0LXYxMCcpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIGJhc2VMYXllci5TYXRlbGxpdGUgPSBMLm1hcGJveC5zdHlsZUxheWVyKCdtYXBib3g6Ly9zdHlsZXMvbWFwYm94L3NhdGVsbGl0ZS1zdHJlZXRzLXYxMScpO1xyXG4gICAgICAgIGJhc2VMYXllci5UZXJyYWluID0gTC5tYXBib3guc3R5bGVMYXllcignbWFwYm94Oi8vc3R5bGVzL21hcGJveC9zYXRlbGxpdGUtdjknKTtcclxuXHJcbiAgICAgICAgLy9nZXQgdGlsZSBsYXllcnMgYmFzZWQgb24gbG9jYXRpb24gcGF0aG5hbWVcclxuICAgICAgICBmb3IgKHZhciBsYXllciBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwTGF5ZXJbbGF5ZXJdID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVyc1tsYXllclBhdGhdW2xheWVyXSkuc2V0WkluZGV4KGxheWVyc1tsYXllclBhdGhdW2xheWVyXS56SW5kZXgpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgVHJpYmFsIGFuZCBVcmJhbiBsYXllcnNcclxuICAgICAgICBCUFJNYXAubWFwTGF5ZXJbJ1RyaWJhbCddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy50cmliYWwpLnNldFpJbmRleChsYXllcnMudHJpYmFsLnpJbmRleCk7XHJcbiAgICAgICAgQlBSTWFwLm1hcExheWVyWydVcmJhbiddID0gTC50aWxlTGF5ZXIud21zKEJQUk1hcC5nZW9VUkwsIGxheWVycy51cmJhbikuc2V0WkluZGV4KGxheWVycy51cmJhbi56SW5kZXgpO1xyXG5cclxuICAgICAgICAvL2xheWVyIGNvbnRyb2xcclxuICAgICAgICBsYXllckNvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKFxyXG4gICAgICAgICAgICBiYXNlTGF5ZXIsIHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICBCUFJNYXAuZ2VvY29kZXIgPSBMLm1hcGJveC5nZW9jb2RlcignbWFwYm94LnBsYWNlcy12MScpO1xyXG5cclxuICAgICAgICBCUFJNYXAuY3JlYXRlTGVnZW5kKGxheWVyUGF0aCk7XHJcblxyXG4gICAgICAgIGNoYXJ0TldGaXhlZC5pbml0KCk7XHJcblxyXG4gICAgICAgIGlmIChIYXNoLmhhc0hhc2goKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY2hhcnRTcGVlZC5pbml0KCdudycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLmxlYWZsZXQtY29udHJvbC16b29tLWluLCAubGVhZmxldC1jb250cm9sLXpvb20tb3V0JykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEhhc2gudXBkYXRlKEJQUk1hcCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSwgLy9lbmQgY3JlYXRlTWFwXHJcbiAgICBjcmVhdGVMZWdlbmQ6IGZ1bmN0aW9uKGxheWVyUGF0aCkge1xyXG4gICAgICAgIHZhciBsaSA9ICcnO1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBsYXllcnNbbGF5ZXJQYXRoXSkge1xyXG4gICAgICAgICAgICBsaSArPSAnPGxpPic7XHJcbiAgICAgICAgICAgIGxpICs9ICc8aW5wdXQgaWQ9XCJjaGsnICsgY291bnQgKyAnXCIgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1sYXllcj1cIicgKyBrZXkgKyAnXCIgY2hlY2tlZD4gJztcclxuICAgICAgICAgICAgbGkgKz0gJzxkaXYgY2xhc3M9XCJrZXktc3ltYm9sXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOicgKyBsYXllcnNbbGF5ZXJQYXRoXVtrZXldLmNvbG9yICsgJ1wiPjwvZGl2PiAnO1xyXG4gICAgICAgICAgICBsaSArPSAnPGxhYmVsIGZvcj1cImNoaycgKyBjb3VudCArICdcIj4nICsga2V5ICsgJzwvbGFiZWw+JztcclxuICAgICAgICAgICAgbGkgKz0gJzwvbGk+JztcclxuXHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcubWFwLWxlZ2VuZCcpXHJcbiAgICAgICAgICAgIC5maW5kKCd1bCcpLnByZXBlbmQobGkpXHJcbiAgICAgICAgICAgIC5lbmQoKVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJ1t0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxheWVyTmFtZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXllcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBCUFJNYXAubWFwTGF5ZXJbbGF5ZXJOYW1lXS5hZGRUbyhCUFJNYXAubWFwKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihCUFJNYXAubWFwTGF5ZXJbbGF5ZXJOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVGVjaG5vbG9neSBNYXAgc2hvdyBsZWdlbmRcclxuICAgICAgICAkKCcjYnRuLWNsb3NlTGVnZW5kJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAkKCcubWFwLWxlZ2VuZCcpLmhpZGUoJ2Zhc3QnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVGVjaG5vbG9neSBNYXAgaGlkZSBsZWdlbmRcclxuICAgICAgICAkKCcjYnRuLW9wZW5MZWdlbmQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICQoJy5tYXAtbGVnZW5kJykuc2hvdygnZmFzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIEJQUk1hcC5sYXQgPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sYXQpIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgIEJQUk1hcC5sb24gPSBNYXRoLnJvdW5kKDEwMDAwMDAgKiBlLmxhdGxuZy5sbmcpIC8gMTAwMDAwMC4wO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpeCBsb24gd2hlbiBuYXZpZ2F0aW5nIGJldHdlZW4gRWFzdC9XZXN0IGhlbWlzcGhlcmVzXHJcbiAgICAgICAgaWYgKEJQUk1hcC5sb24gPCAtMTgwKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5sb24gPSBCUFJNYXAubG9uICsgMzYwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJQUk1hcC5sb24gPiAxODApIHtcclxuICAgICAgICAgICAgQlBSTWFwLmxvbiA9IEJQUk1hcC5sb24gLSAzNjA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBCUFJNYXAuZ2V0Q291bnR5KEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG5cclxuICAgIH0sIC8vZW5kIHVwZGF0ZVxyXG4gICAgZ2V0Q291bnR5OiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIHZhciBnZW9VUkwgPSB3aW5kb3cuR0VPSE9TVCArICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfYXByMjAxN19jb3VudHkmbWF4RmVhdHVyZXM9MSZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbiZjcWxfZmlsdGVyPWNvbnRhaW5zKGdlb20sJTIwUE9JTlQoJyArIGxvbiArICclMjAnICsgbGF0ICsgJykpJztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogZ2VvVVJMXHJcbiAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5zaG93Q291bnR5KGRhdGEpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBhY2Nlc3MgY291bnR5IGRhdGEuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAvL2VuZCBnZXRDb3VudHlcclxuICAgIHNob3dDb3VudHk6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgY291bnR5RGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdObyBjb3VudHkgZGF0YSBmb3VuZCBhdCB0aGUgc2VsZXRlZCBsb2NhdGlvbi4gUGxlYXNlIHNlbGVjdCBhIG5ldyBsb2NhdGlvbi4nKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb3VudHlEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoJyN0YWJJbnN0cnVjdHMnKS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnI3RhYkluc3RydWN0cywgI253Rml4ZWQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2ZpeGVkLCAjcHJvdmlkZXIsICNkZW1vZ3JhcGhpY3MnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaWQgPSBkYXRhLmZlYXR1cmVzWzBdLmlkLnJlcGxhY2UoL1xcLi4qJC8sICcnKTtcclxuXHJcbiAgICAgICAgaWYgKGlkICE9PSAnYnByX2FwcjIwMTdfY291bnR5Jykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQ291bnR5TGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAucmVtb3ZlTGF5ZXIoY2xpY2tlZENvdW50eUxheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsaWNrZWRDb3VudHlMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcihkYXRhKS5zZXRTdHlsZShjbGlja2VkQ291bnR5U3R5bGUpLmFkZFRvKEJQUk1hcC5tYXApO1xyXG5cclxuICAgICAgICAvLyB1c2Ugem9vbSB2YWx1ZSBmcm9tIGhhc2ggb25seSBvbiBpbml0aWFsIHBhZ2UgbG9hZFxyXG4gICAgICAgIGlmIChCUFJNYXAuaGFzaFpvb20pIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5zZXRWaWV3KFtCUFJNYXAubGF0LCBCUFJNYXAubG9uXSwgQlBSTWFwLnpvb20pO1xyXG4gICAgICAgICAgICBCUFJNYXAuaGFzaFpvb20gPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvdW50eUxheWVyRGF0YS5mZWF0dXJlcy5sZW5ndGggPT09IDAgfHwgY291bnR5TGF5ZXJEYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuY291bnR5X2ZpcHMgIT09IGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5jb3VudHlfZmlwcykge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLmZpdEJvdW5kcyhjbGlja2VkQ291bnR5TGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xpY2tlZENvdW50eUxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgQlBSTWFwLnVwZGF0ZShlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY291bnR5TGF5ZXJEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgQlBSTWFwLmdldEJsb2NrKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG5cclxuICAgICAgICB0YWJsZURlbW9nLmNyZWF0ZShjb3VudHlEYXRhKTtcclxuICAgICAgICBjaGFydERlbW9nLmluaXQoY291bnR5RGF0YS5jb3VudHlfZmlwcywgY291bnR5RGF0YSk7XHJcbiAgICAgICAgY2hhcnRGaXhlZC5pbml0KGNvdW50eURhdGEuY291bnR5X2ZpcHMpO1xyXG4gICAgICAgIGNoYXJ0U3BlZWQuaW5pdChjb3VudHlEYXRhLmNvdW50eV9maXBzKTtcclxuXHJcbiAgICB9LCAvL2VuZCBzaG93Q291bnR5XHJcbiAgICBnZXRCbG9jazogZnVuY3Rpb24obGF0LCBsb24pIHtcclxuICAgICAgICB2YXIgZ2VvVVJMID0gd2luZG93LkdFT0hPU1QgKyAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfYXByMjAxNyZtYXhGZWF0dXJlcz0xMDAmb3V0cHV0Rm9ybWF0PWFwcGxpY2F0aW9uL2pzb24mY3FsX2ZpbHRlcj1jb250YWlucyhnZW9tLCUyMFBPSU5UKCcgKyBsb24gKyAnJTIwJyArIGxhdCArICcpKSc7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IGdlb1VSTFxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICBCUFJNYXAuc2hvd0Jsb2NrKGRhdGEpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBhY2Nlc3MgYmxvY2sgZGF0YS4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzaG93QmxvY2s6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgYmxvY2tEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICBjbGlja2VkQmxvY2tMYXllckRhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAoQlBSTWFwLm1hcC5oYXNMYXllcihjbGlja2VkQmxvY2tMYXllcikpIHtcclxuICAgICAgICAgICAgQlBSTWFwLm1hcC5yZW1vdmVMYXllcihjbGlja2VkQmxvY2tMYXllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGlja2VkQmxvY2tMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcihjbGlja2VkQmxvY2tMYXllckRhdGEpLnNldFN0eWxlKGNsaWNrZWRCbG9ja1N0eWxlKS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgQlBSTWFwLnNldExvY2F0aW9uTWFya2VyKEJQUk1hcC5sYXQsIEJQUk1hcC5sb24pO1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1maXBzXScpLnRleHQoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsXScpLnRleHQoYmxvY2tEYXRhLnVyYmFuX3J1cmFsID09PSAnUicgPyAnUnVyYWwnIDogJ1VyYmFuJyk7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIFByb3ZpZGVycyB0YWJsZVxyXG4gICAgICAgIHRhYmxlUHJvdmlkZXJzLmdldERhdGEoYmxvY2tEYXRhLmJsb2NrX2ZpcHMpO1xyXG5cclxuICAgICAgICBIYXNoLnVwZGF0ZShCUFJNYXApO1xyXG4gICAgfSxcclxuICAgIHNldExvY2F0aW9uTWFya2VyOiBmdW5jdGlvbihsYXQsIGxvbikge1xyXG4gICAgICAgIGlmIChCUFJNYXAubWFwLmhhc0xheWVyKGxvY2F0aW9uTWFya2VyKSkge1xyXG4gICAgICAgICAgICBCUFJNYXAubWFwLnJlbW92ZUxheWVyKGxvY2F0aW9uTWFya2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbbGF0LCBsb25dLCB7IHRpdGxlOiAnJyB9KS5hZGRUbyhCUFJNYXAubWFwKTtcclxuXHJcbiAgICAgICAgbG9jYXRpb25NYXJrZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBCUFJNYXAuem9vbVRvQmxvY2soKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB6b29tVG9CbG9jazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKEJQUk1hcC5tYXAuaGFzTGF5ZXIoY2xpY2tlZEJsb2NrTGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIEJQUk1hcC5tYXAuZml0Qm91bmRzKGNsaWNrZWRCbG9ja0xheWVyLmdldEJvdW5kcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IC8vZW5kIE1hcExheWVyc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCUFJNYXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi91dGlsaXR5LmpzJyk7XHJcblxyXG52YXIgdGFibGVEZW1vZyA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oY291bnR5RGF0YSkge1xyXG4gICAgXHR2YXIgcG9wRGF0YSA9IHtcclxuXHRcdFx0Y291bnR5X25hbWU6IGNvdW50eURhdGEuY291bnR5X25hbWUsXHJcblx0XHRcdHN0YXRlX2FiYnI6IGNvdW50eURhdGEuc3RhdGVfYWJicixcclxuXHRcdFx0cG9wMjAxNTogY291bnR5RGF0YS5wb3AyMDE1LFxyXG5cdFx0XHRwb3BkZW5zaXR5OiBjb3VudHlEYXRhLnBvcGRlbnNpdHksXHJcblx0XHRcdHBlcmNhcGluYzogY291bnR5RGF0YS5wZXJjYXBpbmMsXHJcblx0XHRcdHVuc3BvcDI1XzM6IGNvdW50eURhdGEudW5zcG9wMjVfMyxcclxuXHRcdFx0cGVyX3VyYmFubm9maXhlZDogY291bnR5RGF0YS5wZXJfdXJiYW5ub2ZpeGVkLFxyXG5cdFx0XHRwZXJfcnVyYWxub2ZpeGVkOiBjb3VudHlEYXRhLnBlcl9ydXJhbG5vZml4ZWRcclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yICh2YXIgcHJvcE5hbWUgaW4gcG9wRGF0YSkge1xyXG5cdFx0XHRpZiAodXRpbGl0eS5pc051bGwocG9wRGF0YVtwcm9wTmFtZV0pKSB7XHJcblx0XHRcdFx0cG9wRGF0YVtwcm9wTmFtZV0gPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuICAgICAgICAvL3BvcHVsYXRlIENlbnN1cyBCbG9jayB0YWJsZVxyXG4gICAgICAgICQoJ1tkYXRhLWNvdW50eV0nKS50ZXh0KHBvcERhdGEuY291bnR5X25hbWUpO1xyXG4gICAgICAgICQoJ1tkYXRhLXN0YXRlXScpLnRleHQocG9wRGF0YS5zdGF0ZV9hYmJyKTtcclxuICAgICAgICAkKCdbZGF0YS10b3RhbFBvcF0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wb3AyMDE1KSk7XHJcbiAgICAgICAgJCgnW2RhdGEtcG9wRGVuc2l0eV0nKS50ZXh0KHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YS5wb3BkZW5zaXR5KSk7XHJcbiAgICAgICAgJCgnW2RhdGEtaW5jb21lQ2FwaXRhXScpLnRleHQodXRpbGl0eS5mb3JtYXRDb21tYShwb3BEYXRhLnBlcmNhcGluYykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvdGFsUG9wTm9BY2Nlc3NdJykudGV4dCh1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGEudW5zcG9wMjVfMykpO1xyXG4gICAgICAgICQoJ1tkYXRhLXVyYmFuUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3VyYmFubm9maXhlZCkpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJ1cmFsUG9wXScpLnRleHQodXRpbGl0eS5mb3JtYXRQZXJjZW50KHBvcERhdGEucGVyX3J1cmFsbm9maXhlZCkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZURlbW9nO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4vdXRpbGl0eS5qcycpO1xyXG5cclxudmFyIGNvbHVtbnMgPSBbXHJcbiAgICB7ICdkYXRhJzogJ2F2ZXBvcCcsICd3aWR0aCc6ICcyMCUnIH0sXHJcbiAgICB7ICdkYXRhJzogJ2F2ZWRlbnNpdHknLCAnd2lkdGgnOiAnMjAlJyB9LFxyXG4gICAgeyAnZGF0YSc6ICdwZXJjYXBpdGEnLCAnd2lkdGgnOiAnMjAlJyB9LFxyXG4gICAgeyAnZGF0YSc6ICdob3VzZWhvbGQnLCAnd2lkdGgnOiAnMjAlJyB9LFxyXG4gICAgeyAnZGF0YSc6ICdwb3ZlcnR5JywgJ3dpZHRoJzogJzIwJScgfVxyXG5dO1xyXG5cclxudmFyIHJvd1RpdGxlcyA9IFsnV2l0aG91dCBBY2Nlc3MnLCAnV2l0aCBBY2Nlc3MnXTtcclxuXHJcbnZhciB0YWJsZU5XQXZlID0ge1xyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oYmxvY2tGaXBzKSB7XHJcbiAgICAgICAgdmFyIG53QXZlVVJMID0gd2luZG93LkdFT0hPU1QgKyAnL293cz9zZXJ2aWNlPVdGUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9R2V0RmVhdHVyZSZ0eXBlTmFtZT1icHJfYXByMjAxN19ud19hdmVyYWdlJm1heEZlYXR1cmVzPTEwMCZvdXRwdXRGb3JtYXQ9YXBwbGljYXRpb24vanNvbic7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1ud0F2ZScpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICdhamF4Jzoge1xyXG4gICAgICAgICAgICAgICAgJ3VybCc6IG53QXZlVVJMLFxyXG4gICAgICAgICAgICAgICAgJ2NvbXBsZXRlJzogYWRkQ29scyxcclxuICAgICAgICAgICAgICAgICdkYXRhU3JjJzogdGFibGVOV0F2ZS5jcmVhdGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2JTb3J0JzogZmFsc2UsXHJcbiAgICAgICAgICAgICdjb2x1bW5zJzogY29sdW1ucyxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAncGFnaW5nJzogZmFsc2UsXHJcbiAgICAgICAgICAgICdzZWFyY2hpbmcnOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRDb2xzKCkge1xyXG4gICAgICAgICAgICB2YXIgdGFibGVSb3dzID0gJCgnI3RhYmxlLW53QXZlJykuZmluZCgndGJvZHk+dHInKTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlUm93cy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbG0pIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKGVsbSkuaGFzQ2xhc3MoJ29kZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbG0pLnByZXBlbmQoJzx0aCBjbGFzcz1cInJvd0hlYWRpbmdcIj5XaXRob3V0IEFjY2VzczwvdGg+Jyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxtKS5wcmVwZW5kKCc8dGggY2xhc3M9XCJyb3dIZWFkaW5nXCI+V2l0aCBBY2Nlc3M8L3RoPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlUm93cy5lcSgwKS5iZWZvcmUoJzx0cj48dGggY29sc3Bhbj1cIjdcIiBzY29wZT1cImNvbFwiPlVuaXRlZCBTdGF0ZXMgKEFsbCBBcmVhcyk8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgIHRhYmxlUm93cy5lcSgxKS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiIHNjb3BlPVwicm93XCI+UnVyYWwgQXJlYXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgIHRhYmxlUm93cy5lcSgzKS5hZnRlcignPHRyPjx0aCBjbGFzcz1cInN1YkhlYWRpbmdcIiBjb2xzcGFuPVwiN1wiIHNjb3BlPVwicm93XCI+VXJiYW4gQXJlYXM8L3RoPjwvdHI+Jyk7XHJcblxyXG4gICAgICAgICAgICB0YWJsZVJvd3MuZXEoNSkuYWZ0ZXIoJzx0cj48dGggY29sc3Bhbj1cIjdcIiBzY29wZT1cImNvbFwiPlRyaWJhbCBMYW5kczwvdGg+PC90cj4nKTtcclxuICAgICAgICAgICAgdGFibGVSb3dzLmVxKDcpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCIgc2NvcGU9XCJyb3dcIj5SdXJhbCBBcmVhczwvdGg+PC90cj4nKTtcclxuICAgICAgICAgICAgdGFibGVSb3dzLmVxKDkpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCIgc2NvcGU9XCJyb3dcIj5VcmJhbiBBcmVhczwvdGg+PC90cj4nKTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlUm93cy5lcSgxMSkuYWZ0ZXIoJzx0cj48dGggY29sc3Bhbj1cIjdcIiBzY29wZT1cImNvbFwiPlUuUy4gVGVycml0b3JpZXM8L3RoPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgIHRhYmxlUm93cy5lcSgxMykuYWZ0ZXIoJzx0cj48dGggY2xhc3M9XCJzdWJIZWFkaW5nXCIgY29sc3Bhbj1cIjdcIiBzY29wZT1cInJvd1wiPlJ1cmFsIEFyZWFzPC90aD48L3RyPicpO1xyXG4gICAgICAgICAgICB0YWJsZVJvd3MuZXEoMTUpLmFmdGVyKCc8dHI+PHRoIGNsYXNzPVwic3ViSGVhZGluZ1wiIGNvbHNwYW49XCI3XCIgc2NvcGU9XCJyb3dcIj5VcmJhbiBBcmVhczwvdGg+PC90cj4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBwb3BEYXRhID0gZGF0YS5mZWF0dXJlc1swXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xyXG4gICAgICAgIHZhciB0ZW1wT2JqID0ge307XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHZhciBqID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3VwUHJlZml4ID0gWyd1c19hdmcnLCAndXNfcnVyYWxfYXZnJywgJ3VzX3VyYmFuX2F2ZycsICd0cmliYWxfYXZnJywgJ3RyaWJhbF9ydXJhbF9hdmcnLCAndHJpYmFsX3VyYmFuX2F2ZycsICd0ZXJyX2F2ZycsICd0ZXJyX3J1cmFsX2F2ZycsICd0ZXJyX3VyYmFuX2F2ZyddO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBXID0gWydwb3BfdycsICdwb3BkZW5fdycsICdwZXJjYXBfdycsICdoaW5jX3cnLCAncG92cmF0X3cnXTtcclxuICAgICAgICB2YXIgZ3JvdXBXbyA9IFsncG9wX3dvJywgJ3BvcGRlbl93bycsICdwZXJjYXBfd28nLCAnaGluY193bycsICdwb3ZyYXRfd28nXTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFscyhhcnIpIHtcclxuICAgICAgICAgICAgdGVtcE9iaiA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BOYW1lID0gZ3JvdXBQcmVmaXhbaV0gKyAnXycgKyBhcnJbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgY29sTmFtZSA9IGNvbHVtbnNbal0uZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmb3JtYXQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyW2pdID09PSAncGVyY2FwX3cnIHx8IGFycltqXSA9PT0gJ3BlcmNhcF93bycgfHwgYXJyW2pdID09PSAnaGluY193JyB8fCBhcnJbal0gPT09ICdoaW5jX3dvJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpbY29sTmFtZV0gPSAnJCcgKyB1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGFbcHJvcE5hbWVdLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcnJbal0gPT09ICdwb3ZyYXRfdycgfHwgYXJyW2pdID09PSAncG92cmF0X3dvJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpbY29sTmFtZV0gPSB1dGlsaXR5LmZvcm1hdENvbW1hKHBvcERhdGFbcHJvcE5hbWVdLnRvRml4ZWQoMikpICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtjb2xOYW1lXSA9IHV0aWxpdHkuZm9ybWF0Q29tbWEocG9wRGF0YVtwcm9wTmFtZV0udG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBncm91cFByZWZpeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnZXRWYWxzKGdyb3VwV28pO1xyXG4gICAgICAgICAgICB0ZW1wRGF0YS5wdXNoKHRlbXBPYmopO1xyXG4gICAgICAgICAgICBnZXRWYWxzKGdyb3VwVyk7XHJcbiAgICAgICAgICAgIHRlbXBEYXRhLnB1c2godGVtcE9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlTldBdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB0YWJsZVByb3ZpZGVycyA9IHtcclxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGJsb2NrRmlwcykge1xyXG4gICAgICAgIHZhciBwcm92aWRlcnNVUkwgPSB3aW5kb3cuR0VPSE9TVCArICcvb3dzP3NlcnZpY2U9V0ZTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1HZXRGZWF0dXJlJnR5cGVOYW1lPWZjYzpicHJfYXByMjAxN19wcm92aWRlcnMmbWF4RmVhdHVyZXM9MTAwJm91dHB1dEZvcm1hdD1hcHBsaWNhdGlvbi9qc29uJmNxbF9maWx0ZXI9YmxvY2tfZmlwcz0lMjcnICsgYmxvY2tGaXBzICsgJyUyNyc7XHJcblxyXG4gICAgICAgICQoJyN0YWJsZS1wcm92aWRlcnMnKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAnYWpheCc6IHtcclxuICAgICAgICAgICAgICAgICd1cmwnOiBwcm92aWRlcnNVUkwsXHJcbiAgICAgICAgICAgICAgICAnZGF0YVNyYyc6IHRhYmxlUHJvdmlkZXJzLmNyZWF0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgIHsgJ2RhdGEnOiAncHJvdmlkZXJOYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICd0ZWNoJyB9LFxyXG4gICAgICAgICAgICAgICAgeyAnZGF0YSc6ICdzcGVlZERvd24nIH0sXHJcbiAgICAgICAgICAgICAgICB7ICdkYXRhJzogJ3NwZWVkVXAnIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ2Rlc3Ryb3knOiB0cnVlLFxyXG4gICAgICAgICAgICAnaW5mbyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnb3JkZXInOiBbXHJcbiAgICAgICAgICAgICAgICBbMCwgJ2FzYyddXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICdwYWdpbmcnOiBmYWxzZSxcclxuICAgICAgICAgICAgJ3NlYXJjaGluZyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnc2Nyb2xsWSc6ICcyODBweCcsXHJcbiAgICAgICAgICAgICdzY3JvbGxDb2xsYXBzZSc6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gYWRqdXN0IGZpeGVkIERhdGF0YWJsZSBoZWFkZXIgd2lkdGhcclxuICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykub24oJ3Nob3duLmJzLnRhYicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKCQoZS50YXJnZXQpLmF0dHIoJ2hyZWYnKSA9PT0gJyNwcm92aWRlcicpIHtcclxuICAgICAgICAgICAgICAgICQoJyN0YWJsZS1wcm92aWRlcnMnKS5EYXRhVGFibGUoKS5jb2x1bW5zLmFkanVzdCgpLmRyYXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBwcm92aWRlckRhdGEgPSBkYXRhLmZlYXR1cmVzO1xyXG4gICAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3ZpZGVyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0ZW1wRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdwcm92aWRlck5hbWUnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy5kYmFuYW1lLFxyXG4gICAgICAgICAgICAgICAgJ3RlY2gnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy50ZWNobm9sb2d5LFxyXG4gICAgICAgICAgICAgICAgJ3NwZWVkRG93bic6IHByb3ZpZGVyRGF0YVtpXS5wcm9wZXJ0aWVzLmRvd25sb2FkX3NwZWVkLFxyXG4gICAgICAgICAgICAgICAgJ3NwZWVkVXAnOiBwcm92aWRlckRhdGFbaV0ucHJvcGVydGllcy51cGxvYWRfc3BlZWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRhYmxlUHJvdmlkZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbGl0eSA9IHtcclxuICAgIGlzTnVsbDogZnVuY3Rpb24oZmllbGROYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkTmFtZSA9PT0gbnVsbDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRDb21tYTogZnVuY3Rpb24obnVtKSB7XHJcbiAgICAgICAgdmFyIHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcclxuICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJy4nKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRQZXJjZW50OiBmdW5jdGlvbihudW0pIHtcclxuICAgICAgICByZXR1cm4gKG51bSAqIDEwMCkudG9GaXhlZCgyKSArICclJztcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXRpbGl0eTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHZhbGlkYXRlID0ge1xyXG4gICAgY29vcmQ6IGZ1bmN0aW9uKGxhdCwgbG9uLCB6b29tKSB7XHJcbiAgICAgICAgdmFyIHpvb21WYWwgPSB6b29tO1xyXG5cclxuICAgICAgICBpZiAobGF0ID09PSAnJyB8fCBsb24gPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghbGF0Lm1hdGNoKC9eLT9cXGQrXFwuP1xcZCokLykgfHwgIWxvbi5tYXRjaCgvXi0/XFxkK1xcLj9cXGQqJC8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyhsYXQpID4gOTAgfHwgTWF0aC5hYnMobG9uKSA+IDE4MCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoem9vbVZhbCA+IDE1IHx8IHpvb21WYWwgPCAzIHx8IGlzTmFOKHpvb21WYWwpKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xyXG4iXX0=
