import { getLogs } from "../../utils/database/logs"

export const dynamic = 'force-dynamic'

export async function GET() {
    const logs = await getLogs()

    return new Response(
        JSON.stringify(logs),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
