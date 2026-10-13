<template>
  <div class="doc_flow_add_wrap app-container">
    <div class="header">
      <el-button size="medium" @click="$router.back()">返回</el-button>
      <el-button type="primary" size="medium" @click="handleSave">保存</el-button>
    </div>
    <div class="body" :style="`height: ${nobottommaxH}px;`">
      <div class="flow_add_box">
        <el-form :model='form' :rules='rules' ref='form' label-width='140px'>
          <el-form-item label='模板名称' prop='title'>
            <el-input :maxlength="20"
              v-model.trim="form.title">
            </el-input>
          </el-form-item>
          <el-form-item label='模板内容' prop='content'>
            <el-input :maxlength="500"
              type="textarea"
              v-model.trim="form.content"
              :rows="3"
              @blur="handleCheckVariable"
            ></el-input>
          </el-form-item>
          <el-form-item label='短信场景说明' prop='scene'>
            <el-input :maxlength="500"
              type="textarea"
              v-model.trim="form.scene"
              :rows="3"
              placeholder="请描述短信模板的发送场景，如短信发送对象、发送目的等；若短信模板中带有变量，建议您在此提供短信完整示例供审核参考。"
            ></el-input>
          </el-form-item>
          
          <el-form-item v-if="form.templateParams.length > 0" label='模板参数' prop='templateParams'>
            <el-table :data='form.templateParams' style='width: 100%;line-height: 1.15;' border size="small">
              <el-table-column prop='name' label='变量name'>
              </el-table-column>
              <el-table-column prop='code' label='变量类型'>
                <template slot-scope='{row}'>
                  <el-select v-model="row.code" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in variableList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div class="box-p"> 
          <div>提示：</div>
          <div>1、模板内容长度限制：1～500个字符（含变量）。短信内容长度计算规则</div>
          <div>2、短信签名位于模板内容前的【】中。为避免混淆，在模板内容任意位置均不能使用【】，在模板内容首尾不能使用[ ]。</div>
          <div>3、支持中文、英文、数字、符号，但不支持繁体字和特殊符号，例如：體# 『』「」〖〗 m² • ①★※→等。</div>
          <div>4、禁止使用错别字、变体字、异体字、各类干扰符号、各类非正常混合字以及非常规的表达等，例如威信。</div>
          <br />
          <div>变量限制：</div>
          <div>1、不支持QQ号、微信号、网址信息；1~35位字符，但电话号码支持5~11位</div>
          <div>2、变量格式：${name}；例如，尊敬的 ${name}，您的快递已飞奔在路上，将今天 ${time} 送达您的手里，请留意查收。</div>
          <div>3、模板内容中如超过3个变量，若未来运营商监管政策变化可能存在模板报备失败的风险，建议将变量数量限制在3个及以下。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {
  addTemplate,
  editTemplate,
  getTemplateDetail
} from "@/api/shortmessage";
export default {
  name: "createTemplate",
  mixins: [mixins],
  data() {
    return {
      templateId: this.$route.query.templateId || '',
      editFlag: false,
      form: {
        title: "",
        content: "",
        scene: "",
        templateParams: []
      },
      variableList: [
        // { code: 'phone_number2', name: '电话号码' },
        { code: 'time', name: '时间' },
        { code: 'money', name: '金额' },
        { code: 'user_nick', name: '用户昵称' },
        { code: 'name', name: '个人姓名' },
        // { code: 'unit_name', name: '企业组织名称' },
        { code: 'address', name: '地址' },
        { code: 'license_plate_number', name: '车牌号' },
        // { code: 'tracking_number', name: '快递单号' },
        // { code: 'pick_up_code', name: '取件码' },
        { code: 'other_number2', name: '其他号码' },
        // { code: 'link_param', name: '链接参数' },
        { code: 'email_address', name: '邮箱地址' },
        { code: 'others', name: '其他（如名称、账号、地址等）' }
      ],
      rules: {
        title: [
          {
            required: true,
            message: "模板名称不能为空",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "模板内容不能为空",
            trigger: "blur"
          }
        ],
        scene: [
          {
            required: true,
            message: "短信场景说明不能为空",
            trigger: "blur"
          }
        ],
        templateParams: [
          {
            required: true,
            validator: function(rule, value, callback) {
              if (value.length && value.some(i => !i.code)) {
                callback(new Error('请绑定变量类型'))
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    if (this.templateId) {
      getTemplateDetail({ templateId: this.templateId })
        .then(res => res.data)
        .then(data => {
          const templateParams = JSON.parse(data.data.templateParams || '{}')
          const arr = []
          Object.keys(templateParams).forEach(key => {
            arr.push({
              name: key,
              code: templateParams[key]
            })
          })
          data.data.templateParams = arr
          this.form = data.data;
          this.editFlag = true;
        });
    }
  },
  methods: {
    handleCheckVariable() {
      const reg = /\$\{([^}]+)\}/g
      const templateParams = this.form.content.match(reg)
      const nameObj = {}
      this.form.templateParams = templateParams.reduce((p, c) => {
        const name = c.replace(/[${}]/g, '')
        if (!Reflect.has(nameObj, name)) {
          p.push({
            name,
            code: ''
          })
        }
        Reflect.set(nameObj, name, 1)
        return p
      }, []) 
    },
    async handleSave() {
      try {
        await this.$refs.form.validate()
        const formData = { ...this.form }
        if (formData.templateParams.length) {
          const templateParams = {}
          formData.templateParams.forEach(item => {
            templateParams[item.name] = item.code
          })
          formData.templateParams = JSON.stringify(templateParams)
        } else {
          formData.templateParams = null
        }
        let resData = null
        if (this.editFlag) {
          const { data } = await editTemplate(formData)
          resData = data
        } else {
          const { data } = await addTemplate(formData)
          resData = data
        }
        if (resData.result) {
          this.$message.success('保存成功')
          this.$router.back()
        } else {
          this.$alert(resData.msg, '提示')
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.doc_flow_add_wrap {
  .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
  }

  .body {
      overflow: auto;
      padding-top: 20px;
  }

  .flow_add_box {
      width: 650px;
      margin: 0 auto;
  }
}
.box-p{
  color:#606266;
  line-height:20px;
  font-size:14px;
  div{
    padding:5px 0;
  }
}
.variable-text {
  color: #409eff;
  cursor: pointer;
}
</style>
