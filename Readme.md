# Apartments bot code
![](bot_demo.gif)

## What is it?
This is a weekend project I wrote to aid me in my new apartments looking.
Most of the apartments today are advertised in private messages in facebook groups.
Facebook groups are tiresome to go through one be one and to filter manually relevant messages.

This script use puppeteer to scrape facebook groups automatically for ads,
then it filter the ads you already seen, and filter by string lookups for relevant ads.

Whats left is sent using telegram bot.

## Code quality note
This is a weekend project aimed to serve me. My #1 goal was to make it work for me.
It is not perfectly written with all the abstracts and tests, and that is the point.
This is utilitarianism in its prime.
If anything, this code is a good example for extreme value delivery in shortest time span.

## use it for free!
Its still great and works great. If your case is somewhat similar to mine, you can easily use this code.


# How to make it work
```
npm install
```
Duh.

We rely on puppeteer to scrape locally, and we expect you to be already logged in to your facebook with access to the relevant groups.
Start chrome in remote debug mode
For mac os:
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
```

Next, set up `config.js` file with these values:
```
module.exports = {
    wsChromeEndpoint: 'ws://127.0.0.1:9222/devtools/browser/...',
    telegramToken: '',
    facebookGroups: [
        'https://www.facebook.com/groups/111...',
    ]
}
```

Pretty self explanatory. Ofcourse you need to create your own telegram bot to get its token here.

## Good Luck !!!