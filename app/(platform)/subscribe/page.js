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
                    اشترك الان
                </h1>
                <p className='text-primary'>
                    بمجرد الاشتراك فى خدمتنا المجانية سوف تتلقى رسالة تحمل آية من القرآن يوميا عبر بريدك الالكترونى
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
                    <button className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}>
                        اشتراك
                    </button>
                </form>
            </section>
        </main>
    )
}
