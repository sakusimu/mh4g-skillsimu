(function (define) {
'use strict';
define([ './driver-model.js' ], function (model) {

/**
 * シミュレータのユーザ側にあたるクラス。
 * 発掘装備のクラス。
 */
var Dig = function () {
    this.initialize.apply(this, arguments);
};

/**
 * 引数の dig は以下を要素とする配列。
 * "性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",スキル系統1,スキル値1
 */
Dig.prototype.initialize = function (dig) {
    dig = dig || [];
    var props = [ 'sex', 'type', 'skillTree1', 'skillPt1' ];
    var numProps = { sex: true, type: true, skillPt1: true };

    var obj = model.make(dig, props, numProps);
    for (var prop in obj) this[prop] = obj[prop];

    this.name = '発掘' + '(' + this.skillTree1 + '+' + this.skillPt1 + ')';
    this.slot = 0;
};

Dig.prototype.toString = function () {
    return this.name;
};

Dig.prototype.isEnabled = function (context) {
    var c = context;

    // タイプ(0=両方,1=剣士,2=ガンナー): k=[01], g=[02]
    if (c.type === 'k' && +this.type !== 0 && +this.type !== 1) return false;
    if (c.type === 'g' && +this.type !== 0 && +this.type !== 2) return false;

    return true;
};

Dig.prototype.simuData = function () {
    return {
        name     : this.name,
        slot     : this.slot,
        skillComb: model.makeSkillComb(this, 1)
    };
};

var Digs = function () {
    this.initialize.apply(this, arguments);
};

Digs.prototype.initialize = function () {
    this.data = {};
    this.data.weapon = makeWeapons();
    var armors = makeArmors();
    this.data.head = makeArmors({ type: 0 });
    this.data.body = armors;
    this.data.arm  = armors;
    this.data.waist = armors;
    this.data.leg  = armors;
};

var makeWeapons = function () {
    var assets = {
        '刀匠': { pt: [2,3,4], type: 1 },
        '状耐': { pt: [2,3,4], type: 1 },
        '回避': { pt: [3,4,5], type: 1 },
        '射手': { pt: [2,3,4], type: 2 },
        '怒'  : { pt: [2,3,4], type: 2 },
        '頑強': { pt: [3,4,5], type: 2 },
        '強欲': { pt: [3,4,6], type: 0 },
        '護収': { pt: [3,4,6], type: 0 }
    };
    var weapons = {};
    for (var tree in assets) {
        var a = assets[tree];
        for (var i = 0, len = a.pt.length; i < len; ++i) {
            var dig = new Dig([ 0, a.type, tree, a.pt[i] ]);
            weapons[dig.name] = dig;
        }
    }
    return weapons;
};
var makeArmors = function (args) {
    args = args || {};
    var assets = {
        '刀匠': { pt: [2,3], type: 1 },
        '状耐': { pt: [2,3], type: 1 },
        '回避': { pt: [2,3,4], type: 1 },
        '居合': { pt: [2,3,4], type: 1 },
        '射手': { pt: [2,3], type: 2 },
        '怒'  : { pt: [2,3], type: 2 },
        '頑強': { pt: [2,3,4], type: 2 },
        '剛撃': { pt: [2,3,4], type: 2 },
        '盾持': { pt: [2,3,4], type: 0 },
        '増幅': { pt: [2,3,4], type: 0 },
        '潔癖': { pt: [2,3,4], type: 0 },
        '一心': { pt: [2,3,4], type: 0 },
        '強欲': { pt: [2,3], type: 0 },
        '護収': { pt: [2,3], type: 0 }
    };
    var armors = {};
    for (var tree in assets) {
        var a = assets[tree],
            type = args.type == null ? a.type : args.type;
        for (var i = 0, len = a.pt.length; i < len; ++i) {
            var dig = new Dig([ 0, type, tree, a.pt[i] ]);
            armors[dig.name] = dig;
        }
    }
    return armors;
};

Digs.prototype.enabled = function (part, context) {
    if (part == null) throw new Error('part is required');
    var digs = this.data[part];
    if (digs == null) throw new Error('unknown part: ' + part);

    var ret = [];
    for (var id in digs) {
        var dig = digs[id];
        if(dig.isEnabled(context)) ret.push(dig);
    }
    return ret;
};

Digs.prototype.get = function (part, name) {
    if (part == null) throw new Error('part is required');
    if (this.data[part] == null) throw new Error('unknown part: ' + part);
    var dig = this.data[part][name];
    return dig ? dig : null;
};

model.Dig = Dig;
model.digs = new Digs();
return model;
});
})(typeof define !== 'undefined' ?
   define :
   typeof module !== 'undefined' && module.exports ?
       function (deps, factory) {
           var modules = [], len = deps.length;
           for (var i = 0; i < len; ++i) modules.push(require(deps[i]));
           module.exports = factory.apply(this, modules);
       } :
       function (deps, factory) {
           factory(this.myapp.model);
       }
);
