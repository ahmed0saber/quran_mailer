const getRandomItemFromArray = (arr) => {
    const randomItem = arr[Math.floor((Math.random() * arr.length))]

    return randomItem
}

const generateRandomToken = () => {
    const { randomBytes } = require('crypto')
    const randomToken = randomBytes(16).toString('hex')

    return randomToken
}

const generateHmacToken = (data) => {
    const { createHmac } = require('crypto')
    return createHmac('sha256', process.env.UNSUBSCRIBE_SECRET).update(data).digest('hex')
}

module.exports = { getRandomItemFromArray, generateRandomToken, generateHmacToken }
