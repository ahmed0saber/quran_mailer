"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSession, removeSession } from "@/utils/session-storage";
import HomeIcon from "@/app/components/icons/HomeIcon";
import UsersIcon from "@/app/components/icons/UsersIcon";
import LogsIcon from "@/app/components/icons/LogsIcon";
import MailIcon from "@/app/components/icons/MailIcon";
import SendIcon from "@/app/components/icons/SendIcon";
import LogoutIcon from "@/app/components/icons/LogoutIcon";
import CloseIcon from "@/app/components/icons/CloseIcon";
import MenuIcon from "@/app/components/icons/MenuIcon";
import styles from "./style.module.css";

const navLinks = [
  { href: "/admin/home", label: "الرئيسية", Icon: HomeIcon },
  { href: "/admin/users", label: "المستخدمين", Icon: UsersIcon },
  { href: "/admin/logs", label: "السجلات", Icon: LogsIcon },
  { href: "/admin/broadcast", label: "الإشعارات", Icon: MailIcon },
  { href: "/admin/daily", label: "الرسائل اليومية", Icon: SendIcon },
];

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    user.current = getSession({ key: "current-user", defaultValue: null });
    setIsMounted(true);
    if (!user.current) {
      router.push("/admin");
    }
  }, []);

  const logout = () => {
    removeSession("current-user");
    router.push("/admin");
  };

  const handleNavClick = (href) => {
    router.push(href);
    setSidebarOpen(false);
  };

  if (!isMounted)
    return (
      <div
        className="component-loader"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div></div>
      </div>
    );

  if (!user.current) return null;

  return (
    <div className={styles.dashboardWrapper}>
      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>لوحة التحكم</h2>
          <button
            className={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
              onClick={() => handleNavClick(link.href)}
            >
              <span className={styles.navIcon}>
                <link.Icon size={19} />
              </span>
              <span className={styles.navLabel}>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={logout}>
            <span className={styles.navIcon}>
              <LogoutIcon size={19} />
            </span>
            <span className={styles.navLabel}>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
          >
            <MenuIcon size={22} color="#374151" />
          </button>
          <h1 className={styles.pageTitle}>
            {navLinks.find((l) => l.href === pathname)?.label || "لوحة التحكم"}
          </h1>
        </header>
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
