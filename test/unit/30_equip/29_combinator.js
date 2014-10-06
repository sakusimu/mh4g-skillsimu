'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/equip/combinator.js'),
    Normalizer = require('../../../lib/equip/normalizer.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/29_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('combine', function () {
        var c = new Combinator();

        it('null or etc', function () {
            got = c.combine();
            assert.deepEqual(got, [], 'nothing in');
            got = c.combine(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = c.combine(null);
            assert.deepEqual(got, [], 'null');
            got = c.combine({});
            assert.deepEqual(got, [], '{}');

            got = c.combine([ '攻撃力UP【大】' ]);
            assert.deepEqual(got, [], 'skillNames only');
            got = c.combine([ '攻撃力UP【大】' ], undefined);
            assert.deepEqual(got, [], 'skillNames, undefined');
            got = c.combine([ '攻撃力UP【大】' ], null);
            assert.deepEqual(got, [], 'skillNames, null');
            got = c.combine([ '攻撃力UP【大】' ], {});
            assert.deepEqual(got, [], 'skillNames, {}');
        });
    });

    describe('combine: weaponSlot', function () {
        var n = new Normalizer(),
            c = new Combinator();

        it('weaponSlot: 2', function () {
            myapp.setup({
                context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
                weaponSlot: 2
            });
            n.initialize();

            var skills = [ '斬れ味レベル+1', '集中' ];
            var bulksSet = n.normalize(skills);

            var eqcombs = c.combine(skills, bulksSet);
            got = eqcombs.length;
            exp = 6;
            assert(got === exp);
        });
    });

    describe('combine: oma', function () {
        var n = new Normalizer(),
            c = new Combinator();

        it('combine', function () {
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
            got = eqcombs.length;
            exp = 12;
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
            got = eqcombs.length;
            exp = 0;
            assert(got === exp);
        });
    });

    describe('combine: dig', function () {
        var n = new Normalizer(),
            c = new Combinator();

        it('combine', function () {
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
            got = eqcombs.length;
            exp = 141;
            assert(got === exp);
        });
    });

    describe('combine: summary', function () {
        var n = new Normalizer(),
            c = new Combinator();

        it("[ '攻撃力UP【大】', '業物' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);
            got = eqcombs.length;
            exp = 18;
            assert(got === exp);
        });

        it("[ '斬れ味レベル+1', '高級耳栓' ]", function () {
            var skills = [ '斬れ味レベル+1', '高級耳栓' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);
            got = eqcombs.length;
            exp = 418;
            assert(got === exp);
        });

        it("[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
            var bulksSet = n.normalize(skills);
            var eqcombs = c.combine(skills, bulksSet);
            got = eqcombs.length;
            exp = 0;
            assert(got === exp, skills.join(', '));
        });
    });
});
