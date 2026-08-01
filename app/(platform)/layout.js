import Head from "next/head";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Quran Mailer",
  description:
    "Quran Mailer is an open-source quran mailing free service, where you can subscribe with your email address to recieve a quranic verse daily.",
};

export default function PlatformLayout({ children }) {
  return (
    <>
      <Head>
        <link rel="preload" href="/hero-section.webp" as="image" />
      </Head>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
