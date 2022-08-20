// UNCLASSIFIED

const 
	//TFNODE = require('../tfjs/node_modules/@tensorflow/tfjs-node'),
	//TFUSE = require('@tensorflow-models/universal-sentence-encoder');
	JIMP = require('jimp'),
	MATHJS = require("mathjs"),
	MAC = {
		py: require("./pythonIF"),
		//cv: require("./opencvIF"),
		R: require("./RIF"),
		count: 0
	};

const
	Trace = (msg, ...args) => `man>>>${msg}`.trace( args );

const { 
		Copy,Each,Debug,
		isArray,isNumber,isString,isFunction,isEmpty,typeOf,
		sqlThread,Fetch 
	} = require("../enums");

const {random, round, sin, cos, exp, log, log2, PI, floor, abs, min, max} = Math;

/**
@module MAN.String
*/
Copy({  // String processing
	/*
	function toVector(K,labels) {	// label to K-dim hypo vector
		var 
			v = $(K, (k,v) => v[k] = -1 );
		
		for ( var n=0, N=this.length; n<N; n++ )
			v[ labels.indexOf( this.charAt(n) ) ] = +1;

		return v;
	},
	*/
	
	/**
	Parse "$.KEY" || "$[INDEX]" expressions given $ hash.

	@memberof String
	@param {Object} $ source hash
	*/
	/*
	function parseEval($) {
		try {
			return eval(this+"");
		}

		catch (err) {
			return err+"";
		}
	}, */
	
	/*
	function save(sql, ctx, cb) {
		var stash = {}, rem = {};
		
		Each(ctx, (key,val) => {
			if ( key.startsWith("Save_") )
				stash[key] = val;
			else
				rem[key] = val;
		});
		saveStash( sql, stash, ctx.ID, ctx.Host );
		cb( rem );
	},  */
	
	/*
	function $(idx,cb) {
		return this.get(idx,cb);
	}*/
	
	/*
	$: function (ctx) {
		return MAN(this+"", ctx);
	}  */
	
/**
Get and index a file (csv, aoi, stream, etc) using an indexor:

	"FILE ? _OPTION=VALUE & ... TOKEY=FROMKEY & TOKEY=EVAL & KEY & ... !where=EVAL"

where the pipe OPTIONs are defined in the [api](/api.view).

@param {Function} cb Callback( batch => { ... })

@example
"/stores/genpr_test5D4M.stream?_limit=10&x=x[0]".$( bat => console.log(bat) )
$>	{
	  x: [
		1.1587496753151842,
		4.394740359062863,
		-1.0506186418495682,
		-0.3926600691310812,
		1.9996891794700777,
		4.249379908846517,
		-1.0248674506854007,
		1.9239174131958228,
		2.6662831403773635,
		4.371247891508959
	  ]
	}
	null

@example
"/stores/genpr_test5D4M.stream?_limit=8&_batch=4&u=x[0]".$( bat => console.log(bat) );
$> {
  u: [
	1.1587496753151842,
	4.394740359062863,
	-1.0506186418495682,
	-0.3926600691310812
  ]
}
{
  u: [
	4.249379908846517,
	-1.0248674506854007,
	1.9239174131958228,
	2.6662831403773635
  ]
}
null

*/

/**
*/
	$: function (cb) { this.get(cb); }
}, String.prototype);

/**
@module MAN.Array
*/
Copy({	// Array processing
	
	/*
	function toLabel(labels) {	// K-dim hypo vector to label
		var 
			label = "";
		
		this.$( (n,v) => {
			if ( v[n] > 0) label += labels.charAt(n);
		});

		return label;
	}, */
	
/**
*/
	copy: function () {
		var x = this;
		return $(x.length, (n,y) => y[n] = x[n]);
	},
	
/**
*/
	dist: function (b) { 
		var 
			a = this,
			d = [ a[0]-b[0], a[1]-b[1] ];
		
		return sqrt( d[0]*d[0] + d[1]*d[1] );
	},

/**
*/
	nearestOf: function  (metric) {
		var imin = 0, emin = 1e99;

		this.forEach( (pt,i) => {
			var e = metric( pt );
			if (  e < emin) { imin = i; emin = e; }
		});
		return {idx: imin, val: emin};
	},
	
	// samplers
	
/**
*/
	batch: function (key, rec) { 
		return this.length ? rec[key] > this[0][key] : false;
	},

/**
*/
	flush: function (cb) {  // feed events to callback cb(evs) then flush events
		if (this.length) cb( this );
		this.length = 0;
	},
	
/**
*/
	draw: function (N, mash) {
		var 
			A = this,
			M = A.length,
			rand = Math.random,
			devs = $( N, (n, devs) => 
							 devs[n] = {idx: n % M, val: rand()} ).sort( (a,b) => 
										a.val - b.val );
		
			//N = Math.min(N,A.length);
		
		return mash 
			? [
					$( N, (n,B) => B[n] = A[ devs[n].idx ] ),
					$( N, (n,B) => B[n] = mash[ devs[n].idx ] )
				]
		
			: $( N, (n,B) => B[n] = A[ devs[n].idx ] ) ;
	},
	
/**
*/
	match: function (where, get) {
		var rtns = [];
		
		this.forEach( rec => {
			var matched = true;

			for (var x in where) 
				if ( rec[x] != where[x] ) matched = false; 

			if (matched) 
				if (rec) {
					var rtn = {};
					for (var from in get) 
						rtn[ get[from] ] = rec[from];
					
					rtns.push(rtn);
				}
			
				else
					rtns.push(rec);
		});

		return rtns;
	},
	
/**
*/
	replace: function (subs) {
		return this.$( this.length, (n,rec) => {
			Each(subs, function (pre, sub) {  // make #key and ##key substitutions
				for (var idx in sub) {
					var keys = sub[idx];
					if ( rec[idx] )
						for (var key in keys)
							rec[idx] = (rec[idx] + "").replace(pre + key, keys[key]);
				}
			});
		});
	},
	
	/*$: function (cb) {
		var A = this;
		for ( var n = 0, N=A.length; n<N; n++) cb(n,A);	// cant use forEach as an empty A wont be enumerated
		return A;
	},  */
	
/**
Index an array using a indexor:

	string of the form "to=from & to=eval & to & ... & !where=eval"
	hash of the form {to: from, ...}
	callback of the form (idx,array) => { ... }

The "!where" clause returns only records having a nonzero eval. 

@param {String|Object|Function} index Indexer 
@param {Object} ctx Context of functions etc 
@returns {Object} Aggregated data

@example
[{x:1,y:2},{x:10,y:20}].$("u=x+1&v=sin(y)&!where=x>5",Math)
{ u: [ 11 ], v: [ 0.9129452507276277 ] }

@example
[{x:1,y:2},{x:10,y:20}].$("x")
{ x: [ 1, 10 ] }

@example
[{x:1,y:2},{x:10,y:20}].$("x&mydata=y")
{ mydata: [ 2, 20 ], x: [ 1, 10 ] }

@example
[{x:1,y:2},{x:10,y:20}].$("mydata=[x,y]")
{ mydata: [ [ 1, 2 ], [ 10, 20 ] ] }

@example
[{x:1,y:2},{x:10,y:20}].$("mydata=x+1")
{ mydata: [ 2, 11 ] }

@example
[{x:1,y:2},{x:10,y:20}].$("",{"!all":1})
{ x: [ 1, 10 ], y: [ 2, 20 ] }

@example
[{x:1,y:2},{x:10,y:20}].$("")
[ { x: 1, y: 2 }, { x: 10, y: 20 } ]

@example
[{x:1,y:2},{x:10,y:20}].$("u")
{ u: [ undefined, undefined ] }

@example
[[1,2,3],[10,20,30]].$("1&0")
{ '0': [ 1, 10 ], '1': [ 2, 20 ] }	
*/	
	$: function (index,ctx) { return this.get(index,ctx); },
	
/**
*/
	$$: cb => {
		return this.$( (row,A) => {
			A[row].$( col => {
				cb( row, col, A );
			});
		});
	},
	
	/*
	indexor: function (idx) {
		var A = this;
		return $(idx.length, (n,B) => B[n] = A[ idx[n] ] );
	}, */
	
	/*
	function feed( key, cb) {  
	// thread key-grouped events to callback cb(evs) or cb(null) at end
		
		var 
			recs = [];
		
		if ( key ) {
			this.forEach( rec => { 
				if ( recs.group(key, rec) ) recs.flush(cb);
				recs.push(rec);
			});
			recs.flush( cb );
		}
		
		else 
			cb(this);
			
		cb( null );   // signal end-of-events		
	},	*/
	
/**
*/
	unique: function () {
		var 
			x = this.sort(),
			last = x[0],
			rtn = [last];
		
		x.forEach( X => {
			if ( X != last ) rtn.push( last = X );
		});
		
		return rtn;
	}
}, Array.prototype);

/**
@module MAN.JIMP
*/
Copy({ // add Jimp methods
/**
*/
	save: function ( file ) {
		var img = this;
		
		if ( file ) img.write( "." + (file || img.readPath) );	
		return img;
	},
	
/**
*/
	sym: function ( opts ) {	// symmetry over vertical axis (maps, limits, levels, noreflect)
		
		function remap(idx, levels, pix) {
			pix.X = pix.R - pix.G;
			pix.Y = pix.R - pix.B;
			pix.Z = pix.G - pix.B;
			
			pix.L = ( pix.R + pix.G + pix.B ) / 3;
			pix.S = 1 - min( pix.R, pix.G, pix.B ) / pix.L;
			pix.H = acos( (pix.X + pix.Y) / sqrt(pix.X**2 + pix.Y*pix.Z) / 2 ) * 360/Math.PI;
			
			return $( idx.length, (n,x) => x[n] = levler[ levels ? idx[n] : "U" ]( pix[ idx[n] ] , levels ) );
		}
		
		const {floor, acos, sqrt} = Math;
		
		var 
			img = this,
			levler = {
				R: (u,N) => floor( u * N / 256 ),
				G: (u,N) => floor( u * N / 256 ),
				B: (u,N) => floor( u * N / 256 ),
				L: (u,N) => floor( u * N / 256 ),
				S: (u,N) => floor( u * N ),
				H: (u,N) => floor( u * N / 360 ),
				U: (u,N) => u
			},
			bitmap = img.bitmap,
			data = bitmap.data,
			
			opts = Copy( opts || {}, {
				limits: {rows:0, cols:0},
				levels: {x: 0, y: 0},
				maps: {x: "RGB", y: "L"},
				reflect: true
			}, "."),
			limits = opts.limits, //Copy(limits || {}, {rows:0, cols:0}),
			levels = opts.levels, //Copy(levels || {}, {x: 0, y: 0}),
			maps = opts.maps, //Copy(maps || {}, {x: "RGB", y: "L"}),
			reflect = opts.reflect,
			
			Rows = bitmap.height,
			Cols = bitmap.width,
			rowReflect = floor(Rows/2), 	// halfway row
			rows = limits.rows ? min( limits.rows, rowReflect ) : rowReflect,
			cols = limits.cols ? min( limits.cols, Cols ) : Cols,
			X = $(cols),
			Y = $(cols),
			X0 = $(cols),
			Row = Rows-1,
			n0 = $(rowReflect, (n, n0) => n0[n] = Row-- ),
			rowSamples = $.rng(0,rowReflect).draw(rows),
			red = 0, green = 1, blue = 2;

		Trace( "sym", [Rows, Cols] , "->", [rows, cols], maps, limits, rowSamples.length );
		
		for (var col = 0; col<cols; col++) {
			var 
				x = X[col] = $(rows),
				y = Y[col] = $(rows),
				x0 = X0[col] = $(rowReflect);

			rowSamples.forEach( (row,n) => { // define (x,y) random training sets
				var
					Row = Rows - row - 1,	// reflected row
					idx = img.getPixelIndex( col, row ),
					pix = {R: data[ idx+red ] , G: data[ idx+green] , B: data[ idx+blue] },
					map = x[n] = remap( maps.x || "RGB", levels.x, pix),
					Idx = img.getPixelIndex( col, reflect ? Row : row ),	// sample is reflected by default
					Pix = {R: data[ Idx+red ] , G: data[ Idx+green] , B:data[ Idx+blue] },
					Map = y[n] = remap( maps.y || "L", levels.y, Pix);
			});

			n0.forEach( (row,n) => {		// define x0,n0 test set and index set
				var
					idx = img.getPixelIndex( col, row ),
					pix = {R: data[ idx+red ] , G: data[ idx+green] , B: data[ idx+blue] },
					map = x0[n] = remap( maps.x || "RGB", levels.x, pix);	// test data x0
			});
			
		}

		img.symmetries = {x: X, y: Y, x0: X0, n0: n0, input: img};
		return(img);
	}	
}, JIMP.prototype);

/**
[MathJS]{@link https://mathjs.org/}-based image and matrix manipulator.  This module documented in accordance with [jsdoc]{@link https://jsdoc.app/}.

@module MAN
@author [ACMESDS](https://totemstan.github.io)

@requires [enums](https://github.com/totemstan/atomic)
@requires [pythonIF](https://github.com/totemstan/atomic)
@requires [opencvIF](https://github.com/totemstan/atomic)
@requires [RIF](https://github.com/totemstan/atomic)

@requires crypto
@requires mathjs
@requires fft-js
@requires nodehmm
@requires node-svd
@requires node-svm
@requires mljs
@requires jimp
@requires jsbayes
@requires recurrentjs
@requires gamma
@requires expectation-maximization
@requires multivariate-normal
@requires newton-raphson
@requires random-seed
@requires edmonds-blossom
@requires simple-simplex
@requires tensorflow
@requires tensorflow-use

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

*/

const $ = MAN = module.exports = function $(code,ctx,cb) {
	
	switch ( typeOf(code) ) {
		case "String":	// run a mathjs script 
			
			if (cb) {
				var vmctx = ctx ? Copy(ctx, {}) : {};
				
				try {
					/*
					for ( var key in vmctx ) 
						if ( val = vmctx[key] ) 
							try {
								Trace(">>vmcb", key, val||false);
								vmctx[key] = isArray(val) ? $.matrix(val) : val;
							}
							catch (err) {
							}
							*/
					
					$.eval(code, vmctx);
					
					/*
					for ( var key in vmctx ) 
						if ( val = vmctx[key] ) 
							vmctx[key] = val._data || val;
					*/
					
					cb(vmctx);
					return vmctx;
				}
				catch (err) {
					Trace("error", err, code);
					cb( null );
				}

				//return cb(vmctx) || null;
			}
			
			else 
			if ( vmctx = ctx ) { // || {}; //Copy(ctx,{}); //new Object(ctx); //{}; // ctx || {};
				try {
					//Trace("code", code, vmctx);
					/*
					for ( var key in vmctx ) {	// list --> matrix
						if ( val = vmctx[key] ) 
							try {
								Trace(">>vm", key, val||false);
								vmctx[key] = isArray(val) ? $.matrix(val) : val;
							}
							catch (err) {
							}
					}
					*/
					
					$.eval(code, vmctx);
					//Trace("vm", code, vmctx);
					
					/*
					for ( var key in vmctx ) // matrix --> list
						if ( val = vmctx[key] ) {
							vmctx[key] = val._data || val;
						}
					*/
					
					return vmctx;
				}
				catch (err) {
					Trace("error", err, code);
					return null;
				}
			}
			
			else {
				try {
					return $.eval(code);
				}
				catch (err) {
					Trace("error", err, code);
					return null;
				}
			}
			
			break;
			
		case "Number":	// create a list
			var 
				rows = code,
				A = new Array(rows);
			
			return ctx ? A.$(ctx) : A;
			
		case "Array":		// create a matrix
			var 
				[rows,cols] = code,
				A = new Array(rows);
			
			for (var m=0; m<rows; m++) A[m] = new Array(cols);
			
			/*
			var
				dims = code,
				M = dims[0] || 0,
				N = dims[1] || 0,
				cb = ctx,
				A = new Array(M);

			A.rows = M;
			A.columns = N;
			for (var m=0; m<M; m++) A[m] = new Array(N);
			*/
			
			for (var m=0; m<rows; m++) for (var n=0; n<cols; n++) A[m][n] = 0;
			
			return ctx ? A.$$(ctx) : A;
			
		case "Object":	// import mathjs functions 
			//for (var key in code) Trace(`IMPORTING ${key}`);

			Copy(code,$);		// mix them in for access from $[name]

			$.import(code, {
				override: true
			});		// import them for access from $(" name(...) ")
			
			break;
	}
}

Copy( MATHJS, $ );

