'use strict';
var util = require('../lib/util.js');

var COUNT = 100 * 1000;

var benchmark = function (label, fn) {
    var p0 = Date.now();
    for (var i = 0; i < COUNT; ++i) {
        fn();
    }
    var p1 = Date.now();

    var time = p1 - p0,
        ope  = Math.round(i / time);
    console.log(label+':', time, '[ms]', ope, '[fn/ms]');
};

benchmark('join', function () {
    util.skill.join([ { 'a': 1 }, { 'b': 1 } ]);
});
benchmark('merge', function () {
    util.skill.merge({ 'a': 1 }, { 'b': 1 });
});
