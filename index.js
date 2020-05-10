const puppeteer = require('puppeteer-core');
const telegram = require('./services/telegram');
const facebookSource = require('./data_sources/facebook');
const dataStore = require('./data_store/index')();
const config = require('./config');

const updateHandler = (puppeteerPage) => {
    return async (chatId) => {
        for (let facebookGroup of config.facebookGroups) {
            console.log('Checking group for updates... ', facebookGroup)
            const ads = await facebookSource.get(facebookGroup, puppeteerPage)
            dataStore.activeChats.markUpdate(chatId)
    
            const unseenAds = ads.filter((ad) => {
                const isSeen = dataStore.adsSeen.isAdSeen(chatId, ad.link)
                if (isSeen) { console.log('filter seen ad ', ad.link) }
                return !isSeen
            })
    
            const isTextIndicateRquiredRooms = (text) => {
                return text.includes(' 3 ') || text.includes('שלוש') || text.includes('3 חדר')
            }
    
            const threeRoomsAds = unseenAds.filter((ad) => isTextIndicateRquiredRooms(ad.text))
    
            for (let ad of threeRoomsAds) {
                dataStore.adsSeen.markAdSeen(chatId, ad.link)
                const msg = `
                    תאריך: ${ad.date}
                    ${ad.text}
                    לינק: ${ad.link}
                `
                telegram.send(msg)
            }
        }
    }
}

(async () => {
  const browser = await puppeteer.connect({
      browserWSEndpoint: config.wsChromeEndpoint,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 1200,
    deviceScaleFactor: 1,
  });

  await telegram.initialize(updateHandler(page), dataStore)

})();
