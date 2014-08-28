(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore', './lib/driver-myapp.js', '../lib/data.js' ];
define(deps, function (QUnit, _, myapp, data) {

QUnit.module('19_driver-myapp');

QUnit.test('setup', function() {
    var got, exp;

    myapp.setup();
    got = data.equips.head.length;
    QUnit.ok(got > 0, 'simu.data.equips.head');
    got = data.decos.length;
    QUnit.ok(got > 0, 'simu.data.decos');
    got = Object.keys(data.skills).length;
    QUnit.ok(got > 0, 'simu.data.skills');

    myapp.setup({
        weaponSlot: 2,
        omas: [
            [ '龍の護石',3,'匠',4,'氷耐性',-5 ]
        ]
    });
    got = data.equips.weapon;
    exp = [
        { name: 'slot2', slot: 2, skillComb: {} }
    ];
    QUnit.deepEqual(got, exp, 'weapon');
    got = data.equips.oma;
    exp = [
        { name: '龍の護石(スロ3,匠+4,氷耐性-5)',
          slot: 3, skillComb: { '匠': 4, '氷耐性': -5 } }
    ];
    QUnit.deepEqual(got, exp, 'oma');
});

QUnit.test('setup: dig', function() {
    var got, exp;

    var tousyo = function (eq) { return (/発掘\(刀匠/).test(eq.name); };

    myapp.setup({ dig: true });
    got = _.chain(data.equips.head).filter(tousyo).pluck('name').value();
    exp = [ '発掘(刀匠+2)', '発掘(刀匠+3)' ];
    QUnit.deepEqual(got, exp, 'head');
    got = _.chain(data.equips.weapon).filter(tousyo).pluck('name').value();
    exp = [ '発掘(刀匠+2)', '発掘(刀匠+3)', '発掘(刀匠+4)' ];
    QUnit.deepEqual(got, exp, 'weapon');
});

QUnit.test('equip', function () {
    var got, exp;

    got = myapp.equip('body', 'ブレイブベスト').name;
    exp = 'ブレイブベスト';
    QUnit.strictEqual(got, exp, 'name,0,0');
    got = myapp.equip('body', 'ハンターメイル').name;
    exp = 'ハンターメイル';
    QUnit.strictEqual(got, exp, 'name,0,1');
    got = myapp.equip('body', 'ユクモ');
    exp = null;
    QUnit.deepEqual(got, exp, 'not found');
});

QUnit.test('oma', function () {
    var got, exp;

    got = myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]).name;
    exp = '龍の護石(スロ3,匠+4,氷耐性-5)';
    QUnit.strictEqual(got, exp, 'name');
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
           test(this.QUnit, this._, this.myapp, this.simu.data);
       }
);
