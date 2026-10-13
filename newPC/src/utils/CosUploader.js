import _ from 'lodash';
import moment from 'moment';
import store from '@/store';
import {getWxCosFileSign} from '@/api/common/common';
import {dataURLtoBlob} from '@/utils';

export default class CosUploader {
    constructor(pathPrefix = '', useDeleteCosUrl = true, isManualInit = true, module = '', moduleCode = '', sysBucket = 1) {
        this.cos = null;
        this.bucket = null;
        this.region = 'ap-shanghai';
        this.pathPrefix = pathPrefix;
        this.sysBucket = sysBucket;
        this.module = module;
        this.moduleCode = moduleCode;
        this.useDeleteCosUrl = useDeleteCosUrl;
        this.progress = 0;
        this.progressShow = false;
        if(!isManualInit) {
            this.init();
        }
    }
    init() {

        return getWxCosFileSign({
            sysBucket: this.sysBucket
        })
            .then(res => res.data)
            .then(data => {
                if(data.result) {
                    const pageData = JSON.parse(data.data);
                    this.bucket = pageData.bucketName;
                    //实例化COS对象
                    //实例化COS对象
                    if (this.bucket == 'wxtestfile-1251008840' || this.bucket == 'wxcepfile-1251008840') {
                        this.cos = new COS({
                            Domain: global.command === 'production' ? 'cos.zhxiaoyuan.cn' : 'cos.weixiaojia.net',
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId, // 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey, // 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                    } else {
                        this.cos = new COS({
                                    // 必选参数
                                    getAuthorization: function (options, callback) {
                                            callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId, // 你的固定密钥SecretId，需修改
                                        TmpSecretKey: pageData.credentials.tmpSecretKey, // 你的固定密钥SecretKey，需修改
                                        XCosSecurityToken: pageData.credentials.sessionToken,
                                        ExpiredTime: pageData.expiredTime
                                    });
                                    }
                                    });
                    }
                } else {
                    return Promise.reject(data.msg);
                }
            })
    }
    upload(file, picOperationRule = '') {
        return this.uploadToServer(file, file.name, picOperationRule);
    }
    uploadBase64(base64, picOperationRule) {
        const timestamp = new Date().valueOf();
        const body = dataURLtoBlob(base64);
        const name = `${timestamp}_${_.padStart(_.random(1, 100000, false), 6, '0')}.png`;
        return this.uploadToServer(body, name, picOperationRule);
    }
    uploadToServer(body, name, picOperationRule) {
        return new Promise((resolve, reject) => {
            this.progressShow = true;
            const fileExt = name.replace(/.+\./, "").toLowerCase();   //正则表达式获取后缀
            const year = moment().format('YYYY');
            const timestamp = new Date().valueOf();
            let Key = '';
            let isPic = false;
            if (/(jpe?g|png|bmp|gif)$/.test(fileExt)) {
                isPic = true;
                Key = `/${this.pathPrefix}/${year}/${timestamp}/${timestamp}${('' + _.random(1, 100000)).padStart(6, '0')}.${fileExt}`;
            } else {
                Key = `${this.pathPrefix}/${year}/${timestamp}/${encodeURI(name)}`;
            }
            const putObjectArgs = {
                Bucket: this.bucket,
                Region: this.region,
                Key,
                Body: body,
                onTaskReady(taskId) {},
                onProgress: (progressData) => {
                    console.log('progressData.percent', progressData.percent);
                    this.progress = progressData.percent;
                },
                Headers: {}
            };
            if(picOperationRule) {
                putObjectArgs.Headers['Pic-Operations'] = `{"is_pic_info": 1, "rules": [{"fileid": "${encodeURI(name)}", "rule": "${picOperationRule}"}]}`;
            }

            //上传对象
            this.cos.putObject(putObjectArgs, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    this.cos.putObjectTagging({
                        Bucket: this.bucket, /* 必须 */
                        Region: this.region,     /* 存储桶所在地域，必须字段 */
                        Key, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                        Tags: [
                            {"Key": "year", "Value": year},
                            {"Key": "school", "Value": store.getters.schoolInfo.id},
                            {"Key": "module", "Value": this.module},
                            {"Key": "modulecode", "Value": this.moduleCode}
                        ],
                        // VersionId: 'MTg0NDUwOTMyODM1MDg2MTA1xxx' /* 对象版本 ID，非必须 */
                    }, (err, _1) => {
                        if(err) {
                            reject(err);
                        } else {
                            this.progressShow = false;
                            resolve(data);
                        }
                    })

                }
            });
        })
    }
    delete(fileUrl) {
        return new Promise((resolve, reject) => {
            if(this.useDeleteCosUrl) {
                const path = fileUrl.replace(/\.picsh\./, '.cos.ap-shanghai.');
                let Key = path.slice(path.indexOf('myqcloud.com') + 13);
                this.cos.deleteObject({
                    Bucket: this.bucket,
                    Region: this.region,
                    Key: window.decodeURI(Key),
                }, (err, data) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } else {
                resolve();
            }

        })
    }
    getProgress() {
        return this.progressShow ? `${this.progress * 100}%` : ''
    }
}

