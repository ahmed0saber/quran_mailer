"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getSession, removeSession } from "@/utils/session-storage";
import SendIcon from "@/app/components/icons/SendIcon";
import styles from "./style.module.css";

export default function BroadcastPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();
  const user = useRef(getSession({ key: "current-user", defaultValue: null }));
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!user.current) {
      return router.push("/admin");
    }
  }, []);

  const sendBroadcast = async ({ subject, message }) => {
    setStatusMessage("");
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
        body: JSON.stringify({ subject, message }),
      });

      if (res.ok) {
        setStatusMessage("تم إرسال الإشعار بنجاح");
        reset();
      } else {
        if (res.status === 401) {
          removeSession("current-user");
          router.push("/admin");
        } else {
          setStatusMessage("حدث خطأ أثناء إرسال الإشعار");
        }
      }
    } catch (error) {
      setStatusMessage("تعذر الاتصال بالخادم");
    }
  };

  return (
    <div className={styles.card}>
      <p className={styles.subtitle}>
        قم بإرسال رسالة بريد إلكتروني لجميع المشتركين
      </p>

      {statusMessage && (
        <div
          className={`${styles.statusMsg} ${statusMessage.includes("بنجاح") ? styles.statusSuccess : styles.statusError}`}
        >
          {statusMessage}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={
          isSubmitting ? (e) => e.preventDefault() : handleSubmit(sendBroadcast)
        }
      >
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="موضوع الرسالة"
            className={styles.input}
            {...register("subject", { required: true })}
          />
        </div>
        <div className={styles.inputGroup}>
          <textarea
            placeholder="محتوى الرسالة"
            className={styles.input}
            rows="6"
            style={{ resize: "vertical" }}
            {...register("message", { required: true })}
          />
        </div>
        <button className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? (
            "جاري الإرسال..."
          ) : (
            <>
              <SendIcon size={18} /> إرسال الإشعار
            </>
          )}
        </button>
      </form>
    </div>
  );
}
