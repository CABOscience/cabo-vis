<template>
<b-container>
	<Loader v-show="!showSampleSpectra"></Loader>
      <b-card border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card" v-show="showSampleSpectra">

<b-card-header header-bg-variant="dark" header-text-variant="light">
    <b-form-group fluid
    	v-slot="{ ariaDescribedby }"
    	:label="leaf"
     >
      <b-form-checkbox-group
        v-model="selectedLeaf"
        :options="options"
        :aria-describedby="ariaDescribedby"
        name="flavour-1"
      ></b-form-checkbox-group>
    </b-form-group>
	<b-form-group class="switches">
    <b-form-checkbox v-model="reflectance" name="check-button" value="true" unchecked-value="false" switch>
      {{ $t('reflectance') }}
    </b-form-checkbox>
    <b-form-checkbox variant="secondary" v-model="transmittance" name="check-button" value="true" unchecked-value="false" class="switch-transmittance" switch>
      {{ $t('transmittance') }}
    </b-form-checkbox>
    <b-button v-on:click="resetZoom" v-show="showResetZoom" class="btn-danger reset-zoom">{{ $t('reset_zoom') }}
    </b-button>
	</b-form-group>	
</b-card-header>

<b-card-text>


<div id="spectra-container" class="row">

<div :id="spectraGraph" class="sample-spectra-graph" ref="sampleSpectra"></div>
</div>
</b-card-text>
      </b-card>
</b-container>
</template>

<script>
import * as d3 from 'd3'
import spectra from '../spectra'
import Loader from './Loader.vue'

export default {
	name: "LeafSpectra",
	components: {
		Loader,
	},
	data: function() {
		return {
			colors: ['#008bae','#65318c','#8bc442','#e7262b','#f59121','#b92587','#278e45','#0756a1'],
			reflectance: 'true',
			transmittance: 'false',
			range: true,
			showResetZoom: false,
			showSampleSpectra: false,
			options: [1,2,3,4,5,6],
			selectedLeaf: [1,2,3,4,5,6],
		}
	},
	computed: {
		header: {
			get() {
				return this.$i18n.t('spectra')
			}
		},
		leaf:{
			get() {
				return this.$i18n.t('leaf')
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
		reflectance_transmittance: {
			get(){
				if(this.reflectance=='true' && this.transmittance=='false'){
					return 'reflectance'
				}else if(this.reflectance=='false' && this.transmittance=='true'){
					return 'transmittance'
				}else if(this.reflectance=='true' && this.transmittance=='true'){
					return 'both'
				}else{
					return 'none'
				}
			}
		},
		selectLeaves: {
			get(){
				return this.selectedLeaf;
			}
		}
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
				if(self.whichSpectra !== 'main-spectra' & typeof(self.whichSpectra) !== undefined ) {
					this.showSampleSpectra=true;
					d3.selectAll(".sample-spectra-graph > *").remove()
					this.drawBox(this.reflectance_transmittance, 'sample-spectra');
					this.clearBox();
					var i;
					for (i=1; i<=6; i++){
						if(self.selectedLeaf.includes(i)){
							const tl = state.sampleSpectra.filter(t=>{
								return t.leaf_number==i
							})
							this.meanLeafSpectra(tl,'sample-spectra',this.colors[i-1])
						}
					}
				}
			break;
			case 'clear_spectra':
				this.clearSpectra();
			break;
			} 
		})
	},
	watch: {
	    reflectance_transmittance(which) {
	    	this.$store.state.whichSpectra='sample-spectra'
	    	this.clearSpectra()
	        this.$store.commit('save_sample_spectra', false)
	    },
	    selectLeaves(which){
	    	this.$store.state.whichSpectra='sample-spectra'
	    	this.clearSpectra()
	    	this.$store.commit('save_sample_spectra', false)
	    }
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
		  // recover the new scale
		  const newX = d3.event.transform.rescaleX(this.box.x);
		  this.box.gxAxis.call(this.box.xAxis.scale(newX))
		  if(this.which=='reflectance' || this.which=='both'){
		    const newY_R = d3.event.transform.rescaleY(this.box.y_r);
		  	this.box.gyAxisR.call(this.box.yAxisR.scale(newY_R))
		  	d3.selectAll('.sample-spectra-graph .spectra_r').attr("transform", d3.event.transform);
		  }
		  if(this.which=='transmittance' || this.which=='both'){
		    const newY_T = d3.event.transform.rescaleY(this.box.y_t);
		    this.box.gyAxisT.call(this.box.yAxisT.scale(newY_T))
		    d3.selectAll('.sample-spectra-graph .spectra_t').attr("transform", d3.event.transform);
		  }
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
	/*display:block !important;*/
}
.spectra-graph{
	margin:auto;
	/*display:block !important;*/
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
}

</style>
