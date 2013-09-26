var util     = require("util"),
    QUnit    = require('qunitjs'),
    qunitTap = require('qunit-tap');

qunitTap(QUnit, util.puts);
QUnit.init();
QUnit.config.updateRate = 0;

module.exports = QUnit;
