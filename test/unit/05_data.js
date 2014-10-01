'use strict';
var assert = require('power-assert'),
    data = require('../../lib/data.js');

describe('05_data', function () {
    var got, exp;

    it('data', function () {
        assert(typeof data === 'object', 'is object');
        assert(typeof data.initialize === 'function', 'has initialize()');

        data.initialize();

        got = data.equips;
        exp = { head: [], body: [], arm: [], waist:[], leg:[], weapon: [], oma: [] };
        assert.deepEqual(got, exp, 'equips');
        got = data.decos;
        exp = [];
        assert.deepEqual(got, exp, 'decos');
        got = data.skills;
        exp = {};
        assert.deepEqual(got, exp, 'skills');
    });

    describe('set', function () {
        it('set', function () {
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
            assert.deepEqual(got, exp, 'equips');
            got = data.decos;
            exp = [ 'deco01', 'deco02' ];
            assert.deepEqual(got, exp, 'decos');
            got = data.skills;
            exp = { 'skill01': 'skill01', 'skill02': 'skill02' };
            assert.deepEqual(got, exp, 'skills');
        });

        it('regression test: not update only equips.body', function () {
            // equips.body だけの更新はされない(以前はされた)
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
            assert.deepEqual(got, exp, 'NOT update only equips.body: equips');
            got = data.decos;
            exp = [];
            assert.deepEqual(got, exp, 'NOT update only equips.body: decos');
            got = data.skills;
            exp = {};
            assert.deepEqual(got, exp, 'NOT update only equips.body: skills');
        });

        it('regression test: not update only decos', function () {
            // decos だけの更新はされない(以前はされた)
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
            assert.deepEqual(got, exp, 'NOT update only decos: equips');
            got = data.decos;
            exp = [ 'deco11', 'deco12' ];
            assert.deepEqual(got, exp, 'NOT update only decos: decos');
            got = data.skills;
            exp = {};
            assert.deepEqual(got, exp, 'NOT update only decos: skills');
        });
    });
});
