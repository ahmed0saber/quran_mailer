'use client'

import { useRouter } from "next/navigation"
import { useRef } from "react"
import './style.css';

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
            <section className="subscribe-section container">
                <h1>
                    اشترك الان
                </h1>
                <p>
                    بمجرد الاشتراك فى خدمتنا المجانية سوف تتلقى رسالة تحمل آية من القرآن يوميا عبر بريدك الالكترونى
                </p>
                <form onSubmit={handleSubscribeFormSubmit}>
                    <div className="input-container js-input-container">
                        <input
                            type="email"
                            placeholder="ادخل البريد الالكترونى"
                            ref={emailRef}
                            required
                        />
                    </div>
                    <button className="subscribe-btn" ref={submitBtnRef}>
                        اشتراك
                    </button>
                </form>
            </section>
        </main>
    )
}
