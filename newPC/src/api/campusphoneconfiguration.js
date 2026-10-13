import fetch from '@/utils/fetch';
import {wymsFetchNoProcess,newcard} from '@/utils/fetch';
//保存校园电话配置
// export function saveTelephoneSchool(listQuery) {
//     let params = new URLSearchParams();
//     params.append("applyButton", listQuery.applyButton-0);
//     params.append("applyCallLen", listQuery.applyCallLen);
//     params.append("deductCallRate", listQuery.deductCallRate*100);
//     params.append("deductCardType", listQuery.deductCardType-0);
//     params.append("deductTelephoneType", listQuery.deductTelephoneType-0);
//     params.append("rechargeButton", listQuery.rechargeButton-0);
//     params.append("id", listQuery.id);
//     params.append("rechargePackageJson", listQuery.rechargePackageJson);
//     return newcard({
//         url: 'structure/telephoneSchool/saveTelephoneSchool',
//         method: 'post',
//         data:params
//     });
//   }
  export function saveTelephoneSchool(query) {
    return newcard({
        headers: {'content-type': 'application/json'},
        url: 'structure/telephoneSchool/saveTelephoneSchool',
        method: 'POST',
        data: JSON.stringify(query)
    });
  }
  //查询校园电话配置
export function getTelephoneSchool() {
    return newcard({
        url: 'structure/telephoneSchool/getTelephoneSchool',
        method: 'get',
    });
}