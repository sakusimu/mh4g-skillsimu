(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco-combinator.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, DecoCombinator, myapp) {

QUnit.module('70_deco-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Combinator', function () {
    QUnit.strictEqual(typeof DecoCombinator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got;

    got = new DecoCombinator();
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.result, null, 'reuslt');
    QUnit.deepEqual(got.equips, {}, 'equips');
    QUnit.strictEqual(got.weaponSlot, null, 'weaponSlot');
});

QUnit.test('_makeCombs', function () {
    var got, exp, equips, combs,
        dc = new DecoCombinator();

    var name = function (deCombs) {
        return _.map(deCombs, function (comb) {
            return { equip: comb.equip.name, deComb: _.pluck(comb.deComb, 'name') };
        });
    };

    equips = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0],
        body : myapp.equips('body', '三眼の首飾り')[0],
        arm  : myapp.equips('arm', 'ユクモノコテ・天')[0],
        waist: myapp.equips('waist', 'バンギスコイル')[0],
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0]
    };
    combs = dc._makeCombs([ '匠', '研ぎ師' ], equips);
    got = name(combs.head);
    exp = [ { equip: 'ユクモノカサ・天', deComb: [ '研磨珠【１】', '研磨珠【１】' ] },
            { equip: 'ユクモノカサ・天', deComb: [ '匠珠【２】' ] } ];
    QUnit.deepEqual(got, exp, 'head');
    got = name(combs.body);
    exp = [ { equip: '三眼の首飾り', deComb: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ] },
            { equip: '三眼の首飾り', deComb: [ '匠珠【２】', '研磨珠【１】' ] },
            { equip: '三眼の首飾り', deComb: [ '匠珠【３】' ] } ];
    QUnit.deepEqual(got, exp, 'body');
    got = name(combs.arm);
    exp = [ { equip: 'ユクモノコテ・天', deComb: [ '研磨珠【１】', '研磨珠【１】' ] },
            { equip: 'ユクモノコテ・天', deComb: [ '匠珠【２】' ] } ];
    QUnit.deepEqual(got, exp, 'arm');
    got = name(combs.waist);
    exp = [];
    QUnit.deepEqual(got, exp, 'waist');
    got = name(combs.leg);
    exp = [ { equip: 'ユクモノハカマ・天', deComb: [ '研磨珠【１】', '研磨珠【１】' ] },
            { equip: 'ユクモノハカマ・天', deComb: [ '匠珠【２】' ] } ];
    QUnit.deepEqual(got, exp, 'leg');
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
           test(this.QUnit, this._, this.simu.DecoCombinator, this.myapp);
       }
);
