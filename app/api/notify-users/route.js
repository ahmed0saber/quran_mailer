import { getSubscribers } from "../utils/database/subscribers"
import { logToConsole, logToDatabase } from "../utils/loggers"
import { sendDailyEmail } from "../utils/email/send"
import { startMeasuringTime } from "../utils/measure-time"

export const maxDuration = 10

export async function GET(request) {
    const getTimeTaken = startMeasuringTime()

    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    const subscribers = await getSubscribers()
    const getSubscribersTimeTaken = getTimeTaken()

    await sendDailyEmail({ subscribers })

    const totalTimeTaken = getTimeTaken()
    const sendEmailsTimeTaken = totalTimeTaken - getSubscribersTimeTaken

    const detailsToBeLogged = {
        message: "All users have been notified successfully",
        getSubscribersTimeTaken: `${getSubscribersTimeTaken}ms`,
        sendEmailsTimeTaken: `${sendEmailsTimeTaken}ms`,
        totalTimeTaken: `${totalTimeTaken}ms`,
        service: "NotifyUsers"
    }
    await logToDatabase(detailsToBeLogged)
    logToConsole(detailsToBeLogged)

    return new Response('', { status: 200 })
}
