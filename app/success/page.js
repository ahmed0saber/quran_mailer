import Link from 'next/link'
import dynamic from 'next/dynamic';

const DynamicMessage = dynamic(() => import('./components/DynamicMessage'), {
    ssr: false
});

export default function Success() {
    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    تمت العملية بنجاح
                </h1>
                <DynamicMessage />
                <Link href="/" className='btn-dark mt-8'>
                    العودة إلى الصفحة الرئيسية
                </Link>
            </section>
        </main>
    )
}
