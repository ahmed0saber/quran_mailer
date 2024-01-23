import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req) {
    const jsonReq = await req.json()
    const { email } = jsonReq

    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME)

    const subscriber = await db
        .collection(process.env.SUBSCRIBERS_MODEL)
        .findOne({ email })

    if (subscriber) {
        return new NextResponse(
            JSON.stringify({
                success: false
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        )
    }

    await db
        .collection(process.env.SUBSCRIBERS_MODEL)
        .insertOne({
            email,
            isValid: true
        })

    return new NextResponse(
        JSON.stringify({
            success: true
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    )
}