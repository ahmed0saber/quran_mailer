import clientPromise from "@/lib/mongodb"
import { getParamFromUrl } from "@/utils/url"
import { redirect } from 'next/navigation'

export async function GET(req) {
    const token = getParamFromUrl({ param: 'token', url: req.url })

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