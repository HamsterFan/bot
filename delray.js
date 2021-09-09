const axios = require('axios')
const execSync = require('child_process').execSync
const fs = require('fs')
const download = require('download')
const qs = require('qs')

const delray = (options = {}) => {
  const RESULT_PATH = options.RESULT_PATH || './result.txt'
  const ERROR_PATH = options.ERROR_PATH || './error.txt'
  const PUSH_KEY = process.env.PUSH_KEY || ''
  const start = Date.now()
  //执行时间
  const time = () => ((Date.now() - start) / 1000).toFixed(2) + 's'
  const get = (options) => {
    options['method'] = 'GET'
    return axios(options)
  }
  const post = (options, useQS = false) => {
    options['method'] = 'POST'
    if (useQS) {
      options.data = qs.stringify(options.data)
    }
    return axios(options)
  }
  //推送
  const push = (options) => {
    if (!PUSH_KEY) {
      console.log('未设置server酱，推送任务结束！')
      return
    }

    if (!fs.existsSync(RESULT_PATH)) {
      console.log('没有执行结果，推送任务结束！')
      return
    }

    const desp = fs.readFileSync(RESULT_PATH, 'utf8')

    // 去除末尾的换行
    const SCKEY = PUSH_KEY.replace(/[\r\n]/g, '')

    post(
      {
        url: `https://sctapi.ftqq.com/${SCKEY}.send`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        data: {
          title: options.title,
          desp,
        },
      },
      true
    )
      .then((res) => {
        const code = res.data.data['errno']
        if (code === 0) {
          console.log('通知发送成功，任务结束！')
        } else {
          console.log(`通知发送失败，任务中断！`)
          fs.writeFileSync(ERROR_PATH, JSON.stringify(res.data), 'utf8')
        }
      })
      .catch((err) => {
        console.log('通知发送失败，任务中断！')
        console.log(err)
        fs.writeFileSync(ERROR_PATH, err, 'utf8')
      })
  }
  return {
    time,
    get,
    post,
    push,
    execSync,
    download,
    fs,
    readFileSync: fs.readFileSync,
    writeFileSync: fs.writeFileSync,
  }
}

module.exports = delray
