mh4g-skillsimu
=============
**Deprecated: Use [mh-skillsimu](https://github.com/sakusimu/mh-skillsimu/) instead.**

Skill Simulator for MH4G

Skill Simulator find combinations of equipments for activated skills.

How to build
------------
Before you can build mh4g-skillsimu, you must install and configure the following dependencies on your machine:
* Git
* Node.js
* Grunt

At first, clone `mh4g-skillsimu` from github repository.

    $ git clone --depth=10 https://github.com/sakusimu/mh4g-skillsimu

And change directory.

    $ cd mh4g-skillsimu

Install dependence mudules.

    $ npm install

Build your `mh4g-skillsimu.js` in `dist` directory.

    $ grunt dist

How to use
----------
For example, the following code:
```javascript
'use strict';
var myapp = require('./test/lib/driver-myapp.js'),
    simu = require('./index.js');

var simulator = new simu.Simulator();
var assemblies = simulator.simulateEquip([ '斬れ味レベル+1', '耳栓', '集中' ]);
console.log(assemblies);
```
run:
```
$ node example.js
[ { head: 'ミヅハ【烏帽子】',
    body: 'アカムトウルンテ',
    arm: 'EXレックスアーム',
    waist: 'クシャナアンダ',
    leg: 'アークグリーヴ',
    weapon: null,
    oma: null },
  { head: 'ミヅハ【烏帽子】',
    body: 'アカムトウルンテ',
    arm: 'EXレックスアーム',
    waist: 'クシャナアンダ',
    leg: 'ゾディアスグリーヴ',
    weapon: null,
    oma: null } ]
```

Running Tests
-------------
At first, download & build test data.

    $ grunt testdata

To run all unit tests, use:

    $ grunt test:node

To run a unit test, use:

    $ grunt test:node:test/unit/~.js

To run all unit tests on Browser, use:

    $ grunt test:browser

Running Benchmark
-----------------
To run a benchmark script, use:

    $ node benchmark/equip-simu.js

To run a benchmark script on Browser, use:

    $ grunt benchmark

And open `benchmark/html/~.html` on your browser.

Author
------
sakusimu.net

Acknowledgment
--------------
Author of GANSIMU  
When I create the simulator, I use the algorithm author of GANSIMU was published.  
[検索ロジック:MHP2G スキルシミュレータ 頑シミュ](http://www.geocities.jp/masax_mh/logic/)

License
-------
Copyright (C) sakusimu.net

Licensed under the MIT license.
