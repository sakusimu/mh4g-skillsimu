'use strict';
var Context = require('./driver-context.js'),
    model = require('./driver-model.js'),
    data = require('../../lib/data.js');
require('./driver-dig.js');

/**
 * シミュレータのユーザ側クラス。
 * アプリを表すクラス。
 */
var MyApp = function () {
    this.initialize.apply(this, arguments);
};

MyApp.prototype.initialize = function () {
    this.context = new Context();

    this.setup();
};

MyApp.prototype.setup = function (opts) {
    opts = opts || {};
    var self = this;

    this.context.initialize(opts.context);

    var simuData = function (obj) { return obj.simuData(); };

    var equips = {};
    data.parts.forEach(function (part) { equips[part] = []; });

    var armors = [ 'head', 'body', 'arm', 'waist', 'leg' ];
    armors.forEach(function (part) {
        var list = model.equips.enabled(part, self.context);
        equips[part] = list.map(simuData);
    });

    if (opts.weaponSlot != null) {
        var wslot  = opts.weaponSlot,
            weapon = { name: 'slot' + wslot, slot: wslot, skillComb: {} };
        equips.weapon = [ weapon ];
    }

    if (opts.omas) {
        equips.oma = [];
        opts.omas.forEach(function (list) {
            var oma = new model.Oma(list);
            equips.oma.push(oma.simuData());
        });
    }

    if (opts.dig) {
        var weapons = model.digs.enabled('weapon', this.context).map(simuData);
        equips.weapon = equips.weapon.concat(weapons);
        armors.forEach(function (part) {
            var list = model.digs.enabled(part, self.context);
            equips[part] = equips[part].concat(list.map(simuData));
        });
    }

    var decos = model.decos.enabled(this.context).map(simuData);

    var skills = {};
    model.skills.enabled().forEach(function (s) {
        skills[s.name] = s.simuData();
    });

    data.set({
        equips: equips,
        decos : decos,
        skills: skills
    });
};

MyApp.prototype.equip = function (part, name) {
    var id, eq,
        equips = model.equips,
        sex  = this.context.sex === 'm' ? 1 : 2,
        type = this.context.type === 'k' ? 1 : 2;

    id = [ name, 0, 0 ].join(',');
    eq = equips.get(part, id);
    if (eq) return eq.simuData();
    id = [ name, 0, type ].join(',');
    eq = equips.get(part, id);
    if (eq) return eq.simuData();

    id = [ name, sex, 0 ].join(',');
    eq = equips.get(part, id);
    if (eq) return eq.simuData();
    id = [ name, sex, type ].join(',');
    eq = equips.get(part, id);
    if (eq) return eq.simuData();

    return null;
};

MyApp.prototype.oma = function (list) {
    var oma = new model.Oma(list);
    return oma ? oma.simuData() : null;
};

var myapp = new MyApp();

module.exports = myapp;
