<template>
    
</template>

<script>
    import {listenClassRecordInfoById} from '@/api/teachingStudy/openClass';
    export default {
        name: "listenClassDetailTeacher",
        data() {
            return {
                id: this.$route.query.id
            }
        },
        mounted() {
            listenClassRecordInfoById(this.id)
                .then(res => res.data)
                .then(data => {
                    console.log(data.data)
                })
        }
    }
</script>

<style scoped>

</style>
