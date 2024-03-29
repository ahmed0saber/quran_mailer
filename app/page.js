import Link from "next/link";
import dynamic from 'next/dynamic';
import './style.css';

const QuranSection = dynamic(() => import('./components/QuranSection/QuranSection'), {
  loading: () => (
    <div className="component-loader">
      <div></div>
    </div>
  ),
  ssr: false
});

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <h1>
            خدمة إرسال آيات قرآنية عبر البريد الالكتروني
          </h1>
          <p>
            إشترك فى خدمتنا مجانا لتصلك بعض آيات القرآن بشكل دوري عبر بريدك الالكتروني
          </p>
          <div className="btns-container">
            <Link href="./subscribe/" className="btn-primary">
              اشترك الان
            </Link>
            <Link href="./contact/" className="btn-secondary">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
      <div className="attribute container">
        <p>
          صورة بواسطة
          <a target="_blank"
            href="https://unsplash.com/@grstocks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">GR
            Stocks</a>
          على
          <a target="_blank"
            href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        </p>
      </div>
      <QuranSection />
    </main>
  )
}
