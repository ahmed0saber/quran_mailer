"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { getSession, removeSession } from "@/utils/session-storage";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const skip = useRef(0);
  const user = useRef(getSession({ key: "current-user", defaultValue: null }));
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    if (!user.current) {
      return router.push("/admin");
    }

    getLogs({ signal: controller.signal });

    return () => {
      controller.abort({ message: "Component Unmounted!" });
    };
  }, []);

  const getLogs = async ({ signal }) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/logs?skip=${skip.current}`, {
        signal,
        headers: {
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.logs.length === 0) {
          setIsDone(true);
          return;
        }

        setLogs((prev) => [...prev, ...data.logs]);
        skip.current = data.skip;
      } else {
        if (res.status === 401) {
          console.error("Authorization failed: Invalid username or password");
          removeSession("current-user");
          router.push("/admin");
        } else {
          console.error("An error occurred:", res.status);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <p className={styles.subtitle}>
        هنا يمكنك متابعة التقريرات الخاصة بالدوال التى تعمل على الخادم
      </p>
      <div className={styles.tableWrapper}>
        <table className={styles.logsTable}>
          <thead>
            <tr>
              <th>الخدمة</th>
              <th>التاريخ</th>
              <th>المستوى</th>
              <th>الرسالة</th>
              <th>عدد المشتركين</th>
              <th>الوقت الكلي</th>
              <th>وقت جلب المشتركين</th>
              <th>وقت إرسال الرسائل</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.service}</td>
                <td>
                  <span className={styles.logDate}>{log.date}</span>
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${log.level === "error" ? styles.statusError : styles.statusInfo}`}
                  >
                    {log.level === "error" ? "خطأ" : "معلومة"}
                  </span>
                </td>
                <td>{log.message}</td>
                <td>{log.subscribersCount}</td>
                <td>{log.totalTimeTaken}</td>
                <td>{log.getSubscribersTimeTaken}</td>
                <td>{log.sendEmailsTimeTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && (
        <div className="component-loader">
          <div></div>
        </div>
      )}
      {isLoading | (logs.length === 0) | isDone ? null : (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreBtn} onClick={getLogs}>
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
}
