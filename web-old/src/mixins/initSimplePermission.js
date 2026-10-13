import Common from '@/utils/common.js';
import {getUserPerm} from '@/api/systemSet/permission.js';
export default {
    data() {
        return {
            promisList:[]
        }
    },
    mounted () {
        this.promisList=JSON.parse( localStorage.getItem('_simplepermission'));
        this.promisList.forEach(function(item){
           // console.log(item.component,item.name);
        });
    },
    methods: {
        hasRoleByComponent(comment){
            return Common.hasRoleByComponent(this.promisList,comment);
        },
        getRoleNameByComponent(comment){
            return Common.getRoleNameByComponent(this.promisList,comment);
        }
    }
}