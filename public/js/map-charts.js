var data = {
    labels: ["All", "Urban", "Rural", "Tribal"],
    datasets: [{
        label: 'Both',
        data: [727, 589, 537, 543],
        backgroundColor: 'rgba(255, 99, 132, 0.4)'
    }, {
        label: 'Fixed',
        data: [238, 553, 746, 884],
        backgroundColor: 'rgba(54, 162, 235, 0.4)'
    }, {
        label: 'Mobile',
        data: [1238, 553, 746, 884],
        backgroundColor: 'rgba(255, 206, 86, 0.4)'
    }, {
        label: 'None',
        data: [584, 789, 254, 654],
        backgroundColor: 'rgba(54, 162, 235, 0.4)'
    }]
};

var dataDemog = {
    labels: [
        "Urban",
        "Rural"
    ],
    datasets: [{
        data: [150, 50],
        backgroundColor: [            
            "#3D59D7",
            "#71DAD6"
        ]
    }]
};

if (window.location.pathname === '/index.html') {
    var ctxPop = $('#chartPop');

    var popChart = new Chart(ctxPop, {
        type: 'bar',
        data: data,
        options: {
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

    var ctxFixed = $('#chartFixed');

    var fixedChart = new Chart(ctxFixed, {
        type: 'bar',
        data: data,
        options: {
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


if (window.location.pathname === '/demographics.html') {
    console.log('demo');
    var ctxDemog = $('#chartDemog');

    var demogDonut = new Chart(ctxDemog, {
        type: 'doughnut',
        data: dataDemog,
        options: {
            legend: {
                position: 'bottom'
            }
        }
    });
}
