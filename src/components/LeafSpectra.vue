<template>
<div id="spectra">
</div>
</template>

<script>
import * as d3 from 'd3'

export default {
	name: "LeafSpectra",
	created() {
	},
	data: function() {
		return {
		}
	},
	mounted: function() {
		this.$store.subscribe((mutation,state) => {
			switch(mutation.type) {
			case 'plot_spectras':
				this.leafSpectra(state.current_spectra.spectra);
				//TEST
			break;
			case 'clear_spectra':
				this.clearSpectra();
			break;
			} 
		})
	},
	methods: {
		leafSpectra(data) {
			const spectra = data.spectra_processeds.slice().sort((a, b) => d3.descending(a.wavelength, b.wavelength))
				var margin = {top: 50, right: 50, bottom: 50, left: 50}
					, width = window.innerWidth - margin.left - margin.right // Use the window's width 
					, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
				const svg = d3.select("#spectra").append('svg')
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				const x = d3.scaleLinear()
					.domain([d3.min(spectra, function(d) { return +d.wavelength; }), d3.max(spectra, function(d) { return +d.wavelength; })])
				.range([0, width])

				var y = d3.scaleLinear()
					.domain([0, d3.max(spectra, function(d) { return +d.r_t_average; })]) // input 
					.range([height, 0]); // output 
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
				svg.append("path")
					.datum(spectra)
					.attr("fill","none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 1.5)
					.attr("d", line)
		},
		clearSpectra() {
			d3.select("#spectra > *").remove()
		},
	}
}
</script>

<style>
#spectra{
	overflow: visible;
	padding:50px;
	width:75%;
}
.overlay {
  fill: none;
  pointer-events: all;
}
</style>
