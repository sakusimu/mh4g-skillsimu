'use strict';

/**
 * Combinator で使う関数を提供する。
 */

// 胴系統倍化を処理しやすくするため body が先頭にきた各部位の配列
var parts = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
exports.parts = parts;

/**
 * skillComb が goal のスキルを発動しているか調べる。
 */
exports.activates = function (skillComb, goal) {
    if (goal == null) throw new Error('goal is required');

    for (var tree in goal) {
        var goalPt = goal[tree],
            point  = skillComb[tree] || 0;
        if (point < goalPt) return false;
    }
    return true;
};

/**
 * skillComb が goal のスキルをちょうど発動しているか調べる。
 * (goal がマイナスのスキルの場合は、超えていればOK)
 */
exports.justActivates = function (skillComb, goal) {
    if (goal == null) throw new Error('goal is required');

    for (var tree in goal) {
        var goalPt = goal[tree],
            point  = skillComb[tree] || 0;
        if (goalPt < 0 && point > goalPt) continue;
        if (point !== goalPt) return false;
    }
    return true;
};

exports.isOver = function (skillCombA, skillCombB) {
    for (var tree in skillCombA) {
        var base  = skillCombA[tree],
            point = skillCombB[tree] || 0;
        if (point < base) return false;
    }
    return true;
};
