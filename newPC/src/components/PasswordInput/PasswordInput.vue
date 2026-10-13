<template>
    <div>
        <el-input type="password" @input="inputHandler" v-on="$listeners" v-bind="$attrs" :value="value" placeholder="长度为8-20个字符，至少含数字/字母/字符2种组合"></el-input>
        <div class="el-form-item__error">
            {{errorMsg}}
            <div v-show="level !== 0" class="level-hint-container">
                <span>{{level | getLevelText}}</span>
                <span :class="['level-hint', `level-hint--level1`, level > 0 ? 'level-hint--active' : '']">
                </span><span :class="['level-hint', `level-hint--level2`, level > 1 ? 'level-hint--active' : '']">
                </span><span :class="['level-hint', `level-hint--level3`, level > 2 ? 'level-hint--active' : '']">
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PasswordInput",
        data() {
            return {
                errorMsg: '',
                level: 0
            }
        },
        props: {
            value: {
                type: String
            },
            oldPassword: {
                type: String,
                default: ''
            }
        },
        filters: {
            getLevelText(level) {
                return ['', '弱', '中', '强'][level];
            }
        },
        methods: {
            validate() {
                this.inputHandler(this.value);
                return this.errorMsg === '';
            },
            inputHandler(value) {
                value = value.trim();
                this.$emit('input', value);
                let errorMsg = '', level = 0;

                if(!value) {
                    errorMsg = '请输入密码';
                } else if(this.oldPassword.trim() !== '' && this.oldPassword.trim() === value) {
                    errorMsg = '新密码不能和旧密码相同';
                } else if(value.length < 8 || value.length > 20) {
                    errorMsg = '长度须在8~20位';
                    level = 1;

                } else {
                    const numberFlag = /\d/.test(value);
                    const charFlag = /[a-zA-Z]/.test(value);
                    const symbolFlag = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/.test(value);
                    if(numberFlag && charFlag && symbolFlag) {
                        level = 3;
                    } else if(Number(numberFlag) + Number(charFlag) + Number(symbolFlag) === 2) {
                        level = 2;
                    } else {
                        errorMsg = '至少包含数字/字母/字符2种组合';
                        level = 1;
                    }
                }
                this.errorMsg = errorMsg;
                this.level = level;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/mixin.scss";
    .el-form-item__error {
        width: 100%;
    }
    .level-hint-container {
        float: right;
        color: #000;
        text-align: right;
        & > * {
            @include middleIB;
        }
        width: 50%;
    }
    .level-hint {
        @include wh(10px, 10px);
        @include middleIB;
        &.level-hint--level1 {
            border-radius: 5px 0 0 5px;
        }
        &.level-hint--level3 {
            border-radius: 0 5px 5px 0;
            position: relative;
        }
        width: 20%;
        background-color: #CCCCCC;

    }
    .level-hint--level1.level-hint--active {
        background-color: #DF2B2C;
    }
    .level-hint--level2.level-hint--active {
        background-color: #ED7B49;
    }
    .level-hint--level3.level-hint--active {
        background-color: #67c23a;
    }
    .svg-container {
        height: 40px;
        padding: 6px 5px 6px 15px;
        color: #889aa4;
    }
    .svg-container i {
        font-size: 24px;
    }
</style>
