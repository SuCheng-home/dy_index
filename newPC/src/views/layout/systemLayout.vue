<template>
    <div class="app-wrapper">
        <router-view></router-view>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import store from '@/store';
    import mixin from '@/mixins/windowResize';

    export default {
        name: "systemLayout",
        data() {
            return {
                token: this.$route.query.token
            }
        },
        created() {
            window.sessionStorage.setItem('pc_login_type', 'system');
        },
        mixins: [mixin],
        // beforeRouteEnter(to, from, next) {
        //     if (!store.getters.userInfo.id) {
        //         const matchArray = location.hash.match(/userToken=(.+?)(&|$)/);
        //         if(!window.sessionStorage.getItem('hasLogin') && matchArray) {
        //             Cookies.set('User-Token', matchArray[1]);
        //             store.dispatch('FromOldFramework',  matchArray[1]).then((res) => {
        //                 sessionStorage.setItem('vuex_info', JSON.stringify(res.data.data));
        //                 if(to.meta.permissionPath) {
        //                     if(store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
        //                         next('/404');
        //                     } else {
        //                         next();
        //                     }
        //                 } else {
        //                     next();
        //                 }
        //             }).catch(error => {
        //             });
        //         }
        //     } else {
        //         next();
        //     }
        // },
    }
</script>
