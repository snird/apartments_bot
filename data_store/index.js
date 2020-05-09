const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

module.exports = (dbFile = 'db.json') => {
    const adapter = new FileSync(dbFile)
    const db = low(adapter)

    db.defaults({ activeChats: [], adsSeen: [] })
    .write()

    return {
        db,
        activeChats: {
            isActive: (chatId) => {
                const activeChatObjectFound = db.get('activeChats').find({ id: chatId }).value()
                return typeof activeChatObjectFound === "object" ? true : false
            },
    
            lastUpdate: (chatId) => {
                return db.get('activeChats').find({ id: chatId }).get('lastUpdate').value() || null
            },

            markUpdate: (chatId) => {
                const activeChat = db.get('activeChats').find({ id: chatId })
                return activeChat.assign({ lastUpdate: new Date()}).write()
            },
    
            add: (chatId) => {
                const isChatIdAlreadyActive = db.get('activeChats').find({ id: chatId }).value()
                if (isChatIdAlreadyActive) {
                    throw new Error('Cant add already activated chat. Check your code.')
                }
                return db.get('activeChats').push({ id: chatId, lastUpdate: null }).write()
            },
    
            remove: (chatId) => {
                return db.get('activeChats').remove({ id: chatId }).write()
            }
        },
    
        adsSeen: {
            isAdSeen: (chatId, adId) => {
                const adSeenObject = db.get('adsSeen').find({ chatId: chatId }).get('ads').value()
                if (typeof adSeenObject === 'undefined') { return false; }
                return adSeenObject.includes(adId)
            },

            markAdSeen: (chatId, adId) => {
                if (!db.get('adsSeen').find({ chatId: chatId }).value()) {
                    db.get('adsSeen').push({ chatId: chatId, ads: [] }).write()
                }

                db.get('adsSeen').find({ chatId: chatId }).get('ads').push(adId).write()
            }
        }
    }
} 