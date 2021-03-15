<template>

<div :id="trait_graph">

</div>

</template>

<script>
import * as d3 from 'd3'
import Vue from 'vue';

export default {
    data() {
      return {
      	trait_table:{
      		"leaf_mass_per_area_g_m2":"leaf_area_and_water_samples", 
      		"leaf_dry_matter_content_mg_g":"leaf_area_and_water_samples",
      		"equivalent_water_thickness_cm":"leaf_area_and_water_samples",
      		"leaf_relative_water_content_perc":"leaf_area_and_water_samples",
      		"al_mg_g":"icp_leaf_element_concentrations",
      		"b_mg_g":"icp_leaf_element_concentrations",
      		"ca_mg_g":"icp_leaf_element_concentrations",
      		"cu_mg_g":"icp_leaf_element_concentrations",
      		"fe_mg_g":"icp_leaf_element_concentrations",
      		"k_mg_g":"icp_leaf_element_concentrations",
      		"mg_mg_g":"icp_leaf_element_concentrations",
      		"mn_mg_g":"icp_leaf_element_concentrations",
      		"mo_mg_g":"icp_leaf_element_concentrations",
      		"na_mg_g":"icp_leaf_element_concentrations",
      		"ni_mg_g":"icp_leaf_element_concentrations",
      		"p_mg_g":"icp_leaf_element_concentrations",
      		"s_mg_g":"icp_leaf_element_concentrations",
      		"zn_mg_g":"icp_leaf_element_concentrations",
      	}
      }
    },
    computed: {
    	trait_graph () {
    		return "trait-graph-"+this.which
    	},
    	which () {
    		return this.$vnode.key
    	},
    	trait_value() {
    		return this.$attrs.traitVal
    	}
    },
    mounted: function() {
    	this.getAllValuesForOneTrait(this.which);
    },
    methods: {
    	density(data) {
    		// set the dimensions and margins of the graph
			data = data[0][this.which].split(',').map(function(item) {
			    return parseFloat(item);
			});
			data.sort(function(a, b) {
			  return a - b;
			});
			var margin = {top: 15, right: 30, bottom: 30, left: 50},
			    width = 450 - margin.left - margin.right,
			    height = 75 - margin.top - margin.bottom;

			// append the svg object to the body of the page
			var svg = d3.select("#trait-graph-"+this.which)
			  .append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform",
			          "translate(" + margin.left + "," + margin.top + ")");

			  // add the x Axis
			  var tmin = data[Math.floor(data.length*0.03)]
			  var tmax = data[data.length - Math.floor(data.length*0.03)]
			  var x = d3.scaleLinear()
			            .domain([tmin, tmax])
			            .range([0, width]);
			  svg.append("g")
			      .attr("transform", "translate(0," + height + ")")
			      .call(d3.axisBottom(x));


			  // Compute kernel density estimation
			  var kde = this.kernelDensityEstimator(this.kernelEpanechnikov((tmax-tmin)/40), x.ticks(50))
			  var density =  kde(data)
			  density.push([density[density.length-1][0],0])
			  density.unshift([density[0][0],0])
			  var maxy=0;
			  density.map(function(item){
			  	maxy = Math.max(item[1],maxy)
			  })

			  // add the y Axis
			  var y = d3.scaleLinear()
			            .range([height, 0])
			            .domain([0, maxy]);


			  // Plot the area
			  svg.append("path")
			      .attr("class", "mypath")
			      .datum(density)
			      .attr("fill", "#69b3a2")
			      .attr("opacity", ".8")
			      .attr("stroke", "#000")
			      .attr("stroke-width", 1)
			      .attr("stroke-linejoin", "round")
			      .attr("d",  d3.line()
			        .curve(d3.curveBasis)
			          .x(function(d) { return x(d[0]); })
			          .y(function(d) { return y(d[1]); })
			      );
				svg.append("line")
				.attr("x1", x(this.trait_value))
				.attr("y1", height)
				.attr("x2", x(this.trait_value))
				.attr("y2", 0)
				.style("stroke-width", 2)
				.style("stroke", "black")
				.style("fill", "none");

		}, 
		kernelDensityEstimator(kernel, X) {
			  return function(V) {
			    return X.map(function(x) {
			      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
			    });
		  	};
		},
		kernelEpanechnikov(k) {
		  return function(v) {
		    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
		  };
		},
		getAllValuesForOneTrait(trait) {
			this.axios.get('/traits/all/',{
				params: {
					trait: trait,
					table: this.trait_table[trait]
				},
			}).then(result => {
				this.density(result.data);
			}).catch(error => {
				console.log(error);
			});
		},
    }

}
</script>

<style>

</style>