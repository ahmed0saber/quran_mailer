"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, removeSession } from "@/utils/session-storage";
import UsersIcon from "@/app/components/icons/UsersIcon";
import CheckCircleIcon from "@/app/components/icons/CheckCircleIcon";
import ClockIcon from "@/app/components/icons/ClockIcon";
import FileTextIcon from "@/app/components/icons/FileTextIcon";
import styles from "./style.module.css";

export default function AdminHomePage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useRef(getSession({ key: "current-user", defaultValue: null }));
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    if (!user.current) {
      return router.push("/admin");
    }

    fetchDashboard({ signal: controller.signal });

    return () => controller.abort({ message: "Component Unmounted!" });
  }, []);

  const fetchDashboard = async ({ signal } = {}) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard", {
        signal,
        headers: {
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else if (res.status === 401) {
        removeSession("current-user");
        router.push("/admin");
      }
    } catch (error) {
      if (error?.message !== "Component Unmounted!") {
        console.error("Dashboard fetch error:", error);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="component-loader">
        <div></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.emptyState}>
        <p>تعذر تحميل البيانات</p>
        <button className="btn-dark" onClick={() => fetchDashboard()}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statTotal}`}>
          <div className={styles.statIcon}>
            <UsersIcon size={24} color="#6366f1" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.totalUsers}</span>
            <span className={styles.statLabel}>إجمالي المستخدمين</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statVerified}`}>
          <div className={styles.statIcon}>
            <CheckCircleIcon size={24} color="#10b981" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.verifiedUsers}</span>
            <span className={styles.statLabel}>مستخدمين مُوثقين</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statUnverified}`}>
          <div className={styles.statIcon}>
            <ClockIcon size={24} color="#f59e0b" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.unverifiedUsers}</span>
            <span className={styles.statLabel}>بانتظار التوثيق</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statLogs}`}>
          <div className={styles.statIcon}>
            <FileTextIcon size={24} color="#3b82f6" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.totalLogs}</span>
            <span className={styles.statLabel}>إجمالي السجلات</span>
          </div>
        </div>
      </div>

      {/* Recent Sections */}
      <div className={styles.sectionsGrid}>
        {/* Last 3 Verified Users */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>آخر المستخدمين المُوثقين</h2>
            <button
              className={styles.viewAllBtn}
              onClick={() => router.push("/admin/users")}
            >
              عرض الكل ←
            </button>
          </div>
          <div className={styles.sectionBody}>
            {data.lastVerifiedUsers.length === 0 ? (
              <p className={styles.emptyText}>لا يوجد مستخدمين مُوثقين</p>
            ) : (
              data.lastVerifiedUsers.map((user, index) => (
                <div key={index} className={styles.userItem}>
                  <div className={styles.userAvatar}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userEmail}>{user.email}</span>
                  <span className={`${styles.badge} ${styles.badgeVerified}`}>
                    مُوثق
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Last 3 Unverified Users */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              آخر المستخدمين بانتظار التوثيق
            </h2>
            <button
              className={styles.viewAllBtn}
              onClick={() => router.push("/admin/users")}
            >
              عرض الكل ←
            </button>
          </div>
          <div className={styles.sectionBody}>
            {data.lastUnverifiedUsers.length === 0 ? (
              <p className={styles.emptyText}>
                لا يوجد مستخدمين بانتظار التوثيق
              </p>
            ) : (
              data.lastUnverifiedUsers.map((user, index) => (
                <div key={index} className={styles.userItem}>
                  <div
                    className={`${styles.userAvatar} ${styles.userAvatarUnverified}`}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userEmail}>{user.email}</span>
                  <span className={`${styles.badge} ${styles.badgeUnverified}`}>
                    بانتظار التوثيق
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Last 3 Logs */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>آخر السجلات</h2>
            <button
              className={styles.viewAllBtn}
              onClick={() => router.push("/admin/logs")}
            >
              عرض الكل ←
            </button>
          </div>
          <div className={styles.sectionBody}>
            {data.lastLogs.length === 0 ? (
              <p className={styles.emptyText}>لا توجد سجلات</p>
            ) : (
              data.lastLogs.map((log, index) => (
                <div key={index} className={styles.logItem}>
                  <div className={styles.logTop}>
                    <span
                      className={`${styles.logLevel} ${log.level === "error" ? styles.logLevelError : styles.logLevelInfo}`}
                    >
                      {log.level}
                    </span>
                    <span className={styles.logService}>{log.service}</span>
                  </div>
                  <p className={styles.logMessage}>{log.message}</p>
                  <span className={styles.logDate}>{log.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
