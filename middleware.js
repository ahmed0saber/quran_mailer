export function middleware(request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Basic ${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`) {
        return new Response('Unauthorized', { status: 401 })
    }
}

export const config = {
    matcher: ['/api/admin/login', '/api/admin/logs'],
}
