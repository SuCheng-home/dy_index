<template>
  <el-form ref="ruleForm"
    label-width="140px"
    class="demo-ruleForm"
  >
    <el-form-item label="检查组名称：">
      {{groupInfo.title}}
    </el-form-item>
    <el-form-item v-for="(item, index) in groupUserList" :key="index" :label="item.weekNamer + '检查员：'">
      <address-book v-model="item.addressData" :config="teacherConfigData"></address-book>
    </el-form-item>
  </el-form>
</template>

<script>
import AddressBook from '@/components/AddressBook/indexExpand';
import { getGroup, updateGroupCheckUserJson, addGroupUserList, getGroupUserList } from "@/api/dormitoryInspection";
export default {
  name: 'OnDutyForm',
  components: {
    AddressBook
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
  },
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
      groupInfo: {},
      teacherConfigData: {
        title: '选择检查员',
        depart: {target: 'user', departType: 't', userTypes: '1'},
        // SingleChose: true,
        group: false
      },
      groupUserList
    }
  },
  created() {
    this.getGroup();
    this.getGroupUserList();
  },
  methods: {
    getGroup() {
      getGroup(this.id).then((res) => {
        let data = res.data;
        if (data.code === 200) {
          this.groupInfo = data.data;
          const checkUserJson = JSON.parse(data.data.checkUserJson || '[]')
          if (checkUserJson.length > 0) {
            this.groupUserList = checkUserJson
          }
        }
      });
    },
    async getGroupUserList() {
      try {
        const res = await getGroupUserList({
          groupId: this.id
        })
        const data = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    async handleSave() {
      try {
        if (this.groupUserList.every(item => item.addressData.userJson.length === 0)) {
          this.$message.error('至少设置一日的检查员');
          return Promise.reject();
        }
        await updateGroupCheckUserJson({
          id: this.id,
          checkUserJson: JSON.stringify(this.groupUserList)
        })
        const groupUserList = this.groupUserList.reduce((prev, cur) => {
          prev.push(...cur.addressData.userJson.map(i => ({
            weekNamer: cur.weekNamer,
            weekNumber: cur.weekNumber,
            userId: i.id,
            userName: i.name,
            avatar: i.avatar,
            groupId: this.id,
            loginname: i.loginname,
          })))
          return prev
        }, [])
        await addGroupUserList(groupUserList)
        this.$message.success('保存成功');
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
