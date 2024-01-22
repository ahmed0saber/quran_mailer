'use client'

import { useEffect, useState } from 'react';
import './style.css';

export default function QuranSection() {
    const [surahs, setSurahs] = useState([]);
    const [selectedSurahContent, setSelectedSurahContent] = useState('');
    const [isPopupActive, setIsPopupActive] = useState(false);

    useEffect(() => {
        const fetchSurahs = async () => {
            const API_URL = "https://api.alquran.cloud/v1/meta";
            try {
                const response = await fetch(API_URL);
                const jsonResponse = await response.json();
                setSurahs(jsonResponse.data.surahs.references);
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
            const surahContent = ayahs.map(ayah =>
                `<span>${ayah.text}</span><span class="ayah-number">${ayah.numberInSurah}</span>`
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
        <section className="quran-section" id="quran-section">
            <div className="quran-section-container">
                {surahs.map((surah, index) => (
                    <div key={surah.number} className="surah-card" onClick={() => handleSurahClick(index)}>
                        <h2>{surah.name}</h2>
                    </div>
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
