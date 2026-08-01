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

const removeSubscriber = async (email) => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .deleteOne({ email })
}

const getSubscribersCount = async () => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .countDocuments()
}

const getVerifiedSubscribersCount = async () => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .countDocuments({ isValid: true })
}

const getUnverifiedSubscribersCount = async () => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .countDocuments({ isValid: false })
}

const getLastVerifiedSubscribers = async (limit = 3) => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .find({ isValid: true }, { projection: { _id: 0, email: 1 } })
        .sort({ _id: -1 })
        .limit(limit)
        .toArray()
}

const getLastUnverifiedSubscribers = async (limit = 3) => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .find({ isValid: false }, { projection: { _id: 0, email: 1 } })
        .sort({ _id: -1 })
        .limit(limit)
        .toArray()
}

const getFilteredSubscribers = async ({ filter = 'all', search = '', skip = 0, limit = 20 } = {}) => {
    const query = {}

    if (filter === 'verified') {
        query.isValid = true
    } else if (filter === 'unverified') {
        query.isValid = false
    }

    if (search) {
        query.email = { $regex: search, $options: 'i' }
    }

    const subscribers = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .find(query, { projection: { _id: 0, email: 1, isValid: 1 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

    const total = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .countDocuments(query)

    return { subscribers, total }
}

const verifySubscriberByEmail = async (email) => {
    const result = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .findOneAndUpdate(
            { email, isValid: false },
            {
                $set: { isValid: true },
                $unset: { verificationToken: "" }
            }
        )

    return result
}

const unverifySubscriberByEmail = async (email) => {
    const result = await databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .findOneAndUpdate(
            { email, isValid: true },
            {
                $set: { isValid: false }
            }
        )

    return result
}

const addVerifiedSubscriber = async (email) => {
    return databaseConnection
        .collection(process.env.SUBSCRIBERS_MODEL)
        .insertOne({
            email,
            isValid: true
        })
}

export {
    getSubscribers,
    getSubscriberByEmail,
    addSubscriber,
    verifySubscriberByToken,
    removeSubscriber,
    getSubscribersCount,
    getVerifiedSubscribersCount,
    getUnverifiedSubscribersCount,
    getLastVerifiedSubscribers,
    getLastUnverifiedSubscribers,
    getFilteredSubscribers,
    verifySubscriberByEmail,
    unverifySubscriberByEmail,
    addVerifiedSubscriber
}
