const getRandomItemFromArray = (arr) => {
    const randomItem = arr[Math.floor((Math.random() * arr.length))]

    return randomItem
}

const generateRandomToken = () => {
    const { randomBytes } = require('crypto')
    const randomToken = randomBytes(16).toString('hex')

    return randomToken
}

module.exports = { getRandomItemFromArray, generateRandomToken }
