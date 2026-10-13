<template>
    <span>
        <el-select v-show="showProvince" size="medium" @change="getCity()" v-model="dataArray[0]" style="width:120px">
            <el-option v-if="hasProvinceNone" :value="''" label="请选择" key="-1"></el-option>
            <el-option v-if="hasProvinceAll" :value="allProvinceValue" label="全部" key="0"></el-option>
            <el-option v-for="provinceItem in provinceList" :label="provinceItem.name" :value="provinceItem.code" :key="provinceItem.code"></el-option>
        </el-select>
        <el-select v-show="showCity" v-if="(!hasProvinceNone || dataArray[0] !== '') && (hasCityAll || cityList.length !== 0)" size="medium" @change="getDist()" v-model="dataArray[1]" style="width:120px">
            <el-option v-if="hasCityAll" :value="allCityValue" label="全部" key="0"></el-option>
            <el-option v-for="cityItem in cityList" :label="cityItem.name" :value="cityItem.code" :key="cityItem.code"></el-option>
        </el-select>
        <el-select v-if="(!hasProvinceNone || dataArray[0] !== '') && (hasDistAll || distList.length !== 0)" v-show="!noDist" size="medium" v-model="dataArray[2]" @change="emitFunc" style="width:120px">
            <el-option v-if="hasDistAll" :value="allDistValue" label="全部" key="0"></el-option>
            <el-option v-for="distItem in distList" :label="distItem.name" :value="distItem.code" :key="distItem.code"></el-option>
        </el-select>
    </span>
</template>

<script>
    import {listAreaByParentCode } from '@/api/common/common';
    export default {
        name: 'index',
        data() {
            return {
                provinceList: [],
                cityList: [],
                distList: [],
                dataArray: ['', '', '']
            }
        },
        created() {
            this.initData();

        },
        watch: {
            value() {
                this.initData();
            },
        },
        props: {
            value: {
                type: Array,
                required: true
            },
            hasProvinceAll: {
                type: Boolean,
                default: false
            },
            hasCityAll: {
                type: Boolean,
                default: false
            },
            hasDistAll: {
                type: Boolean,
                default: true
            },
            allCityValue: {
                type: String,
                default: '0'
            },
            allProvinceValue: {
                type: String,
                default: '0'
            },
            allDistValue: {
                type: String,
                default: '0'
            },
            hasProvinceNone: {
                type: Boolean,
                default: false
            },
            noDist: {
                type: Boolean,
                default: false
            },
            showProvince: {
                type: Boolean,
                default: true
            },
            showCity: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            initData() {
                console.log('init', this.value)
                this.dataArray = [this.value[0] || '', this.value[1] || '', this.value[2] || ''];
                listAreaByParentCode({
                    parentCode: '156'
                })
                    .then(res => res.data.data)
                    .then(data => {
                        this.provinceList = data;
                        if(this.dataArray[0] === '0') {
                            this.dataArray[1] = '0';
                            this.dataArray[2] = '0';
                            this.cityList = [];
                            this.distList = [];
                        } else {
                            listAreaByParentCode({
                                parentCode: this.dataArray[0]
                            })
                                .then(res => res.data.data)
                                .then(data => {
                                    this.cityList = data;
                                    if(data && data.length !== 0) {
                                        if(this.dataArray[1] === '0') {
                                            this.dataArray[2] = '0';
                                            this.distList = [];
                                        } else {
                                            listAreaByParentCode({
                                                parentCode: this.dataArray[1]
                                            })
                                                .then(res => res.data.data)
                                                .then(data => {
                                                    this.distList = data;
                                                });
                                        }
                                    }  else {
                                        this.dataArray[1] = '0';
                                        this.dataArray[2] = '0';
                                        this.cityList = [];
                                        this.distList = [];
                                    }
                                });
                        }
                    });
            },
            getCity() {
                if(this.dataArray[0] === '0') {
                    this.dataArray[1] = '0';
                    this.dataArray[2] = '0';
                    this.cityList = [];
                    this.distList = [];
                    if(this.hasProvinceAll) {
                        this.emitFunc()
                    }
                } else {
                    listAreaByParentCode({
                        parentCode: this.dataArray[0]
                    })
                        .then(res => res.data.data)
                        .then(data => {
                            this.cityList = data;
                            if(data && data.length !== 0) {
                                if(this.hasProvinceAll) {
                                    this.dataArray[1] = '0';
                                } else {
                                    this.dataArray[1] = data[0].code;
                                }
                                this.getDist();
                            } else {
                                this.dataArray[1] = '0';
                                this.dataArray[2] = '0';
                                this.cityList = [];
                                this.distList = [];
                                this.emitFunc()
                            }
                        });
                }

            },
            getDist() {
                console.log('getd')
                if(this.dataArray[1] === '0') {
                    this.dataArray[2] = '0';
                    this.distList = [];
                    if(this.hasDistAll) {
                        this.emitFunc()
                    }
                } else {
                    listAreaByParentCode({
                        parentCode: this.dataArray[1]
                    })
                        .then(res => res.data.data)
                        .then(data => {
                            this.distList = data;
                            if(data && data.length !== 0) {
                                if(this.hasDistAll) {
                                    this.dataArray[2] = '0';
                                } else {
                                    this.dataArray[2] = data[0].code;
                                }
                            } else {
                                this.distList = [];
                                this.dataArray[2] = '0';
                            }
                            this.emitFunc()

                        });
                }
            },
            emitFunc() {
                this.$emit('input', this.dataArray);
                this.$emit('change', this.dataArray);
            },
            getNameArray() {
                const nameArray = [];
                console.log(this.dataArray);
                const [provinceCode, cityCode, distCode] = this.dataArray;
                if(provinceCode) {
                    const province = this.provinceList.find(item => item.code == provinceCode);
                    nameArray[0] = province ? (province.name || '') : '';
                }
                if(cityCode) {
                    const city = this.cityList.find(item => item.code == cityCode);
                    nameArray[1] = city ? (city.name || '') : '';
                }
                if(!this.noDist) {
                    if(distCode) {
                        const dist = this.distList.find(item => item.code == distCode);
                        nameArray[2] = dist ? (dist.name || '') : '';
                    }
                }

                return nameArray;
            },
            getCode() {
                let orgAreaCode = '';
                if(this.noDist) {
                    orgAreaCode = this.dataArray[2] == '0' ? (this.dataArray[1] == '0' ? '' : this.dataArray[1]) : this.dataArray[2];
                } else {
                    orgAreaCode = this.dataArray[2] == '0' ? (this.dataArray[1] == '0' ? (this.dataArray[0] == '' ? '' : this.dataArray[0]) : this.dataArray[1]) : this.dataArray[2];
                }
                return orgAreaCode;
            }
        }
    }
</script>

<style scoped>

</style>
