"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getSession, removeSession } from "@/utils/session-storage";
import SearchIcon from "@/app/components/icons/SearchIcon";
import SendIcon from "@/app/components/icons/SendIcon";
import CloseIcon from "@/app/components/icons/CloseIcon";
import styles from "./style.module.css";

function TargetedMessageContent() {
  // User Selection State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const skipRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Selected Recipients State
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Form State
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const user = useRef(null);
  const router = useRouter();
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    user.current = getSession({ key: "current-user", defaultValue: null });
    if (!user.current) {
      router.push("/admin");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    skipRef.current = 0;
    setUsers([]);
    setHasMore(true);
    fetchUsers({ signal: controller.signal, reset: true });
    return () => controller.abort({ message: "Component Unmounted!" });
  }, [filter, search]);

  const fetchUsers = async ({ signal, reset = false } = {}) => {
    setIsLoading(true);
    try {
      const currentSkip = reset ? 0 : skipRef.current;
      const params = new URLSearchParams({
        filter,
        search,
        skip: currentSkip.toString(),
      });

      const res = await fetch(`/api/admin/users?${params}`, {
        signal,
        headers: {
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.subscribers.length === 0) {
          setHasMore(false);
        } else {
          if (reset) {
            setUsers(data.subscribers);
          } else {
            setUsers((prev) => [...prev, ...data.subscribers]);
          }
          skipRef.current = data.skip;
          setHasMore(data.subscribers.length >= 20);
        }
      } else if (res.status === 401) {
        removeSession("current-user");
        router.push("/admin");
      }
    } catch (error) {
      if (error?.message !== "Component Unmounted!") {
        console.error("Users fetch error:", error);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleSearchInput = useCallback((value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 400);
  }, []);

  const toggleUserSelection = (email) => {
    setSelectedEmails((prev) => 
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const removeRecipient = (email) => {
    setSelectedEmails((prev) => prev.filter((e) => e !== email));
  };

  const toggleSelectAllPage = (e) => {
    const isChecked = e.target.checked;
    const pageEmails = users.map((u) => u.email);
    
    if (isChecked) {
      const newEmails = [...selectedEmails];
      pageEmails.forEach((email) => {
        if (!newEmails.includes(email)) newEmails.push(email);
      });
      setSelectedEmails(newEmails);
    } else {
      setSelectedEmails((prev) => prev.filter((email) => !pageEmails.includes(email)));
    }
  };

  const isAllPageSelected = users.length > 0 && users.every((u) => selectedEmails.includes(u.email));

  const sendTargetedMessage = async ({ subject, message }) => {
    if (selectedEmails.length === 0) {
      setStatusMessage({ type: "error", text: "الرجاء تحديد مستخدم واحد على الأقل" });
      return;
    }

    setStatusMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/targeted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
        body: JSON.stringify({ subject, message, emails: selectedEmails }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatusMessage({ type: "success", text: data.message });
        reset();
        setSelectedEmails([]);
      } else {
        if (res.status === 401) {
          removeSession("current-user");
          router.push("/admin");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatusMessage({ type: "error", text: data.error || "حدث خطأ أثناء الإرسال" });
        }
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "تعذر الاتصال بالخادم" });
    }
  };

  return (
    <div className={styles.container}>
      {/* Users Selection Column */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>المستخدمين</h2>
        <p className={styles.subtitle}>اختر المستخدمين الذين تود إرسال الرسالة إليهم</p>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <SearchIcon color="#9ca3af" size={20} />
            <input
              type="text"
              placeholder="ابحث بالبريد الإلكتروني..."
              className={styles.searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="verified">المُوثقين فقط</option>
            <option value="unverified">بانتظار التوثيق</option>
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={isAllPageSelected}
                    onChange={toggleSelectAllPage}
                  />
                </th>
                <th>البريد الإلكتروني</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td className={styles.checkboxCell}>
                    <input 
                      type="checkbox" 
                      checked={selectedEmails.includes(u.email)}
                      onChange={() => toggleUserSelection(u.email)}
                    />
                  </td>
                  <td dir="ltr" style={{ textAlign: "right" }}>{u.email}</td>
                  <td>
                    {u.isValid ? (
                      <span className={`${styles.badge} ${styles.badgeVerified}`}>مُوثق</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeUnverified}`}>غير مُوثق</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "#6b7280" }}>
                    لا يوجد مستخدمين
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>جاري التحميل...</div>
        )}

        {hasMore && !isLoading && (
          <button
            className={styles.loadMoreBtn}
            onClick={() => fetchUsers()}
          >
            تحميل المزيد
          </button>
        )}
      </div>

      {/* Message Composer Column */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>إنشاء الرسالة</h2>
        
        <label className={styles.label} style={{ marginBottom: "8px", display: "block" }}>
          المستلمون ({selectedEmails.length})
        </label>
        <div className={styles.recipientsContainer}>
          {selectedEmails.length === 0 ? (
            <div className={styles.emptyRecipients}>لم يتم تحديد أي مستخدم</div>
          ) : (
            selectedEmails.map((email) => (
              <span key={email} className={styles.recipientTag}>
                {email}
                <button 
                  type="button" 
                  className={styles.removeRecipient} 
                  onClick={() => removeRecipient(email)}
                >
                  <CloseIcon size={14} />
                </button>
              </span>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit(sendTargetedMessage)}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="subject">
              موضوع الرسالة
            </label>
            <input
              id="subject"
              type="text"
              required
              placeholder="أدخل موضوع الرسالة..."
              className={styles.input}
              {...register("subject")}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="message">
              محتوى الرسالة
            </label>
            <textarea
              id="message"
              required
              placeholder="اكتب رسالتك هنا..."
              className={styles.textarea}
              {...register("message")}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting || selectedEmails.length === 0}
          >
            {isSubmitting ? (
              "جاري الإرسال..."
            ) : (
              <>
                <SendIcon size={18} /> إرسال الرسالة
              </>
            )}
          </button>
        </form>

        {statusMessage.text && (
          <div
            className={`${styles.statusMessage} ${
              statusMessage.type === "success"
                ? styles.statusSuccess
                : styles.statusError
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TargetedMessagePage() {
  return (
    <Suspense fallback={<div className="component-loader"><div></div></div>}>
      <TargetedMessageContent />
    </Suspense>
  );
}
