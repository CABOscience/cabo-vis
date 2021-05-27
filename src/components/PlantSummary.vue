<template>
  <b-alert show variant="warning" v-show="showPlantsTable">{{ $t('plants_summary_desc') }} <strong>{{ plants_number }}</strong></b-alert>
</template>

<script>
export default{
	data: function() {
		return {
		}
	},
  methods: {
  },
  computed: {
    showPlantsTable: {
      get() {
        return this.$store.state.showAll  
      }
    },
    plants_number: {
      get(){
        return this.$store.state.number_of_plants;
      }
    },
  }
}
</script>

<style>
</style>