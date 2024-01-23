import clientPromise from "@/lib/mongodb"
import { redirect } from 'next/navigation'

export async function GET(req) {
    const fullUrl = new URL(req.url)
    const token = fullUrl.searchParams.get('token')

    if (!token) {
        return new Response('Token is required', {
            status: 400,
        })
    }

    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME)

    const result = await db.collection(process.env.SUBSCRIBERS_MODEL).findOneAndUpdate(
        { verificationToken: token, isValid: false },
        {
            $set: { isValid: true },
            $unset: { verificationToken: "" }
        }
    )

    if (!result) {
        return new Response('Invalid or expired token', {
            status: 404,
        })
    }

    redirect('/success')
}
