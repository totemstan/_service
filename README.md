# Installing TOTEM

There are three methods to "install" **TOTEM** on your host machine

<table>
	<tr>
		<th>Method</th><th>Host Requirements</th>
	</tr>
	<tr>
		<th>Forked</th><th>
			many
		</th>
	</tr>
	<tr>
		<th>Federated</th><th>
			git, docker
		</th>
	</tr>
	<tr>
		<th>Agent</th><th>
			nodejs
		</th>
	</tr>
</table>
	

# FORKED TOTEM

A **Forked installation** offers two installation paths: a barebones [TOTEM module](https://github.com/totemstan/totem) 
and a full-function [DEBE module](https://github.com/totemstan/debe), each of these 
modules having their own module dependencies.

Thus, after priming your project development folder

	git clone https://github.com/totemstan/acmesds
	
you must upgrade your CentOS host machine [*]

	bash maint.sh os_upgrade

After your OS has been upgraded, you create a `debe` (full-function) or 
a `totem` (barebones) installation

	bash maint.sh [debe || totem] install
	
as desired.

Your installation is then configured for a desired run-mode

	bash maint.sh config [admin || prot || oper]
	
and the database/app services for this run-mode are started

	bash maint.sh [debe || totem] start

[*] Because a **Forked installation** is for **TOTEM** developers, such installations require
various upgrades (compute frameworks, tools, os patches, etc) to your host Centos 7.x machine.
Consider the **Federated installation** path if you are unable to upgrade your host machine.

# FEDERATED TOTEM

Two **Federated installations** are available: the `TOTEM-MySQL-Neo4J-OS` (barebones)
and the `DEBE-MySQL-Neo4J-OS` (full-function) [dockerized](https://www.docker.com/) network.

Docker images (being self-contained, virtual machines) streamline the maintenance, delivery, 
installation, administration, security and accreditation of services.  Indeed, a **Federated
installation** avoids the intrinsic complexity of **Forked installations**, and require only 
a [docker](https://www.docker.com/)-[git](https://git-scm.com/downloads) 
enabled host machine (windows/linux).

**Federated installations** (like **Forked installations**) come in two 
flavors: the barebones `TOTEM image` service and the full-function `DEBE image` service,
each of these images are completely independent of each other [*].  

When started, these 
`TOTEM/DEBE images` become networked with `OS/MySQL images` to form a
`TOTEM-MySQL-Neo4J-OS` (barebones) or a `DEBE-MySQL-Neo4J-OS` (full-function) network.

The table below summarizes the functions of each image/service:

| Image | Network Host | Provides | Requires Host |
| ----- | ------ | ----------- | -------- |
| OS  | totemhost | CentOS | none |
| MySQL | mysqlhost | MySQL database | none |
| Neo4J | neo4jhost | Optional Neo4J graphical database | none |
| TOTEM | totemhost | Barebones GUI-less web service | mysqlhost |
| DEBE  | totemhost | Full GUI web service | mysqlhost |

[*] So, whereas the `DEBE image` contains the [DEBE module](https://github.com/totemstan/debe)
and the [TOTEM module](https://github.com/totemstan/totem), the 
`DEBE image` does not require the `TOTEM image` as these images are completely self-contained.

Thus, after priming your project folder

	git clone https://github.com/totemstan/acmesds
	bash doc.sh config

you may, if necessary

	bash doc.sh docker install
	bash doc.sh git install

then

	bash doc.sh [debe || totem] init

to create the `debe` (full-function) or `totem` (barebones) network, as desired.

Thereafter, the network is administered via

	bash doc.sh IMAGE ACTION DB

where

	IMAGE = totem || debe || os || msql || neo4j
	ACTION = install || start || stop || admin || prime || update || debug

# TOTEM Agent

To add your compute agents to TOTEM's compute cloud, simply register your agent 
using the following `nodejs` code pattern below

	const 
	need$ = process.argv[2] ? true : false,
	$ = need$ ? require("./man") : null, // "/mnt/public/totem/repo/man",
	$fs = need$ ? require("fs") : null,
	totems = {
		RLE: "https://RLENET.126:8443",
		WWW: "http://totem.hopto.org",
		SBU: "https://totem.nga.mil:8443",
		COE: "https://totem.coe.nga.mil",
		LOCAL: "http://localhost:8080"
	},
	totem = totems.LOCAL,
	port = 3333,
	agents = {	// define your agents here
		add: (req,res) => {	// an agent to add x and y
			const 
				{x,y} = req.query,
				calc = (x,y) => x+y;

			res( calc(x,y) );
		},
		cat: (req,res) => {	// an agent to concatenate x with y
			const 
				{x,y} = req.query,
				calc = (x,y) => [x,y];

			res( calc(x,y) );
		},
		"/me.js": (req,res) => {	// send a file
			res( path => {
				try {
					$fs.readFile( "./testagent.js", "utf-8", (err,txt) => res(txt) );
				}
				catch (err) {
					res("Error: file not found");
				}
			});
	},
		"dft": (req,res) => {	// fft of post `x` array + query `a` constant 
			const
				{ y } = ctx = $("y=dft(x+a)", {		// context for $
					x: req.body.x || [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
					a: req.query.a
				});

			res( y.get("re&im") );
		}
	};

	// do not alter
	require("http").get(`${totem}/agent?port=${port}&keys=${Object.keys(agents)}`, res => {
		var agent = "";
		res.on("data", data => agent += data.toString());
		res.on("end", () => {
			eval(agent);
		});
	}).end();

which, here, listens for `add, `cat`, `/me.js` and `dft` agent requests 
on port 3333.

// UNCLASSIFIED

## Program Reference
<details>
<summary>
<i>Open/Close</i>
</summary>
## Functions

<dl>
<dt><a href="#doc">doc(IMAGE, ACTION, DB)</a></dt>
<dd><p>Federated installation.</p>
<p>Install, startup, and administrate images (TOTEM, database, OS).  This module documented 
in accordance with <a href="https://jsdoc.app/">jsdoc</a>.</p>
</dd>
<dt><a href="#maint">maint(IMAGE, ACTION, DB)</a></dt>
<dd><p>Forked installation.</p>
<p>Install, startup, and administrate images (TOTEM, database, OS).  This module documented 
in accordance with <a href="https://jsdoc.app/">jsdoc</a>.</p>
</dd>
</dl>

<a name="doc"></a>

## doc(IMAGE, ACTION, DB)
Federated installation.

Install, startup, and administrate images (TOTEM, database, OS).  This module documented 
in accordance with [jsdoc](https://jsdoc.app/).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| IMAGE | <code>String</code> | Docker image [os, mysql, neo4j, totem, debe, docker] |
| ACTION | <code>String</code> | Operation to run [install, start, stop, admin, debug, update, prime] |
| DB | <code>String</code> | Optional path to database during a start ACTION |

<a name="maint"></a>

## maint(IMAGE, ACTION, DB)
Forked installation.

Install, startup, and administrate images (TOTEM, database, OS).  This module documented 
in accordance with [jsdoc](https://jsdoc.app/).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| IMAGE | <code>String</code> | Docker image [os, mysql, neo4j, totem, debe, docker] |
| ACTION | <code>String</code> | Operation to run [install, start, stop, admin, debug, update, prime] |
| DB | <code>String</code> | Optional path to database during a start ACTION |

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

* * *

&copy; 2012 ACMESDS

