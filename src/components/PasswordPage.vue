<template>

<b-container class="pass sm">
    <div @click="showPass" v-show="!showPassword" class="admin" v-bind:class="{ isadmin: isAdmin }">admin</div>
	<b-input type="password" v-model="password" v-show="showPassword" placeholder="Type password" class="inputpass">
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
            get(){

            },
		    set(value) {
		      this.$store.commit('updatePassword', value)
		    }
	    },
    	showPassword(){
    		return this.$store.state.showPassword && !this.$store.state.isAdmin
    	},
        isAdmin(){
            return this.$store.state.isAdmin
        }
    },
    methods: {
        showPass(){
           this.$store.state.showPassword=true; 
        }
    }
}
</script>


<style>
.pass{
	max-width:80% !important;
    float:left;
    margin-top:5px;
}
.admin:hover{
    cursor:pointer;
}
.admin{
    float:left;
}
.isadmin{
    color:green;
    font-weight:bold;
}

.inputpass{
    float:left;
    max-width:200px;
}
</style>
