import databaseConnection from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function DELETE(req) {
    try {
        const target = req.nextUrl.searchParams.get("target");
        
        let usersDeleted = 0;
        let logsDeleted = 0;

        if (target === "users" || target === "all") {
            const result = await databaseConnection
                .collection(process.env.SUBSCRIBERS_MODEL)
                .deleteMany({});
            usersDeleted = result.deletedCount || 0;
        }

        if (target === "logs" || target === "all") {
            const result = await databaseConnection
                .collection(process.env.LOGGING_MODEL)
                .deleteMany({});
            logsDeleted = result.deletedCount || 0;
        }

        return new Response(JSON.stringify({ 
            message: "تم مسح البيانات بنجاح", 
            details: `تم مسح ${usersDeleted} مستخدم و ${logsDeleted} سجل.` 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("System Data Reset Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
