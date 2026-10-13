import fetch from '@/utils/fetch';

// 查询相册列表
export function listGetAlbum(args) {

    return fetch({
        url: 'structure/albumNew/listGetAlbum',
        method: 'GET'
    });
}

// 删除相册到回收站
export function delAlbum(args) {
    const params = new URLSearchParams();
    params.append('ids', args.ids);

    return fetch({
        url: 'structure/albumNew/delAlbum',
        method: 'GET',
        params
    });
}

// 创建相册
export function addAlbum(args) {
    const params = new URLSearchParams();
    params.append('albumType', args.albumType);
    params.append('departId', args.departId);
    params.append('infomation', args.infomation);
    params.append('name', args.name);
    params.append('isPublic', args.isPublic || 1);
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/albumNew/addAlbum',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 回收站查询相册列表及照片列表
export function albumRecy(args) {

    return fetch({
        url: 'structure/albumNew/albumRecy',
        method: 'GET',
    });
}

// 管理回收站的照片

export function updatePhotoState(args) {
    const params = new URLSearchParams();
    params.append('ids', args.ids);
    params.append('isDelete', args.isDelete);
    if(args.remark) {
        params.append('remark', args.remark);
    }

    return fetch({
        url: 'structure/albumNew/updatePhotoState',
        method: 'GET',
        params
    });
}


// 管理回收站的相册
export function updateAlbumState(args) {
    const params = new URLSearchParams();
    params.append('ids', args.ids);
    params.append('isDelete', args.isDelete);

    return fetch({
        url: 'structure/albumNew/updateAlbumState',
        method: 'GET',
        params
    });
}

// 查询相册进行照片列表
export function showPhoto(args) {
    const params = new URLSearchParams();
    params.append('albumId', args.albumId);

    return fetch({
        url: 'structure/albumNew/showPhoto',
        method: 'GET',
        params
    });
}

// 删除照片到回收站
export function delPhoto(args) {
    const params = new URLSearchParams();
    params.append('ids', args.ids);

    return fetch({
        url: 'structure/albumNew/delPhoto',
        method: 'GET',
        params
    });
}

// 设置相册封面
export function updateAlbumCover(args) {
    const params = new URLSearchParams();
    params.append('albumId', args.albumId);
    params.append('cover', args.cover);

    return fetch({
        url: 'structure/albumNew/updateAlbumCover',
        method: 'GET',
        params
    });
}

// 移动照料片到相册

export function movePhoto(args) {
    const params = new URLSearchParams();
    params.append('albumId', args.albumId);
    params.append('oldAlbumId', args.oldAlbumId);
    params.append('photoIds', args.photoIds);

    return fetch({
        url: 'structure/albumNew/movePhoto',
        method: 'GET',
        params
    });
}

// 新增照片
export function addPhoto(args) {
    const params = new URLSearchParams();
    params.append('albumId', args.albumId);
    params.append('photoName', args.photoName);
    params.append('photoUrl', args.photoUrl);
    params.append('type', args.type);
    params.append('videoJson', args.videoJson);
    params.append('videoSize', args.videoSize);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/albumNew/addPhoto',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 修改相册
export function updateAlbum(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    params.append('infomation', args.infomation);
    params.append('name', args.name);
   params.append('isPublic', args.isPublic || 1);
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/albumNew/updateAlbum',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 导出相册图片
export function exportAlbumPicList(args) {
    const params = new URLSearchParams();
    params.append('albumId', args.albumId);
    params.append('albumName', args.albumName);

    return fetch({
        url: 'structure/albumNew/exportAlbumPicList',
        method: 'GET',
        params
    });
}

// 导出班级圈照片
export function exportClassCircleAlbumPicList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('albumName', args.albumName);

    return fetch({
        url: 'structure/albumNew/exportClassCircleAlbumPicList',
        method: 'GET',
        params
    });
}
// 新增学校初始化设置
export function addAlbumInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/albumNew/addAlbumInit',
        method: 'post',
        data: JSON.stringify(args)
    });
}
// 根据学校id查询相册初始化设置
export function getAlbumInit() {

    return fetch({
        url: 'structure/albumNew/getAlbumInit',
        method: 'GET'
    });
}
