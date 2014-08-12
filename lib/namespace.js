(function () {
    var global = this;

    var simu = {};

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = simu;
    } else {
        global.simu = simu;
    }

    simu.VERSION = '0.2.6';
}).call(this);
