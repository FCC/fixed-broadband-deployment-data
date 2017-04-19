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
