'use strict';
var assert = require('power-assert'),
    Assembler = require('../../../lib/equip/assembler.js');

describe('30_equip/30_assembler', function () {
    var got, exp;

    it('require', function () {
        assert(typeof Assembler === 'function', 'is function');
    });

    it('new', function () {
        var a = new Assembler();
        assert(typeof a === 'object', 'is object');
        assert(typeof a.initialize === 'function', 'has initialie()');
    });

    describe('_assemble', function () {
        var a = new Assembler();

        it('assemble', function () {
            var eqcomb = {
                head  : [ 'head01' ],
                body  : [ 'body01' ],
                arm   : [ 'arm01' ],
                waist : [ 'waist01' ],
                leg   : [ 'leg01' ],
                weapon: [ 'wpn01' ],
                oma   : [ 'oma01' ]
            };
            got = a._assemble(eqcomb);
            exp = [
                [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', 'wpn01', 'oma01' ]
            ];
            assert.deepEqual(got, exp);
        });

        it('weapon and oma are []', function () {
            var eqcomb = {
                head  : [ 'head01' ],
                body  : [ 'body01' ],
                arm   : [ 'arm01' ],
                waist : [ 'waist01' ],
                leg   : [ 'leg01' ],
                weapon: [],
                oma   : []
            };
            got = a._assemble(eqcomb);
            exp = [
                [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', null, null ]
            ];
            assert.deepEqual(got, exp);
        });

        it('multi equips', function () {
            // equips が複数ある場合に展開されるか
            var eqcomb = {
                head  : [ 'head01', 'head02' ],
                body  : [ 'body01' ],
                arm   : [ 'arm01', 'arm02' ],
                waist : [ 'waist01' ],
                leg   : [ 'leg01', 'leg02' ],
                weapon: [],
                oma   : []
            };
            got = a._assemble(eqcomb);
            exp = [
                [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', null, null ],
                [ 'head01', 'body01', 'arm01', 'waist01', 'leg02', null, null ],
                [ 'head01', 'body01', 'arm02', 'waist01', 'leg01', null, null ],
                [ 'head01', 'body01', 'arm02', 'waist01', 'leg02', null, null ],
                [ 'head02', 'body01', 'arm01', 'waist01', 'leg01', null, null ],
                [ 'head02', 'body01', 'arm01', 'waist01', 'leg02', null, null ],
                [ 'head02', 'body01', 'arm02', 'waist01', 'leg01', null, null ],
                [ 'head02', 'body01', 'arm02', 'waist01', 'leg02', null, null ]
            ];
            assert.deepEqual(got, exp);
        });

        it('use cache', function () {
            var cache = {};

            var eqcomb = {
                head  : [ 'head01' ],
                body  : [ 'body01' ],
                arm   : [ 'arm01' ],
                waist : [ 'waist01' ],
                leg   : [ 'leg01' ],
                weapon: [],
                oma   : [ 'oma01' ]
            };
            a._assemble(eqcomb, cache);

            eqcomb = {
                head  : [ 'head01', 'head02' ],
                body  : [ 'body01' ],
                arm   : [ 'arm01' ],
                waist : [ 'waist01' ],
                leg   : [ 'leg01' ],
                weapon: [],
                oma   : [ 'oma01' ]
            };
            got = a._assemble(eqcomb, cache);
            exp = [
                // head01 の組み合わせは既にキャッシュされているので出てこない
                [ 'head02', 'body01', 'arm01', 'waist01', 'leg01', null, 'oma01' ]
            ];
            assert.deepEqual(got, exp, 'use cache');
        });
    });
});
