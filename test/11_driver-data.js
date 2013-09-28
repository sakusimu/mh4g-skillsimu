(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore', './lib/driver-data.js' ];
define(deps, function (QUnit, _, data) {

QUnit.module('11_driver-data');

QUnit.test('data', function () {
    var got, exp;

    QUnit.strictEqual(typeof data, 'object', 'is object');
    QUnit.strictEqual(typeof data.initialize, 'function', 'has initialize()');

    got = _.keys(data.equips).join(',');
    exp = 'head,body,arm,waist,leg';
    QUnit.strictEqual(got, exp, 'equips: parts');
});

QUnit.test('equips', function () {
    var got, exp,
        equips = data.equips;

    got = _.keys(equips.head).length;
    QUnit.equal(got, 319, 'equips.head.length');
    got = equips.head['ブレイブヘッド,0,0'];
    exp = ["ブレイブヘッド,0,0","ブレイブヘッド",0,0,1,1,1,1,1,1,2,0,0,0,1,"体力",-1,"回復速度",3,"乗り",2,null,null,null,null,"竜骨【小】",1,null,null,null,null,null,null];
    QUnit.deepEqual(got, exp, 'equips.head');

    got = _.keys(equips.body).length;
    QUnit.equal(got, 317, 'equips.body.length');
    got = equips.body['ブレイブベスト,0,0'];
    exp = ["ブレイブベスト,0,0","ブレイブベスト",0,0,1,0,1,1,1,1,2,0,0,0,1,"体力",-2,"回復速度",2,"乗り",3,null,null,null,null,"竜骨【小】",1,"鉄鉱石",1,null,null,null,null];
    QUnit.deepEqual(got, exp, 'equips.body');

    got = _.keys(equips.arm).length;
    QUnit.equal(got, 312, 'equips.arm.length');
    got = equips.arm['ブレイブグラブ,0,0'];
    exp = ["ブレイブグラブ,0,0","ブレイブグラブ",0,0,1,0,1,1,1,1,2,0,0,0,1,"採取",3,"運気",2,"体力",-2,"乗り",2,null,null,"竜骨【小】",1,null,null,null,null,null,null];
    QUnit.deepEqual(got, exp, 'equips.arm');

    got = _.keys(equips.waist).length;
    QUnit.equal(got, 307, 'equips.waist.length');
    got = equips.waist['ブレイブベルト,0,0'];
    exp = ["ブレイブベルト,0,0","ブレイブベルト",0,0,1,2,1,1,1,1,2,0,0,0,1,"体力",-2,"回復速度",3,"乗り",1,null,null,null,null,"竜骨【小】",1,"鉄鉱石",1,null,null,null,null];
    QUnit.deepEqual(got, exp, 'equips.waist');

    got = _.keys(equips.leg).length;
    QUnit.equal(got, 313, 'equips.leg.length');
    got = equips.leg['ブレイブパンツ,0,0'];
    exp = ["ブレイブパンツ,0,0","ブレイブパンツ",0,0,1,0,1,1,1,1,2,0,0,0,1,"体力",-2,"回復速度",2,"乗り",4,null,null,null,null,"竜骨【小】",1,null,null,null,null,null,null];
    QUnit.deepEqual(got, exp, 'equips.leg');
});

QUnit.test('decos', function () {
    var got, exp,
        decos = data.decos;

    got = _.keys(decos).length;
    QUnit.equal(got, 178, 'decos.length');
    got = decos['耐絶珠【１】'];
    exp = ["耐絶珠【１】",4,1,1,1,"気絶",1,"麻痺",-1,"水光原珠",1,"鳥竜種の牙",3,null,null,null,null,null,null,null,null,null,null,null,null];
    QUnit.deepEqual(got, exp, 'decos[0]');
});

QUnit.test('skills', function () {
    var got, exp,
        skills = data.skills;

    got = _.keys(skills).length;
    QUnit.equal(got, 255, 'skills.length');
    got = skills['攻撃力UP【小】'];
    exp = ["攻撃力UP【小】","攻撃",10,0];
    QUnit.deepEqual(got, exp, 'skills[0]');
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
           test(this.QUnit, this._, this.myapp.data);
       }
);
