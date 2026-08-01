import { getLogs, getLogsCount } from "../../utils/database/logs"
import {
    getSubscribersCount,
    getVerifiedSubscribersCount,
    getUnverifiedSubscribersCount,
    getLastVerifiedSubscribers,
    getLastUnverifiedSubscribers
} from "../../utils/database/subscribers"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const [
            totalUsers,
            verifiedUsers,
            unverifiedUsers,
            totalLogs,
            lastLogs,
            lastVerifiedUsers,
            lastUnverifiedUsers
        ] = await Promise.all([
            getSubscribersCount(),
            getVerifiedSubscribersCount(),
            getUnverifiedSubscribersCount(),
            getLogsCount(),
            getLogs({ skip: 0 }),
            getLastVerifiedSubscribers(3),
            getLastUnverifiedSubscribers(3)
        ])

        return new Response(
            JSON.stringify({
                totalUsers,
                verifiedUsers,
                unverifiedUsers,
                totalLogs,
                lastLogs,
                lastVerifiedUsers,
                lastUnverifiedUsers
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Dashboard API error:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
