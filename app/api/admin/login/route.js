export async function GET(request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Basic ${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`) {
        return new Response('', { status: 401 })
    }

    return new Response('', { status: 200 })
}
