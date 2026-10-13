<template>
    <div class="dormitory_manage_container clearfix">
        <div class="left_tree_box">
            <el-button type="primary" @click="addBuilding" class="add_building_btn" size="medium">添加宿舍楼</el-button>
            <div class="menu_box custom—scrollbar" v-if="buildingList && buildingList.length">
                <div class="menu_item" :class="{'menuSelect': selectIndex === index}" :key="index" v-for="(item, index) in buildingList" @click="handleSelect(index, item)">
                    {{item.name}}
                </div>
            </div>
            <div class="no_building_text" v-else>暂无宿舍楼</div>
        </div>
        <div class="right_dormitory_manage_container">
            <div class="right_container">
                <router-view :currentBuilding="selectBuilding" @buildingChange="changeBuilding"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import {getSchoolDormBuildingList} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryManageIndex",
        data() {
            return {
                selectIndex: 0,
                buildingList: [],
                selectBuilding: {}
            }
        },
        created() {
            let pathUrl = this.$route.path;
            this.getSchoolDormBuildingList();

            // this.$router.push({path: 'building'});
            // if(!!pathUrl.match('/main/autoLearn/autoLearnStuFeatureList')){
            //     this.selectIndex = '1';
            // } else if(!!pathUrl.match('/main/autoLearn/autoLearnResourceCustomRules')){
            //     this.selectIndex = '2';
            // }

            // 初始调用接口，
            // 删除宿舍楼操作，事件抛回来重新调用，并重新指定this.selectBuilding的值
        },
        methods: {
            addBuilding() {
                this.$router.replace('buildingAdd');
            },
            handleSelect(key, item) {
                this.selectIndex = key;
                this.selectBuilding = item;
                this.$router.replace({path: 'building'});
            },
            changeBuilding(val) {
                this.getSchoolDormBuildingList(val);
            },
            getSchoolDormBuildingList(isAdd) {
                getSchoolDormBuildingList().then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.buildingList = data;
                        if (isAdd && isAdd === 'add') {
                            this.selectBuilding = data&&data.length ? data[data.length - 1] : {};
                            this.selectIndex = data.length - 1;
                        } else if (!!isAdd && data.map(item => item.id).indexOf(isAdd) > -1) {
                            this.selectBuilding = data&&data.length ? data[data.map(item => item.id).indexOf(isAdd)] : {};
                        } else {
                            this.selectBuilding = data&&data.length ? data[0] : {};
                            this.selectIndex = 0;
                        }
                    }
                }).catch();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/style";
    .dormitory_manage_container{
        
        .left_tree_box {
            float: left;
            width: 160px;
            height: 100%;
            padding: 10px 0;
            background: #fff;
            background: rgba(255, 255, 255, .7);
            border-right: 1px solid #e6e6e6;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .add_building_btn{
                width: 76%;
                margin: 10px 12%;
            }
            .menu_box{
                flex: 1;
                overflow: hidden auto;
                .menu_item{
                    height: 56px;
                    line-height: 56px;
                    position: relative;
                    box-sizing: border-box;
                    font-size: 14px;
                    color: #303133;
                    padding: 0 20px;
                    cursor: pointer;
                    white-space: nowrap;
                    list-style: none;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .menuSelect{
                    color: #409EFF;
                }
            }
            .no_building_text{
                height: 20px;
                line-height: 20px;
                margin: 10px 0;
                text-align: center;
                color: #999;
            }
        }
        .right_dormitory_manage_container{
            height: 100%;
            margin-left: 160px;
            .right_container{
                width: 100%;
                height: 100%;
                padding-right: 15px;
                padding-left: 15px;
                box-sizing: border-box;
                position: relative;
                overflow: hidden auto;
            }
        }
    }
</style>
