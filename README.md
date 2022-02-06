# FORKED TOTEM

A **Forked** installation offers two installation paths: a barebones `TOTEM module` 
and a full-function `DEBE module`, each of these modules having their own module dependencies.

Thus, after priming your project development folder

	git clone https://github.com/totemstan/acmesds
	
Because a **Forked** installation is for **TOTEM** developers, such installations require
various upgrades (compute frameworks, tools, os patches, etc) to your host Centos 7.x machine

	bash maint.sh os_upgrade

After your OS has been upgraded, you create a `debe` (full-function) or 
a `totem` (barebones) installation

	bash maint.sh [debe || totem] install
	
as desired.

Your installation is then configured for a desired run-mode

	bash maint.sh config [admin || prot || oper]
	
and required database/app services are started

	bash maint.sh [debe || totem] start

# FEDERATED TOTEM

Two **Federated** installation options are available: the `TOTEM-MySQL-Neo4J-OS` (barebones)
and the `DEBE-MySQL-Neo4J-OS` (full-function), that relying on 4 [docker images](https://www.docker.com/)).

Docker images (being self-contained, virtual machines) streamline the maintenance, delivery, 
installation, administration, security and accreditation of services.  Indeed, the **Federated TOTEM** 
option requires only a [docker](https://www.docker.com/)-[git](https://git-scm.com/downloads) 
enabled host machine (windows/linux).

**Federated TOTEM** installations, like **Forked TOTEM** installations **, come in two 
flavors: the barebones `TOTEM image` service and the full-function `DEBE image` service,
each of these images are completely independent of each other [*].  When started, these 
`TOTEM/DEBE image`s become networked with the `OS/MySQL images` to form either a
`TOTEM-MySQL-Neo4J-OS` (barebones) or a `DEBE-MySQL-Neo4J-OS` (full-function) network.

The table below summarizes the functions of each image/service:

| Docker image | Network Host | Provides | Requires Host |
| ----- | ------ | ----------- | -------- |
| OS  | totemhost | CentOS | none |
| MySQL | mysqlhost | MySQL database | none |
| Neo4J | neo4jhost | Optional Neo4J graphical database | none |
| TOTEM | totemhost | Barebones GUI-less web service | mysqlhost |
| DEBE  | totemhost | Full GUI web service | mysqlhost |

[*] So, whereas the `DEBE image` contains the `DEBE module` and the `TOTEM module`, the 
`DEBE image` does not require the `TOTEM image` as these images are completely self-contained.

Thus, after priming your project folder:

	git clone https://github.com/totemstan/acmesds
	bash doc.sh config

you may, if necessary:

	bash doc.sh docker install
	bash doc.sh git install

then:

	bash doc.sh [debe || totem] init

to create the `debe` (full-function) or `totem` (barebones) network, as desired.

Thereafter, the network is administered via:

	bash doc.sh IMAGE ACTION DB

where:

	IMAGE = totem || debe || os || msql || neo4j
	ACTION = install || start || stop || admin || prime || update || debug

## Usage

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

