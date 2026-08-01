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

    const logout = () => {
        removeSession("current-user")
        router.push("/admin")
    }

    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    إرسال إشعار للجميع
                </h1>
                <p className='text-primary'>
                    قم بإرسال رسالة بريد إلكتروني لجميع المشتركين
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        className='btn-dark mt-3'
                        onClick={() => router.push("/admin/logs")}
                    >
                        العودة للسجلات
                    </button>
                    <button
                        className='btn-dark mt-3'
                        onClick={logout}
                    >
                        تسجيل الخروج
                    </button>
                </div>
                
                {statusMessage && (
                    <div style={{ margin: "20px 0", padding: "10px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "4px" }}>
                        {statusMessage}
                    </div>
                )}

                <form className="form" style={{ marginTop: '24px' }} onSubmit={
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
            </section>
        </main>
    )
}
