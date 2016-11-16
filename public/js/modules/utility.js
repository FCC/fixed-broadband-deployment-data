'use strict';

var utility = {
    isNull(fieldName) {
        return fieldName === null;
    },
    formatComma(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatPercent(num) {
        return (num * 100).toFixed(2) + '%';
    }
};

module.exports = utility;
