// UNCLASSIFIED
/**
To add your compute agents to TOTEM's compute cloud, simply register your agent 
using the following `nodejs` code pattern below

which listens for `add`, `cat`, `/me.js`, `dft`, `test1`, and `test2` agent requests 
on port 3333: the last 2 agents require you pass process.argv[2] = "$" 
to make the [nodejs fs](https://nodejs.org/api/fs.html) 
and [totem man](/github.com/totemstan/man) modules available to these agents.
*/

// revise as needed
const 
	need$ = process.argv[2] ? true : false,
	$ = need$ ? require("./man") : null, // "/mnt/repo/man",
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
		dft: (req,res) => {	// fft of post `x` array + query `a` constant 
			const
				{ y } = ctx = $("y=dft(x+a)", {		// context for $
					x: req.body.x || [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
					a: req.query.a
				});

			res( y.get("re&im") );
		},
		test1: (req,res) => {	// test via python
			const
				{ a } = $.py(`
def f(x,y):
	return x+y;

a=f(x,y)
`, {
					x: req.query.x,
					y: req.query.y
				});
			
			res( a );
		},
		test2: (req,res) => {	// test via R
			const
				{ a } = ctx = $.R(`
print('you da man');
print('R input ctx=');str(CTX);
CTX$d = 'this is a test';
CTX$e = list(x=1,y=2,z=3);
CTX$a = CTX$x + CTX$y;
CTX$g = list(4,5,6);
CTX$h = TRUE;
`, {
					x: req.query.x,
					y: req.query.y
				});
			
			//console.log(ctx);
			res( ctx );
		}
	};

// do not alter
require("http").get(`${totem}/agent?port=${port}&keys=${Object.keys(agents)}`, res => {
	var agent = "";
	res.on("data", data => agent += data.toString());
	res.on("end", () => eval(agent) );
}).end();

// UNCLASSIFIED