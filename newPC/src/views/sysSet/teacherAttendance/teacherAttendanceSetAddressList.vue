<template>
    <div class="attendance_address_wrap">
        <back-tool :show-line="false">
            <el-button type="primary" size="medium" @click.native="addNewAddress">新增</el-button>
        </back-tool>
        <div>
            <el-table ref="multipleTable" :data="attendanceAddressList" border stripe :height="nobottommaxH" style="width: 100%">
                <el-table-column label="考勤地点名称" align="center" prop="address" show-overflow-tooltip></el-table-column>
                <el-table-column label="考勤半径" align="center">
                <template slot-scope="scope">{{scope.row.rangeVal}}米</template>
                </el-table-column>
                <el-table-column label="描点位置" align="center" prop="addressDesc" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button  size="small" type="text" @click="deleteAddress(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button  size="small" type="text" @click="editAddress(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {queryAttendanceAddressBySchoolId, deleteAttendanceAddress} from '@/api/systemSet/teacherAttendanceSet';

    export default {
        name: "teacherAttendanceSetAddressList",
        components: {
            BackTool
        },
        data() {
            return {
                attendanceAddressList: []
            }
        },
        created() {
            this.queryAttendanceAddressBySchoolId();
        },
        mixins:[mixins],
        methods: {
            queryAttendanceAddressBySchoolId() {
                queryAttendanceAddressBySchoolId().then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.attendanceAddressList = data.data;
                    }
                }).catch(() => {});
            },
            addNewAddress() {
                this.$router.push({path: 'teacherAttendanceSetAddressAdd'});
            },
            editAddress(addressId) {
                this.$router.push({path: 'teacherAttendanceSetAddressAdd', query: {addressId: addressId}});
            },
            deleteAddress(addressId) {
                this.$confirm('是否删除该人员考勤地点？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteAttendanceAddress(addressId);
                }).catch(() => {});
            },
            deleteAttendanceAddress(addressId) {
                deleteAttendanceAddress(addressId).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.queryAttendanceAddressBySchoolId();
                    }
                }).catch(() => {});
            }
        }
    }
</script>

<style lang="scss" scoped>
    .attendance_address_wrap{
        padding:12px;

    }
</style>
