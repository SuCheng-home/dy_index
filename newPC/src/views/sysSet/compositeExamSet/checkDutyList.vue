<template>
    <div class="checkDutyList">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button size="medium" type="primary" @click="addCompositeCheckItemGroupList()">保存</el-button>
        </div>
        <div class="main-wrap">
            <div class="box-top">
              <el-radio-group v-model="tabPosition" size="medium"  @change="tabPositionfun">
                    <el-radio-button label="1">检查组设置</el-radio-button>
                    <el-radio-button label="2">值班组设置</el-radio-button>
                    <el-radio-button label="3">检查项设置</el-radio-button>
                </el-radio-group>
            </div>
             <div class="section section--buff"  :key="indexs" v-for="(items,indexs) in dataList">
                <div class="section__header">
                    <div class="color-block"></div>
                    {{items.groupName}}
                </div>
                <div class="section__main"  >
                    <div class="score-item"  @click="deletefun(indexs,index)" :key="index" v-for="(item,index) in items.compositeCheckItemGroupList" >
                        <span class="fa fa-trash"></span>
                       {{item.itemName}}
                    </div>
                    <div class="score-item-add" @click="addfun(items,indexs)">+</div>
                </div>
            </div>           
        </div>
        <el-dialog title="添加检查项"
            :visible.sync="isShowDialog"
            width="50%"
        >
            <el-checkbox-group v-model="checkList"  >
                <el-checkbox :label="item.id" :key="index" v-for="(item,index) in typeList" border>
                    {{item.itemName}}
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addScoreItemSubmit">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {getDutyById,getCheckGroupList,getCheckItemListAll,addCompositeCheckItemGroupList} from '@/api/compositeExamSet';

    export default {
        data() {
            return {
                dutyId: this.$route.query.dutyId,
                dataList: [],
                tabPosition:3,
                isStar:1,
                typeList:[],
                indexs:0,
                isShowDialog:false,
                checkList:[]
            }
        },
        created() {
            getDutyById({
                    dutyId: this.$route.query.dutyId
                }).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let totalArray = data.data;                        
                        this.isStar = totalArray.isStar;
                        this.getCheckItemListAll()
                    }
                }).catch(() => {

                })
            this.getCheckGroupList()
           
        },
        mixins: [mixin],
        methods: {
            deletefun(one,two){
              this.dataList[one].compositeCheckItemGroupList.splice(two,1)
            },
            addCompositeCheckItemGroupList(){
                let biglist=[]
                for(let i=0;i<this.dataList.length;i++){
                    let compositeCheckItemGroupList=[]
                    for(let j=0;j<this.dataList[i].compositeCheckItemGroupList.length;j++){
                        compositeCheckItemGroupList.push({
                            checkGroupId:this.dataList[i].id,
                            dutyId: this.$route.query.dutyId,
                            itemId:this.dataList[i].compositeCheckItemGroupList[j].itemId
                        })
                    }
                    biglist.push({
                        checkGroupId:this.dataList[i].id,
                        dutyId: this.$route.query.dutyId,
                        compositeCheckItemGroupList:compositeCheckItemGroupList
                    })
                }
                addCompositeCheckItemGroupList(biglist).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                        type: 'success',
                        message: '保存成功！'
                        });
                          this.getCheckGroupList()
                    } else {
                        this.$message({
                        type: 'warning',
                        message: data.msg
                        });
                    }
                    })
            },
            addfun(obj,indexs){
                this.indexs=indexs;
                this.isShowDialog=true;
                this.checkList=[];
                for(let i=0;i<obj.compositeCheckItemGroupList.length;i++){
                    this.checkList.push(obj.compositeCheckItemGroupList[i].itemId)
                }
            },
            addScoreItemSubmit(){
                this.dataList[this.indexs].compositeCheckItemGroupList=[]
                for(let i=0;i<this.checkList.length;i++){
                    for(let j=0;j<this.typeList.length;j++){
                        if(this.checkList[i]==this.typeList[j].id){
                            this.typeList[j].itemId=this.typeList[j].id
                           this.dataList[this.indexs].compositeCheckItemGroupList.push(this.typeList[j])
                        }
                    }
                }
                 this.isShowDialog=false;

            },
            getCheckGroupList(){
                 this.dataList=[];
                getCheckGroupList({
                    dutyId: this.$route.query.dutyId
                }).then(res => {
                    let data = res.data;
                    if(data.data&&data.data.length){
                       this.dataList=data.data
                    }
                }).catch(() => {

                })
            },
            getCheckItemListAll(){
                 this.typeList=[];
                getCheckItemListAll({
                    isStar: this.isStar
                }).then(res => {
                    let data = res.data;
                    if(data.data&&data.data.length){
                       this.typeList=data.data
                    }
                }).catch(() => {

                })
            },
             tabPositionfun(){
                if(this.tabPosition==2){
                     this.$router.replace({
                    path: 'editDutytwo',
                    query: {
                        dutyId: this.dutyId
                    }
                })
                }
                if(this.tabPosition==1){
                      this.$router.replace({
                    path: 'editDuty',
                    query: {
                        dutyId: this.dutyId
                    }
                })
                }
               
            },
            goback() {
                this.$router.push({
                    path: 'dutyDetail',
                    query: {
                        dutyId: this.dutyId
                    }
                })
            },
            addCheckItem() {
                this.$router.push({
                    path: 'addCheckDuty',
                    query: {
                        dutyId: this.dutyId,
                        isStar:this.isStar
                    }
                })
            },
            editCheckDuty(id) {
                this.$router.push({
                    path: 'editCheckDuty',
                    query: {
                        id: id,
                        dutyId: this.dutyId,
                        isStar:this.isStar
                    }
                })
            },
        }
    }
</script>
<style>
.checkDutyList .is-bordered{
    margin: 5px !important;
}
</style>

<style scoped lang="scss">
  .section__header {
        line-height: 20px;
        border-left: 3px #409eff solid;
        padding-left: 10px;
        font-size: 15px;
        color: #666;
        font-weight: 600;
        margin: 20px 0;
    }
    .section__main {
        margin: 20px 10px;
        overflow: hidden;
    }
    .fa-trash {
        display: none;
    }
    .score-item {
        width: 170px;
        height: 60px;
        border-radius: 15px;
        line-height: 60px;
        float: left;
        margin: 5px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        .fa{
            color: #fff !important;
        }
        &:hover {
            opacity: 0.7;
            .fa-trash {
                display: inline-block;
            }
        }
    }
    .section--buff {
        .score-item {
            border: 1px solid #409eff;
            background-color: #409eff;
        }
    }
    .section--penalty {
        .score-item {
            border: 1px solid #f56c6c;
            background-color: #f56c6c;
        }
    }
    .score-item-add {
        border: 1px solid #ccc;
        width: 170px;
        height: 60px;
        border-radius: 15px;
        line-height: 60px;
        float: left;
        margin: 5px;
        text-align: center;
        cursor: pointer;
        font-weight: bold;
        font-size: 30px;
        color: #ccc;
        &:hover {
            box-shadow: 0 0 5px #999;
        }
    }
.top {
      padding-bottom: 10px;
      border-bottom: 1px solid  #e7eaec;
    }
    .box-top{
    margin: 0 auto;
    width: 340px;
    padding: 10px 0;
}
    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    ul, li {
        list-style: none;
    }

    .checkDutyList {
        padding:12px;
    }
</style>
