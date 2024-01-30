import { MongoClient } from 'mongodb'

if (!process.env.MONGOOSE_DATABASE_URL) {
    throw new Error('Invalid/Missing environment variable: "MONGOOSE_DATABASE_URL"')
}

const uri = process.env.MONGOOSE_DATABASE_URL
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

const databaseConnection = (await clientPromise).db(process.env.DATABASE_NAME)

export default databaseConnection