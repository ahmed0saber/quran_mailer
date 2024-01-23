'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Success() {
    const [message, setMessage] = useState("")

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const currentMessage = urlParams.get('message') || "يسعدنا استخدامك لموقعنا الالكترونى و نتمنى لك التوفيق الدائم"
        setMessage(currentMessage)
    }, [])

    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    تمت العملية بنجاح
                </h1>
                <p className='text-primary'>{message}</p>
                <Link href="/" className='btn-dark mt-8'>
                    العودة إلى الصفحة الرئيسية
                </Link>
            </section>
        </main>
    )
}
