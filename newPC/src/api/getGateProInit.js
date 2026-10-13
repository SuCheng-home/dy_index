import fetch from '@/utils/fetch';

//查看
export function getGateProInit() {
  return fetch({
      url: 'structure/gateNew/getGateProInit',
      method: 'get'
  });
}

//新增or修改
export function addAndUpdateGateProInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/gateNew/addAndUpdateGateProInit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
