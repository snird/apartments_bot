const dataStoreInitializer = require('./index');
const jestDateMock = require('jest-date-mock');
const fs = require('fs');


const dataStore = dataStoreInitializer('./testdb.json')
beforeEach(() => {
    jestDateMock.advanceTo(new Date(2020, 5, 5, 0, 0, 0))
    dataStore.db.setState({ activeChats: [], adsSeen: [] })
    // Create 1 active chat always
    dataStore.activeChats.add('1')
});

afterEach(() => {
    fs.unlinkSync('./testdb.json')
    jestDateMock.clear()
});


describe('activeChats', () => {
    describe('#add', () => {
        test('it adds an active chat', () => {
            const dbState = dataStore.db.getState()
            expect(dbState.activeChats[0].id).toEqual('1')
        })

        test('it throws when trying to add already active chat', () => {
            expect(() => {
                dataStore.activeChats.add('1')
            }).toThrow()
        })
    })

    describe('#isActive', () => {
        test('returns false if not registered', () => {
            expect(dataStore.activeChats.isActive('newId')).toBe(false)
        })

        test('returns true if registered', () => {
            dataStore.activeChats.add('newId')
            expect(dataStore.activeChats.isActive('newId')).toBe(true)
        })
    })

    describe('lastUpdate methods', () => {
        test('return null if never updated before', () => {
            expect(dataStore.activeChats.lastUpdate('1')).toBe(null)
        })
        test('sets latUpdate date', () => {
            dataStore.activeChats.markUpdate('1')
            expect(dataStore.activeChats.lastUpdate('1')).not.toBe(null)
        })
    })
})

describe('adsSeen', () => {
    describe('#markAdSeen', () => {
        test('adds seen add to list', () => {
            dataStore.adsSeen.markAdSeen('1', 'myAdId')
            const dbState = dataStore.db.getState()
            expect(dbState.adsSeen.length).toEqual(1)
            expect(dbState.adsSeen[0].ads).toEqual(['myAdId'])
        })
        
    })

    describe('#isAdSeen', () => {
        test('return true if ad was marked seen before', () => {
            dataStore.adsSeen.markAdSeen('1', 'myAdId2')
            const isAdSeen = dataStore.adsSeen.isAdSeen('1', 'myAdId2')
            expect(isAdSeen).toBe(true)
        })

        test('return false if ad was not marked seen before', () => {
            dataStore.adsSeen.markAdSeen('1', 'myAdId2')
            const isAdSeen = dataStore.adsSeen.isAdSeen('1', 'randomAdId')
            expect(isAdSeen).toBe(false)
        })
    })
})
