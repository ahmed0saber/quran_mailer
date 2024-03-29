'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './style.module.css'
import { getSession } from '@/utils/session-storage'

export default function page() {
    const [logs, setLogs] = useState([])
    const router = useRouter()

    useEffect(() => {
        getLogs()
    }, [])

    const getLogs = async () => {
        const user = getSession({ key: "current-user", defaultValue: null })

        if (!user) {
            return router.push("/admin")
        }

        const username = user.username
        const password = user.password

        try {
            const res = await fetch("/api/admin/logs", {
                headers: {
                    "Authorization": `Basic ${username}:${password}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                setLogs(data)
            } else {
                if (res.status === 401) {
                    console.error("Authorization failed: Invalid username or password")
                    router.push("/admin")
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
                    مرحبا بك فى لوحة التحكم
                </h1>
                <p className='text-primary'>
                    هنا يمكنك متابعة التقريرات الخاصة بالدوال التى تعمل على الخادم
                </p>
                <div className={styles.logsContainer}>
                    {logs.map((log, index) => (
                        <div key={index} className={styles.logRecord}>
                            {Object.keys(log).map((key => (
                                <p key={key}>{key}: {log[key]}</p>
                            )))}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
