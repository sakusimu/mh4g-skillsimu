(function (define) {
'use strict';
define([ './lib/test-helper.js', '../lib/data.js' ], function (QUnit, data) {

QUnit.module('05_data');

QUnit.test('data', function () {
    var got, exp;

    QUnit.strictEqual(typeof data, 'object', 'is object');
    QUnit.strictEqual(typeof data.initialize, 'function', 'has initialize()');

    data.initialize();

    got = data.equips;
    exp = { head: [], body: [], arm: [], waist:[], leg:[], weapon: [], oma: [] };
    QUnit.deepEqual(got, exp, 'equips');
    got = data.decos;
    exp = [];
    QUnit.deepEqual(got, exp, 'decos');
    got = data.skills;
    exp = {};
    QUnit.deepEqual(got, exp, 'skills');
});

QUnit.test('set', function () {
    var got, exp;

    // 普通にデータを用意
    data.set({
        equips: {
            head : [ 'head01', 'head02' ],
            body : [ 'body01', 'body02' ],
            arm  : [ 'arm01', 'arm02' ],
            waist: [ 'waist01', 'waist02' ],
            leg  : [ 'leg01', 'leg02' ],
            //weapon: undefined
            oma  : [ 'oma01', 'oma02' ]
        },
        decos: [ 'deco01', 'deco02' ],
        skills: { 'skill01': 'skill01', 'skill02': 'skill02' }
    });
    got = data.equips;
    exp = {
        head  : [ 'head01', 'head02' ],
        body  : [ 'body01', 'body02' ],
        arm   : [ 'arm01', 'arm02' ],
        waist : [ 'waist01', 'waist02' ],
        leg   : [ 'leg01', 'leg02' ],
        weapon: [],
        oma   : [ 'oma01', 'oma02' ]
    };
    QUnit.deepEqual(got, exp, 'equips');
    got = data.decos;
    exp = [ 'deco01', 'deco02' ];
    QUnit.deepEqual(got, exp, 'decos');
    got = data.skills;
    exp = { 'skill01': 'skill01', 'skill02': 'skill02' };
    QUnit.deepEqual(got, exp, 'skills');

    // equips.body だけ更新されない(以前はされた)
    data.set({
        equips: {
            body : [ 'body11', 'body12' ]
        }
    });
    got = data.equips;
    exp = {
        head  : [],
        body  : [ 'body11', 'body12' ],
        arm   : [],
        waist : [],
        leg   : [],
        weapon: [],
        oma   : []
    };
    QUnit.deepEqual(got, exp, 'NOT update only equips.body: equips');
    got = data.decos;
    exp = [];
    QUnit.deepEqual(got, exp, 'NOT update only equips.body: decos');
    got = data.skills;
    exp = {};
    QUnit.deepEqual(got, exp, 'NOT update only equips.body: skills');

    // decos だけ更新されない(以前はされた)
    data.set({ decos: [ 'deco11', 'deco12' ] });
    got = data.equips;
    exp = {
        head  : [],
        body  : [],
        arm   : [],
        waist : [],
        leg   : [],
        weapon: [],
        oma   : []
    };
    QUnit.deepEqual(got, exp, 'NOT update only decos: equips');
    got = data.decos;
    exp = [ 'deco11', 'deco12' ];
    QUnit.deepEqual(got, exp, 'NOT update only decos: decos');
    got = data.skills;
    exp = {};
    QUnit.deepEqual(got, exp, 'NOT update only decos: skills');
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
           test(this.QUnit, this.simu.data);
       }
);
