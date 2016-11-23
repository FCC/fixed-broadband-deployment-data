'use strict';

var tableProviders = {
    getData: function(blockFips) {
        var providersURL = '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fcc:bpr_dec2016_providers&maxFeatures=100&outputFormat=application/json&cql_filter=block_fips=%27' + blockFips + '%27';

        $('#table-providers').DataTable({
            'ajax': {
                'url': providersURL,
                'dataSrc': tableProviders.create
            },
            'columns': [
                { 'data': 'providerName' },
                { 'data': 'tech' },
                { 'data': 'speedDown' },
                { 'data': 'speedUp' }
            ],
            'destroy': true,
            'info': false,
            'order': [
                [0, 'asc']
            ],
            'paging': false,
            'searching': false,
            'scrollY': '280px',
            'scrollCollapse': true,
        });
    },
    create: function(data) {
        var providerData = data.features;
        var tempData = [];

        for (var i = 0; i < providerData.length; i++) {
            tempData.push({
                'providerName': providerData[i].properties.dbaname,
                'tech': providerData[i].properties.technology,
                'speedDown': providerData[i].properties.download_speed,
                'speedUp': providerData[i].properties.upload_speed
            });
        }

        return tempData;
    }
};

module.exports = tableProviders;
