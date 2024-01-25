import { NextResponse } from "next/server"
import { getSubscribers } from "../utils/database/subscribers"
import { logToConsole, logToDatabase } from "../utils/loggers"
import { sendDailyEmail } from "../utils/email/send"

export const maxDuration = 10

const startMeasuringTime = () => {
    const processStartTime = process.hrtime.bigint()

    return () => {
        return (process.hrtime.bigint() - processStartTime) / BigInt(1e6)
    }
}

export async function GET(request) {
    const getTimeTaken = startMeasuringTime()

    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        })
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

    return new NextResponse(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
