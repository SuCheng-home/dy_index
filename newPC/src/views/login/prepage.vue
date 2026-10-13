<template>

</template>

<script>
    export default {
        name: "prepage",
        data() {
            return {}
        },
        mounted() {
            console.log('enter prepage')
            const basePath = global.command === 'production' ? 'http://www.zhxiaoyuan.cn/#' : 'http://www.weixiaojia.net/boe/#';
            if(window.location.href.includes('abc.')) {
                this.$router.replace('/abcLogin')
            } else {
                this.$router.replace('/login')
            }
        }
    }
</script>

<style scoped>

</style>
