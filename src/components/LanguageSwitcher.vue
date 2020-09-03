<template>
<b-container fluid="sm">
      <b-form-select v-model="$i18n.locale" size="sm"  class="switcher">
      <option v-for="(lang, i) in langs" :key="`lang${i}`" :value="lang">{{ lang }}</option>
    </b-form-select>
  </b-container>
</template>

<script>
export default{
	data: function() {
		return {
			langs: ['en','fr'],
		}
	}
}
</script>

<style>
.switcher{
    max-width: 100px;
    display: block;
    right: 20px;
    top: 10px;
    position: absolute;
}
</style>