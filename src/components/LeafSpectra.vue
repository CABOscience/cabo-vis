<template>
<div id="spectra-container" class="row" v-show="showSpectra">
<div v-if="showLoader" class="loader">
	<svg class="loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 100 100">
	<circle cx="18" cy="63.8778" r="4" fill="#008bae">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite"></animate>
	</circle><circle cx="27" cy="65.8997" r="4" fill="#0756a1">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.125s" repeatCount="indefinite"></animate>
	</circle><circle cx="36" cy="60.9779" r="4" fill="#65318c">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.25s" repeatCount="indefinite"></animate>
	</circle><circle cx="45" cy="46.9951" r="4" fill="#b92587">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.375s" repeatCount="indefinite"></animate>
	</circle><circle cx="54" cy="36.1222" r="4" fill="#e7262b">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.5s" repeatCount="indefinite"></animate>
	</circle><circle cx="63" cy="34.1003" r="4" fill="#f59121">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.625s" repeatCount="indefinite"></animate>
	</circle><circle cx="72" cy="39.0221" r="4" fill="#f9ed2b">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.75s" repeatCount="indefinite"></animate>
	</circle><circle cx="81" cy="53.0049" r="4" fill="#8bc442">
	  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.875s" repeatCount="indefinite"></animate>
	</circle>
	</svg>
</div>
<div id="spectra-graph" class="row" v-show="showSpectraGraph"></div>
</div>
</template>

<script>
import * as d3 from 'd3'

