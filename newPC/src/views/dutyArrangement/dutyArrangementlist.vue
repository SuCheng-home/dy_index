<template>
    <div class="dutyListIndex">
        <div class="el-row menu-tools">
             <router-link   :to="{path:'dutyArrangementadd'}">
                <el-button size="medium" type="primary">新建值班组</el-button>
            </router-link>    
            <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入值班组名称" v-model.trim="title" @change="getWatchGroupList">
            <el-button slot="append" icon="el-icon-search" @click="getWatchGroupList"></el-button>    
            </el-input>    
        </div>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <ul class="card_ul clearfix">
                <li v-for="(item,index) in checkList" :key="index" @mouseover="showDel(item)" @mouseout="hideDel(item)"
                    :class="{active:index==isActive}" @click="go(item.key)">
                    <a href="javascript:">
                        <i v-show="item.delBtn" class="el-icon-close glyphicon-remove" title="删除"
                           @click.stop="delWatchGroup(item.key)"></i>
                        <div class="dutyName">{{item.value}}</div>
                    </a>
                </li>
            </ul>
              <default-page Mes="暂无值班组" v-if="checkList.length==0"></default-page>
        </div>
    </div>
</template>
<script>
    import {getWatchGroupList,delWatchGroup} from '@/api/dutyArrangement';
    import DefaultPage from "@/components/DefaultPage";
    import mixin from '@/mixins/windowResize';
    import Cookies from "js-cookie";
    export default {
        data() {
            return {
                checkList: [],
                isActive: false,
                title:""
            }
        },
        mixins: [mixin],
         components: { DefaultPage },
        created() {
            this.getWatchGroupList();
        },
        methods: {         
            go(id) {
                this.$router.push({
                    path: 'dutyArrangementinfo',
                    query: {
                        groupId: id
                    }
                })
            },
            delWatchGroup(id) {
                let _this = this;
                this.$confirm('确认删除值班组？', '提示', {
                    type: 'error'
                }).then(() => {
                    delWatchGroup(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getWatchGroupList();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
            showDel(item) {
                item.delBtn = true;
            },
            hideDel(item) {
                item.delBtn = false;
            },
            getWatchGroupList() {
                getWatchGroupList(this.title)
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.checkList = data.data.map(item => ({
                                key: item.id,
                                value: item.title,
                                delBtn: false
                            }))
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
    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    ul, li {
        list-style: none;
    }

    .dutyListIndex {
        padding:12px;
    }

    .main-wrap {
        width: 100%;
    }

    .card_ul {
        width: 100%;
        padding: 0;
        margin:0;
        li {
            float: left;
            width: 280px;
            height: 170px;
            margin: 10px 8px;
            overflow: hidden;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            a {
                display: block;
                position: relative;
                width: 280px;
                height: 170px;
                font-size: 17px;

                background: #fff url(https://cdnfile-10043692.file.myqcloud.com/admin/images/composite.jpg) no-repeat;
                border-radius: 4px;
                text-align: center;
                background-size: 100% 100%;
                overflow: hidden;
                box-sizing: border-box;
                .dutyName {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40px;
                    line-height: 40px;
                    color: #fff;
                    background: rgba(0, 0, 0, 0.5);
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .glyphicon-remove {
                    position: absolute;
                    color: #E64340;
                    right: 10px;
                    top: 10px;
                    display: inline-block;
                    transition: .3s ease-in;
                }
            }
        }
        li:hover {
            box-shadow: 1px 4px 10px 2px #CCC;
            -moz-box-shadow: 1px 4px 10px 2px #CCC;
            -webkit-box-shadow: 1px 4px 10px 2px #CCC;
            transform: translateY(-1%);
            -webkit-transition: all .4s;
            transition: all .4s;
            -moz-transition: all .4s;
            cursor: pointer;
        }
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
</style>
