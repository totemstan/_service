'use strict';

// MODULES //

var tape = require( 'tape' );
var abs = require( 'math-abs' );
var linspace = require( 'compute-linspace' );
var EPS = require( 'const-eps-float64' );
var zeta = require( './../lib/polynomial_series.js' );


// FIXTURES //

var data = require( './../lib/odd_positive_integers.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof zeta, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function evaluates the Riemann zeta function for odd positive integers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;
	var i;

	s = linspace( 3, 103, 51 );
	expected = data;
	for ( i = 0; i < s.length; i++ ) {
		v = zeta( s[i] );
		delta = abs( v - expected[i] );
		tol = EPS * abs( expected[i] );
		t.ok( delta <= tol, 'within tolerance. s: '+s[i]+'. v: '+v+'. E: '+expected[i]+'. Δ: '+delta+'. Tol: '+tol+'.' );
	}
	t.end();
});
