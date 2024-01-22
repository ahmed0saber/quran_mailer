import Link from 'next/link'
import './style.css';

export default function Success() {
    return (
        <main>
            <section className="success-section">
                <h1>
                    تمت العملية بنجاح
                </h1>
                <p>
                    يسعدنا استخدامك لموقعنا الالكترونى و نتمنى لك التوفيق الدائم
                </p>
                <Link href="/">
                    العودة إلى الصفحة الرئيسية
                </Link>
            </section>
        </main>
    )
}
