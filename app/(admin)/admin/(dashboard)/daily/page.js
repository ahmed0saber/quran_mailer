"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSession, removeSession } from "@/utils/session-storage";
import SendIcon from "@/app/components/icons/SendIcon";
import styles from "./style.module.css";

export default function DailyNotifyPage() {
  const user = useRef(null);
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    user.current = getSession({ key: "current-user", defaultValue: null });
    if (!user.current) {
      router.push("/admin");
    }
  }, []);

  const triggerDailyNotify = async () => {
    if (
      !confirm(
        "هل أنت متأكد من رغبتك في إرسال الرسائل اليومية لجميع المشتركين الآن؟",
      )
    )
      return;

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/admin/trigger-daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatusMessage(data.message || "تم إرسال الرسائل اليومية بنجاح");
      } else {
        if (res.status === 401) {
          removeSession("current-user");
          router.push("/admin");
        } else {
          setStatusMessage(data.error || "حدث خطأ أثناء إرسال الرسائل اليومية");
        }
      }
    } catch (error) {
      setStatusMessage("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className={styles.subtitle}>
        يمكنك من هنا إرسال الرسائل اليومية لجميع المشتركين بشكل يدوي. سيتم إرسال
        آية أو سورة عشوائية حسب إعدادات النظام.
      </p>

      {statusMessage && (
        <div
          className={`${styles.statusMsg} ${statusMessage.includes("بنجاح") ? styles.statusSuccess : styles.statusError}`}
        >
          {statusMessage}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <SendIcon size={32} />
        </div>

        <div className={styles.textCenter}>
          <h2 className={styles.title}>إرسال الرسائل اليومية</h2>
          <p className={styles.description}>
            سيتم إرسال بريد إلكتروني لجميع المشتركين المُوثقين يحتوي على المحتوى
            اليومي. قد تستغرق هذه العملية بعض الوقت حسب عدد المشتركين.
          </p>
        </div>

        <button
          onClick={triggerDailyNotify}
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "جاري الإرسال..."
          ) : (
            <>
              <SendIcon size={18} /> إرسال الآن
            </>
          )}
        </button>
      </div>
    </div>
  );
}
