'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'
import { getSession, removeSession } from '@/utils/session-storage'

export default function page() {
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDone, setIsDone] = useState(false)
    const skip = useRef(0)
    const user = useRef(getSession({ key: "current-user", defaultValue: null }))
    const router = useRouter()

    useEffect(() => {
        const controller = new AbortController()
        if (!user.current) {
            return router.push("/admin")
        }

        getLogs({ signal: controller.signal })

        return () => {
            controller.abort({ message: "Component Unmounted!" })
        }
    }, [])

    const getLogs = async ({ signal }) => {
        setIsLoading(true)

        try {
            const res = await fetch(`/api/admin/logs?skip=${skip.current}`, {
                signal,
                headers: {
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                if (data.logs.length === 0) {
                    setIsDone(true)
                    return
                }

                setLogs(prev => [...prev, ...data.logs])
                skip.current = data.skip
            } else {
                if (res.status === 401) {
                    console.error("Authorization failed: Invalid username or password")
                    removeSession("current-user")
                    router.push("/admin")
                } else {
                    console.error("An error occurred:", res.status)
                }
            }
        } catch (error) {
            console.error("Fetch error:", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        removeSession("current-user")
        router.push("/admin")
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
                <button
                    className='btn-dark mt-3'
                    onClick={logout}
                >
                    تسجيل الخروج
                </button>
                <div className={styles.logsContainer}>
                    <div className={styles.logsTable}>
                        <header className='row'>
                            <span className='col service-col'>Service</span>
                            <span className='col date-col'>Date</span>
                            <span className='col level-col'>Level</span>
                            <span className='col message-col'>Message</span>
                            <span className='col count-col'>Subscribers Count</span>
                            <span className='col total-time-col'>Total Time Taken</span>
                            <span className='col subscribers-time-col'>Get Subscribers Time Taken</span>
                            <span className='col emails-time-col'>Send Emails Time Taken</span>
                        </header>
                        {logs.map((log, index) => (
                            <div key={index} className='row'>
                                <span className='col service-col'>{log.service}</span>
                                <span className='col date-col'>{log.date}</span>
                                <span className='col level-col'>{log.level}</span>
                                <span className='col message-col'>{log.message}</span>
                                <span className='col count-col'>{log.subscribersCount}</span>
                                <span className='col total-time-col'>{log.totalTimeTaken}</span>
                                <span className='col subscribers-time-col'>{log.getSubscribersTimeTaken}</span>
                                <span className='col emails-time-col'>{log.sendEmailsTimeTaken}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {isLoading | logs.length === 0 | isDone ? null : (
                    <button
                        className='btn-dark mt-3'
                        onClick={getLogs}
                    >
                        تحميل المزيد
                    </button>
                )}
            </section>
        </main>
    )
}
