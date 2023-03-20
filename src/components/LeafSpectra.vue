<template>
  <b-card
    border-variant="primary"
    footer-bg-variant="dark"
    header-bg-variant="primary"
    header-text-variant="white"
    :header="header"
    class="text-center spectra-card"
    v-show="showSpectra"
  >
    <b-card-header header-bg-variant="dark" header-text-variant="light">
      <b-form-group class="switches">
        <b-form-checkbox
          v-model="reflectance"
          name="check-button"
          value="true"
          unchecked-value="false"
          switch
        >
          {{ $t("reflectance") }}
        </b-form-checkbox>
        <b-form-checkbox
          variant="secondary"
          v-model="transmittance"
          name="check-button"
          value="true"
          unchecked-value="false"
          class="switch-transmittance"
          switch
        >
          {{ $t("transmittance") }}
        </b-form-checkbox>
        <b-form-checkbox
          v-model="range"
          name="check-button"
          value="true"
          unchecked-value="false"
          switch
        >
          {{ $t("ranges") }}
        </b-form-checkbox>
        <b-button
          v-on:click="downloadTaxaMeanCsv"
          class="btn-secondary reset-zoom"
          >{{ $t("download_csv") }}
          <b-icon-arrow-down-circle
            v-show="!downloadSpinner"
          ></b-icon-arrow-down-circle>
          <b-spinner small variant="light" v-show="downloadSpinner"></b-spinner
        ></b-button>
        <b-button
          v-on:click="resetZoom"
          v-show="showResetZoom"
          class="btn-danger reset-zoom"
          >{{ $t("reset_zoom") }}
        </b-button>
      </b-form-group>
    </b-card-header>
    <b-card-text bg-variant="light" text-variant="gray-dark" class="graph-card">
      <div id="spectra-container" class="row">
        <div
          :id="spectraGraph"
          class="main-spectra-graph"
          v-show="showSpectraGraph"
        ></div>
      </div>
    </b-card-text>
  </b-card>
</template>

<script>
import * as d3 from "d3";
import spectra from "../spectra";

