/**
Federated installation.

Install, startup, and administrate images (TOTEM, database, OS).  This module documented 
in accordance with [jsdoc]{@link https://jsdoc.app/}.

@param {String} IMAGE Docker image [os, mysql, neo4j, totem, debe, docker]  
@param {String} ACTION Operation to run [install, start, stop, admin, debug, update, prime]
@param {String} DB Optional path to database during a start ACTION
*/

function doc(IMAGE,ACTION,DB) {
}

/**
Forked installation.

Install, startup, and administrate images (TOTEM, database, OS).  This module documented 
in accordance with [jsdoc]{@link https://jsdoc.app/}.

@param {String} IMAGE Docker image [os, mysql, neo4j, totem, debe, docker]  
@param {String} ACTION Operation to run [install, start, stop, admin, debug, update, prime]
@param {String} DB Optional path to database during a start ACTION
*/
function maint(MODULE,ACTION,DB) {
}
