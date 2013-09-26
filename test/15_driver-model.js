(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             './lib/driver-model.js', './lib/driver-data.js', './lib/driver-context.js' ];
define(deps, function (QUnit, _, model, data, context) {

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
                  'num is NaN', 'not a number');
});

QUnit.test('equip: new', function () {
    var got, data;

    data = [ 'ID', '名前',0,1,'レア度',2,5,6,'初期防御力','最終防御力','火耐性','水耐性','氷耐性','雷耐性','龍耐性','スキル系統1',21,'スキル系統2',22,'スキル系統3',23,'スキル系統4',24,'スキル系統5',25,'生産素材1','個数','生産素材2','個数','生産素材3','個数','生産素材4','個数' ];
    got = new model.Equip(data);
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.id, 'ID', 'id');
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

QUnit.test('equip: isEnabled', function () {
    var data, equips,
        ctx = _.clone(context);

    var myok = function (c, exp, label) {
        _.defaults(c, ctx);
        exp = _.flatten(exp);
        var got = _.map(equips, function (e) { return e.isEnabled(c); });
        QUnit.deepEqual(got, exp, label);
    };

    // ID,名前,"性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",レア度,スロット数,入手時期／HR（99=集会場入手不可）,入手時期／村★（99=村入手不可）
    data = [
        [ 'ID','両/両/r/s/HR3/★6','0','0','4','0','3','6' ],
        [ 'ID','両/剣/r/s/HR3/★6','0','1','4','0','3','6' ],
        [ 'ID','両/ガ/r/s/HR3/★6','0','2','4','0','3','6' ],

        [ 'ID','男/両/r/s/HR3/★6','1','0','4','0','3','6' ],
        [ 'ID','男/剣/r/s/HR3/★6','1','1','4','0','3','6' ],
        [ 'ID','男/ガ/r/s/HR3/★6','1','2','4','0','3','6' ],

        [ 'ID','女/両/r/s/HR3/★6','2','0','4','0','3','6' ],
        [ 'ID','女/剣/r/s/HR3/★6','2','1','4','0','3','6' ],
        [ 'ID','女/ガ/r/s/HR3/★6','2','2','4','0','3','6' ]
    ];
    equips = _.map(data, function (d) { return new model.Equip(d); });

    myok({ sex: 'm', type: 'k' },
         [ [true,true,false], [true,true,false], [false,false,false] ], 'm k');
    myok({ sex: 'm', type: 'g' },
         [ [true,false,true], [true,false,true], [false,false,false] ], 'm g');
    myok({ sex: 'w', type: 'k' },
         [ [true,true,false], [false,false,false], [true,true,false] ], 'w k');
    myok({ sex: 'w', type: 'g' },
         [ [true,false,true], [false,false,false], [true,false,true] ], 'w g');

    data = [
        [ 'ID','両/両/r/s/HR1/★1','0','0','4','0','1','1' ],
        [ 'ID','両/両/r/s/HR1/★6','0','0','4','0','1','6' ],
        [ 'ID','両/両/r/s/HR1/★99','0','0','4','0','1','99' ],

        [ 'ID','両/両/r/s/HR6/★1','0','0','4','0','6','1' ],
        [ 'ID','両/両/r/s/HR6/★6','0','0','4','0','6','6' ],
        [ 'ID','両/両/r/s/HR6/★99','0','0','4','0','6','99' ],

        [ 'ID','両/両/r/s/HR99/★1','0','0','4','0','99','1' ],
        [ 'ID','両/両/r/s/HR99/★6','0','0','4','0','99','6' ],
        [ 'ID','両/両/r/s/HR99/★99','0','0','4','0','99','99' ]
    ];
    equips = _.map(data, function (d) { return new model.Equip(d); });

    myok({ hr: 1, vs: 1 },
         [ [true,true,true], [true,false,false], [true,false,false] ], 'hr=1, vs=1');
    myok({ hr: 1, vs: 5 },
         [ [true,true,true], [true,false,false], [true,false,false] ], 'hr=1, vs=5');
    myok({ hr: 1, vs: 6 },
         [ [true,true,true], [true,true,false], [true,true,false] ], 'hr=1, vs=6');
    myok({ hr: 1, vs: 7 },
         [ [true,true,true], [true,true,false], [true,true,false] ], 'hr=1, vs=7');
    myok({ hr: 5, vs: 1 },
         [ [true,true,true], [true,false,false], [true,false,false] ], 'hr=5, vs=1');
    myok({ hr: 5, vs: 5 },
         [ [true,true,true], [true,false,false], [true,false,false] ], 'hr=5, vs=5');
    myok({ hr: 5, vs: 6 },
         [ [true,true,true], [true,true,false], [true,true,false] ], 'hr=5, vs=6');
    myok({ hr: 5, vs: 7 },
         [ [true,true,true], [true,true,false], [true,true,false] ], 'hr=5, vs=7');
    myok({ hr: 6, vs: 1 },
         [ [true,true,true], [true,true,true], [true,false,false] ], 'hr=6, vs=1');
    myok({ hr: 6, vs: 5 },
         [ [true,true,true], [true,true,true], [true,false,false] ], 'hr=6, vs=5');
    myok({ hr: 6, vs: 6 },
         [ [true,true,true], [true,true,true], [true,true,false] ], 'hr=6, vs=6');
    myok({ hr: 6, vs: 7 },
         [ [true,true,true], [true,true,true], [true,true,false] ], 'hr=6, vs=7');
    myok({ hr: 7, vs: 1 },
         [ [true,true,true], [true,true,true], [true,false,false] ], 'hr=7, vs=1');
    myok({ hr: 7, vs: 5 },
         [ [true,true,true], [true,true,true], [true,false,false] ], 'hr=7, vs=5');
    myok({ hr: 7, vs: 6 },
         [ [true,true,true], [true,true,true], [true,true,false] ], 'hr=7, vs=6');
    myok({ hr: 7, vs: 7 },
         [ [true,true,true], [true,true,true], [true,true,false] ], 'hr=7, vs=7');
});

QUnit.test('equip: enabledEquips', function () {
    var got, exp;

    context.initialize();

    var backup = data.equips;
    data.equips = _.clone(data.equips);

    var head = [
        [ 'ID','両/両/r/s/HR3/★6','0','0','4','0','3','6' ],
        [ 'ID','両/剣/r/s/HR3/★6','0','1','4','0','3','6' ],
        [ 'ID','両/ガ/r/s/HR3/★6','0','2','4','0','3','6' ],

        [ 'ID','男/両/r/s/HR3/★6','1','0','4','0','3','6' ],
        [ 'ID','男/剣/r/s/HR3/★6','1','1','4','0','3','6' ],
        [ 'ID','男/ガ/r/s/HR3/★6','1','2','4','0','3','6' ],

        [ 'ID','女/両/r/s/HR3/★6','2','0','4','0','3','6' ],
        [ 'ID','女/剣/r/s/HR3/★6','2','1','4','0','3','6' ],
        [ 'ID','女/ガ/r/s/HR3/★6','2','2','4','0','3','6' ]
    ];

    data.equips.head = head;
    got = model.Equip.enabledEquips('head');

    got = _.pluck(got, 'name');
    exp = [ '両/両/r/s/HR3/★6',
            '両/剣/r/s/HR3/★6',
            '男/両/r/s/HR3/★6',
            '男/剣/r/s/HR3/★6' ];
    QUnit.deepEqual(got, exp, 'enabled');

    data.equips.body = [];
    got = model.Equip.enabledEquips('body');
    QUnit.deepEqual(got, [], 'empty');

    QUnit.throws(function () { model.Equip.enabledEquips(); },
                 'part is required', 'part is required');
    QUnit.throws(function () { model.Equip.enabledEquips('hoge'); },
                 'unknown part: hoge', 'unknown part');

    data.equips = backup;
});

QUnit.test('equip: get', function () {
    var got;

    got = model.Equip.get('head', 'シルバーソルヘルム,0,0');
    QUnit.ok(got instanceof model.Equip, 'instanceof');
    QUnit.strictEqual(got.id, 'シルバーソルヘルム,0,0', 'id');
    QUnit.strictEqual(got.name, 'シルバーソルヘルム', 'name');

    QUnit.throws(function () { model.Equip.get(); },
                 'part is required', 'part is required');
    QUnit.throws(function () { model.Equip.get('hoge'); },
                 'unknown part: hoge', 'unknown part');

    got = model.Equip.get('head', null);
    QUnit.strictEqual(got, null, 'null');

    got = model.Equip.get('head', 'そんな装備ないよ');
    QUnit.strictEqual(got, null, 'non-existent equip');
});

QUnit.test('equip: simuData', function () {
    var got, exp, equip;

    equip = model.Equip.get('body', 'ジンオウメイル,0,1');
    got = equip.simuData();
    exp = {
        name: 'ジンオウメイル',
        slot: 0,
        skillComb: { '本気': 3, '雷属性攻撃': 1, '気配': -2 }
    };
    QUnit.deepEqual(got, exp, 'simuData');
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

QUnit.test('deco: isEnabled', function () {
    var data, decos,
        ctx = _.clone(context);

    // 名前,レア度,スロット,入手時期／HR,入手時期／村★
    data = [
        [ '攻撃珠【１】', '4', '1', '1', '2' ],
        [ '攻撃珠【２】', '6', '2', '2', '4' ],
        [ '攻撃珠【３】', '4', '3', '5', '99' ]
    ];
    decos = _.map(data, function (data) { return new model.Deco(data); });

    var myok = function (c, exp, label) {
        _.defaults(c, ctx);
        var got = _.map(decos, function (d) { return d.isEnabled(c); });
        QUnit.deepEqual(got, exp, label);
    };

    myok({ hr: 1, vs: 1 }, [ true, false, false ], 'hr=1, vs=1');
    myok({ hr: 1, vs: 6 }, [ true, true, false ], 'hr=1, vs=6');
    myok({ hr: 3, vs: 1 }, [ true, true, false ], 'hr=3, vs=1');
    myok({ hr: 6, vs: 6 }, [ true, true, true ], 'hr=6, vs=6');
});

QUnit.test('deco: enabledDecos', function () {
    var got, exp;

    context.initialize({ hr: 1, vs: 6 });

    var backup = data.decos;

    var decos = [
        [ '攻撃珠【１】', '4', '1', '1', '2' ],
        [ '攻撃珠【２】', '6', '2', '2', '4' ],
        [ '攻撃珠【３】', '4', '3', '5', '99' ]
    ];

    data.decos = decos;
    got = model.Deco.enabledDecos();

    got = _.pluck(got, 'name');
    exp = [ '攻撃珠【１】', '攻撃珠【２】' ];
    QUnit.deepEqual(got, exp, 'enabled');

    data.decos = backup;
});

QUnit.test('deco: get', function () {
    var got;

    got = model.Deco.get('攻撃珠【１】');
    QUnit.ok(got instanceof model.Deco, 'instanceof');
    QUnit.strictEqual(got.name, '攻撃珠【１】', 'name');

    got = model.Deco.get(null);
    QUnit.strictEqual(got, null, 'null');

    got = model.Deco.get('そんな装飾品ないよ');
    QUnit.strictEqual(got, null, 'non-existent deco');
});

QUnit.test('deco: simuData', function () {
    var got, exp, deco;

    deco = model.Deco.get('攻撃珠【１】');
    got = deco.simuData();
    exp = {
        name: '攻撃珠【１】',
        slot: 1,
        skillComb: { '攻撃': 1, '防御': -1 }
    };

    QUnit.deepEqual(got, exp, 'simuData');
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

QUnit.test('get', function () {
    var got;

    got = model.Skill.get('攻撃力UP【大】');
    QUnit.ok(got instanceof model.Skill, 'instanceof');
    QUnit.strictEqual(got.name, '攻撃力UP【大】', 'name');
    QUnit.strictEqual(got.tree, '攻撃', 'tree');
    QUnit.strictEqual(got.point, 20, 'point');
    QUnit.strictEqual(got.type, 0, 'type');

    got = model.Skill.get();
    QUnit.strictEqual(got, null, 'nothing in');

    got = model.Skill.get(null);
    QUnit.strictEqual(got, null, 'null');

    got = model.Skill.get('そんなスキルないよ');
    QUnit.strictEqual(got, null, 'non-existent skill');
});

QUnit.test('skill: enabledSkills', function () {
    var got, exp;

    var backup = data.skills;

    var skills = [
        [ '攻撃力UP【小】', '攻撃', 10, 0 ],
        [ '攻撃力UP【中】', '攻撃', 15, 0 ],
        [ '攻撃力UP【大】', '攻撃', 20, 0 ]
    ];

    data.skills = skills;
    got = model.Skill.enabledSkills();

    got = _.pluck(got, 'name');
    exp = [ '攻撃力UP【小】', '攻撃力UP【中】', '攻撃力UP【大】' ];
    QUnit.deepEqual(got, exp, 'enabled');

    data.skills = backup;
});

QUnit.test('skill: simuData', function () {
    var got, exp, skill;

    skill = model.Skill.get('攻撃力UP【大】');
    got = skill.simuData();
    exp = {
        name: '攻撃力UP【大】',
        tree: '攻撃',
        point: 20
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
           test(this.QUnit, this._, this.myapp.model, this.myapp.data, this.myapp.context);
       }
);