export default {
  name: "LeafSpectra",
  data: function () {
    return {
      colors: [
        "#008bae",
        "#65318c",
        "#8bc442",
        "#e7262b",
        "#f59121",
        "#b92587",
        "#278e45",
        "#0756a1",
      ],
      reflectance: "true",
      transmittance: "false",
      range: true,
      showResetZoom: false,
      spectraGraph: "main-spectra",
    };
  },
  computed: {
    showSpectra: {
      get() {
        return this.$store.state.showSpectra;
      },
    },
    header: {
      get() {
        return this.$i18n.t("mean_spectra");
      },
    },
    showSpectraGraph: {
      get() {
        return this.$store.state.showSpectraGraph;
      },
    },
    show_range: {
      get() {
        return this.range;
      },
    },
    downloadSpinner: {
      get() {
        return this.$store.state.showSpectraDownloadSpinner;
      },
    },
    reflectance_transmittance: {
      get() {
        if (this.reflectance == "true" && this.transmittance == "false") {
          return "reflectance";
        } else if (
          this.reflectance == "false" &&
          this.transmittance == "true"
        ) {
          return "transmittance";
        } else if (this.reflectance == "true" && this.transmittance == "true") {
          return "both";
        } else {
          return "none";
        }
      },
    },
  },
  created() {
    this.meanLeafSpectra = spectra.meanLeafSpectra;
    this.drawBox = spectra.drawBox;
  },
  mounted: function () {
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case "save_main_spectra":
          var self = this;
          if (state.whichSpectra == "main-spectra") {
            if (
              state.current_spectra.spectra.length !== 0 &&
              state.current_spectra.which !== "none"
            ) {
              if (state.current_spectra.reBox == true) {
                this.clearSpectra();
                this.drawBox(state.current_spectra.which, "main-spectra");
              }
              this.clearBox();
              this.species_list = state.species_options.map((t) => {
                return t.scientific_name;
              });
              this.speciesSelected = state.species_selected;
              this.dataSpectra = state.current_spectra.spectra;
              this.which = state.current_spectra.which;
              this.showRange = state.current_spectra.showRange;
              this.animate = true;
              state.showSpectraGraph = true;
              this.callSpectra();
            } else if (state.current_spectra.which == "none") {
              this.clearBox();
            }
          } else {
            this.drawBox("reflectance", state.whichSpectra);
            this.meanLeafSpectra(
              state.current_spectra.spectra,
              "main-spectra",
              this.colors[0]
            );
          }
          break;
        case "clear_spectra":
          this.clearSpectra();
          break;
      }
    });
  },
  watch: {
    reflectance_transmittance(which) {
      this.$store.state.whichSpectra = "main-spectra";
      this.$store.state.current_spectra.reBox = true;
      this.$store.commit("clear_spectra");
      this.$store.commit("reflectance_transmittance", which);
      this.$store.commit("save_main_spectra", false);
    },
    show_range(show_range) {
      this.$store.state.whichSpectra = "main-spectra";
      this.$store.state.current_spectra.reBox = true;
      this.$store.state.current_spectra.showRange = show_range;
      this.$store.commit("clear_spectra");
      this.$store.commit("save_main_spectra", false);
    },
  },
  methods: {
    callSpectra() {
      const self = this;
      let i = 1;
      this.dataSpectra.forEach((s) => {
        if (self.speciesSelected.indexOf(s.data[0].scientific_name) !== -1) {
          const color =
            self.colors[self.species_list.indexOf(s.data[0].scientific_name)];
          self.meanLeafSpectra(s.data, "main-spectra", color);
        }
        if (i == self.dataSpectra.length) {
          this.animate = false;
        }
        i++;
      });
    },
    downloadTaxaMeanCsv() {
      this.$store.commit("download_taxa_mean_csv");
    },
    startZoom() {
      this.box.startx = this.box.x;
      this.box.starty_t = this.box.y_t;
      this.box.starty_r = this.box.y_r;
    },
    updateChart(event) {
      this.showResetZoom = true;
      // recover the new scale
      const newX = event.transform.rescaleX(this.box.x);
      this.box.gxAxis.call(this.box.xAxis.scale(newX));
      if (this.which == "reflectance" || this.which == "both") {
        const newY_R = event.transform.rescaleY(this.box.y_r);
        this.box.gyAxisR.call(this.box.yAxisR.scale(newY_R));
        d3.selectAll(".main-spectra-graph .spectra_r").attr(
          "transform",
          event.transform
        );
      }
      if (this.which == "transmittance" || this.which == "both") {
        const newY_T = event.transform.rescaleY(this.box.y_t);
        this.box.gyAxisT.call(this.box.yAxisT.scale(newY_T));
        d3.selectAll(".main-spectra-graph .spectra_t").attr(
          "transform",
          event.transform
        );
      }
    },
    clearSpectra() {
      d3.selectAll(".main-spectra-graph > *").remove();
    },
    clearBox() {
      d3.selectAll(".main-spectra-graph .spectra_r").remove();
      d3.selectAll(".main-spectra-graph .spectra_t").remove();
    },
    resetZoom() {
      //this.$store.commit('clear_spectra')
      this.clearSpectra();
      this.$store.commit("save_main_spectra", false);
      this.showResetZoom = false;
    },
  },
};
</script>

<style>
#spectra {
  overflow: visible;
  padding: 50px;
  width: 100%;
}
.main-spectra-graph svg {
  margin: auto;
  display: block !important;
}
.main-spectra-graph {
  margin: auto;
  display: block !important;
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

.spectra-card {
  margin-top: 60px !important;
}

.graph-card {
  min-height: 300px;
}

.switch-transmittance
  .custom-control-input:checked
  ~ .custom-control-label::before {
  background-color: #ffa500 !important;
  border-color: #ffa500 !important;
}

.switches {
  /*max-width:200px;*/
  margin-bottom: 0px !important;
}

.custom-switch {
  display: inline !important;
  margin-left: 12px;
}

.reset-zoom {
  height: 30px;
  padding: 5px 8px !important;
  text-align: center;
  line-height: 1.2em !important;
  margin-left: 20px;
  float: right;
}
</style>
