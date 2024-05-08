import surahAyahs from "../../data/surah-ayahs";

export async function GET(request, { params }) {
    return new Response(
        JSON.stringify(surahAyahs[params.id]),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
