'use client'

import { getUrlParam } from '@/utils/url'

export default function DynamicMessage() {
    const message = getUrlParam({
        param: 'message',
        defaultValue: 'يسعدنا استخدامك لموقعنا الالكترونى و نتمنى لك التوفيق الدائم'
    })

    return (
        <p className='text-primary'>{message}</p>
    )
}
