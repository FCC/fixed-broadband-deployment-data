'use strict';

var chartFixed = {
    create: function(county_fips) {
        var urbanURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_urban_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=' + county_fips;
        var ruralURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_county_rural_fnf&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=' + county_fips;

        var ctxFixed, fixedChart;

        var chartData = {
            labels: ['Urban', 'Rural'],
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

        //replace chart if it already exists
        $('.sect-fixed')
            .find('canvas').remove().end()
            .append('<canvas id="chartFixed" width="300" height="220"></canvas>');

        $('.chartjs-hidden-iframe').remove();

        //create new chart
        ctxFixed = $('#chartFixed');

        fixedChart = new Chart(ctxFixed, {
            type: 'bar',
            data: chartData,
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
        
        $.ajax({
            type: 'GET',
            url: urbanURL,
            success: function(urbanData) {

                var urbanFixed = chartData.datasets[0].data;
                var urbanNoFixed = chartData.datasets[1].data;

                for (var i = 0; i < urbanData.features.length; i++) {
                    switch (urbanData.features[i].properties.has_fixed) {
                        case 0:
                            urbanNoFixed.push(urbanData.features[i].properties.type_pop_pct);
                            break;
                        case 1:
                            urbanFixed.push(urbanData.features[i].properties.type_pop_pct);
                            break;
                    }
                }

                if (urbanFixed.length === 0) {
                    urbanFixed.push(0);
                }

                if (urbanNoFixed.length === 0) {
                    urbanNoFixed.push(0);
                }

                // urbanFixedData.push(urbanData);

                $.ajax({
                    type: 'GET',
                    url: ruralURL,
                    success: function(ruralData) {
                        var ruralFixed = chartData.datasets[0].data;
                        var ruralNoFixed = chartData.datasets[1].data;

                        for (var i = 0; i < ruralData.features.length; i++) {
                            switch (ruralData.features[i].properties.has_fixed) {
                                case 0:
                                    ruralNoFixed.push(ruralData.features[i].properties.type_pop_pct);
                                    break;
                                case 1:
                                    ruralFixed.push(ruralData.features[i].properties.type_pop_pct);
                                    break;
                            }
                        }

                        fixedChart.update();

                    }
                });
            }
        });

    }
};

module.exports = chartFixed;
