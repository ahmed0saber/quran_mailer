'use client'

import { getSession, setSession } from '@/utils/session-storage'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function page() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()
    const router = useRouter()

    useEffect(() => {
        const user = getSession({ key: "current-user", defaultValue: null })

        if (user) {
            return router.push("/admin/logs")
        }
    }, [])

    async function loginAsAdmin({ username, password } = {}) {
        const res = await fetch("/api/admin/login", {
            headers: {
                "Authorization": `Basic ${username}:${password}`
            }
        })

        if (res.ok) {
            setSession({
                key: "current-user",
                value: {
                    username,
                    password
                }
            })
            router.push("/admin/logs")
        } else {
            if (res.status === 401) {
                alert("البيانات المدخلة غير صحيحة")
            } else {
                alert("حدث خطأ ما ، يرجى اعادة المحاولة لاحقا")
            }
        }
    }

    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    قم بتسجيل الدخول للاستمرار
                </h1>
                <p className='text-primary'>
                    يمكنك استخدام اسم المستخدم و كلمة المرور الخاصة بك لتتمكن من الدخول الى لوحة التحكم
                </p>
                <form className="form" onSubmit={
                    isSubmitting ? (e) => e.preventDefault() : handleSubmit(loginAsAdmin)
                }>
                    <div className="input-container">
                        <input
                            type='text'
                            placeholder='اسم المستخدم'
                            className='form-input'
                            {...register("username", { required: true })}
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type='password'
                            placeholder='كلمة المرور'
                            className='form-input'
                            {...register("password", { required: true })}
                        />
                    </div>
                    <button className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}>
                        تسجيل الدخول
                    </button>
                </form>
            </section>
        </main>
    )
}
