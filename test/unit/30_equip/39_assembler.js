'use strict';
var assert = require('power-assert'),
    Assembler = require('../../../lib/equip/assembler.js'),
    Normalizer = require('../../../lib/equip/normalizer.js'),
    Combinator = require('../../../lib/equip/combinator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/39_assembler', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('assemble', function () {
        var a = new Assembler();

        it('assemble', function () {
            var eqcombs = [
                { head  : [ 'head1a', 'head1b' ],
                  body  : [ 'body1' ],
                  arm   : [ 'arm1' ],
                  waist : [ 'waist1' ],
                  leg   : [ 'leg1' ],
                  weapon: [ 'weapon1' ],
                  oma   : [ 'oma1' ] },
                { head  : [ 'head2' ],
                  body  : [ 'body2' ],
                  arm   : [ 'arm2' ],
                  waist : [ 'waist2' ],
                  leg   : [ 'leg2' ],
                  weapon: [],
                  oma   : [ 'oma2a', 'oma2b' ] }
            ];
            got = a.assemble(eqcombs);
            exp = [
                { head  : 'head1a',
                  body  : 'body1',
                  arm   : 'arm1',
                  waist : 'waist1',
                  leg   : 'leg1',
                  weapon: 'weapon1',
                  oma   : 'oma1' },
                { head  : 'head1b',
                  body  : 'body1',
                  arm   : 'arm1',
                  waist : 'waist1',
                  leg   : 'leg1',
                  weapon: 'weapon1',
                  oma   : 'oma1' },
                { head  : 'head2',
                  body  : 'body2',
                  arm   : 'arm2',
                  waist : 'waist2',
                  leg   : 'leg2',
                  weapon: null,
                  oma   : 'oma2a' },
                { head  : 'head2',
                  body  : 'body2',
                  arm   : 'arm2',
                  leg   : 'leg2',
                  waist : 'waist2',
                  weapon: null,
                  oma   : 'oma2b' }
            ];
            assert.deepEqual(got, exp);
        });

        it('null or etc', function () {
            got = a.assemble();
            assert.deepEqual(got, [], 'nothing in');
            got = a.assemble(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = a.assemble(null);
            assert.deepEqual(got, [], 'null');
            got = a.assemble([]);
            assert.deepEqual(got, [], '[]');
        });
    });

    describe('assemble: weaponSlot', function () {
        var n = new Normalizer(),
            c = new Combinator(),
            a = new Assembler();

        it('weaponSlot: 2', function () {
            myapp.setup({
                context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
                weaponSlot: 2
            });
            n.initialize();

            var skills = [ '斬れ味レベル+1', '集中' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);

            got = a.assemble(eqcombs).length;
            exp = 11;
            assert(got === exp);
        });
    });

    describe('assemble: oma', function () {
        var n = new Normalizer(),
            c = new Combinator(),
            a = new Assembler();

        it('weaponSlot: 3', function () {
            myapp.setup({
                context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
                weaponSlot: 3,
                omas: [
                    [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
                    [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
                    [ '龍の護石',3,'痛撃',4 ]
                ]
            });
            n.initialize();

            var skills = [ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);

            got = a.assemble(eqcombs).length;
            exp = 3; // 頑シミュさんと同じ
            assert(got === exp);
        });

        it('weaponSlot: 0', function () {
            myapp.setup({
                context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
                weaponSlot: 0,
                omas: [
                    [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
                    [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
                    [ '龍の護石',3,'痛撃',4 ]
                ]
            });
            n.initialize();

            var skills = [ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);

            got = a.assemble(eqcombs).length;
            exp = 0;
            assert(got === exp);
        });
    });

    describe('assemble: dig', function () {
        var n = new Normalizer(),
            c = new Combinator(),
            a = new Assembler();

        it('assemble', function () {
            myapp.setup({
                omas: [
                    [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
                    [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
                    [ '龍の護石',3,'痛撃',4 ]
                ],
                dig: true
            });
            n.initialize();

            var skills = [ '真打', '集中', '弱点特効', '耳栓' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);

            got = a.assemble(eqcombs).length;
            exp = 27; // 頑シミュさんと同じ
            assert(got === exp);
        });
    });

    describe('assemble: summary', function () {
        var n = new Normalizer(),
            c = new Combinator(),
            a = new Assembler();

        it("[ '攻撃力UP【大】', '業物' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);
            got = a.assemble(eqcombs).length;
            exp = 8;
            assert(got === exp);
        });

        it("[ '斬れ味レベル+1', '高級耳栓' ]", function () {
            var skills = [ '斬れ味レベル+1', '高級耳栓' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);
            got = a.assemble(eqcombs).length;
            exp = 1427;
            assert(got === exp);
        });

        it("[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);
            got = a.assemble(eqcombs).length;
            exp = 0;
            assert(got === exp);
        });
    });
});
