'use strict';

/**
* NOTE: the original C++ code and copyright notice is from the [Boost library]{@link http://www.boost.org/doc/libs/1_60_0/boost/math/special_functions/zeta.hpp}.
*
* The implementation has been modified for JavaScript.
*/

/**
* (C) Copyright John Maddock 2006.
* Use, modification and distribution are subject to the
* Boost Software License, Version 1.0. (See accompanying file
* LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
*/

// NOTES

/**
* zeta( s )
*
* Method:
*   1. First, we use the reflection formula
*
*        zeta(1-s) = 2*sin(π(1-s)/2)(2π**-s)Γ(s)ζ(s)
*
*      to make `s` positive.
*
*   2. For `s` on the interval `(0,1)`, we use the approximation
*
*        zeta(s) = (C + R(1-s) - s) / (1-s)
*
*      with rational approximation `R(1-z)` and constant `C`.
*
*   3. For `s` on the interval `(1,4)`, we use the approximation
*
*        zeta(s) = C + R(s-n) + 1/(s-1)
*
*      with rational approximation `R(z-n)`, constant `C`, and integer `n`.
*
*   4. For `s > 4`, we use the approximation
*
*        zeta(s) = 1 + exp(R(z-n))
*
*      with rational approximation `R(z-n)` and integer `n`.
*
*   5. For negative odd integers, we use the closed form
*
*        zeta(-n) = ((-1)**n / (n+1)) B_{n+1}
*
*      where `B_{n+1}` is a Bernoulli number.
*
*   6. For negative even integers, we use the closed form
*
*        zeta(-2n) = 0
*
*   7. For nonnegative even integers, we could use the closed form
*
*        zeta(2n) = (((-1)**(n-1) * 2**(2n-1) * π**(2n)) / (2n)!) * B_{2n}
*
*      where `B_2n` is a Bernoulli number. However, to speed computation, we use precomputed values (Wolfram Alpha).
*
*   8. For positive negative integers, we use precomputed values (Wolfram Alpha), as these values are useful for certain infinite series calculations.
*
*   Notes:
*      [~1.5e-8, 1)
*         - max deviation: 2.020e-18
*         - expected error: -2.020e-18
*         - max error found @double: 3.994987e-17
*      [1,2]
*         - max deviation: 9.007e-20
*         - expected error: 9.007e-20
*      (2,4]
*         - max deviation: 5.946e-22
*         - expected error: -5.946e-22
*      (4,7]
*         - max deviation: 2.955e-17
*         - expected error: 2.955e-17
*         - max error found @double: 2.009135e-16
*      (7,15)
*         - max deviation: 7.117e-16
*         - expected error: 7.117e-16
*         - max error found @double: 9.387771e-16
*      [15,36)
*         - max error (in interpolated form): 1.668e-17
*         - max error found @long double: 1.669714e-17
*/


// MODULES //

var evalrational = require( 'math-evalrational' ).factory;
var abs = require( 'math-abs' );
var exp = require( 'math-exp' );
var floor = require( 'math-floor' );
var gamma = require( 'math-gamma' );
var gammaln = require( 'math-gammaln' );
var sinpi = require( 'math-sinpi' );
var pow = require( 'math-power' );
var ln = require( 'math-ln' );
var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );
var TWO_PI = require( 'const-two-pi' );
var SQRT_EPSILON = require( 'const-sqrt-eps-float64' );
var LN_SQRT_TWO_PI = require( 'const-ln-sqrt-two-pi' );
var ODD_POSITIVE_INTEGERS = require( './odd_positive_integers.json' );
var EVEN_NONNEGATIVE_INTEGERS = require( './even_nonnegative_integers.json' );
var BERNOULLI = require( './bernoulli.json' );


// CONSTANTS //

var MAX_BERNOULLI_2N = 129;
var MAX_FACTORIAL = 170;
var MAX_LN = 709;

// Polynomial coefficients...
var Y1 = 1.2433929443359375;
var P1 = [
	0.24339294433593750202,
	-0.49092470516353571651,
	0.0557616214776046784287,
	-0.00320912498879085894856,
	0.000451534528645796438704,
	-0.933241270357061460782e-5
];
var Q1 = [
	1.0,
	-0.279960334310344432495,
	0.0419676223309986037706,
	-0.00413421406552171059003,
	0.00024978985622317935355,
	-0.101855788418564031874e-4
];
var P2 = [
	0.577215664901532860516,
	0.243210646940107164097,
	0.0417364673988216497593,
	0.00390252087072843288378,
	0.000249606367151877175456,
	0.110108440976732897969e-4
];
var Q2 = [
	1,
	0.295201277126631761737,
	0.043460910607305495864,
	0.00434930582085826330659,
	0.000255784226140488490982,
	0.10991819782396112081e-4
];
var Y3 = 0.6986598968505859375;
var P3 = [
	-0.0537258300023595030676,
	0.0445163473292365591906,
	0.0128677673534519952905,
	0.00097541770457391752726,
	0.769875101573654070925e-4,
	0.328032510000383084155e-5,
	0
];
var Q3 = [
	1.0,
	0.33383194553034051422,
	0.0487798431291407621462,
	0.00479039708573558490716,
	0.000270776703956336357707,
	0.106951867532057341359e-4,
	0.236276623974978646399e-7
];
var P4 = [
	-2.49710190602259410021,
	-2.60013301809475665334,
	-0.939260435377109939261,
	-0.138448617995741530935,
	-0.00701721240549802377623,
	-0.229257310594893932383e-4,
	0,
	0,
	0
];
var Q4 = [
	1.0,
	0.706039025937745133628,
	0.15739599649558626358,
	0.0106117950976845084417,
	-0.36910273311764618902e-4,
	0.493409563927590008943e-5,
	-0.234055487025287216506e-6,
	0.718833729365459760664e-8,
	-0.1129200113474947419e-9
];
var P5 = [
	-4.78558028495135619286,
	-1.89197364881972536382,
	-0.211407134874412820099,
	-0.000189204758260076688518,
	0.00115140923889178742086,
	0.639949204213164496988e-4,
	0.139348932445324888343e-5,
	0,
	0
];
var Q5 = [
	1.0,
	0.244345337378188557777,
	0.00873370754492288653669,
	-0.00117592765334434471562,
	-0.743743682899933180415e-4,
	-0.21750464515767984778e-5,
	0.471001264003076486547e-8,
	-0.833378440625385520576e-10,
	0.699841545204845636531e-12
];
var P6 = [
	-10.3948950573308896825,
	-2.85827219671106697179,
	-0.347728266539245787271,
	-0.0251156064655346341766,
	-0.00119459173416968685689,
	-0.382529323507967522614e-4,
	-0.785523633796723466968e-6,
	-0.821465709095465524192e-8
];
var Q6 = [
	1.0,
	0.208196333572671890965,
	0.0195687657317205033485,
	0.00111079638102485921877,
	0.408507746266039256231e-4,
	0.955561123065693483991e-6,
	0.118507153474022900583e-7,
	0.222609483627352615142e-14
];


