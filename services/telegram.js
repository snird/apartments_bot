const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');


const bot = new TelegramBot(config.telegramToken, {polling: true});

let currentChatId;

msgHandlers = {
    start: (chatId, dataStore) => {
        bot.sendMessage(chatId, 'Im turned on. Send /update to get last ads. Send /stop to stop my craziness.')
        currentChatId = chatId;
        try {
            dataStore.activeChats.add(chatId);
        } catch {}
    },

    stop: (chatId, dataStore) => {
        bot.sendMessage(chatId, 'Im stopped for now. Hit /start to run me again.')
        currentChatId = chatId;
        dataStore.activeChats.remove(chatId);
    },

    update: (chatId, dataStore, updateHandler) => {
        if (!dataStore.activeChats.isActive(chatId)) {
            bot.sendMessage(chatId, 'First initialize me using /start')
            return;
        }
        bot.sendMessage(chatId, 'One update, on its way.')
        updateHandler(chatId);
    }
}

const telegramApi = {
    initialize: (updateHandler, dataStore) => {
        console.log('Initializing telegram bot...')

        bot.on('message', (msg) => {
            chatId = msg.chat.id;
            if (msg.text === '/start') {
                msgHandlers.start(chatId, dataStore);
            }
            else if (msg.text === '/stop') {
                msgHandlers.stop(chatId, dataStore);
            }
            else if (msg.text === '/update') {
                msgHandlers.update(chatId, dataStore, updateHandler);
            }
            else if (msg.text.startsWith('/')) {
                bot.sendMessage(chatId, 'Unknown command. Try /start or /update')
            }
        });

    },

    send: (payload) => {
        bot.sendMessage(chatId, payload);
    },

    sendPhoto: (path) => {
        bot.sendPhoto(chatId, path);
    }
};

process.on('SIGTERM', () => {
    telegramApi.send('Service shutting down. Bye bye.')
});

module.exports = telegramApi