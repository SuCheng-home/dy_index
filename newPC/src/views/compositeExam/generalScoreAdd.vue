<template>
    <div class="generalStarAdd">
        <div class="el-row menu-tools">
            <el-button size="medium" @click="$router.back()">返回</el-button>
            <el-button type="primary" size="medium" @click="batchSave()">提交</el-button>
        </div>
        <div class="content-wrap scrollBar" :style="`height:${nobottommaxH}px`">
            <h2>
                {{detailList.className}}
            </h2>
            <div class="relationRow">
                <div class="left-title">评价</div>
                <div class="right-content-teshu">
                <div class="class-score">
                    <div>{{detailList.score === null ? '暂未评' : detailList.score}}分</div>
                </div>
                </div>
            </div>
            <div class="relationRow">
                <div class="weui_cells weui_cells_form weui_cells_form--item check-item"
                     v-for="(scoreItem, scoreIndex) in detailList.scoreList" :key="scoreIndex">
                    <div class="weui_cell weui_cell_select weui_select_after">
                        <div class="weui_cell_hd weui_cell_primary check-item-id">
                            {{scoreItem.checkItemName}}
                        </div>
                        <div class="weui_cell_bd">
                            <el-input-number   @change="scoreChangeHandler(scoreItem)" v-if="scoreItem.newScoreMax>=0" size="medium" v-model="scoreItem.score" :precision="1" :step="0.1" :min="0" :max="scoreItem.newScoreMax"></el-input-number>
                            <el-input-number   @change="scoreChangeHandler(scoreItem)" v-else v-model="scoreItem.score"  size="medium" :precision="1" :step="0.1" :max="0" :min="scoreItem.newScoreMax"></el-input-number>
                            <!-- <select class="weui_select check-item-select"
                                    @change="scoreChangeHandler(scoreItem)" v-model="scoreItem.score"
                                    style="padding-right: 30px;">
                                <template v-if="scoreItem.newScoreMax >= 0">
                                    <option v-for="(num,index) in Math.abs(scoreItem.newScoreMax*2)" :value="num/2"
                                            :key="index">
                                        {{num/2}}分
                                    </option>
                                </template>
                                <template v-else>
                                    <option :value="0" :key="index">
                                        0分
                                    </option>
                                    <option v-for="(num,index) in Math.abs(scoreItem.newScoreMax*2)" :value="-num/2"
                                            :key="index">
                                        {{-num/2}}分
                                    </option>
                                </template>
                            </select> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="relationRow"
                 v-if="detailList.nameAndIsWorkList&&detailList.nameAndIsWorkList.length!=0">
                <div class="left-title">老师</div>
                <div class="right-content">
                    <div style="display:block">
                        <template v-for="(item,index) in detailList.nameAndIsWorkList">
                            <div class="weui_cell weui_cell_switch" :key="index" style="margin-bottom:10px;">
                                <div class="weui_cell_hd weui_cell_primary">{{item.teacherName}}</div>
                                <div class="weui_cell_ft">
                                    <el-switch
                                        v-model="item.isWork" active-value="1"
                                        inactive-value="2">
                                    </el-switch>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="relationRow quickEvaluation-ul" v-if="quickEvalutionList&&quickEvalutionList.length!==0">
                <div class="quickEvaluationLi"
                     v-for="(quickEvalutionItem,quickEvaIndex) in quickEvalutionList"
                     :key="quickEvaIndex"
                     :class="{'checked':quickEvalutionItem.isQuickShow}"
                     @click.stop="quickHandler(quickEvalutionItem)">
                    {{quickEvalutionItem.value}}
                </div>
            </div>
            <div class="relationRow">
                <el-input type="textarea" v-model.trim="detailList.batchContent" :rows="4" :maxlength="200"
                          placeholder="备注"></el-input>
            </div>
            <div class="relationRow">
                <uploader pathPrefix="zonghejiancha" module="zonghejiancha" moduleCode="2006" multiple v-model="files"
                          :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image"
                          showResult="image"></uploader>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    import {findSchoolDicsByCode, getCheckDateById, saveCheckData, getItemById} from '@/api/generalCheckN';

    export default {
        components: {
            Uploader
        },
        data() {
            return {
                dutyId: this.$route.query.dutyId,
                itemId: this.$route.query.itemId,
                checkId: this.$route.query.checkId ? this.$route.query.checkId : '',
                UploadPath: global.BasePath + 'common/addImageUp', //图片上传路径
                detailList: {
                    batchContent: '',
                    batchContentCodes: '',
                    checkItemStr: '',
                    classId: null,
                    className: '',
                    classOrder: null,
                    dutyId: null,
                    gradeId: null,
                    gradeName: '',
                    gradeOrder: null,
                    id: null,
                    isStar: null,
                    itemId: null,
                    itemName: '',
                    picJson: '',
                    picList: [],
                    score: 0,
                    scoreList: [],
                    teacherUserId: '',
                    teacherUserName: '',
                    toWork: 0,
                    toWorks: '',
                    nameAndIsWorkList: [],                   
                },
                exhibitionImg: [],
                detailObject: {},
                quickEvalutionList: [],
                files: [],
                isRemindClassHeader: this.$route.query.isRemindClassHeader
            }
        },
        created() {
            this.detailObject = {};
            //判断是否有快捷项
            if (Number(window.sessionStorage.getItem("isQuickEvaluation")) === 0) {
                this.findSchoolDicsByCodeFunc(window.sessionStorage.getItem("quickEvaluationDCode"));
            } else {
                this.quickEvalutionList = [];
                this.dataHandler();
            }
        },
        mounted() {

        },
        mixins: [mixin],
        methods: {
            //处理图片名
            fileNameUse(file) {
                return file.indexOf('?') !== -1 ? file.slice(0, file.indexOf('?')) : file;
            },
            // beforeAvatarUpload(file) {
            //   if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(file.type) === -1) {
            //       this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
            //       return false;
            //   }
            //   return true;
            // },
            // handleRemove(file) {
            //     let key=file.id;
            //     this.exhibitionImg.forEach((item,index)=>{
            //         if(item.id==key){
            //             this.exhibitionImg.splice(index,1);
            //         }
            //     })
            // },
            // handleSuccess(res){
            //   let data=res.data;
            //   this.exhibitionImg.push({
            //       fileid:data.fileid,
            //       id:data.id,
            //       url:data.url
            //   })
            // },
            scoreChangeHandler() {
                /*计算总分*/
                 this.detailList.score = (this.detailList.scoreList.reduce((total, scoreItem) => total + (scoreItem.score-0), 0)).toFixed(1);
            },
            quickHandler(item) {
                //处理快捷项
                if (item.isQuickShow == false) {
                    item.isQuickShow = true;
                    if (this.detailList.batchContent == '') {
                        this.detailList.batchContent += item.value;
                        this.detailList.batchContentCodes += item.code;
                    } else {
                        this.detailList.batchContent += `,${item.value}`;
                        this.detailList.batchContentCodes += `,${item.code}`;
                    }
                } else if (item.isQuickShow == true) {
                    item.isQuickShow = false;
                    this.detailList.batchContent = this.detailList.batchContent.replace(item.value, '');
                    this.detailList.batchContentCodes = this.detailList.batchContentCodes.replace(item.code, '');
                    if (this.detailList.batchContent.charAt(0) == ',') {
                        this.detailList.batchContent = this.detailList.batchContent.replace(',', '');
                        this.detailList.batchContentCodes = this.detailList.batchContentCodes.replace(',', '');
                    }
                    if (this.detailList.batchContent.charAt(this.detailList.batchContent.length - 1) == ',') {
                        this.detailList.batchContent = this.detailList.batchContent.substring(0, this.detailList.batchContent.lastIndexOf(","));
                        this.detailList.batchContentCodes = this.detailList.batchContentCodes.substring(0, this.detailList.batchContentCodes.lastIndexOf(","));
                    }
                    if (this.detailList.batchContent.indexOf(",,") !== -1) {
                        this.detailList.batchContent = this.detailList.batchContent.replace(',,', ',');
                        this.detailList.batchContentCodes = this.detailList.batchContentCodes.replace(',,', ',');
                    }
                }
            },
            batchSave() {
                let spaceReduce = this.detailList.scoreList.reduce((total, scoreItem) => total + (scoreItem.score-0), 0);
                if (this.detailList.score === null && spaceReduce !== 0) {
                    this.detailList.score = spaceReduce;
                }
                this.detailList.checkItemStr = JSON.stringify(this.detailList.scoreList);
                this.detailList.picList = this.files.map((item) => ({
                    picUrl: item.fileUrl,
                    fileName: item.fileName
                }))
                const nameArray = [], stateArray = [],teacherUserId=[];
                this.detailList.nameAndIsWorkList.forEach((item) => {
                    nameArray.push(item.teacherName);
                    stateArray.push(item.isWork == 1 ? 1 : 2);
                    teacherUserId.push(item.teacherId);
                });
                //this.detailList.checkItemStr=JSON.stringify(this.detailList.scoreList);
                this.detailList.teacherUserId = teacherUserId.join(',');
                this.detailList.toWork = 0;
                this.detailList.teacherUserName = nameArray.join(',');
                this.detailList.toWorks = stateArray.join(',');
                this.detailList.picJson = JSON.stringify(this.detailList.picList || []);
                this.detailList.isRemindClassHeader = this.isRemindClassHeader;
                let That = this;
                if(this.$route.query.isUpdateHis){
                     this.detailList.isUpdateHis=this.$route.query.isUpdateHis;
                }
                console.log(That.detailList)
                this.$confirm('确认提交么？', '提示', {
                    type: 'warning'
                }).then(() => {
                    delete That.detailList.nameAndIsWorkList;
                    delete That.detailList.picList;
                    delete That.detailList.scoreList;
                    saveCheckData(That.detailList)
                        .then(res => {
                            const data = res.data;
                            if (data.code == 200) {
                                That.$message({
                                    type: 'success',
                                    message: '提交成功！',
                                })
                                That.$router.replace({
                                    path: 'generalCheckN',
                                    query: {
                                        dutyId: That.dutyId,
                                        itemId: That.itemId
                                    }
                                })
                                That.$router.back();

                            } else {
                                That.$message({
                                    message: data.msg,
                                    type: 'warn'
                                });
                            }
                        }).catch(res => {
                        That.$message({
                            message: "添加失败！",
                            type: 'warn'
                        });
                    });
                }).catch(() => {

                });
            },
            dataHandler() {
                //有数据的情况，读接口
                if (this.checkId) {
                    getItemById({
                        itemId: this.itemId
                    }).then(res => res.data)
                        .then(data => {
                            if (data.code === 200 && data.data) {
                                const checkList = data.data.checkList;
                                this.getCheckDateByIdFunc(checkList);
                            }
                        })
                } else {
                    //没有数据的情况，读取缓存里面的数据
                    //为什么读缓存数据，可能是后端不会，他说做不了
                    this.detailObject = JSON.parse(window.sessionStorage.getItem("classItem"));
                    this.detailList = this.detailObject;
                    this.detailList.batchContent = '';
                    this.detailList.batchContentCodes = '';
                    this.detailList.checkItemStr = '';
                    this.detailList.dutyId = this.dutyId;
                    this.detailList.id = '';
                    this.detailList.picJson = '';
                    this.detailList.score = null;
                    this.detailList.teacherUserId = '';
                    this.detailList.toWork = 0;
                    this.detailList.toWorks = '';
                    this.detailList.picList = [];
                }
            },
            findSchoolDicsByCodeFunc(dicCode) {
                findSchoolDicsByCode({
                    dicCode: dicCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.quickEvalutionList = data.data;
                            this.quickEvalutionList.forEach((item) => {
                                this.$set(item, "isQuickShow", false);
                                // item.isShow=false
                            });
                            this.dataHandler();

                        }
                    })
            },
            getCheckDateByIdFunc(checkList) {
                getCheckDateById({
                    id: this.checkId
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.detailList = data.data;
                            const nameArray = [], stateArray = [];
                            this.detailList.nameAndIsWorkList.forEach(item => {
                                nameArray.push(item.teacherName);
                                stateArray.push(item.isWork == '1' ? 1 : 2);
                            });
                            for (var i = 0; i < this.detailList.picList.length; i++) {
                                let fileName = this.fileNameUse(this.detailList.picList[i].picUrl).replace(/.+\//, "");
                                this.files.push({
                                    fileName: fileName,
                                    fileUrl: this.detailList.picList[i].picUrl
                                })

                            }
                            //   this.files=this.detailList.picList.map((item,index)=>({
                            //     fileName:item.fileName,
                            //     fileUrl:item.picUrl
                            //   }))
                            this.detailList.teacherUserName = nameArray.join(',');

                            this.detailList.scoreList = checkList.map((checkItem, checkIndex) => {
                                if(this.detailList.scoreList[checkIndex]) {
                                    return ({
                                        checkItemId: this.detailList.scoreList[checkIndex].checkItemId ? this.detailList.scoreList[checkIndex].checkItemId : checkItem.checkItemId,
                                        checkItemName: this.detailList.scoreList[checkIndex].checkItemName ? this.detailList.scoreList[checkIndex].checkItemName : checkItem.checkName,
                                        score: this.detailList.scoreList[checkIndex].score,
                                        newScoreMax: checkItem.checkScore,
                                        totalScore: checkItem.checkScore
                                    })
                                } else {
                                    return {
                                        checkItemId: checkItem.checkItemId,
                                        checkItemName: checkItem.checkName,
                                        score: '',
                                        newScoreMax: checkItem.checkScore,
                                        totalScore: checkItem.checkScore
                                    }
                                }
                            });
                            this.detailList.toWorks = stateArray.join(',');
                            if (this.detailList.batchContent) {
                                this.detailList.batchContentCodeList.forEach((batchItem) => {
                                    this.quickEvalutionList.forEach((quickItem) => {
                                        if (batchItem == quickItem.code) {
                                            quickItem.isQuickShow = true;
                                        }
                                    })
                                })
                            } else {
                                this.detailList.batchContent='';
                                this.detailList.batchContentCodes = '';
                            }

                        }
                    })
            }
        }
    }
