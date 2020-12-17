<template>
      <b-card border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card" v-show="showSpectra">
<div id="spectra-container">

<div :id="spectraGraph" class="sample-spectra-graph" ref="sampleSpectra"></div>
</div>
</b-card-text>
      </b-card>
</template>

<script>
import * as d3 from 'd3'
import spectra from '../spectra'


export default {
	name: "LeafSpectra",
	data: function() {
		return {
			colors: ['#008bae','#65318c','#8bc442','#e7262b','#f59121','#b92587','#278e45','#0756a1'],
			reflectance: 'true',
			transmittance: 'false',
			range: true,
			showResetZoom: false,
		}
	},
	computed: {
		showSpectra: {
			get() {
				return this.$store.state.showSpectra
			}
		},
		header: {
			get() {
				return this.$i18n.t('spectra')
			}
		},
		showSpectraGraph: {
			get() {
				return this.$store.state.showSpectraGraph
			}
		},
		show_range: {
			get() {
				return this.range
			}
		},
		downloadSpinner : {
			get() {
				return this.$store.state.showSpectraDownloadSpinner
			}
		},
		spectraGraph : {
			get() {
				return this.$attrs.which
			}
		},
	},
	created() {
		this.meanLeafSpectra = spectra.meanLeafSpectra
		this.drawBox = spectra.drawBox
	},
	mounted: function() {
		this.$store.subscribe((mutation,state) => {
			switch(mutation.type) {
			case 'save_sample_spectra':
				var self = this;
				if(self.whichSpectra=='main-spectra' | typeof(self.whichSpectra== undefined )) {
				}else{
					d3.selectAll(".sample-spectra-graph > *").remove()
					this.drawBox("reflectance", self.whichSpectra);
					this.meanLeafSpectra(state.sampleSpectra,this.colors[0]);
				}
			break;
			case 'clear_spectra':
				this.clearSpectra();
			break;
			} 
		})
	},
	watch: {
	},
	methods: {
		downloadTaxaMeanCsv() {
			this.$store.commit('download_taxa_mean_csv')
		},
		startZoom() {
			this.box.startx=this.box.x
			this.box.starty_t=this.box.y_t
			this.box.starty_r=this.box.y_r
		},
		updateChart() {
			this.showResetZoom=true;
			// recover the new scale
			const newX = d3.event.transform.rescaleX(this.box.x);
			this.box.gxAxis.call(this.box.xAxis.scale(newX))
			const newY_R = d3.event.transform.rescaleY(this.box.y_r);
			this.box.gyAxisR.call(this.box.yAxisR.scale(newY_R))
			d3.selectAll('.sample-spectra-graph .spectra_r').attr("transform", d3.event.transform);
		},
		clearSpectra() {
			d3.selectAll(".sample-spectra-graph > *").remove()
		},
		clearBox() {
			d3.selectAll("sample-spectra-graph .spectra_r").remove()
			d3.selectAll("sample-spectra-graph .spectra_t").remove()
		},
		resetZoom() {
			//this.$store.commit('clear_spectra')
			this.clearSpectra()
        	this.$store.commit('save_sample_spectra', false)
        	this.showResetZoom=false
		}
	}
}
</script>

<style>
#spectra{
	overflow: visible;
	padding:50px;
	width:100%;
}
.spectra-graph svg {
	margin:auto;
	display:block !important;
}
.spectra-graph{
	margin:auto;
	display:block !important;
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

.spectra-card{
	margin-top:60px !important;
}

.graph-card{
	min-height:300px;
}

.switch-transmittance .custom-control-input:checked ~ .custom-control-label::before {
	background-color:#ffa500 !important;
	border-color:#ffa500  !important;
}

.switches{
	/*max-width:200px;*/
	margin-bottom:0px !important;
}

.custom-switch{
	display:inline !important;
	margin-left:12px;
}

.reset-zoom{
	margin:3px;
	height: 30px;
    text-align: center;
    float: right;
    display:block;
    z-index:9999;
}

</style>
