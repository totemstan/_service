require("http").get("http://localhost:8080/agent?port=3333", res => {
	var msg = "";
	res.on("data", data => msg += data.toString());
	res.on("end", () => {
		eval(msg);
		myAgent({	// define your agents here
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
			}			
		});
	});
}).end();
