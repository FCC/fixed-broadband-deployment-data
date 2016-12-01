'use strict';

var columns = [
    { 'data': 'avepop' },
    { 'data': 'avedensity' },
    { 'data': 'percapita' },
    { 'data': 'household' },
    { 'data': 'poverty' }
];

var rowTitles = ['Without Access', 'With Access'];

var tableNWAve = {
    getData: function(blockFips) {
        var nwAveURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bpr_dec2016_nw_average&maxFeatures=100&outputFormat=application/json';

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
            // 'order': [
            //     [0, 'asc']
            // ],
            'paging': false,
            'searching': false,
            // 'scrollY': '280px',
            // 'scrollCollapse': true,
        });

        function addCols() { 
            $('#table-nwAve').find('tbody>tr').each(function(index, elm) {
                if ($(elm).hasClass('odd')) {
                	$(elm).prepend('<th class="rowHeading">Without Access</th>');
                } else {
                	$(elm).prepend('<th class="rowHeading">With Access</th>');
                }
                
            });

            $('#table-nwAve').find('tbody>tr').prepend('<th></th>');
			$('#table-nwAve').find('tbody>tr').eq(0).before('<tr><th colspan="7">United States (All Areas)</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(2).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(5).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');

            $('#table-nwAve').find('tbody>tr').eq(8).after('<tr><th colspan="7">Tribal Lands</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(11).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(14).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');

            $('#table-nwAve').find('tbody>tr').eq(17).after('<tr><th colspan="7">U.S. Territories</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(20).after('<tr><th class="subHeading" colspan="7">Rural Areas</th></tr>');
            $('#table-nwAve').find('tbody>tr').eq(23).after('<tr><th class="subHeading" colspan="7">Urban Areas</th></tr>');
        }

    },
    create: function(data) {
        var popData = data.features[0].properties;
        var tempData = [];
        var tempObj = {};
        
        var groupPrefix = ['us_avg', 'us_rural_avg', 'us_urban_avg', 'tribal_avg', 'tribal_rural_avg', 'tribal_urban_avg', 'terr_avg', 'terr_rural_avg', 'terr_urban_avg'];

        var groupW = ['pop_w', 'popden_w', 'percap_w', 'hinc_w', 'povrat_w'];
        var groupWo = ['pop_wo', 'popden_wo', 'percap_wo', 'hinc_wo', 'povrat_wo'];

        function getVals(arr) {
            tempObj = {};
            for (var j = 0; j < arr.length; j++) {
                var propName = groupPrefix[i] + '_' + arr[j];
                var colName = columns[j].data;

                tempObj[colName] = popData[propName];
            }
        }

        for (var i = 0; i < groupPrefix.length; i++) {
            getVals(groupWo);
            tempData.push(tempObj);
            getVals(groupW);
            tempData.push(tempObj);
        }
        
        return tempData;
    }
};

module.exports = tableNWAve;
