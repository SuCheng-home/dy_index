import {getWorkFlow, getStartStep, getNowStep, getDealUserList, getStepByStepIdNo, submitWorkFlow, getYesHisUserList} from '@/api/workflow';
import Cookies from "js-cookie";

export default {
  data() {
    return {}
  },
  methods: {
    // 获取工作流程
    getWorkFlow(workFlowType) {
      return new Promise((resolve, reject) => {
        getWorkFlow(workFlowType).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取开始环节
    getStartStep(workFlowId) {
      return new Promise((resolve, reject) => {
        getStartStep(workFlowId).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取当前环节
    getNowStep(createUserId, departId, operatId, workFlowId) {
      return new Promise((resolve, reject) => {
        getNowStep(createUserId, departId, operatId, workFlowId).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
      // 获取环节处理人
      getDealUserList(departId, stepIdNo, workFlowId, operaId, appUserId, batchTypeEnd) {
          return new Promise((resolve, reject) => {
              getDealUserList(departId, stepIdNo, workFlowId, operaId , appUserId, batchTypeEnd).then(res => {
                  const data = res.data;
                  resolve(data);
              }).catch(error => {
                  reject(error);
              });
          });
      },
    // 获取环节处理人
    getStepByStepIdNo(args) {
        console.log(123)
      return new Promise((resolve, reject) => {
        getStepByStepIdNo(args).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 提交流程
    submitWorkFlow(args) {
      return new Promise((resolve, reject) => {
        submitWorkFlow(args).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 查询已经处理人id集合
    getYesHisUserList(args) {
      return new Promise((resolve, reject) => {
        getYesHisUserList(args).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获得距现在天数的日期
    getDate(n) {
      const data = new Date();
      data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
      let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
      return localDateStr;
    },
    getStrDate(data) {
      let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
      return strDate;
    },
    fillZero(n) {
      return n < 10 ? '0' + n : n;
    },
  }
}
