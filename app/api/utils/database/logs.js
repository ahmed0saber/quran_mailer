import databaseConnection from "@/lib/mongodb"
import { formatDate } from "@/utils/date"

const addLog = async (log) => {
    return databaseConnection
        .collection(process.env.LOGGING_MODEL)
        .insertOne({
            date: formatDate(new Date()),
            ...log
        })
}

const getLogs = async () => {
    const recorded_logs = await databaseConnection
        .collection(process.env.LOGGING_MODEL)
        .find()
        .toArray()

    return recorded_logs
}

export { addLog, getLogs }
