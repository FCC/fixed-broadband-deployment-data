'use strict';

var chartFixed = {
    init: function(county_fips) {
        // var ctxFixed, fixedChart;

        chartFixed.data = {
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
        };

        //if county FIPS is the same don't regenerate chart
        if (county_fips === chartFixed.FIPS) {
            return;
        } else {
            chartFixed.FIPS = county_fips;
        }

        chartFixed.getCountyData(county_fips);
    },
    getCountyData: function() {
        var allCntyURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=' + chartFixed.FIPS;

        $.ajax({
            type: 'GET',
            url: allCntyURL,
            success: function(data) {
                chartFixed.update(data);
                chartFixed.getUrbanData();
            }
        });
    },
    getUrbanData: function() {
        var urbanURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_urban_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=' + chartFixed.FIPS;

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
        var ruralURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_rural_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=' + chartFixed.FIPS;

        $.ajax({
            type: 'GET',
            url: ruralURL,
            success: function(data) {
                chartFixed.update(data);
                chartFixed.display();
            }
        });
    },
    update: function(data) {
        var fixedData = chartFixed.data.datasets[0].data;
        var noFixedData = chartFixed.data.datasets[1].data;

        if (data.features.length === 0) {
            fixedData.push(0);
            noFixedData.push(0);

            return;
        }

        for (var i = 0; i < data.features.length; i++) {
            switch (data.features[i].properties.has_fixed) {
                case 0:
                    noFixedData.push(data.features[i].properties.type_pop_pct.toFixed(2));

                    if (data.features[i].properties.type_pop_pct === 100) {
                        fixedData.push(0);
                    }

                    break;
                case 1:
                    fixedData.push(data.features[i].properties.type_pop_pct.toFixed(2));

                    if (data.features[i].properties.type_pop_pct === 100) {
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
