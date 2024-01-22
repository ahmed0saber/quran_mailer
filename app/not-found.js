import Link from "next/link";

export default function NotFound() {
  return (
    <main>
        <section className="container">
            <h1 className="heading-primary">
                عذرا لم نتمكن من العثور على هذه الصفحة
            </h1>
            <Link href="/" className="btn-dark mt-8">
                العودة إلى الصفحة الرئيسية
            </Link>
        </section>
    </main>
  );
}
