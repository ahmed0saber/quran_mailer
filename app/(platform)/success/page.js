import Link from 'next/link'
import DynamicMessage from './components/DynamicMessage'
import styles from './style.module.css'

export default function Success() {
    return (
        <main className={styles.successContainer}>
            <div className={styles.successCard}>
                <div className={styles.iconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <h1 className={styles.title}>
                    تمت العملية بنجاح
                </h1>
                
                <DynamicMessage />

                <Link href="/" className={styles.actionButton}>
                    العودة إلى الصفحة الرئيسية
                </Link>
            </div>
        </main>
    )
}
