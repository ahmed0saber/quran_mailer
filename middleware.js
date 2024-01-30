const routesRequiringAuth = ['/api/admin/login', '/api/admin/logs']

export function middleware(request) {
    const pathname = request.nextUrl.pathname
    if (routesRequiringAuth.includes(pathname)) {
        const authHeader = request.headers.get('authorization')
        if (authHeader !== `Basic ${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`) {
            return new Response('Unauthorized', { status: 401 })
        }
    }
}
