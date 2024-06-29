'use client'

import { useEffect, useState } from 'react';
import normalizeArabic from './arabic-normalizer';
import Ayah from './components/Ayah';
import './style.css';

export default function QuranSection() {
    const [surahs, setSurahs] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const response = await fetch("/api/surahs");
                const data = await response.json();
                setSurahs(data);
            } catch (error) {
                console.error("Error fetching surahs:", error);
            }
        };

        fetchSurahs();
    }, []);

    const handleSurahClick = async (index) => {
        const SURAH_API_ENDPOINT = `/api/surah-ayahs/${index + 1}`;
        try {
            const response = await fetch(SURAH_API_ENDPOINT);
            const data = await response.json();

            if (index > 0) {
                data.ayahs[0].text = data.ayahs[0].text.replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ ", "")
            }

            document.body.classList.add("quran-popup-disable-scroll");
            setSelectedSurah(data);
        } catch (error) {
            console.error("Error fetching surah details:", error);
        }
    };

    const closePopup = () => {
        setSelectedSurah(null);
        document.body.classList.remove("quran-popup-disable-scroll");
    };

    useEffect(() => {
        return () => closePopup()
    }, [])

    return (
        <section className="quran-section container">
            <input
                type='search'
                name='search'
                placeholder='هل تبحث عن سورة محددة؟ (اكتبها هنا)'
                className='form-input'
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="quran-section-container">
                {surahs.map((surah, index) => (
                    normalizeArabic(surah.name).includes(normalizeArabic(searchQuery)) && (
                        <button key={surah.number} className="surah-card" onClick={() => handleSurahClick(index)}>
                            <h2>{surah.name}</h2>
                        </button>
                    )
                ))}
            </div>
            <div className={["quran-section-popup", selectedSurah && "active"].join(" ")}>
                <div className="modal-icons">
                    <i className="modal-icon" onClick={closePopup}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            className="w-5 h-5">
                            <path
                                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </i>
                    <i className="modal-icon" onClick={window.print}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                        </svg>
                    </i>
                </div>
                {selectedSurah ? (
                    <div className="popup-content">
                        <div class="surah-name">
                            <h2>{selectedSurah.name}</h2>
                        </div>
                        {selectedSurah.ayahs.map(ayah => <Ayah ayah={ayah} />)}
                    </div>
                ) : null}
            </div>
        </section>
    )
}
