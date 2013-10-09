(function () {
    var global = this;

    var simu = {};

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = simu;
    } else {
        global.simu = simu;
    }

    simu.VERSION = '0.0.8';
}).call(this);
