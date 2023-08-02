const mongoose = require('mongoose')
const { Schema } = mongoose

const subscriberSchema = new Schema({
    email: String,
})

const Subscriber = mongoose.model('Subscriber', subscriberSchema)

module.exports = Subscriber