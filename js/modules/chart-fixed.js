'use strict';

var chartFixed = {
    init: function(county_fips) {
        // var ctxFixed, fixedChart;

        chartFixed.data = {
            labels: ['All', 'Urban', 'Rural'],
            datasets: [{
                label: 'Fixed',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.4)'
            }, {
                label: 'No Fixed',
                data: [],
                backgroundColor: 'rgba(255, 206, 86, 0.4)'
            }],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 5,
                            min: 0,
                            stepSize: 0.5
                        }
                    }]
                }
            }
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
    update: function(urbanData) { 
        var urbanFixed = chartFixed.data.datasets[0].data;
        var urbanNoFixed = chartFixed.data.datasets[1].data;

        for (var i = 0; i < urbanData.features.length; i++) {
            switch (urbanData.features[i].properties.has_fixed) {
                case 0:
                    urbanNoFixed.push(urbanData.features[i].properties.type_pop_pct);
                    
                    if (urbanData.features[i].properties.type_pop_pct === 100) {
                        urbanFixed.push(0);
                    }

                    break;
                case 1:
                    urbanFixed.push(urbanData.features[i].properties.type_pop_pct);
                    
                    if (urbanData.features[i].properties.type_pop_pct === 100) {
                        urbanNoFixed.push(0);
                    }

                    break;
            }
        }       
        
    },
    display: function() {
        var ctxFixed;

        //replace chart canvas if it already exists
        $('.sect-fixed')
            .find('canvas').remove().end()
            .append('<canvas id="chartFixed" width="300" height="220"></canvas>');

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
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }
};

module.exports = chartFixed;
