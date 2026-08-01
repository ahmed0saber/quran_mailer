"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSession, removeSession } from "@/utils/session-storage";
import SendIcon from "@/app/components/icons/SendIcon";

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
      <p
        style={{ color: "#6b7280", fontSize: "0.92rem", marginBottom: "24px" }}
      >
        يمكنك من هنا إرسال الرسائل اليومية لجميع المشتركين بشكل يدوي. سيتم إرسال
        آية أو سورة عشوائية حسب إعدادات النظام.
      </p>

      {statusMessage && (
        <div
          style={{
            margin: "0 0 24px",
            padding: "12px 16px",
            backgroundColor: statusMessage.includes("بنجاح")
              ? "#ecfdf5"
              : "#fef2f2",
            color: statusMessage.includes("بنجاح") ? "#065f46" : "#991b1b",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 500,
            border: `1px solid ${statusMessage.includes("بنجاح") ? "#a7f3d0" : "#fecaca"}`,
          }}
        >
          {statusMessage}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "14px",
          boxShadow:
            "0 1px 4px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#eef2ff",
            color: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SendIcon size={32} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              color: "#1f2937",
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            إرسال الرسائل اليومية
          </h2>
          <p
            style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: "1.5" }}
          >
            سيتم إرسال بريد إلكتروني لجميع المشتركين المُوثقين يحتوي على المحتوى
            اليومي. قد تستغرق هذه العملية بعض الوقت حسب عدد المشتركين.
          </p>
        </div>

        <button
          onClick={triggerDailyNotify}
          className={isSubmitting ? "btn-dark is-loading" : "btn-dark"}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            marginTop: "8px",
          }}
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
