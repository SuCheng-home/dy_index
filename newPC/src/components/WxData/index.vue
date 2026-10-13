<template>
    <span v-if="schoolInfo.schoolType != 11 ||
    (type === 'departmentName' && !/^\d+$/.test(openid.toString().trim())) ||
    (type === 'userName' && !/^\w+$/.test(openid.toString().trim()))">{{openid}}</span>
    <span v-else>
        <ww-open-data :type="type" :openid="openid" />
    </span>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "index",
        props: {
            type: {
                type: String,
                default: 'userName'
            },
            openid: {
                required: true
            }
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        watch: {
            type() {
                this.bindFunc();
            },
            openid() {
                this.bindFunc();
            }
        },
        mounted() {
            this.bindFunc();
        },
        methods: {
            bindFunc() {
                if(this.schoolInfo.schoolType == 11) {
                    if(this.type === 'departmentName' && /^\d+$/.test(this.openid.toString().trim()) ||
                        (this.type === 'userName' && /^\w+$/.test(this.openid.toString().trim()))) {
                        window.WWOpenData.bind(this.$el);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
