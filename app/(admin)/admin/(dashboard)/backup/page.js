"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, removeSession } from "@/utils/session-storage";
import DownloadIcon from "@/app/components/icons/DownloadIcon";
import UploadIcon from "@/app/components/icons/UploadIcon";
import styles from "./style.module.css";

export default function BackupPage() {
  const user = useRef(null);
  const router = useRouter();

  const [exportType, setExportType] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");

  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState({ type: "", message: "", details: "" });

  useEffect(() => {
    user.current = getSession({ key: "current-user", defaultValue: null });
    if (!user.current) {
      router.push("/admin");
    }
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus("");

    try {
      const res = await fetch(`/api/admin/backup?type=${exportType}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${exportType}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setExportStatus("تم تصدير البيانات بنجاح.");
      } else {
        if (res.status === 401) {
          removeSession("current-user");
          router.push("/admin");
        } else {
          setExportStatus("حدث خطأ أثناء تصدير البيانات.");
        }
      }
    } catch (error) {
      setExportStatus("تعذر الاتصال بالخادم.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    setIsImporting(true);
    setImportStatus({ type: "", message: "", details: "" });

    try {
      const fileText = await importFile.text();
      let payload;
      try {
        payload = JSON.parse(fileText);
      } catch (err) {
        setImportStatus({ type: "error", message: "الملف المحدد ليس بصيغة JSON صحيحة." });
        setIsImporting(false);
        return;
      }

      if (!payload.users && !payload.logs) {
        setImportStatus({ type: "error", message: "لا يحتوي الملف على بيانات صحيحة (المستخدمين أو السجلات)." });
        setIsImporting(false);
        return;
      }

      const res = await fetch(`/api/admin/backup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${user.current.username}:${user.current.password}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setImportStatus({ type: "success", message: data.message, details: data.details });
        setImportFile(null);
        e.target.reset(); // reset form
      } else {
        if (res.status === 401) {
          removeSession("current-user");
          router.push("/admin");
        } else {
          setImportStatus({ type: "error", message: data.error || "حدث خطأ أثناء استيراد البيانات." });
        }
      }
    } catch (error) {
      setImportStatus({ type: "error", message: "تعذر الاتصال بالخادم." });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Export Section */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <DownloadIcon size={24} />
          </div>
          <div>
            <h2 className={styles.cardTitle}>تصدير البيانات</h2>
            <p className={styles.description}>
              حفظ نسخة احتياطية من البيانات بصيغة JSON.
            </p>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>البيانات المراد تصديرها</label>
          <select
            className={styles.select}
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="all">الكل (المستخدمين والسجلات)</option>
            <option value="users">المستخدمين فقط</option>
            <option value="logs">السجلات فقط</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className={styles.submitBtn}
          disabled={isExporting}
        >
          {isExporting ? (
            "جاري التصدير..."
          ) : (
            <>
              <DownloadIcon size={18} /> تحميل النسخة الاحتياطية
            </>
          )}
        </button>

        {exportStatus && (
          <div
            className={`${styles.statusMsg} ${exportStatus.includes("بنجاح") ? styles.statusSuccess : styles.statusError}`}
          >
            {exportStatus}
          </div>
        )}
      </div>

      {/* Import Section */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrapper} ${styles.iconWrapperSuccess}`}>
            <UploadIcon size={24} />
          </div>
          <div>
            <h2 className={styles.cardTitle}>استيراد البيانات</h2>
            <p className={styles.description}>
              استعادة المستخدمين والسجلات من ملف JSON سابق.
            </p>
          </div>
        </div>

        <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>ملف النسخة الاحتياطية (.json)</label>
            <input
              type="file"
              accept=".json,application/json"
              className={styles.fileInput}
              onChange={(e) => setImportFile(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isImporting || !importFile}
            style={{ marginTop: 0 }}
          >
            {isImporting ? (
              "جاري الاستيراد..."
            ) : (
              <>
                <UploadIcon size={18} /> استيراد البيانات
              </>
            )}
          </button>
        </form>

        {importStatus.message && (
          <div
            className={`${styles.statusMsg} ${importStatus.type === "success" ? styles.statusSuccess : styles.statusError}`}
          >
            <p style={{ margin: 0 }}>{importStatus.message}</p>
            {importStatus.details && (
              <p style={{ margin: '4px 0 0', fontSize: '0.85em', opacity: 0.9 }}>
                {importStatus.details}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
