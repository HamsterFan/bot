const delray = require('../delray.js')

const headers = {
  accept: '*/*',
  // 'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/json; charset=utf-8',
  origin: 'https://juejin.cn',
  referer: 'https://juejin.cn/',
  'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  cookie: process.env.JUEJIN_COOKIE,
}

const $delray = delray()

const juejin_api = {
  //查询是否签到
  get_today_status: {
    url: 'https://api.juejin.cn/growth_api/v1/get_today_status',
  },
  //签到
  check_in: {
    url: 'https://api.juejin.cn/growth_api/v1/check_in',
  },
  //查询今日是否有免费抽奖机会
  get: {
    url: 'https://api.juejin.cn/growth_api/v1/lottery_config/get',
  },
  //抽奖
  draw: {
    url: 'https://api.juejin.cn/growth_api/v1/lottery/draw',
  },
  //获取当前的矿石
  get_cur_point: {
    url: 'https://api.juejin.cn/growth_api/v1/get_cur_point',
  },
}

const juejin = async () => {
  await (async () => {
    //查询是否签到
    const today_status = await $delray.get({ url: juejin_api.get_today_status.url, headers }).then((res) => res.data)
    if (today_status.err_no !== 0) return Promise.reject('查询签到失败！\n')
    if (today_status.data) return Promise.reject('今日已经签到！\n')
    //签到
    const check_in = await $delray.post({ url: juejin_api.check_in.url, headers }).then((res) => res.data)
    if (check_in.err_no !== 0) return Promise.reject('签到失败！\n')
    console.log('签到成功！\n')
  })().catch((err) => {
    console.log(err)
  })

  await (async () => {
    //查询今日是否有免费抽奖机会
    const today = await $delray.get({ url: juejin_api.get.url, headers }).then((res) => res.data)
    if (today.err_no !== 0) return Promise.reject('查询免费抽奖次数失败！\n')
    if (today.data.free_count === 0) return Promise.reject('今日已免费抽奖！\n')
    //抽奖
    const draw = await $delray.post({ url: juejin_api.draw.url, headers }).then((res) => res.data)
    if (draw.err_no !== 0) return Promise.reject('免费抽奖异常！\n')
    console.log(`抽奖完成！恭喜抽到：${draw.data.lottery_name}\n`)
  })().catch((err) => {
    console.log(err)
  })

  await (async () => {
    const cur_point = await $delray.get({ url: juejin_api.get_cur_point.url, headers }).then((res) => res.data)
    if (cur_point.err_no !== 0) return Promise.reject('查询当前矿石数失败！\n')
    console.log(`当前矿石数：${cur_point.data}。\n`)
  })().catch((err) => {
    console.log(err)
  })
}

juejin().then(() => {
  console.log(`脚本已执行完成，花费时间${$delray.time()}。\n`)
})
