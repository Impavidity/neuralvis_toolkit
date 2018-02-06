var h = 450;
var w = 800;
// var data = [102,34,566,89,70,86,34,89,100];

var data = [
	{key: "Glazed",		value: 132},
	{key: "Jelly",		value: 71},
	{key: "Holes",		value: 337},
	{key: "Sprinkles",	value: 93},
	{key: "Crumb",		value: 78},
	{key: "Chocolate",	value: 43},
	{key: "Coconut", 	value: 20},
	{key: "Cream",		value: 16},
	{key: "Cruller", 	value: 30},
	{key: "Éclair", 	value: 8},
	{key: "Fritter", 	value: 17},
	{key: "Bearclaw", 	value: 21}
];

var margin = {
	top: 40,
	bottom: 80,
	left: 60,
	right: 20
};

var height = h - margin.top - margin.bottom;
var width = w - margin.left - margin.right;

// Horizontal chart
// var x = d3.scale.linear()
// 		.domain([0,d3.max(data,function(d){
// 			return d.value
// 		})])
// 		.range([0,width])

// var y = d3.scale.ordinal()
//  		.domain(data.map(function(entry){
//  			return entry.key
//  		}))
//  		.rangeBands([0,height])

//Vertical chart
var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.key
		}))
		.rangeBands([0,width])

var y = d3.scale.linear()
		.domain([0,d3.max(data,function(d){
			return d.value
		})])
		.range([height,0]);			

var linearColorScale = d3.scale.linear()
						.domain([0,data.length])
						.range(['#FF0000','#FFFF00'])

var ordinalColorScale = d3.scale.category10();	

var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")

var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")							

var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left")

// var xGridlines = d3.svg.axis()
// 				  .scale(x)
// 				  .tickSize(-height,0,0)
// 				  .tickFormat("")
// 				  .orient("bottom")

var svg = d3.select("body").append("svg")
			.attr("id","chart")
			.attr("height",h)
			.attr("width",w);

var chart = svg.append("g")
			.classed("plotBar",true)
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");		

var controls = d3.select("body")
				.append("div")
				.attr("id","controls");

var sort_btn = controls.append("button")
				.html("Sort data: Ascending")
				.attr("state", 0);		

function drawAxis(param) {
	if (param.initialize) {
		//draw Gridlines
	this.append("g")
		.call(param.gridlines)
		.classed("gridlines",true)
		.attr("transform", "translate(0,0)")
	// X axis Gridlines: 	
	// this.append("g")
	// 	.call(xGridlines)
	// 	.classed("gridlines",true)
	// 	.attr("transform", "translate(" + 0 + "," + height + ")")

	// X Axis
	this.append("g")	
		.classed("x axis", true)
		.attr("transform","translate(" + 0 + "," + height + ")")
		.call(param.axis.x)
			.selectAll("text")
				.classed("x-axis-label", true)
				.style("text-anchor", "end")
				.attr("dx", -8)
				.attr("dy", 5)
				.attr("transform", "translate(0,0) rotate(-45)");

	// Y Axis
	this.append("g")
		.classed("y axis", true)
		.attr("transform","translate(0,0)")
		.call(param.axis.y);

	// X Label
	this.select(".y.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor", "end")
		.attr("transform", "translate(-40," + height/2 +") rotate(-90)")
		.text("Units sold");

	// Y Label
	this.select(".x.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor", "end")
		.attr("transform", "translate(" + width/2 + ", 75)")
		.text("Donut Type");
	} else {
		this.selectAll("g.x.axis")
			.transition()
			.duration(100)
			.ease("bounce")
			.delay(50)
			.call(param.axis.x)
		this.selectAll(".x-axis-label")
			.style("text-anchor", "end")
			.attr("dx", -8)
			.attr("dy", 5)
			.attr("transform", "translate(0,0) rotate(-45)");
		this.selectAll("g.y.axis")
			.call(param.axis.y)
	}
}										


function plot(param) {
	x.domain(data.map(function(entry){
			return entry.key
		}));
	y.domain([0,d3.max(data,function(d){
			return d.value
		})]);

	//Draw Gridlines, Axis and Axis Labels
	drawAxis.call(this,param)

	//enter()
	this.selectAll(".bar")
		.data(param.data)
		.enter()
			.append("rect")	
			.classed("bar",true)
			.on("mouseover", function(d,i){
				d3.select(this).style("fill","pink")
			})
			.on("mouseout", function(d,i){
				d3.select(this).style("fill", ordinalColorScale(i))
			})
			// .on("mousemove", function(d,i){});

	this.selectAll(".bar-label")
		.data(param.data)
		.enter()
			.append("text")
			.classed("bar-label",true)

	//update()
	this.selectAll(".bar")
		.transition()
		.duration(100)
		.ease("bounce")
		.delay(50)
		.attr("y",function(d,i){
				return y(d.value);
			})
			.attr("x",function(d,i){
				return x(d.key);
			})
			.attr("dy",-8)
			.attr("width",function(d,i){
				// return x(d.value);
				return x.rangeBand();
			})
			.attr("height",function(d,i){
				// return y.rangeBand()-1;
				return height - y(d.value);
			})
			.style("fill", function(d,i){
				return ordinalColorScale(i)
				// return linearColorScale(i);
			});

	this.selectAll(".bar-label")
		.transition()
		.duration(100)
		.ease("bounce")
		.delay(50)
		.attr("x",function(d,i){
				return x(d.key);
			})
			.attr("dx", x.rangeBand()/2)
			.attr("y", function(d,i){
				return y(d.value);
			})
			.attr("dy",-6)
			.text(function(d,i){
				return d.value;
			});

	//exit()
	this.select(".bar")
		.data(param.data)
		.exit()
		.remove()

	this.selectAll(".bar-label")
		.data(param.data)
		.exit()
		.remove()
}


sort_btn.on("click", function(){
	var self = d3.select(this);
	var state = +self.attr("state");
	var txt = "Sort data: ";
	var ascending = function(a,b){
		return a.value - b.value
	}
	var descending = function(a,b){
		return b.value - a.value
	}

	if(state === 0){
		state = 1;
		txt += "Descending";
		data.sort(ascending)
	} else if(state === 1){
		state = 0;
		txt += "Ascending"
		data.sort(descending)
	}
	// console.log(data)
	self.attr("state", state);
	self.html(txt);

	plot.call(chart,{
		data: data,
		axis: {
			x: xAxis,
			y: yAxis
		},
		gridlines: yGridlines,
		initialize: false
	});

})

plot.call(chart,{
	data: data,
	axis: {
		x: xAxis,
		y: yAxis
	},
	gridlines: yGridlines,
	initialize: true
});
