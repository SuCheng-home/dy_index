<template>
    <div>
        <div class="class-input" @click="dialogFormVisible = true">
            <div class="chosed-box">
                <span v-for="item in headClassList" class="chosed-box-item">{{item.name}}</span>
            </div>
            <span v-show="headClassList.length===0" class="noda-info">点击选择范围</span>
        </div>
        <el-dialog title="选择班级" :visible.sync="dialogFormVisible" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false'>
            <div>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedClassList" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item, index) in classList" :key="index" :label="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <div class="clear"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="chooseClassColumn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { querySchoolClass } from '@/api/system';
export default {
    props: {
        value: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            dialogFormVisible: false,
            checkAll: false,
            checkedClassList: [],
            headClassList: [],
            classList: [],
            isIndeterminate: false
        }
    },
    watch: {
        value(val) {
            this.headClassList = val;
            this.checkedClassList = this.getAllClassListId(this.value);
        }
    },
    created() {
        querySchoolClass().then(res => {
            let data = res.data.data;
            this.classList = data;
        }).catch();
    },
    mounted() {
        this.checkedClassList = this.getAllClassListId(this.value);
        this.headClassList = this.value;
    },
    methods: {
        handleCheckAllChange(value) {
            this.checkedClassList = value ? this.getAllClassListId(this.classList) : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.classList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.classList.length;
        },
        chooseClassColumn() {
            let _this = this;
            this.dialogFormVisible = false;
            this.headClassList.splice(0, this.headClassList.length);
            this.checkedClassList.forEach(function (item) {
                let chosedItem = _this.classList.find(classItem => classItem.id == item);
                if(!!chosedItem) {
                    _this.headClassList.push(chosedItem);
                }
            });
        },
        getAllClassListId(list) {
            let arry = new Array();
            list.forEach(function (item) {
                arry.push(item.id);
            });
            return arry;
        }
    }
}
</script>
<style scoped>
.class-input {
    border: 1px solid #bfcbd9;
    min-height: 36px;
    background-image: none;
    border-radius: 4px;
    max-height: 90px;
    overflow-y: auto;
    cursor: pointer;
}

.noda-info {
    color: #bfcbd9;
    padding-left: 10px;
}

.chosed-box-item {
    padding: 4px 10px;
    background-color: #eee;
    margin-left: 4px;
    margin-top: 2px;
    color: #48576a;
    border-radius: 2px;
}

.el-checkbox-div {
    width: 150px;
}

.clear {
    clear: both;
}
</style>
