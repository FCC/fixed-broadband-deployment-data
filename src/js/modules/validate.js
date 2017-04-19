'use strict';

var validate = {
    coord: function(lat, lon, zoom) {
        var zoomVal = zoom;

        if (lat === '' || lon === '') {
            return false;
        }

        if (!lat.match(/^-?\d+\.?\d*$/) || !lon.match(/^-?\d+\.?\d*$/)) {
            return false;
        }

        if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
            return false;
        }

        if (zoomVal > 15 || zoomVal < 3 || isNaN(zoomVal)) { 
            return false;
        }       

        return true;
    }
};

module.exports = validate;
