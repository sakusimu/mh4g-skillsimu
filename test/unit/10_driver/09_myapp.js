'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    myapp = require('../../../test/lib/driver-myapp.js'),
    data = require('../../../lib/data.js');

describe('10_driver/09_myapp', function () {
    var got, exp;

    it('setup', function() {
        myapp.setup();
        got = data.equips.head.length;
        assert(got > 0, 'simu.data.equips.head');
        got = data.decos.length;
        assert(got > 0, 'simu.data.decos');
        got = Object.keys(data.skills).length;
        assert(got > 0, 'simu.data.skills');

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
        assert.deepEqual(got, exp, 'weapon');
        got = data.equips.oma;
        exp = [
            { name: '龍の護石(スロ3,匠+4,氷耐性-5)',
              slot: 3, skillComb: { '匠': 4, '氷耐性': -5 } }
        ];
        assert.deepEqual(got, exp, 'oma');
    });

    it('setup: dig', function() {
        var tousyo = function (eq) { return (/発掘\(刀匠/).test(eq.name); };

        myapp.setup({ dig: true });
        got = _.chain(data.equips.head).filter(tousyo).pluck('name').value();
        exp = [ '発掘(刀匠+2)', '発掘(刀匠+3)' ];
        assert.deepEqual(got, exp, 'head');
        got = _.chain(data.equips.weapon).filter(tousyo).pluck('name').value();
        exp = [ '発掘(刀匠+2)', '発掘(刀匠+3)', '発掘(刀匠+4)' ];
        assert.deepEqual(got, exp, 'weapon');
    });

    it('equip', function () {
        got = myapp.equip('body', 'ブレイブベスト').name;
        exp = 'ブレイブベスト';
        assert(got === exp, 'name,0,0');
        got = myapp.equip('body', 'ハンターメイル').name;
        exp = 'ハンターメイル';
        assert(got === exp, 'name,0,1');
        got = myapp.equip('body', 'ユクモ');
        exp = null;
        assert.deepEqual(got, exp, 'not found');
    });

    it('oma', function () {
        got = myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]).name;
        exp = '龍の護石(スロ3,匠+4,氷耐性-5)';
        assert(got === exp, 'name');
    });
});
