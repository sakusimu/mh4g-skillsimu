'use strict';

module.exports = function(grunt) {
    var path = require('path');

    var rootDir = path.resolve(__dirname, '../');

    var equips = [ [ 'MH4EQUIP_HEAD.csv', stringifyEquip ],
                   [ 'MH4EQUIP_BODY.csv', stringifyEquip ],
                   [ 'MH4EQUIP_ARM.csv',  stringifyEquip ],
                   [ 'MH4EQUIP_WST.csv',  stringifyEquip ],
                   [ 'MH4EQUIP_LEG.csv',  stringifyEquip ] ],
        decos  = [ 'MH4DECO.csv',  stringifyDeco ],
        skills = [ 'MH4SKILL.csv', stringifySkill ];

    grunt.registerMultiTask('build-data', 'Build test data.', function() {
        var options = this.options({
            srcDir : this.data.src,
            destDir: this.data.dest
        });

        buildTestData(options);
    });

    var buildTestData = function (opts) {
        equips.forEach(function (equip) {
            makeTestData(opts, equip);
        });
        makeTestData(opts, decos);
        makeTestData(opts, skills);
    };

    var makeTestData = function (opts, info) {
        var file      = info[0],
            stringify = info[1];

        var csvName  = opts.srcDir + '/' + file,
            jsonName = opts.destDir + '/' + file.toLowerCase().replace('.csv', '.json');

        var inPath  = rootDir + '/' + csvName,
            outPath = rootDir + '/' + jsonName;

        var isHash = stringify != null;

        var rows    = parseCSV(inPath),
            content = isHash ? '{\n' : '[\n';

        rows.forEach(function (row, index) {
            content += index === 0 ? '    ' : '  , ';
            if (isHash) {
                content += stringify(row) + '\n';
            } else {
                content += JSON.stringify(row) + '\n';
            }
        
        });
        content += isHash ? '}\n' : ']\n';

        grunt.file.write(outPath, content);
        console.log('File "' + jsonName + '" created.');
    };

    function stringifyEquip(row) {
        var pk = [ row[0], row[1], row[2] ].join(',');
        row.unshift(pk);
        return '"' + pk + '": ' + JSON.stringify(row);
    }
    function stringifyDeco(row) {
        var pk = row[0];
        row = row.slice(0, 25);
        return '"' + pk + '": ' + JSON.stringify(row);
    }
    function stringifySkill(row) {
        var pk = row[0];
        return '"' + pk + '": ' + JSON.stringify(row);
    }

    var parseCSV = function (csvPath) {
        var csv   = grunt.file.read(csvPath);
        var lines = csv.indexOf('\r\n') === -1 ? csv.split('\n') : csv.split('\r\n');

        var rows = [];
        lines.forEach(function (line) {
            line = chomp(line);
        
            if (line.match(/^#/)) return;
            if (line === "") return;

            // CSV のエスケープは考慮してない
            var columns = [];
            line.split(",").forEach(function (col) {
                if (col === '""') col = '';
                else if (col === '') col = null;
                else if (/^[0-9\-]+$/.test(col)) col = +col;
                columns.push(col);
            });

            rows.push(columns);
        });

        return rows;
    };

    var chomp = function (str) {
        return str.replace(/\r?\n$/, "");
    };
};
