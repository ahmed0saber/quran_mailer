'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname()

    return (
        <header className="navbar">
            <h3>
                <Link href="/">
                    ذكرنى بالقرآن
                </Link>
            </h3>
            <nav>
                <Link href="/" className={pathname === "/" ? "active" : ""}>
                    الرئيسية
                </Link>
                <Link href="/contact" className={pathname === "/contact" ? "active" : ""}>
                    تواصل معنا
                </Link>
                <Link href="/subscribe" className={pathname === "/subscribe" ? "active" : ""}>
                    اشترك الان
                </Link>
            </nav >
        </header >
    )
}