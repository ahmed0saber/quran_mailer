import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
  return (
    <main>
        <section className="success-section">
            <h1>
                عذرا لم نتمكن من العثور على هذه الصفحة
            </h1>
            <Link href="/">
                العودة إلى الصفحة الرئيسية
            </Link>
        </section>
    </main>
  );
}