const
	// node modules

	FS = require("fs"),
		
	// 3rd party modules
	
	DET = {	// cnn detectors
		train: function (ctx, res) { //< gen  detector-trainging ctx for client with callback to res(ctx) when completed.

			var detName = ctx._Plugin;

			sqlThread( sql => {
				var vers = [0]; //ctx.Overhead ? [0,90] : [0];
				var labels = ctx.Labels.split(",");

				// train classifier
				//	`python ${ENV.CAFENGINES}/train`

				// train locator

				labels.each(function (n,label) {

					var posFilter = "digit +" + label,
						newFilter = "digit -" + label;

					sql.query(		// lock proofs
						"START TRANSACTION", 
						function (err) {	

					sql.query( 		// allocate positives to this ctx
						"UPDATE openv.proofs SET ? WHERE ? AND ?",
						[{posLock:detName}, {cat:"digit"}, {label:label}],
					//	"UPDATE proofs SET ? WHERE MATCH (label) AGAINST (? IN BOOLEAN MODE) AND enabled",
					//	[{posLock:detName},posFilter], 
						function (err) {

					sql.query(		// allocate negatives to this ctx
						"UPDATE openv.proofs SET ? WHERE ? AND NOT ?",
						[{negLock:detName}, {cat:"digit"}, {label:label}],
					//	"UPDATE proofs SET ? WHERE MATCH (label) AGAINST (? IN BOOLEAN MODE) AND enabled",
					//	[{negLock:detName},negFilter], 
						function (err) {

					sql.query(
						"SELECT * FROM openv.proofs WHERE ? LIMIT 0,?",		// get allocated positives
						[{posLock:detName},ctx.MaxPos],
						function (err,posProofs) {

					sql.query(								// get allocated negatives
						"SELECT * FROM openv.proofs WHERE ? LIMIT 0,?",
						[{negLock:detName},ctx.MaxNeg],
						function (err,negProofs) {

					sql.query(			// end proofs lock.
						"COMMIT", 
						function (err) { 

					Trace("PROOF ",[posProofs.length,negProofs.length]);

					if (posProofs.length && negProofs.length) {	// must have some proofs to execute ctx

						var	
							posDirty = posProofs.sum("dirty"),
							negDirty = negProofs.sum("dirty"),
							totDirty = posDirty + negDirty,
							totProofs = posProofs.length + negProofs.length,
							dirtyness = totDirty / totProofs;

						Trace('DIRTY', [dirtyness,ctx.MaxDirty,posDirty,negDirty,posProofs.length,negProofs.length]);

						sql.query("UPDATE detectors SET ? WHERE ?",[{Dirty:dirtyness},{ID:ctx.ID}]);

						if (dirtyness >= ctx.MaxDirty) {		// sufficiently dirty to cause ctx to execute ?

							sql.query("UPDATE proofs SET dirty=0 WHERE least(?)",{posLock:detName,negLock:detName});

							vers.each( function (n,ver) {  		// train all detector versions

								var det = FLEX.clone(ctx);

								det.Path = "det"+ver+"/"+label+"/"; 		// detector training results placed here
								det.DB = "../db"+ver;						// positives and negatives sourced from here relative to ENV.DETS
								det.posCount = posProofs.length;
								det.negCount = negProofs.length;
								det.posPath = det.Path + "positives.txt"; 	// + ENV.POSITIVES + (false ? jobFolder + ".positives" : det.PosCases + ".jpg");  		// .positives will disable auto-rotations
								det.negPath = det.Path + "negatives.txt"; 	// + ENV.NEGATIVES + jobFolder + ".negatives";
								det.vecPath = det.Path + "samples.vec";
								det.posLimit = Math.round(det.posCount * 0.9); 	// adjust counts so haar trainer does not exhaust supply
								det.negLimit = Math.round(det.negCount * 1.0);

								det.link = det.Name.tag("a",{href:"/swag.view?goto=Detectors"}) + " " + det.posLimit + " pos " + det.negLimit + " neg";
								det.name = det.Name;
								det.client = log.client;
								det.work = det.posCount + det.negCount;

								Trace(`TRAIN ${det.Name} ver ${ver}`, sql);

								var Execute = {
									Purge: "rm -rf " + det.Path,
									Reset: "mkdir -p " + det.Path,

									// ************* NOTE 
									// ****** Must pass bgcolor and bgthres as parms too - positive dependent
									// ****** so must be dervied from image upload tags
									Resample: 
										`opencv_createsamples -info ${det.posPath} -num ${det.posCount} -w ${det.Width} -h ${det.Height} -vec ${det.vecPath}`,
										//"opencv_createsamples -info $posPath -num $posCount -w $Width -h $Height -vec $Data/samples.vec",
										//"opencv_createsamples $Switch $posPath -bg $negPath -vec $Vector -num $Samples -w $Width -h $Height -bgcolor 112 -bgthresh 5 -maxxangle $xRotate -maxyangle $yRotate -maxzangle $zRotate -maxidev $ImageDev",

									Train: 
										`opencv_traincascade -data ${det.Path} -vec ${det.vecPath} -bg ${det.negPath} -numPos ${det.posLimit} -numNeg ${de.negLimit} -numStages ${det.MaxStages} -w ${det.Width} -h ${det.Height} -featureType LBP -mode BASIC`
										//"opencv_traincascade -data $Cascade -bg $negPath -vec $Vector -numPos $Positives -numNeg $Negatives -numStages $MaxStages -precalcValBufSize 100 -precalcIdxBufSize 100 -featureType HAAR -w $Width -h $Height -mode BASIC -minHitRate $MinTPR -maxFalseAlarmRate $MaxFPR -weightTrimRate $TrimRate -maxDepth $MaxDepth -maxWeakCount $MaxWeak"										
								};

								Trace((det.Execute||"").toUpperCase()+" "+det.name, sql);

								/**
								* Training requires:
								*  	SAMPLES >= POSITIVES + (MAXSTAGES - 1) * (1 - STAGEHITR) * POSITIVES + NEGATIVES
								* that is:
								*	POSITIVES <= (SAMPLES-NEGATIVES) / (1 + (MAXSTAGES-1)*(1-STAGEHITR))
								*
								* Actual STAGES (from training log) <= MAXSTAGES 
								* Desired HITRATE = STAGEHITR ^ MAXSTAGES --> STAGEHITR ^ (Actual STAGES)
								* Desired FALSEALARMRATE = STAGEFAR ^ MAXSTAGES --> STAGEFAR ^ (Actual STAGES)
								*
								* The samples_zfullN100 file will always contain $NEGATIVES number of negative images.
								*/

								switch (det.Execute.toLowerCase()) {
									case "purge": 
									case "clear":
										//sql.jobs().insert( "purge", Execute.Purge, det);
										break;

									case "reset":
									case "retrain":

										if (true) {						// gen training positives
											var list = []; 

											posProofs.each( function (n,proof) {
												//list.push(proof.Name + " 1 0 0 " + (proof.Width-1) + " " + (proof.Height-1) );
												list.push([det.DB+"/"+proof.name, 1, proof.left, proof.top, proof.width, proof.height].join(" "));
											});

											FS.writeFileSync(
												`./public/dets/${det.posPath}`, 
												list.join("\n")+"\n","utf-8");
										}

										if (true) {					 	// gen training negatives
											var list = [];

											negProofs.each( function (n,proof) {
												list.push(det.DB+"/"+proof.name);
											});

											FS.writeFileSync(
												`./public/dets/${det.negPath}`, 
												list.join("\n")+"\n","utf-8");
										}

										if (true)
											sql.jobs().insert( "reset", Execute.Reset, det, function () {
												sql.jobs().insert( "sample", Execute.Resample, det, function () {
													sql.jobs().insert( "learn", Execute.Train, det, function () {
														if (res) res(det);
													});
												});
											});

										break;

									case "resample":

										sql.jobs().insert( "sample", Execute.Resample, det, function () {
											sql.jobs().insert( "learn", Execute.Train, det, function () {
												if (res) res(det);
											});
										});
										break;

									case "transfer":

										sql.jobs().insert( "learn", Execute.Train, det, function () {
											if (res) res(det);
										});
										break;

									case "baseline":
										break;

									case "run":
									case "detect":

										if (FLEX.HACK)
										FLEX.HACK.workflow(sql, {
											detName: det.Name.replace(/ /g,"_"),
											chanName: det.Channel,
											size: det.Feature,
											pixels: det.Pixels,
											scale: det.Pack,
											step: det.SizeStep,
											detects: det.Hits,
											infile: det.infile,
											outfile: "/rroc/data/giat/swag/jobs",
											ctx: {
												client: req.client,
												class: "detect",
												name: det.Name,
												link: det.Name.tag("a",{href:"/swag.view?goto=Detectors"}),
												qos: req.profile.QoS,
												priority: 1
											}									
										});

										break;
								}

							});

						}
					}

					}); // commit proofs
					}); // select neg proofs
					}); // select pos proofs
					}); // update neg proofs
					}); // update pos proofs
					}); // lock proofs

				});	// labels
			}); ///sql thread
		}
	},
	CRYPTO = require('crypto'),
	EM = require("expectation-maximization"),  // there is a mljs version as well that uses this one
	MVN = require("multivariate-normal").default,
	LM = require("./mljs/node_modules/ml-levenberg-marquardt"),
	ML = require("./mljs/node_modules/ml-matrix"),
	LRM = require("./mljs/node_modules/ml-logistic-regression"),
	RAF = require("./mljs/node_modules/ml-random-forest").RandomForestRegression,
	DTR = require("./mljs/node_modules/ml-cart").DecisionTreeRegression,
	KNN = require("./mljs/node_modules/ml-knn"),
	NAB = require("./mljs/node_modules/ml-naivebayes").MultinomialNB,
	MLR = require("./mljs/node_modules/ml-regression-multivariate-linear"),
	SPR = require("./mljs/node_modules/ml-regression-polynomial"),
	ROR = require("./mljs/node_modules/ml-regression-robust-polynomial"),
	PLS = require("./mljs/node_modules/ml-pls").PLS,
	SOM = require("./mljs/node_modules/ml-som"),
	SVM = require("./mljs/node_modules/ml-svm"), // require("node-svm"),
	GAMMA = require("gamma"),
	DSP = require("fft-js"),
	//RAN = require("randpr"),  // added by debe to avoid recursive requires
	//SVD: require("node-svd"),
	//RNN: require("recurrentjs"),
	BAYES = require("jsbayes"),
	HMM = require("nodehmm"),
	ZETA = require("riemann-zeta"),
	NRAP = require("newton-raphson"),
	SEED = require("random-seed"),
	EDBLOS = require("edmonds-blossom"),
	SIMPLEX = require("simple-simplex"),
	ML$ = ML.Matrix;

//console.log("jslab las=", ML);

