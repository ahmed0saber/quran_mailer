import { getFilteredSubscribers, getSubscriberByEmail, addVerifiedSubscriber } from "../../utils/database/subscribers"

export const dynamic = 'force-dynamic'

export async function GET(req) {
    try {
        const filter = req.nextUrl.searchParams.get("filter") || "all"
        const search = req.nextUrl.searchParams.get("search") || ""
        const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0")

        const { subscribers, total } = await getFilteredSubscribers({
            filter,
            search,
            skip,
            limit: 20
        })

        return new Response(
            JSON.stringify({ subscribers, total, skip: skip + 20 }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Users API GET error:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { email } = await req.json()

        if (!email) {
            return new Response(
                JSON.stringify({ error: "البريد الإلكتروني مطلوب" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const existing = await getSubscriberByEmail(email)
        if (existing) {
            return new Response(
                JSON.stringify({ error: "هذا البريد الإلكتروني مسجل بالفعل" }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            )
        }

        await addVerifiedSubscriber(email)

        return new Response(
            JSON.stringify({ message: "تم إضافة المستخدم بنجاح" }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Users API POST error:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get('email')

        if (!email) {
            return new Response(
                JSON.stringify({ error: "البريد الإلكتروني مطلوب" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const { removeSubscriber } = await import("../../utils/database/subscribers")
        const result = await removeSubscriber(email)
        
        if (result.deletedCount === 0) {
            return new Response(
                JSON.stringify({ error: "لم يتم العثور على المستخدم" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            )
        }

        return new Response(
            JSON.stringify({ message: "تم حذف المستخدم بنجاح" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Users API DELETE error:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
