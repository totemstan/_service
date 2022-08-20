'use strict';

// NOTES //

/**
* Algorithm 3 from
*
*    P. Borwein. "An Efficient Algorithm for the Riemann Zeta Function". Canadian Mathematical Society, Conference Proceedings.
*
* See [paper]{@link http://www.cecm.sfu.ca/personal/pborwein/PAPERS/P155.pdf}.
*/


// MODULES //

var pow = require( 'math-power' );
var powm1 = require( 'math-powm1' );


// CONSTANTS //

// -ln(eps)/2 => -ln(2.220446049250313e-16)/2 = 18.021826694558577
var N = 18|0; // asm type annotation

// 2**N
var TWO_N = 262144|0; // asm type annotation
var NEG_TWO_N = -TWO_N;


// SERIES //

/**
* FUNCTION: series( s )
*	Evaluates the Riemann zeta function using a polynomial series.
*
* @param {Number} s - input value
* @returns {Number} function value
*/
function series( s ) {
	var sign;
	var term;
	var sum;
	var tmp;
	var i;

	sum = 0.0;
	sign = 1;
	for ( i = 0; i < N; i++ ) {
		sum += sign * NEG_TWO_N / pow(i+1, s);
		sign *= -1; // flip the sign
	}
	tmp = 1;
	term = 1;
	for ( i = N; i <= 2*N-1; i++ ) {
		sum += sign * (tmp - TWO_N) / pow(i+1, s);
		sign *= -1; // flip the sign
		term *= 2.0*N - i;
		term /= i - N + 1;
		tmp += term;
	}
	return sum / (TWO_N * powm1(2.0, 1.0-s));
} // end FUNCTION series()


// EXPORTS //

module.exports = series;
