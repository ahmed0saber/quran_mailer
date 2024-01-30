import Footer from './components/Footer'
import Navbar from './components/Navbar'
import './globals.css'
import localFont from 'next/font/local'

const Cairo_Arabic_Font = localFont({
  src: './fonts/Cairo-Regular.ttf',
  display: 'swap',
})

export const metadata = {
  title: 'Quran Mailer',
  description: 'Quran Mailer is an open-source quran mailing free service, where you can subscribe with your email address to recieve a quranic verse daily.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body className={Cairo_Arabic_Font.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