</script>
<style lang="scss" scoped>
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

    .generalStarAdd {
        width: 100%;
        padding:12px;
        box-sizing: border-box;
        background: #fff;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        h2 {
            font-size: 20px;
            color: #000;
            line-height: 30px;
            padding: 10px 0;
            text-align: center;
            font-weight: 600;
        }

        .content-wrap {
            padding-top: 20px;
            box-sizing: border-box;
        }

        .rowItem {
            width: 100%;
            font-size: 14px;
            padding: 10px 15px;
            box-sizing: border-box;
            display: flex;
            // justify-content: space-between;
            align-items: center;

            .left-title {
                width: 46px;
                text-align: left;
                color: #333;
            }
        }

        .relationRow {
            // width: 100%;
            line-height: 34px;
            text-align: left;
            font-size: 14px;
            padding: 10px 15px;
            box-sizing: border-box;
        }

        .relationRow:after {
            clear: both;
            height: 0;
            display: block;
            content: "";
            visibility: hidden;
        }

        .relationRow .left-title {
            float: left;
            width: 20%;
            line-height: 34px;
            text-align: left;
            padding-right: 2%;
            box-sizing: border-box;
            font-size: 14px;
            padding-left: 24px;

        }

        .relationRow .right-content {
            float: left;
            width: 80%;
            font-size: 14px;
            padding-right: 20px;
            box-sizing: border-box;

            .big-star-title {
                margin-top: 4px;
            }
        }

        .relationRow .right-content-teshu {
            float: left;
            width: 80%;
            text-align: right;
            padding-right: 30px;
            box-sizing: border-box;
            font-size: 14px;

            .class-score {
                padding-right: 55px;
            }

            .big-star-title {
                margin-top: 4px;
            }
        }
    }

    .weui_cell {
        position: relative;
        display: flex;
        align-items: center;
    }

    .weui_cells_form .weui_cell_hd {
        padding-right: .3em;
    }

    .weui_cell_primary {
        width: 90%;
        flex: 1;
    }

    .weui_select {
        -webkit-appearance: none;
        border: 0;
        outline: 0;
        background-color: transparent;
        width: 90px;
        font-size: inherit;
        height: 44px;
        position: relative;
        z-index: 1;
        padding-left: 15px;
    }

    .weui_cell_select .weui_cell_bd:after {
        content: " ";
        display: inline-block;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        height: 6px;
        width: 6px;
        border-width: 2px 2px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        position: relative;
        top: -2px;
        position: absolute;
        top: 50%;
        right: 15px;
        margin-top: -3px;
    }

    .weui_cell_switch .weui_cell_ft {
        width: 52px;
        height: 34px;
    }

    .quickEvaluation-ul {
        padding: 10px 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        font-size: 14px;
        position: relative;

        .quickEvaluationLi {
            padding: 8px;
            line-height: 20px;
            border: 1px solid #C8C8CD;
            color: #000;
            list-style: none;
            width: auto;
            margin: 8px;
            word-break: break-all;
            border-radius: 5px;
            cursor: pointer;
        }

        .quickEvaluationLi.checked {
            border: 1px solid #409efe;
            color: #409efe;
        }
    }

    .quickEvaluation-ul:before {
        content: " ";
        position: absolute;
        left: 15px;
        right: 15px;
        top: 0;
        width: 93%;
        height: 1px;
        border-top: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .quickEvaluation-ul:after {
        content: " ";
        position: absolute;
        left: 15px;
        right: 15px;
        bottom: 0;
        width: 93%;
        height: 1px;
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .control-btn {
        padding: 30px 15px 15px;
    }

    .check-item {
        width: 100%;
        padding: 10px 15px;
        background-color: #fff;
        line-height: 1.41176471;
        font-size: 14px;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
    }

    .relationRow {
        width: 810px;
        margin: 0 auto;
    }

</style>
<style scoped>
    .addGeneralNCheckM .blue {
        background-color: #409efe;
    }

    .addGeneralNCheckM .weui-btn_disabled.weui-btn_primary {
        background-color: #409EFE;
    }

    .addGeneralNCheckM .weui-btn_primary:not(.weui-btn_disabled):active {
        background-color: #409EFE;
    }
</style>
