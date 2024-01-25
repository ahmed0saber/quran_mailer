import { formatDate } from "@/utils/date"
import { addLog } from "./database/logs"

const generateLog = ({ date = formatDate(new Date()), level = "INFO", ...otherDetails } = {}) => {
    return {
        ...otherDetails,
        date,
        level
    }
}

const logToDatabase = async (details) => {
    const generatedLog = generateLog(details)
    return addLog(generatedLog)
}

const logToConsole = (details) => {
    const generatedLog = generateLog(details)
    console.log(generatedLog)
}

export { logToDatabase, logToConsole }
