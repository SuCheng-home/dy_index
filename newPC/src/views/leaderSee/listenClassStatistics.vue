<template>
  <div class="listen_class_wrap page">
    <div>
      <div style="margin-bottom: 10px">
       <term-grade-class-selector :isGradeShowAll="true" :isClassShow="false" :queryArgs="queryArgs"   @input="getStatistics()" ref="selector" v-model="obj" ></term-grade-class-selector>  
        <el-select v-model="addressType" placeholder="请选择" size="medium"  @change="getStatistics()">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <template v-if="listenTypeList && listenTypeList.length && addressType === 1" >
          <el-select
            v-model="recordTypeId"
            size="medium"   @change="getStatistics()"
            placeholder="请选择"
          >
            <el-option :key="0" label="全部上课类型" :value="0"></el-option>
            <el-option
              v-for="item in listenTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <!-- <el-button type="primary" size="medium" @click="getStatistics"
        >统计
        </el-button
        > -->
        <el-button
          type="primary"
          size="medium"
          @click="exportExcel('#outTable', '听课统计.xlsx')"
        >导出
        </el-button
        >
      </div>
      <div class="record_member_list clearfix" :style="`height: ${maxH}px;`">
        <div
          class="record_member_item"
          :key="index"
          v-for="(item, index) in recordList"
        >
          {{ item.listenerName || item.createUserName }}
          <div class="record_times">{{ item.times }}次</div>
        </div>
        <div class="no_list_msg" v-if="!recordList || !recordList.length">
          <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png" alt/>
          <div>暂无记录</div>
        </div>
      </div>
      <el-table
        stripe
        :data="recordList"
        border
        style="width: 98%; margin: 0 1%; display: none"
        max-height="440"
        id="outTable"
      >
        <el-table-column label="听课人姓名">
          <template slot-scope="scope">
            {{scope.row.listenerName || scope.row.createUserName}}
          </template>
        </el-table-column>
        <el-table-column prop="times" label="次数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Backtool from '@/components/BackTool'
  import mixins from '@/mixins/windowResize'
  import baseMixin from '@/mixins/baseMixin'
  import {getSchoolDicByCode} from '@/utils/utils'
  import {getClassRecordStatisticalList, countListByModel} from '@/api/listenClass'
  import TermGradeClassSelector from "@/components/TermGradeClassSelector";
  export default {
    name: 'listenClassStatistics',
    data () {
      return {
        addressType: 1,
        typeList: [
          {
            value: 1,
            label: '校内听课'
          }, {
            value: 2,
            label: '校外听课'
          }
        ],
        recordList: [],
        activeName: 'listenAccounting',
        recordTypeId: 0,
        listenTypeList: [],
         queryArgs: {
        all: true, //所有班级年级
        manager: true, //班主任
        notlimit: true, //所有班级年级
        submanager: true, //副班主任
        teacher: true //普通所交
      },  
      obj: {
        termId: "",
        duration: ["", ""],
        gradeId: "",
        classId: ""
      },
      }
    },
    components: {
      Backtool,TermGradeClassSelector
    },
    mixins: [mixins, baseMixin],
    created () {
      this.obj.duration = [
        this.getCurrentMonthDay(this.getDate(0)),
        this.getDate(0),
      ] // 列表日期
      this.getStatistics()
      getSchoolDicByCode('openClassType').then((list) => {
        this.listenTypeList = list
      })
    },
    methods: {
      tabsfun () {
        if (this.activeName === 'detailAccounting') {
          this.$router.replace({
            path: 'detail',
          })
        } else if (this.activeName === 'listenedAccounting') {
          this.$router.replace({
            path: 'thStatistics',
          })
        }
      },
      getCurrentMonthDay (date) {
        if (date) {
          return date.substring(0, 8) + '01'
        }
        return ''
      },
      getStatistics () {
        let start = ''
        let end = ''
        if (this.obj.duration && this.obj.duration.length && this.obj.duration[0]) {
          if (this.obj.duration[0] && this.obj.duration[0].length) {
            start = this.obj.duration[0]
            end = this.obj.duration[1]
          } else {
            start = this.getStrDate(this.obj.duration[0])
            end = this.getStrDate(this.obj.duration[1])
          }
        } else {
          this.$message({
            message: '请选择日期范围！',
            type: 'warning',
          })
          return
        }

        let query = {
          endDate: end,
          startDate: start,
          recordTypeId: this.recordTypeId,
          gradeId:this.obj.gradeId
        }

        if (this.addressType === 2) {
          this.countListByModel(query)
        } else {
          this.getClassRecordStatisticalList(query)
        }
      },
      getClassRecordStatisticalList (query) {
        getClassRecordStatisticalList(query).then((res) => {
          const data = res.data
          if (res.data.code === 200) {
            this.recordList = data.data
          } else {
            this.$message({
              message: data.msg,
              type: 'warning',
            })
          }
        }).catch()
      },
      countListByModel(query) {
        countListByModel(query).then((res) => {
          const data = res.data
          if (res.data.code === 200) {
            this.recordList = data.data
          } else {
            this.$message({
              message: data.msg,
              type: 'warning',
            })
          }
        }).catch()
      },
      getDate (n) {
        const data = new Date()
        data.setTime(data.getTime() + 3600 * 1000 * 24 * n)
        let localDateStr =
          data.getFullYear() +
          '-' +
          this.fillZero(data.getMonth() + 1) +
          '-' +
          this.fillZero(data.getDate())
        return localDateStr
      },
      getStrDate (data) {
        let strDate =
          data.getFullYear() +
          '-' +
          this.fillZero(data.getMonth() + 1) +
          '-' +
          this.fillZero(data.getDate())
        return strDate
      },
      fillZero (n) {
        return n < 10 ? '0' + n : n
      },
    },
  }
</script>

<style>
  .listen_class_wrap .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }

  .listen_class_wrap .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .page {
    padding: 10px;
  }

  .listen_class_wrap {
    .header {
      padding: 15px;
      border-bottom: 1px solid #eee;

      .statistics_title {
        display: flex;
        margin: 0;

        .btn_group {
          flex: 1;
          text-align: center;

          .btn {
            height: 40px;
            line-height: 40px;
            border: 1px solid #ccc;
            border-left-width: 0;
            color: #333;
            cursor: pointer;
          }

          .btn_selected {
            color: #fff;
            background: #409eff;
            border: 1px solid #409eff;
          }
        }

        .btn_group:first-child {
          .btn {
            border-radius: 4px 0 0 4px;
            border-left-width: 1px;
          }
        }

        .btn_group:last-child {
          .btn {
            border-radius: 0 4px 4px 0;
          }
        }
      }

      .listen_date {
        margin-top: 10px;
        margin-right: 10px;
        margin-left: 80px;
      }
    }

    .record_member_list {
      padding: 20px;
      overflow-y: auto;

      .record_member_item {
        float: left;
        min-width: 135px;
        margin-top: 10px;
        margin-left: 30px;
        padding: 15px 15px;
        font-size: 18px;
        color: #333;
        background: #ddd;
        border-radius: 4px;

        .record_times {
          float: right;
          margin-left: 8px;
          color: #999;
        }
      }

      .no_data_msg {
        text-align: center;
        color: #999;
      }
    }
  }
</style>