export default {
	name: "LeafSpectra",
	data: function() {
		return {
			colors: ['#008bae','#65318c','#8bc442','#e7262b','#f59121','#b92587','#278e45','#0756a1']
		}
	},
	computed: {
		showLoader: {
			get() {
				return this.$store.state.showLoader	
			}
		},
		showSpectra: {
			get() {
				return this.$store.state.showSpectra
			}
		},
		showSpectraGraph: {
			get() {
				return this.$store.state.showSpectraGraph
			}
		}
	},
	mounted: function() {
		this.$store.subscribe((mutation,state) => {
			switch(mutation.type) {
			case 'save_spectra':
				var self = this;
				if(state.current_spectra.spectra.length!==0 && state.current_spectra.which !=='none'){
					if(state.current_spectra.reBox==true){
						this.clearSpectra();
						this.drawBox(state.current_spectra.which);
					}
					this.clearBox();
					this.species_list=state.species_options.map(t => {
						return t.scientific_name
					})
					this.speciesSelected=state.species_selected
					this.dataSpectra=state.current_spectra.spectra
					this.which=state.current_spectra.which
					this.showRange=state.current_spectra.showRange
					this.animate=true
					state.showSpectraGraph=true
					this.callSpectra();
				}else if(state.current_spectra.which=='none'){
					this.clearBox();
				}
			break;
			case 'clear_spectra':
				this.clearSpectra();
			break;
			} 
		})
	},

	methods: {
		callSpectra(){
			const self=this
			let i=1
			this.dataSpectra.forEach(s => {
				if(self.speciesSelected.indexOf(s.data[0].scientific_name)!==-1){
					const color=self.colors[self.species_list.indexOf(s.data[0].scientific_name)]
					self.meanLeafSpectra(s.data,color);
				}
				if(i==self.dataSpectra.length){
					this.animate=false
				}
				i++
			})			
		},
		leafSpectra(data) {
			const spectra = data.data.spectra_processeds.slice().sort((a, b) => d3.descending(a.wavelength, b.wavelength))
			var margin = {top: 50, right: 50, bottom: 50, left: 50}
					, width = 0.7*window.innerWidth - margin.left - margin.right // Use the window's width 
					, height = 0.35*window.innerWidth - margin.top - margin.bottom; // Use the window's height
				const svg = d3.select("#spectra-graph").append('svg')
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				const x = d3.scaleLinear()
					.domain([d3.min(spectra, function(d) { return +d.wavelength; }), d3.max(spectra, function(d) { return +d.wavelength; })])
				.range([0, width])

				var y = d3.scaleLinear()
					.domain([0, d3.max(spectra, function(d) { return +d.r_t_average; })]) // input 
					.range([height, 0+(height*0.15)]); // output 
				// 3. Call the x axis in a group tag
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(x)); // Create an axis component with d3.axisBottom

				// 4. Call the y axis in a group tag
				svg.append("g")
					.attr("class", "y axis")
					.call(d3.axisLeft(y)); // Create an axis component with d3.axisLeft

					const line = d3.line()
						.x(function(d) { return x(d.wavelength); }) // set the x values for the line generator
						.y(function(d) { return y(d.r_t_average); })

				data.forEach(function(spectr) {
					const thiss = spectr.data.spectra_processeds.slice().sort((a, b) => d3.descending(a.wavelength, b.wavelength))
					svg.append("path")
						.datum(thiss)
						.attr("fill","none")
						.attr("stroke", "steelblue")
						.attr("stroke-width", 1.5)
						.attr("stroke-opacity",0.5)
						.attr("d", line)				
				})
		},
		drawBox(which){
			this.box={}
			this.box.margin = {top: 0, right: 50, bottom: 50, left: 50}
			this.box.width = 0.7*window.innerWidth - this.box.margin.left - this.box.margin.right // Use the window's width 
			this.box.height = 0.3*window.innerWidth - this.box.margin.top - this.box.margin.bottom; // Use the window's height
			const self=this
			this.box.svg = d3.select("#spectra-graph").append('svg')
				.attr("width", this.box.width + this.box.margin.left + this.box.margin.right)
				.attr("height", this.box.height + this.box.margin.top + this.box.margin.bottom)
				.append("g")
				.attr("transform", "translate(" + this.box.margin.left + "," + this.box.margin.top + ")")
			this.box.x = d3.scaleLinear()
				.domain([345, 2500])
				.range([0, this.box.width])

			// 3. Call the x axis in a group tag
			this.box.xAxis=this.box.svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + this.box.height + ")")
				.call(d3.axisBottom(this.box.x)); // Create an axis component with d3.axisBottom

			if(which=='both' || which=='reflectance'){
				this.box.y_r = d3.scaleLinear()
					.domain([0, 1]) // input 
					.range([this.box.height, this.box.height*0.15]); // output 

				this.box.yAxisR=this.box.svg.append("g")
					.attr("class", "y axis")
					.call(d3.axisLeft(this.box.y_r)); // Create an axis component with d3.axisLeft
				// text label for the y axis
				this.box.svg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - this.box.margin.left)
					.attr("x",-50 - (this.box.height / 2))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text("Reflectance");  
			}
			if(which=='both' || which=='transmittance'){
				this.box.y_t = d3.scaleLinear()
					.domain([1,0]) // input 
					.range([this.box.height, 0+(this.box.height*0.15)]); // output 

				this.box.yAxisT=this.box.svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate( " + this.box.width + ", 0 )")
					.call(d3.axisRight(this.box.y_t)); 
				this.box.svg.append("text")
				  .attr("y", - this.box.width - this.box.margin.right )
				  .attr("x",50 + (this.box.height/2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .attr("transform", "rotate(90)")
				  .text("Transmittance");
			}

			//clip box to crop when zooming
			this.box.clip = this.box.svg.append("defs").append("SVG:clipPath")
				.attr("id", "clip")
				.append("SVG:rect")
				.attr("width", this.box.width )
				.attr("height", this.box.height - this.box.margin.bottom)
				.attr("x", 0)
				.attr("y", this.box.margin.bottom);

			this.box.zoom = d3.zoom()
				.scaleExtent([0.9, 5]) // This controls how much you can unzoom (x1) and zoom (x5)
				.translateExtent([[0, 0], [this.box.width, this.box.height - this.box.margin.bottom]])  
				.extent([[0, 0], [this.box.width, this.box.height - this.box.margin.bottom]])
				.on("zoom", this.updateChart);

			// Define the div for the tooltip
			this.box.tooltip = d3.select("body").append("div")	
			    .attr("class", "tooltip")				
			    .style("opacity", 0);

			//Invisible box to control zoome
			//return box
		},
		updateChart() {

		  // recover the new scale
		  this.box.x = d3.event.transform.rescaleX(this.box.x);
		  this.box.xAxis.call(d3.axisBottom(this.box.x))
		  if(this.which=='reflectance' || this.which=='both'){
		  	this.box.y_r = d3.event.transform.rescaleY(this.box.y_r); 	
		  	this.box.yAxisR.call(d3.axisLeft(this.box.y_r))		  	
		  }
		  if(this.which=='transmittance' || this.which=='both'){
		  	this.box.y_t= d3.event.transform.rescaleY(this.box.y_t);
		  	this.box.yAxisT.call(d3.axisRight(this.box.y_t))	
		  }
		  //this.box.y_t = d3.event.transform.rescaleY(this.box.y_t);

		  // update axes with these new boundaries
		  //this.box.yAxisT.call(d3.axisLeft(newYT))
		  this.clearBox()
		  this.callSpectra()

		},
		meanLeafSpectra(data,color) {

			data.slice().sort((a, b) => d3.descending(a.wavelength, b.wavelength))
			const self=this

			// Create the scatter variable: where both the circles and the brush take place
			const line_box = this.box.svg.append('g')
			  .attr("clip-path", "url(#clip)")

			this.box.svg.append("rect")
				.attr("width", this.box.width)
				.attr("height", this.box.height - this.box.margin.bottom)
				.style("fill", "none")
				.style("pointer-events", "all")
				.attr('transform', 'translate(' + this.box.margin.top + ',' + this.box.margin.left + ')')
				.call(this.box.zoom).on("wheel", function() { d3.event.preventDefault()});


			if(this.which=='both' || this.which=='reflectance'){
				const reflectance = data.filter(s => s.reflectance_transmittance=='reflectance');
				const line = d3.line()
					.x(function(d) { return self.box.x(d.wavelength); }) // set the x values for the line generator
					.y(function(d) { return self.box.y_r(d.avg); })

	            if(this.showRange == "true"){
					const lineMin = d3.line()
						.x(function(d) { return self.box.x(d.wavelength); }) // set the x values for the line generator
						.y(function(d) { return self.box.y_r(d.min); })

					const lineMax = d3.line()
						.x(function(d) { return self.box.x(d.wavelength); }) // set the x values for the line generator
						.y(function(d) { return self.box.y_r(d.max); })

					line_box.append("path")
						.datum(reflectance)
						.attr("fill","none")
						.attr("class", "spectra_r")
						.attr("stroke", color)
						.attr("spectra","r_min")
						.attr("stroke-width", 1)
						.attr("stroke-opacity",0.3)
						.attr("d", lineMin)

					line_box.append("path")
						.datum(reflectance)
						.attr("fill","none")
						.attr("class", "spectra_r")
						.attr("spectra","r_max")
						.attr("stroke", color)
						.attr("stroke-width", 1)
						.attr("stroke-opacity",0.3)
						.attr("d", lineMax)
				}
				const lineyr=line_box.append("path")
					.datum(reflectance)
					.attr("fill","none")
					.attr("class", "spectra_r")
					.attr("spectra","r")
					.attr("stroke", color)
					.attr("stroke-width", 2.5)
					.attr("stroke-opacity", 1)
					.attr("d", line)				
					.on("mouseover", function(d) {		
						self.box.tooltip.transition()		
					    .duration(200)		
					    .style("opacity", .9);		
						self.box.tooltip.html(d[0].scientific_name)	
					    .style("left", (d3.event.pageX) + "px")		
					    .style("top", (d3.event.pageY - 28) + "px");	
					})					
					.on("mouseout", function(d) {		
						self.box.tooltip.transition()		
					    .duration(500)		
					    .style("opacity", 0);	
					})
					if(this.animate==true){
						lineyr.attr("stroke-dasharray", 1.5*this.box.width + " " + 1.5*this.box.width)
			      		.attr("stroke-dashoffset", 1.5*this.box.width).transition()
						.duration(1000)
						.ease(d3.easeLinear)
						.attr("stroke-dashoffset", 0)
					}
			      	
			}
			if(this.which=='both' || this.which=='transmittance'){
				let transmittance = data.filter(s => s.reflectance_transmittance=='transmittance')
				/*transmittance.forEach(s => {
					s.avg=1-s.avg;
					s.max=1-s.max;
					s.min=1-s.min;
				})*/

				if(this.showRange == "true") {
					const tlineMin = d3.line()
						.x(function(d) { return self.box.x(d.wavelength); }) // set the x values for the line generator
						.y(function(d) { return self.box.y_t(d.min); })

					const tlineMax = d3.line()
						.x(function(d) { return self.box.x(d.wavelength); }) // set the x values for the line generator
						.y(function(d) { return self.box.y_t(d.max); })

					line_box.append("path")
						.datum(transmittance)
						.attr("fill","none")
						.attr("class", "spectra_t")
						.attr("spectra","t_min")
						.attr("stroke", color)
						.attr("stroke-width", 1)
						.attr("stroke-opacity",0.3)
						.attr("d", tlineMin)
               		line_box.append("path")
                        .datum(transmittance)
                        .attr("class", "spectra_t")
                        .attr("spectra","t_max")
                        .attr("fill","none")
                        .attr("stroke", color)
                        .attr("stroke-width", 1)
                        .attr("stroke-opacity",0.3)
                        .attr("d", tlineMax)

                }

				const tline = d3.line()
					.x(function(d) { return self.box.x(d.wavelength); }) // set the x values for the line generator
					.y(function(d) { return self.box.y_t(d.avg); })

				const lineyt=line_box.append("path")
					.datum(transmittance)
					.attr("fill","none")
					.attr("class", "spectra_t")
					.attr("spectra","t")
					.attr("stroke", color)
					.attr("stroke-width", 2.5)
					.attr("stroke-opacity",1)
					.attr("d", tline)

				if(this.animate==true){
					lineyt.attr("stroke-dasharray", 1.5*this.box.width + " " + 1.5*this.box.width)
					.attr("stroke-dashoffset", 1.5*this.box.width).transition()
					.duration(1000)
					.ease(d3.easeLinear)
					.attr("stroke-dashoffset", 0)
				}


			}
		},
		clearSpectra() {
			d3.selectAll("#spectra-graph > *").remove()
		},
		clearBox() {
			d3.selectAll(".spectra_r").remove()
			d3.selectAll(".spectra_t").remove()
		},
	}
}
</script>

<style>
#spectra{
	overflow: visible;
	padding:50px;
	width:100%;
}
#spectra-graph svg {
	margin:auto;
	display:block;
}
#spectra-graph{
	margin:auto;
	display:block;
}

div.tooltip {	
    position: absolute;			
    text-align: center;			
   /* width: 200px;					*/
    padding: 5px 7px;				
    font: 12px sans-serif;		
    background: lightblue;	
    border: 0px;		
    border-radius: 5px;			
    pointer-events: none;			
}
.loader{
	display:inline;
	overflow:visible;
	top:0px;
	left:40%;
	top:10%;
	position:absolute;
}
#spectra-container{
	position:relative;
	min-width:80%;
	min-height:300px;
}
</style>
