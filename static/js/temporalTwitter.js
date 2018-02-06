var h = 450;
var w = 2000;

alert(h);
var data = {
    "model": "sm",
    "data": [
        {"docid": 1, "prob": 0.54, "text": "Hello, world", "label": "0"},
        {"docid": 2, "prob": 0.01, "text": "Hello, world", "label": "0"},
        {"docid": 3, "prob": 0.14, "text": "Hello, world", "label": "0"},
        {"docid": 4, "prob": 0.89, "text": "Hello, world", "label": "1"},
        {"docid": 5, "prob": 0.64, "text": "Hello, world", "label": "0"},
        {"docid": 6, "prob": 0.14, "text": "Hello, world", "label": "0"},
        {"docid": 7, "prob": 0.17, "text": "Hello, world", "label": "0"},
        {"docid": 8, "prob": 0.15, "text": "Hello, world", "label": "0"},
        {"docid": 9, "prob": 0.2, "text": "Hello, world", "label": "1"},
        {"docid": 10, "prob": 0.1, "text": "Hello, world", "label": "1"},
        {"docid": 11, "prob": 0.6, "text": "Hello, world", "label": "1"},
        {"docid": 12, "prob": 0.4, "text": "Hello, world", "label": "1"},
        {"docid": 13, "prob": 0.5, "text": "Hello, world", "label": "0"}
    ]
};


var margin = {
	top: 40,
	bottom: 80,
	left: 60,
	right: 20
};

var height = h - margin.top - margin.bottom;
var width = w - margin.left - margin.right;


var x = d3.scale.ordinal()
    .domain(data.data.map(function(entry) {
        return entry.docid
    }))
    .rangeBands([0, width]);

var y = d3.scale.linear()
    .domain([0, d3.max(data.data, function(d) {
        return d.prob
    })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left");

var svg = d3.select("body").append("svg")
			.attr("id","chart")
			.attr("height",h)
			.attr("width",w);


var chart = svg.append("g")
            .classed("plotBar", true)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var controls = d3.select("body")
				.append("div")
				.attr("id","controls");

var sort_btn = controls.append("button")
				.html("Sort data: Ascending")
				.attr("state", 0);


function drawAxis(param) {
    if (param.initialize) {
        this.append("g")
            .call(param.gridlines)
            .classed("gridlines", true)
            .attr("transform", "translate(0,0)");
    }

}

function plot(param) {
    //Draw Gridlines, Axis and Axis Labels
	drawAxis.call(this,param);
	alert("Hello");

}

plot.call(chart, {
    data: data,
    axis: {
        x: xAxis,
        y: yAxis
    },
    gridlines: yGridlines,
    initialize: true
});