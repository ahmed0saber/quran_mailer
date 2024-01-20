import Link from "next/link";

export default function Navbar() {
    return (
        <header className="navbar">
            <h3>
                <Link href="/">
                    ذكرنى بالقرآن
                </Link>
            </h3>
            <nav>
                <Link href="/">
                    الرئيسية
                </Link>
                <Link href="/contact">
                    تواصل معنا
                </Link>
                <Link href="/subscribe">
                    اشترك الان
                </Link>
            </nav >
        </header >
    )
}