Copy({
/**
Python interface.
@param {String} code code string
@param {Object} ctx context
*/
	py: (code,ctx) => {
		MAC.py("py.thread"+(MAC.count++), code, ctx);
		return ctx;
	},
	
/**
OpenCV interface.
@param {String} code code string
@param {Object} ctx context
*/
	cv: (code,ctx) => {
		MAC.cv("cv.thread"+(MAC.count++), code, ctx);
		return ctx;
	},
	
/**
R interface.
@param {String} code code string
@param {Object} ctx context
*/
	R: (code,ctx) => {
		MAC.R("R.thread"+(MAC.count++), code, ctx);
		return ctx;
	},
	// methods
	
	saveKeys: { //< define plugin save-keys on config
	},
	
	config: (opts, cb) => {
		if (opts) Copy(opts, $, ".");
		if (cb) cb($);	
	},
	
	// libraries
		
	JSON: JSON,
	JIMP: JIMP,
	CRYPTO: CRYPTO,
	LRM: LRM,
	SVM: SVM,
	KNN: KNN,
	SPR: SPR,
	MLR: MLR,		
	SOM: SOM,
	PLS: PLS,
	EM: EM,
	RAF: RAF,
	DTR: DTR,
	NAB: NAB,
	MVN: MVN,
	LM: LM,
	GAMMA: GAMMA,
	SEED: SEED,
	DSP: DSP,

	// basic enumerators
	Copy: Copy,
	Each: Each,
	Debug: Debug,
	console: console,
	
/**
Stash for imported functions.
*/
	imports: {		// extensions
	
		// dynamic programming
		
/**
*/
		oga: (x,y,s) => { // Neddleman-Wunch optimal global alignment (#x >= #y)
			function backtrack(i,j,seq,seqs) {
				//Trace(i,j,seq,A[i][j]);
				
				var
					opts = A[i][j],
					top = opts[0].f;

				// if ( i==N && j==M ) Trace(i,j,d,opts);			
				// if ( !i && !j ) Trace(">>>>seq", seq);
				
				if ( !i && !j ) 
					seqs.push( $( N, (n,s) => s[n] = new Object( seq[N-n-1] ) ));
				
				else
					opts.forEach( opt => {
						//Trace( ">>>test", opt, top);
						if ( opt.f == top ) 
							backtrack( opt.i, opt.j, seq.concat( {
								x: (i==opt.i) ? gap : x[i], 
								y: (j==opt.j) ? gap : y[j]
							} ), seqs);
					});
			}
			
			const
				N = x.length,
				M = y.length,
				gap = "?",
				d = -s( gap, x[0] );
			
			x = [gap].concat(x);
			y = [gap].concat(y);

			const
				seqs = [],
				F = $( [N+1,M+1], (i,j,F) => { 
					var 
						i1 = i-1,
						j1 = j-1;
					
					if ( !i && !j )
						F[0][0] = 0;
					
					else
					if ( !j )
						F[i][0] = F[i1][0] - d;
						
					else
					if ( !i )
						F[0][j] = F[0][j1] - d;
				}),
				A = $( [N+1,M+1], (i,j,A) => {
					var 
						i1 = i ? i-1 : 0,
						j1 = j ? j-1 : 0,
						a = x[i],
						b = y[j];

					if ( !i || !j )
						A[i][j] = [ { i:i1, j:j1, x:a, y:b, f: F[i][j] } ];
					
					else {
						A[i][j] = [ 
							{ i:i1, j:j1, x:a, y:b,	f: F[i1][j1] + s(a,b) },
							{ i:i1, j:j,  x:a, y:b,	f: F[i1][j] - d },
							{ i:i,  j:j1, x:a, y:b,	f: F[i][j1] - d }
						].sort( (u, v) => v.f - u.f );
						
						//if ( i<=2 && j<=2 ) Trace(i,j,A[i][j]);
						
						F[i][j] = A[i][j][0].f;	
					}
				}),
				score = F[N][M];
				
			// Trace(">>F", F);
			
			backtrack( N,M,[],seqs );
			return [ score, seqs, F ];		
		},	
		
		//ranproc: opts => new $.RAN(opts),

		// belief networks

/**
*/
		getEv: (d,keys) => $(keys.length, (i,e) => e[i] = d[ keys[i] ]),

/**
*/
		putEv: (e,keys) => {
			var d = {};
			e.$( i => d[ keys[i] ] = e[i] );
			return d;
		},

/**
*/
		stateSize: net => {
			const {states,vars} = net;

			var n = 0;

			for ( var x in vars ) 
				n += vars[x].split(",").length * (states.length-1);

			return n;
		},

/**
Return BIC score for specified Bayesian network.
*/
		BIC: (net,D) => {

			function IJK( A, cb ) {
				function enumStates(parents,state,par,cb) {

					if ( state.length < parents.length ) 
						states.forEach( s => {
							enumStates( parents, state.concat(s), par.concat(parents[state.length]), cb );
						});

					else
						cb( state.join(), par );
				}

				Each( vars, (i, parents) => {
					var A_i = A[i] || (A[i] = {});

					if ( parents )
						enumStates( parents.split(","), [], [], (j,par) => {
							var A_ij = A_i[j] || (A_i[j] = []);

							states.forEach( k => A_ij[k] = cb( i,j,k, par ) );
						});	
				});
			}

			function EM(theta,N,D) {

				const {getEv} = $;
				var eps = 0.2;

				do {
					IJK( N, (i,j,k,par) => {		// expectation step
						//Trace("E", i,j,k,par);

						var 
							EN = 0,
							keys = [i].concat( par ),
							theta_ijk = theta[i][j][k];

						D.forEach( (d,n) => {
							var 
								sTest = [k,j].join(),
								dTest = getEv(d, keys).join();

							if ( dTest.indexOf(missing) >= 0 ) {
								//Trace(dTest);
								D[n].bad = true;
								EN += theta_ijk;
							}

							else
								EN += (sTest==dTest) ? 1 : 0
						});
						return EN;
					});

					IJK( theta, (i,j,k) => { 	// maximization step
						//Trace("M", i,j,k);

						var 
							sum = 0,
							N_ij = N[i][j];

						states.forEach( h => sum += N_ij[h] );

						return N_ij[k] / sum;
					});

					eps -= 0.01;
					//Trace("eps", eps);
				}

				while ( eps > 0.1 );
			}

			const {propEv,stateSize,getEv} = $;

			var
				{theta,vars,states,N} = net,
				missing = "?",
				n = D.length,
				bic = stateSize(net) * log2(n)/2,
				keys = Object.keys(vars);

			//Trace(n,bic);

			if ( !theta ) {
				theta = net.theta = {};
				IJK( theta, (i,j,k) => random() );
			}

			if ( !N ) {
				N = net.N = {};
				IJK( N, (i,j,k) => 0 );
			}

			//Trace("theta N", theta,N);
			EM(theta,N,D);

			D.forEach( d => {	// skip datasets with missing evidence
				bic += d.bad ? 0 : log2( propEv( net, getEv(d,keys) ) );
			});

			return bic;	
		},

/**
Draw deviate from a specified distribution.
*/
		draw: (F,x) => {	// draw x from distribution f given its cummulative F
			var u = random();

			for ( var n=1, N=F.length; n<N; n++ ) 
				if ( F[n] >= u ) break;

			if (x) {
				var
					f1 = F[n],
					f0 = F[n-1],
					x1 = x[n],
					x0 = x[n-1],
					dx = x1-x0,
					df = f1-f0;

				return x0 + (u-f0) * dx / df;
			}

			else {
				var
					f1 = F[n],
					f0 = F[n-1],
					x1 = n,
					x0 = n-1,
					dx = x1-x0,
					df = f1-f0,
					xe = x0 + (u-f0) * dx / df;

				//Trace(u,f0,dx,df,xe);
				return (xe > 0) ? round(xe) : 0;
			}
		},

/**
Cummulative sum.
*/
		cum: (f,x) => {	// return cummulative of f over x
			var 
				N = f.length,
				dx = x ? x[1]-x[0] : 1;

			return $(N, (n,F) => F[n] = n ? F[n-1] + f[n]*dx : f[n]*dx );
		},

/**
Draw Bayesian network deviates with specifed Conditional Random Field
*/
		crf: (net,drop) => {	// draw a d={x,a,b} deviate from a net crf
			const {type,states,vars} = net;
			const {draw,cum,putEv} = $;
			var 
				keys = Object.keys(vars),
				K = keys.length,
				drops = $( K, (n,d) => d[n] = drop ? (random()<drop) ? true : false : false ),
				missing = "?";

			switch (type) {
				case "a<-x->b":
				case "a->x->b":
				case "a<-x<-b":	
				case "1":
				case 1:

					var {Pa_x,Pb_x,Px} = net;

					if ( !Px ) {	// initialize cummulatives
						const {pa_x,pb_x,px} = net;
						var
							Px = net.Px = cum( px ),
							Pa_x = net.Pa_x = {},
							Pb_x = net.Pb_x = {};

						states.forEach( x => {
							Pa_x[ [x] ] = cum( pa_x[ [x] ] );
							Pb_x[ [x] ] = cum( pb_x[ [x] ] );
						});						
					}

					var
						x = draw( Px ),
						a = draw( Pa_x[ [x] ] ),
						b = draw( Pb_x[ [x] ] );

					break;

				case "a->x<-b":	
				case "2":
				case 2:

					var {Px_ab,Pa,Pb} = net;

					if ( !Px_ab ) {	// initialize cummulatives
						const {px_ab,pa,pb} = net;
						var
							Pa = net.Pa = cum( pa ),
							Pb = net.Pb = cum( pb ),
							Px_ab = net.Px_ab = {};

						states.forEach( a => {
						states.forEach( b => {
							Px_ab[ [a,b] ] = cum( px_ab[ [a,b] ] );
						});
						});
					}

					var
						a = draw(Pa),
						b = draw(Pb),
						x = draw( Px_ab[ [a,b] ] );

					break;

				default:
					var
						a = b = x = 0;
			}

			return putEv([ 
				drops[0] ? missing : x, 
				drops[1] ? missing : a, 
				drops[2] ? missing : b
			], keys);
		},

/**
Propagate evidents in a Bayesian network.
*/
		propEv: (net,e) => {	// propagate evidence e (compute joint at e)
			const {type, pa_x,pb_x,px, px_ab, pa, pb} = net;

			switch (type) {
				case "a<-x->b":
				case "a->x->b":
				case "a<-x<-b":	
				case "1": 
				case 1:
					var [x,a,b] = e;
					return pa_x[ [x] ][a] * pb_x[ [x] ][b] * px[x];

				case "a->x<-b":	
				case "2":
				case 2:
					var [x,a,b] = e;
					return px_ab[ [a,b] ][x] * pa[a] * pb[b];

				default:
					return -1;				
			}
		},

/**
Conditional mutual information.
*/
		CMI: (net,check) => {	// conditional mutual info CMI(a,b|x)

			function longway() {
				var sum = 0;
				states.forEach( x => {
					var abSum = 0, fx = px[x];

					states.forEach( a => {
						states.forEach( b => {
							var 
								fa_x = pa_x[ [x] ][a],
								fb_x = pb_x[ [x] ][b],
								fx = px[x],
								fu = fa_x * fb_x * fx,
								fab_x = fu / fx,
								flog = log(fab_x) - log(fa_x) - log(fb_x);

							abSum += fab_x * flog;
						});
					});

					sum += fx * abSum;
				});

				return sum;
			}

			const {type,states} = net;

			switch (type) {
				case "a<-x->b":
				case "a->x->b":
				case "a<-x<-b":	
				case "1": 
				case 1:

					var 
						{pa_x,pb_x,px} = net;	

					return check ? longway() : 0;

				case "a->x<-b":	
				case "2":
				case 2:

					var 
						{px_ab,pa,pb,px} = net;	

					if ( !px ) { // configure
						var 
							d = states.length,
							px = net.px = $(d, (x,p) => {
								var sum = 0;
								states.forEach( a => {
								states.forEach( b => {
										sum += px_ab[ [a,b] ][x] * pa[a] * pb[b];
								}); });
								p[x] = sum;
							});

						if (check) {	// extended config for forcing a check
							var 
								pa_x = net.pa_x = {},
								pb_x = net.pb_x = {};

							states.forEach( x => {
								pa_x[ [x] ] = $(d, (a,p) => p[a] = pa[a] / px[x] );
								pb_x[ [x] ] = $(d, (b,p) => p[b] = pb[b] / px[x] );
							});	
						}
					}

					if ( check )
						return longway();

					else {
						var sum = 0;
						states.forEach( x => sum += log( px[x] ) );
						return sum;	
					}

				default:
					return -1;
			}
		},

/**
Markov Chain Monte Carlo process.
*/
		mcmc: (opts,u) => {	// return random u vector from specified opts.p distribution
			if ( u ) {	// generate a new u vector
				const {burn,utox,xtou,p,g,G,N} = opts;

				if ( burn ) {
					opts.burn=0;
					for ( var n=0,v=u; n<burn; n++) v = $.mcmc(opts,v);
				}

				var
					xt = utox[u[0]][u[1]],		// map u to its state
					xp = $.draw(G[xt]),	// get a proposed new state
					a1 = p[xp] / p[xt],	// unconditioned
					a2 = g[xp][xt] / g[xt][xp],	// conditioned on xp-xt
					alpha = a1*a2,
					xt = (alpha>=1) ? xp : (random() < alpha) ? xp : xt;

				return xtou[xt];
			}

			else {
				var
					p = opts.p,
					N = opts.N = $.size(p),
					d = opts.d = $.prod(N),
					states = opts.states = [0,1],
					n = 0,
					utox = opts.utox = $(N, (i,j,x) => x[i][j] = n++),
					xtou = opts.xtou = $(d),
					g = opts.g = [ // proposals hard coded now for N=[2,2]
						$.reshape([[0.1, 0.3], [0.5, 0.1]], [d]),
						$.reshape([[0.2, 0.2], [0.4, 0.2]], [d]),
						$.reshape([[0.2, 0.4], [0.2, 0.2]], [d]),
						$.reshape([[0.1, 0.5], [0.3, 0.2]], [d]) 
					],
					G = opts.G = $(d, (n,G) => {		// g cummlatives
						G[n] = $(d, (k,H) => {
							if (k) 
								H[k] = g[n][k] + H[k-1];
							else
								H[k] = g[n][0];
						});
					}),
					p = opts.p = $.reshape(opts.p, [d]),
					n = 0,
					u = [0,0];

				states.forEach( Ri => {
					states.forEach( Rj => {
						xtou[n++] = [Ri,Rj];
					});
				});

				opts.burn = 0;
			}
		}, 

		isNull: A => A ? 0 : 1,

/**
Returns indicator of a test vector.
*/
		indicate: test => {		// indicator
			var 
				sum = 0;

			test.$( n => sum += test[n] ? 1 : 0 );
			return sum;
		},

		// boosting

/**
Boost frome cycle t>=1; t=1 will initialize the boosting
process.  Provide an sql connector to
ingest data; a solve hash containing boosting parameters (
alpha, eps, etc used by adaBoost); and a trace flag to 
enable tracing;

The hypothesis callback hypo(x,keys) will
	return tested hypo if keys specified
	return learned hypo keys if x specified
	save hypo keys to boost stash if neither specified

@param {Number} cycle number being boosted >=1
@param {Object} sql connector
@param {Object} solve boosting options and stashes: alpha, eps, h, samples, mixes, thresh
@param {Function} trace callback(msg) to handel messages
@param {Funtion} hypo callback(x,keys)
*/
		boost: ( t, sql, solve, trace, hypo ) => {

			//const { alpha, eps, h, points, samples, mixes, thresh } = solve;
			const { alpha, eps, h, samples, mixes, thresh } = solve;
			const {	log, sqrt, exp, sign } = Math;

			//Trace(">>>>>>test", "HLM->", "HLM".toVector(mixes,labels) );
			//sql.query("SELECT idx,D FROM openv.points LIMIT 5", (err,recs) => Trace(">>>>>test", recs ) );

			//Trace(">>>>boost hypos", JSON.stringify(solve.h));

			//Trace("=========solve", solve);

			sql.query(
				"SELECT x,y,idx,D FROM openv.points WHERE D>=? ORDER BY rand() LIMIT ?", 
				[thresh, samples], 
				(err,recs) => {

				function weight( hypo ) {
					var eps = 0;

					idx.$( m => {	// compute weight of labelled points
						if ( y_i = y[m] ) {
							var 
								i = idx[m],
								x_i = x[m],
								h_i = hypo( x_i ),
								//test = $(mixes, (k,test) => test[k] = y_i[k] != h_i[k] ), // find where they disagree
								//ind = 0;
								ind = $.indicate( $(mixes, (k,test) => test[k] = y_i[k] != h_i[k] ) );

							//test.$( k => ind += test[k] ? 1 : 0 );	// weight disagreement higher
							//Trace(">>>>>boost weight", m, i, x_i, y_i, h_i, test, ind );
							eps += D[m] * ind;
						}
					});

					return eps;
				}

				trace("boost", {
					cycle: t,
					select: err ? "failed" : "ok", 
					samples: samples, 
					sampled: recs.length, 
					threshold: thresh,
					stacked: solve.h.length
				} );

				recs.forEach( rec => {		// parse json and labels (y<0 means unlabelled)
					rec.x = JSON.parse( rec.x );
					rec.y = (rec.y>=0) ? $(mixes, (n,y) => y[n] = ( n == rec.y ) ? +1 : -1) : null;
				});
				//Trace(">>>>set h before", h);

				var 
					[x,y,idx,D] = recs.$("x&y&idx&D"), //recs.get("[x,y,idx,D]"),  	//.get( ["x", "y", "idx", "D"] ),
					min = 1e12,
					h_t = h[ t ] = hypo( x );		// null if (x,y) are empty

				//Trace(">>>>set h", h);
				if ( h_t ) { // hypo provided its parms (aka keys), so we block eps=0
					for ( var n=1; n<=t; n++) { // enumerate through previous hypos
						trace("boost", {from: n, to: t});
						if ( h_n = h[n] )
							eps[ n ] = weight( x => {	// update weights at previous cycles (eps=0 was blocked)
								// use the K-parms in h_t against this x and return the K-vector for this hypo
								//return hypo( x, h_n ).toVector(mixes,labels);
								return hypo( x, h_n );
							});

						else
							eps[ n ] = 0;
					}

					//Trace(">>>>eps", eps, "at", t, "ht=", h_t);
					for ( var n=1; n<=t; n++ ) // retain the h having the lowest eps weight (eps=0 was blocked)
						if ( eps[n] < min ) { min = eps[n]; h_t = h[n]; }

					var
						eps_t = eps[ t ] = min,	// update weight at this cycle
						alpha_t = alpha[ t ] = 0.5 * log( ( 1 - eps_t ) / eps_t ),	// update confidence at this cycle
						Z = 2 * sqrt( eps_t * ( 1 - eps_t ) ); 	// calc D normalizer

					hypo( null ); // signal boost was updated

					trace("boost", {
						weights: eps, 
						minimum: min, 
						confidence: alpha_t, 
						normalizer: Z
					});

					idx.$( m => {	// update D-sampler on labelled points
						function dot(x,y) {
							//Trace("x=",x,  "y=",y);
							return  $.dot( x, y );
						}

						if ( y[m] ) {
							//D[m] = D[m] / Z * exp( alpha_t * dot( y[m], hypo( x[m], h_t ).toVector(mixes,labels) ) );
							//Trace("update", m, h_t);
							D[m] = D[m] / Z * exp( alpha_t * dot( y[m], hypo( x[m], h_t ) ) );		// n/c when #agreements = #disagreements or when alpha (eps) = 0 (1/2)
							//Trace("update", m, idx[m], D[m], eps_t, alpha_t );
							sql.query( "UPDATE openv.points SET ? WHERE ?", [ {D:D[m]}, {idx: idx[m] } ] );
						}
					});
				}

				else { // hypo failed (e.g. no labelled data) so dont signal boost update
					trace("boost", "no labelled data");
				}

			});

		},

		// Linear algebra methods

/**
*/
		proj: (v,u) => $.multiply( $.dot(v,u) / $.dot(u,u), u ) ,  // returns projection of v on u

		/**
		*/
		orthoNorm: V => {	// returns K orthonormalized vectors E given K random vectors V
			function GramSchmidt(k,E,U,V) {
				var 
					v = $( K, (n,v) => v[n] = V[n][k] ),	// get k'th V vector
					sum = $( K, (n,x) => x[n] = 0 );

				for (var j=0; j<k; j++) {
					var
						u = $(K, (n,u) => u[n] = U[n][j] ),	// get j'th U vector
						p = $.proj(v,u);

					sum.$( n => sum[n] += p[n] );
					//Trace("GramSchmidt", k, j, u,p,sum );
				}

				var u = $( K, (n,u) => U[n][k] = u[n] = v[n] - sum[n] );

				var e = $.multiply( u, 1/$.norm(u) );
				//Trace(k, "e=", e, "u=", u, "v=", v, "s=", sum);
				e.$( n => E[n][k] = e[n] );  // save k'th E vector
			}

			var 
				v = $.matrix(V),
				[K,M] = v._size,  // rows,cols
				U = $( [K,M] ),
				E = $( [K,M] );

			for (var k=0; k<M; k++ ) GramSchmidt( k, E, U, V );
			//Trace("orthoNorm=", E, $.multiply($.transpose(E), E) );
			return E;
		},

		// graphs
		
/**
*/
		MaxFlowMinCut: (C,s,t) => {
			function EdmondsKarp(G,s,t) {
				const {min} = Math;

				var 
					flow = 0,
					N = G.length;

				do {
					var 
						q = [s],
						pred = new Array(N);

					// breadth first search to find shortest s-t path
					while (q.length) {	// bfs 
						//Trace(q);
						var cur = q.pop();
						//Trace("cur",cur);
						G[cur].forEach( e => { // enumerate edges from current node
							//Trace(">e",e);
							if ( !pred[ e.t ] && e.t != s && e.cap > e.flow ) { // have excess capacity is this edge
								pred[ e.t ] = e;
								q.push( e.t );
							}
						});
					}

					//Trace("pred",pred);
					if ( pred[t] ) { // found an augmenting path so see how much flow
						var df = Infinity;

						for ( var e = pred[t] ; e ; e=pred[e.s] ) // find amount to increase flow
							df = min(df, e.cap-e.flow);

						for ( var e = pred[t] ; e ; e=pred[e.s] ) { // add update to edges
							e.flow += df;
							e.rev.flow -= df;
						}

						//Trace(">>>aug", t, df);
						flow += df;
					}		
				}

				while ( pred[t] ); // loop until no aug path found

				//Trace(">>pred", pred);
				var cut = [], S = $(N,(n,S)=>S[n]=0), set = [];
				pred.forEach( e => { 
					if ( e ) {
						cut.push(e);
						S[e.s] = S[e.t] = 1;
					}
				});

				cut.forEach( e => {
					G[e.t].forEach( eG => {
						if ( !S[eG.t] ) set.push(eG);
					});

					if ( e.s == s )
						G[s].forEach( eG => {
							if ( !S[eG.t] ) set.push(eG);
						});
				});

				//if (flow) Trace(">>>maxflow", flow, cut.length, set.length);
				return {
					maxflow: flow,
					mincut: cut,
					source: S,
					cutset: set
				};
			}

			var 
				N = C.length,
				G = $(N, (i,G) => {
					var edges = G[i] = [];
					C[i].$( j => {
						if ( cap = C[i][j] ) 
							edges.push({ s:i, t:j, cap:cap, flow: 0, rev: { s:j, t:i, cap:C[j][i], flow: 0 } });
					});
				});

			return EdmondsKarp(G,s,t);
		},

/**
Return an adjaceny matrix for a random n-node, d-regular graph.
*/
		ranreg: (n,d) => { 	// Steger and Wormald method
			if ( d>n-1 ) return null;

			function makeRandomRegular() {
				var
					N = n * d,	// must be even
					G = $(N, (i,G) => G[i] = floor(i/d) ),
					U = {},
					A = $([N,N], (i,j,A) => A[i][j] = 0 ),
					L = $([n,n], (r,s,L) => L[r][s] = 0 );

				A.$( n => U[n] = n );

				do {
					var 
						suitable = false,
						Ukeys = Object.keys(U),
						Ulen = Ukeys.length,
						Uend = ( Ulen == 2 );

					//Trace("unset",U,Ulen,Uend);
					do {		// find a suiteable (i,j) pair
						var
							I = Ukeys[ Uend ? 0 : floor(random()*Ulen) ],
							J = Ukeys[ Uend ? 1 : floor(random()*Ulen) ],
							i = U[I],	// get unset node
							j = U[J],
							r = G[i],						// the group assigned to node i
							s = G[j],
							suitable = r != s;

						//Trace("test", [i,j], "in", [r,s]);

						for ( var mi=r*d, md=0; md<d && suitable; md++,mi++ )
							for ( var nj=s*d, nd=0; nd<d && suitable; nd++,nj++ ) {
								if ( A[mi][nj] ) suitable = false;
								//Trace( [i,j], [mi,nj], suitable, [r,s] );
							}
					}

					while ( !suitable && (Ulen > 2) );

					if ( suitable ) {
						//Trace("join", [i,j], "in", [r,s], U);
						A[i][j] = A[j][i] = 1;
					}

					delete U[I];
					delete U[J];
					Ulen -= 2;
				}

				while (Ulen);

				//Trace("graph",A);
				for (var r=0; r<n; r++ )
					for (var s=0; s<n; s++ ) 
						if ( r != s ) {
							var linked = false;

							for ( var i=r*d, md=0; md<d && !linked; md++,i++ )
								for ( var j=s*d, nd=0; nd<d && !linked; nd++,j++ ) {
									if ( A[i][j] ) linked = true;

							if ( linked ) 
								L[r][s] = L[s][r] = 1;

							//Trace("link", [r,s], linked);
						}
					}

				//Trace("final", L);
				return L;
			}

			do {
				var 
					A = makeRandomRegular(),
					dTest = $.degrees(A),
					ok = true;

				for ( var i=0,N=dTest.length; i<N && ok; i++) 
					if (dTest[i] != d) ok = false;
			}

			while ( !ok );

			return A;
		},

/**
Return node degress for graph with adjaceny matrix A.
*/
		degrees: A => { 
			var 
				A = A._data || A,
				N = A.length;

			return $( N, (m,d) => { 
				var sum = 0;
				A[m].$( (n,A) => sum += A[n] );
				d[m] = sum;
			});
		},

/**
Return graph degree given its adjacency matgrix A.
*/
		degree: A => {
			var deg = 0;
			$.degrees(A).$( (n,d) => {
				if ( d[n] > deg ) deg = d[n];
			});
			return deg;
		},

/**
Return node of a graph with adjacency matrix A.
*/
		nodes: A => {
			var N = (A._data || A).length;
			return $( N, (n,v) => v[n] = n );
		},

/**
Return eigen spectrum of a graph with adjacency magtrix A.
*/
		spectrum: A => {
			var evd = $.evd(A);
			return evd.values.sort( (a,b) => b-a );
		},

/**
Return true is any items true.
*/
		any: cb => {
			if ( cb )
				if ( typeof cb == "function" )
					this.forEach( val => {
						if ( cb(val) ) return true;
					});

				else
					this.forEach( val => {
						if ( val == cb ) return true;
					});

			else
				this.forEach( val => {
					if ( val ) return true;
				});

			return false;
		},

/**
Returns true is all items true.
*/
		all: cb => {
			if ( cb )
				if ( typeof cb == "function" )
					this.forEach( val => {
						if ( !cb(val) ) return false;
					});

				else
					this.forEach( val => {
						if ( val != cb ) return false;
					});

			else
				this.forEach( val => {
					if ( !val ) return false;
				});

			return true;
		},
		
/**
Return Cheeger's isoperimetric constant for a graph with 
adjacency matrix A and vertex set V.  Uses random set partitions
when a nonzero block size is specified; otherwise, exhaustively 
enumerates all partitions.
*/
		isoperi: (A,block) => {
			function partition( S, rem, cb) {
				var nS = S.length;

				if ( nS == max ) {
					samples[max]++;

					var s = {}, T = [];
					S.forEach( v => s[v] = 1 );
					for (var i=0; i<n; i++) if ( !s[v=V[i]] ) T.push( v );

					cb(S,T);
				}

				else 
				if ( block )
					for (var j=rem; j<n && samples[max]<block; j++) 
						partition( S.concat(V[j]), ++rem, cb);

				else
					for (var j=rem; j<n; j++) 
						partition( S.concat(V[j]), ++rem, cb);

			}

			function isop( S, T ) {
				//Trace(">>>iso",S.length,T.length);
				var nT = T.length, nS = S.length, dS=0;
				T.forEach( j => {
					var hits = 0;
					S.forEach( i => {
						if ( A[i][j] ) hits++;
					});

					if ( hits == 1 ) dS++;
				});

				if ( h = dS/nS ) if ( h<hmin ) hmin = h;
			}

			const {floor,random} = Math;

			var
				U = $.nodes(A),
				n = U.length,
				V = $(n, (i,V) => V[i] = {v: i, r: random()} )
								.sort( (a,b) => b.r-a.r )
								.$( (i,V) => V[i] = V[i].v ),
				nmax = floor(n/2),	
				samples = $( nmax, (i,k) => k[i] = 0),
				rand = N => floor(random()*N),
				part = [],
				hmin = 1e99;

			//block = 10;
			//Trace("V=",V);
			if ( !block ) // enumerate all partitions
				for (var max=1; max<nmax; max++)
					partition([], 0, isop);

			else {	// randomly sample partitions
				for (var max=1; max<nmax; max+=1) 
					partition([], 0, (S,T) => {
						var nS = S.length, nT = T.length;

						part.push({ 
							M: nS,
							N: nT,
							S: $(nS, (i,s) => s[i] = S[i]) ,
							T: $(nT, (i,t) => t[i] = T[i]) 
						});

						//Trace(">>>gen",nS,nT);
					});	

				//Trace(">>>sample", samples,block,part.length);
				for (var k=0,K=part.length; k<K; k++) {
					var 
						i = rand(K),
						S = part[i].S,
						T = part[i].T;

					isop( S, T );
				}

			}

			return hmin;
		},

/**
Return edges E of a graph whose adjacency matrix is A.
*/
		edges: (A,E,cb) => {
			var 
				A = A._data || A,
				N = A.length;

			if ( cb ) {
				for (var i=0; i<N; i++)
					for (var j=i; j<N; j++)
						if ( A[i][j] ) cb(E,i,j);
			}

			else {
				for (var i=0; i<N; i++)
					for (var j=i; j<N; j++)
						if ( A[i][j] ) E.push( [i,j] );
			}

			return E;
		},

/**
Clone a graph given its adjacency matrix A.
*/
		clone: A => {
			var 
				A = A._data || A,
				N = A.length;

			return $( [N,N], (i,j,B) => B[i][j] = A[i][j] );
		},

/**
Return graph G (nodes V, edges E, adjacency matrix A) given its adjacency matrix A.
*/
		graph: A => { 
			return {V: $.nodes(A), E: $.edges(A,[]), A:$.clone(A)};
		},

/**
Return graph composition of two graphs with adjacency matricies A and B.
*/
		union: (A,B) => {
			var 
				A = A._data || A,
				B = B._data || B,
				N = A.length;

			return A.$$( (i,j) => A[i][j] = A[i][j] || B[i][j] );
		},

/**
Return an unconnected empty graph having N nodes.
*/
		empty: N => $([N,N], (i,j,X) => X[i][j] = 0 ),

/**
Callback cb with random n-node, d[i]-regular graphs given the 
desired number of random permutations m[i].
*/
		ranregs: (n,d,m,cb) => {
			var 
				Asum = $.empty(n),
				sum = 0;

			d.$( i => {
				for ( var k=0, M=m[i]; k<M; k++) {
					var A = $.ranreg(n,d[i]);

					if ( cb ) cb( A );

					$.union(Asum, A);
				}
				sum += d[i];
			});

			return (sum>=3) ? Asum : null;	// remember 1+1 != 2
		},

		// packing

/**
MxN random matrix
*/
		rand: (M,N) => $( [M,N], (m,n,R) => R[m][n] = 1 - 2*Math.random() ),

/**
KxK random rotation matrix
*/
		// MxN random matrix
		randRot: K => $.orthoNorm( $.rand(K,K) ),

		// utility

/**
*/
		toMatrix: x => $.matrix(x),
		/* {
			var 
				X = x._data || x,
				N = X.length,
				X0 = N ? X[0] : [],
				M = X0.length;

			return $.matrix( $( [N,M], (i,j,A) => A[i][j]=x[i][j] ) );
		}, */

/**
*/
		toList: A => A._data || A,

		/*
		toMatrix: list => $.matrix(list),		// native JS list -> mathJS matrix

		toList: mat => {		// mathJS matrix -> native JS list
			if (mat)
				return mat._data || mat;

			else
				return mat;
		},  */

/**
*/
		isDefined: x => x ? true : false,

/**
Return number of items.
*/
		len: x => (x._data || x).length,

/**
*/
		scripts: {	// default scripts
			/**
			*/
			conf: `
sigma = sqrt(x0*(1-x0)./N); 
u = e./sqrt(2)./sigma;
alpha = erf(u);
`, 
			
			/**
			*/
			pca: `
A = inv(sigma);
eigen = evd( A, true ); 
lambda = eigen.values;
key = {B: matrix( diag(sqrt(lambda)) * eigen.vectors )}; 
key.b = -key.B * mu; 
SNR = sqrt( (mu' * mu) / sum(diag(sigma)) );
CN = max(lambda) / min(lambda);
`,

			/**
			*/
			roc: `
hitRate = hits/maxHits; 
colRate = cols/maxCols; 
`,
			/**
			*/
			snr: `
SNR = mean(SNRs); 
SNRsnr = SNR/std(SNRs);
`,
			/**
			*/
			p0:	"p0 = nsigma ? exp(-1/2*nsigma) / ( (2*pi)^dim * sqrt( det( sigma ) )) : 0; ",

			/**
			*/
			trigger: model => `
N0 = fix( (N+1)/2 );
fs = (N-1)/T;
df = fs/N;
nu = rng(-fs/2, fs/2, N); 
t = rng(-T/2, T/2, N); 
V = evpsd(evs, nu, T, "index", "t");  

Lrate = V.rate / alpha;
Accf = Lrate * ${model}(t/Tc);
Lccf = Accf[N0]^2 + abs(Accf).^2;
Lpsd =  wkpsd( Lccf, T);
disp({ 
evRates: {ref: refLambda, ev: V.rate, L0: Lpsd[N0]}, 
idx0lag: N0, 
obsTime: T, 
sqPower: {N0: N0, ccf: Lccf[N0], psd: sum(Lpsd)*df }
});

Upsd = Lrate + Lpsd;
modH = sqrt(V.psd ./ Upsd );  

argH = pwrec( modH, [] ); 
h = re(dft( modH .* exp(i*argH),T)); 
x = t/T; 
`,

			/**
			*/
			pw: `
nu = rng(-fs/2, fs/2, N); 
argH = dht( log( modH ) ) + pwrem(nu, z); 
`,

			/**
			*/
			wk: `
N0 = fix( (N+1)/2 );
fs = (N-1)/T;
f0 = fs/2;
df = fs/N;
psd = abs(dft( ccf )); psd = psd * ccf[N0] / sum(psd) / df; 
`
		},

		// regressors

/**
Train a cls classifier using the specified regression use-method given 
the feature vectors x and optional (when supervised) labels y, and 
regression solve options.  

The y labels (<0 indicates unlabelled) are used by supervised regressors
(like OLS, logit, etc) to estimate their fitting parameters, as well as by
unsupervised regressors (like qda, som, etc) to remap their unordered solutions
into a consistant order (by computing a confusion matrix against the supplied and 
the predicted labels).

@param {String} use regression method
@param {Array} x sampled feature vectors
@param {Array} y labels of samples vectors (or null)
@param {Object} solve regression options
@param {Function} cb callback(cls) 
*/

		ols: (x,y,solve,cb) => {
			$.train('ols', x, y, solve, cb);
		},

/**
*/
		train: (use,x,y,solve,cb) => {
			//Trace(">>>>>train solve", solve);

			if ( x )
				$( `cls = ${use}_train( x, y, solve )`,  {  // train specified regressor
						x: x || null,
						y: y || null,
						solve: solve
					}, ctx => {

					if ( ctx )
						if ( cls = ctx.cls )	// training worked
							if ( samples = solve.samples )	// predict y at sampled x 
								$( `y0 = ${use}_predict(cls, x0, solve)`, {	// predict y0 given x0
									solve: solve,
									x0: x.draw(samples).sort(),
										/*solve.multivar 
											? x.draw(samples).sort()
											: $.rng( $.min(x), $.max(x), samples ), */
									y: y,
									x: x,
									cls: cls
								}, ctx => {

									const {x0,y0,y,cls} = ctx;	// extract sampled vectors and labels
									const {nsigma,em} = cls;	// extract class sim and roc point
									const {mixes} = solve;		// extract #classes (mix solutions)

									//Trace(">>>>>roc prep", nsigma,mixes,x0.length,y0.length);

									/*
									Could add logic here to deal with non-qda clustering
									methods (like som, random forest, decision tree, k-means).  
									These methods typically act like regressors
									that simply predict 1 y label for every x.  In particular, in lieu
									of a covariance matrix necessary of a PCA and ROC, these methods
									provide their own specialized metric (which, in principle, would
									have to be regressed with the actual PCA ROC to find its ROC).
									Short of this ROC regression, one may be forced to resort to a 
									confusion matrix to predict the predicted-true label map. 
									This logic is related to the dimension reduction problem, PCR etc.
									*/
									if ( em && nsigma && mixes ) {	// boost only unsup mixing regressors
										var
											rocScript = solve.roc || $.scripts.roc,
											N = x0.length; // #sampled feature vectors

										// generate roc

										cls.N = N;
										cls.cols = 0;
										cls.hits = 0;
										cls.nsigma = nsigma;

										y0.$( n => {	// count hits and collisions
											if ( K = y0[n].length ) {
												cls.hits++;
												cls.cols += K-1;
											}
										});

										cls.maxHits = N;
										cls.maxCols = N * mixes;

										$(rocScript, cls);
										Trace(">>>train roc", mixes, rocScript, N, nsigma, cls);

										if (false)
										if ( y ) { // generate confusion matrix to remap EM solutions
											var 
												isBad = false,
												confuse = cls.confuse = { // reserve confusion matrix
													matrix: $( [mixes,mixes], (i,j,C) => C[i][j]=0 ),
													counts: $( mixes, (i,N) => N[i]=0 ),
													map: $( mixes, (i,M) => M[i]=0 ),
													test: $( mixes, (i,T) => T[i] = 0 )
												};

											const 
												{matrix,counts,map,test} = confuse;

											y.$( n => {	// scan true labels
												if ( matrix[ i=y[n] ] )	// valid defined label (i=-1 if undefined)
													y0[n].$( (k,y0) => matrix[i][ j=y0[k] ]++ );	// scan predicted labels
											});

											matrix.$( i => {	// normalize the rows
												var sum = 0;
												matrix.$( j => sum += matrix[i][j] );
												matrix.$( j => matrix[i][j] /= sum );
												counts[i] = sum;
												//Trace("conf norm", N,sum);
											});

											matrix.$( i => {	// find j=>i map
												var 
													max = -Infinity;

												matrix.$( j => { 
													if ( matrix[i][j] > max ) {
														max = matrix[i][j];
														map[i] = j;	
														test[ map[i] ] += 1;
													}
												});

												test.$( i => {
													if ( test[i] != 1 ) isBad = true;
												});
											});

											confuse.isBad = isBad;

											if ( !isBad )	// remap EM solutions
												cls.em = $( mixes, (k,EM) => EM[k] = em[ map[k] ] );

											Trace("trained", cls,cls.confuse );
										}

										/*
											// legacy for ref
											var
												X = x._data,
												N = X.length,
												mles = cls,
												mixes = mles.length,
												MVN = $.MVN,
												P = $(mixes),
												P0 = 0.75,
												Y = $(N, (n,y) => {
													var x = X[n];
													P.$( k => P[k] = {idx: k, val: MVN( x, mles[k].mu, mles[k].sigma )} );
													P.$( k => P[k] += k ? P[k-1] : 0 );
													P.$( k => { if (P[k]<P0) y[n] = k; } );
													//y[n] = P.sort( (a,b) => b.val - a.val )[0];
												});
											*/

										cb(ctx);
									}

									else
										cb(ctx);
								});

							else
								cb( ctx );

						else
							cb( null );

					else
						cb( null );
				});

			else
				cb( null );
		},

/**
Return predicted labels y given a list x of feature vectors. 

@param {Object} cls classifier hash
@param {String} use regression method
@param {Array} x sampled feature vectors
@param {Array} y labels of samples vectors (or null)
@param {Object} solve regression options
@param {Function} cb callback(ctx) 
*/	

		predict: (use,x,y,solve,cb) => {
			var
				loaders = {
					svm: $.SVM.load, //$.SVM.restore,
					lrm: $.LRM.load,
					knn: $.KNN.load,
					pls: $.PLS.load,
					som: $.SOM.load,
					nab: $.NAB.load,
					raf: model => model,
					dtr: model => model,
					lda: model => model,
					qda: model => model,
					qda: model => model,
					ols: ctx.ols_degree ? $.SPR.load : $.MLR.load,
					beta: $.MLR.load
				},
				loader = loaders[use],
				model = solve.model,
				cls = (loader && model) ? loader( model ) : null;

			if ( cls )
				$( `y0 = ${use}_predict(cls, x0, solve)`, {
					solve: solve,
					x0: x, 
					cls: cls
				}, ctx => cb(ctx) );

			else
				cb(null);
		},

		// quadratic discriminant analysis

/**
*/
		qda_train: (x,y,solve) => {  

			const {mixes, nsigma, SNRmax, CNmax} = solve;

			var 
				pcaScript = solve.pca || $.scripts.pca,
				X = x._data || x,
				N = X.length;

			if (N) { // convert em groups into objects
				var
					cls = { em: $.EM( X, mixes ), nsigma: nsigma },
					em = cls.em;

				Trace("qda train", {
					pca: pcaScript, 
					mixes: mixes,
					nsigma: nsigma,
					colinear: [SNRmax, CNmax]
				});		

				em.forEach( (mix,k) => em[k] = Copy(mix,{}) ); 

				em.forEach( mix => { 	// compute pca keys
					Trace("pca mix", mix);
					$( pcaScript, mix );
					//Trace( "qda snr=", mix.SNR);
					mix.SNRok = SNRmax ? mix.SNR < SNRmax : true;
					mix.CNok = CNmax ? mix.CN < CNmax : true;	
				});

				return cls;
				/*
				(x-mu) * sigma^(-1) * (x-mu) = 1 is equation for an ellipsoid, the eigenvectors of sigma (the covar matrix) corresponding to its principle axes, and eigenvalues
				corresponding to the squared reciprocals of its semi-axes, i.e. x^2 / a^2 + y^2 / b^2 + z^2 / c^2 = 1 where lambda = [a^-2, b^-2, c^-2].
				*/
			}

			else
				return null;
		},

/**
*/
		qda_predict: (cls, x, solve) => {
			const {mixes,nsigma} = solve;	// extract em solutions at given roc point
			const {em} = cls;

			var
				p0Script = solve.p0 || $.scripts.p0,
				snrScript = solve.snr || $.scripts.snr,
				X = x._data || x,	// feature vectors
				N = X.length, // #vectors
				X0 = X[0] || [], // ref vector
				D = X0.length, // vector dim			
				Y = $(N, (n,Y) => Y[n] = [] );	// predicted labels

			Trace("qda predict", {
				mixes: mixes,
				vectors: N,
				dim: D, 
				solve: solve, 
				nsigma: nsigma,
				p0: p0Script,
				snr: snrScript
			});

			em.forEach( (mix,k) => {  // pca each em mix to make Y predictions
				const {key} = mix;
				const {B,b} = key;

				X.$( (n,X) => {		// pca to map x ~ NRV(mu,sigma) => y ~ NRV(0,1) 
					const { r } = $( "y = B*x + b; r = sqrt( y' * y ); ", {B: B, b: b, x: X[n]} );
					if ( r < nsigma ) Y[n].push( k );		// append label
				});	
			});

			cls.SNRs = $(mixes);		// reserve 
			cls.p0 = $(mixes);			// reserve 

			em.forEach( (mix,k) => {  // compute mix stats
				const {sigma,mu,key,SNR} = mix;			// extract em covar, mean, (B,b) key, SNR
				const {p0} = $( p0Script , {
					dim: D, sigma: sigma, nsigma: nsigma
				});

				cls.p0[k] = p0;
				cls.SNRs[k] = SNR;
				//Trace(k,SNR,p0);
			});

			$(snrScript, cls);

			return Y;
		},

		// cummulative-beta fit regressor

/**
*/
		beta_train: (x,y,solve) => {
			const { log } = Math;

			var 
				x = x._data || x,
				y = y._data || y,
				N = x.length,
				exact = solve.exact;

			//Trace("beta",solve,exact);
			if ( !exact ) {	// approx kumarswary fit
				var
					alpha = 0.5,
					logy = $(N, (k,logy) => logy[k] = log(1-y[k][0]) ),
					logx = $(N, (k,logx) => logx[k] = log(1-x[k]**alpha) ),
					regy = [],
					regx = [];

				for ( var k =0; k<N; k++ ) 
					if ( logy[k] != -Infinity ) {
						regy.push( [ logy[k] ] );
						regx.push( [ logx[k] ] );
					}

				Trace({
					x: x,
					y: y,
					logx: logx,
					logy: logy,
					regx: regx,
					regy: regy
				});

				var
					cls = new MLR( regx, regy ),
					a = cls.a = alpha,
					b = cls.b = cls.weights[0][0] + 1;

				Trace("weights=", cls);
			}

			else {	// strict beta fit
				var
					z = $(N, (k,z) => z[k] = { x:x[k], y:y[k][0], n:y[k][1] } ).sort( (a,b) => a.n-b.n ),
					M = N-1, 
					dydx = $(M, (m,d) => d[m] = (y[m+1][0]-y[m][0]) / (x[m+1]-x[m]) ),
					logy = $(M, (m,logy) => logy[m] = [ log( dydx[m] ) ] ),
					logx = $(M, (m,logx) => logx[m] = [ log(x[m]), log(1-x[m]) ] ),
					regy = [],
					regx = [];

				for ( var m =0; m<M; m++ ) 
					if ( logx[m][1] && dydx[m]>0 ) {
						regy.push( logy[m] );
						regx.push( logx[m] );
					}

				Trace({
					x: x,
					y: y,
					z: z,
					M: M,
					dydx: dydx,
					logx: logx,
					logy: logy,
					regx: regx,
					regy: regy
				});

				var
					cls = new MLR( regx, regy ),
					alpha = cls.alpha = cls.weights[0][0] + 1,
					beta = cls.beta = cls.weights[1][0] + 1;

				Trace(cls, {
					b0: cls.weights[2][0],
					b0calc: $.loggamma(alpha) + $.loggamma(beta) - $.loggamma(alpha+beta)
				});
			}

			return cls;
		},

/**
*/
		beta_predict: (cls,x,solve) => {
			return [];
		},

		// recurrent neural network

/**
*/
		rnn_train: (x,y,solve) => {
		},

/**
*/
		rnn_predict: (cls,x,solve) => {
		},

		// attractor neural network

/**
*/
		ann_train: (x,y,solve) => {
		},

/**
*/
		ann_predict: (cls,x,solve) => {
		},

		// deep convolutional neural network

/**
*/
		dnn_train: (x,y,solve) => {
		},

/**
*/
		dnn_predict: (cls,x,solve) => {
		},

		// reserved

/**
*/
		dhs_train: (x,y,solve) => {
		},

/**
*/
		dhs_predict: (cls,x,solve) => {
		},

		// linear discriminant analysis (under repair - use qda)

/**
*/
		lda_train: (x,y,solve) => { 

			var 
				mixes = solve.mixes || 5,
				x = solve.x || "x",
				y = solve.y || "y",
				z = solve.z || "z",			
				evs = [];

			x.forEach( ev => evs.push( [ev[x],ev[y],ev[z]] )  );

			return $.EM( evs, mixes );
		},

/**
*/
		lda_predict: (cls, x, solve) => {
			var
				X = x._data || x,
				N = X.length || x,
				mles = cls,
				mixes = mles.length,
				MVN = $.MVN,
				P = $(mixes),
				sigma = mles[0].sigma,
				Y = $(N, (n,y) => {
					var x = X[n];
					P.$( k => P[k] = {idx: k, val: MVN( x, mles[k].mu, sigma )} );
					y[n] = P.sort( (a,b) => b.val - a.val );
				});

			return Y;
		},

		// robust polynomial regression

/**
*/
		ror_train: (x,y,solve) => {
			var
				X = x._data || x,
				Y = y._data || y,
				cls = new $.ROR( X, Y, solve.degree || 1 );

			return cls;
		},

/**
*/
		ror_predict: (cls, x, solve) => {
			var
				X = x._data || x,
				Y = cls.predict(X);

			return Y;
		},

		// decision tree

/**
*/
		dtr_train: (x,y,solve) => {
			var
				X = x._data || x,
				Y = y._data || y,
				cls = new $.DTR( Copy( solve, {
					gainFunction: 'gini',
					maxDepth: 10,
					minNumSamples: 3
				}) );

			cls.train(X,Y);
			Trace("dec tree", cls);
			return cls;
		},

/**
*/
		dtr_predict: (cls, x, solve) => {
			var
				X = x._data || x,
				Y = cls.predict(X);

			return Y;
		},

		// random forest

/**
*/
		raf_train: (x,y,solve) => {

			var
				X = x._data || x,
				Y = y._data || y,
				N = x.length, // x._size[0],
				cls = new RAF( Copy(solve, {
					seed: 3,
					maxFeatures: 2,
					replacement: false,
					nEstimators: 200
				}));

			Trace("raf training", {
				dims: [X.length, Y.length], 
				features: N
			});

			cls.train(X,Y);
			return cls;
		},

/**
*/
		raf_predict: (cls, x, solve) => {
			var
				X = x._data || x,
				Y = cls.predict(X);

			return Y;
		},

		// naive bayes

/**
*/
		nab_train: (x,y,solve) => {
			var
				X = x._data || x,
				Y = y._data || y,
				cls = new NAB( );

			cls.train(X,Y);
			return cls;
		},

/**
*/
		nab_predict: (cls, x, solve) => {
			var
				X = x._data || x,
				Y = cls.predict(X);

			return Y;
		},

		// self organizing maps

/**
*/
		som_train: (x,y,solve) => {
			var
				X = x._data || x,
				solve = Copy( solve, {dims: {}} ),
				cls = new SOM( solve.dims.x || 20, solve.dims.y || 20, Copy( solve, {
					fields: [ {name: "r", range: [0,255]}, {name: "g", range: [0,255]}, {name: "b", range: [0,255]} ]
				}) );

			cls.train(X);
			return cls;
		},

/**
*/
		som_predict: (cls, x, solve) => {
			var
				X = x._data || x,
				Y = cls.predict(X);

			return Y;
		},

		// ordinary least squares single/multiple variates linear/polynomial

/**
*/
		ols_train: (x,y,solve) => {
			const {degree,multivar} = solve;

			var
				X = x._data || x,
				Y = y._data || y,
				N = x.length, //x._size[0],
				X = multivar ? X : $(N, (n,x) => x[n] = [ X[n] ] ),
				Y = multivar ? Y : $(N, (n,y) => y[n] = [ Y[n] ] );

			var
				cls = degree ? new SPR(X,Y,degree) : new MLR(X,Y);

			return cls;
		},

/**
*/
		ols_predict: (cls, x, solve) => {
			const {multivar} = solve;

			var
				X = x._data || x,
				N = x.length, 
				X = multivar ? X : $(N, (n,x) => x[n] = [ X[n] ] ),
				Y = cls.predict(X);
	//Trace(">>predict", X,Y);

			return multivar ? Y : Y.$("0"); //Y.get("[0]");		// get ok?
		},

		// support vector machine

/**
*/
		svm_train: (x,y,solve) => {
			/*
			// legacy version
			var
				X = x._data,
				Y = y._data,
				N = x._size[0],
				XY = $( N, (n, xy) => xy[n] = [ X[n], Y[n] ] );

			Trace("XY", XY);
			var
				cls = new SVM.SVM({});

			cls
			.train(XY)
			.spread( (model) => {
				if (cb) cb(model);
			})
			.done ( (rep) => {
				//Trace("testpred", cls.predictSync(X[0]), cls.predictSync(X[1]) );
			} );
			*/

			var 
				X = x._data || x,
				Y = y._data.$( (n,y) => y[n] = y[n][0] ),
				cls = new SVM( Copy( solve, {
					C: 0.01,
					tol: 10e-4,
					maxPasses: 10,
					maxIterations: 10000,
					kernel: 'rbf',
					kernelOptions: {
						sigma: 0.5
					}
				}) );

			cls.train(X,Y);
			return cls;
		},

/**
*/
		svm_predict: (cls, x, solve) => {
			var
				//N = x._size[0],
				X = x._data || x,
				N = X.length,
				Y = cls.predict(X);

				//predict = cls.predictSync,
				//Y = $( N, (n,y) => y[n] = predict( X[n] ) );

			Trace("svm pred", Y);
			//Trace("svm", JSON.stringify(cls));

			//Trace("y",Y);
			return Y;
		},

		// logistic regression

/**
*/
		lrm_train: (x,y,solve) => {

			function categorize(x) {
				var cats = {}, ncats = 1;
				x.$( (n,x) => {
					var x0 = x[n];
					if ( xcat = cats[x0] ) 
						x[n] = xcat;
					else
						x[n] = cats[x0] = ncats++;
				});
				return x;
			}

			var
				X = new ML$(x._data || x),
				//Y = ML$.columnVector( categorize(y._data) );
				Y = ML$.columnVector( y._data || y ),
				cls = new LRM( Copy( solve, {
					numSteps: 1e3,
					learningRate: 5e-3		
				}) );

			Trace("lrm training", {
				steps: cls.numSteps, 
				rate: cls.learningRate
			});

			cls.train(X,Y);
			return cls;
		},

/**
*/
		lrm_predict: (cls,x,solve) => {
			Trace("predict", x);
			var 
				X = new ML$(x._data || x),
				Y = cls.predict(X);

			return Y;
		},

		// nearest neighbor

/**
*/
		knn_train: (x,y,solve) => {
			//Trace({x:x, y:y});
			var
				X = new ML$(x._data || x),
				Y = ML$.columnVector(y._data || y),
				cls = new KNN(X,Y,Copy(solve,{k:3}));

			Trace("knn training", cls);
			return cls;
		},

/**
*/
		knn_predict: (cls,x,solve) => {
			var 
				X = new ML$(x._data || x),
				Y = cls.predict(X);

			return Y;
		},

		// partial least squares

/**
*/
		pls_train: (x,y,solve) => {
			var
				X = new ML$(x._data || x),
				Y = ML$.columnVector(y._data || y),
				cls = new PLS( Copy( solve, {
					latentVectors: 10,
					tolerance: 1e-4				
				}) );

			Trace("pls training", solve);
			cls.train(X,Y);
			return cls;
		},

/**
*/
		pls_predict: (cls,x,solve) => {
			var 
				X = new ML$(x._data || x),
				Y = cls.predict(X);

			return Y;
		},

		// gaussian process recovery

/**
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
*/
		triggerProfile: ( solve, evs, cb) => {  // callback with trigger function
			Trace("trigs", {
				evs: evs.length, 
				refRate: solve.refLambda,
				ev0: solve.evs[0]
			});

			$( $.scripts.trigger(solve.model || "sinc"),  {
					evs: evs,
					N: solve.N,
					refLambda: solve.refLambda,
					alpha: solve.alpha,
					T: solve.T,
					Tc: solve.Tc
				}, ctx => {
					//Trace("vmctx", ctx);
					cb({
						trigger: {
							x: ctx.x,
							h: ctx.h,
							modH: ctx.modH,
							argH: ctx.argH,
							f: ctx.nu
						}
					});
			});
		},

/**
Callback with coherence intervals M, SNR, etc given solve:
	f[k] = observed probability mass at count levels k = 0 ... Kmax-1
	T = observation time
	N = number of events collected
	use = "lma" | "lfa" | "bfs"
	lma = [initial M]
	lfa = [initial M]
	bfs = [start, end, increment M]
*/
		coherenceIntervals: (solve, cb) => { 
			/*
			return log{ p0 } where
				p0(x) = negbin(a,k,x) = (gamma(k+x)/gamma(x))*(1+a/x)**(-x)*(1+x/a)**(-k) 
				a = <k> = average count
				x = script M = coherence intervals
				k = count level
			 */
			function logNB(k,a,x) { // negative binomial objective function
				var
					ax1 =  1 + a/x,
					xa1 = 1 + x/a,

					// nonindexed log Gamma works with optimizers, but slower than indexed versions
					logGx = GAMMA.log(x),
					logGkx = GAMMA.log(k+x), 
					logGk1 = GAMMA.log(k+1);

					// indexed log Gamma produce round-off errors in optimizers 
					// logGx = logGamma[ floor(x) ],
					// logGkx = logGamma[ floor(k + x) ],
					// logGk1 = logGamma[ floor(k + 1) ];

				return logGkx - logGk1 - logGx  - k*log(xa1) - x*log(ax1);
			}

			/*
			1-parameter (x) linear-factor analysis
			k = possibly compressed list of count bins
			init = initial parameter values [a0, x0, ...] of length N
			logf  = possibly compressed list of log count frequencies
			a = Kbar = average count
			x = M = coherence intervals		
			*/
			function LFA(init, f, logp) {  // linear-factor-analysis (via newton raphson) for chi^2 extrema - use at your own risk

				function p1(k,a,x) { 
				/*
				return p0'(x) =
							(1 + x/a)**(-k)*(a/x + 1)**(-x)*(a/(x*(a/x + 1)) - log(a/x + 1)) * gamma[k + x]/gamma[x] 
								- (1 + x/a)**(-k)*(a/x + 1)**(-x)*gamma[k + x]*polygamma(0, x)/gamma[x] 
								+ (1 + x/a)**(-k)*(a/x + 1)**(-x)*gamma[k + x]*polygamma(0, k + x)/gamma[x] 
								- k*(1 + x/a)**(-k)*(a/x + 1)**(-x)*gamma[k + x]/( a*(1 + x/a)*gamma[x] )			

						=	(1 + x/a)**(-k)*(a/x + 1)**(-x)*(a/(x*(a/x + 1)) - log(a/x + 1)) * G[k + x]/G[x] 
								- (1 + x/a)**(-k)*(a/x + 1)**(-x)*PSI(x)*G[k + x]/G[x] 
								+ (1 + x/a)**(-k)*(a/x + 1)**(-x)*PSI(k + x)*G[k + x]/G[x] 
								- k*(1 + x/a)**(-k)*(a/x + 1)**(-x)*G[k + x]/G[x]/( a*(1 + x/a) )			

						=	G[k + x]/G[x] * (1 + a/x)**(-x) * (1 + x/a)**(-k) * {
								(a/(x*(a/x + 1)) - log(a/x + 1)) - PSI(x) + PSI(k + x) - k / ( a*(1 + x/a) ) }

						= p(x) * { (a/x) / (1+a/x) - (k/a) / (1+x/a) - log(1+a/x) + Psi(k+x) - Psi(x)  }

						= p(x) * { (a/x - k/a) / (1+x/a) - log(1+a/x) + Psi(k+x) - Psi(x)  }

					where
						Psi(x) = polyGamma(0,x)
				 */
					var
						ax1 =  1 + a/x,
						xa1 = 1 + x/a,

						// indexed Psi may cause round-off problems in optimizer
						psix = Psi[ floor(x) ], 
						psikx = Psi[ floor(k + x) ], 

						slope = (a/x - k/a)/ax1 - log(ax1) + psikx - psix;

					return exp( logp(k,a,x) ) * slope;  // the slope may go negative so cant return logp1		
				}

				function p2(k,a,x) {  // not used
				/*
				return p0" = 
						(1 + x/a)**(-k)*(a/x + 1)**(-x)*( a**2/(x**3*(a/x + 1)**2) 
							+ (a/(x*(a/x + 1)) - log(a/x + 1))**2 - 2*(a/(x*(a/x + 1)) - log(a/x + 1) )*polygamma(0, x) 
						+ 2*(a/(x*(a/x + 1)) - log(a/x + 1))*polygamma(0, k + x) 
						+ polygamma(0, x)**2 
						- 2*polygamma(0, x)*polygamma(0, k + x) + polygamma(0, k + x)**2 - polygamma(1, x) + polygamma(1, k + x) 
						- 2*k*(a/(x*(a/x + 1)) - log(a/x + 1))/(a*(1 + x/a)) + 2*k*polygamma(0, x)/(a*(1 + x/a)) 
						- 2*k*polygamma(0, k + x)/(a*(1 + x/a)) + k**2/(a**2*(1 + x/a)**2) + k/(a**2*(1 + x/a)**2))*gamma(k + x)/gamma(x);
				 */
					var
						ax1 =  1 + a/x,
						xa1 = 1 + x/a,
						xak = xa1**(-k),
						axx = ax1**(-x),

						// should make these unindexed log versions
						gx = logGamma[ floor(x) ],
						gkx = logGamma[ floor(k + x) ],

						logax1 = log(ax1),
						xax1 = x*ax1,
						axa1 = a*xa1,				

						// should make these Psi 
						pg0x = polygamma(0, x),
						pg0kx = polygamma(0, k + x);

					return xak*axx*(a**2/(x**3*ax1**2) + (a/xax1 - logax1)**2 - 2*(a/xax1 - logax1)*pg0x 
								+ 2*(a/xax1 - logax1)*pg0kx + pg0x**2 
								- 2*pg0x*pg0kx + pg0kx**2 - polygamma(1, x) + polygamma(1, k + x) 
								- 2*k*(a/xax1 - logax1)/axa1 + 2*k*pgx/axa1 - 2*k*pg0kx/axa1 
								+ k**2/(a**2*xa1**2) + k/(a**2*xa1**2))*gkx/gx;
				}

				/*
				return chiSq' (x)
				*/
				function chiSq1(f,a,x) { 
					var 
						sum = 0,
						Kmax = f.length;

					for (var k=1; k<Kmax; k++) sum += ( exp( logp0(a,k,x) ) - f[k] ) * p1(a,k,x);

					//Trace("chiSq1",a,x,Kmax,sum);
					return sum;
				}

				/*
				return chiSq"(x)
				*/
				function chiSq2(f,a,x) {
					var
						sum =0,
						Kmax = f.length;

					for (var k=1; k<Kmax; k++) sum += p1(a,k,x) ** 2;

					//Trace("chiSq2",a,x,Kmax,sum);
					return 2*sum;
				}

				var
					Mmax = 400,
					Kmax = f.length + Mmax,
					eps = $(Kmax, (k,A) => A[k] = 1e-3),
					Zeta = $(Kmax, (k,Z) => 
						Z[k] = k ? ZETA(k+1) : -0.57721566490153286060   // -Z[0] is euler-masheroni constant
					), 
					Psi1 = Zeta.sum(),
					Psi = $(Kmax, (x,P) =>   // recurrence to build the diGamma Psi
						P[x] = x ? P[x-1] + 1/x : Psi1 
					);

				return NRAP( x => chiSq1(f, Kbar, x), x => chiSq2(f, Kbar, x), init[0]);  // 1-parameter newton-raphson
			}

			/*
			levenberg-marquart algorithm for chi^2 extrema
			N-parameter (a,x,...) levenberg-marquadt algorithm where
			k = count levels
			init = initial parameter values [a0, x0, ...] of length N
			logf  = possibly compressed list of log count frequencies
			a = Kbar = average count
			x = M = coherence intervals
			*/
			function LMA(init, k, logf, logp) { 			

				switch ( init.length ) {
					case 1:
						return LM({  // 1-parm (x) levenberg-marquadt
							x: k,  
							y: logf
						}, function ([x]) {
							//Trace(Kbar, x);
							return k => logp(k, Kbar, x);
						}, {
							damping: 0.1, //1.5,
							initialValues: init,
							//gradientDifference: 0.1,
							maxIterations: 1e3,  // >= 1e3 with compression
							errorTolerance: 10e-3  // <= 10e-3 with compression
						});
						break;

					case 2:

						switch ("2stage") {
							case "2parm":  // greedy 2-parm (a,x) approach will often fail when LM attempts an x<0
								return LM({  
									x: k,  
									y: logf  
								}, function ([x,u]) {
									Trace("2stage LM",x,u);
									//return k => logp(k, Kbar, x, u);
									return x ? k => logp(k, Kbar, x, u) : k => -50;
								}, {
									damping: 0.1, //1.5,
									initialValues: init,
									//gradientDifference: 0.1,
									maxIterations: 1e2,
									errorTolerance: 10e-3
								});

							case "2stage":  // break 2-parm (a,x) into 2 stages
								var
									x0 = init[0],
									u0 = init[1],
									fit = LM({  // levenberg-marquadt
										x: k,  
										y: logf
									}, function ([u]) {
										//Trace("u",u);
										return k => logp(k, Kbar, x0, u);
									}, {
										damping: 0.1, //1.5,
										initialValues: [u0],
										//gradientDifference: 0.1,
										maxIterations: 1e3,  // >= 1e3 with compression
										errorTolerance: 10e-3  // <= 10e-3 with compression
									}),
									u0 = fit.parameterValues[0],
									fit = LM({  // levenberg-marquadt
										x: k,  
										y: logf
									}, function ([x]) {
										//Trace("x",x);
										return k => logp(k, Kbar, x, u0);
									}, {
										damping: 0.1, //1.5,
										initialValues: [x0],
										//gradientDifference: 0.1,
										maxIterations: 1e3,  // >= 1e3 with compression
										errorTolerance: 10e-3  // <= 10e-3 with compression
									}),
									x0 = fit.parameterValues[0];

								fit.parameterValues = [x0, u0];
								return fit;	
							}
						break;	
				}
			}

			/*
			brute-force-search for chi^2 extrema f = obs prob
			1-parameter (x) brute force search
			k = possibly compressed list of count bins
			init = initial parameter values [a0, x0, ...] of length N
			logf  = possibly compressed list of log count frequencies
			a = Kbar = average count
			x = M = coherence intervals			
			*/
			function BFS(init, f, logp) {   

				function NegBin(NB, Kbar, M, logp) {
					NB.$( k => NB[k] = exp( logp(k, Kbar, M) ) );
				}

				function chiSquared( f, p, N) {  // f = obs prob, p = ref prob
					var chiSq = 0;
					p.$( k => chiSq += ( p[k] - f[k] )**2 / p[k] );
					return chiSq * N;
				}

				var
					p = $( f.length ),  // reserve ref prob
					M0 = 1,		// initial guess at coherence intervals
					chiSqMin = 1e99;

				for (var M=init[0], Mmax=init[1], Minc=init[2]; M<Mmax; M+=Minc) {  // brute force search
					NegBin(p, Kbar, M, logNB);
					var chiSq = chiSquared( f, p, N);

					Trace(M, chiSq, p.sum() );

					if (chiSq < chiSqMin) {
						M0 = M;
						chiSqMin = chiSq;
					}
				} 
				return M0;
			}

			var
				/*
				logGamma = $(Ktop , function (k, logG) {
					logG[k] = (k<3) ? 0 : GAMMA.log(k);
				}),
				*/
				/*
				Gamma = $(Ktop, function (k,G) {
					G[k] = exp( logGamma[k] );
				}),
				*/
				f = solve.f,		// observed count probabilities
				T = solve.T,	// observation interval
				N = solve.N,  // number of events
				Kmax = f.length,  // max count
				Kbar = 0,  // mean count
				K = [],  // list of count levels
				compress = false; // solve.lfa ? false : true,   // enable pdf compression if not using lfa

			f.$( k => Kbar += k * f[k] );

			f.$( k => {   
				if ( compress ) {  // pointless - let LMA do its magic
					if ( f[k] ) K.push( k );
				}
				else
					K.push(k); 
			});

			var
				M = 0,
				Mdebug = 0,
				logf = $(K.length, (n,logf) => {  // observed log count frequencies
					if ( Mdebug ) { // enables debugging
						logf[n] = logNB(K[n], Kbar, Mdebug);
						//logf[n] += (n%2) ? 0.5 : -0.5;  // add some "noise" for debugging
					}
					else
						logf[n] = f[ K[n] ] ? log( f[ K[n] ] ) : -7;
				});

			Trace({
				Kbar: Kbar, 
				T: T, 
				Kmax: Kmax,
				N: N
				//ci: [compress, interpolate]
			});

			if (false)
				K.$( n => {
					var k = K[n];
					Trace(n, k, logNB(k,Kbar,55), logNB(k,Kbar,65), log( f[k] ), logf[n] );
				});

			if ( Kmax >= 2 ) {
				var M = {}, fits = {};

				if (solve.lma) {  // levenberg-marquadt algorithm for [M, ...]
					fits = LMA( solve.lma, K, logf, logNB);
					M.lma = fits.parameterValues[0];
				}

				if (solve.lfa)   // linear factor analysis for M using newton-raphson search over chi^2. UAYOR !  (compression off, interpolation on)
					M.lfa = LFA( solve.lfa, f, logNB);

				if (solve.bfs)  // brute force search for M
					M.bfs = BFS( solve.bfs, f, logNB);

				var 
					M0 = M[solve.$ || "lma"],
					snr = sqrt( Kbar / ( 1 + Kbar/M0 ) ),
					bias = sqrt( (N-1)/2 ) * exp(GAMMA.log((N-2)/2) - GAMMA.log((N-1)/2)),		// bias of snr estimate
					mu = (N>=4) ? (N-1) / (N-3) - bias**2 : 2.5;		// rel error in snr estimate

				cb({
					events: N,
					est: M,
					fits: fits,
					coherence_intervals: M0,
					mean_count: Kbar,
					mean_intensity: Kbar / T,
					degeneracyParam: Kbar / M0,
					snr: snr,
					complete: 1 - mu/2.5,
					coherence_time: T / M0,
					fit_stats: M
				});
			}

			else
				cb( null );
		},

/**
*/
		arrivalRates: ( solve, cb ) => { // callback with arrival rate function 

			function getpcs(model, Emin, M, Mwin, Mmax, cb) {  // get or gen Principle Components with callback(pcs)

				sqlThread( sql => {
					function genpcs(dim, steps, model, cb) {
						Trace("gen pcs", dim, steps, model); 

						function evd( models, dim, step, cb) {
							models.forEach( function (model) {
								Trace("pcs", model, dim, step);
								for (var M=1; M<dim; M+=step) {
									$( `
		t = rng(-T, T, 2*N-1);
		Tc = T/M;
		xccf = ${model}( t/Tc );
		Xccf = xmatrix( xccf ); 
		R = evd(Xccf); 
		`,  								{
											N: dim,
											M: M,
											T: 50
										}, ctx => {

										if (solve.trace)  { // debugging
											$(`
		disp({
		M: M,
		ccfsym: sum(Xccf-Xccf'),
		det: [det(Xccf), prod(R.values)],
		trace: [trace(Xccf), sum(R.values)]
		})`, ctx);
										}

		/*
		basis: R.vectors' * R.vectors,
		vecres: R.vectors*diag(R.values) - Xccf*R.vectors,
		*/
										cb({  // return PCs
											model: model,
											intervals: M,
											values: ctx.R.values,
											vectors: ctx.R.vectors
										});
									});
								}
							});
						}

						sql.beginBulk();

						evd( [model], Mmax, Mwin*2, pc => {
							var 
								vals = pc.values,
								vecs = pc.vectors,
								N = vals.length, 
								ref = $.max(vals);

							vals.forEach( (val, idx) => {
								var
									save = {
										correlation_model: pc.model,
										coherence_intervals: pc.intervals,
										eigen_value: val / ref,
										eigen_index: idx,
										ref_value: ref,
										max_intervals: dim,
										eigen_vector: JSON.stringify( vecs[idx] )
									};

								//Trace(save);

								sql.query("INSERT INTO openv.pcs SET ? ON DUPLICATE KEY UPDATE ?", [save,save] );
							});
						});

						sql.endBulk();
						cb();	
					}

					function sendpcs( pcs ) {
						var vals = [], vecs = [];

						//Trace("sendpcs", pcs);
						pcs.forEach( function (pc) {
							vals.push( pc.eigen_value );
							vecs.push( JSON.parse( pc.eigen_vector ) );
						});

						cb({
							values: vals,
							vectors: vecs,
							ref: pcs[0].ref_value
						});
					}

					function findpcs( cb ) {
						var M0 = Math.min( M, Mmax-Mwin*2 );

						sql.query(
							"SELECT * FROM openv.pcs WHERE coherence_intervals BETWEEN ? AND ? AND eigen_value / ref_value > ? AND least(?,1) ORDER BY eigen_index", 
							[M0-Mwin, M0+Mwin, Emin, {
								max_intervals: Mmax, 
								correlation_model: model
							}],
							function (err, pcs) {
								if (!err) cb(pcs);
						});
					}

					findpcs( pcs => {
						if (pcs.length) 
							sendpcs( pcs );

						else
						sql.query(
							"SELECT count(ID) as Count FROM openv.pcs WHERE least(?,1)", {
								max_intervals: Mmax, 
								correlation_model: model
							}, 
							function (err, test) {  // see if pc model exists

							//Trace("test", test);
							if ( !test[0].Count )  // pc model does not exist so make it
								genpcs( Mmax, Mwin*2, model, function () {
									findpcs( sendpcs );
								});

							else  // search was too restrictive so no need to remake model
								sendpcs(pcs);
						});							
					});
				});
			}

			// Should add a ctx.Shortcut parms to bypass pcs and use an erfc model for the eigenvalues.

			getpcs( solve.model || "sinc", solve.min||0, solve.M, solve.Mstep/2, solve.Mmax, pcs => {

				//const { sqrt, random, log, exp, cos, sin, PI } = Math;

				/*
				function expdev(mean) {
					return -mean * log(random());
				}  */

				if (pcs) {
					var 
						pcRef = pcs.ref,  // [unitless]
						pcVals = pcs.values,  // [unitless]
						N = pcVals.length,
						T = solve.T,
						dt = T / (N-1),
						egVals = $(N, (n,e) => e[n] = solve.lambdaBar * dt * pcVals[n] * pcRef ),  // [unitless]
						egVecs = pcs.vectors;   // [sqrt Hz]

					if (N) {
						$( `
A=B*V; 
lambda = abs(A).^2 / dt; 
Wbar = {evd: sum(E), prof: sum(lambda)*dt};
evRate = {evd: Wbar.evd/T, prof: Wbar.prof/T};
x = rng(-1/2, 1/2, N); ` , 
							{
								T: T,
								N: N,
								dt: dt,

								E: egVals,

								B: $(N, (n,B) => {
									var
										b = sqrt( $.expdev( egVals[n] ) ),  // [unitless]
										arg = random() * PI;

									Trace(n,arg,b, egVals[n], T, N, solve.lambdaBar );
									B[n] = $.complex( b * cos(arg), b * sin(arg) );  // [unitless]
								}),

								V: egVecs   // [sqrt Hz]
							}, ctx => {
								cb({  // return computed stats
									intensity: {x: ctx.x, i: ctx.lambda},
									//mean_count: ctx.Wbar.evd,
									//mean_intensity: ctx.evRate.evd,
									eigen_ref: pcRef
								});
								Trace({  // debugging
									mean_count: ctx.Wbar,
									mean_intensity: ctx.evRate,
									eigen_ref: pcRef
								});
							});	
					}

					else
						cb({
							error: `coherence intervals ${stats.coherence_intervals} > max pc dim`
						});
				}

				else
					cb({
						error: "no pcs matched"
					});
			});
		},

/**
*/
		estGauss: (solve, evs, cb) => {
			$.coherenceIntervals({
				f: solve.f,		// probability mass at each count level
				T: solve.T,  		// observation time [1/Hz]
				N: solve.Nevs,		// total number of events observed
				use: solve.Use || "lma",  // solution to retain
				lfa: solve.lfa || [50],  // initial guess at coherence intervals
				bfs: solve.bfs || [1,200,5],  // range and step to search cohernece intervals
				lma: solve.lma || [50]	// initial guess at coherence intervals
			}, coints => {
				$.arrivalRates({
					trace: false,   // eigen debug
					T: solve.T,  // observation interval  [1/Hz]
					M: coints.coherence_intervals, // coherence intervals
					lambdaBar: coints.mean_intensity, // event arrival rate [Hz]
					Mstep: 1,  // coherence step size when pc created
					Mmax: solve.Dim || 150,  // max coherence intervals when pc created
					model: solve.Model || "sinc",  // assumed correlation model for underlying CCGP
					min: solve.MinEigen || 0	// min eigen value to use
				}, rates => {

					if (evs)
						$.triggerProfile({
							refLambda: coints.mean_intensity, // ref mean arrival rate (for debugging)
							alpha: solve.Stats_Gain, // assumed detector gain
							N: solve.Dim, 		// samples in profile = max coherence intervals
							model: solve.Model,  	// name correlation model
							Tc: coints.coherence_time,  // coherence time of arrival process
							T: solve.T  		// observation time
						}, evs, trigs => {
							cb({
								coherenceInfo: coints,
								arrivalRates: rates,
								triggerProfile: trigs
							});
						});

					else
						cb({
							coherenceInfo: coints,
							arrivalRates: rates
						});
				});
			});
		},

		// more linear algebra

/**
Returns singular value decomposition of a real matrix A.
*/
		svd: A => {		// singular value decomposition of matrix A
			var svd = new ML.SVD( A._data || A );
			//Trace(svd);
			return svd;
		},

/**
Returns eigen value decomposition of a real matrix A.
*/
		evd: (A,posdef) => {	// eigen decomposition of matrix A
			var 
				// ML's evd will fail(hang) when A is complex.  If complex A needed,
				// will have to break this into re and im evd's.
				evd = new ML.EVD( A._data || A, {assumeSymmetric: posdef ? true : false} );

			if ( posdef )	// threshold to suppress numerical noise
				evd.d.$( (n,d) => d[n] = (d[n]>0) ? d[n] : 0 );

			return {
				values: evd.d, 
				vectors: evd.V
			}; 
		},

/**
Returns range from min to max in N steps.
*/
		rng: (min,max,N) => { 	// generate index range
			var
				del = N ? (max-min) / (N-1) : 1;

			return $( N || max-min, (n,R) => { R[n] = min; min+=del; } );
		},

/**
Returns N x N complex correlation matrix Xccf [unitless] sampled from the given 2N+1, odd
length, complex correlation function xccf [unitless].  Because Xccf is band symmetric, its 
k'th diag at lag k contains xccf(lag k) = xccf[ N+1 + k ] , k = -N:N
*/
		xcorr: xccf => { 	// sampled correlation matrix

			var 
				xccf = xccf._data || xccf,
				N = xccf.length,   	//  eg N = 9 = 2*(5-1) + 1
				N0 = floor( (N+1)/2 ),		// eg N0 = 5
				M0 = floor( (N0-1)/2 ),		// eq M0 = 2 for 5x5 Xccf
				K0 = N0-1,	// 0-based index to 0-lag
				Xccf = $( [N0, N0], (m,n,X) => X[m][n] = 0 );

			//Trace("xcorr",N,N0,M0);

			for (var n = -M0; n<=M0; n++) 
				for (var m = -M0; m<=M0; m++) {
					var k = m - n;
					Xccf[m+M0][n+M0] = xccf[ k+K0 ];
					//Trace(n,m,k);
				}

			//Trace(Xccf);
			return Xccf;
		},

		// transforms

/**
Returns discrete Hilbert transform of an odd length array f
*/
		dht: f => {  //  discrete Hilbert transform
			var 
				f = f._data || f, 
				N = f.length, 
				a = 2/Math.PI, 
				N0 = floor( (N-1)/2 ),   // 0-based index to 0-lag
				isOdd = N0 % 2, isEven = isOdd ? 0 : 1;

			return  $(N, (n,g) => { 
				var n0 = n - N0;
				if ( n0 % 2) // odd n so use even k 
					for (var sum=0,k=isOdd, k0=k-N0; k<N; k+=2,k0+=2) sum += f[k] / (n0 - k0); // Trace( n0, k0, f[k], n0-k0, sum += f[k] / (n0 - k0) );  //

				else  // even n so use odd k
					for (var sum=0,k=isEven, k0=k-N0; k<N; k+=2,k0+=2) sum += f[k] / (n0 - k0); // Trace( n0, k0, f[k], n0-k0, sum += f[k] / (n0 - k0) );

				g[n] = a*sum;
			});
		},

/**
Returns unnormalized dft/idft of an odd length, real or complex array F.
*/
		dft: F => {		// discrete Fouier transform (unwrapped and correctly signed)
			var 
				F = F._data || F,
				N = F.length,
				isReal = isNumber( F[0] ),
				G = isReal 
					? 	$( N-1, (n,G) =>  { // alternate signs to setup dft and truncate array to N-1 = 2^int
							G[n] = (n % 2) ? [-F[n], 0] : [F[n], 0];
						})

					: 	$( N-1, (n,G) =>  { // alternate signs to setup dft and truncate array to N-1 = 2^int
							G[n] = (n % 2) ? [-F[n].re, -F[n].im] : [F[n].re, F[n].im];
						}),

				g = DSP.ifft(G);

			g.$( n => {  // alternate signs to complete dft 
				var gn = g[n];
				g[n] = (n % 2) ? $.complex(-gn[0], -gn[1]) : $.complex(gn[0], gn[1]);
			});

			g.push( $.complex(0,0) );
			return g;
		},

/**
Returns paley-weiner remainder given zeros z in complex UHP at frequencies 
nu = [ -f0, ... +f0 ] [Hz]
*/
		pwrem: (nu, z) => {  // paley-weiner remainder 
			var 
				z = z._data || z,
				N = z.length,
				nu = nu._data || nu,
				ctx = {
					nu: nu,
					rem: $( nu.length, (n,R) => R[n] = 0 )
				};

			for (var n=0; n<N; n++) {
				ctx.z = z[n];
				$.eval("rem = rem + arg( (nu - z) ./ (nu - conj(z)) );", ctx);
			}

			return ctx.rem;
		},

/**
Returns paley-weiner reconstructed trigger H(nu) = |H(nu)| exp( j*argH(nu) ) given its modulous 
and its zeros z=[z1,...] in complex UHP.
*/		
		pwrec: (H, z) => {   //  paley-weiner reconstruction
			var 
				H = H._data || H,
				N = h.length,
				ctx = {
					N: N, 
					modH: H, 
					z: z
				};

			$.eval( $.pw, ctx ); 
			return ctx.argH;
		},

		// power spectrums

/**
Returns weiner-kinchine psd [Hz] at frequencies nu [Hz] = [-f0 ... +f0] of a complex corr func 
ccf [Hz^2] of len N = 2^K + 1 defined overan interval T [1/Hz], where the cutoff f0 is 1/2 the
implied	sampling rate N/T.
*/
		wkpsd: (ccf, T) => {  // weiner-kinchine psd
			var 
				ccf = ccf._data || ccf,
				ctx = {
					N: ccf.length,
					T: T,
					ccf: ccf  // [Hz^2]
				};

			$.eval( $.scripts.wk, ctx);
			return ctx.psd;
		},

/**
Returns power spectral density [Hz] of events at times [t1,t2,...] over interval T [1/Hz] at the
specified frequencies nu [Hz].
*/
		psd: (t,nu,T) => {  // power spectral density
			var
				t = t._data || t,
				K = t.length,
				ctx = {
					T: T,
					K: K,
					dt: T/N,
					s: $.eval("i*2*pi*nu", {nu: nu}),
					Gu: 0
				};

			for (var i=0; i<K; i++) 
				for (var j=0; j<K; j++) {
					ctx.ti = t[i],
					ctx.tj = t[j];

					//if ( abs( ti - tj ) < T/2 ) 
					$.eval("Gu = Gu + exp( s*(ti-tj) )", ctx);
				}

			$.eval("Gu = Gu/T", ctx);
			return ctx.Gu;
		},

/**
Return psd [Hz] at the specified frequencies nu [Hz], and the mean event rate [Hz] given 
events evs = [{tKey: t1,idKey: id}, {tKey: t2, idKey: id}, ... ] over an observation 
interval  T [1/Hz] with event idKey and tKey as provided.
*/
		evpsd: (evs,nu,T,idKey,tKey) => {  // event based PSD

			var
				evs = (evs._data || evs).sort( (a,b) => {
					return ( a[idKey] > b[idKey] ) ? 1 : -1;
				}),
				ctx = {
					T: T,
					nu: nu,
					Gu: 0,
					Ks: []
				},
				Ks = ctx.Ks;

			//Trace("evpsd", idKey, tKey, evs[0]);

			for (var ids=0, N=evs.length, n=0; n<N; ids++) {
				var 
					t = ctx.t = [], 
					ev = evs[n], 
					id = ctx.id = ev[idKey], K = 0;

				while ( ev && ev[idKey] == id ) {
					t.push( ev[tKey] );
					ev = evs[++n];
					K++;
				}
				Trace( id, K );
				Ks.push(K);
				$.eval(" Gu = Gu + psd(t, nu, T) ", ctx);
			}
			ctx.ids = ids;
			Trace("evpsd ids=", ctx.ids);
			return $.eval(" {psd: re(Gu)/ids, rate:  mean(Ks)/T } ", ctx); 
		},

		// deviate generators

/**
Returns uniform random deviate on [0...a]
*/
		udev: (N,a) => {  // uniform
			return $(N, (n,R) => R[n] = a*random() );
		},

/**
Returns exp random deviate with prescribed mean a
*/
		expdev: (N,a) => {  // exponential
			return $.eval( "-a*log( udev(N,1) )" , {a:a, N:N} );
		},

/**
Returns cummulative sum of x.
*/
		cumsum: x => {
			var
				x = x._data || x,
				N = x.length;

			return $(N, (n,X) => X[n] = n ? X[n-1] + x[n] : x[0] );
		},

		// special functions

/**
*/
		conf: (N,e,x0) => {	// returns confidence alpha givens samples N, +/- tolerance e and nominal prob x0
			var 
				{alpha} = $($.scripts.conf, {
					N: N,
					e, e,
					x0: x0
				});
			
			return alpha;
		},
		
/**
*/
		tolAtConf: (N,alpha0,eParms) => {		// returns +/- tolerance e given samples N and target confidence alpha0
			const
				x0 = 0.5,	// assume worst case nominal prob
				[eLen,eMin,eMax] = eParms || [20,0.01,0.3],
				e = $.exp( $.rng( $.log(eMin), $.log(eMax), eLen) );
				
			var
				e0 = eMin;

			$.conf(N,e,x0).$( (i,alpha) => {
				// Trace(i,alpha[i],alpha0,e0);
				if ( alpha[i] <= alpha0 ) e0 = e[i];
			});
			
			return e0;
		},
		
/**
*/
		tolsAtConf: (N,alpha0,eParms) => $( N.length, (i,e0) => e0[i] = $.tolAtConf( N[i], alpha0, eParms ) ),
		
/**
*/
		loggamma: x => GAMMA.log(x),

/**
*/
		beta: (x,a,b) => {
			const { f } = $(`
logB = loggamma(a) + loggamma(b) - loggamma(a+b);
f = exp( (a-1) * log(x) + (b-1) * log(1-x) - logB );  `, {
			a: a,
			b: b,
			x: x
		});
			//Trace("beta=", x,a,b,f);
			return f;
		},

/**
*/
		cumbeta: (x,a,b) => {
			const { F } = $("F = cumsum( beta(x,a,b) ); F = F/F[ len(F) ]; ", {x:x,a:a,b:b});
			return F;
		},

/**
*/
		sinc: x => {
			var x = x._data || x, N = x.length;
			return $( N, (n, sinc) => sinc[n] = x[n] ? sin( PI*x[n] ) / (PI*x[n]) : 1);
		},

/**
*/
		rect: x => {
			var x = x._data || x, N = x.length;
			return $( N, (n, rect) => rect[n] = (abs(x[n])<=0.5) ? 1 : 0);
		},

/**
*/
		tri: x => {
			var x = x._data || x, N = x.length;
			return $( N, (n, tri) => { 
				var u = abs( x[n] );
				tri[n] = (u<=1) ? 1-u : 0;
			});
		},

/**
*/
		negexp: x => {
			var x = x._data || x, N = x.length;
			return $( N, (n, neg) => neg[n] = (x[n] > 0) ? exp(-x[n]) : 0);
		},

/**
*/
		lorenzian: x => {
			var x = x._data || x, N = x.length;
			return $( N, (n, lor) => lor[n] = 2 / (1 + (2*pi*x[n]**2)) );
		},

		/*
		Returns the [t,min] that minimizes eps[n] = ctx[epsKey] as defined by arg( ctx ).
		*/
		/*
		argmin: ( xKey, epsKey, ctx, arg ) => {
			var 
				x = ctx[xKey],
				N = x.length,
				argctx = Copy(ctx, {}),
				eps = $( N , (n,eps) => {
					argctx[xKey] = x[n];
					arg( argctx );
					eps[n] = argctx[epsKey];
				});

			for ( var t=N, min=1e12, n=0; n<N; n++ ) 
				if ( eps[n] < min ) { min = eps[n]; t = n };

			return [t,min];
		},

		argmax: ( xKey, epsKey, ctx, arg ) => {
			var 
				x = ctx[xKey],
				N = x.length,
				argctx = Copy(ctx, {}),
				eps = $( N , (n,eps) => {
					argctx[xKey] = x[n];
					arg( argctx )
					eps[n] = argctx[epsKey];
				});

			for ( var t=N, max=-1e12, n=0; n<N; n++ ) 
				if ( eps[n] > max ) { max = eps[n]; t = n };

			return [t,max];
		},
		*/

		/*
		ind: arg => {		// indicator
			var 
				sum = 0,
				tests = arg._data;

			tests.$( n => sum += tests[n] ? 1 : 0 );
			return sum;
		},
		*/

/**
*/
		zeta: function (a) {},
/**
*/
		infer: function (a) {},
/**
*/
		mle: function (a) {},

/**
*/
		mvn: (N,mu,covar) => {
			var g = MVN( mu, covar );
			return $(N, (n,a) => A[n] = g.sample() );
		},	

/**
*/
		lfa: function (a) {},
/**
*/
		lma: function (a) {},
/**
*/
		rnn: function (a) {},

/**
*/
		json: a => JSON.stringify(a),
/**
*/
		disp: a => Trace(a)
	}		

}, $);

