(function () {
    'use strict';

    var global = this;

    var myapp = {}; // シミュレータのユーザ側のアプリ

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = myapp;
    } else {
        global.myapp = myapp;
    }
}).call(this);
