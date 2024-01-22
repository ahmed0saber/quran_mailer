'use client'

import { useRouter } from 'next/navigation'
import { useRef } from "react"
import './style.css';

export default function Contact() {
    const usernameRef = useRef()
    const emailRef = useRef()
    const messageRef = useRef()
    const submitBtnRef = useRef()
    const router = useRouter()

    function handleContactFormSubmit(e) {
        e.preventDefault()
        if (submitBtnRef.current.classList.contains("is-loading")) {
            return
        }

        submitBtnRef.current.classList.add("is-loading")

        fetch("/api/contact", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                email: emailRef.current.value,
                message: messageRef.current.value
            })
        })
            .then(res => res.json())
            .then(() => { })
            .finally(() => {
                submitBtnRef.current.classList.remove("is-loading")
                usernameRef.current.value = ""
                emailRef.current.value = ""
                messageRef.current.value = ""
                router.push("/success")
            })
    }

    return (
        <main>
            <section className="contact-us-section">
                <h1>
                    تواصل معنا
                </h1>
                <p>
                    يسرنا تواصلكم معنا من خلال النموذج التالي عند الرغبة فى اخبارنا اى شئ يخص هذا الموقع الالكترونى
                </p>
                <form onSubmit={handleContactFormSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="ادخل الاسم بالكامل"
                            ref={usernameRef}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="ادخل البريد الالكترونى"
                            ref={emailRef}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <textarea
                            placeholder="ما الذى ترغب فى اخبارنا به؟"
                            ref={messageRef}
                            required
                        ></textarea>
                    </div>
                    <button className="contact-btn" ref={submitBtnRef}>
                        ارسال
                    </button>
                </form>
            </section>
        </main>
    )
}
