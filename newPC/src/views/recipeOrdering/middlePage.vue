<template>
<div class="middlePage"></div> 
</template>
<script>
import {possessRole} from "@/api/recipeOrdering";
export default {
  data() {
    return {     
    };
  },
  mounted() {
    this.possessRoles();
  },
  methods: {
     possessRoles() {
      possessRole(10069).then(res => {
        if (res.data.code === 200) {
          if(!res.data.data.result){
             this.$router.replace({path: "statistics"});
          }else{
                this.$router.replace({
                   path: "statisticsone"
                });
          }
        }
      });
    },
  }
};
</script>
