<template>
    <div>
        <div class="role-input el-table__body-wrapper" @click="dialogFormVisible = true">
            <div class="chosed-box ">
                <span v-for="item in headClassList" class="chosed-box-item">{{item.name}}</span>
            </div>
            <span v-show="headClassList.length===0" class="noda-info">点击选择范围</span>
        </div>
        <el-dialog title="选择角色" :visible.sync="dialogFormVisible" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' width="810px">
            <div class="all_role_list">
                <div class="line_box" :key="item.moduleId" v-for="item in roleList">
                    <div class="module_name">{{item.moduleName}}</div>
                    <div class="module_role_list">
                        <el-checkbox v-if="checkedRoleFilter(roleItem) && roleItem.isShow" class="role_item_box" v-for="roleItem in item.data" :key="roleItem.id"
                                     v-model="roleItem.isSelect" :disabled="roleItem.isChoose !== 1" @change="changeSelect(roleItem)">{{roleItem.name}}</el-checkbox>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="chooseClassColumn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {queryRoleAndModuleByUserId} from '@/api/systemSet/org.js';
export default {
    props: {
        value: {
            type: Array,
            default: []
        },
        chosedRoles: {//已选中的角色，新增情况为constantId集合，编辑为角色集合
            type: Array,
            default: []
        },
        userType:{//使用类型，默认为添加场景，edit为编辑场景，因为目前的角色添加场景是根据constantId判定，但编辑是根据角色集合判定
            type: String,
            default: 'add'
        },
        source:{
            type: String,
            default: 'teacher'
        },
        userId:{
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            dialogFormVisible: false,
            headClassList: [],
            roleList: [],
            sourceRoleList:[]
        }
    },
    watch: {
        value(val) {
            if(val){
                this.headClassList = val;
                // if(val.length > 0){ //如果已经有数据，此if判断用于二次过滤一些不可选的角色
                //     this.getRoleList(this.sourceRoleList);
                // }
            }
        },
        chosedRoles(val){
            if(val){
                if(this.userType === 'edit'){
                    this.getRoleList(this.sourceRoleList);
                }
            }
        },
        source(val){
            if(val){
                // this.getRoleList(this.sourceRoleList);
            }
        }
    },
    created() {
        this.queryRoleAndModuleByUserId();
    },
    methods: {
        changeSelect(val) {
            if (val && val.id) {
                this.roleList.forEach((item) => {
                    item.data.forEach((roleItem) => {
                        if (roleItem.id === val.id) {
                            roleItem.isSelect = val.isSelect;
                        }
                    });
                })
            }
        },
        queryRoleAndModuleByUserId() {
            let query = {
                userId: this.userId,
                source: this.source
            };
            queryRoleAndModuleByUserId(query).then(res=>{
                let data=res.data.data;
                this.sourceRoleList=data;

                this.getRoleList(data);
            }).catch();
        },
        getRoleList(data) {
            data.forEach((item) => {
                let lineData = JSON.parse(JSON.stringify(item)).data;
                lineData.forEach((roleItem) => {
                    if(this.userType === 'add'){
                        roleItem.isSelect = this.chosedRoles.indexOf(roleItem.constantId) > -1;
                        roleItem.isShow = this.hasRoleListForAdd(roleItem);
                    }else{
                        roleItem.isSelect = this.chosedRoles.map(item => item.id).indexOf(roleItem.id) > -1;
                        roleItem.isShow = this.hasRoleListForEdit(roleItem);
                    }
                });
                item.data = lineData;
            });

            this.roleList = data;
            this.setModelValue();
        },
        // 过滤掉不显示的互斥角色
        hasRoleListForAdd(roleItem){//过滤掉一些互斥的角色
            let isRole = false;
            if(roleItem){
                if(this.source === 'teacher'){
                    let numArray = [4, 5, 79, 80, 81];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
                if(this.source === 'import'){
                    let numArray = [3, 4, 5, 79, 81];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
                if(this.source === 'outside'){
                    let numArray = [3, 4, 5, 80, 81];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
                if(this.source === 'outflow'){
                    let numArray = [3, 4, 5, 79, 80];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
            }
            return isRole;
        },
        hasRoleListForEdit(roleItem){//过滤掉一些互斥的角色
            let isRole = false;
            if(roleItem){
                if(this.source === 'teacher'){
                    let numArray = [4, 79, 80, 81];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
                if(this.source === 'import'){
                    let numArray = [3, 4, 79, 81];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
                if(this.source === 'outside'){
                    let numArray = [3, 4, 80, 81];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
                if(this.source === 'outflow'){
                    let numArray = [3, 4, 79, 80];
                    if(numArray.indexOf(roleItem.constantId) < 0){
                        isRole = true;
                    }
                }
            }
            return isRole;
        },
        // 过滤不可选
        disabledRoleFilter(filterItem) {
            let filterResult = new Array();
            if(this.userType === 'add'){//如果是添加
                filterResult=this.chosedRoles.filter(function(item){
                    return item==filterItem.constantId;
                });
            } else {
                filterResult=this.chosedRoles.filter(function(item){
                    let result=false;
                    if(item.id === filterItem.id && item.isChoose !== 1){
                        result = true;
                    }
                    if (item.isChoose === 2) {
                    }
                    return result;
                });
            }
            return !!(filterResult.length > 0);
        },
        // 控制显示
        checkedRoleFilter(filterItem){
            let flag=true;
            if(this.userType !== 'add'){
                if(filterItem.constantId == '5'){//如果是编辑且当前是操作家长这个角色，则不显示家长
                    let filterResult=new Array();
                    filterResult=this.chosedRoles.filter(function(item){
                        return item.id == filterItem.id;
                    });
                    flag=filterResult.length>0?true:false;
                }
            }
            return flag;
        },
        handleCheckedCitiesChange(value) {
        },
        chooseClassColumn() {
            this.dialogFormVisible = false;
            this.setModelValue();
        },
        setModelValue(){//设置v-model的值，用在初始化赋值和点击确定按钮
            let chosedArray = new Array();
            let newChoseIds = new Array();
            // 显示选中的内容
            this.roleList.forEach((item) => {
                item.data.forEach((roleItem) => {
                    if (roleItem.isSelect && newChoseIds.indexOf(roleItem.id) < 0) {
                        newChoseIds.push(roleItem.id);
                        chosedArray.push(roleItem);
                    }
                });
            });

            this.headClassList = chosedArray;
            this.$emit('input',chosedArray);
        }
    }
}
</script>

<style scoped>
.role-input {
    border: 1px solid #bfcbd9;
    min-height: 36px;
    background-image: none;
    border-radius: 4px;
    max-height: 90px;
    overflow-y: auto;
    cursor: pointer;
}

.noda-info {
    color: #bfcbd9;
    padding-left: 10px;
}
.chosed-box{
    padding-top: 2px;
}
.chosed-box-item {
    height: 25px;
    margin-left: 4px;
    margin-top: 2px;
    /* margin-right: 5px; */
    line-height: 25px;
    display: inline-block;
    background-color: #eee;
    border-radius: 3px;
    padding-right: 4px;
    float: left;
    margin-bottom: 2px;
    padding-left: 4px;
}

.el-checkbox-div {
    width: 150px;
}

.clear {
    clear: both;
}
</style>

<style lang="scss" scoped>
    .all_role_list{
        .line_box{
            display: flex;
            .module_name{
                width: 130px;
                margin-right: 20px;
                text-align: right;
                font-weight: 700;
            }
            .module_role_list{
                flex: 1;
            }
        }
    }
</style>
