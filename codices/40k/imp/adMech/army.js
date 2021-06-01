'use strict';

module.exports = `

* output
1 army

* childrenof army
4x
2x
1x

* childrenof 4x
{unit}

* childrenof 2x
{unit}

* childrenof 1x
{unit}

* alias unit
9 {infantry}
7 {vehicle}

* alias infantry

* alias vehicle

`;
