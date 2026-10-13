<template>
    <div class="stack-room-wrap">
        <div class="section-list-header">
            <div class="header">
                <el-row>
                    <el-col :span="19">
                        <el-select @change="getClassAutonomyZoneListFunc" v-model="classId" size="medium"
                                   placeholder="请选择班级">
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="jumpToPage('devideSectionAdd', {classId})"
                        >添加分区
                        </el-button>
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="jumpToPage('devideSectionBaseSetting', {classId})"
                        >基础设置
                        </el-button>
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="isShowUrlLink = true"
                        >自主分区链接
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="section-list-box" :style="`height: ${notbmaxH - 28  }px;`">
            <div v-if="sectionList && sectionList.length !== 0" class="section-list clearfix">
                <div class="clearfix">
                    <div class="section-child-flex">
                        <div v-for="(el, index) in sectionList" class="section-item">
                            <i
                                class="el-icon-delete"
                                @click.stop="deleteSection(el.id)"
                            ></i>
                            <div class="section-item__upper clearfix">
                                <div class="section-item__section-pic"
                                     :style="`backgroundImage: url(${el.zoneLogo})`"></div>
                                <div class="section-item__name">{{el.typeName}}<span class="count">({{el.stuLimitCount}}人)</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <default-page v-else Mes="暂无数据"></default-page>
        </div>
        <el-dialog
            title="自主分区链接"
            :visible.sync="isShowUrlLink"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="530px"
        >
            <el-input size="medium" :value="linkUrl" style="width: 400px" readonly/>
            <textarea id="copytext">{{linkUrl}}</textarea>
            <el-button size="medium" type="primary" @click="copyHandler()">复制</el-button>
            <br/>
        </el-dialog>
    </div>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';
    import mixins from '@/mixins/windowResize';
    import {queryClass} from '@/api/common/common';
    import {
        getClassAutonomyZoneList,
        deleteClassAutonomyZoneById
    } from '@/api/devideSectionBeiyou';

    export default {
        name: 'divideSectionList',
        data() {
            return {
                isShowUrlLink: false,
                searchName: '',
                classId: '',
                sectionList: [],
                classList: []
            };
        },
        mixins: [mixins],
        components: {DefaultPage},
        created() {
            queryClass()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.classList = pageData;
                    if (pageData.length !== 0) {
                        this.classId = pageData[0].id;
                        this.getClassAutonomyZoneListFunc()
                    }
                });
        },
        computed: {
            linkUrl() {
                return global.command === 'production' ? `https://m.www.weixiaojia.cn/mobile/#/devideSectionBeiyou/devideSection?classId=${this.classId}` : `http://www.weixiaojia.net/mobile/#/devideSectionBeiyou/devideSection?classId=${this.classId}`;
            }
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            copyHandler() {
                const input = document.getElementById('copytext');
                input.select(); // 选中文本
                document.execCommand("copy"); // 执行浏览器复制命令
                this.$message.success("复制成功");
            },
            // 获取学校下的书籍
            getClassAutonomyZoneListFunc() {
                getClassAutonomyZoneList({
                    classId: this.classId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.sectionList = data.data;
                            sessionStorage.setItem('sectionCodeUsed', data.data.map(item => item.typeCode).join(','))
                        }
                    })
                ;
            },
            // 删除学校下的书库
            deleteSection(id) {
                this.$confirm('确认删除此分区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteClassAutonomyZoneById({id})
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('删除成功');
                                this.getClassAutonomyZoneListFunc()
                            } else {
                                this.$message.warning(data.msg);
                            }
                        })
                }).catch(() => {
                });
            },

        },
    };
</script>

<style scoped>
    .stack-room-wrap .el-dialog__body {
        padding: 10px 20px;
    }
</style>
<style lang="scss" scoped>
    @import "../../styles/mixin";
     .header {
    border-bottom: 1px solid #e7eaec;
  }
    #copytext {
        position: absolute;
        left: -3000px;
    }

    .stack-room-wrap {
        padding:12px;
    }

    .clearfix:after {
        content: '';
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }

    .stack-room-wrap {
        .section-list-header {
            .header-buttom {
                margin-bottom: 10px;
            }

            .header-tab-line {
                .header-tab-item {
                    float: left;
                    height: 24px;
                    line-height: 24px;
                    padding: 0 10px;
                    margin: 5px 6px;
                    color: #666;
                    border-radius: 3px;
                    font-size: 14px;
                    cursor: pointer;
                }

                .select-item {
                    color: #fff;
                    background: #d8d8d8;
                }
            }
        }

        .section-list-box {
            overflow-x: hidden;
            overflow-y: auto;

            .section-list {
                .section-item {
                    width: 207px;
                    height: 240px;
                    margin: 5px 22px 20px 5px;
                    float: left;
                    margin-right: 15px;
                    position: relative;
                    background-color: #9CEBE5;
                    border-radius: 10px;
                    box-sizing: border-box;
                    padding: 11px 11px 15px 15px;
                    .el-icon-delete {
                        position: absolute;
                        top: 6px;
                        right: 6px;
                        color: #f56c6c;
                        font-weight: bold;
                        cursor: pointer;
                        display: none;
                    }

                    &:hover {
                        .el-icon-delete {
                            display: inline-block;
                        }
                    }
                }
                .section-item__section-pic {
                    width: 75px;
                    height: 75px;
                    box-sizing: border-box;
                    border: 2px solid #fff;
                    border-radius: 8px;
                    background: no-repeat center center / cover;
                    float: left;
                }
                .section-item__name {
                    float: left;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 24px;
                    width: 100px;
                    text-align: center;
                    color: #fff;
                    text-shadow: 0 2px 5px #666;
                }

                .add_section {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    i {
                        font-size: 30px;
                        color: #909399;
                    }
                }
            }
        }

        .section_dialog_box {
            .section_dialog_list {
                .section-list-box {
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding-left: 2px;

                    .section-list {
                        padding: 20px 5px;

                        .section-item {
                            position: relative;
                            float: left;
                            width: 140px;
                            height: 200px;
                            text-align: center;
                            margin-right: 40px;
                            margin-bottom: 30px;
                            box-shadow: 0 0 5px #bbb;
                            border-radius: 13px;
                            overflow: hidden;

                            .dialog_section-name {
                                width: 100%;
                                line-height: 20px;
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                color: #fff;
                                background: #bebebe;
                                background: rgba(0, 0, 0, 0.3);
                            }

                            i {
                                position: absolute;
                                top: 0;
                                right: 0;
                                font-size: 26px;
                                color: #409eff;
                                background: #fff;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    }

    .no_stu_msg {
        font-size: 15px;
        text-align: center;
        color: #999;

        img {
            display: block;
            margin: 30px auto 0;
        }

        div {
            height: 20px;
            line-height: 20px;
            margin-top: -40px;
        }
    }

    .section-child-flex {
        margin-bottom: 10px;
    }

    .section_title {
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409eff;
        padding-left: 10px;
        margin-bottom: 10px;
    }

    .section-name__child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .count {
        font-size: 14px;
        margin-left: 4px;
    }
</style>
