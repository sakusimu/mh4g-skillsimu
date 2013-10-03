(function (define) {
'use strict';
define([ './lib/test-helper.js', '../lib/data.js' ], function (QUnit, data) {

QUnit.module('05_data');

QUnit.test('data', function () {
    var got, exp;

    got = data;
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    data.initialize();

    exp = { head: [], body: [], arm: [], waist:[], leg:[] };
    QUnit.deepEqual(got.equips, exp, 'equips');
    QUnit.deepEqual(got.decos, [], 'decos');
    QUnit.deepEqual(got.skills, {}, 'skills');
    QUnit.deepEqual(got.omas, [], 'omas');
});

QUnit.test('set', function () {
    var got, exp;

    (function () {
        data.set({
            equips: {
                head : [ 'head01', 'head02' ],
                body : [ 'body01', 'body02' ],
                arm  : [ 'arm01', 'arm02' ],
                waist: [ 'waist01', 'waist02' ],
                leg  : [ 'leg01', 'leg02' ]
            },
            decos: [ 'deco01', 'deco02' ],
            skills: { 'skill01': 'skill01', 'skill02': 'skill02' }
        });

        got = data.equips;
        exp = {
            head : [ 'head01', 'head02' ],
            body : [ 'body01', 'body02' ],
            arm  : [ 'arm01', 'arm02' ],
            waist: [ 'waist01', 'waist02' ],
            leg  : [ 'leg01', 'leg02' ]
        };
        QUnit.deepEqual(got, exp, 'equips');

        got = data.decos;
        exp = [ 'deco01', 'deco02' ];
        QUnit.deepEqual(got, exp, 'decos');

        got = data.skills;
        exp = { 'skill01': 'skill01', 'skill02': 'skill02' };
        QUnit.deepEqual(got, exp, 'skills');
    })();

    (function () {
        data.set({
            equips: {
                body : [ 'body11', 'body12' ]
            }
        });

        got = data.equips;
        exp = {
            head : [ 'head01', 'head02' ],
            body : [ 'body11', 'body12' ],
            arm  : [ 'arm01', 'arm02' ],
            waist: [ 'waist01', 'waist02' ],
            leg  : [ 'leg01', 'leg02' ]
        };
        QUnit.deepEqual(got, exp, 'only equips.body: equips');

        got = data.decos;
        exp = [ 'deco01', 'deco02' ];
        QUnit.deepEqual(got, exp, 'only equips.body: decos');

        got = data.skills;
        exp = { 'skill01': 'skill01', 'skill02': 'skill02' };
        QUnit.deepEqual(got, exp, 'only equips.body: skills');
    })();

    (function () {
        data.set({ decos: [ 'deco11', 'deco12' ] });

        got = data.equips;
        exp = {
            head : [ 'head01', 'head02' ],
            body : [ 'body11', 'body12' ],
            arm  : [ 'arm01', 'arm02' ],
            waist: [ 'waist01', 'waist02' ],
            leg  : [ 'leg01', 'leg02' ]
        };
        QUnit.deepEqual(got, exp, 'only decos: equips');

        got = data.decos;
        exp = [ 'deco11', 'deco12' ];
        QUnit.deepEqual(got, exp, 'only decos: decos');

        got = data.skills;
        exp = { 'skill01': 'skill01', 'skill02': 'skill02' };
        QUnit.deepEqual(got, exp, 'only decos: skills');
    })();
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
