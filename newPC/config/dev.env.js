'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = {
    NODE_ENV: '"development"',
    ENV_TAREGT: JSON.stringify(process.env.ENV_TAREGT)
}
