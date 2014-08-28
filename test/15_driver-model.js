(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             './lib/driver-model.js', './lib/driver-data.js', './lib/driver-context.js' ];
define(deps, function (QUnit, _, model, data, Context) {

QUnit.module('15_driver-model');

QUnit.test('model.make', function () {
    var got, props, numProps, data;

    props = [ 'id', 'name', 'num' ];
    numProps = { num: true };
    data = [ 'ID', '名前', '0' ];
    got = model.make(data, props, numProps);
    QUnit.strictEqual(got.id, 'ID', 'id');
    QUnit.strictEqual(got.name, '名前', 'name');
    QUnit.strictEqual(got.num, 0, 'num');

    // 数値のプロパティが数値でなかったら例外
    props = [ 'num' ];
    numProps = { num: true };
    data = [ 'not a number' ];
    QUnit.throws(function () { model.make(data, props, numProps); },
                 /num is NaN/, 'not a number');
});

QUnit.test('equip: new', function () {
    var got, data;

    data = [ '名前',0,1,'レア度',2,5,6,'初期防御力','最終防御力','火耐性','水耐性','氷耐性','雷耐性','龍耐性','スキル系統1',21,'スキル系統2',22,'スキル系統3',23,'スキル系統4',24,'スキル系統5',25,'生産素材1','個数','生産素材2','個数','生産素材3','個数','生産素材4','個数' ];
    got = new model.Equip(data);
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.id, '名前,0,1', 'id');
    QUnit.strictEqual(got.name, '名前', 'name');
    QUnit.strictEqual(got.sex, 0, 'sex');
    QUnit.strictEqual(got.type, 1, 'type');
    QUnit.strictEqual(got.rarity, 'レア度', 'rarity');
    QUnit.strictEqual(got.slot, 2, 'slot');
    QUnit.strictEqual(got.availableHR, 5, 'availableHR');
    QUnit.strictEqual(got.availableVS, 6, 'availableVS');
    //QUnit.strictEqual('初期防御力');
    //QUnit.strictEqual('最終防御力');
    //QUnit.strictEqual('火耐性');
    //QUnit.strictEqual('水耐性');
    //QUnit.strictEqual('氷耐性');
    //QUnit.strictEqual('雷耐性');
    //QUnit.strictEqual('龍耐性');
    QUnit.strictEqual(got.skillTree1, 'スキル系統1', 'skillTree1');
    QUnit.strictEqual(got.skillPt1, 21, 'skillPt1');
    QUnit.strictEqual(got.skillTree2, 'スキル系統2', 'skillTree2');
    QUnit.strictEqual(got.skillPt2, 22, 'skillPt2');
    QUnit.strictEqual(got.skillTree3, 'スキル系統3', 'skillTree3');
    QUnit.strictEqual(got.skillPt3, 23, 'skillPt3');
    QUnit.strictEqual(got.skillTree4, 'スキル系統4', 'skillTree4');
    QUnit.strictEqual(got.skillPt4, 24, 'skillPt4');
    QUnit.strictEqual(got.skillTree5, 'スキル系統5', 'skillTree5');
    QUnit.strictEqual(got.skillPt5, 25, 'skillPt5');
    //QUnit.strictEqual('生産素材1');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材2');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材3');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材4');
    //QUnit.strictEqual('個数');

    got = new model.Equip();
    QUnit.strictEqual(typeof got, 'object', 'nothing in: is object');
    QUnit.strictEqual(got.name, null, 'nothing in: name');

    got = new model.Equip([]);
    QUnit.strictEqual(typeof got, 'object', 'empty Array: is object');
    QUnit.strictEqual(got.name, null, 'empty Array: name');
});

QUnit.test('equip: toString', function () {
    var got, exp,
        list = ["ブレイブヘッド",0,0,1,1,1,1,1,55,2,0,0,0,1,"体力",-1,"回復速度",3,"乗り",2,null,null,null,null,"竜骨【小】",1,null,null,null,null,null,null];

    var eq = new model.Equip(list);
    got = eq.toString();
    exp = 'ブレイブヘッド';
    QUnit.strictEqual(got, exp, 'toString()');
});

QUnit.test('equip: isEnabled', function () {
    var got, exp, data, equips,
        ctx = new Context();

    // ID,名前,"性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",レア度,スロット数,入手時期／HR（99=集会場入手不可）,入手時期／村★（99=村入手不可）
    data = [
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
    equips = data.map(function (list) { return new model.Equip(list); });

    ctx.initialize({ sex: 'm', type: 'k' });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,false, true,true,false, false,false,false ];
    QUnit.deepEqual(got, exp, 'm k');
    ctx.initialize({ sex: 'm', type: 'g' });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,false,true, true,false,true, false,false,false ];
    QUnit.deepEqual(got, exp, 'm g');
    ctx.initialize({ sex: 'w', type: 'k' });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,false, false,false,false, true,true,false ];
    QUnit.deepEqual(got, exp, 'w k');
    ctx.initialize({ sex: 'w', type: 'g' });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,false,true, false,false,false, true,false,true ];
    QUnit.deepEqual(got, exp, 'w g');

    data = [
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
    equips = data.map(function (d) { return new model.Equip(d); });

    ctx.initialize({ hr: 1, vs: 1 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,false,false, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=1, vs=1');
    ctx.initialize({ hr: 1, vs: 5 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,false,false, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=1, vs=5');
    ctx.initialize({ hr: 1, vs: 6 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,false, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=1, vs=6');
    ctx.initialize({ hr: 1, vs: 7 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,false, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=1, vs=7');
    ctx.initialize({ hr: 5, vs: 1 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,false,false, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=5, vs=1');
    ctx.initialize({ hr: 5, vs: 5 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,false,false, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=5, vs=5');
    ctx.initialize({ hr: 5, vs: 6 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,false, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=5, vs=6');
    ctx.initialize({ hr: 5, vs: 7 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,false, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=5, vs=7');
    ctx.initialize({ hr: 6, vs: 1 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=6, vs=1');
    ctx.initialize({ hr: 6, vs: 5 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=6, vs=5');
    ctx.initialize({ hr: 6, vs: 6 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=6, vs=6');
    ctx.initialize({ hr: 6, vs: 7 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=6, vs=7');
    ctx.initialize({ hr: 7, vs: 1 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=7, vs=1');
    ctx.initialize({ hr: 7, vs: 5 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,false,false ];
    QUnit.deepEqual(got, exp, 'hr=7, vs=5');
    ctx.initialize({ hr: 7, vs: 6 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=7, vs=6');
    ctx.initialize({ hr: 7, vs: 7 });
    got = equips.map(function (e) { return e.isEnabled(ctx); });
    exp = [ true,true,true, true,true,true, true,true,false ];
    QUnit.deepEqual(got, exp, 'hr=7, vs=7');
});

QUnit.test('equip: simuData', function () {
    var got, exp,
        list = ["ジンオウメイル",0,1,3,0,3,5,21,109,0,-2,2,-4,1,"本気",3,"雷属性攻撃",1,"気配",-2,null,null,null,null,"雷狼竜の帯電毛",1,"雷狼竜の甲殻",2,"雷狼竜の蓄電殻",2,"雷光虫",10];

    var equip = new model.Equip(list);
    got = equip.simuData();
    exp = {
        name: 'ジンオウメイル',
        slot: 0,
        skillComb: { '本気': 3, '雷属性攻撃': 1, '気配': -2 }
    };
    QUnit.deepEqual(got, exp, 'simuData');
});

QUnit.test('equips: enabled', function () {
    var got, exp, equips,
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
    QUnit.deepEqual(got, exp, 'enabled');

    data.equips.body = [];
    model.equips.initialize();
    got = model.equips.enabled('body', ctx);
    QUnit.deepEqual(got, [], 'empty');

    QUnit.throws(function () { model.equips.enabled(); },
                 /part is required/, 'part is required');
    QUnit.throws(function () { model.equips.enabled('hoge'); },
                 /unknown part: hoge/, 'unknown part');

    data.initialize();
    model.equips.initialize();
});

QUnit.test('equips: get', function () {
    var got;

    got = model.equips.get('head', 'シルバーソルヘルム,0,0');
    QUnit.ok(got instanceof model.Equip, 'instanceof');
    QUnit.strictEqual(got.id, 'シルバーソルヘルム,0,0', 'id');

    QUnit.throws(function () { model.equips.get(); },
                 /part is required/, 'part is required');
    QUnit.throws(function () { model.equips.get('hoge'); },
                 /unknown part: hoge/, 'unknown part');

    got = model.equips.get('head', null);
    QUnit.strictEqual(got, null, 'null');

    got = model.equips.get('head', 'そんな装備ないよ');
    QUnit.strictEqual(got, null, 'non-existent equip');
});

QUnit.test('deco: new', function () {
    var got, data;

    data = [ '名前','レア度',2,5,6,'スキル系統1',21,'スキル系統2',22,'生産素材A1','個数','生産素材A2','個数','生産素材A3','個数','生産素材A4','個数','生産素材B1','個数','生産素材B2','個数','生産素材B3','個数','生産素材B4','個数' ];
    got = new model.Deco(data);
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.name, '名前', 'name');
    //QUnit.strictEqual('レア度');
    QUnit.strictEqual(got.slot, 2, 'slot');
    QUnit.strictEqual(got.availableHR, 5, 'availableHR');
    QUnit.strictEqual(got.availableVS, 6, 'availableVS');
    QUnit.strictEqual(got.skillTree1, 'スキル系統1', 'skillTree1');
    QUnit.strictEqual(got.skillPt1, 21, 'skillPt1');
    QUnit.strictEqual(got.skillTree2, 'スキル系統2', 'skillTree2');
    QUnit.strictEqual(got.skillPt2, 22, 'skillPt2');
    //QUnit.strictEqual('生産素材A1');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材A2');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材A3');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材A4');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材B1');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材B2');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材B3');
    //QUnit.strictEqual('個数');
    //QUnit.strictEqual('生産素材B4');
    //QUnit.strictEqual('個数');

    got = new model.Deco();
    QUnit.strictEqual(typeof got, 'object', 'nothing in: is object');
    QUnit.strictEqual(got.name, null, 'nothing in: name');

    got = new model.Deco([]);
    QUnit.strictEqual(typeof got, 'object', 'empty Array: is object');
    QUnit.strictEqual(got.name, null, 'empty Array: name');
});

QUnit.test('deco: toString', function () {
    var got, exp,
        list = ["攻撃珠【１】",4,1,2,2,"攻撃",1,"防御",-1,"水光原珠",1,"ジャギィの鱗",2,"怪力の種",1,null,null,null,null,null,null,null,null,null,null];

    var deco = new model.Deco(list);
    got = deco.toString();
    exp = '攻撃珠【１】';
    QUnit.strictEqual(got, exp, 'toString()');
});

QUnit.test('deco: isEnabled', function () {
    var got, exp, data, decos,
        ctx = new Context();

    // 名前,レア度,スロット,入手時期／HR,入手時期／村★
    data = [
        [ '攻撃珠【１】', '4', '1', '1', '2' ],
        [ '攻撃珠【２】', '6', '2', '2', '4' ],
        [ '攻撃珠【３】', '4', '3', '5', '99' ]
    ];
    decos = data.map(function (list) { return new model.Deco(list); });

    ctx.initialize({ hr: 1, vs: 1 });
    got = decos.map(function (d) { return d.isEnabled(ctx); });
    exp = [ true, false, false ];
    QUnit.deepEqual(got, exp, 'hr=1, vs=1');
    ctx.initialize({ hr: 1, vs: 6 });
    got = decos.map(function (d) { return d.isEnabled(ctx); });
    exp = [ true, true, false ];
    QUnit.deepEqual(got, exp, 'hr=1, vs=6');
    ctx.initialize({ hr: 3, vs: 1 });
    got = decos.map(function (d) { return d.isEnabled(ctx); });
    exp = [ true, true, false ];
    QUnit.deepEqual(got, exp, 'hr=3, vs=1');
    ctx.initialize({ hr: 6, vs: 6 });
    got = decos.map(function (d) { return d.isEnabled(ctx); });
    exp = [ true, true, true ];
    QUnit.deepEqual(got, exp, 'hr=6, vs=6');
});

QUnit.test('deco: simuData', function () {
    var got, exp,
        list = ["攻撃珠【１】",4,1,2,2,"攻撃",1,"防御",-1,"水光原珠",1,"ジャギィの鱗",2,"怪力の種",1,null,null,null,null,null,null,null,null,null,null];

    var deco = new model.Deco(list);
    got = deco.simuData();
    exp = {
        name: '攻撃珠【１】',
        slot: 1,
        skillComb: { '攻撃': 1, '防御': -1 }
    };
    QUnit.deepEqual(got, exp, 'simuData');
});

QUnit.test('decos: enabled', function () {
    var got, exp, decos,
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
    QUnit.deepEqual(got, exp, 'enabled');

    data.initialize();
    model.decos.initialize();
});

QUnit.test('decos: get', function () {
    var got;

    got = model.decos.get('攻撃珠【１】');
    QUnit.ok(got instanceof model.Deco, 'instanceof');
    QUnit.strictEqual(got.name, '攻撃珠【１】', 'name');

    got = model.decos.get(null);
    QUnit.strictEqual(got, null, 'null');

    got = model.decos.get('そんな装飾品ないよ');
    QUnit.strictEqual(got, null, 'non-existent deco');
});

QUnit.test('skill: new', function () {
    var got, data;

    data = [ 'スキル', 'スキル系統', 0, 1 ];
    got = new model.Skill(data);
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.name, 'スキル', 'name');
    QUnit.strictEqual(got.tree, 'スキル系統', 'tree');
    QUnit.strictEqual(got.point, 0, 'point');
    QUnit.strictEqual(got.type, 1, 'type');

    got = new model.Equip();
    QUnit.strictEqual(typeof got, 'object', 'nothing in: is object');
    QUnit.strictEqual(got.name, null, 'nothing in: name');

    got = new model.Equip([]);
    QUnit.strictEqual(typeof got, 'object', 'empty Array: is object');
    QUnit.strictEqual(got.name, null, 'empty Array: name');
});

QUnit.test('skill: simuData', function () {
    var got, exp,
        list = ["攻撃力UP【大】","攻撃",20,0];

    var skill = new model.Skill(list);
    got = skill.simuData();
    exp = {
        name: '攻撃力UP【大】',
        tree: '攻撃',
        point: 20
    };
    QUnit.deepEqual(got, exp, 'simuData');
});

QUnit.test('skills: enabled', function () {
    var got, exp, skills;

    data.skills = [
        [ '攻撃力UP【小】', '攻撃', 10, 0 ],
        [ '攻撃力UP【中】', '攻撃', 15, 0 ],
        [ '攻撃力UP【大】', '攻撃', 20, 0 ]
    ];
    model.skills.initialize();
    skills = model.skills.enabled();
    got = _.pluck(skills, 'name');
    exp = [ '攻撃力UP【小】', '攻撃力UP【中】', '攻撃力UP【大】' ];
    QUnit.deepEqual(got, exp, 'enabled');

    data.initialize();
    model.skills.initialize();
});

QUnit.test('get', function () {
    var got;

    got = model.skills.get('攻撃力UP【大】');
    QUnit.ok(got instanceof model.Skill, 'instanceof');
    QUnit.strictEqual(got.name, '攻撃力UP【大】', 'name');
    QUnit.strictEqual(got.tree, '攻撃', 'tree');
    QUnit.strictEqual(got.point, 20, 'point');
    QUnit.strictEqual(got.type, 0, 'type');

    got = model.skills.get();
    QUnit.strictEqual(got, null, 'nothing in');

    got = model.skills.get(null);
    QUnit.strictEqual(got, null, 'null');

    got = model.skills.get('そんなスキルないよ');
    QUnit.strictEqual(got, null, 'non-existent skill');
});

QUnit.test('oma: new', function () {
    var got, exp, data, oma;

    data = [ '龍の護石',3,'匠',4,'氷耐性',-5 ];
    oma = new model.Oma(data);
    QUnit.strictEqual(typeof oma, 'object', 'is object');
    QUnit.strictEqual(typeof oma.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(oma.name, '龍の護石', 'name');
    QUnit.strictEqual(oma.slot, 3, 'slot');
    QUnit.strictEqual(oma.skillTree1, '匠', 'skillTree1');
    QUnit.strictEqual(oma.skillPt1, 4, 'skillPt1');
    QUnit.strictEqual(oma.skillTree2, '氷耐性', 'skillTree2');
    QUnit.strictEqual(oma.skillPt2, -5, 'skillPt2');

    got = oma.toString();
    exp = '龍の護石(スロ3,匠+4,氷耐性-5)';
    QUnit.strictEqual(got, exp, 'toString()');

    data = [ '龍の護石','3','痛撃溜','4' ];
    oma = new model.Oma(data);
    QUnit.strictEqual(oma.skillTree2, null, 'skill2 is null: skillTree2');
    QUnit.strictEqual(oma.skillPt2, 0, 'skill2 is null: skillPt2');

    got = oma.toString();
    exp = '龍の護石(スロ3,痛撃溜+4)';
    QUnit.strictEqual(got, exp, 'skill2 is null: toString()');

    got = new model.Oma();
    QUnit.strictEqual(typeof got, 'object', 'nothing in: is object');
    QUnit.strictEqual(got.name, null, 'nothing in: name');

    got = new model.Oma([]);
    QUnit.strictEqual(typeof got, 'object', 'empty Array: is object');
    QUnit.strictEqual(got.name, null, 'empty Array: name');
});

QUnit.test('oma: simuData', function () {
    var got, exp, oma;

    oma = new model.Oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]);
    got = oma.simuData();
    exp = {
        name: '龍の護石(スロ3,匠+4,氷耐性-5)',
        slot: 3,
        skillComb: { '匠': 4, '氷耐性': -5 }
    };
    QUnit.deepEqual(got, exp, 'simuData');
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
           test(this.QUnit, this._, this.myapp.model, this.myapp.data, this.myapp.Context);
       }
);
