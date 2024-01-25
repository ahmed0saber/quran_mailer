const generateRandomToken = () => {
    const { randomBytes } = require('crypto')
    const randomToken = randomBytes(16).toString('hex')

    return randomToken
}

const generateEmailVerificationLink = ({ origin, token } = {}) => {
    const verificationLink = `${origin}/api/verify-email?token=${token}`

    return verificationLink
}

module.exports = { generateRandomToken, generateEmailVerificationLink }
