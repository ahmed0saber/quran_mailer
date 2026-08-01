'use client'

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function Unsubscribe() {
    const { register, handleSubmit, formState: { isSubmitting }, setError, clearErrors, formState: { errors } } = useForm()
    const router = useRouter()

    async function requestUnsubscribe(data) {
        clearErrors()
        
        try {
            const res = await fetch("/api/unsubscribe-request", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                router.push('/success?message=يرجى فحص بريدك الإلكتروني للتحقق من طلب إلغاء الاشتراك في الخدمة')
            } else {
                const result = await res.json().catch(() => ({}))
                setError("root", { message: result.error || "حدث خطأ غير متوقع" })
            }
        } catch (error) {
            setError("root", { message: "تعذر الاتصال بالخادم" })
        }
    }

    return (
        <main>
            <section className="container">
                <h1 className='heading-primary'>
                    إلغاء الاشتراك
                </h1>
                <p className='text-primary'>
                    أدخل بريدك الإلكتروني أدناه لتلقي رابط إلغاء الاشتراك في الخدمة.
                </p>
                <form className="form" onSubmit={
                    isSubmitting ? (e) => e.preventDefault() : handleSubmit(requestUnsubscribe)
                }>
                    <div className="input-container js-input-container">
                        <input
                            type="email"
                            placeholder="أدخل البريد الإلكتروني"
                            className="form-input"
                            {...register("email", { required: true })}
                        />
                    </div>
                    {errors.root && (
                        <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '-10px', marginBottom: '10px' }}>
                            {errors.root.message}
                        </p>
                    )}
                    <button className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}>
                        طلب إلغاء الاشتراك
                    </button>
                </form>
            </section>
        </main>
    )
}
