<template>
    <div>
        <el-dialog title="成绩发布" :visible.sync="dialogVisible" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
            <span></span>
            <div>
                <h4>通知范例</h4>
                <div>尊敬的家长，您好！XXX同学在XXX XXX 中成绩：XXX； <span v-show="query.sendMax">班级最高分：XXX；</span><span
                        v-show="query.sendMin">班级最低分：XXX；</span><span v-show="query.sendAvg">班级平均分：XXX；</span><span
                        v-show="query.sendRank">班级排名：XXX；</span></div>
                <div>
                    <h4>考试科目：</h4>
                    <div>
                        <el-checkbox :key="index" v-for="(item, index) in currlist" v-model="item.isFback">
                            {{item.name}}
                        </el-checkbox>
                    </div>
                </div>
                <div>
                    <h4>成绩包含内容：</h4>
                    <el-checkbox-group v-model="checkList" @change="scoreChecked">
                        <el-checkbox label="0">最高分</el-checkbox>
                        <el-checkbox label="1">最低分</el-checkbox>
                        <el-checkbox label="2">平均分</el-checkbox>
                        <el-checkbox label="3">排名</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
        <el-button :loading="sendLoading" type="primary" @click="sendScore" size="medium">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import {sendScore} from '@/api/systemSet/exam';

    export default {
        data() {
            return {
                dialogVisible: false,
                checkList: [],
                currlist: [],
                query: {
                    examId: '',
                    sendAvg: false,
                    sendMax: false,
                    sendMin: false,
                    sendRank: false,
                    currIds: '',
                },
                sendLoading: false
            };
        },
        methods: {
            clearAll() {
                this.query.sendMax = false;
                this.query.sendMin = false;
                this.query.sendAvg = false;
                this.query.sendRank = false;
            },
            scoreChecked(val) {
                let _this = this;
                this.clearAll();
                val.forEach(function (item) {
                    switch(item) {
                        case '0':
                            _this.query.sendMax = true;
                            break;
                        case '1':
                            _this.query.sendMin = true;
                            break;
                        case '2':
                            _this.query.sendAvg = true;
                            break;
                        case '3':
                            _this.query.sendRank = true;
                            break;
                    }
                });
            },
            sendScore() {
                let _this = this;
                _this.query.currIds = '';
                _this.sendLoading = true;
                _this.currlist.forEach(item => {
                    if (item.isFback) {
                        _this.query.currIds += item.id;
                        _this.query.currIds += ',';
                    }
                });
                if (!_this.query.currIds) {
                    _this.$message('请选择科目！');
                    _this.sendLoading = false;
                    return undefined;
                } else {
                    sendScore(this.query).then(() => {
                        this.dialogVisible = false;
                        let _this = this;
                        this.$message({
                            message: '发布成功！',
                            type: 'success',
                            duration: 1000,
                            onClose: function () {
                                _this.sendLoading = false;
                            }
                        });
                        if (this.$parent.getList()) {
                            this.$parent.getList()
                        }
                    }).catch(() => {
                        this.sendLoading = false;
                        this.$message.error('请填写成绩！');
                    });
                }

            },
            showDialog(val, currLists) {
                this.clearAll();
                let _this = this;
                _this.currlist = [];
                currLists.forEach(item => {
                    _this.currlist.push({isFback: false, name: item.curriculumName, id: item.curriculumId});
                });
                this.checkList = [];
                this.dialogVisible = true;
                this.query.examId = val;
            }
        }
    };
</script>
