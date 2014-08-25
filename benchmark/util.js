(function (define) {
'use strict';
define([ '../lib/util/skill.js' ], function (Skill) {

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
    Skill.join([ { 'a': 1 }, { 'b': 1 } ]);
});
benchmark('merge', function () {
    Skill.merge({ 'a': 1 }, { 'b': 1 });
});

});
})(typeof define !== 'undefined' ?
   define :
   typeof module !== 'undefined' && module.exports ?
       function (deps, test) {
           var modules = [], len = deps.length;
           for (var i = 0; i < len; ++i) modules.push(require(deps[i]));
           test.apply(this, modules);
       } :
       function (deps, test) {
           test(this.simu.Util.Skill);
       }
);
