const WyMicroPlugin = require('wy-micro-plugin/lib/webpack-micro')

const generateDomainFn = (moduleName) => {
    const domainMap = {
        // dev_test: 'http://localhost:3000', // 可在调试微模块代码时使用
        dev_test: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/micro-modules/test',
        build_test: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/micro-modules/test',
        production: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/micro-modules/release'
    }
    const domain = domainMap[process.env.ENV_TAREGT]
    let modulePath = `${domain}/${moduleName}`
    // if (domain.startsWith('https')) {
    //     modulePath += '.js'
    // }
    // console.log('modulePath', modulePath)
    return modulePath
}

module.exports = () => {
    const apps = [
        {
            name: 'wy-webUploader',
            actor: 'module'
        }
    ]
    apps.forEach(i => {
        i.path = generateDomainFn(i.name)
    })
    return new WyMicroPlugin({
        name: 'wy-base',
        actor: 'master',
        env: process.env,
        group: {
            name: 'wei-yan',
            apps
        }
    })
}
