// 江玮 验证方面封装 v1.0
import idCard from "idcard"

/* 是否是公司邮箱*/
export function isWscnEmail(str) {
	const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wallstreetcn\.com$/i
	return reg.test(str.trim())
}

export const regexpUtil = {
	unsignedInteger: /^\d+$/, // 无符号整数
	unsignedFloat: /^\d+(\.\d+)?$/, //无符号浮点数
	integer: /^-?\d+$/gi, // 整数
	float: /^-?\d+(\.\d+)?$/g, // 浮点数
	space: /^\s*$/gi, // 空字符
	chinese: /^[\u4E00-\u9FFF]$/g, // 中文汉字
	chinesePronunce: /^[a-z]*[āáǎàōóǒòêēéěèīíǐìūúǔùǖǘǚǜüńňǹɑɡ]+[a-z]*/g, // 汉语拼音,
	phone: /^0?1[3456789][0-9]\d{8}$/, // 手机号码,
	idCard: /^\d{15}|(\d{17}(\d|x|X))$/, // 身份证号
	eMail: /^\w+@\w+\.\w+$/, // 电邮
	imgExt: /(jpe?g|png|gif|bmp)/, // 图片文件扩展名
	addonFileExt: /(pdf|pptx?|xlsx?|docx?)/, // 附件文件扩展名
	ip: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, //ip
	url: /^((https?):\/\/)?[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/, // url
	domain: /^((https?):\/\/)?[\w-]+(\.[\w-]+)+$/, // url
	upperCase: /^[A-Z]+$/,
	lowerCase: /^[a-z]$/
}

export function getSimpleValidator(keyword, canEmpty, ruleType) {
	return (rule, value, callback) => {
		if (!canEmpty && `${value}`.trim().length === 0) {
			callback(new Error(`${keyword}不能为空！`))
		} else if (ruleType && !regexpUtil[ruleType].test(value)) {
			callback(new Error(`${keyword}格式不正确！`))
		} else {
			callback()
		}
	}
}
export function getSimpleRule(keyword, canEmpty, ruleType) {
	return [
		{
			required: true,
			validator: getSimpleValidator(keyword, canEmpty, ruleType),
			trigger: "blur"
		}
	]
}
export const mobileValidator = (rule, value, callback) => {
	if (value.trim().length === 0) {
		callback(new Error("手机号码不能为空！"))
	}
	if (!regexpUtil.phone.test(value)) {
		callback(new Error("手机号码格式不正确！"))
	} else {
		callback()
	}
}

export const idcardValidator = (rule, value, callback) => {
	if (value.trim().length === 0) {
		callback(new Error("请填写身份证号！"))
	} else {
		if (!idCard.verify(value.trim().toUpperCase())) {
			callback(new Error("身份证不正确！"))
		} else {
			callback()
		}
	}
}
