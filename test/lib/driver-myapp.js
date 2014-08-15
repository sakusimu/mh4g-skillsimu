(function (define) {
'use strict';
var deps = [ './driver-namespace.js',
             './driver-context.js', './driver-model.js', '../../lib/data.js' ];
define(deps, function (myapp, Context, model, data) {

var context = new Context();

myapp.initialize = function () {
    this.setup();
};

myapp.setup = function (ctx) {
    context.initialize(ctx);

    var simuData = function (obj) { return obj.simuData(); };

    var equips = {};
    [ 'head', 'body', 'arm', 'waist', 'leg' ].forEach(function (part) {
        var list = model.equips.enabled(part, context);
        equips[part] = list.map(simuData);
    });

    var decos = model.decos.enabled(context).map(simuData);

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

myapp.equip = function (part, name) {
    var id, eq,
        equips = model.equips,
        sex  = context.sex === 'm' ? 1 : 2,
        type = context.type === 'k' ? 1 : 2;

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

myapp.oma = function (list) {
    var oma = new model.Oma(list);
    return oma ? oma.simuData() : null;
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
           factory(this.myapp, this.myapp.Context, this.myapp.model, this.simu.data);
       }
);
