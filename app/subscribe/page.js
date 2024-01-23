'use client'

import { useRouter } from "next/navigation"
import { useRef } from "react"

export default function Subscribe() {
    const emailRef = useRef()
    const submitBtnRef = useRef()
    const router = useRouter()

    function handleSubscribeFormSubmit(e) {
        e.preventDefault()
        if (submitBtnRef.current.classList.contains("is-loading")) {
            return
        }

        submitBtnRef.current.classList.add("is-loading")

        fetch("/api/subscribe", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailRef.current.value,
            })
        })
            .then(res => res.json())
            .then(() => { })
            .finally(() => {
                submitBtnRef.current.classList.remove("is-loading")
                emailRef.current.value = ""
                router.push("/success")
            })
    }

    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    اشترك الان
                </h1>
                <p className='text-primary'>
                    بمجرد الاشتراك فى خدمتنا المجانية سوف تتلقى رسالة تحمل آية من القرآن يوميا عبر بريدك الالكترونى
                </p>
                <form className="form" onSubmit={handleSubscribeFormSubmit}>
                    <div className="input-container js-input-container">
                        <input
                            type="email"
                            name="email"
                            placeholder="ادخل البريد الالكترونى"
                            ref={emailRef}
                            className="form-input"
                            required
                        />
                    </div>
                    <button className='btn-dark' ref={submitBtnRef}>
                        اشتراك
                    </button>
                </form>
            </section>
        </main>
    )
}
