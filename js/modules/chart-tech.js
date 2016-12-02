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
        var speed10URL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_refresh_county&maxFeatures=100&outputFormat=application/json&cql_filter=county_fips=%27' + chartTech.FIPS + '%27';

        $.ajax({
            type: 'GET',
            url: speed10URL,
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
            for (j = 0; j < arr.length - 1; j++) {
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
                            display: true,
                            labelString: '# of Providers'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
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
