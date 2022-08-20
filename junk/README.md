# MAN [WWW](https://github.com/totemstan/man)  [COE](https://sc.appdev.proj.coe/acmesds/man)  [SBU](https://gitlab.west.nga.ic.gov/acmesds/man)

[MathJS](https://mathjs.org/)-based image and matrix manipulator.  

* [light weight image processing](https://www.npmjs.com/package/jimp)  
* [symbolic algebra](https://www.npmjs.com/package/mathjs)  
* time series analysis (
	[digital signal](https://www.npmjs.com/package/dsp), 
	[spectral](https://www.npmjs.com/package/fft-js))  
* hidden markov methods (
	[viterbi, baum-welch](https://www.npmjs.com/package/nodehmm), 
	[EM](https://www.npmjs.com/package/expectation-maximization))  
* matrix decompositions (
	[eigen spectrums](https://www.npmjs.com/package/node-svd))  
* [bayesian belief networks](https://www.npmjs.com/package/jsbayes)  
* [recurrent neural networks](https://www.npmjs.com/package/recurrent-js)  
* [convolutional neural networks](http://caffe.berkeleyvision.org/)  
* regression methods (
	[logistic](https://www.npmjs.com/package/ml-logistic-regression),
	[support vector](https://www.npmjs.com/package/node-svm), and 
	[other](https://www.npmjs.com/package/ml))  
* non-linear optimizers (
	[least cost path](https://www.npmjs.com/package/edmonds-blossom),
	[linear programming](https://www.npmjs.com/package/javascript-lp-solver),
	[gradient descent, newton-raphton](https://www.npmjs.com/package/newton-raphson-method))  
* special functions (
	[gamma](https://www.npmjs.com/package/gamma), 
	[multivariate normal](https://www.npmjs.com/package/multivariate-normal), 
	[rieman-zeta](https://www.npmjs.com/package/math-riemann-zeta)).

## Usage

Use MAN as follows:

	const $ = require("man");
	
	@example
	Eval a js or mathjs script in a context ctx:

		var 
			ctx = $( "script", ctx, ctx => {   // eval with callback
				Trace("updated context", ctx);
			} ),

			ctx = "script".$( ctx ),		// abbreviated

			{ x, y, ... } = "script".$( ctx ) || {};	// with context x,y extractions

	@example
	Create a matrix:

		var 
			A = $( N, (n,A) => A[n] = ... ) ,  // define N-length vector 
			A = $( [M,N], (n,m,A) => A[m][n] = ... ) ;	// define M x N matrrix

	@example
	Index a matrix:

		A.$( (n,A) => A[n] = ... ) 	// index vector with callback
		A.$$( (n,m,A) => A[n][m] = ... ) 	// index matrix with callback

	@example
	Sample a matrix with optional callback cb(val):

		var 
			B = A.get( idx , cb),
			B = A.get( "key, ...", cb ),
			B = A.get( [idx, ...] , cb),
			B = A.get( [key, ...] , cb ),
			B = A.get( {rekey: { toKey: "fromKey", ... }, cb ),
			B = A.get( {draw: N}, cb ),
			B = A.get( {start:N, count:N}, cb ),
			B = A.get( {KEY_starts: "with", ...}, cb ),
			B = A.get( {KEY_ends: "with", ...}, cb )

	@example
	Import functions to $.somefn and to $( "somefn(...)" )

		$( {
			somefn: function (args) { ... },
			:
			:
		} );

	@example
	Use the task sharder:

		$( { 
			keys: "i,j,k",  	// array indicies
			i: [0,1,2,3],  		// domain of index i
			j: [4,8],				// domain of index j
			k: [0],					// domain of index k
			qos: 0,				// regulation time in ms if not zero
			local: false, 		// enable to run task local, i.e. w/o workers and nodes
			workers: 4, 		// limit number of workers (aka cores) per node
			nodes: 3 			// limit number of nodes (ala locales) in the cluster
		}, 

			// here, a simple task that returns a message 
			$ => "my result is " + (i + j*k) + " from " + $.worker + " on "  + $.node,

			// here, a simple callback that displays the task results
			msg => console.log(msg) 
		);

	@example
	Aggregate and save events ev = {at: "KEY", ...} to ctx.Save_KEY with 
	callback cb(unsaved events)

		[ev, ...].save( ctx, evs => { ... } );
		"query".save( ctx, evs => { ... } );

	@example
	Usage methods of $().

		const $ = require("man")
		$( "mathjs script", ctx, ctx => { ... } )
		$( "mathjs script", ctx )
		$( "mathjs script" )
		$( [M,N], (m,n,A) => { A[m][n] = ... } )
		$( N, (n,A) => { A[n] = ... } )
		$({	// import functions
			f: (...) => { ... },
			...
		})
		$({	// task sharding
				keys: "i,j,...",  	// array indicies
				i: [...],  		// domain of index i
				j: [...],				// domain of index j
				k: [...],					// domain of index k
				qos: N,				// regulation time in ms if not zero
				local: false, 		// enable to run task local, i.e. w/o workers and nodes
				workers: N, 		// limit number of workers (aka cores) per node
				nodes: N 			// limit number of nodes (ala locales) in the cluster
			}, 

			// here, a simple task that returns a message 
			$ => "my result is " + (i + j*k) + " from " + $.worker + " on "  + $.node,

			// here, a simple callback that displays the task results
			msg => console.log(msg) 
		);

	@example
	Eval a mathjs script with optional callback and optional context:

		var 
			ctx = $( "mathjs script", ctx, ctx => {   
				x: 1, 
				y: 20, ...
			} );

	@example
	Eval with extraction of context keys:

		const {x, y, ... } = $( "mathjs script", ctx ) || {};

	@example
		// Import functions to $.somefn and to $( "somefn(...)" )
		$( {
			somefn: function (args) { ... },
			:
			:
		} );

	@example
	Use the task sharder:

		$( { 
				keys: "i,j,k",  	// array indicies
				i: [0,1,2,3],  		// domain of index i
				j: [4,8],				// domain of index j
				k: [0],					// domain of index k
				qos: 0,				// regulation time in ms if not zero
				local: false, 		// enable to run task local, i.e. w/o workers and nodes
				workers: 4, 		// limit number of workers (aka cores) per node
				nodes: 3 			// limit number of nodes (ala locales) in the cluster
			}, 

			// here, a simple task that returns a message 
			$ => "my result is " + (i + j*k) + " from " + $.worker + " on "  + $.node,

			// here, a simple callback that displays the task results
			msg => console.log(msg) 
		);	

## Installation

Clone **MAN** from one of its repos:

	git clone https://github.com/totemstan/man
	git clone https://sc.appdev.proj.coe/acmesds/man
	git clone https://gitlab.west.nga.ic.gov/acmesds/man

## Manage 

	npm test [ ? || L1 || ... ]			# unit test
	npm run [ edit || start ]			# Configure environment
	npm run redoc						# Regen documentation
	
## Program Reference
<details>
<summary>
<i>Open/Close</i>
</summary>
## Modules

<dl>
<dt><a href="#MAN.module_String">String</a></dt>
<dd></dd>
<dt><a href="#MAN.module_Array">Array</a></dt>
<dd></dd>
<dt><a href="#MAN.module_JIMP">JIMP</a></dt>
<dd></dd>
<dt><a href="#module_MAN">MAN</a></dt>
<dd><p><a href="https://mathjs.org/">MathJS</a>-based image and matrix manipulator.  This module documented in accordance with <a href="https://jsdoc.app/">jsdoc</a>.</p>
</dd>
</dl>

<a name="MAN.module_String"></a>

## String
<a name="MAN.module_String..$"></a>

### String~$()
**Kind**: inner method of [<code>String</code>](#MAN.module_String)  
<a name="MAN.module_Array"></a>

## Array

* [Array](#MAN.module_Array)
    * [~copy()](#MAN.module_Array..copy)
    * [~dist()](#MAN.module_Array..dist)
    * [~nearestOf()](#MAN.module_Array..nearestOf)
    * [~batch()](#MAN.module_Array..batch)
    * [~flush()](#MAN.module_Array..flush)
    * [~draw()](#MAN.module_Array..draw)
    * [~match()](#MAN.module_Array..match)
    * [~replace()](#MAN.module_Array..replace)
    * [~$(index, ctx)](#MAN.module_Array..$) ⇒ <code>Object</code>
    * [~$$()](#MAN.module_Array..$$)
    * [~unique()](#MAN.module_Array..unique)

<a name="MAN.module_Array..copy"></a>

### Array~copy()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..dist"></a>

### Array~dist()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..nearestOf"></a>

### Array~nearestOf()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..batch"></a>

### Array~batch()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..flush"></a>

### Array~flush()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..draw"></a>

### Array~draw()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..match"></a>

### Array~match()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..replace"></a>

### Array~replace()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..$"></a>

### Array~$(index, ctx) ⇒ <code>Object</code>
Index an array using a indexor:

	string of the form "to=from & to=eval & to & ... & !where=eval"
	hash of the form {to: from, ...}
	callback of the form (idx,array) => { ... }

The "!where" clause returns only records having a nonzero eval.

**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
**Returns**: <code>Object</code> - Aggregated data  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>String</code> \| <code>Object</code> \| <code>function</code> | Indexer |
| ctx | <code>Object</code> | Context of functions etc |

**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("u=x+1&v=sin(y)&!where=x>5",Math)
{ u: [ 11 ], v: [ 0.9129452507276277 ] }
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("x")
{ x: [ 1, 10 ] }
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("x&mydata=y")
{ mydata: [ 2, 20 ], x: [ 1, 10 ] }
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("mydata=[x,y]")
{ mydata: [ [ 1, 2 ], [ 10, 20 ] ] }
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("mydata=x+1")
{ mydata: [ 2, 11 ] }
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("",{"!all":1})
{ x: [ 1, 10 ], y: [ 2, 20 ] }
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("")
[ { x: 1, y: 2 }, { x: 10, y: 20 } ]
```
**Example**  
```js
[{x:1,y:2},{x:10,y:20}].$("u")
{ u: [ undefined, undefined ] }
```
**Example**  
```js
[[1,2,3],[10,20,30]].$("1&0")
{ '0': [ 1, 10 ], '1': [ 2, 20 ] }	
```
<a name="MAN.module_Array..$$"></a>

### Array~$$()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_Array..unique"></a>

### Array~unique()
**Kind**: inner method of [<code>Array</code>](#MAN.module_Array)  
<a name="MAN.module_JIMP"></a>

## JIMP

* [JIMP](#MAN.module_JIMP)
    * [~save()](#MAN.module_JIMP..save)
    * [~sym()](#MAN.module_JIMP..sym)

<a name="MAN.module_JIMP..save"></a>

### JIMP~save()
**Kind**: inner method of [<code>JIMP</code>](#MAN.module_JIMP)  
<a name="MAN.module_JIMP..sym"></a>

### JIMP~sym()
**Kind**: inner method of [<code>JIMP</code>](#MAN.module_JIMP)  
<a name="module_MAN"></a>

## MAN
[MathJS](https://mathjs.org/)-based image and matrix manipulator.  This module documented in accordance with [jsdoc](https://jsdoc.app/).

**Requires**: <code>module:[enums](https://github.com/totemstan/atomic)</code>, <code>module:[pythonIF](https://github.com/totemstan/atomic)</code>, <code>module:[opencvIF](https://github.com/totemstan/atomic)</code>, <code>module:[RIF](https://github.com/totemstan/atomic)</code>, <code>module:crypto</code>, <code>module:mathjs</code>, <code>module:fft-js</code>, <code>module:nodehmm</code>, <code>module:node-svd</code>, <code>module:node-svm</code>, <code>module:mljs</code>, <code>module:jimp</code>, <code>module:jsbayes</code>, <code>module:recurrentjs</code>, <code>module:gamma</code>, <code>module:expectation-maximization</code>, <code>module:multivariate-normal</code>, <code>module:newton-raphson</code>, <code>module:random-seed</code>, <code>module:edmonds-blossom</code>, <code>module:simple-simplex</code>, <code>module:tensorflow</code>, <code>module:tensorflow-use</code>  
**Author**: [ACMESDS](https://totemstan.github.io)  
**Example**  
```js
Eval a js or mathjs script in a context ctx:

	var 
		ctx = $( "script", ctx, ctx => {   // eval with callback
			Trace("updated context", ctx);
		} ),

		ctx = "script".$( ctx ),		// abbreviated

		{ x, y, ... } = "script".$( ctx ) || {};	// with context x,y extractions
```
**Example**  
```js
Create a matrix:

	var 
		A = $( N, (n,A) => A[n] = ... ) ,  // define N-length vector 
		A = $( [M,N], (n,m,A) => A[m][n] = ... ) ;	// define M x N matrrix
```
**Example**  
```js
Index a matrix:

	A.$( (n,A) => A[n] = ... ) 	// index vector with callback
	A.$$( (n,m,A) => A[n][m] = ... ) 	// index matrix with callback
```
**Example**  
```js
Sample a matrix with optional callback cb(val):

	var 
		B = A.get( idx , cb),
		B = A.get( "key, ...", cb ),
		B = A.get( [idx, ...] , cb),
		B = A.get( [key, ...] , cb ),
		B = A.get( {rekey: { toKey: "fromKey", ... }, cb ),
		B = A.get( {draw: N}, cb ),
		B = A.get( {start:N, count:N}, cb ),
		B = A.get( {KEY_starts: "with", ...}, cb ),
		B = A.get( {KEY_ends: "with", ...}, cb )
```
**Example**  
```js
Import functions to $.somefn and to $( "somefn(...)" )

	$( {
		somefn: function (args) { ... },
		:
		:
	} );
```
**Example**  
```js
Use the task sharder:

	$( { 
		keys: "i,j,k",  	// array indicies
		i: [0,1,2,3],  		// domain of index i
		j: [4,8],				// domain of index j
		k: [0],					// domain of index k
		qos: 0,				// regulation time in ms if not zero
		local: false, 		// enable to run task local, i.e. w/o workers and nodes
		workers: 4, 		// limit number of workers (aka cores) per node
		nodes: 3 			// limit number of nodes (ala locales) in the cluster
	}, 

		// here, a simple task that returns a message 
		$ => "my result is " + (i + j*k) + " from " + $.worker + " on "  + $.node,

		// here, a simple callback that displays the task results
		msg => console.log(msg) 
	);
```
**Example**  
```js
Aggregate and save events ev = {at: "KEY", ...} to ctx.Save_KEY with 
callback cb(unsaved events)

	[ev, ...].save( ctx, evs => { ... } );
	"query".save( ctx, evs => { ... } );
```
**Example**  
```js
Usage methods of $().

	const $ = require("man")
	$( "mathjs script", ctx, ctx => { ... } )
	$( "mathjs script", ctx )
	$( "mathjs script" )
	$( [M,N], (m,n,A) => { A[m][n] = ... } )
	$( N, (n,A) => { A[n] = ... } )
	$({	// import functions
		f: (...) => { ... },
		...
	})
	$({	// task sharding
			keys: "i,j,...",  	// array indicies
			i: [...],  		// domain of index i
			j: [...],				// domain of index j
			k: [...],					// domain of index k
			qos: N,				// regulation time in ms if not zero
			local: false, 		// enable to run task local, i.e. w/o workers and nodes
			workers: N, 		// limit number of workers (aka cores) per node
			nodes: N 			// limit number of nodes (ala locales) in the cluster
		}, 

		// here, a simple task that returns a message 
		$ => "my result is " + (i + j*k) + " from " + $.worker + " on "  + $.node,

		// here, a simple callback that displays the task results
		msg => console.log(msg) 
	);
```
**Example**  
```js
Eval a mathjs script with optional callback and optional context:

	var 
		ctx = $( "mathjs script", ctx, ctx => {   
			x: 1, 
			y: 20, ...
		} );
```
**Example**  
```js
Eval with extraction of context keys:

	const {x, y, ... } = $( "mathjs script", ctx ) || {};
```
**Example**  
```js
// Import functions to $.somefn and to $( "somefn(...)" )
	$( {
		somefn: function (args) { ... },
		:
		:
	} );
```
**Example**  
```js
Use the task sharder:

	$( { 
			keys: "i,j,k",  	// array indicies
			i: [0,1,2,3],  		// domain of index i
			j: [4,8],				// domain of index j
			k: [0],					// domain of index k
			qos: 0,				// regulation time in ms if not zero
			local: false, 		// enable to run task local, i.e. w/o workers and nodes
			workers: 4, 		// limit number of workers (aka cores) per node
			nodes: 3 			// limit number of nodes (ala locales) in the cluster
		}, 

		// here, a simple task that returns a message 
		$ => "my result is " + (i + j*k) + " from " + $.worker + " on "  + $.node,

		// here, a simple callback that displays the task results
		msg => console.log(msg) 
	);	
```

* [MAN](#module_MAN)
    * [~imports](#module_MAN..imports)
        * [.scripts](#module_MAN..imports.scripts)
            * [.conf](#module_MAN..imports.scripts.conf)
            * [.pca](#module_MAN..imports.scripts.pca)
            * [.roc](#module_MAN..imports.scripts.roc)
            * [.snr](#module_MAN..imports.scripts.snr)
            * [.p0](#module_MAN..imports.scripts.p0)
            * [.pw](#module_MAN..imports.scripts.pw)
            * [.wk](#module_MAN..imports.scripts.wk)
            * [.trigger()](#module_MAN..imports.scripts.trigger)
        * [.oga()](#module_MAN..imports.oga)
        * [.getEv()](#module_MAN..imports.getEv)
        * [.putEv()](#module_MAN..imports.putEv)
        * [.stateSize()](#module_MAN..imports.stateSize)
        * [.BIC()](#module_MAN..imports.BIC)
        * [.draw()](#module_MAN..imports.draw)
        * [.cum()](#module_MAN..imports.cum)
        * [.crf()](#module_MAN..imports.crf)
        * [.propEv()](#module_MAN..imports.propEv)
        * [.CMI()](#module_MAN..imports.CMI)
        * [.mcmc()](#module_MAN..imports.mcmc)
        * [.indicate()](#module_MAN..imports.indicate)
        * [.boost(cycle, sql, solve, trace, hypo)](#module_MAN..imports.boost)
        * [.proj()](#module_MAN..imports.proj)
        * [.orthoNorm()](#module_MAN..imports.orthoNorm)
        * [.MaxFlowMinCut()](#module_MAN..imports.MaxFlowMinCut)
        * [.ranreg()](#module_MAN..imports.ranreg)
        * [.degrees()](#module_MAN..imports.degrees)
        * [.degree()](#module_MAN..imports.degree)
        * [.nodes()](#module_MAN..imports.nodes)
        * [.spectrum()](#module_MAN..imports.spectrum)
        * [.any()](#module_MAN..imports.any)
        * [.all()](#module_MAN..imports.all)
        * [.isoperi()](#module_MAN..imports.isoperi)
        * [.edges()](#module_MAN..imports.edges)
        * [.clone()](#module_MAN..imports.clone)
        * [.graph()](#module_MAN..imports.graph)
        * [.union()](#module_MAN..imports.union)
        * [.empty()](#module_MAN..imports.empty)
        * [.ranregs()](#module_MAN..imports.ranregs)
        * [.rand()](#module_MAN..imports.rand)
        * [.randRot()](#module_MAN..imports.randRot)
        * [.toMatrix()](#module_MAN..imports.toMatrix)
        * [.toList()](#module_MAN..imports.toList)
        * [.isDefined()](#module_MAN..imports.isDefined)
        * [.len()](#module_MAN..imports.len)
        * [.ols(use, x, y, solve, cb)](#module_MAN..imports.ols)
        * [.train()](#module_MAN..imports.train)
        * [.predict(cls, use, x, y, solve, cb)](#module_MAN..imports.predict)
        * [.qda_train()](#module_MAN..imports.qda_train)
        * [.qda_predict()](#module_MAN..imports.qda_predict)
        * [.beta_train()](#module_MAN..imports.beta_train)
        * [.beta_predict()](#module_MAN..imports.beta_predict)
        * [.rnn_train()](#module_MAN..imports.rnn_train)
        * [.rnn_predict()](#module_MAN..imports.rnn_predict)
        * [.ann_train()](#module_MAN..imports.ann_train)
        * [.ann_predict()](#module_MAN..imports.ann_predict)
        * [.dnn_train()](#module_MAN..imports.dnn_train)
        * [.dnn_predict()](#module_MAN..imports.dnn_predict)
        * [.dhs_train()](#module_MAN..imports.dhs_train)
        * [.dhs_predict()](#module_MAN..imports.dhs_predict)
        * [.lda_train()](#module_MAN..imports.lda_train)
        * [.lda_predict()](#module_MAN..imports.lda_predict)
        * [.ror_train()](#module_MAN..imports.ror_train)
        * [.ror_predict()](#module_MAN..imports.ror_predict)
        * [.dtr_train()](#module_MAN..imports.dtr_train)
        * [.dtr_predict()](#module_MAN..imports.dtr_predict)
        * [.raf_train()](#module_MAN..imports.raf_train)
        * [.raf_predict()](#module_MAN..imports.raf_predict)
        * [.nab_train()](#module_MAN..imports.nab_train)
        * [.nab_predict()](#module_MAN..imports.nab_predict)
        * [.som_train()](#module_MAN..imports.som_train)
        * [.som_predict()](#module_MAN..imports.som_predict)
        * [.ols_train()](#module_MAN..imports.ols_train)
        * [.ols_predict()](#module_MAN..imports.ols_predict)
        * [.svm_train()](#module_MAN..imports.svm_train)
        * [.svm_predict()](#module_MAN..imports.svm_predict)
        * [.lrm_train()](#module_MAN..imports.lrm_train)
        * [.lrm_predict()](#module_MAN..imports.lrm_predict)
        * [.knn_train()](#module_MAN..imports.knn_train)
        * [.knn_predict()](#module_MAN..imports.knn_predict)
        * [.pls_train()](#module_MAN..imports.pls_train)
        * [.pls_predict()](#module_MAN..imports.pls_predict)
        * [.triggerProfile()](#module_MAN..imports.triggerProfile)
        * [.coherenceIntervals()](#module_MAN..imports.coherenceIntervals)
        * [.arrivalRates()](#module_MAN..imports.arrivalRates)
        * [.estGauss()](#module_MAN..imports.estGauss)
        * [.svd()](#module_MAN..imports.svd)
        * [.evd()](#module_MAN..imports.evd)
        * [.rng()](#module_MAN..imports.rng)
        * [.xcorr()](#module_MAN..imports.xcorr)
        * [.dht()](#module_MAN..imports.dht)
        * [.dft()](#module_MAN..imports.dft)
        * [.pwrem()](#module_MAN..imports.pwrem)
        * [.pwrec()](#module_MAN..imports.pwrec)
        * [.wkpsd()](#module_MAN..imports.wkpsd)
        * [.psd()](#module_MAN..imports.psd)
        * [.evpsd()](#module_MAN..imports.evpsd)
        * [.udev()](#module_MAN..imports.udev)
        * [.expdev()](#module_MAN..imports.expdev)
        * [.cumsum()](#module_MAN..imports.cumsum)
        * [.conf()](#module_MAN..imports.conf)
        * [.tolAtConf()](#module_MAN..imports.tolAtConf)
        * [.tolsAtConf()](#module_MAN..imports.tolsAtConf)
        * [.loggamma()](#module_MAN..imports.loggamma)
        * [.beta()](#module_MAN..imports.beta)
        * [.cumbeta()](#module_MAN..imports.cumbeta)
        * [.sinc()](#module_MAN..imports.sinc)
        * [.rect()](#module_MAN..imports.rect)
        * [.tri()](#module_MAN..imports.tri)
        * [.negexp()](#module_MAN..imports.negexp)
        * [.lorenzian()](#module_MAN..imports.lorenzian)
        * [.zeta()](#module_MAN..imports.zeta)
        * [.infer()](#module_MAN..imports.infer)
        * [.mle()](#module_MAN..imports.mle)
        * [.mvn()](#module_MAN..imports.mvn)
        * [.lfa()](#module_MAN..imports.lfa)
        * [.lma()](#module_MAN..imports.lma)
        * [.rnn()](#module_MAN..imports.rnn)
        * [.json()](#module_MAN..imports.json)
        * [.disp()](#module_MAN..imports.disp)
    * [~py(code, ctx)](#module_MAN..py)
    * [~cv(code, ctx)](#module_MAN..cv)
    * [~R(code, ctx)](#module_MAN..R)

<a name="module_MAN..imports"></a>

### MAN~imports
Stash for imported functions.

**Kind**: inner property of [<code>MAN</code>](#module_MAN)  

* [~imports](#module_MAN..imports)
    * [.scripts](#module_MAN..imports.scripts)
        * [.conf](#module_MAN..imports.scripts.conf)
        * [.pca](#module_MAN..imports.scripts.pca)
        * [.roc](#module_MAN..imports.scripts.roc)
        * [.snr](#module_MAN..imports.scripts.snr)
        * [.p0](#module_MAN..imports.scripts.p0)
        * [.pw](#module_MAN..imports.scripts.pw)
        * [.wk](#module_MAN..imports.scripts.wk)
        * [.trigger()](#module_MAN..imports.scripts.trigger)
    * [.oga()](#module_MAN..imports.oga)
    * [.getEv()](#module_MAN..imports.getEv)
    * [.putEv()](#module_MAN..imports.putEv)
    * [.stateSize()](#module_MAN..imports.stateSize)
    * [.BIC()](#module_MAN..imports.BIC)
    * [.draw()](#module_MAN..imports.draw)
    * [.cum()](#module_MAN..imports.cum)
    * [.crf()](#module_MAN..imports.crf)
    * [.propEv()](#module_MAN..imports.propEv)
    * [.CMI()](#module_MAN..imports.CMI)
    * [.mcmc()](#module_MAN..imports.mcmc)
    * [.indicate()](#module_MAN..imports.indicate)
    * [.boost(cycle, sql, solve, trace, hypo)](#module_MAN..imports.boost)
    * [.proj()](#module_MAN..imports.proj)
    * [.orthoNorm()](#module_MAN..imports.orthoNorm)
    * [.MaxFlowMinCut()](#module_MAN..imports.MaxFlowMinCut)
    * [.ranreg()](#module_MAN..imports.ranreg)
    * [.degrees()](#module_MAN..imports.degrees)
    * [.degree()](#module_MAN..imports.degree)
    * [.nodes()](#module_MAN..imports.nodes)
    * [.spectrum()](#module_MAN..imports.spectrum)
    * [.any()](#module_MAN..imports.any)
    * [.all()](#module_MAN..imports.all)
    * [.isoperi()](#module_MAN..imports.isoperi)
    * [.edges()](#module_MAN..imports.edges)
    * [.clone()](#module_MAN..imports.clone)
    * [.graph()](#module_MAN..imports.graph)
    * [.union()](#module_MAN..imports.union)
    * [.empty()](#module_MAN..imports.empty)
    * [.ranregs()](#module_MAN..imports.ranregs)
    * [.rand()](#module_MAN..imports.rand)
    * [.randRot()](#module_MAN..imports.randRot)
    * [.toMatrix()](#module_MAN..imports.toMatrix)
    * [.toList()](#module_MAN..imports.toList)
    * [.isDefined()](#module_MAN..imports.isDefined)
    * [.len()](#module_MAN..imports.len)
    * [.ols(use, x, y, solve, cb)](#module_MAN..imports.ols)
    * [.train()](#module_MAN..imports.train)
    * [.predict(cls, use, x, y, solve, cb)](#module_MAN..imports.predict)
    * [.qda_train()](#module_MAN..imports.qda_train)
    * [.qda_predict()](#module_MAN..imports.qda_predict)
    * [.beta_train()](#module_MAN..imports.beta_train)
    * [.beta_predict()](#module_MAN..imports.beta_predict)
    * [.rnn_train()](#module_MAN..imports.rnn_train)
    * [.rnn_predict()](#module_MAN..imports.rnn_predict)
    * [.ann_train()](#module_MAN..imports.ann_train)
    * [.ann_predict()](#module_MAN..imports.ann_predict)
    * [.dnn_train()](#module_MAN..imports.dnn_train)
    * [.dnn_predict()](#module_MAN..imports.dnn_predict)
    * [.dhs_train()](#module_MAN..imports.dhs_train)
    * [.dhs_predict()](#module_MAN..imports.dhs_predict)
    * [.lda_train()](#module_MAN..imports.lda_train)
    * [.lda_predict()](#module_MAN..imports.lda_predict)
    * [.ror_train()](#module_MAN..imports.ror_train)
    * [.ror_predict()](#module_MAN..imports.ror_predict)
    * [.dtr_train()](#module_MAN..imports.dtr_train)
    * [.dtr_predict()](#module_MAN..imports.dtr_predict)
    * [.raf_train()](#module_MAN..imports.raf_train)
    * [.raf_predict()](#module_MAN..imports.raf_predict)
    * [.nab_train()](#module_MAN..imports.nab_train)
    * [.nab_predict()](#module_MAN..imports.nab_predict)
    * [.som_train()](#module_MAN..imports.som_train)
    * [.som_predict()](#module_MAN..imports.som_predict)
    * [.ols_train()](#module_MAN..imports.ols_train)
    * [.ols_predict()](#module_MAN..imports.ols_predict)
    * [.svm_train()](#module_MAN..imports.svm_train)
    * [.svm_predict()](#module_MAN..imports.svm_predict)
    * [.lrm_train()](#module_MAN..imports.lrm_train)
    * [.lrm_predict()](#module_MAN..imports.lrm_predict)
    * [.knn_train()](#module_MAN..imports.knn_train)
    * [.knn_predict()](#module_MAN..imports.knn_predict)
    * [.pls_train()](#module_MAN..imports.pls_train)
    * [.pls_predict()](#module_MAN..imports.pls_predict)
    * [.triggerProfile()](#module_MAN..imports.triggerProfile)
    * [.coherenceIntervals()](#module_MAN..imports.coherenceIntervals)
    * [.arrivalRates()](#module_MAN..imports.arrivalRates)
    * [.estGauss()](#module_MAN..imports.estGauss)
    * [.svd()](#module_MAN..imports.svd)
    * [.evd()](#module_MAN..imports.evd)
    * [.rng()](#module_MAN..imports.rng)
    * [.xcorr()](#module_MAN..imports.xcorr)
    * [.dht()](#module_MAN..imports.dht)
    * [.dft()](#module_MAN..imports.dft)
    * [.pwrem()](#module_MAN..imports.pwrem)
    * [.pwrec()](#module_MAN..imports.pwrec)
    * [.wkpsd()](#module_MAN..imports.wkpsd)
    * [.psd()](#module_MAN..imports.psd)
    * [.evpsd()](#module_MAN..imports.evpsd)
    * [.udev()](#module_MAN..imports.udev)
    * [.expdev()](#module_MAN..imports.expdev)
    * [.cumsum()](#module_MAN..imports.cumsum)
    * [.conf()](#module_MAN..imports.conf)
    * [.tolAtConf()](#module_MAN..imports.tolAtConf)
    * [.tolsAtConf()](#module_MAN..imports.tolsAtConf)
    * [.loggamma()](#module_MAN..imports.loggamma)
    * [.beta()](#module_MAN..imports.beta)
    * [.cumbeta()](#module_MAN..imports.cumbeta)
    * [.sinc()](#module_MAN..imports.sinc)
    * [.rect()](#module_MAN..imports.rect)
    * [.tri()](#module_MAN..imports.tri)
    * [.negexp()](#module_MAN..imports.negexp)
    * [.lorenzian()](#module_MAN..imports.lorenzian)
    * [.zeta()](#module_MAN..imports.zeta)
    * [.infer()](#module_MAN..imports.infer)
    * [.mle()](#module_MAN..imports.mle)
    * [.mvn()](#module_MAN..imports.mvn)
    * [.lfa()](#module_MAN..imports.lfa)
    * [.lma()](#module_MAN..imports.lma)
    * [.rnn()](#module_MAN..imports.rnn)
    * [.json()](#module_MAN..imports.json)
    * [.disp()](#module_MAN..imports.disp)

<a name="module_MAN..imports.scripts"></a>

#### imports.scripts
**Kind**: static property of [<code>imports</code>](#module_MAN..imports)  

* [.scripts](#module_MAN..imports.scripts)
    * [.conf](#module_MAN..imports.scripts.conf)
    * [.pca](#module_MAN..imports.scripts.pca)
    * [.roc](#module_MAN..imports.scripts.roc)
    * [.snr](#module_MAN..imports.scripts.snr)
    * [.p0](#module_MAN..imports.scripts.p0)
    * [.pw](#module_MAN..imports.scripts.pw)
    * [.wk](#module_MAN..imports.scripts.wk)
    * [.trigger()](#module_MAN..imports.scripts.trigger)

<a name="module_MAN..imports.scripts.conf"></a>

##### scripts.conf
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.pca"></a>

##### scripts.pca
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.roc"></a>

##### scripts.roc
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.snr"></a>

##### scripts.snr
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.p0"></a>

##### scripts.p0
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.pw"></a>

##### scripts.pw
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.wk"></a>

##### scripts.wk
**Kind**: static property of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.scripts.trigger"></a>

##### scripts.trigger()
**Kind**: static method of [<code>scripts</code>](#module_MAN..imports.scripts)  
<a name="module_MAN..imports.oga"></a>

#### imports.oga()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.getEv"></a>

#### imports.getEv()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.putEv"></a>

#### imports.putEv()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.stateSize"></a>

#### imports.stateSize()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.BIC"></a>

#### imports.BIC()
Return BIC score for specified Bayesian network.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.draw"></a>

#### imports.draw()
Draw deviate from a specified distribution.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.cum"></a>

#### imports.cum()
Cummulative sum.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.crf"></a>

#### imports.crf()
Draw Bayesian network deviates with specifed Conditional Random Field

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.propEv"></a>

#### imports.propEv()
Propagate evidents in a Bayesian network.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.CMI"></a>

#### imports.CMI()
Conditional mutual information.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.mcmc"></a>

#### imports.mcmc()
Markov Chain Monte Carlo process.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.indicate"></a>

#### imports.indicate()
Returns indicator of a test vector.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.boost"></a>

#### imports.boost(cycle, sql, solve, trace, hypo)
Boost frome cycle t>=1; t=1 will initialize the boosting
process.  Provide an sql connector to
ingest data; a solve hash containing boosting parameters (
alpha, eps, etc used by adaBoost); and a trace flag to 
enable tracing;

The hypothesis callback hypo(x,keys) will
	return tested hypo if keys specified
	return learned hypo keys if x specified
	save hypo keys to boost stash if neither specified

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  

| Param | Type | Description |
| --- | --- | --- |
| cycle | <code>Number</code> | number being boosted >=1 |
| sql | <code>Object</code> | connector |
| solve | <code>Object</code> | boosting options and stashes: alpha, eps, h, samples, mixes, thresh |
| trace | <code>function</code> | callback(msg) to handel messages |
| hypo | <code>Funtion</code> | callback(x,keys) |

<a name="module_MAN..imports.proj"></a>

#### imports.proj()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.orthoNorm"></a>

#### imports.orthoNorm()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.MaxFlowMinCut"></a>

#### imports.MaxFlowMinCut()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ranreg"></a>

#### imports.ranreg()
Return an adjaceny matrix for a random n-node, d-regular graph.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.degrees"></a>

#### imports.degrees()
Return node degress for graph with adjaceny matrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.degree"></a>

#### imports.degree()
Return graph degree given its adjacency matgrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.nodes"></a>

#### imports.nodes()
Return node of a graph with adjacency matrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.spectrum"></a>

#### imports.spectrum()
Return eigen spectrum of a graph with adjacency magtrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.any"></a>

#### imports.any()
Return true is any items true.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.all"></a>

#### imports.all()
Returns true is all items true.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.isoperi"></a>

#### imports.isoperi()
Return Cheeger's isoperimetric constant for a graph with 
adjacency matrix A and vertex set V.  Uses random set partitions
when a nonzero block size is specified; otherwise, exhaustively 
enumerates all partitions.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.edges"></a>

#### imports.edges()
Return edges E of a graph whose adjacency matrix is A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.clone"></a>

#### imports.clone()
Clone a graph given its adjacency matrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.graph"></a>

#### imports.graph()
Return graph G (nodes V, edges E, adjacency matrix A) given its adjacency matrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.union"></a>

#### imports.union()
Return graph composition of two graphs with adjacency matricies A and B.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.empty"></a>

#### imports.empty()
Return an unconnected empty graph having N nodes.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ranregs"></a>

#### imports.ranregs()
Callback cb with random n-node, d[i]-regular graphs given the 
desired number of random permutations m[i].

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.rand"></a>

#### imports.rand()
MxN random matrix

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.randRot"></a>

#### imports.randRot()
KxK random rotation matrix

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.toMatrix"></a>

#### imports.toMatrix()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.toList"></a>

#### imports.toList()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.isDefined"></a>

#### imports.isDefined()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.len"></a>

#### imports.len()
Return number of items.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ols"></a>

#### imports.ols(use, x, y, solve, cb)
Train a cls classifier using the specified regression use-method given 
the feature vectors x and optional (when supervised) labels y, and 
regression solve options.  

The y labels (<0 indicates unlabelled) are used by supervised regressors
(like OLS, logit, etc) to estimate their fitting parameters, as well as by
unsupervised regressors (like qda, som, etc) to remap their unordered solutions
into a consistant order (by computing a confusion matrix against the supplied and 
the predicted labels).

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  

| Param | Type | Description |
| --- | --- | --- |
| use | <code>String</code> | regression method |
| x | <code>Array</code> | sampled feature vectors |
| y | <code>Array</code> | labels of samples vectors (or null) |
| solve | <code>Object</code> | regression options |
| cb | <code>function</code> | callback(cls) |

<a name="module_MAN..imports.train"></a>

#### imports.train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.predict"></a>

#### imports.predict(cls, use, x, y, solve, cb)
Return predicted labels y given a list x of feature vectors.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  

| Param | Type | Description |
| --- | --- | --- |
| cls | <code>Object</code> | classifier hash |
| use | <code>String</code> | regression method |
| x | <code>Array</code> | sampled feature vectors |
| y | <code>Array</code> | labels of samples vectors (or null) |
| solve | <code>Object</code> | regression options |
| cb | <code>function</code> | callback(ctx) |

<a name="module_MAN..imports.qda_train"></a>

#### imports.qda\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.qda_predict"></a>

#### imports.qda\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.beta_train"></a>

#### imports.beta\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.beta_predict"></a>

#### imports.beta\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.rnn_train"></a>

#### imports.rnn\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.rnn_predict"></a>

#### imports.rnn\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ann_train"></a>

#### imports.ann\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ann_predict"></a>

#### imports.ann\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dnn_train"></a>

#### imports.dnn\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dnn_predict"></a>

#### imports.dnn\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dhs_train"></a>

#### imports.dhs\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dhs_predict"></a>

#### imports.dhs\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lda_train"></a>

#### imports.lda\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lda_predict"></a>

#### imports.lda\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ror_train"></a>

#### imports.ror\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ror_predict"></a>

#### imports.ror\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dtr_train"></a>

#### imports.dtr\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dtr_predict"></a>

#### imports.dtr\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.raf_train"></a>

#### imports.raf\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.raf_predict"></a>

#### imports.raf\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.nab_train"></a>

#### imports.nab\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.nab_predict"></a>

#### imports.nab\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.som_train"></a>

#### imports.som\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.som_predict"></a>

#### imports.som\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ols_train"></a>

#### imports.ols\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.ols_predict"></a>

#### imports.ols\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.svm_train"></a>

#### imports.svm\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.svm_predict"></a>

#### imports.svm\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lrm_train"></a>

#### imports.lrm\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lrm_predict"></a>

#### imports.lrm\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.knn_train"></a>

#### imports.knn\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.knn_predict"></a>

#### imports.knn\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.pls_train"></a>

#### imports.pls\_train()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.pls_predict"></a>

#### imports.pls\_predict()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.triggerProfile"></a>

#### imports.triggerProfile()
Use the Paley-Wiener Theorem to return the trigger function stats:

	x = normalized time interval of recovered trigger
	h = recovered trigger function at normalized times x
	modH = Fourier modulous of recovered trigger at frequencies f
	argH = Fourier argument of recovered trigger at frequencies f
	f = spectral frequencies

via the callback cb(stats) given a solve request:

	evs = events list
	refLambda = ref mean arrival rate (for debugging)
	alpha = assumed detector gain
	N = profile sample times = max coherence intervals
	model = correlation model name
	Tc = coherence time of arrival process
	T = observation time

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.coherenceIntervals"></a>

#### imports.coherenceIntervals()
Callback with coherence intervals M, SNR, etc given solve:
	f[k] = observed probability mass at count levels k = 0 ... Kmax-1
	T = observation time
	N = number of events collected
	use = "lma" | "lfa" | "bfs"
	lma = [initial M]
	lfa = [initial M]
	bfs = [start, end, increment M]

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.arrivalRates"></a>

#### imports.arrivalRates()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.estGauss"></a>

#### imports.estGauss()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.svd"></a>

#### imports.svd()
Returns singular value decomposition of a real matrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.evd"></a>

#### imports.evd()
Returns eigen value decomposition of a real matrix A.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.rng"></a>

#### imports.rng()
Returns range from min to max in N steps.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.xcorr"></a>

#### imports.xcorr()
Returns N x N complex correlation matrix Xccf [unitless] sampled from the given 2N+1, odd
length, complex correlation function xccf [unitless].  Because Xccf is band symmetric, its 
k'th diag at lag k contains xccf(lag k) = xccf[ N+1 + k ] , k = -N:N

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dht"></a>

#### imports.dht()
Returns discrete Hilbert transform of an odd length array f

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.dft"></a>

#### imports.dft()
Returns unnormalized dft/idft of an odd length, real or complex array F.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.pwrem"></a>

#### imports.pwrem()
Returns paley-weiner remainder given zeros z in complex UHP at frequencies 
nu = [ -f0, ... +f0 ] [Hz]

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.pwrec"></a>

#### imports.pwrec()
Returns paley-weiner reconstructed trigger H(nu) = |H(nu)| exp( j*argH(nu) ) given its modulous 
and its zeros z=[z1,...] in complex UHP.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.wkpsd"></a>

#### imports.wkpsd()
Returns weiner-kinchine psd [Hz] at frequencies nu [Hz] = [-f0 ... +f0] of a complex corr func 
ccf [Hz^2] of len N = 2^K + 1 defined overan interval T [1/Hz], where the cutoff f0 is 1/2 the
implied	sampling rate N/T.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.psd"></a>

#### imports.psd()
Returns power spectral density [Hz] of events at times [t1,t2,...] over interval T [1/Hz] at the
specified frequencies nu [Hz].

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.evpsd"></a>

#### imports.evpsd()
Return psd [Hz] at the specified frequencies nu [Hz], and the mean event rate [Hz] given 
events evs = [{tKey: t1,idKey: id}, {tKey: t2, idKey: id}, ... ] over an observation 
interval  T [1/Hz] with event idKey and tKey as provided.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.udev"></a>

#### imports.udev()
Returns uniform random deviate on [0...a]

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.expdev"></a>

#### imports.expdev()
Returns exp random deviate with prescribed mean a

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.cumsum"></a>

#### imports.cumsum()
Returns cummulative sum of x.

**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.conf"></a>

#### imports.conf()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.tolAtConf"></a>

#### imports.tolAtConf()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.tolsAtConf"></a>

#### imports.tolsAtConf()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.loggamma"></a>

#### imports.loggamma()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.beta"></a>

#### imports.beta()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.cumbeta"></a>

#### imports.cumbeta()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.sinc"></a>

#### imports.sinc()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.rect"></a>

#### imports.rect()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.tri"></a>

#### imports.tri()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.negexp"></a>

#### imports.negexp()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lorenzian"></a>

#### imports.lorenzian()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.zeta"></a>

#### imports.zeta()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.infer"></a>

#### imports.infer()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.mle"></a>

#### imports.mle()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.mvn"></a>

#### imports.mvn()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lfa"></a>

#### imports.lfa()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.lma"></a>

#### imports.lma()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.rnn"></a>

#### imports.rnn()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.json"></a>

#### imports.json()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..imports.disp"></a>

#### imports.disp()
**Kind**: static method of [<code>imports</code>](#module_MAN..imports)  
<a name="module_MAN..py"></a>

### MAN~py(code, ctx)
Python interface.

**Kind**: inner method of [<code>MAN</code>](#module_MAN)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | code string |
| ctx | <code>Object</code> | context |

<a name="module_MAN..cv"></a>

### MAN~cv(code, ctx)
OpenCV interface.

**Kind**: inner method of [<code>MAN</code>](#module_MAN)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | code string |
| ctx | <code>Object</code> | context |

<a name="module_MAN..R"></a>

### MAN~R(code, ctx)
R interface.

**Kind**: inner method of [<code>MAN</code>](#module_MAN)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | code string |
| ctx | <code>Object</code> | context |

</details>

## Contacting, Contributing, Following

Feel free to 
* submit and status **TOTEM** issues (
[WWW](http://totem.zapto.org/issues.view) 
[COE](https://totem.west.ile.nga.ic.gov/issues.view) 
[SBU](https://totem.nga.mil/issues.view)
)  
* contribute to **TOTEM** notebooks (
[WWW](http://totem.zapto.org/shares/notebooks/) 
[COE](https://totem.west.ile.nga.ic.gov/shares/notebooks/) 
[SBU](https://totem.nga.mil/shares/notebooks/)
)  
* revise **TOTEM** requirements (
[WWW](http://totem.zapto.org/reqts.view) 
[COE](https://totem.west.ile.nga.ic.gov/reqts.view) 
[SBU](https://totem.nga.mil/reqts.view), 
)  
* browse **TOTEM** holdings (
[WWW](http://totem.zapto.org/) 
[COE](https://totem.west.ile.nga.ic.gov/) 
[SBU](https://totem.nga.mil/)
)  
* or follow **TOTEM** milestones (
[WWW](http://totem.zapto.org/milestones.view) 
[COE](https://totem.west.ile.nga.ic.gov/milestones.view) 
[SBU](https://totem.nga.mil/milestones.view)
).

## License

[MIT](LICENSE)


* * *

&copy; 2012 ACMESDS