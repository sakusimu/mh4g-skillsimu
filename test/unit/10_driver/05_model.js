'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    model = require('../../../test/lib/driver-model.js'),
    data = require('../../../test/lib/driver-data.js'),
    Context = require('../../../test/lib/driver-context');

describe('10_driver/05_model', function () {
    var got, exp;

    it('model.make', function () {
        var props, numProps, list;

        props = [ 'id', 'name', 'num' ];
        numProps = { num: true };
        list = [ 'ID', '名前', '0' ];
        got = model.make(list, props, numProps);
        assert(got.id === 'ID', 'id');
        assert(got.name === '名前', 'name');
        assert(got.num === 0, 'num');

        // 数値のプロパティが数値でなかったら例外
        props = [ 'num' ];
        numProps = { num: true };
        list = [ 'not a number' ];
        try { model.make(list, props, numProps); } catch (e) { got = e.message; }
        exp = 'num is NaN';
        assert(got === exp, 'not a number');
    });

    describe('equip', function () {
        it('new', function () {
            var list = [
                '名前',0,1,'レア度',2,5,6,
                '初期防御力','最終防御力','火耐性','水耐性','氷耐性','雷耐性','龍耐性',
                'スキル系統1',21,'スキル系統2',22,'スキル系統3',23,
                'スキル系統4',24,'スキル系統5',25,
                '生産素材1','個数','生産素材2','個数','生産素材3','個数','生産素材4','個数'
            ];

            got = new model.Equip(list);
            assert(typeof got, 'object', 'is object');
            assert(typeof got.initialize, 'function', 'has initialize()');

            assert(got.id === '名前,0,1', 'id');
            assert(got.name === '名前', 'name');
            assert(got.sex === 0, 'sex');
            assert(got.type === 1, 'type');
            assert(got.rarity === 'レア度', 'rarity');
            assert(got.slot === 2, 'slot');
            assert(got.availableHR === 5, 'availableHR');
            assert(got.availableVS === 6, 'availableVS');
            // '初期防御力'
            // '最終防御力'
            // '火耐性'
            // '水耐性'
            // '氷耐性'
            // '雷耐性'
            // '龍耐性'
            assert(got.skillTree1 === 'スキル系統1', 'skillTree1');
            assert(got.skillPt1 === 21, 'skillPt1');
            assert(got.skillTree2 === 'スキル系統2', 'skillTree2');
            assert(got.skillPt2 === 22, 'skillPt2');
            assert(got.skillTree3 === 'スキル系統3', 'skillTree3');
            assert(got.skillPt3 === 23, 'skillPt3');
            assert(got.skillTree4 === 'スキル系統4', 'skillTree4');
            assert(got.skillPt4 === 24, 'skillPt4');
            assert(got.skillTree5 === 'スキル系統5', 'skillTree5');
            assert(got.skillPt5 === 25, 'skillPt5');
            //QUnit.strictEqual('生産素材1');
            //QUnit.strictEqual('個数');
            //QUnit.strictEqual('生産素材2');
            //QUnit.strictEqual('個数');
            //QUnit.strictEqual('生産素材3');
            //QUnit.strictEqual('個数');
            //QUnit.strictEqual('生産素材4');
            //QUnit.strictEqual('個数');

            got = new model.Equip();
            assert(typeof got === 'object', 'nothing in: is object');
            assert(got.name === null, 'nothing in: name');

            got = new model.Equip([]);
            assert(typeof got === 'object', 'empty Array: is object');
            assert(got.name === null, 'empty Array: name');
        });

        it('toString()', function () {
            var list = ["ブレイブヘッド",0,0,1,1,1,1,1,55,2,0,0,0,1,"体力",-1,"回復速度",3,"乗り",2,null,null,null,null,"竜骨【小】",1,null,null,null,null,null,null];

            var eq = new model.Equip(list);
            got = eq.toString();
            exp = 'ブレイブヘッド';
            assert(got === exp, 'toString()');
        });

        it('isEnabled', function () {
            var lists, equips,
                ctx = new Context();

            // ID,名前,"性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",レア度,スロット数,入手時期／HR（99=集会場入手不可）,入手時期／村★（99=村入手不可）
            lists = [
                [ '両/両/r/s/HR3/★6','0','0','4','0','3','6' ],
                [ '両/剣/r/s/HR3/★6','0','1','4','0','3','6' ],
                [ '両/ガ/r/s/HR3/★6','0','2','4','0','3','6' ],

                [ '男/両/r/s/HR3/★6','1','0','4','0','3','6' ],
                [ '男/剣/r/s/HR3/★6','1','1','4','0','3','6' ],
                [ '男/ガ/r/s/HR3/★6','1','2','4','0','3','6' ],

                [ '女/両/r/s/HR3/★6','2','0','4','0','3','6' ],
                [ '女/剣/r/s/HR3/★6','2','1','4','0','3','6' ],
                [ '女/ガ/r/s/HR3/★6','2','2','4','0','3','6' ]
            ];
            equips = lists.map(function (list) { return new model.Equip(list); });

            ctx.initialize({ sex: 'm', type: 'k' });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,false, true,true,false, false,false,false ];
            assert.deepEqual(got, exp, 'm k');
            ctx.initialize({ sex: 'm', type: 'g' });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,false,true, true,false,true, false,false,false ];
            assert.deepEqual(got, exp, 'm g');
            ctx.initialize({ sex: 'w', type: 'k' });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,false, false,false,false, true,true,false ];
            assert.deepEqual(got, exp, 'w k');
            ctx.initialize({ sex: 'w', type: 'g' });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,false,true, false,false,false, true,false,true ];
            assert.deepEqual(got, exp, 'w g');

            lists = [
                [ '両/両/r/s/HR1/★1','0','0','4','0','1','1' ],
                [ '両/両/r/s/HR1/★6','0','0','4','0','1','6' ],
                [ '両/両/r/s/HR1/★99','0','0','4','0','1','99' ],

                [ '両/両/r/s/HR6/★1','0','0','4','0','6','1' ],
                [ '両/両/r/s/HR6/★6','0','0','4','0','6','6' ],
                [ '両/両/r/s/HR6/★99','0','0','4','0','6','99' ],

                [ '両/両/r/s/HR99/★1','0','0','4','0','99','1' ],
                [ '両/両/r/s/HR99/★6','0','0','4','0','99','6' ],
                [ '両/両/r/s/HR99/★99','0','0','4','0','99','99' ]
            ];
            equips = lists.map(function (list) { return new model.Equip(list); });

            ctx.initialize({ hr: 1, vs: 1 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,false,false, true,false,false ];
            assert.deepEqual(got, exp, 'hr=1, vs=1');
            ctx.initialize({ hr: 1, vs: 5 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,false,false, true,false,false ];
            assert.deepEqual(got, exp, 'hr=1, vs=5');
            ctx.initialize({ hr: 1, vs: 6 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,false, true,true,false ];
            assert.deepEqual(got, exp, 'hr=1, vs=6');
            ctx.initialize({ hr: 1, vs: 7 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,false, true,true,false ];
            assert.deepEqual(got, exp, 'hr=1, vs=7');
            ctx.initialize({ hr: 5, vs: 1 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,false,false, true,false,false ];
            assert.deepEqual(got, exp, 'hr=5, vs=1');
            ctx.initialize({ hr: 5, vs: 5 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,false,false, true,false,false ];
            assert.deepEqual(got, exp, 'hr=5, vs=5');
            ctx.initialize({ hr: 5, vs: 6 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,false, true,true,false ];
            assert.deepEqual(got, exp, 'hr=5, vs=6');
            ctx.initialize({ hr: 5, vs: 7 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,false, true,true,false ];
            assert.deepEqual(got, exp, 'hr=5, vs=7');
            ctx.initialize({ hr: 6, vs: 1 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,false,false ];
            assert.deepEqual(got, exp, 'hr=6, vs=1');
            ctx.initialize({ hr: 6, vs: 5 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,false,false ];
            assert.deepEqual(got, exp, 'hr=6, vs=5');
            ctx.initialize({ hr: 6, vs: 6 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,true,false ];
            assert.deepEqual(got, exp, 'hr=6, vs=6');
            ctx.initialize({ hr: 6, vs: 7 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,true,false ];
            assert.deepEqual(got, exp, 'hr=6, vs=7');
            ctx.initialize({ hr: 7, vs: 1 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,false,false ];
            assert.deepEqual(got, exp, 'hr=7, vs=1');
            ctx.initialize({ hr: 7, vs: 5 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,false,false ];
            assert.deepEqual(got, exp, 'hr=7, vs=5');
            ctx.initialize({ hr: 7, vs: 6 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,true,false ];
            assert.deepEqual(got, exp, 'hr=7, vs=6');
            ctx.initialize({ hr: 7, vs: 7 });
            got = equips.map(function (e) { return e.isEnabled(ctx); });
            exp = [ true,true,true, true,true,true, true,true,false ];
            assert.deepEqual(got, exp, 'hr=7, vs=7');
        });

        it('simuData', function () {
            var list = ["ジンオウメイル",0,1,3,0,3,5,21,109,0,-2,2,-4,1,"本気",3,"雷属性攻撃",1,"気配",-2,null,null,null,null,"雷狼竜の帯電毛",1,"雷狼竜の甲殻",2,"雷狼竜の蓄電殻",2,"雷光虫",10];

            var equip = new model.Equip(list);
            got = equip.simuData();
            exp = {
                name: 'ジンオウメイル',
                slot: 0,
                skillComb: { '本気': 3, '雷属性攻撃': 1, '気配': -2 }
            };
            assert.deepEqual(got, exp, 'simuData');
        });

        it('enabled', function () {
            var equips,
                ctx = new Context();

            data.equips.head = [
                [ '両/両/r/s/HR3/★6','0','0','4','0','3','6' ],
                [ '両/剣/r/s/HR3/★6','0','1','4','0','3','6' ],
                [ '両/ガ/r/s/HR3/★6','0','2','4','0','3','6' ],

                [ '男/両/r/s/HR3/★6','1','0','4','0','3','6' ],
                [ '男/剣/r/s/HR3/★6','1','1','4','0','3','6' ],
                [ '男/ガ/r/s/HR3/★6','1','2','4','0','3','6' ],

                [ '女/両/r/s/HR3/★6','2','0','4','0','3','6' ],
                [ '女/剣/r/s/HR3/★6','2','1','4','0','3','6' ],
                [ '女/ガ/r/s/HR3/★6','2','2','4','0','3','6' ]
            ];
            model.equips.initialize();
            equips = model.equips.enabled('head', ctx);
            got = _.pluck(equips, 'name');
            exp = [
                '両/両/r/s/HR3/★6',
                '両/剣/r/s/HR3/★6',
                '男/両/r/s/HR3/★6',
                '男/剣/r/s/HR3/★6'
            ];
            assert.deepEqual(got, exp, 'enabled');

            data.equips.body = [];
            model.equips.initialize();
            got = model.equips.enabled('body', ctx);
            assert.deepEqual(got, [], 'empty');

            try { model.equips.enabled(); } catch (e) { got = e.message; }
            assert(got === 'part is required');

            try { model.equips.enabled('hoge'); } catch (e) { got = e.message; }
            assert(got === 'unknown part: hoge');

            data.initialize();
            model.equips.initialize();
        });

        it('get', function () {
            got = model.equips.get('head', 'シルバーソルヘルム,0,0');
            assert(got instanceof model.Equip, 'instanceof');
            assert(got.id === 'シルバーソルヘルム,0,0', 'id');

            try { model.equips.get(); } catch (e) { got = e.message; }
            assert(got === 'part is required');
            try { model.equips.get('hoge'); } catch (e) { got = e.message; }
            assert(got === 'unknown part: hoge');

            got = model.equips.get('head', null);
            assert(got === null, 'null');

            got = model.equips.get('head', 'そんな装備ないよ');
            assert(got === null, 'non-existent equip');
        });
    });

    describe('deco', function () {
        it('new', function () {
            var list = [
                '名前','レア度',2,5,6,'スキル系統1',21,'スキル系統2',22,
                '生産素材A1','個数','生産素材A2','個数','生産素材A3','個数','生産素材A4','個数',
                '生産素材B1','個数','生産素材B2','個数','生産素材B3','個数','生産素材B4','個数'
            ];

            got = new model.Deco(list);
            assert(typeof got === 'object', 'is object');
            assert(typeof got.initialize === 'function', 'has initialize()');

            assert(got.name === '名前', 'name');
            // レア度
            assert(got.slot === 2, 'slot');
            assert(got.availableHR === 5, 'availableHR');
            assert(got.availableVS === 6, 'availableVS');
            assert(got.skillTree1 === 'スキル系統1', 'skillTree1');
            assert(got.skillPt1 === 21, 'skillPt1');
            assert(got.skillTree2 === 'スキル系統2', 'skillTree2');
            assert(got.skillPt2 === 22, 'skillPt2');
            // 生産素材A1
            // 個数
            // 生産素材A2
            // 個数
            // 生産素材A3
            // 個数
            // 生産素材A4
            // 個数
            // 生産素材B1
            // 個数
            // 生産素材B2
            // 個数
            // 生産素材B3
            // 個数
            // 生産素材B4
            // 個数

            got = new model.Deco();
            assert(typeof got === 'object', 'nothing in: is object');
            assert(got.name === null, 'nothing in: name');

            got = new model.Deco([]);
            assert(typeof got === 'object', 'empty Array: is object');
            assert(got.name === null, 'empty Array: name');
        });

        it('toString()', function () {
            var list = ["攻撃珠【１】",4,1,2,2,"攻撃",1,"防御",-1,"水光原珠",1,"ジャギィの鱗",2,"怪力の種",1,null,null,null,null,null,null,null,null,null,null];

            var deco = new model.Deco(list);
            got = deco.toString();
            exp = '攻撃珠【１】';
            assert(got === exp, 'toString()');
        });

        it('isEnabled', function () {
            var lists, decos,
                ctx = new Context();

            // 名前,レア度,スロット,入手時期／HR,入手時期／村★
            lists = [
                [ '攻撃珠【１】', '4', '1', '1', '2' ],
                [ '攻撃珠【２】', '6', '2', '2', '4' ],
                [ '攻撃珠【３】', '4', '3', '5', '99' ]
            ];
            decos = lists.map(function (list) { return new model.Deco(list); });

            ctx.initialize({ hr: 1, vs: 1 });
            got = decos.map(function (d) { return d.isEnabled(ctx); });
            exp = [ true, false, false ];
            assert.deepEqual(got, exp, 'hr=1, vs=1');
            ctx.initialize({ hr: 1, vs: 6 });
            got = decos.map(function (d) { return d.isEnabled(ctx); });
            exp = [ true, true, false ];
            assert.deepEqual(got, exp, 'hr=1, vs=6');
            ctx.initialize({ hr: 3, vs: 1 });
            got = decos.map(function (d) { return d.isEnabled(ctx); });
            exp = [ true, true, false ];
            assert.deepEqual(got, exp, 'hr=3, vs=1');
            ctx.initialize({ hr: 6, vs: 6 });
            got = decos.map(function (d) { return d.isEnabled(ctx); });
            exp = [ true, true, true ];
            assert.deepEqual(got, exp, 'hr=6, vs=6');
        });

        it('simuData', function () {
            var list = ["攻撃珠【１】",4,1,2,2,"攻撃",1,"防御",-1,"水光原珠",1,"ジャギィの鱗",2,"怪力の種",1,null,null,null,null,null,null,null,null,null,null];

            var deco = new model.Deco(list);
            got = deco.simuData();
            exp = {
                name: '攻撃珠【１】',
                slot: 1,
                skillComb: { '攻撃': 1, '防御': -1 }
            };
            assert.deepEqual(got, exp, 'simuData');
        });

        it('enabled', function () {
            var decos,
                ctx = new Context({ hr: 1, vs: 6 });

            data.decos = [
                [ '攻撃珠【１】', '4', '1', '1', '2' ],
                [ '攻撃珠【２】', '6', '2', '2', '4' ],
                [ '攻撃珠【３】', '4', '3', '5', '99' ]
            ];
            model.decos.initialize();
            decos = model.decos.enabled(ctx);
            got = _.pluck(decos, 'name');
            exp = [ '攻撃珠【１】', '攻撃珠【２】' ];
            assert.deepEqual(got, exp, 'enabled');

            data.initialize();
            model.decos.initialize();
        });

        it('get', function () {
            got = model.decos.get('攻撃珠【１】');
            assert(got instanceof model.Deco, 'instanceof');
            assert(got.name === '攻撃珠【１】', 'name');

            got = model.decos.get(null);
            assert(got === null, 'null');

            got = model.decos.get('そんな装飾品ないよ');
            assert(got === null, 'non-existent deco');
        });
    });

    describe('skill', function () {
        it('new', function () {
            var list = [ 'スキル', 'スキル系統', 0, 1 ];

            got = new model.Skill(list);
            assert(typeof got === 'object', 'is object');
            assert(typeof got.initialize === 'function', 'has initialize()');

            assert(got.name === 'スキル', 'name');
            assert(got.tree === 'スキル系統', 'tree');
            assert(got.point === 0, 'point');
            assert(got.type === 1, 'type');

            got = new model.Equip();
            assert(typeof got === 'object', 'nothing in: is object');
            assert(got.name === null, 'nothing in: name');

            got = new model.Equip([]);
            assert(typeof got === 'object', 'empty Array: is object');
            assert(got.name === null, 'empty Array: name');
        });

        it('simuData', function () {
            var list = ["攻撃力UP【大】","攻撃",20,0];

            var skill = new model.Skill(list);
            got = skill.simuData();
            exp = {
                name: '攻撃力UP【大】',
                tree: '攻撃',
                point: 20
            };
            assert.deepEqual(got, exp, 'simuData');
        });

        it('enabled', function () {
            var skills;

            data.skills = [
                [ '攻撃力UP【小】', '攻撃', 10, 0 ],
                [ '攻撃力UP【中】', '攻撃', 15, 0 ],
                [ '攻撃力UP【大】', '攻撃', 20, 0 ]
            ];
            model.skills.initialize();
            skills = model.skills.enabled();
            got = _.pluck(skills, 'name');
            exp = [ '攻撃力UP【小】', '攻撃力UP【中】', '攻撃力UP【大】' ];
            assert.deepEqual(got, exp, 'enabled');

            data.initialize();
            model.skills.initialize();
        });

        it('get', function () {
            got = model.skills.get('攻撃力UP【大】');
            assert(got instanceof model.Skill, 'instanceof');
            assert(got.name === '攻撃力UP【大】', 'name');
            assert(got.tree === '攻撃', 'tree');
            assert(got.point === 20, 'point');
            assert(got.type === 0, 'type');

            got = model.skills.get();
            assert(got === null, 'nothing in');

            got = model.skills.get(null);
            assert(got === null, 'null');

            got = model.skills.get('そんなスキルないよ');
            assert(got === null, 'non-existent skill');
        });
    });

    describe('oma', function () {
        it('new', function () {
            var list, oma;

            list = [ '龍の護石',3,'匠',4,'氷耐性',-5 ];
            oma = new model.Oma(list);
            assert(typeof oma === 'object', 'is object');
            assert(typeof oma.initialize === 'function', 'has initialize()');

            assert(oma.name === '龍の護石', 'name');
            assert(oma.slot === 3, 'slot');
            assert(oma.skillTree1 === '匠', 'skillTree1');
            assert(oma.skillPt1 === 4, 'skillPt1');
            assert(oma.skillTree2 === '氷耐性', 'skillTree2');
            assert(oma.skillPt2 === -5, 'skillPt2');

            got = oma.toString();
            exp = '龍の護石(スロ3,匠+4,氷耐性-5)';
            assert(got === exp, 'toString()');

            list = [ '龍の護石','3','痛撃溜','4' ];
            oma = new model.Oma(list);
            assert(oma.skillTree2 === null, 'skill2 is null: skillTree2');
            assert(oma.skillPt2 === 0, 'skill2 is null: skillPt2');

            got = oma.toString();
            exp = '龍の護石(スロ3,痛撃溜+4)';
            assert(got === exp, 'skill2 is null: toString()');

            got = new model.Oma();
            assert(typeof got === 'object', 'nothing in: is object');
            assert(got.name === null, 'nothing in: name');

            got = new model.Oma([]);
            assert(typeof got === 'object', 'empty Array: is object');
            assert(got.name === null, 'empty Array: name');
        });

        it('simuData', function () {
            var oma;

            oma = new model.Oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]);
            got = oma.simuData();
            exp = {
                name: '龍の護石(スロ3,匠+4,氷耐性-5)',
                slot: 3,
                skillComb: { '匠': 4, '氷耐性': -5 }
            };
            assert.deepEqual(got, exp, 'simuData');
        });
    });
});
