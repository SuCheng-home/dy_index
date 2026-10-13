<template>
    <div>
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.isCached"></router-view>
            </keep-alive>
        </transition>
        <transition name="fade" mode="out-in">
            <router-view v-if="!$route.meta.isCached"></router-view>
        </transition>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import store from '@/store';

    function jumpToLogin() {

    }

    export default {
        name: "StandaloneLayout",
        data() {
            return {
                token: this.$route.query.token
            }
        },
        created() {
            this.$store.commit('SET_PC_TYPE', 'standalone');
        },
        beforeRouteEnter (to, from, next) {
            if(!store.getters.userInfo.id) {
                const matchArray = location.hash.match(/userToken=(.+?)(&|$)/);
                if(!window.sessionStorage.getItem('hasLogin') && matchArray) {
                    Cookies.set('User-Token', matchArray[1]);
                    store.dispatch('FromOldFramework',  matchArray[1]).then((res) => {
                        sessionStorage.setItem('vuex_info', JSON.stringify(res.data.data));
                        if(to.meta.permissionPath) {
                            if(store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                                next('/404');
                            } else {
                                next();
                            }
                        } else {
                            next();
                        }
                    })
                        .catch(error => {
                        });
                }

            } else {
                next();
            }
        },
    }
</script>

<style scoped>

</style>
