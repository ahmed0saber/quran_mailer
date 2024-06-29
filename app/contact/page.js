'use client'

import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"

export default function Contact() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()
    const router = useRouter()

    async function sendContactDetails(data) {
        await fetch("/api/contact", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        router.push("/success")
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
                <form className="form" onSubmit={
                    isSubmitting ? (e) => e.preventDefault() : handleSubmit(sendContactDetails)
                }>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="ادخل الاسم بالكامل"
                            className='form-input'
                            {...register("username", { required: true })}
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="ادخل البريد الالكترونى"
                            className='form-input'
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div className="input-container">
                        <textarea
                            placeholder="ما الذى ترغب فى اخبارنا به؟"
                            className='form-input form-textarea'
                            {...register("message", { required: true })}
                        ></textarea>
                    </div>
                    <div className="input-container-btn">
                        <button className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}>
                            ارسال
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
