'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getSession, removeSession } from '@/utils/session-storage'

export default function BroadcastPage() {
    const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm()
    const user = useRef(getSession({ key: "current-user", defaultValue: null }))
    const router = useRouter()
    const [statusMessage, setStatusMessage] = useState("")

    useEffect(() => {
        if (!user.current) {
            return router.push("/admin")
        }
    }, [])

    const sendBroadcast = async ({ subject, message }) => {
        setStatusMessage("")
        try {
            const res = await fetch("/api/admin/broadcast", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                },
                body: JSON.stringify({ subject, message })
            })

            if (res.ok) {
                setStatusMessage("تم إرسال الإشعار بنجاح")
                reset()
            } else {
                if (res.status === 401) {
                    removeSession("current-user")
                    router.push("/admin")
                } else {
                    setStatusMessage("حدث خطأ أثناء إرسال الإشعار")
                }
            }
        } catch (error) {
            setStatusMessage("تعذر الاتصال بالخادم")
        }
    }

    return (
        <div>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', marginBottom: '16px' }}>
                قم بإرسال رسالة بريد إلكتروني لجميع المشتركين
            </p>

            {statusMessage && (
                <div style={{
                    margin: "0 0 16px",
                    padding: "12px 16px",
                    backgroundColor: statusMessage.includes("بنجاح") ? "#ecfdf5" : "#fef2f2",
                    color: statusMessage.includes("بنجاح") ? "#065f46" : "#991b1b",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    border: `1px solid ${statusMessage.includes("بنجاح") ? "#a7f3d0" : "#fecaca"}`
                }}>
                    {statusMessage}
                </div>
            )}

            <form className="form" onSubmit={
                isSubmitting ? (e) => e.preventDefault() : handleSubmit(sendBroadcast)
            }>
                <div className="input-container">
                    <input
                        type='text'
                        placeholder='موضوع الرسالة'
                        className='form-input'
                        {...register("subject", { required: true })}
                    />
                </div>
                <div className="input-container">
                    <textarea
                        placeholder='محتوى الرسالة'
                        className='form-input'
                        rows="6"
                        style={{ resize: "vertical", height: "auto", padding: "12px" }}
                        {...register("message", { required: true })}
                    />
                </div>
                <button className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}>
                    إرسال الإشعار
                </button>
            </form>
        </div>
    )
}
