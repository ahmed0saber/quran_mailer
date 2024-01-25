const generateRandomToken = () => {
    const { randomBytes } = require('crypto')
    const randomToken = randomBytes(16).toString('hex')

    return randomToken
}

const generateEmailVerificationLink = ({ headers = {}, token } = {}) => {
    const host = headers.host || 'localhost:3000'
    const protocol = headers['x-forwarded-proto'] || 'http'
    const verificationLink = `${protocol}://${host}/api/verify-email?token=${token}`

    return verificationLink
}

module.exports = { generateRandomToken, generateEmailVerificationLink }
