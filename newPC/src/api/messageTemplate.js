import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

// 获取学校短信模板
export function queryTemplateBySchoolId() {
    return fetch({
        url: 'structure/recruitMessageTemplate/queryTemplateBySchoolId',
        method: 'GET',
    });
}

// 删除模板
export function deleteTemplate(args) {
    let params = new URLSearchParams();
    params.append('templateId', args.templateId);
    params.append('templateMessageId', args.templateMessageId && args.templateMessageId != 0 ? args.templateMessageId : '');

    return fetch({
        url: 'structure/recruitMessageTemplate/deleteTemplate',
        method: 'GET',
        params
    });
}

// 新增模板
export function addTemplate(args) {
    let params = new URLSearchParams();
    params.append('title', args.title);
    params.append('content', args.content);

    return fetch({
        url: 'structure/recruitMessageTemplate/addTemplate',
        method: 'GET',
        params
    });
}

// 编辑模板
export function editTemplate(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    params.append('templateId', args.templateId && args.templateId != 0 ? args.templateId : '');
    params.append('title', args.title);
    params.append('content', args.content);

    return fetch({
        url: 'structure/recruitMessageTemplate/editTemplate',
        method: 'GET',
        params
    });
}
