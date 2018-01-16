const puppeteer = require('puppeteer');
const config = require('./config');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: './chromium/chrome.exe',
    headless: false
  });
  const page = await browser.newPage();
  page.setViewport({width: 1600, height: 900})
  // 进入BILIBILI登陆页
  await page.goto('https://passport.bilibili.com/login')
  await page.waitFor(1000)
  await page.click('.sns .weibo')
  // 进入微博授权页
  await page.waitForSelector('#userId')
  // 给个延时，不然focus不能将预留的文字去除
  await page.waitFor(2000)
  await page.focus('#userId')
  await page.type('#userId', config.id, {delay:100})
  await page.focus('#passwd')
  await page.type('#passwd',config.password, {delay:100})
  // 点击登陆按钮
  await page.click('#outer > div > div.WB_panel.oauth_main > form > div > div.oauth_login_box01.clearfix > div > p > a.WB_btn_login.formbtn_01')
  await page.waitForSelector('#outer > div > div.WB_panel.oauth_main > div > div.oauth_login_box01.clearfix > div.oauth_login_submit > p > a.WB_btn_allow.formbtn_01')
  // 确认授权
  await page.click('#outer > div > div.WB_panel.oauth_main > div > div.oauth_login_box01.clearfix > div.oauth_login_submit > p > a.WB_btn_allow.formbtn_01')
  await page.waitFor(1000)
  // 跳转至动态页
  await page.goto('https://t.bilibili.com/?tab=8')
  await page.waitFor(1000)
  // 滚动至一定距离，才能获取到足够的数据
  await page.evaluate(() => {
    window.scrollTo(0, 1500)
  })
  // 筛选数据
  const result = await page.evaluate(() => {
        let allFeeds = document.querySelectorAll('.feed-card .card')
        allFeeds = [].slice.call(allFeeds).slice(0, 5)
        let allFeedsArr = []
        allFeeds.forEach((item) => {
            allFeedsArr.push({
                userName: item.querySelector('.user-name span').innerHTML,
                title: item.querySelector('.text-area .title').innerHTML,
                content: item.querySelector('.text-area .content').innerHTML
            })
        })
        return allFeedsArr
    });

  console.log(result)
  browser.close()
})();