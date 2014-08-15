(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', './lib/driver-myapp.js', '../lib/data.js' ];
define(deps, function (QUnit, myapp, data) {

QUnit.module('19_driver-myapp');

QUnit.test('setup', function() {
    var got;

    myapp.setup();
    got = data.equips.head.length;
    QUnit.ok(got > 0, 'simu.data.equips.head');
    got = data.decos.length;
    QUnit.ok(got > 0, 'simu.data.decos');
    got = Object.keys(data.skills).length;
    QUnit.ok(got > 0, 'simu.data.skills');
});

QUnit.test('equip', function () {
    var got;

    got = myapp.equip('body', 'ブレイブベスト');
    QUnit.strictEqual(got.name, 'ブレイブベスト', 'name,0,0');
    got = myapp.equip('body', 'ハンターメイル');
    QUnit.strictEqual(got.name, 'ハンターメイル', 'name,0,1');
    got = myapp.equip('body', 'ユクモ');
    QUnit.deepEqual(got, null, 'not found');
});

QUnit.test('oma', function () {
    var got;
    got = myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]);
    QUnit.strictEqual(got.name, '龍の護石(スロ3,匠+4,氷耐性-5)', 'name');
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
           test(this.QUnit, this.myapp, this.simu.data);
       }
);
