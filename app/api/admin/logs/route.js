import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Basic ${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`) {
        return new Response('Unauthorized', {
            status: 401,
        })
    }

    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME)
    const recorded_logs = await db
        .collection(process.env.LOGGING_MODEL)
        .find()
        .toArray()

    return new NextResponse(
        JSON.stringify({
            recorded_logs
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    )
}
