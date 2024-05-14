import databaseConnection from "@/lib/mongodb"

const addLog = async (log) => {
    return databaseConnection
        .collection(process.env.LOGGING_MODEL)
        .insertOne(log)
}

const getLogs = async ({ skip } = { skip: 0 }) => {
    const recorded_logs = await databaseConnection
        .collection(process.env.LOGGING_MODEL)
        .find({}, { projection: { _id: 0 }, limit: 3, skip })
        .sort({ _id: -1 })
        .toArray()

    return recorded_logs
}

export { addLog, getLogs }
