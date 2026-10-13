import fetch from '@/utils/fetch';
import {newcard} from '@/utils/fetch';
//家长验证码（校园卡补卡使用）
export function getCardReaderSetBySchoolId() {
    return newcard({
        url: 'structure/cardReaderSet/getCardReaderSetBySchoolId',
        method: 'GET',
    });
}

// 新增或修改
export function insertOrUpdateCardReaderSet(args) {
    let params = new URLSearchParams();
    params.append("decodingRule", args.decodingRule);

    return newcard({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/cardReaderSet/insertOrUpdateCardReaderSet',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
