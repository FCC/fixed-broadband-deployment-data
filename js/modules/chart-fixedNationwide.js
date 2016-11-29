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
