import { getLogs } from "../../utils/database/logs"

export async function GET(request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Basic ${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`) {
        return new Response('Unauthorized', {
            status: 401,
        })
    }

    const logs = await getLogs()

    return new Response(
        JSON.stringify(logs),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
