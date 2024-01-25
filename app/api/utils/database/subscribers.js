import databaseConnection from "@/lib/mongodb"

const getSubscribers = async () => {
    const subscribers = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .find({ isValid: true }, { projection: { _id: 0, email: 1 } })
        .toArray()

    return subscribers
}

const getSubscriberByEmail = async (email) => {
    const subscriber = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .findOne({ email })

    return subscriber
}

const addSubscriber = async ({ email, verificationToken } = {}) => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL).insertOne({
            email,
            verificationToken,
            isValid: false
        })
}

const verifySubscriberByToken = async (token) => {
    const result = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .findOneAndUpdate(
            { verificationToken: token, isValid: false },
            {
                $set: { isValid: true },
                $unset: { verificationToken: "" }
            }
        )

    return result
}

export { getSubscribers, getSubscriberByEmail, addSubscriber, verifySubscriberByToken }
