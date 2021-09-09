const delray = require('../delray')
const download = require('download')

//京东cookie
const cookie = process.env.JINGDONG_COOKIE

//京东脚本
const JINGDONG_URL = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
//脚本路径
const JINGDONG_PATH = './JingDong/JD_DailyBonus.js'
//结果输出路径
const RESULT_PATH = './jingdong_result.txt'
//错误输出路径
const ERROR_PATH = './jingdong_error.txt'

const $delray = delray({ RESULT_PATH, ERROR_PATH })

function setupCookie() {
  let content = $delray.readFileSync(JINGDONG_PATH, 'utf8')
  content = content.replace(/var Key = ''/, `var Key = '${cookie}'`)
  $delray.writeFileSync(JINGDONG_PATH, content, 'utf8')
}

const jingfong = async () => {
  if (!cookie) {
    console.log('未配置京东cookie!')
    return
  }
  //下载脚本
  await $delray
    .download(JINGDONG_URL, './JingDong/')
    .then(() => {
      console.log('脚本文件下载成功，执行脚本中，请耐心等待！')
      //替换cookie
      setupCookie()
      //执行脚本
      $delray.execSync(`node ${JINGDONG_PATH} >> ${RESULT_PATH}`)
      //推送
      $delray.push({ title: '京东签到' })
    })
    .catch((err) => {
      console.log('脚本文件下载失败！')
      $delray.writeFileSync(ERROR_PATH, err, 'utf8')
    })
}

jingfong().then(() => {
  console.log(`脚本已执行完成，花费时间${$delray.time()}。\n`)
})
