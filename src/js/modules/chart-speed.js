'use strict';

var chartSpeed = {
    init: function(county_fips) {
        chartSpeed.data = {
            labels: ['.200', '10', '25', '50', '100'],
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
        var speedURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_refresh_county&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartSpeed.FIPS + '%27';
        var speedNWURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_refresh_nation&maxFeatures=100&outputFormat=application/json';

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
