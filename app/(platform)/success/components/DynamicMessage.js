'use client'

import { getUrlParam } from '@/utils/url'
import { useEffect, useState } from 'react'
import styles from '../style.module.css'

export default function DynamicMessage() {
    const [message, setMessage] = useState("")
    const [isEmailAction, setIsEmailAction] = useState(false)

    useEffect(() => {
        const urlMessage = getUrlParam({
            param: 'message',
            defaultValue: null
        })
        
        if (urlMessage) {
            setMessage(urlMessage)
            setIsEmailAction(true)
        } else {
            setMessage('يسعدنا تواصلك معنا، تم إرسال رسالتك بنجاح.')
            setIsEmailAction(false)
        }
    }, [])

    // Prevent hydration mismatch by returning null on first render if needed, 
    // or just relying on the fact that useEffect runs after mount.
    if (!message) return null

    return (
        <>
            <div className={styles.messageWrapper}>
                <p>{message}</p>
            </div>
            
            {isEmailAction && (
                <div className={styles.spamNotice}>
                    <div className={styles.spamIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <p className={styles.spamText}>
                        <strong>تنبيه هام!</strong>
                        يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam / Junk) إذا لم تجد رسالة التأكيد أو إلغاء الاشتراك في صندوق الوارد الرئيسي الخاص بك.
                    </p>
                </div>
            )}
        </>
    )
}
