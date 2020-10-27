<template>

<b-container>
	<b-input type="password" v-model="password" v-show="showPassword" placeholder="Type password" class="pass">

	</b-input>
</b-container>

</template>

<script>

export default {
    name: "sidebar",
    data() {
      return {
        perPage: 20,
        currentPage: 1,
        items: [],
      }
    },
    computed: {
    	password: {
		    set (value) {
		      this.$store.commit('updatePassword', value)
		    }
	    },
    	showPassword(){
    		return this.$store.state.showPassword
    	}
    },
}
</script>


<style>
.pass{
	max-width:20%;
	margin:auto;
}
</style>
