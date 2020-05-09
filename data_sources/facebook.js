function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

module.exports = {
    get: async (groupUrl, puppeteerPage) => {
        await puppeteerPage.goto(groupUrl);

        const $feed = await puppeteerPage.$('div[role=feed]');
        const $$posts = await $feed.$$('.userContentWrapper')
        // await $feed.screenshot({path: 'example.png'});
        const ads = $$posts.map(async ($post) => {
            await delay(1000)
            // Link to the post
            const $dateLink = await $post.$('[data-testid=story-subtitle] a')
            const dateLinkProp = await $dateLink.getProperty('href');
            const dateLinkValue = await dateLinkProp.jsonValue();
    
            // Date of the post
            const $date = await $post.$('abbr[data-utime]');
            const dateProp = await $date.getProperty('title');
            const dateValue = await dateProp.jsonValue();
    
            // Click on "see more"
            try {
                const $seeMore = await $post.$('.see_more_link');
                if ($seeMore) {
                    await puppeteerPage.$eval($seeMore, elem => elem.click());
                }
            } catch {}
    
            // The post text
            const $postText = await $post.$('[data-testid=post_message]')
            const postText = await puppeteerPage.evaluate(elm => elm.textContent, $postText);

            return {
                date: dateValue,
                text: postText,
                link: dateLinkValue
            }
        })

        return Promise.all(ads);
    }
}