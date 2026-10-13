<template>
    <div class="addCheckDuty">
        <div class="el-row">
            <div class="top">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button size="medium" type="primary" @click.native="dormitoryInspectionadd()">编辑</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm" size="small">
                <div class="title">检查组</div>
                <el-form-item label="检查组名称">
                   {{ruleForm.title}}
                </el-form-item>
                <el-form-item label="检查范围" >
                   <span v-for="item in ruleForm.checkScope" :key="item.id" >
                       {{item.dormName}}
                    </span>
                 </el-form-item>
                 <el-form-item label="评价方式" >
                     {{ruleForm.isStar==1?"打星":"打分"}}
                 </el-form-item>
                 <el-form-item label="是否设置默认分数" >
                      {{ruleForm.isDefaultScore==1?"是":"否"}}
                  </el-form-item>
                  <el-form-item label="默认分数" v-if="ruleForm.isDefaultScore==1" >
                        {{ruleForm.defaultScore}}
                 </el-form-item>
                 <el-form-item label="是否推送报告" >
                    {{ruleForm.isPushResult==1?"是":"否"}}
                </el-form-item>
                <el-form-item label="推送报告时间" v-if="ruleForm.isPushResult==1" >
                    {{ruleForm.pushResultTime}}
                </el-form-item>
                <el-form-item label="是否推送班主任" >
                    {{ruleForm.isPushClassHeader==1?"是":"否"}}
                </el-form-item>
                <el-form-item label="低于多少分推送" v-if="ruleForm.isPushClassHeader==1" >
                    {{ruleForm.minScore}}
                </el-form-item>
                <div class="title">值班</div>
                    <el-form-item v-for="(item, index) in groupUserList" :key="index" :label="item.weekNamer + '检查员：'">
                        {{ item.addressData.userJson.map(user => user.name).join('、') }}
                    </el-form-item>
                <div class="title">检查项</div>
                <div class="check-items">
                    <div 
                        v-for="(item) in itemList" 
                        :key="item.id" 
                        class="check-item active">
                        <div class="check-item-content">
                            {{ item.title }}
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getGroup, getGroupItemList, getItemList} from '@/api/dormitoryInspection';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            const weekNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            const groupUserList = []
            for (let i = 0; i < 7; i++) {
            groupUserList.push({
                weekNamer: weekNames[i],
                weekNumber: i + 1,
                addressData: {
                userJson: []
                }
            })
            }
            return {
                id: this.$route.query.id,
                ruleForm: {
                    title: '',
                    checkScope: [],
                    defaultScore: '',
                    isDefaultScore: 2,
                    isPushClassHeader: 2,
                    isPushResult: 2,
                    isStar: 1,
                    minScore: 60,
                    pushResultTime:'21:00',
                    title:""
                },
                groupUserList: groupUserList,
                groupItemList: [],
                itemList: []
            }
        },
        created() {
            this.getGroupItemList()
            getGroup(this.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let totalArray = data.data;
                        totalArray.checkScope= JSON.parse(totalArray.checkScope)
                        const checkUserJson = JSON.parse(data.data.checkUserJson || '[]')
                        this.ruleForm = totalArray
                        if (checkUserJson.length > 0) {
                            this.groupUserList = checkUserJson
                        }
                    }
                })
        },
        mixins: [mixin],
        methods: {
            async getGroupItemList() {
                try {
                    const res = await getGroupItemList({
                        groupId: this.id
                    })
                    this.groupItemList = (res.data.data || []).map(i => i.itemId)
                    this.getItemList()
                } catch (error) {
                    console.error('获取检查项失败:', error);
                }
            },
            getItemList() {
                getItemList({
                    title: '',
                    pageNo: 1,
                    pageSize: 9999,
                }).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.itemList = data.data.dataList.filter(i => this.groupItemList.includes(i.id))
                    }
                }).catch(() => {
                })
            },
            dormitoryInspectionadd() {
                this.$router.push({
                    path: 'dormitoryInspectionadd',
                    query: {
                        id: this.id
                    }
                })
            },
           
        }
    }
</script>
<style lang="scss" scoped>
    .top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }
    .totalScore{
        float: right;
        color:#67C23A;
    }
    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    .demo-ruleForm {
        width: 810px;
        margin: 0 auto;
    }

    ul, li {
        list-style: none;
    }

    .addCheckDuty {
        padding: 12px;
    }

    .main-wrap {
        width: 100%;
        padding-top: 20px;
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }

    .jia_btn {
        font-size: 32px;
        line-height: 1;
        padding: 0;
        display: inline-block;
    }

    .scoreShow {
        padding: 0 20px;
        display: inline-block;
        min-width: 200px;
    }

    .totalScore {
        line-height: 36px;
        padding: 0 20px;
    }

    .login-box {
        float: left;
        width: 100px;
        height: 100px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 20px;

        img {
            display: block;
            width: 100px;
            height: 100px;
        }
    }

    .logoAdd {
        float: left;
        width: 100px;
        height: 100px;
        padding-top: 17px;
        line-height: 1;
        border: 1px solid #d0d0d0;
        background-color: #fbfdff;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;

        .navAddIcon {
            font-size: 40px;
            color: #8c939d;
            width: auto;
            height: auto;
        }

        .navAddTitle {
            font-size: 14px;
            color: #8c939d;
            display: block;
            margin-top: 10px;
        }
    }

    .logoAdd:hover {
        border: 1px solid #409EFF;
    }

    .logoAdd:hover .navAddIcon {
        color: #409EFF;
    }

    .logoAdd:hover .navAddTitle {
        color: #409EFF;
    }

    .dialoglinkBox {
        .check-select {
            position: absolute;
            top: 0;
            right: 9px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            z-index: 10;
        }

        .checkitem {
            width: 100px;
            float: left;
            position: relative;
            margin-right: 10px;

            .checkitem-box {
                width: 100px;
                padding: 10px 0;
                float: left;
                text-align: center;
                position: relative;

                .check-img {
                    width: 66px;
                    height: 66px;
                    display: block;
                    border-radius: 6px;
                    margin: 0 auto;
                }

                .check-title {
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .link-title {
                    font-size: 14px;
                    color: #333;
                    line-height: 26px;
                    margin-bottom: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

            }
        }
    }
</style>
<style lang="scss" scoped>
.title{
    line-height: 20px;
    font-size: 16px;
    border-left: 3px solid #409eff;
    padding-left: 10px;
    margin: 15px 0;
    color:#111;
}
    .addCheckDuty{
         .el-select {
            width: 100%;
        }
        .el-radio-group {
            height: 36px;
            line-height: 1;
            padding-top: 10px;
        }
    }
.check-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
}

.check-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s;
  cursor: pointer;
  min-width: 200px;
  max-width: 300px;
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }
  
  &.active {
    border-color: #1890ff;
    background: #e6f7ff;
  }
}

.check-item-content {
  flex: 1;
  margin-right: 12px;
}
</style>
