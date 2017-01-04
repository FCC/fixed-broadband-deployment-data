'use strict';

/*chartFixed.data = {
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
        };*/

var chartData = {
    labels: ['All', 'Urban', 'Rural'],
    datasets: [{
        label: 'With Access',
        backgroundColor: 'red',
        data: [4203.4, 4085.0, 4974.6]
    }, {
        label: 'Without Access',
        backgroundColor: 'blue',
        data: [4475.8, 4225.83, 4680.03]
    }]
};

var nwCharts = {
    usPop: {
        id: 'usPop',
        data: chartData
    },
    tribalPop: {
        id: 'tribalPop',
        data: chartData
    },
    usTerr: {
        id: 'usTerr',
        data: chartData
    }
};

var chartNWDemog = {
    init: function(county_fips) {
        chartNWDemog.data = {
            labels: ['All', 'Urban', 'Rural'],
            datasets: [{
                label: 'With Access',
                backgroundColor: 'red',
                data: [4203.4, 4085.0, 4974.6]
            }, {
                label: 'Without Access',
                backgroundColor: 'blue',
                data: [4475.8, 4225.83, 4680.03]
            }]
        };

        /*chartNWDemog.data = {
            labels: ['United States', 'Tribal Lands', 'U.S. Territories'],
            datasets: [{
                label: 'Non-Urban Core Areas',
                backgroundColor: 'red',
                stack: 'Stack 0',
                data: [4203.4, 4085.0, 4974.6],
            }, {
                label: 'Without Access',
                backgroundColor: 'blue',
                stack: 'Stack 1',
                data: [4475.8, 4225.83, 4680.03]
            }]
        };*/

        //only show chart if it exists on the page
        /*if ($('#chartNWDemog').length === 0) {
            return;
        }*/

        //if county FIPS is the same don't regenerate chart
        /*if (county_fips === chartFixed.FIPS) {
            return;
        } else {
            chartFixed.FIPS = county_fips;
        }*/

        // chartFixed.getCountyData(county_fips);
        console.log('display');
        chartNWDemog.display();
    },
    getDemogData: function() {
        var demogURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_nw_ur_fnf&maxFeatures=100&outputFormat=application/json';

        $.ajax({
            type: 'GET',
            url: demogURL,
            success: function(data) {
                // chartNWDemog.update(data);
                chartNWDemog.display();
            }
        });
    },
    /*getUrbanData: function() {
        var urbanURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_urban_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: urbanURL,
            success: function(data) {
                chartFixed.update(data);
                chartFixed.getRuralData();
            }
        });
    },
    getRuralData: function() {
        var ruralURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_rural_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartFixed.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: ruralURL,
            success: function(data) {
                chartFixed.update(data);
                chartFixed.display();
            }
        });
    },*/
    update: function(data) {
        var access = chartNWDemog.data.datasets[0].data;
        var noAccess = chartNWDemog.data.datasets[1].data;

        if (data.features.length === 0) {
            access.push(0);
            noAccess.push(0);

            return;
        }

        for (var i = 0; i < data.features.length; i++) {
            switch (data.features[i].properties.urban_rural) {
                case 'U':
                    noAccess.push(data.features[i].properties.type_pop_pct.toFixed(2));

                    if (data.features[i].properties.type_pop_pct === 100) {
                        access.push(0);
                    }

                    break;
                case 'R':
                    access.push(data.features[i].properties.type_pop_pct.toFixed(2));

                    if (data.features[i].properties.type_pop_pct === 100) {
                        noAccess.push(0);
                    }

                    break;
            }
        }

    },
    display: function() {
        var ctxFixed;

        //replace chart canvas if it already exists
        // $('#chartAvePop').replaceWith('<canvas id="chartAvePop" width="300" height="220"></canvas>');
        // $('.chartjs-hidden-iframe').remove();
        console.log(chartNWDemog.data);
        //create new chart
        ctxFixed = $('#chartUSAvePop');
        chartNWDemog.chart = new Chart(ctxFixed, {
            type: 'bar',
            data: chartNWDemog.data,
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

module.exports = chartNWDemog;
