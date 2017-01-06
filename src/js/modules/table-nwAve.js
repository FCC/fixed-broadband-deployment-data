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
        var nwAveURL = window.GEOHOST + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_nw_average&maxFeatures=100&outputFormat=application/json';

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

            tableRows.eq(0).before('<tr><th colspan="7">United States (All Areas)</th></tr>');
            tableRows.eq(1).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            tableRows.eq(3).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');

            tableRows.eq(5).after('<tr><th colspan="7">Tribal Lands</th></tr>');
            tableRows.eq(7).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            tableRows.eq(9).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');

            tableRows.eq(11).after('<tr><th colspan="7">U.S. Territories</th></tr>');
            tableRows.eq(13).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            tableRows.eq(15).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');
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
