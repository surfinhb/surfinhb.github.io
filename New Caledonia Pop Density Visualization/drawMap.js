//create our svg
var svg = d3.select("body").append("svg").attr("width", 1200).attr("height", 370);

//create our geomap
var geoMap = d3.geoPath();

//define color range
var values = [7, 12, 80, 150, 600]
//var swatch = d3.schemeReds[6];
//swatch.unshift("#eee")
var swatch = ["#ffe6e6","#ff4d4d","#e10000","#990000","#471919"]
var colorVals = d3.scaleThreshold().domain(values).range(swatch);

//get our mercator projection
geoMap.projection(     
    d3.geoTransverseMercator()
    //brute force it to fit on svg
    .translate([-1300,-21870])
    .scale([8000])
);

// using queue @ http://d3js.org/queue.v1.min.js to load in multiple files and
// pass all their data into one function
queue()
	.defer(d3.json, "nc_compressed.json")
	.defer(d3.csv, "NewCaledoniaData.csv")
	.await(makeMap);

// create the map
function makeMap(error,mapData,csvData){
    
    // create a dict of csv data with commune name as the key (0(n) time)
    var csvDict = {};
    csvData.forEach(function (item) {
        csvDict[item.Commune] = +item.PopPerSquareMile;                
    });
    
    // set the density in the map data (0(n) time)
    mapData.features.forEach(function (item){
        item.properties.popDense = csvDict[item.properties.NAME_2];
    });

    // actually draw the map
    svg.selectAll("path")
       .data(mapData.features)
       .enter().append("path")
       .attr("d", geoMap)
       .style("fill", function(data) {
            var popDensity = data.properties.popDense;
            if (popDensity) return colorVals(popDensity);
            else return "#471919";
       });

}


// draw legend (brute force)
svg.append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", "#ffe6e6")
    .style("stroke-size", "5px");
svg.append("text")
    .attr("x", 70)
    .attr("y", 20)
    .attr("stroke", "black")
    .style("text-anchor", "end")
    .text("0-7");

svg.append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("y", 40)
    .attr("fill", "#ff4d4d")
    .style("stroke-size", "5px");
svg.append("text")
    .attr("x", 80)
    .attr("y", 60)
    .attr("stroke", "black")
    .style("text-anchor", "end")
    .text("7-12");

svg.append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("y", 80)
    .attr("fill", "#e10000")
    .style("stroke-size", "5px");
svg.append("text")
    .attr("x", 80)
    .attr("y", 100)
    .attr("stroke", "black")
    .style("text-anchor", "end")
    .text("12-80");

svg.append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("y", 120)
    .attr("fill", "#990000")
    .style("stroke-size", "5px");
svg.append("text")
    .attr("x", 90)
    .attr("y", 140)
    .attr("stroke", "black")
    .style("text-anchor", "end")
    .text("80-150");

svg.append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("y", 160)
    .attr("fill", "#471919")
    .style("stroke-size", "5px");
svg.append("text")
    .attr("x", 100)
    .attr("y", 180)
    .attr("stroke", "black")
    .style("text-anchor", "end")
    .text("150-600");

svg.append("text")
    .attr("x", 180)
    .attr("y", 220)
    .attr("stroke", "black")
    .style("text-anchor", "end")
    .text("(in people per square mile)");
    