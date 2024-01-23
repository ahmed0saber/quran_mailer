'use client'

import { useRouter } from 'next/navigation'
import { useRef } from "react"

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
            <section className="container">
                <h1 className='heading-primary'>
                    تواصل معنا
                </h1>
                <p className='text-primary'>
                    يسرنا تواصلكم معنا من خلال النموذج التالي عند الرغبة فى اخبارنا اى شئ يخص هذا الموقع الالكترونى
                </p>
                <form className="form" onSubmit={handleContactFormSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            name="name"
                            placeholder="ادخل الاسم بالكامل"
                            ref={usernameRef}
                            className='form-input'
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="email"
                            name="email"
                            placeholder="ادخل البريد الالكترونى"
                            ref={emailRef}
                            className='form-input'
                            required
                        />
                    </div>
                    <div className="input-container">
                        <textarea
                            placeholder="ما الذى ترغب فى اخبارنا به؟"
                            ref={messageRef}
                            className='form-input form-textarea'
                            required
                        ></textarea>
                    </div>
                    <button className="btn-dark" ref={submitBtnRef}>
                        ارسال
                    </button>
                </form>
            </section>
        </main>
    )
}
