'use client'

import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export default function page() {
    const router = useRouter()
    const usernameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const username = usernameRef.current.value
        const password = passwordRef.current.value

        try {
            const res = await fetch("/api/admin/login", {
                headers: {
                    "Authorization": `Basic ${username}:${password}`
                }
            })

            if (res.ok) {
                console.log("Login successful")
                sessionStorage.setItem("current-user", JSON.stringify({
                    username,
                    password
                }))
                router.push("/admin/logs")
            } else {
                if (res.status === 401) {
                    console.error("Authentication failed: Invalid username or password")
                    alert("البيانات المدخلة غير صحيحة")
                } else {
                    console.error("An error occurred:", res.status)
                }
            }
        } catch (error) {
            console.error("Fetch error:", error.message)
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
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type='text'
                            name="name"
                            placeholder='اسم المستخدم'
                            ref={usernameRef}
                            className='form-input'
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type='password'
                            name="password"
                            placeholder='كلمة المرور'
                            ref={passwordRef}
                            className='form-input'
                            required
                        />
                    </div>
                    <button className="btn-dark">
                        تسجيل الدخول
                    </button>
                </form>
            </section>
        </main>
    )
}
