(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco/combinator.js', '../lib/deco/normalizer.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Combinator, Normalizer, myapp) {

QUnit.module('44_deco-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

// 頑シミュさんの装飾品検索の結果と比較しやすくする
var simplify = function (decombSets) {
    return _.map(decombSets, function (decombSet) {
        var torsoUp = _.some(decombSet, function (decomb) {
            if (decomb == null) return false;
            return decomb.skillComb['胴系統倍化'] ? true : false;
        });
        var names = _.map(decombSet, function (decomb, part) {
            var names = decomb ? decomb.names : [];
            if (torsoUp && part === 'body')
                names = _.map(names, function (n) { return n += '(胴)'; });
            return names;
        });
        names = _.flatten(names);
        return names.sort().join(',');
    });
};

QUnit.test('combine', function () {
    var got, exp, equipSet, skills, normalized, decombSets,
        n = new Normalizer(),
        c = new Combinator();

    var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];

    // 装備に胴系統倍化、武器スロ、お守りがある場合
    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    equipSet = {
        head  : myapp.equip('head', 'ユクモノカサ・天')  // スロ2
      , body  : myapp.equip('body', '三眼の首飾り')      // スロ3
      , arm   : myapp.equip('arm', 'ユクモノコテ・天')   // スロ2
      , waist : myapp.equip('waist', 'バンギスコイル')   // 胴系統倍化
      , leg   : myapp.equip('leg', 'ユクモノハカマ・天') // スロ2
      , weapon: { name: 'slot2' }
      , oma   : omas[0]
    };
    normalized = n.normalize(skills, equipSet);
    decombSets = c.combine(skills, normalized);
    got = simplify(decombSets);
    exp = [
        '匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)'
    ];
    QUnit.deepEqual(got, exp, 'torsoUp, weaponSlot, oma');

    // ALL三眼, 武器スロ3, お守り(匠4,スロ3)
    skills = [ '斬れ味レベル+1', '砥石使用高速化' ];
    equipSet = {
        head  : myapp.equip('head', '三眼のピアス')
      , body  : myapp.equip('body', '三眼の首飾り')
      , arm   : myapp.equip('arm', '三眼の腕輪')
      , waist : myapp.equip('waist', '三眼の腰飾り')
      , leg   : myapp.equip('leg', '三眼の足輪')
      , weapon: { name: 'slot3' }
      , oma   : omas[0]
    };
    normalized = n.normalize(skills, equipSet);
    decombSets = c.combine(skills, normalized);
    got = simplify(decombSets);
    exp = [
        '匠珠【３】,匠珠【３】,匠珠【３】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】',
        '匠珠【２】,匠珠【２】,匠珠【３】,匠珠【３】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】'
    ];
    QUnit.deepEqual(got, exp, 'all slot3');

    // 後半にスロ3が出てくるパターン(前半のスロ1は使わないスロとして処理できるか)
    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    equipSet = {
        head  : myapp.equip('head', 'ミヅハ【烏帽子】')  // スロ1
      , body  : myapp.equip('body', 'エクスゼロメイル')  // スロ1
      , arm   : myapp.equip('arm', 'EXレックスアーム')   // スロ2
      , waist : myapp.equip('waist', 'クシャナアンダ')   // スロ3
      , leg   : myapp.equip('leg', 'ゾディアスグリーヴ') // スロ3
      , weapon: null
      , oma   : null
    };
    normalized = n.normalize(skills, equipSet);
    decombSets = c.combine(skills, normalized);
    got = simplify(decombSets);
    exp = [
        '匠珠【２】,匠珠【３】,防音珠【１】,防音珠【３】',
        '匠珠【２】,匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】'
    ];
    QUnit.deepEqual(got, exp, 'slot3 appear later');

    // 既にスキルが発動
    skills = [ '斬れ味レベル+1' ];
    equipSet = {
        head  : myapp.equip('head', 'ユクモノカサ・天')
      , body  : myapp.equip('body', 'ユクモノドウギ・天')
      , arm   : myapp.equip('arm', 'ユクモノコテ・天')
      , waist : myapp.equip('waist', 'ユクモノオビ・天')
      , leg   : myapp.equip('leg', 'ユクモノハカマ・天')
      , weapon: null
      , oma   : omas[0]
    };
    normalized = n.normalize(skills, equipSet);
    decombSets = c.combine(skills, normalized);
    got = decombSets;
    exp = [ { body: null, head: null, arm: null, waist: null, leg: null,
              weapon: null, oma: null } ];
    QUnit.deepEqual(got, exp, 'already activate');
});

QUnit.test('combine: null or etc', function () {
    var got,
        c = new Combinator();

    got = c.combine();
    QUnit.deepEqual(got, [], 'nothing in');
    got = c.combine(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = c.combine(null);
    QUnit.deepEqual(got, [], 'null');
    got = c.combine([]);
    QUnit.deepEqual(got, [], '[]');

    got = c.combine([ '攻撃力UP【大】' ]);
    QUnit.deepEqual(got, [], 'skillNames only');
    got = c.combine([ '攻撃力UP【大】' ], undefined);
    QUnit.deepEqual(got, [], 'skillNames, undefined');
    got = c.combine([ '攻撃力UP【大】' ], null);
    QUnit.deepEqual(got, [], 'skillNames, null');
    got = c.combine([ '攻撃力UP【大】' ], {});
    QUnit.deepEqual(got, [], 'skillNames, {}');
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
           test(this.QUnit, this._,
                this.simu.Deco.Combinator, this.simu.Deco.Normalizer, this.myapp);
       }
);
