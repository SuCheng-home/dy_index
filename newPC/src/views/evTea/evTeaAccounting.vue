<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
            班级           
            <el-select v-model="classIds" multiple @change="getList" collapse-tags>
                <el-option v-for="classItem in allClassList" :value="classItem.classId" :label="classItem.className"></el-option>
            </el-select>
            <el-button type="primary" size="medium"  @click="downloadFile"   v-if="dataList.length>0">导出</el-button>
        </backtool>
        
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH"
        >
            <el-table-column
                label="题目"
                align="center"
                width="100">
                <template slot-scope="scope">
                    <span class="text-btn" v-if="scope.row.topicType == 5" @click="showDetail(scope.row)">
                        {{scope.$index + 1}}
                    </span>
                    <span v-else>
                        {{scope.$index + 1}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="参加人数" show-overflow-tooltip>
                {{stuCount}}
            </el-table-column>
            <el-table-column align="center" label="投票数" prop="stuCount"></el-table-column>
             <el-table-column align="center" label="投票人数" prop="peopleCount"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" :label="`选项${optionNum}`" v-for="(optionNum, optionIndex) in opionNumList">
                <template slot-scope="scope">
                    <span>{{scope.row.voteInfoArray[optionIndex].voteCount}}</span> /
                    <span>{{scope.row.voteInfoArray[optionIndex].voteCount == 0 ? '--' : `${(scope.row.voteInfoArray[optionIndex].voteCount / scope.row.stuCount * 100).toFixed(2)}%`}}</span>
                    <span v-if="scope.row.voteInfoArray[optionIndex].score"> / {{scope.row.voteInfoArray[optionIndex].score }}</span>
                    <span v-if="scope.row.voteInfoArray[optionIndex].isBlank == 1" class="text-btn" @click="showDetail(scope.row, optionNum)">&nbsp;备注</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="currentTopicItem.topicType == 5 ? '问答题' : '备注'" :visible.sync="isShowDetail" size="tiny" width="800px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="ques-detail">
                当前题目：{{currentTopicItem.topicNum}}.{{currentTopicItem.topicTitle}}
            </div>
            <div>
                <el-table stripe :data="currentTopicDetail" border fit highlight-current-row
                          style="width: 100%" :height="400"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="100">
                    </el-table-column>
                      <el-table-column
                        v-if="currentTopicItem.topicType == 5 && anonymous == 2"
                        label="班级"
                        align="center"
                        prop="className"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        v-if="currentTopicItem.topicType == 5 && anonymous == 2"
                        label="答题人"
                        align="center"
                        prop="studentName"
                        width="100">
                    </el-table-column>
                    <el-table-column align="center" label="答案文本" show-overflow-tooltip prop="optionAnswer">
                        <template slot-scope="scope">
                            {{currentTopicItem.topicType == 5 ? scope.row.topicAnswer : scope.row.optionAnswer}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowDetail = false" size="medium">取 消</el-button>
                <a :href="exportUrl" target="_blank" download="问答题统计" v-if="currentTopicItem.topicType == 5 && anonymous == 2">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
                <el-button type="primary" @click="isShowDetail= false" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getEvaluateStaticList,
        getEvaluateTwBatch,
        getEvaluateStaticInfoList
    } from '@/api/evTea';
    export default {
        data() {
            return {
                dataList: [],
                opionNumList: [],
                batchId: this.$route.query.batchId,
                batchTempId: this.$route.query.batchTempId,
                isVote: 0,
                classIds: [],
                allClassList: [],
                stuCount: 0,
                currentTopicItem: {},
                currentTopicDetail: [],
                isShowDetail: false,
                exportUrl: '',
                anonymous: 1
            }
        },
        created() {
            getEvaluateTwBatch({
                batchId: this.batchId
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.anonymous = data.data.anonymous;
                    console.log('pageData.stuScope', pageData.stuScope);
                    const allClassList = JSON.parse(pageData.stuScope);
                    this.allClassList = allClassList;
                    this.classIds = allClassList.map(item => item.classId);
                    this.getList();
                });
        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
        downloadFile() {
            let url = `${global.BasePath}structure/evaluateTw/exportEvaluateStaticList`;
            let classList=[]
            for(let i=0;i<this.classIds.length;i++){
                for(let j=0;j<this.allClassList.length;j++){
                    if(this.classIds[i]==this.allClassList[j].classId){
                        classList.push({
                            id:this.allClassList[j].classId,
                            name:this.allClassList[j].className
                        })
                    }
                }
            }
            let params = {
                token: this.$store.getters.token,
                batchId: this.$route.query.batchId,
                batchTempId:this.$route.query.batchTempId,
                classListStr:JSON.stringify(classList)  
            };
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            document.body.appendChild(form);
            // 动态创建input并给value赋值
            for (var key in params) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }

            form.submit();
            form.remove();
            },
            isShowByPermission,
            showDetail(topicItem, optionNum = 0) {
                this.exportUrl = `${global.BasePath}structure/evaluateTw/exprotEvaluateStaticInfoList?` +
                `batchId=${this.batchId}&batchTempId=${this.batchTempId}&classIds=${this.classIds.join(',')}&topicNum=${topicItem.topicNum}&topicType=${topicItem.topicType}&optionNum=${optionNum}` +
                `&token=${this.$store.getters.token}`

                getEvaluateStaticInfoList({
                    batchId: this.batchId,
                    batchTempId: this.batchTempId,
                    classIds: this.classIds.join(','),
                    topicNum: topicItem.topicNum,
                    topicType: topicItem.topicType,
                    optionNum
                })
                    .then(res => res.data)
                    .then(data => {
                        this.currentTopicItem = topicItem;
                        this.currentTopicDetail = data.data;
                        this.isShowDetail = true;
                    })
            },
            selectable(row) {
                return !row.voteDate;
            },
            getList() {
                if(this.classIds.length !== 0) {
                    getEvaluateStaticList({
                        batchId: this.batchId,
                        batchTempId: this.batchTempId,
                        classIds: this.classIds.join(','),
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.dataList = data.data.topicList;
                            this.stuCount = data.data.stuCount;
                            this.opionNumList = data.data.opionNumList;
                        })
                } else {
                    this.dataList = []
                }

            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss">
    .pagination-container {
        margin-top: 10px;
    }
    .el-icon-paperclip {
        margin-right: 3px;
    }
    .text-btn {
        color: #409EFF;
        cursor: pointer;
    }
    .ques-detail {
        margin-bottom: 10px;
    }
</style>
