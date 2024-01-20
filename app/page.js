import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="text-container">
          <h1>
            خدمة إرسال آيات قرآنية عبر البريد الالكتروني
          </h1>
          <p>
            إشترك فى خدمتنا مجانا لتصلك بعض آيات القرآن بشكل دوري عبر بريدك الالكتروني
          </p>
          <div className="btns-container">
            <Link href="./subscribe/" className="primry-btn">
              اشترك الان
            </Link>
            <Link href="./contact/" className="secondary-btn">
              تواصل معنا
            </Link>
            {/* <a href="#quran-section" className="secondary-btn quran-btn">
              اقرأ القرآن
            </a> */}
          </div>
        </div>
      </section>
      <div className="attribute">
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
    </main>
  )
}
