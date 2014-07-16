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

    // 装備に胴系統倍化、武器スロ、お守りがある場合
    var omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
    omas = myapp.model.Oma.createSimuData(omas);

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
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
        head  : myapp.equips('head', '三眼のピアス')[0]
      , body  : myapp.equips('body', '三眼の首飾り')[0]
      , arm   : myapp.equips('arm', '三眼の腕輪')[0]
      , waist : myapp.equips('waist', '三眼の腰飾り')[0]
      , leg   : myapp.equips('leg', '三眼の足輪')[0]
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

    skills = [ '斬れ味レベル+1' ];
    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]
      , body  : myapp.equips('body', 'ユクモノドウギ・天')[0]
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]
      , waist : myapp.equips('waist', 'ユクモノオビ・天')[0]
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0]
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