// FUNCTIONS //

// Compile functions to evaluate polynomial function based on the above coefficients...
var rateval1 = evalrational( P1, Q1 );
var rateval2 = evalrational( P2, Q2 );
var rateval3 = evalrational( P3, Q3 );
var rateval4 = evalrational( P4, Q4 );
var rateval5 = evalrational( P5, Q5 );
var rateval6 = evalrational( P6, Q6 );


// ZETA IMPLEMENTATION //

/**
* FUNCTION: zeta( s )
*	Evaluates the Riemann zeta function.
*
* @param {Number} s - input value
* @returns {Number} function value
*/
function zeta( s ) {
	var tmp;
	var sc;
	var as;
	var is;
	var r;
	var n;

	// Check for `NaN`:
	if ( s !== s ) {
		return NaN;
	}
	// Check for a pole:
	if ( s === 1 ) {
		return NaN;
	}
	// Check for large value:
	if ( s >= 56 ) {
		return 1.0;
	}
	// Check for a closed form (integers):
	if ( floor(s) === s ) {
		// Cast `s` to a 32-bit signed integer:
		is = s|0; // asm type annotation

		// Check that `s` does not exceed MAX_INT32:
		if ( is === s ) {
			if ( is < 0 ) {
				as = (-is)|0; // asm type annotation

				// Check if even negative integer:
				if ( (as&1) === 0 ) {
					return 0.0;
				}
				n = ( (as+1) / 2 )|0; // asm type annotation

				// Check if less than max Bernoulli number:
				if ( n <= MAX_BERNOULLI_2N ) {
					return -BERNOULLI[ n ]/ (as+1);
				}
				// fall through...
			}
			// Check if even nonnegative integer:
			else if ( (is&1) === 0 ) {
				return EVEN_NONNEGATIVE_INTEGERS[ is/2 ];
			}
			// Must be a odd positive integer:
			else {
				return ODD_POSITIVE_INTEGERS[ (is-3)/2 ];
			}
		}
		// fall through...
	}
	if ( abs(s) < SQRT_EPSILON ) {
		return -0.5 - (LN_SQRT_TWO_PI * s);
	}
	sc = 1.0 - s;
	if ( s < 0 ) {
		// Check if even negative integer:
		if ( floor(s/2.0) === s/2.0 ) {
			return 0.0;
		}
		// Swap `s` and `sc`:
		tmp = s;
		s = sc;
		sc = tmp;

		// Determine if computation will overflow:
		if ( s > MAX_FACTORIAL ) {
			tmp = sinpi( 0.5*sc ) * 2.0 * zeta( s );
			r = gammaln( s );
			r -= s * ln( TWO_PI );
			if ( r > MAX_LN ) {
				return ( tmp < 0 ) ? NINF : PINF;
			}
			return tmp * exp( r );
		}
		return sinpi( 0.5*sc ) * 2.0 * pow( TWO_PI, -s ) * gamma( s ) * zeta( s );
	}
	if ( s < 1 ) {
		tmp = rateval1( sc );
		tmp -= Y1;
		tmp += sc;
		tmp /= sc;
		return tmp;
	}
	if ( s <= 2 ) {
		sc = -sc;
		tmp = 1.0 / sc;
		return tmp + rateval2( sc );
	}
	if ( s <= 4 ) {
		tmp = Y3 + 1.0/(-sc);
		return tmp + rateval3( s-2.0 );
	}
	if ( s <= 7 ) {
		tmp = rateval4( s-4.0 );
		return 1.0 + exp( tmp );
	}
	if ( s < 15 ) {
		tmp = rateval5( s-7.0 );
		return 1.0 + exp( tmp );
	}
	if ( s < 36 ) {
		tmp = rateval6( s-15.0 );
		return 1.0 + exp( tmp );
	}
	// s < 56
	return 1.0 + pow( 2.0, -s );
} // end FUNCTION zeta()


// EXPORTS //

module.exports = zeta;
