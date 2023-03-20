// store/index.js

import Vue from "vue";
import Vuex from "vuex";
import { i18n } from "../plugins/i18n";
import bcrypt from "bcryptjs";
import _ from "lodash";
import api from "../plugins/axios-interceptor";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    all_current_traits: [],
    password: "",
    search_box: {
      search_value: "",
      announce: "",
      geomFilter: "",
      startDate: "",
      endDate: "",
      projects: [],
      species_list: [],
      projects_selected: "",
    },
    current_spectra: {
      spectra_ids: [],
      selected_spectra_ids: [],
      spectra: [],
      which: "reflectance",
      reBox: true,
      showRange: "true",
    },
    current_traits: {},
    basic_colors: [
      "#008bae",
      "#65318c",
      "#8bc442",
      "#e7262b",
      "#f59121",
      "#b92587",
    ],
    traits_exists: {},
    plants_sample_ids: [],
    plants: [],
    number_of_plants: 0,
    species_options: [],
    species_selected: [],
    sampleModal: { bulk_leaf_samples: [] },
    sampleSpectra: [],
    sidebar: false,
    whichSpectra: "main-spectra",
    showAll: false,
    showLoader: false,
    showSpectra: false,
    showSpectraGraph: false,
    showSpectraDownloadSpinner: false,
    showPlantSpectraDownloadSpinner: false,
    showAllPlantSpectraDownloadSpinner: false,
    showSelectedPlantSpectraDownloadButton: false,
    showSelectedPlantSpectraDownloadSpinner: false,
    showMarkerPlantSpectraDownloadSpinner: false,
    showTraitsDownloadSpinner: false,
    showTraitsSpectraDownloadSpinner: false,
    showAllPlantTraitsDownloadSpinner: false,
    showSelectedPlantTraitsDownloadButton: false,
    showSelectedPlantTraitsDownloadSpinner: false,
    showMarkerPlantTraitsDownloadSpinner: false,
    showOverallTraits: false,
    showPassword: false,
    showFiveWarning: false,
    isAdmin: false,
    showSampleSpectra: false,
    traits_table: {
      leaf_mass_per_area_g_m2: "leaf_area_and_water_samples",
      leaf_dry_matter_content_mg_g: "leaf_area_and_water_samples",
      equivalent_water_thickness_cm: "leaf_area_and_water_samples",
      leaf_relative_water_content_perc: "leaf_area_and_water_samples",
      al_mg_g: "icp_leaf_element_concentrations",
      b_mg_g: "icp_leaf_element_concentrations",
      ca_mg_g: "icp_leaf_element_concentrations",
      cu_mg_g: "icp_leaf_element_concentrations",
      fe_mg_g: "icp_leaf_element_concentrations",
      k_mg_g: "icp_leaf_element_concentrations",
      mg_mg_g: "icp_leaf_element_concentrations",
      mn_mg_g: "icp_leaf_element_concentrations",
      mo_mg_g: "icp_leaf_element_concentrations",
      na_mg_g: "icp_leaf_element_concentrations",
      ni_mg_g: "icp_leaf_element_concentrations",
      p_mg_g: "icp_leaf_element_concentrations",
      s_mg_g: "icp_leaf_element_concentrations",
      zn_mg_g: "icp_leaf_element_concentrations",
      c_perc: "c_n_leaf_concentrations",
      n_perc: "c_n_leaf_concentrations",
      soluble_perc: "carbon_fractions_bags",
      cellulose_perc: "carbon_fractions_bags",
      hemicellulose_perc: "carbon_fractions_bags",
      lignin_perc: "carbon_fractions_bags",
      recalcitrants_perc: "carbon_fractions_bags",
      chla_mg_g_disk_mass: "pigments_extracts",
      chlb_mg_g_disk_mass: "pigments_extracts",
      carot_mg_g_disk_mass: "pigments_extracts",
      chl_a_chl_b_ratio: "pigments_extracts",
      chla_mg_m2: "pigments_extracts",
      chlb_mg_m2: "pigments_extracts",
      carot_mg_m2: "pigments_extracts",
    },
  },
  getters: {
    accessible_samples: (state) => {
      if (!state.isAdmin) {
        return state.current_spectra.spectra_ids.filter((p) => {
          return p.permission == 1;
        });
      } else {
        return state.current_spectra.spectra_ids;
      }
    },
  },
  mutations: {
    save_search_spectra_ids(state, spectra_ids) {
      state.current_spectra.spectra_ids = spectra_ids;
      let tt = 0;

      if (state.species_options.length !== 0) {
        state.species_options = state.species_options.filter(function (
          value,
          index,
          self
        ) {
          return state.species_selected.indexOf(value.scientific_name) !== -1;
        });
      }
      state.species_options = state.species_options.concat(
        _(state.current_spectra.spectra_ids)
          .countBy("scientific_name")
          .map(function (count, scientific_name) {
            return { count: count, scientific_name: scientific_name };
          })
          .value()
          .sort(function (a, b) {
            return b.count - a.count;
          })
      );
      if (state.species_options.length > 5) {
        state.species_options = state.species_options.slice(0, 5);
        state.showFiveWarning = true;
      } else {
        state.showFiveWarning = false;
      }
      if (spectra_ids.length != 0) {
        state.species_selected = state.species_options.map((t) => {
          return t.scientific_name;
        });
        this.dispatch("getManySpectraMeanTaxa");
        this.whichSpectra = "main-spectra";
        this.dispatch("getManyPlants");
        this.dispatch("getAllTraits", state.current_spectra.spectra_ids);
      } else {
        this.dispatch("clearSpectra");
        state.showAll = false;
        state.showLoader = false;
        state.showSpectra = false;
      }
      state.search_box.announce = spectra_ids.length + i18n.t("_samples_found");
    },
    save_main_spectra(state, spectra) {
      state.showLoader = false;
      state.showAll = true;
      state.sidebar = true;
      state.showSpectra = true;
      state.showSpectraGraph = false;
      if (spectra != false) {
        state.current_spectra.spectra = spectra;
      }
    },
    save_sample_spectra(state, spectra) {
      if (spectra != false) {
        state.sampleSpectra = spectra;
      }
    },
    save_plants(state, plants) {
      var pl = [];
      plants = plants.filter((s) => typeof s !== "undefined");
      var ids = plants.map((p) => {
        return p.fulcrum_id;
      });
      plants.map((p) => {
        var i = ids.indexOf(p.fulcrum_id);
        if (typeof pl[i] === "undefined") {
          pl[i] = p;
        } else {
          pl[i].bulk_leaf_samples.push(p.bulk_leaf_samples[0]);
        }
      });
      state.number_of_plants = pl.length;
      state.plants = pl;
    },
    species_select(state) {
      if (state.showLoader != true) {
        this.dispatch("saveSpectra");
      }
    },
    save_search(state) {
      state.showLoader = true;
      state.showOverallTraits = false;
      this.dispatch("clearSpectra");
      this.dispatch("searchTaxa");
    },
    get_projects(state) {
      this.dispatch("getProjects");
    },
    save_projects(state, projects) {
      if (!state.isAdmin) {
        projects = projects.filter(function (value, index, self) {
          return value.permission == 1;
        });
      }
      state.search_box.projects = projects;
    },
    get_species_list(state) {
      this.dispatch("getSpeciesList");
    },
    save_species_list(state, species_list) {
      state.search_box.species_list = species_list;
    },
    reflectance_transmittance(state, which) {
      state.current_spectra.which = which;
      //this.dispatch('saveSpectra',state.current_spectra.spectra, false);
    },
    species_selected(state, which) {
      state.species_selected = which;
      //this.dispatch('saveSpectra',state.current_spectra.spectra, false);
    },
    clear_spectra(state) {
      /*state.current_spectra.spectra_ids=[];
			state.current_spectra.spectra=[];*/
    },
    plot_spectra() {},
    toggle_sidebar(state, search) {
      state.sidebar = !state.sidebar;
    },
    download_taxa_mean_csv(state) {
      state.showSpectraDownloadSpinner = true;
      this.dispatch("downloadTaxaMeanCSV");
    },
    download_plant_spectra_csv(state, record_id) {
      this.dispatch("downloadPlantSpectraCSV", record_id);
    },
    download_all_plant_spectra_csv(state) {
      state.showAllPlantSpectraDownloadSpinner = true;
      this.dispatch("downloadAllPlantSpectraCSV");
    },
    download_selected_plant_spectra_csv(state, click) {
      if (click === "header") {
        state.showSelectedPlantSpectraDownloadSpinner = true;
      }
      this.dispatch("downloadSelectedPlantSpectraCSV");
    },
    download_plant_traits_csv(state, record_id) {
      this.dispatch("downloadPlantTraitsCSV", record_id);
    },
    download_all_plant_traits_csv(state) {
      state.showAllPlantTraitsDownloadSpinner = true;
      this.dispatch("downloadAllPlantTraitsCSV");
    },
    download_selected_plant_traits_csv(state, click) {
      if (click === "header") {
        state.downloadSelectedPlantTraitsSpinner = true;
      }
      this.dispatch("downloadSelectedPlantTraitsCSV");
    },
    download_traits(state, which) {
      if (
        (which.cat == "icp_leaf_element_concentrations") |
        (which == "c_n_leaf_concentrations")
      ) {
        which.cat = "leaf_chemistry_samples";
      }
      this.dispatch("getTraits", which);
    },
    save_traits(state, which) {
      state.current_traits[which.cat] = which.data;
    },
    save_all_traits(state, data) {
      var traits = Object.keys(state.traits_table);
      traits.push("scientific_name");
      data = _.pickBy(
        data.map((i) => {
          return _.pickBy(
            _.pick(
              _.mapValues(i, (j) => {
                if (j !== null && !isNaN(parseFloat(j))) {
                  return parseFloat(j).toFixed(4);
                } else {
                  return j;
                }
              }),
              traits
            ),
            (k) => {
              return k !== null;
            }
          );
        }),
        (l) => {
          return state.species_selected.indexOf(l.scientific_name) !== -1;
        }
      );
      state.all_current_traits = {
        ...state.all_current_traits,
        ...data,
      };
      state.showOverallTraits = true;
    },
    show_sample_modal(state, modal_content) {
      state.sampleModal = modal_content;
    },
    show_sample_spectra(state, ids) {
      state.whichSpectra = "sample" + ids;
      this.dispatch("getManyLeafSpectra", ids);
    },
    updatePassword(state, password) {
      bcrypt.compare(
        password,
        process.env.VUE_APP_CABO_PASSWORD,
        function (err, res) {
          if (res == true) {
            state.isAdmin = true;
            state.showPassword = false;
            Vue.axios.defaults.headers.common["Authorization"] =
              "Bearer " + process.env.VUE_APP_CABO_API_KEY_ADMIN;
          }
        }
      );
    },
  },
  actions: {
    searchTaxa(context) {
      context.commit("clear_spectra");
      if (
        (context.state.search_box.search_value !== "" &&
          context.state.search_box.search_value !== " ") |
        (context.state.search_box.geomFilter !== "") |
        (context.state.search_box.projects_selected !== "") |
        (context.state.search_box.startDate !== "")
      ) {
        let projects = [];
        if (Array.isArray(context.state.search_box.projects_selected)) {
          context.state.search_box.projects_selected.map((s) => {
            projects.push("'" + s + "'");
          });
          projects = projects.join(",");
        } else {
          projects = "";
        }
        api
          .post("leaf_spectra/search/taxa", {
            taxa: context.state.search_box.search_value,
            start_date: context.state.search_box.startDate,
            end_date: context.state.search_box.endDate,
            geometry: context.state.search_box.geomFilter,
            projects: projects,
          })
          .then((result) => {
            if (result.data.length === 0) {
              context.commit("save_search_spectra_ids", []);
            } else {
              context.commit("save_search_spectra_ids", result.data);
            }
          })
          .catch((error) => {
            throw new Error(`API ${error}`);
          });
      } else {
        context.commit("save_search_spectra_ids", []);
        this.dispatch("clearSpectraData");
      }
    },
    clearSpectra(context) {
      context.commit("clear_spectra");
      //context.commit('save_spectra',[], false)
    },
    getProjects(context) {
      api
        .get("projects/" + context.state.search_box.projects)
        .then((result) => {
          context.commit("save_projects", result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSpeciesList(context) {
      api
        .get(
          "scientific_names_in_spectra/" /* + context.state.search_box.projects*/
        )
        .then((result) => {
          context.commit("save_species_list", result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOneSpectra(context) {
      api
        .get(
          "leaf_spectra/reflectance/" +
            context.state.current_spectra.spectra_ids[0].fulcrum_id
        )
        .then((result) => {
          context.commit("save_spectra", result.data);
        })
        .catch((error) => {
          context.state.current_spectra.spectra_ids.shift(); //There are no spectra associated with last id
          context.commit(
            "save_search_spectra_ids",
            context.state.current_spectra.spectra_ids
          );
          console.log(error);
        });
    },
    getManySpectra(context) {
      const gets = context.state.current_spectra.spectra_ids.map((sp) =>
        api
          .get("leaf_spectra/reflectance/" + sp.fulcrum_id)
          .catch(function (error) {
            console.log(error);
          })
      );
      Vue.axios.all(gets).then((responses) => {
        resp = responses.map((m) => {
          return m.data;
        });
        context.commit("save_spectra", resp);
      });
    },
    getManyPlants(context) {
      let plants = context.getters.accessible_samples;
      const gets = plants.map((sp) =>
        api
          .get("plants_samples", {
            params: {
              sample_id: sp.sample_id,
            },
          })
          .catch(function (error) {
            console.log(error);
          })
      );
      Vue.axios.all(gets).then((responses) => {
        const resp = responses.map((m) => m.data[0]);
        context.commit("save_plants", resp);
      });
    },
    getTraits(context, which) {
      api
        .get(which.cat, {
          params: {
            sample_id: which.sample_id,
          },
        })
        .then((result) => {
          which.data = result.data;
          context.commit("save_traits", which);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllTraits(context, sample_ids) {
      let ids = [];
      sample_ids.map((s) => {
        ids.push("'" + s.sample_id + "'");
      });
      ids = ids.join(",");
      api
        .post("/traits/", {
          ids: ids,
          type: "raw",
        })
        .then((result) => {
          context.commit("save_all_traits", result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getManyLeafSpectra(context, ids) {
      ids = ids.split(",");
      ids = ids.map((i) => {
        return parseInt(i);
      });
      Vue.axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";
      api
        .post("/leaf_spectra_raw/", {
          ids: ids,
        })
        .then((result) => {
          context.commit("save_sample_spectra", result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getManySpectraMeanTaxa(context) {
      const gets = context.state.species_selected.map((sp) =>
        api
          .get("leaf_spectra_mean/search/", {
            params: {
              species: sp,
            },
          })
          .catch(function (error) {
            console.log(error);
          })
      );
      Vue.axios.all(gets).then((responses) => {
        //const resp=responses.map(m => m.data[0])
        context.commit("save_main_spectra", responses);
      });
    },
    saveSpectra(context) {
      context.commit("save_spectra", false);
    },
    clearSpectraData(context) {
      context.state.current_spectra.spectra_ids = [];
      context.state.current_spectra.spectra = [];
    },
    downloadTaxaMeanCSV(context) {
      api
        .post("leaf_spectra/csv/", {
          taxa: context.state.species_selected,
          type: "mean",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_mean_spectra_by_species_" + d + ".csv",
          });
          context.state.showSpectraDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    downloadPlantSpectraCSV(context, sample_ids) {
      api
        .post("leaf_spectra/csv/", {
          ids: "'" + sample_ids + "'",
          type: "raw",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_plant_spectra_" + d + ".csv.gz",
          });
          context.state.showPlantSpectraDownloadSpinner = false;
          context.state.showMarkerPlantSpectraDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    downloadAllPlantSpectraCSV(context) {
      let ids = [];
      let plants = context.getters.accessible_samples;
      plants.map((s) => {
        ids.push("'" + s.sample_id + "'");
      });
      ids = ids.join(",");
      api
        .post("leaf_spectra/csv/", {
          ids: ids,
          type: "raw",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_all_plant_spectra_" + d + ".csv",
          });
          context.state.showAllPlantSpectraDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    downloadSelectedPlantSpectraCSV(context) {
      let ids = [];
      let plant = context.state.current_spectra.selected_spectra_ids;
      if (plant.length == 1) {
        ids = plant[0].sample_ids.split(",");
      } else {
        plant.map((s) => {
          ids.push(s.sample_ids);
        });
      }
      api
        .post("leaf_spectra/csv/", {
          ids: ids,
          type: "raw",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_selected_plant_spectra_" + d + ".csv",
          });
          context.state.showSelectedPlantSpectraDownloadSpinner = false;
          context.state.showPlantSpectraDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    downloadPlantTraitsCSV(context, sample_ids) {
      api
        .post("traits/csv/", {
          ids: "'" + sample_ids + "'",
          type: "raw",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_plant_traits_" + d + ".csv",
          });
          context.state.showPlantTraitsDownloadSpinner = false;
          context.state.showMarkerPlantTraitsDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    downloadAllPlantTraitsCSV(context) {
      let ids = [];
      let plants = context.getters.accessible_samples;
      plants.map((s) => {
        ids.push("'" + s.sample_id + "'");
      });
      ids = ids.join(",");
      api
        .post("traits/csv/", {
          ids: ids,
          type: "raw",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_all_plant_traits_" + d + ".csv",
          });
          context.state.showAllPlantTraitsDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    downloadSelectedPlantTraitsCSV(context) {
      let ids = [];
      let plant = context.state.current_spectra.selected_spectra_ids;
      if (plant.length == 1) {
        ids = plant[0].sample_ids.split(",");
      } else {
        plant.map((s) => {
          ids.push(s.sample_ids);
        });
      }
      api
        .post("traits/csv/", {
          ids: ids,
          type: "raw",
        })
        .then((response) => {
          const d = Date.now();
          this.dispatch("processCSVResponse", {
            response: response,
            filename: "cabo_selected_plant_traits_" + d + ".csv",
          });
          context.state.showSelectedPlantTraitsDownloadSpinner = false;
          context.state.showPlantTraitsDownloadSpinner = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    processCSVResponse(context, data) {
      //const url = window.URL.createObjectURL(new Blob([data.response.data]));
      const link = document.createElement("a");
      link.href = "/download/" + data.response.data;
      link.target = "_blank";
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
    },
  },
});
