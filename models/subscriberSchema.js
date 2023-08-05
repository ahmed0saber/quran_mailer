const mongoose = require('mongoose')
const { Schema } = mongoose
const dotenv = require('dotenv')
dotenv.config()
const SUBSCRIBERS_MODEL = process.env.SUBSCRIBERS_MODEL

const subscriberSchema = new Schema({
    email: String,
})

const Subscriber = mongoose.model(SUBSCRIBERS_MODEL, subscriberSchema)

module.exports = Subscriber