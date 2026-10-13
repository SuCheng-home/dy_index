<template>
    <div></div>
</template>

<script>
    import Cookies from 'js-cookie';
    import {userSign} from '@/api/login';
    export default {
        name: "eduLogin",
        data() {
            return {
                orgCode: this.$route.query.orgCode,
                userSign: this.$route.query.userSign,
                state: this.$route.query.state,
                id: this.$route.query.id
            }
        },
        mounted() {
            userSign({
                orgCode: this.orgCode,
                userSign: this.userSign
            })
                .then(response => {
                    const pageData = response.data.data;

                    Cookies.set('Admin-Token', pageData.token);
                    this.$store.commit('SET_TOKEN', pageData.token);
                    this.$store.commit('SET_USERINFO', pageData.userPageModel);
                    this.$store.commit('SET_SCHOOLINFO', pageData.schoolPageModel);
                    this.$store.commit('SET_ROLES', pageData.roleList);
                    this.$store.commit('SET_DEPARTS', pageData.departList);
                    this.$store.dispatch('GetPermission')
                        .then(() => {
                            const basePath = global.command === 'production' ? 'http://www.zhxiaoyuan.cn/#' : 'http://www.weixiaojia.net/boe/#';
                            switch (this.state) {
                                case '':
                                    break;
                                default:
                                    window.location.replace(`${basePath}/comprehensiveStatistics/comprehensiveStatisticsSchool?id=${this.id}`);
                                    break;
                            }
                        });


                });
        }
    }
</script>

<style scoped>

</style>
