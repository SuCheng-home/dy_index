<template>
    <div class="attendance_address_add_wrap">
        <back-tool>
            <el-button type="primary" size="medium" @click.native="saveNewAddress">保存</el-button>
        </back-tool>
        <div class="address_add_box">
            <el-form label-width="140px">
                <el-form-item label="考勤地点" :required="true">
                    <el-input maxlength="20" v-model="addressMsg.address" placeholder="请输入考勤地点"></el-input>
                </el-form-item>
                <el-form-item label="考勤半径" :required="true">
                    <el-radio-group v-model="addressMsg.rangeVal">
                        <el-radio :label="item" :key="index" v-for="(item, index) in rangeList">{{item}}</el-radio>
                    </el-radio-group>
                    <span style="margin-left: 20px;">
                        自定义<el-input-number v-model="addressMsg.rangeVal" @change="changeRange" :min="1" :max="100000" size="small" label="考勤半径" style="margin: 0 10px;"></el-input-number>米
                    </span>
                </el-form-item>
                <el-form-item label="位置搜索" :required="true">
                    <gaode-map-input v-model="position" ref="amap"></gaode-map-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {getAttendanceAddressById, insertAttendanceAddress, editAttendanceAddress} from '@/api/systemSet/teacherAttendanceSet';
    import GaodeMapInput from '@/components/GaodeMapInput'

    export default {
        name: "teacherAttendanceSetAddressAdd",
        components: {
            BackTool,
            GaodeMapInput
        },
        data() {
            return {
                rangeList: [100, 200, 300, 500, 800, 1000, 1500, 2000, 3000],
                addressMsg: {
                    address: '',
                    rangeVal: 500,
                    addressDesc: '',
                    lng: 116.404,
                    lat: 39.915
                },
                addressId: 0,
                overlays: [],
                showConfig: true,
                position: [116.404, 39.915]

            }
        },
        mounted() {
            this.addressId = this.$route.query.addressId;
            if (this.addressId) { // 编辑
                this.getAttendanceAddressById(this.addressId);
            }
        },
        mixins: [mixins],
        methods: {
            getAttendanceAddressById(addressId) {
                getAttendanceAddressById(addressId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.addressMsg.address = data.address;
                        this.addressMsg.rangeVal = data.rangeVal;
                        this.addressMsg.addressDesc = data.addressDesc;
                        this.addressMsg.lng = data.lng;
                        this.addressMsg.lat = data.lat;
                        this.position = [data.lng, data.lat]
                        setTimeout(() => {
                            this.$refs.amap.refresh();
                        }, 1000)
                    }
                }).catch(() => {});
            },
            saveNewAddress() {
                if (!this.addressMsg.address) {
                    this.$message({
                        type: 'warning',
                        message: '请输入考勤地点！'
                    });
                    return;
                }
                if (!this.addressMsg.rangeVal) {
                    this.$message({
                        type: 'warning',
                        message: '请选择考勤半径！'
                    });
                    return;
                }
                if(this.position && this.position.length !== 0) {
                    this.addressMsg.lng = this.position[0];
                    this.addressMsg.lat = this.position[1];
                }
                this.addressMsg.addressDesc = this.$refs.amap.getLocationText();
                if (!this.addressMsg.addressDesc || !this.addressMsg.lng || !this.addressMsg.lat) {
                    this.$message({
                        type: 'warning',
                        message: '请选择考勤位置！'
                    });
                    return;
                }

                if (this.addressId) { // 编辑
                    this.editAttendanceAddress();
                } else { // 新增
                    this.insertAttendanceAddress();
                }
            },
            insertAttendanceAddress() {
                insertAttendanceAddress(this.addressMsg).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '地点新增成功'
                        });
                        this.$router.back();
                    }
                }).catch(() => {});
            },
            editAttendanceAddress() {
                let query = this.addressMsg;
                query.id = parseInt(this.addressId);
                editAttendanceAddress(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '地点编辑成功'
                        });
                        this.$router.back();
                    }
                }).catch(() => {});
            },
            changeRange(val) {
                this.addressMsg.rangeVal = val;
            },
        }
    }
</script>

<style lang="scss">
    .address_add_box .el-form-item__label {
        font-weight: bold;
    }
</style>
<style lang="scss" scoped>
    .attendance_address_add_wrap {
        padding:12px;
        .address_add_box{
            width: 810px;
            margin: 20px auto;
            .map_wrap{
                width: 100%;
                height: 400px;
            }
        }
    }
</style>
