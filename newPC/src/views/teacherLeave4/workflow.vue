<template>
  <div>
		<address-book :hasTolls="false" @input="onAddressBookConfirm" ref="addressBook" v-model="addressData" :config="addressDataConfig"></address-book>
    <el-dialog
      title='选择下一环节处理人'
      :visible.sync='dialogVisible'
      width='600px'
      :show-close='false'
      :close-on-press-escape='false'
      :close-on-click-modal='false'>
      <el-form ref='form' label-width='100px'>
        <el-form-item label="处理人：">
          <el-checkbox-group v-model="nextDealUserId">
            <el-checkbox v-for="userItem in dealUserList" :key="userItem" :label="userItem.id">{{ userItem.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='handleDealUserConfirm'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title='选择下一环节'
      :visible.sync='dialogVisible1'
      width='600px'
      :show-close='false'
      :close-on-press-escape='false'
      :close-on-click-modal='false'>
      <el-form ref='form' label-width='100px'>
        <el-form-item label="下一环节：">
          <el-select v-model="nextNodeId" placeholder="请选择">
            <el-option v-for="nodeItem in nextNodeList"
              :key="nodeItem.id"
              :label="nodeItem.name"
              :value="nodeItem.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='handleNextNodeConfirm'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddressBook from '@/components/AddressBook/indexExpand';
import { getStepByStepIdNo, submitWorkFlow, getDealUserList } from "@/api/workflow"
export default {
  name: 'workflow',
  components: {
    AddressBook
  },
  props: {
    workFlowId: {
      type: String
    },
    currentNode: {
      type: Object
    },
    departId: {
      type: String
    },
    leaveId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      nextNodeId: '',
      nextDealUserId: [],
      nextNodeList: [],
      nextNode: {},
      dealUserList: [],
			addressData: { departJson: [], groupJson: [], userJson: [] },
			addressDataConfig: {
				title: "发布范围",
				depart: { target: "user", departType: "t", userTypes: "1" },
				group: true,
			},
    }
  },
  methods: {
    async show(data) {
      const res = await getStepByStepIdNo({
        ...data,
        stepIdNo: this.currentNode.stepIdNo,
        transfer: this.currentNode.transfer,
        workFlowId: this.workFlowId,
      })
      this.nextNodeList = res.data.data
      if (this.currentNode.transfer == 2) {
        this.dialogVisible1 = true
      } else {
        this.nextNodeId = this.nextNodeList[0].id
        this.handleNextNodeConfirm()
      }
    },
    handleNextNodeConfirm() {
			this.nextNode = this.nextNodeList.find(i => i.id == this.nextNodeId)
      console.log(this.nextNode, this.nextNodeList, this.nextNodeId)
			if (this.nextNode.deealSelectedType == 2) {
				this.$refs.addressBook.showAddress()
			} else {
				getDealUserList(this.departId, this.nextNode.stepIdNo, this.workFlowId)
					.then(res => res.data)
					.then(data => {
						this.dealUserList = data.data
						console.log(this.dealUserList)
						this.dialogVisible1 = false
						if (JSON.parse(this.nextNode.dealUserJson).userSelectedType == 2) {
							this.dialogVisible = true
						} else {
							this.nextDealUserId = this.dealUserList.map(i => i.id)
							this.handleDealUserConfirm()
						}
					})
			}
    },
		onAddressBookConfirm(obj) {
			if (obj.userJson && obj.userJson.length === 0) {
				this.$message.error("请选择处理人")
				this.$refs.addressBook.showAddress()
			} else {
        this.dealUserList = obj.userJson
        this.nextDealUserId = this.dealUserList.map(i => i.id)
				this.handleDealUserConfirm()
			}
		},
		handleDealUserConfirm() {
			if (this.nextDealUserId.length === 0) {
				this.$message.error("请选择下一步处理人")
			} else {
				const toStepUserIds = this.nextDealUserId.join(",")
				const operatId = this.leaveId
				submitWorkFlow({
					batchContent: "",
					fileJson: "",
					operatId,
					statusName: this.currentNode.statusName,
					stepIdNo: this.currentNode.stepIdNo,
					stepName: this.currentNode.name,
					stepStateName: this.currentNode.statusName,
					stepType: 1,
					toStepIdNo: this.nextNode.stepIdNo,
					toStepName: this.nextNode.name,
					toStepUserIds,
					workFlowId: this.workFlowId,
					workFlowType: "askLeave",
					// address: this.address,
          // lat: this.lat,
          // lng: this.lng,
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
              this.$emit("submitSuccess", {
                toStepIdNo: this.nextNode.stepIdNo,
                dealUserList: JSON.stringify(this.dealUserList.filter(i => this.nextDealUserId.includes(i.id)))
              })
						} else {
							this.$message.error(data.msg)
						}
					})
			}
		},
  }
}
</script>

<style lang='scss' scoped>

</style>
