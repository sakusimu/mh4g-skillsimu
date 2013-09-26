(function (define) {
'use strict';
var deps = [ 'underscore', './driver-namespace', './driver-data.js', './driver-context.js' ];
define(deps, function (_, myapp, data, context) {

var model = {};

var make = model.make = function (data, props, numProps) {
    var ret = {};
    for (var i = 0, len = props.length; i < len; ++i) {
        var prop = props[i], value = data[i];
        if (prop === undefined) continue;
        if (numProps[prop]) {
            ret[prop] = (value == null || value === '') ? 0 : +value;
            if (isNaN(ret[prop])) throw prop + ' is NaN';
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
 * ID,名前,"性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",レア度,スロット数,入手時期／HR（99=集会場入手不可）,入手時期／村☆（99=村入手不可）,初期防御力,最終防御力,火耐性,水耐性,氷耐性,雷耐性,龍耐性,スキル系統1,スキル値1,スキル系統2,スキル値2,スキル系統3,スキル値3,スキル系統4,スキル値4,スキル系統5,スキル値5,生産素材1,個数,生産素材2,個数,生産素材3,個数,生産素材4,個数
 */
Equip.prototype.initialize = function (equip) {
    equip = equip || [];
    var props = [ 'id', 'name', 'sex', 'type', 'rarity', 'slot',
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

    if (this.slot == null) console.log(this.name);
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

/**
 * コンテキスト(性別やタイプなど)をふまえた、装備データを返す。
 * (例えば、女の剣士なら性別は 0 or 2 でタイプは 0 or 1 の装備の集まりとなる)
 */
Equip.enabledEquips = function (part) {
    if (part == null) throw 'part is required';
    if (data.equips[part] == null) throw 'unknown part: ' + part;

    var equips = [];
    _.each(data.equips[part], function (list) {
        var e = new model.Equip(list);
        if(e.isEnabled(context)) equips.push(e);
    });

    return equips;
};

Equip.get = function (part, id) {
    if (part == null) throw 'part is required';
    if (data.equips[part] == null) throw 'unknown part: ' + part;
    var e = data.equips[part][id];
    if (e == null) return null;
    return new Equip(e);
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

/**
 * コンテキスト(HRなど)をふまえた、装飾品データを返す。
 */
Deco.enabledDecos = function () {
    var decos = [];
    _.each(data.decos, function (list) {
        var d = new model.Deco(list);
        if(d.isEnabled(context)) decos.push(d);
    });
    return decos;
};

Deco.get = function (name) {
    var d = data.decos[name];
    if (d == null) return null;
    return new Deco(d);
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

Skill.enabledSkills = function () {
    var skills = [];
    _.each(data.skills, function (list) {
        var s = new model.Skill(list);
        skills.push(s);
    });
    return skills;
};

Skill.get = function (skillName) {
    var s = data.skills[skillName];
    if (s == null) return null;
    return new Skill(s);
};

model.Equip = Equip;
model.Deco  = Deco;
model.Skill = Skill;

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
           factory(this._, this.myapp, this.myapp.data, this.myapp.context);
       }
);
