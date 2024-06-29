'use client'

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function Subscribe() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()
    const router = useRouter()

    async function subscribeByEmail(data) {
        await fetch("/api/subscribe", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        router.push('/success?message=يرجي فحص البريد الالكتروني خاصتك للتحقق من صلاحيته و اتمام عملية الاشتراك فى هذه الخدمة')
    }

    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    اشترك الآن
                </h1>
                <p className='text-primary'>
                    بمجرد الاشتراك في خدمتنا المجانية سوف تتلقى رسالة تحمل آية من القرآن يوميًا عبر بريدك الالكتروني
                </p>
                <form className="form" onSubmit={
                    isSubmitting ? (e) => e.preventDefault() : handleSubmit(subscribeByEmail)
                }>
                    <div className="input-container js-input-container">
                        <input
                            type="email"
                            placeholder="ادخل البريد الالكترونى"
                            className="form-input"
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div className="input-container-btn">
                        <button className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}>
                            اشتراك
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
