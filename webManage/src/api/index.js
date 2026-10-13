import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
/*拿token调的接口*/
export function refresh(query){
  return systemFetch({
    url:'login/refresh',
    method:'post'
  })
}

export function permissions() {
  let params = new URLSearchParams();

  return systemFetch({
      url: 'oneself/permissions',
      method: 'GET',
      params
  });
}

export function fromOldFramework(userToken) {
  let params = new URLSearchParams();
  params.append('userToken', userToken);
  return systemFetch({
      url: 'login/fromOldFramework',
      method: 'GET',
      params
  });
}