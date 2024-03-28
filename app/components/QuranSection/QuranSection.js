'use client'

import { useEffect, useState } from 'react';
import './style.css';
import normalizeArabic from './arabic-normalizer';

export default function QuranSection() {
    const [surahs, setSurahs] = useState([]);
    const [selectedSurahContent, setSelectedSurahContent] = useState('');
    const [isPopupActive, setIsPopupActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const response = await fetch("/api/surahs");
                const jsonResponse = await response.json();
                setSurahs(jsonResponse);
            } catch (error) {
                console.error("Error fetching surahs:", error);
            }
        };

        fetchSurahs();
    }, []);

    const handleSurahClick = async (index) => {
        const SURAH_API_ENDPOINT = `https://api.alquran.cloud/v1/surah/${index + 1}`;
        try {
            const response = await fetch(SURAH_API_ENDPOINT);
            const jsonResponse = await response.json();
            const ayahs = jsonResponse.data.ayahs;

            if (index > 0) {
                ayahs[0].text = ayahs[0].text.replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ ", "")
            }

            const surahContent = ayahs.map(ayah =>
                `<span>${ayah.text.replace("\n", "")}</span><span class="ayah-number">${ayah.numberInSurah}</span>`
            ).join('');

            document.body.classList.add("quran-popup-disable-scroll");
            setSelectedSurahContent(surahContent);
            setIsPopupActive(true);
        } catch (error) {
            console.error("Error fetching surah details:", error);
        }
    };

    const closePopup = () => {
        setIsPopupActive(false);
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
            <div className={["quran-section-popup", isPopupActive && "active"].join(" ")}>
                <i className="close-icon" onClick={closePopup}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        className="w-5 h-5">
                        <path
                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </i>
                <div className="popup-content" dangerouslySetInnerHTML={{ __html: selectedSurahContent }}></div>
            </div>
        </section>
    )
}
