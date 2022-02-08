// UNCLASSIFIED
/**
To add your compute agents to TOTEM's compute cloud, simply register your agent 
using the following `nodejs` code pattern below

which listens for `add`, `cat`, `/me.js` and `dft` agent requests 
on port 3333: the last 2 agents require you pass process.argv[2] = "$" 
to make the [nodejs fs](https://nodejs.org/api/fs.html) 
and [totem man](/github.com/totemstan/man) modules available to these agents.
*/

// revise as needed
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
	res.on("end", () => eval(agent) );
}).end();

// UNCLASSIFIED