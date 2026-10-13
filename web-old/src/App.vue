<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      
    }
  },
  mounted(){

  }
}
</script>
<style lang="scss">
body{
  box-sizing:border-box;
  text-decoration:none;
  font-size:14px;
}
a:hover, a:focus{
  text-decoration: none;
}
body,html{
  width:100%;
  height:100%;
}
#app {
  width:100%;
  min-height:100%;
  min-width:1200px;
  overflow-x: hidden;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0
}

.clearfix {
  zoom: 1;
}
::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background-color: #999;
}

::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>

