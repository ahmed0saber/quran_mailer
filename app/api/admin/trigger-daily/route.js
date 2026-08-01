export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const url = new URL("/api/notify-users", request.url);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      return new Response(
        JSON.stringify({ message: "تم إرسال الرسائل اليومية بنجاح" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({ error: "فشل إرسال الرسائل اليومية" }),
        { status: res.status, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Error triggering daily notify:", error);
    return new Response(JSON.stringify({ error: "تعذر الاتصال بالخادم" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
