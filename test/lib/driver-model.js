(function (define) {
'use strict';
var deps = [ './driver-namespace', './driver-data.js' ];
define(deps, function (myapp, data) {

var model = {};

var make = model.make = function (data, props, numProps) {
    var ret = {};
    for (var i = 0, len = props.length; i < len; ++i) {
        var prop = props[i], value = data[i];
        if (prop === undefined) continue;
        if (numProps[prop]) {
            ret[prop] = (value == null || value === '') ? 0 : +value;
            if (isNaN(ret[prop])) throw new TypeError(prop + ' is NaN');
            continue;
        }
        ret[prop] = value === undefined ? null : value;
    }
    return ret;
};

var makeSkillComb = function (model, num) {
    var ret = {};
    for (var i = 1; i <= num; ++i) {
        var tree = model['skillTree' + i], pt = model['skillPt' + i];
        if (tree == null || tree === '') continue;
        ret[tree] = pt;
    }
    return ret;
};

/**
 * シミュレータのユーザ側クラス。
 * 装備データのクラス。
 */
var Equip = function () {
    this.initialize.apply(this, arguments);
};

/**
 * 引数の equip は以下を要素とする配列。
 * 名前,"性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",レア度,スロット数,入手時期／HR（99=集会場入手不可）,入手時期／村☆（99=村入手不可）,初期防御力,最終防御力,火耐性,水耐性,氷耐性,雷耐性,龍耐性,スキル系統1,スキル値1,スキル系統2,スキル値2,スキル系統3,スキル値3,スキル系統4,スキル値4,スキル系統5,スキル値5,生産素材1,個数,生産素材2,個数,生産素材3,個数,生産素材4,個数
 */
Equip.prototype.initialize = function (equip) {
    equip = equip || [];
    var props = [ 'name', 'sex', 'type', 'rarity', 'slot',
                  'availableHR', 'availableVS', '','','','','','','',
                  'skillTree1', 'skillPt1', 'skillTree2', 'skillPt2',
                  'skillTree3', 'skillPt3', 'skillTree4', 'skillPt4',
                  'skillTree5', 'skillPt5' ];
    var numProps = { sex: true, type: true, slot: true,
                     availableHR: true, availableVS: true,
                     skillPt1: true, skillPt2: true, skillPt3: true,
                     skillPt4: true, skillPt5: true };

    var model = make(equip, props, numProps);
    for (var prop in model) this[prop] = model[prop];

    this.id = [ this.name, this.sex, this.type ].join(',');
};

Equip.prototype.toString = function () {
    return this.name;
};

Equip.prototype.isEnabled = function (context) {
    var c = context;

    // 性別(0=両,1=男,2=女): m=[01], w=[02]
    if (c.sex === 'm' && +this.sex !== 0 && +this.sex !== 1) return false;
    if (c.sex === 'w' && +this.sex !== 0 && +this.sex !== 2) return false;

    // タイプ(0=両方,1=剣士,2=ガンナー): k=[01], g=[02]
    if (c.type === 'k' && +this.type !== 0 && +this.type !== 1) return false;
    if (c.type === 'g' && +this.type !== 0 && +this.type !== 2) return false;

    // 入手時期／HR（99=集会場入手不可）,入手時期／村☆（99=村入手不可）
    if (this.availableHR > +c.hr && this.availableVS > +c.vs) return false;

    return true;
};

Equip.prototype.simuData = function () {
    return {
        name     : this.name,
        slot     : this.slot,
        skillComb: makeSkillComb(this, 5)
    };
};

var Equips = function () {
    this.initialize.apply(this, arguments);
};

Equips.prototype.initialize = function () {
    var equips = {};
    for (var part in data.equips) {
        var list = data.equips[part];
        equips[part] = {};
        for (var i = 0, len = list.length; i < len; ++i) {
            var eq = new Equip(list[i]);
            equips[part][eq.id] = eq;
        }
    }
    this.data = equips;
};

/**
 * コンテキスト(性別やタイプなど)をふまえた、装備データを返す。
 * (例えば、女の剣士なら性別は 0 or 2 でタイプは 0 or 1 の装備の集まりとなる)
 */
Equips.prototype.enabled = function (part, context) {
    if (part == null) throw new Error('part is required');
    var equips = this.data[part];
    if (equips == null) throw new Error('unknown part: ' + part);

    var ret = [];
    for (var id in equips) {
        var eq = equips[id];
        if(eq.isEnabled(context)) ret.push(eq);
    }
    return ret;
};

Equips.prototype.get = function (part, id) {
    if (part == null) throw new Error('part is required');
    if (this.data[part] == null) throw new Error('unknown part: ' + part);
    var eq = this.data[part][id];
    return eq ? eq : null;
};

/**
 * シミュレータのユーザ側にあたるクラス。
 * 装飾品データのクラス。
 */
var Deco = function () {
    this.initialize.apply(this, arguments);
};

/**
 * 引数の deco は以下を要素とする配列。
 * 名前,レア度,スロット,入手時期／HR,入手時期／村☆,スキル系統1,スキル値1,スキル系統2,スキル値2,生産素材A1,個数,生産素材A2,個数,生産素材A3,個数,生産素材A4,個数,生産素材B1,個数,生産素材B2,個数,生産素材B3,個数,生産素材B4,個数
 */
Deco.prototype.initialize = function (deco) {
    deco = deco || [];
    var props = [ 'name', '', 'slot', 'availableHR', 'availableVS',
                  'skillTree1', 'skillPt1', 'skillTree2', 'skillPt2',
                  '','','','','','','','','','','','','','','','' ];
    var numProps = { slot: true, availableHR: true, availableVS: true,
                     skillPt1: true, skillPt2: true };

    var model = make(deco, props, numProps);
    for (var prop in model) this[prop] = model[prop];
};

Deco.prototype.toString = function () {
    return this.name;
};

Deco.prototype.isEnabled = function (context) {
    var c = context;

    // 入手時期／HR（99=集会場入手不可）,入手時期／村☆（99=村入手不可）
    if (this.availableHR > +c.hr && this.availableVS > +c.vs) return false;

    return true;
};

Deco.prototype.simuData = function () {
    return {
        name     : this.name,
        slot     : this.slot,
        skillComb: makeSkillComb(this, 2)
    };
};

var Decos = function () {
    this.initialize.apply(this, arguments);
};

Decos.prototype.initialize = function () {
    var decos = {},
        list  = data.decos;
    for (var i = 0, len = list.length; i < len; ++i) {
        var deco = new Deco(list[i]);
        decos[deco.name] = deco;
    }
    this.data = decos;
};

/**
 * コンテキスト(HRなど)をふまえた、装飾品データを返す。
 */
Decos.prototype.enabled = function (context) {
    var ret = [];
    for (var name in this.data) {
        var deco = this.data[name];
        if(deco.isEnabled(context)) ret.push(deco);
    }
    return ret;
};

Decos.prototype.get = function (name) {
    var deco = this.data[name];
    return deco ? deco : null;
};

/**
 * シミュレータのユーザ側にあたるクラス。
 * スキルデータのクラス。
 */
var Skill = function () {
    this.initialize.apply(this, arguments);
};

/**
 * 引数の skill は以下を要素とする配列。
 * スキル,スキル系統,ポイント,"タイプ(0=両方, 1=剣士, 2=ガンナー)"
 */
Skill.prototype.initialize = function (skill) {
    skill = skill || [];
    var props = [ 'name', 'tree', 'point', 'type' ];
    var numProps = { point: true, type: true };

    var model = make(skill, props, numProps);
    for (var prop in model) this[prop] = model[prop];
};

Skill.prototype.simuData = function () {
    return {
        name : this.name,
        tree : this.tree,
        point: this.point
    };
};

var Skills = function () {
    this.initialize.apply(this, arguments);
};

Skills.prototype.initialize = function () {
    var skills = {},
        list   = data.skills;
    for (var i = 0, len = list.length; i < len; ++i) {
        var skill = new Skill(list[i]);
        skills[skill.name] = skill;
    }
    this.data = skills;
};

Skills.prototype.enabled = function () {
    var ret = [];
    for (var name in this.data) {
        var skill = this.data[name];
        ret.push(skill);
    }
    return ret;
};

Skills.prototype.get = function (name) {
    var skill = this.data[name];
    return skill ? skill : null;
};

/**
 * シミュレータのユーザ側にあたるクラス。
 * お守りデータのクラス。
 */
var Oma = function () {
    this.initialize.apply(this, arguments);
};

/**
 * 引数の oma は以下を要素とする配列。
 * スキル,スキル系統,ポイント,"タイプ(0=両方, 1=剣士, 2=ガンナー)"
 */
Oma.prototype.initialize = function (oma) {
    oma = oma || [];
    var props = [ 'name', 'slot', 'skillTree1', 'skillPt1', 'skillTree2', 'skillPt2' ];
    var numProps = { slot: true, skillPt1: true, skillPt2: true };

    var model = make(oma, props, numProps);
    for (var prop in model) this[prop] = model[prop];
};

var skillAsStr = function (tree, pt) {
    if (tree == null || tree === '') return null;
    pt = +pt;
    var point = pt > 0 ? '+' + pt : '' + pt;
    return tree + point;
};

Oma.prototype.toString = function () {
    var skill1 = skillAsStr(this.skillTree1, this.skillPt1),
        skill2 = skillAsStr(this.skillTree2, this.skillPt2);

    var summary = [ 'スロ' + this.slot, skill1 ];
    if (skill2 != null) summary.push(skill2);

    return this.name + '(' + summary.join(',') + ')';
};

Oma.prototype.simuData = function () {
    return {
        name     : this.toString(),
        slot     : this.slot,
        skillComb: makeSkillComb(this, 2)
    };
};

model.Equip = Equip;
model.Deco  = Deco;
model.Skill = Skill;
model.Oma   = Oma;

model.equips = new Equips();
model.decos  = new Decos();
model.skills = new Skills();

return myapp.model = model;
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
           factory(this.myapp, this.myapp.data);
       }
);
