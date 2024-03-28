import surahs from "../data/surahs"

export async function GET() {
    return new Response(
        JSON.stringify(surahs),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
