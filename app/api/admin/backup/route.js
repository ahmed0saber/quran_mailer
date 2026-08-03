import databaseConnection from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const type = req.nextUrl.searchParams.get("type") || "all";
        
        let data = {};
        
        if (type === "users" || type === "all") {
            const users = await databaseConnection
                .collection(process.env.SUBSCRIBERS_MODEL)
                .find({}, { projection: { _id: 0 } })
                .toArray();
            data.users = users;
        }

        if (type === "logs" || type === "all") {
            const logs = await databaseConnection
                .collection(process.env.LOGGING_MODEL)
                .find({}, { projection: { _id: 0 } })
                .toArray();
            data.logs = logs;
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="backup-${type}-${new Date().toISOString().slice(0, 10)}.json"`
            }
        });
    } catch (error) {
        console.error("Backup Export Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const payload = await req.json();
        
        let usersImported = 0;
        let logsImported = 0;

        // Import Users (Upsert by email)
        if (payload.users && Array.isArray(payload.users) && payload.users.length > 0) {
            const bulkOps = payload.users.map(user => ({
                updateOne: {
                    filter: { email: user.email },
                    update: { $set: user },
                    upsert: true
                }
            }));
            
            const result = await databaseConnection
                .collection(process.env.SUBSCRIBERS_MODEL)
                .bulkWrite(bulkOps, { ordered: false });
                
            usersImported = (result.upsertedCount || 0) + (result.modifiedCount || 0);
            
            // Note: If a document exactly matched but wasn't modified, it's fine. We still processed it.
            // If it was inserted, upsertedCount increments.
            if (usersImported === 0 && bulkOps.length > 0) {
                usersImported = bulkOps.length; // Just a fallback to show we processed them
            }
        }

        // Import Logs (Insert Many)
        if (payload.logs && Array.isArray(payload.logs) && payload.logs.length > 0) {
            const result = await databaseConnection
                .collection(process.env.LOGGING_MODEL)
                .insertMany(payload.logs, { ordered: false });
                
            logsImported = result.insertedCount || 0;
        }

        return new Response(JSON.stringify({ 
            message: `تم الاستيراد بنجاح!`, 
            details: `المستخدمين: ${usersImported} | السجلات: ${logsImported}`
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Backup Import Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
    }
}
