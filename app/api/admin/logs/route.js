import { getLogs } from "../../utils/database/logs"

export const dynamic = 'force-dynamic'

export async function GET(req) {
    const skip = parseInt(req.nextUrl.searchParams.get("skip"))
    const logs = await getLogs({ skip })

    return new Response(
        JSON.stringify({ logs, skip: skip + 3 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
