'use strict';
var assert = require('power-assert'),
    model = require('../../../test/lib/driver-dig.js'),
    Context = require('../../../test/lib/driver-context.js');

describe('10_driver/06_dig', function () {
    var got, exp;

    describe('dig', function () {
        it('new', function () {
            got = new model.Dig([ 0, 1, '刀匠', 4 ]);
            assert(typeof got === 'object', 'is object');
            assert(typeof got.initialize === 'function', 'has initialize()');

            assert(got.name === '発掘(刀匠+4)', 'name');
            assert(got.sex === 0, 'sex');
            assert(got.type === 1, 'type');
            assert(got.slot === 0, 'slot');
            assert(got.skillTree1 === '刀匠', 'skillTree1');
            assert(got.skillPt1 === 4, 'skillPt1');
        });

        it('toStirng()', function () {
            var dig;

            dig = new model.Dig([ 0, 1, '刀匠', 4 ]);
            got = dig.toString();
            exp = '発掘(刀匠+4)';
            assert(got === exp, 'toString()');
        });

        it('isEnabled', function () {
            var lists, digs,
                ctx = new Context();

            // "性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",スキル系統1,スキル値1
            lists = [
                [ '0','0','強欲','6' ],
                [ '0','1','刀匠','4' ],
                [ '0','2','射手','4' ]
            ];
            digs = lists.map(function (list) { return new model.Dig(list); });

            ctx.initialize({ sex: 'm', type: 'k' });
            got = digs.map(function (d) { return d.isEnabled(ctx); });
            exp = [ true,true,false ];
            assert.deepEqual(got, exp, 'm k');
            ctx.initialize({ sex: 'w', type: 'g' });
            got = digs.map(function (d) { return d.isEnabled(ctx); });
            exp = [ true,false,true ];
            assert.deepEqual(got, exp, 'w g');
        });

        it('simuData', function () {
            var dig;

            dig = new model.Dig([ 0, 1, '刀匠', 4 ]);
            got = dig.simuData();
            exp = {
                name: '発掘(刀匠+4)',
                slot: 0,
                skillComb: { '刀匠': 4 }
            };
            assert.deepEqual(got, exp, 'simuData');
        });

        it('digs: data', function () {
            got = Object.keys(model.digs.data.weapon).length;
            exp = 24;
            assert(got === exp, 'weapon');
            got = Object.keys(model.digs.data.head).length;
            exp = 36;
            assert(got === exp, 'head');
        });
    });

    describe('digs', function () {
        it('enabled', function () {
            var ctx = new Context();

            var gunner = function (dig) { return dig.skillTree1 === '射手'; };

            model.digs.initialize();
            got = model.digs.enabled('head', ctx).filter(gunner).length;
            assert(got > 0, 'enabled: head');
            got = model.digs.enabled('body', ctx).filter(gunner).length;
            assert(got === 0, 'enabled: body');

            try { model.digs.enabled(); } catch (e) { got = e.message; }
            assert(got === 'part is required');
            try { model.digs.enabled('hoge'); } catch (e) { got = e.message; }
            assert(got === 'unknown part: hoge');
        });

        it('get', function () {
            got = model.digs.get('head', '発掘(刀匠+2)');
            assert(got instanceof model.Dig, 'instanceof');
            assert(got.name === '発掘(刀匠+2)', 'name');

            try { model.digs.get(); } catch (e) { got = e.message; }
            assert(got === 'part is required');
            try { model.digs.get('hoge'); } catch (e) { got = e.message; }
            assert(got === 'unknown part: hoge');

            got = model.digs.get('head', null);
            assert(got === null, 'null');

            got = model.digs.get('head', 'そんな装備ないよ');
            assert(got === null, 'non-existent dig');
        });
    });
});
