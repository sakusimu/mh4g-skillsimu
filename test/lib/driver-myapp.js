(function (define) {
'use strict';
var deps = [ 'underscore', './driver-namespace.js', './driver-data.js',
             './driver-context.js', './driver-model.js', '../../lib/data.js' ];
define(deps, function (_, myapp, mydata, context, model, data) {

myapp.initialize = function () {
    this.setup();
};

myapp.setup = function (ctx) {
    this.context.initialize(ctx);

    var equips = {};
    _.each(data.parts, function (part) {
        var ee = model.Equip.enabledEquips(part);
        equips[part] = _.map(ee, function (e) { return e.simuData(); });
    });
    var decos = _.map(model.Deco.enabledDecos(), function (d) {
        return d.simuData();
    });
    var skills = {};
    _.each(model.Skill.enabledSkills(), function (s) {
        skills[s.name] = s.simuData();
    });

    data.set({
        equips: equips,
        decos : decos,
        skills: skills
    });
};

myapp.equips = function (part, name) {
    if (arguments.length !== 2) throw 'two arguments are required';
    var equips = data.equips[part];
    if (equips == null) throw 'unknown part:' + part;
    var names = _.isArray(name) ? name : [ name ];
    var ret = [];
    _.each(names, function (name) {
        var e = _.find(equips, function (equip) {
            return equip.name === name;
        });
        if (e !== undefined) ret.push(e);
    });
    return ret;
};

myapp.initialize();

return myapp;
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
           factory(this._, this.myapp, this.myapp.data,
                   this.myapp.context, this.myapp.model, this.simu.data);
       }
);
