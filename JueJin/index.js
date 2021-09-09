const delray = require('../delray.js')

const JUEJIN_PATH = './JueJin/JueJin.js'
const RESULT_PATH = './juejin_result.txt'
const ERROR_PATH = './juejin_error.txt'

const $delray = delray({ RESULT_PATH, ERROR_PATH })

//执行脚本
$delray.execSync(`node ${JUEJIN_PATH} >> ${RESULT_PATH}`)

//推送
$delray.push({ title: '掘金签到' })
