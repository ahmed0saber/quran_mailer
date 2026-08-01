'use client'

import { getUrlParam } from '@/utils/url'
import { useEffect, useState } from 'react'

export default function DynamicMessage() {
    const [message, setMessage] = useState("")

    useEffect(() => {
        const currentMessage = getUrlParam({
            param: 'message',
            defaultValue: 'يسعدنا استخدامك لموقعنا الالكترونى و نتمنى لك التوفيق الدائم'
        })
        setMessage(currentMessage)
    }, [])

    return (
        <p className='text-primary'>{message}</p>
    )
}
