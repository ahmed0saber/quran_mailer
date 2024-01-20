export default function QuranSection() {
    return (
        <section className="quran-section" id="quran-section">
            <div className="quran-section-container"></div>
            <div className="quran-section-popup">
                <i className="close-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        className="w-5 h-5">
                        <path
                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </i>
                <div className="popup-content"></div>
            </div>
        </section>
    )
}
