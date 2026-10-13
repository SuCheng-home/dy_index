<template>
    <div class="app-container calendar-list-container deviceSetting" >       
        <div class="top"> 
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
          <el-button type="primary" @click.native="saveHandler"  size="medium">保存</el-button>     
       </div>
       <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH-30}px;`">
       <span class="label-hint">解码规则：</span><el-radio-group v-model="decodingRule">
                <el-radio :label="0">全序列</el-radio>
                <el-radio :label="1">截取8-16位转10进制</el-radio>
                <el-radio :label="2">截取6-14位</el-radio>
       </el-radio-group>
        </div>
    </div>
</template>

<script>
    import {
        insertOrUpdateCardReaderSet,
        getCardReaderSetBySchoolId
    } from '@/api/campusCrd';
    import mixin from "@/mixins/windowResize";
    export default {
        name: "deviceSetting",
        data() {
            return {
                decodingRule: 0
            }
        },
        created() {
            getCardReaderSetBySchoolId()
                .then(res => res.data)
                .then(data => {
                    if(data.result) {
                        if(data.data.decodingRule) {
                            this.decodingRule = data.data.decodingRule;
                        }
                    }
                })
        },   
        mixins: [mixin],   
        methods: {
            saveHandler() {
                insertOrUpdateCardReaderSet({
                    decodingRule: this.decodingRule
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message({
                                type: 'success',
                                message: '设置成功!',
                            });
                            setTimeout(() => {
                                this.$router.back();
                            }, 1000);
                        }
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
.deviceSetting{
    padding:12px;
}
    .top {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    .label-hint {
        font-size: 14px;
        color: #606266;
        box-sizing: border-box;
        padding-left: 50px;
    }
</style>
