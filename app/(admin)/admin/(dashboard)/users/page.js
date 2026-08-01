'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, removeSession } from '@/utils/session-storage'
import SearchIcon from '@/app/components/icons/SearchIcon'
import InboxIcon from '@/app/components/icons/InboxIcon'
import PlusIcon from '@/app/components/icons/PlusIcon'
import CheckCircleIcon from '@/app/components/icons/CheckCircleIcon'
import ClockIcon from '@/app/components/icons/ClockIcon'
import CloseIcon from '@/app/components/icons/CloseIcon'
import styles from './style.module.css'

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [addStatus, setAddStatus] = useState({ type: '', message: '' })
    const [isAdding, setIsAdding] = useState(false)
    const [verifyingEmail, setVerifyingEmail] = useState(null)
    const [unverifyingEmail, setUnverifyingEmail] = useState(null)
    const [deletingEmail, setDeletingEmail] = useState(null)
    const skipRef = useRef(0)
    const [hasMore, setHasMore] = useState(true)
    const user = useRef(getSession({ key: "current-user", defaultValue: null }))
    const router = useRouter()
    const searchTimeoutRef = useRef(null)

    useEffect(() => {
        if (!user.current) {
            return router.push("/admin")
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        // Reset and fetch whenever filter or search changes
        skipRef.current = 0
        setUsers([])
        setHasMore(true)
        fetchUsers({ signal: controller.signal, reset: true })

        return () => controller.abort({ message: "Component Unmounted!" })
    }, [filter, search])

    const fetchUsers = async ({ signal, reset = false } = {}) => {
        setIsLoading(true)
        try {
            const currentSkip = reset ? 0 : skipRef.current
            const params = new URLSearchParams({
                filter,
                search,
                skip: currentSkip.toString()
            })

            const res = await fetch(`/api/admin/users?${params}`, {
                signal,
                headers: {
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                if (data.subscribers.length === 0) {
                    setHasMore(false)
                } else {
                    if (reset) {
                        setUsers(data.subscribers)
                    } else {
                        setUsers(prev => [...prev, ...data.subscribers])
                    }
                    skipRef.current = data.skip
                    setHasMore(data.subscribers.length >= 20)
                }
                setTotal(data.total)
            } else if (res.status === 401) {
                removeSession("current-user")
                router.push("/admin")
            }
        } catch (error) {
            if (error?.message !== "Component Unmounted!") {
                console.error("Users fetch error:", error)
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false)
            }
        }
    }

    const handleSearchInput = useCallback((value) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearch(value)
        }, 400)
    }, [])

    const handleVerify = async (email) => {
        setVerifyingEmail(email)
        try {
            const res = await fetch("/api/admin/users/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                },
                body: JSON.stringify({ email })
            })

            if (res.ok) {
                setUsers(prev =>
                    prev.map(u =>
                        u.email === email ? { ...u, isValid: true } : u
                    )
                )
            } else {
                const data = await res.json()
                alert(data.error || "حدث خطأ")
            }
        } catch (error) {
            console.error("Verify error:", error)
            alert("تعذر الاتصال بالخادم")
        } finally {
            setVerifyingEmail(null)
        }
    }

    const handleUnverify = async (email) => {
        setUnverifyingEmail(email)
        try {
            const res = await fetch("/api/admin/users/unverify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                },
                body: JSON.stringify({ email })
            })

            if (res.ok) {
                setUsers(prev =>
                    prev.map(u =>
                        u.email === email ? { ...u, isValid: false } : u
                    )
                )
            } else {
                const data = await res.json()
                alert(data.error || "حدث خطأ")
            }
        } catch (error) {
            console.error("Unverify error:", error)
            alert("تعذر الاتصال بالخادم")
        } finally {
            setUnverifyingEmail(null)
        }
    }

    const handleDelete = async (email) => {
        if (!confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) return
        
        setDeletingEmail(email)
        try {
            const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                }
            })

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.email !== email))
                setTotal(prev => prev - 1)
            } else {
                const data = await res.json()
                alert(data.error || "حدث خطأ")
            }
        } catch (error) {
            console.error("Delete error:", error)
            alert("تعذر الاتصال بالخادم")
        } finally {
            setDeletingEmail(null)
        }
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        setIsAdding(true)
        setAddStatus({ type: '', message: '' })

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${user.current.username}:${user.current.password}`
                },
                body: JSON.stringify({ email: newEmail })
            })

            const data = await res.json()

            if (res.ok) {
                setAddStatus({ type: 'success', message: data.message })
                setNewEmail('')
                // Refresh list
                skipRef.current = 0
                setUsers([])
                setHasMore(true)
                fetchUsers({ reset: true })
            } else {
                setAddStatus({ type: 'error', message: data.error || "حدث خطأ" })
            }
        } catch (error) {
            setAddStatus({ type: 'error', message: "تعذر الاتصال بالخادم" })
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className={styles.usersPage}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarRight}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}><SearchIcon size={18} color="#9ca3af" /></span>
                        <input
                            type="text"
                            placeholder="البحث بالبريد الإلكتروني..."
                            className={styles.searchInput}
                            onChange={(e) => handleSearchInput(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterBox}>
                        <select
                            className={styles.filterSelect}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">الكل</option>
                            <option value="verified">مُوثقين</option>
                            <option value="unverified">بانتظار التوثيق</option>
                        </select>
                    </div>
                </div>
                <button
                    className={styles.addBtn}
                    onClick={() => {
                        setShowAddModal(true)
                        setAddStatus({ type: '', message: '' })
                        setNewEmail('')
                    }}
                >
                    <PlusIcon size={18} /> إضافة مستخدم
                </button>
            </div>

            {/* Results count */}
            <div className={styles.resultsBar}>
                <span className={styles.resultsCount}>
                    {total} مستخدم
                </span>
            </div>

            {/* Users Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>البريد الإلكتروني</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, index) => (
                            <tr key={index}>
                                <td>
                                    <div className={styles.emailCell}>
                                        <div className={`${styles.avatar} ${!u.isValid ? styles.avatarUnverified : ''}`}>
                                            {u.email.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={styles.emailText}>{u.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${u.isValid ? styles.statusVerified : styles.statusUnverified}`}>
                                        {u.isValid ? (
                                            <><CheckCircleIcon size={14} /> مُوثق</>
                                        ) : (
                                            <><ClockIcon size={14} /> بانتظار التوثيق</>
                                        )}
                                    </span>
                                </td>
                                <td>
                                    {!u.isValid && (
                                        <button
                                            className={styles.verifyBtn}
                                            onClick={() => handleVerify(u.email)}
                                            disabled={verifyingEmail === u.email || unverifyingEmail === u.email || deletingEmail === u.email}
                                        >
                                            {verifyingEmail === u.email ? 'جاري التوثيق...' : 'توثيق'}
                                        </button>
                                    )}
                                    {u.isValid && (
                                        <button
                                            className={styles.unverifyBtn}
                                            onClick={() => handleUnverify(u.email)}
                                            disabled={verifyingEmail === u.email || unverifyingEmail === u.email || deletingEmail === u.email}
                                        >
                                            {unverifyingEmail === u.email ? 'جاري الإلغاء...' : 'إلغاء التوثيق'}
                                        </button>
                                    )}
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(u.email)}
                                        disabled={deletingEmail === u.email}
                                    >
                                        {deletingEmail === u.email ? 'جاري الحذف...' : 'حذف'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isLoading && (
                    <div className="component-loader">
                        <div></div>
                    </div>
                )}

                {!isLoading && users.length === 0 && (
                    <div className={styles.emptyTable}>
                        <span className={styles.emptyIcon}><InboxIcon size={48} color="#9ca3af" /></span>
                        <p>لا يوجد مستخدمين</p>
                    </div>
                )}
            </div>

            {/* Load more */}
            {!isLoading && hasMore && users.length > 0 && (
                <div className={styles.loadMoreWrapper}>
                    <button
                        className={styles.loadMoreBtn}
                        onClick={() => fetchUsers()}
                    >
                        تحميل المزيد
                    </button>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>إضافة مستخدم جديد</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowAddModal(false)}
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className={styles.modalBody}>
                            <p className={styles.modalDesc}>
                                سيتم إضافة المستخدم كمستخدم مُوثق مباشرة
                            </p>
                            <div className={styles.modalInputGroup}>
                                <label className={styles.modalLabel}>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className={styles.modalInput}
                                    required
                                    dir="ltr"
                                />
                            </div>

                            {addStatus.message && (
                                <div className={`${styles.statusMsg} ${addStatus.type === 'success' ? styles.statusMsgSuccess : styles.statusMsgError}`}>
                                    {addStatus.message}
                                </div>
                            )}

                            <div className={styles.modalActions}>
                                <button
                                    type="submit"
                                    className={styles.modalSubmitBtn}
                                    disabled={isAdding}
                                >
                                    {isAdding ? 'جاري الإضافة...' : 'إضافة المستخدم'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.modalCancelBtn}
                                    onClick={() => setShowAddModal(false)}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
