import { getParamFromUrl } from "@/utils/url"
import { redirect } from 'next/navigation'
import { verifySubscriberByToken } from "../utils/database/subscribers"

export async function GET(req) {
    const token = getParamFromUrl({ param: 'token', url: req.url })

    if (!token) {
        return new Response('Token is required', {
            status: 400,
        })
    }

    const result = await verifySubscriberByToken(token)

    if (!result) {
        return new Response('Invalid or expired token', {
            status: 404,
        })
    }

    redirect('/success')
}
