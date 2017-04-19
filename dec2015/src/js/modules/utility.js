'use strict';

var utility = {
    isNull: function(fieldName) {
        return fieldName === null;
    },
    formatComma: function(num) {
        var parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    },
    formatPercent: function(num) {
        return (num * 100).toFixed(2) + '%';
    }
};

module.exports = utility;
