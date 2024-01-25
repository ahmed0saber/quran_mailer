import databaseConnection from "@/lib/mongodb"

const addLog = async (log) => {
    return databaseConnection
        .collection(process.env.LOGGING_MODEL)
        .insertOne(log)
}

const getLogs = async () => {
    const recorded_logs = await databaseConnection
        .collection(process.env.LOGGING_MODEL)
        .find()
        .toArray()

    return recorded_logs
}

export { addLog, getLogs }
