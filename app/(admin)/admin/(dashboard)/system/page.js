"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, removeSession } from "@/utils/session-storage";
import TrashIcon from "@/app/components/icons/TrashIcon";
import styles from "./style.module.css";

export default function SystemSettingsPage() {
  const user = useRef(null);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "", details: "" });

  useEffect(() => {
    user.current = getSession({ key: "current-user", defaultValue: null });
    if (!user.current) {
      router.push("/admin");
    }
  }, []);

  const handleDelete = async (target, label) => {
    const isConfirmed = window.confirm(
      `تحذير: أنت على وشك مسح ${label} نهائياً.\nهل أنت متأكد من هذا الإجراء؟ لا يمكن التراجع عنه.`
    );

    if (!isConfirmed) return;

    setIsDeleting(true);
    setStatus({ type: "", message: "", details: "" });

    try {
      const res = await fetch(`/api/admin/system?target=${target}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ type: "success", message: data.message, details: data.details });
      } else {
        if (res.status === 401) {
          removeSession("current-user");
          router.push("/admin");
        } else {
          setStatus({ type: "error", message: data.error || "حدث خطأ أثناء مسح البيانات." });
        }
      }
    } catch (error) {
      setStatus({ type: "error", message: "تعذر الاتصال بالخادم." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <TrashIcon size={24} />
          </div>
          <div>
            <h2 className={styles.cardTitle}>إعادة ضبط النظام</h2>
            <p className={styles.description}>
              تتيح لك هذه الإعدادات مسح بيانات النظام نهائياً. يرجى توخي الحذر الشديد عند استخدام هذه الخيارات.
            </p>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <button
            onClick={() => handleDelete("users", "جميع المستخدمين")}
            className={styles.dangerBtn}
            disabled={isDeleting}
          >
            <TrashIcon size={18} /> مسح جميع المستخدمين
          </button>
          
          <button
            onClick={() => handleDelete("logs", "جميع السجلات")}
            className={styles.dangerBtn}
            disabled={isDeleting}
          >
            <TrashIcon size={18} /> مسح جميع السجلات
          </button>

          <button
            onClick={() => handleDelete("all", "كافة بيانات النظام (المستخدمين والسجلات)")}
            className={`${styles.dangerBtn} ${styles.dangerBtnSolid}`}
            disabled={isDeleting}
          >
            <TrashIcon size={18} /> إعادة ضبط النظام بالكامل
          </button>
        </div>

        {status.message && (
          <div
            className={`${styles.statusMsg} ${status.type === "success" ? styles.statusSuccess : styles.statusError}`}
          >
            <p style={{ margin: 0 }}>{status.message}</p>
            {status.details && (
              <p style={{ margin: '4px 0 0', fontSize: '0.85em', opacity: 0.9 }}>
                {status.details}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
