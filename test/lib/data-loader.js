(function () {
    'use strict';

    if (typeof module === 'undefined' ||
        typeof module.exports === 'undefined') throw 'browser not supported';

    var fs    = require('fs'),
        path  = require('path'),
        _     = require('underscore'),
        data  = require('./driver-data.js');

    var files = [ 'mh4equip_head.json',
                  'mh4equip_body.json',
                  'mh4equip_arm.json',
                  'mh4equip_wst.json',
                  'mh4equip_leg.json',
                  'mh4deco.json',
                  'mh4skill.json' ];
    var rootDir = __dirname + '/../../data/';

    var testdata = {};
    files.forEach(function (file) {
        var filepath = rootDir + file,
            key      = path.basename(file, '.json');
        var json = fs.readFileSync(filepath, 'utf-8');
        testdata[key] = JSON.parse(json);
    });

    var len = _.keys(testdata).length;
    if (len !== 7) throw 'length of key in testdata isnt 7: length=' + len;

    data.equips.head  = testdata.mh4equip_head;
    data.equips.body  = testdata.mh4equip_body;
    data.equips.arm   = testdata.mh4equip_arm;
    data.equips.waist = testdata.mh4equip_wst;
    data.equips.leg   = testdata.mh4equip_leg;
    data.decos        = testdata.mh4deco;
    data.skills       = testdata.mh4skill;
}).call(this);
