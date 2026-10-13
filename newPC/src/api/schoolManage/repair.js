import fetch from '@/utils/fetch';

// 1.报修列表
export function getRepairManageList(args) {
  const params = new URLSearchParams();
  params.append('pageSize', args.pageSize);
  params.append('pageNo', args.pageNo);
  params.append('searchTitle', args.searchTitle);
  params.append('starDate', args.starDate);
  params.append('endDate', args.endDate);
  return fetch({
    url: 'structure/repair/getManagerRepairList',
    method: 'POST',
    params
  });
}


