<template>

<div :id="trait_graph" :class="index_cat">

</div>

</template>

<script>
import * as d3 from 'd3'
import Vue from 'vue';
import api from '../plugins/axios-interceptor';

export default {
    data() {
      return {
      }
    },
    computed: {
    	trait_graph () {
    		return "trait-graph-"+this.type+'-'+this.which
    	},
    	type(){
    		return this.$vnode.key.split('-')[0]
    	},
    	which () {
    		return this.$vnode.key.split('-')[1]
    	},
    	trait_value() {
    		return this.$attrs.trait_val
    	},
    	index_cat(){
    		return this.$attrs.index_cat
    	},
    	traits_table(){
    		return this.$store.state.traits_table
    	},
        trait_selection() { //Values based on selection
            return this.$store.state.all_current_traits
        },
		species_list(){
			/*return this.$store.state.species_options.map(t => {
				return t.scientific_name
			})*/
			return this.$store.state.species_selected
		}

    },
    mounted: function() {
    	this.getAllValuesForOneTrait(this.which);
    },
    methods: {
    	density(data) {
    		// set the dimensions and margins of the graph
    		var self = this
			data = data[0][this.which].split(',').map(function(item) {
			    return parseFloat(item);
			});
			data.sort(function(a, b) {
			  return a - b;
			});
			var margin = {top: 15, right: 30, bottom: 30, left: 50},
			    width = 450 - margin.left - margin.right;
			if(this.trait_selection !== undefined){
			    var height = 120 - margin.top - margin.bottom;
			  	var plot_height = height - 40;
			}else{
				var height = 75 - margin.top - margin.bottom;
			  	var plot_height = height;
			}
			// append the svg object to the body of the page
			var svg = d3.select("#"+this.trait_graph)
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
			      .attr("transform", "translate(0," + plot_height + ")")
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


			  var y = d3.scaleLinear()
			            .range([plot_height, 0])
			            .domain([0, maxy]);

			 if(this.trait_value === true){
			 	var densityColor = "#ececec"
			 }else{
			 	var densityColor = this.$store.state.basic_colors[this.$attrs.index_cat]
			 }

			  // Plot the area
			  svg.append("path")
			      .attr("class", "mypath")
			      .datum(density)
			      //.attr("fill", "#69b3a2")
			      .attr("fill", densityColor)
			      .attr("opacity", ".8")
			      .attr("stroke", "#000")
			      .attr("stroke-width", 1)
			      .attr("stroke-linejoin", "round")
			      .attr("d",  d3.line()
			        .curve(d3.curveBasis)
			          .x(function(d) { return x(d[0]); })
			          .y(function(d) { return y(d[1]); })
			      );
			   if(this.trait_value !== true){
					svg.append("line")
					.attr("x1", x(this.trait_value))
					.attr("y1", height)
					.attr("x2", x(this.trait_value))
					.attr("y2", 0)
					.style("stroke-width", 2)
					.style("stroke", "black")
					.style("fill", "none");
				}
				if(this.trait_selection !== undefined){
					 var jitterWidth = 10
					 svg.selectAll("circle")
					    .data(Object.values(this.trait_selection))
					    .enter()
					    .append("circle")
					      .attr("cy", function(d){
					      	return(65 + Math.random()*jitterWidth )}
					       )
					      .attr("cx", function(d){
					      	return(x(parseFloat(d[self.which])))})
					      .attr("r", 5)
					      .style("fill", function(d){
					      	return(self.$store.state.basic_colors[self.species_list.indexOf(d.scientific_name)])
					      })
					      .style("fill-opacity", 0.3)
					      .style("stroke-opacity", 0)
					      .attr("stroke-width",0 )
				}

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
			api.get('/traits/all/',{
				params: {
					trait: trait,
					table: this.traits_table[trait]
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