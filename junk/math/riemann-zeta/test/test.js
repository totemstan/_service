'use strict';

// MODULES //

var tape = require( 'tape' );
var abs = require( 'math-abs' );
var linspace = require( 'compute-linspace' );
var pow = require( 'math-power' );
var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );
var EPS = require( 'const-eps-float64' );
var zeta = require( './../lib' );


// FIXTURES //

var data = require( './fixtures/output.json' ).program_message;
data = JSON.parse( data );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof zeta, 'function', 'main export is a function' );
	t.end();
});

tape( 'if provided `NaN`, the function returns `NaN`', function test( t ) {
	var v = zeta( NaN );
	t.ok( v !== v, 'returns NaN when provided a NaN' );
	t.end();
});

tape( 'the function evaluates the Riemann zeta function', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;
	var i;

	s = data.x;
	expected = data.expected;
	for ( i = 0; i < s.length; i++ ) {
		v = zeta( s[i] );
		delta = abs( v - expected[i] );
		tol = 34 * EPS * abs( expected[i] );
		t.ok( delta <= tol, 'within tolerance. s: '+s[i]+'. v: '+v+'. E: '+expected[i]+'. Δ: '+delta+'. Tol: '+tol+'.' );
	}
	t.end();
});

tape( 'the function evaluates the Riemann zeta function for very small values', function test( t ) {
	var v = zeta( 1e-10 );

	// Checked against Julia:
	t.equal( v, -0.5000000000918938 );

	t.end();
});

tape( 'if evaluated at a pole (`s = 1`), the function returns `NaN`', function test( t ) {
	var v = zeta( 1.0 );
	t.ok( v !== v, 'returns NaN when provided 1' );
	t.end();
});

tape( 'the function returns `1` for all input values greater or equal than `56`', function test( t ) {
	var s;
	var v;
	var i;

	s = linspace( 56, 100, 200 );
	for ( i = 0; i < s.length; i++ ) {
		v = zeta( s[ i ] );
		t.equal( v, 1, 'returns 1 when provided '+s[i] );
	}
	v = zeta( PINF );
	t.equal( v, 1, 'returns 1 when provided +infinity' );

	t.end();
});

tape( 'the function returns `0` for all even negative integers', function test( t ) {
	var s;
	var v;
	var i;

	s = linspace( -2, -200, 100 );
	for ( i = 0; i < s.length; i++ ) {
		v = zeta( s[ i ] );
		t.equal( v, 0.0, 'returns 0 when provided '+s[i] );
	}
	s = -pow( 2, 32 ); // |s| is greater than MAX_INT32
	v = zeta( s );
	t.equal( v, 0.0, 'returns 0 when provided '+s );
	t.end();
});

tape( 'the function handles negative values which are larger in magnitude than the maximum factorial', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// Wolfram: zeta( -170.7 )
	expected = 4.236821692180446371109004075383326908604561232133963e171;

	s = -170.7;
	v = zeta( s );
	delta = abs( v - expected );
	tol = 53 * EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );

	// Wolfram: zeta( -171.1 )
	expected = 1.762429756041972327545919944532107376580768035147432e172;

	s = -171.1;
	v = zeta( s );
	delta = abs( v - expected );

	// Note: FF seems to return less precise results (https://travis-ci.org/math-io/riemann-zeta/jobs/115748766). For Node/Chrome, 286*eps.
	tol = 355 * EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );

	t.end();
});

tape( 'the function handles negative integer values which are larger in magnitude than twice the index of the maximum Bernoulli number', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// Only value satisfies this criterion without overflowing: -259. (|-257|+1)/2| = 128, which is the index of the largest Bernoulli number. -261 overflows.

	// Wolfram: zeta( -259 )
	expected = 8.760156344622921514904073013488223219302793651253880e306;

	s = -259;
	v = zeta( s );
	delta = abs( v - expected );
	tol = 352 * EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );

	t.end();
});

tape( 'the function returns `+-infinity` for large negative non-integer values', function test( t ) {
	var s;
	var v;
	var i;

	s = linspace( -259.78778778778684, -10000.123, 103 );
	for ( i = 0; i < s.length; i++ ) {
		v = zeta( s[ i ] );
		t.ok( v === PINF || v === NINF, 'returns '+v+' when provided '+s[i] );
	}
	t.end();
});

tape( 'if provided `0` (special value), the function returns `-0.5`', function test( t ) {
	var v = zeta( 0 );
	t.equal( v, -0.5, 'returns -0.5' );
	t.end();
});

tape( 'if provided `-1` (special value), the function returns `-1/12`', function test( t ) {
	var v = zeta( -1 );
	t.equal( v, -1/12, 'returns -1/12' );
	t.end();
});

tape( 'if provided `-13` (special value), the function returns `-1/12`', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	expected = -1/12;

	s = -13;
	v = zeta( s );
	delta = abs( v - expected );
	tol = EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );
	t.end();
});

tape( 'if provided `4` (special value), the function returns `~1.0823`', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// https://oeis.org/A0013662
	expected = 1.082323233711138191516003696541167;

	s = 4;
	v = zeta( s );
	delta = abs( v - expected );
	tol = EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );
	t.end();
});

tape( 'if provided `3` (special value), the function returns `~1.202`', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// https://oeis.org/A002117
	expected = 1.2020569031595942853997;

	s = 3;
	v = zeta( s );
	delta = abs( v - expected );
	tol = EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );
	t.end();
});

tape( 'if provided `2` (special value), the function returns `~1.645`', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// https://oeis.org/A013661
	expected = 1.6449340668482264364724151666460251892189499012067984377355582293700074704032;

	s = 2;
	v = zeta( s );
	delta = abs( v - expected );
	tol = EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );
	t.end();
});

tape( 'if provided `3/2` (special value), the function returns `~2.612`', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// https://oeis.org/A078434
	expected = 2.61237534868548834334856756792407163057080065240006340757332824881492776768827286099624386812631195238297;

	s = 3/2;
	v = zeta( s );
	delta = abs( v - expected );
	tol = EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );
	t.end();
});

tape( 'if provided `1/2` (special value), the function returns `~-1.46`', function test( t ) {
	var expected;
	var delta;
	var tol;
	var s;
	var v;

	// https://oeis.org/A059750
	expected = -1.4603545088095868128894991525152980124672293310125814905428860878;

	s = 1/2;
	v = zeta( s );
	delta = abs( v - expected );
	tol = EPS * abs( expected );

	t.ok( delta <= tol, 'within tolerance. s: '+s+'. v: '+v+'. E: '+expected+' Δ: '+delta+'. tol: '+tol );
	t.end();
});