//=========== Extend mathjs emulator

$.import({ // overrides
	eye: $.identity,
}, {	 
	override: true
});

$($.imports);

//$.RAN = require("randpr");

function _logp0(a,k,x) {  // for case 6.x unit testing
	var
		ax1 =  1 + a/x,
		xa1 = 1 + x/a,
		logGx = GAMMA.log(x),
		logGkx = GAMMA.log(k+x), 
		logGk1 = GAMMA.log(k+1),
		//logGx = logGamma[ floor(x) ],
		//logGkx = logGamma[ floor(k + x) ],
		//logGk1 = logGamma[ floor(k + 1) ],
		logp0 = logGkx - logGk1 - logGx  - k*log(xa1) - x*log(ax1);

	Trace(a,k,x, logp0);
	return logp0;
}

//=========== Unit testing

switch ( process.argv[2] ) { //< unit tests
	case "?":
	case "M?":
	case "MHELP":
		Trace("node man.js [M$ || M1 || M2.N || M3 || M4.N || M5 || M6.N]");
		break;

	case "M$":
	case "MDEBUG":
		Debug();
		break;
		
	case "M1":
		$( "disp( dht( [0,1,2,1,0] ) )" );
		break;
		
	case "M2.1":
		$( "disp( dht( [0,0,0,1e99,0,0,0] ) )" );
		break;
		
	case "M2.2":
		$( "disp( dht(dht( [0,0,0,1e99,0,0,0] )) )" );
		break;
		
	case "M2.3":  // sinc(x) = sin(x)/x =>  (1 - cos(x)) / x
		//$( "disp( rng(-pi,pi,21) )" );
		//$( "disp( sinc( rng(-pi,pi,21) ) )" );
		$( "disp( dht( sinc( rng(-pi,pi,21) ) ) )" );
		break;
		
	case "M2.4":  // dht(dht(f)) => -f  tho there is a dt missing somewhere in this argument
		$( "disp( dht( dht( rng(-1,1,51)  ) ) )" );
		//$( "disp( dht( dht( sinc( -pi:(2*pi)/20:pi ) ) ) )" );
		break;

	case "M3":
		$( " disp( pwrec( abs(sinc( rng(-4*pi,4*pi,511)) ) , [] ) )" );
		break;
		
	case "M4.1":
		var 
			evs = [],
			M = 50,
			ctx = {
				N:65, t0: 0.2, evs:  evs
			};
		
		//$(" disp( urand(10,1) )");
		//$(" disp( expdev(5,1) )");
		//$(" disp( psd( udev(100,T), rng(-pi, pi, N) )/T )", {T:T, N:N});
		//$(" disp( cumsum( [1,2,3,4] ) )" );
		//$(" disp( psd( t, nu,T ) )", ctx);

		for (var m=0; m<M; m++) {
			$("lambda0 = 1/t0; t = cumsum(expdev(100, t0)); T = max(t); K0 = lambda0 * T; fs=(N-1)/T; nu = rng(-fs/2, fs/2, N); ", ctx);
			Trace(ctx.K0, ctx.T, ctx.lambda0, ctx.K0/ctx.T)

			var 
				t = ctx.t,
				N = t.length;

			for (var n=0; n<N; n++) evs.push({t: t[n], id:m });
		}
		
		$(' Gu = evpsd(evs, nu, T, "id", "t") ', ctx);
		for (var nu = ctx.nu,	Gu = ctx.Gu, N=ctx.N, n=0; n<N; n++)  Trace(nu[n].toFixed(4), Gu[n].toFixed(4));
					
		break;
		
	case "M4.2":
		var ctx = {};
		$(" N=17; T=1; fs = (N-1)/T; nu = rng(-fs/2,fs/2,N); Gu = wkpsd([0,0,0,0,0,1,2,3,4,3,2,1,0,0,0,0,0], T); df = fs/(N-1); Pu = sum(Gu)*df; Xu = xcorr(Gu); " , ctx); 
		Trace("power check", ctx.Pu);
		// tri(t/t0), fs = 16; t0 = 4/fs -> 0.25; sinc^2(nu*t0) has zero at nu= +/- 4, +/- 8, ....
		
		//$(" N=9; T=1; fs = (N-1)/T; nu = rng(-fs/2,fs/2,N); Gu = wkpsd([0,0,0,1,2,1,0,0,0], T); Xu = xcorr(Gu); " , ctx); 
		// tri(t/t0), fs = 8; t0 = 2/fs = 0.25; sinc^2(nu*t0) has zero at nu= +/- 4, ...

		//Trace(ctx);
		for (var nu = ctx.nu,	Gu = ctx.Gu, n=0; n<ctx.N; n++)  Trace(nu[n].toFixed(4), Gu[n].toFixed(4));
		//Trace(ctx.Xu);
		break;
		
	case "M6.1":  // LMA/LFA convergence
		
		function sinFunction([a, b]) {
		  return (t) => a * Math.sin(b * t);
		}
		
		function quadFunction([a, b]) {
			Trace(a,b);
		  return (t) => a + b * t**2;
		}

		var len = 20;
		var data = {
		  x: new Array(len),
		  y: new Array(len)
		};
		var sampleFunction = quadFunction([2, 4]);
		var sampleFunction2 = quadFunction([2, 4.1]);
		for (var i = 0; i < len; i++) {
		  data.x[i] = i;
		  data.y[i] = (i % 2) ? sampleFunction(i) : sampleFunction(i);
		}
		var options = {
			damping: 0.1,
			maxIterations: 1e2,
			//gradientDifference: 1,
			initialValues: [-3, 16]
		};

		var ans = LM(data, quadFunction, options);
		Trace(ans);	
		break;
		
	case "M6.2":
		var len = 150,x = 75, a = 36;
		
		var logGamma = $(len*2 , (k, logG) =>
			logG[k] = (k<3) ? 0 : GAMMA.log(k)
		);
		
		var p0map = function ([a]) {
			 Trace(a,x);
			return k => _logp0(a,k,x);
		};
		var data = {
		  x: new Array(len),
		  y: new Array(len)
		};
		var sampleFunction = p0map([75]);
		
		for (var i = 0; i < len; i++) {
		  data.x[i] = i;
		  data.y[i] = sampleFunction(i) ;
		}
		var options = {
		  damping: 0.1,
		//gradientDifference: 1,	
			maxIterations: 1e1,
		  initialValues: [120]
		};

		var ans = LM(data, p0map, options);
		Trace(ans);	
		break;	
		
	case "M6.3":
		var len = 150,x = 75, a = 36;
		
		var logGamma = $(len*2 , (k, logG) =>
			logG[k] = (k<3) ? 0 : GAMMA.log(k)
		);
		
		var p0map = function ([a,x]) {
			 Trace(a,x);
			return k => _logp0(a,k,x);
		};
		var data = {
		  x: new Array(len),
		  y: new Array(len)
		};
		var sampleFunction = p0map([36,75]);
		
		for (var i = 0; i < len; i++) {
		  data.x[i] = i;
		  data.y[i] = sampleFunction(i) ;
		}
		var options = {
		  damping: 0.1,
		//gradientDifference: 1,	
			maxIterations: 1e1,
		  initialValues: [15,120]
		};

		var ans = LM(data, p0map, options);
		Trace(ans);	
		break;
		
	case "M7":
		var ctx = {
			x: [[0,-1], [1,0], [1,1], [1,-1], [2,0], [2,1], [2,-1], [3,2], [0,4], [1,3], [1,4], [1,5], [2,3], [2,4], [2,5], [3,4], [1, 10], [1, 12], [2, 10], [2,11], [2, 14], [3, 11]],
			y: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
			x0: [[0, -2], [1, 0.5], [1.5, -1], [1, 2.5], [2, 3.5], [1.5, 4], [1, 10.5], [2.5, 10.5], [2, 11.5]]
		};
		
		$(`
lrm = lrmTrain(x,y,{numSteps:1000,learningRate:5e-3}); 
y0 = lrmPredict( lrm, x0);`, 
		  ctx, ctx => {

		// Trace( JSON.stringify(ctx.lrm) );
			
			Trace({
				x0: ctx.x0,
				y0: ctx.y0
			});
		});
		/*
{ x0: 
   [ [ 0, -2 ],
     [ 1, 0.5 ],
     [ 1.5, -1 ],
     [ 1, 2.5 ],
     [ 2, 3.5 ],
     [ 1.5, 4 ],
     [ 1, 10.5 ],
     [ 2.5, 10.5 ],
     [ 2, 11.5 ] ],
  y0: [ 0, 0, 0, 1, 1, 1, 2, 2, 2 ] }
  */
		break;
		
	case "M8":
		var ctx = {
			x: [[0, 0], [0, 1], [1, 0], [1, 1]],
			y: [0, 1, 1, 0],
			x0:  [[0, 0], [0, 1], [1, 0], [1, 1]],
			save: function (model) {
				var svm = SVM.restore(model);
				
				Trace("restore pred", svm.predictSync( [0,0] ), svm.predictSync( [0,1] ) );				
			}
		};
		
		$(`svmTrain( x, y, {}, save );` ,  ctx, ctx => {

		// Trace( JSON.stringify(ctx.svm) );
			
			Trace({
				x0: ctx.x0,
				y0: ctx.y0
			});
		});
		break;
		
	case "M9":
		
		var
			raf =  [
  [73, 80, 75, 152],
  [93, 88, 93, 185],
  [89, 91, 90, 180],
  [96, 98, 100, 196],
  [73, 66, 70, 142],
  [53, 46, 55, 101],
  [69, 74, 77, 149],
  [47, 56, 60, 115],
  [87, 79, 90, 175],
  [79, 70, 88, 164],
  [69, 70, 73, 141],
  [70, 65, 74, 141],
  [93, 95, 91, 184],
  [79, 80, 73, 152],
  [70, 73, 78, 148],
  [93, 89, 96, 192],
  [78, 75, 68, 147],
  [81, 90, 93, 183],
  [88, 92, 86, 177],
  [78, 83, 77, 159],
  [82, 86, 90, 177],
  [86, 82, 89, 175],
  [78, 83, 85, 175],
  [76, 83, 71, 149],
  [96, 93, 95, 192]
		],
			tests = {
				raf: {
					x: $(raf.length, (n,x) => x[n] = raf[n].slice(0,3) ),
					y: $(raf.length, (n,y) => y[n] = raf[n][3] )
				}
			};
		
		for (var met in tests) {
			var
				test = tests[met],
				ctx = {
					x: test.x,
					y: test.y,
					x0: test.x.slice(0,4)
				};
			
			$( `cls = ${met}Train(x,y,{}); y0 = ${met}Predict( cls, x0 );`, ctx, ctx => {
				Trace(`unittest ${met}`, {x0: ctx.x0, y0: ctx.y0}, ctx.cls);
			});
		}
		break;

	case "B1":
		var 
			net1 = {type:1, states:[0,1], px:[.4,.6], pb_x:{0:[.2,.8],1:[.6,.4]}, pa_x:{0:[.9,.1],1:[.7,.3]}, 
							vars: {a:"x",b:"x",x:""} },
				
			net2={type:2,states:[0,1], pa:[.3,.7], pb:[.4,.6], px_ab:{"0,0":[.6,.4],"0,1":[.2,.8],"1,0":[.9,.1],"1,1":[.5,.5] },
							vars: { x: "a,b", a: "", b: "" } };
		
		var out = [];
		
		[10,100,500,1e3,2e3,3e3,4e3,5e3].forEach( N => {
			var 
				D1 = $(N, (n,D) => D[n] = $.crf(net1) ),
				D2 = $(N, (n,D) => D[n] = $.crf(net2) ),

				S = score = {
					D1onN1: $.BIC(net1,D1),
					D1onN2: $.BIC(net2,D1),
					D2onN2: $.BIC(net2,D2),
					D2onN1: $.BIC(net1,D2)
				};

			Trace(N, true 
				?	{
					D1onN1: S.D1onN1 ,
					D1onN2: S.D1onN2 / S.D1onN1,
					D2onN2: S.D2onN2 ,
					D2onN1: S.D2onN1 / S.D1onN1
				}
				:	S );
			
			out.push([ 
				N, 
				S.D1onN1.toFixed(2) ,
				(S.D1onN2 / S.D1onN1).toFixed(2),
				S.D2onN2.toFixed(2) ,
				(S.D2onN1 / S.D1onN1).toFixed(2)
			]);
		});
		
		Trace(out);
		break;

	case "B2":
		var 
			net1 = {type:1, states:[0,1], px:[.4,.6], pb_x:{0:[.2,.8],1:[.6,.4]}, pa_x:{0:[.9,.1],1:[.7,.3]}, 
							vars: {a:"x",b:"x",x:""} },
				
			N = 1000;
		
		for ( var ref = drop = 0; drop<0.1; drop+=0.002 ) {
			var
				D = $(N, (n,D) => D[n] = $.crf(net1,drop) ),
				S = $.BIC(net1,D);
				
			if ( !ref ) ref = S;
			
			Trace(N, {
				drop: (drop*100).toFixed(2), 
				score: (S/ref).toFixed(2)
			});
		}
			
		break;

	case "B3":
		var 
			net1 = {type:1, states:[0,1], px:[.4,.6], pb_x:{0:[.2,.8],1:[.6,.4]}, pa_x:{0:[.9,.1],1:[.7,.3]}, 
							vars: {a:"x",b:"x",x:""} };
				
		var out = [];
		
		[2e3].forEach( N => {
			var 
				D = $(N, (n,D) => D[n] = $.crf(net1) ),
				A = [],
				B = [];
			
			D.$( (n,D) => {
				var {x,a,b} = D[n];
				switch ( x ) {
					case 0: 
						A.push(a); 
						//B.push(b);
						break;
					case 1:
				}
			});
			
			Trace("a=",A);
			//Trace("b=",B);			
		});
		
		break;		
		
	case "kc":
		const
			NPL = require("nodeplotlib");

		var 
			N = 5000,
			df = $.load("./data/kc_house_data.csv").draw(N),
			{ grade, price, sqft_living15 } = df.$({		// need to fix get?
					grade: "", 
					price: "log10(u)", 
					sqft_living15: ""
			}),
			grades = grade.unique();
						
		//Trace("gs", grades);
		
		$.ols( sqft_living15, price, {samples:10}, async ctx => {
			var
				{ x0, y0 } = ctx,
				traces = [ {x:x0, y:y0, name: "log ols", type: "scatter" } ];
			
			grades.forEach( grade => {
				var
					dg = df.$( f => f.grade == grade ),
					{ price, sqft_living15 } = dg.$({		// need to fix get?
							price: "log10(u)", 
							sqft_living15: ""
					}),
					labels = $( dg.length, (n,lab) => 
							lab[n] = (dg[n].price/dg[n].sqft_living15).toFixed(0)+" $/sf" );
						
				//Trace(grade, cg);
		
				traces.push({
					x: sqft_living15,  
					y: price, 
					mode: "markers", 
					text: labels,
					name: `grade:${grade}`,
					type: "scatter",
					marker : {
						opacity: 1
						//color: grade,
						//showscale: true,
						//colorscale: "Plasma",
						//colorbar: { title: `grade:${grade}` }
					}
				});
			});
			
			NPL.plot(traces);
		});
		
		/*
		layout = go.Layout(
    title='Price vs. Living Room Area',
    xaxis=dict(
        title='Living room area (sq. ft.)'
    ),
    yaxis=dict(
        title='Price ($)'
    ),
    hovermode='closest',
    #showlegend=True 
		*/
		break;

	case "use":

		// Run pretrained Universal Sentence Encoder CNN model on a few docs 
		TFUSE.load().then(model => {
			// Embed an array of sentences.
			const sentences = [
				'Hello.',
				'How are you?'
			];
			model.embed(sentences).then(embeddings => {
				// `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
				// So in this example `embeddings` has the shape [2, 512].
				embeddings.print(true /* verbose */);
			});
		});

		TFUSE.loadTokenizer().then(tokenizer => {
			tokenizer.encode('Hello, how are you?'); // [341, 4125, 8, 140, 31, 19, 54]
		});

		break;

	case "cnn":
		// https://www.tensorflow.org/js/guide/train_models

		var model = tf.sequential({
			 layers: [
				 tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
				 tf.layers.dense({units: 10, activation: 'softmax'}),
			 ]
			});

		model.summary();

		model.compile({
			optimizer: 'sgd',
			loss: 'categoricalCrossentropy',
			metrics: ['accuracy']
		});

		// Generate dummy data.
		var data = tf.randomNormal([100, 784]);
		var labels = tf.randomUniform([100, 10]);

		function onBatchEnd(batch, logs) {
			console.log('Accuracy', logs.acc);
		}

		// Train for 5 epochs with batch size of 32.
		model.fit(data, labels, {
			 epochs: 5,
			 batchSize: 32,
			 callbacks: {onBatchEnd}
		 }).then(info => {
			 console.log('Final accuracy', info.history.acc);
		 });

		// Predict 3 random samples.
		var prediction = model.predict(tf.randomNormal([3, 784]));
		prediction.print();
		break;

	case "simp":

		const solver = new SIMPLEX({
			objective: {
				a: 70,
				b: 210,
				c: 140,
			},
			constraints: [
				{
					namedVector: { a: 1, b: 1, c: 1 },
					constraint: '<=',
					constant: 100,
				},
				{
					namedVector: { a: 5, b: 4, c: 4 },
					constraint: '<=',
					constant: 480,
				},
				{
					namedVector: { a: 40, b: 20, c: 30 },
					constraint: '<=',
					constant: 3200,
				},
			],
			optimizationType: 'max',
		});

		// call the solve method with a method name
		const result = solver.solve({
			methodName: 'simplex',
		});

		// see the solution and meta data
		Trace({
			solution: result.solution,
			isOptimal: result.details.isOptimal,
		});
		break;

	case "ek":	
		Trace( 
			$.MaxFlowMinCut( [[
					//A,B,C,D,E,F,G
						0,3,0,3,0,0,0],[	//A
						0,0,4,0,0,0,0],[	//B
						0,0,0,1,2,0,0],[	//C
						0,0,0,0,2,6,0],[	//D
						0,1,0,0,0,0,1],[	//E
						0,0,0,0,0,0,9],[	//F
						0,0,0,0,0,0,0]], 	//G
					0, 6)
		);
		break;

	case "DP1":
		var
			x = ["C","T","T","A","G","A"],
			y = ["G","T","A","A"],
			s = (a,b) => (a=="?" || b == "?") ? -2 : (a==b) ? 1 : -1 ;

		if ( false )
			["?","A","B"].forEach( a => {
				["?","A","B"].forEach( b => {
					Trace(`>>>s(${a},${b})`, s(a,b) );
				});
			});

		var
			[score,seqs] = $.oga(y,x,s);

		Trace(score,seqs);
}

// UNCLASSIFIED
