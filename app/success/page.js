import Link from 'next/link'

export default function Success() {
    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    تمت العملية بنجاح
                </h1>
                <p className='text-primary'>
                    يسعدنا استخدامك لموقعنا الالكترونى و نتمنى لك التوفيق الدائم
                </p>
                <Link href="/" className='btn-dark mt-8'>
                    العودة إلى الصفحة الرئيسية
                </Link>
            </section>
        </main>
    )
}
